const express = require('express');
const axios = require('axios');
const router = express.Router();
const Bookings = require('../models/booking');
const Advisor = require('../models/advisor');
const Client = require('../models/client');
require('dotenv').config();

const calendlyApi = axios.create({
    baseURL: 'https://api.calendly.com',
    headers: {
        Authorization: `Bearer ${process.env.CALENDLY_TOKEN}`
    }
});

const allowedNames = [
    "karma conversation",
    "kick-off conversation",
    "itr filing | kick-off conversation",
    "first conversation with turtle"
];

router.post('/webhook', async (req, res) => {
    const eventType = req.body.event;
    const payload = req.body.payload;

    const scheduledEventUri = payload?.scheduled_event?.uri;
    const match = scheduledEventUri?.match(/scheduled_events\/([^/]+)/);
    const scheduledEventUUID = match ? match[1] : null;

    if (!scheduledEventUUID) {
        console.log("❌ UUID not found from payload.scheduled_event.uri:", scheduledEventUri);
        return res.status(400).json({ error: 'Invalid payload - UUID not found' });
    }

    try {
        console.log("🔁 Fetching event data for UUID:", scheduledEventUUID);

        const eventRes = await calendlyApi.get(`/scheduled_events/${scheduledEventUUID}`);
        const eventData = eventRes.data.resource;

        // console.log("✅ Event Data:", eventData);

        const inviteeRes = await calendlyApi.get(`${eventData.uri}/invitees`);
        const inviteeData = inviteeRes.data.collection[0];

        if (!inviteeData) {
            console.log("❌ No invitee data found.");
            return res.status(400).json({ error: 'No invitee data found' });
        }

        eventData.created_at_timeline = eventData.created_at;
        eventData.updated_at_timeline = eventData.updated_at;
        delete eventData.created_at;
        delete eventData.updated_at;

        const [firstName, ...restName] = inviteeData?.name?.trim().split(' ') || [];
        const lastName = restName.join(' ');

        const recentEvents = await Bookings.find({}).sort({ createdAt: -1 }).limit(2);
        const transformedStatus = determineStatus(eventData, recentEvents);

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

        const normalizedName = (eventData?.name || '').toLowerCase();

        if (!allowedNames.includes(normalizedName)) {
            const inviteeEmail = inviteeData?.email?.trim().toLowerCase();
            if (inviteeEmail) {
                const matchedClient = await Client.findOne({ email: inviteeEmail }).select('_id');
                if (matchedClient) {
                    console.log(`✅ Invitee email found in client collection: ${inviteeEmail}`);
                    // Do nothing
                } else {
                    console.log(`❌ Invitee email NOT found in client collection: ${inviteeEmail}. Clearing email.`);
                    inviteeData.email = ''; // Set to empty string if not found
                }
            } else {
                console.log(`⚠️ Invitee email is empty or invalid.`);
                inviteeData.email = '';
            }
        }

        // 🔍 Event guests
        const eventGuests = eventData.event_guests || [];
        const guestEmails = eventGuests.map(guest => guest.email).filter(Boolean);

        if (guestEmails.length === 0) {
            console.log("⚠️ No guest emails found to match with advisors.");
        }

        const advisorsFromGuests = await Advisor.find({ email: { $in: guestEmails } }).select('_id email');
        let advisors = advisorsFromGuests.map(a => a._id);

        // 🧠 Backfill from eventName if no advisors found from event_guests
        if (advisors.length === 0) {
            const normalizedEventName = (eventData?.name || '').trim().toLowerCase();
            const matchedByEventName = await Advisor.find({
                eventName: { $elemMatch: { $regex: new RegExp(`^${normalizedEventName}$`, 'i') } }
            }).select('_id email eventName');

            if (matchedByEventName.length > 0) {
                advisors = matchedByEventName.map(a => a._id);
                console.log(`✅ Backfilled advisors from event name "${eventData?.name}" →`, advisors);
            } else {
                console.log(`⚠️ No advisor matched for event name: "${eventData?.name}"`);
            }
        }


        console.log("🧠 Matching Advisors Found:", advisors);

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
            advisors,
            status: transformedStatus,
        };


        console.log("🧾 Final Enriched Event Saved:\n", JSON.stringify(enrichedEvent, null, 2));
        await Bookings.create(enrichedEvent);

        return res.status(200).json({ message: 'Enriched event data saved with advisors' });

    } catch (error) {
        console.error('❌ Error saving enriched event:', error?.response?.data || error.message);
        return res.status(500).json({ error: 'Failed to fetch/save enriched scheduled event data' });
    }
});


function determineStatus(eventData, existingEvents = []) {
    const now = new Date();
    const start = new Date(eventData.start_time);
    const end = new Date(eventData.end_time);
    const externalId = eventData.calendar_event?.external_id;
    const rawStatus = eventData.status;

    if (rawStatus === "canceled") {
        return "canceled";
    }

    if (rawStatus === "active") {
        // Check if a recent canceled event exists with the same external_id
        const wasRecentlyCanceled = existingEvents.find(
            ev => ev.calendar_event?.external_id === externalId && ev.status === "canceled"
        );
        if (wasRecentlyCanceled) return "rescheduled";

        if (start > now) return "upcoming";
        if (end < now) return "completed";

        return "active"; // fallback
    }

    return rawStatus; // fallback
}


module.exports = {
    calendlyRes: router
};
