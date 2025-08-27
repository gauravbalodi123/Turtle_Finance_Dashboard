const axios = require('axios');
const mongoose = require('mongoose');
require('dotenv').config();
const Bookings = require('../models/booking');

const calendlyApi = axios.create({
    baseURL: 'https://api.calendly.com',
    headers: {
        Authorization: `Bearer eyJraWQiOiIxY2UxZTEzNjE3ZGNmNzY2YjNjZWJjY2Y4ZGM1YmFmYThhNjVlNjg0MDIzZjdjMzJiZTgzNDliMjM4MDEzNWI0IiwidHlwIjoiUEFUIiwiYWxnIjoiRVMyNTYifQ.eyJpc3MiOiJodHRwczovL2F1dGguY2FsZW5kbHkuY29tIiwiaWF0IjoxNzQ3NjA2NDc0LCJqdGkiOiIzOWM5MDRmNS1iNjQzLTRkNDEtOTk4My00ODJiYjkzNTRjZGUiLCJ1c2VyX3V1aWQiOiI5NzRhZTY0MC03ZGI2LTRhMDEtYWRhYi0xZDg3NWVlNWEwMTAifQ.1BEcFGUbEySHDxlCicvWSAAspB5J2wwdEZvPTpcU3W7c-fxmYO4xjOKHTC3BWSSta4OByvG-O5SHmvQkDuC7Tw`
    }
});

const BATCH_LIMIT = 20;
const DELAY_MS = 300; // short delay to be safe with rate limits

// Sleep utility
const sleep = (ms) => new Promise((res) => setTimeout(res, ms));

// Recursive fetch with pagination
async function fetchAllScheduledEvents(organizationUri, collected = [], nextPage = null) {
    const params = nextPage
        ? {} // No params if we're following next_page link
        : { organization: organizationUri }; // Initial request only

    const url = nextPage || '/scheduled_events';
    const response = await calendlyApi.get(url, { params });

    collected.push(...response.data.collection);

    const nextPageUrl = response.data.pagination?.next_page;
    if (nextPageUrl) {
        const relativePath = new URL(nextPageUrl).pathname + new URL(nextPageUrl).search;
        return fetchAllScheduledEvents(organizationUri, collected, relativePath);
    }

    return collected;
}


// Enrichment logic (same as webhook)
async function processEvent(eventData) {
    const eventUUID = eventData.uri?.split('/').pop();
    try {
        // Skip if already exists
        const exists = await Bookings.findOne({ uri: eventData.uri });
        if (exists) {
            console.log(`⚠️  Already exists: ${eventUUID}`);
            return;
        }

        // Fetch invitee
        const inviteeRes = await calendlyApi.get(`${eventData.uri}/invitees`);
        const inviteeData = inviteeRes.data.collection[0];

        // Rename timestamps
        eventData.created_at_timeline = eventData.created_at;
        eventData.updated_at_timeline = eventData.updated_at;
        delete eventData.created_at;
        delete eventData.updated_at;

        const [firstName, ...restName] = inviteeData?.name?.trim().split(' ') || [];
        const lastName = restName.join(' ');

        const questionsAndAnswers = inviteeData?.questions_and_answers || [];
        for (const qa of questionsAndAnswers) {
            if (qa.question === "Phone Number" && typeof qa.answer === "string") {
                const phoneMatch = qa.answer.trim().match(/^(\+\d{1,4})\s*(.+)$/);
                if (phoneMatch) {
                    qa.countryCode = phoneMatch[1];
                    qa.phoneNumber = phoneMatch[2].replace(/\s+/g, '');
                }
            }
        }

        const recentEvents = await Bookings.find({}).sort({ createdAt: -1 }).limit(2);
        const transformedStatus = determineStatus(eventData, recentEvents);

        const enrichedEvent = {
            ...eventData,
            invitee: {
                email: inviteeData?.email || null,
                fullName: inviteeData?.name || null,
                firstName,
                lastName,
                cancelUrl: inviteeData?.cancel_url || null,
                rescheduleUrl: inviteeData?.reschedule_url || null,
                questionsAndAnswers,
            },
            status: transformedStatus,
            backfillStatus: "success",
        };

        await Bookings.create(enrichedEvent);
        console.log(`✅ Saved: ${eventUUID}`);
    } catch (err) {
        console.error(`❌ Error processing ${eventUUID}:`, err?.response?.data || err.message);

        try {
            await Bookings.create({
                uri: eventData.uri,
                backfillStatus: "error",
                errorMessage: err.message || 'Unknown error'
            });
        } catch (insertErr) {
            console.error(`❌ Failed to log error for ${eventUUID}:`, insertErr.message);
        }
    }
}

function determineStatus(eventData, existingEvents = []) {
    const now = new Date();
    const start = new Date(eventData.start_time);
    const end = new Date(eventData.end_time);
    const externalId = eventData.calendar_event?.external_id;
    const rawStatus = eventData.status;

    if (rawStatus === "canceled") return "canceled";

    if (rawStatus === "active") {
        const wasRecentlyCanceled = existingEvents.find(
            ev => ev.calendar_event?.external_id === externalId && ev.status === "canceled"
        );
        if (wasRecentlyCanceled) return "rescheduled";

        if (start > now) return "upcoming";
        if (end < now) return "completed";

        return "active";
    }

    return rawStatus;
}

async function run() {
    try {
        await mongoose.connect("mongodb+srv://Gaurav:SFZJlOsXIpC6CDYt@cluster0.gt8apq8.mongodb.net/turtle-finance-db?retryWrites=true&w=majority&appName=Cluster0");
        console.log("✅ Connected to MongoDB");

        const userRes = await calendlyApi.get('/users/me');
        const organizationUri = userRes.data.resource.current_organization;

        console.log("⏳ Fetching scheduled events...");
        const allEvents = await fetchAllScheduledEvents(organizationUri);
        console.log(`📦 Total events to process: ${allEvents.length}`);

        for (let i = 0; i < allEvents.length; i += BATCH_LIMIT) {
            const batch = allEvents.slice(i, i + BATCH_LIMIT);
            console.log(`🚀 Processing batch ${i / BATCH_LIMIT + 1}...`);

            for (const event of batch) {
                await processEvent(event);
                await sleep(DELAY_MS);
            }

            console.log(`✅ Finished batch ${i / BATCH_LIMIT + 1}`);
        }

        console.log("🎉 All events processed");
        mongoose.connection.close();
    } catch (err) {
        console.error("❌ Script failed:", err.response?.data || err.message);
        mongoose.connection.close();
    }
}

run();
