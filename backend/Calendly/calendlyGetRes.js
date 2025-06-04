const express = require('express');
const axios = require('axios');
const router = express.Router();
const Bookings = require('../models/booking');
require('dotenv').config();

const calendlyApi = axios.create({
    baseURL: 'https://api.calendly.com',
    headers: {
        Authorization: `Bearer ${process.env.CALENDLY_TOKEN}`
    }
});

router.post('/webhook', async (req, res) => {
    const eventType = req.body.event;
    const payload = req.body.payload;

    const scheduledEventUri = payload?.scheduled_event?.uri;
    const match = scheduledEventUri?.match(/scheduled_events\/([^/]+)/);
    const scheduledEventUUID = match ? match[1] : null;

    if (!scheduledEventUUID) {
        return res.status(400).json({ error: 'Invalid payload - UUID not found' });
    }

    try {
        // Fetch scheduled event
        const eventRes = await calendlyApi.get(`/scheduled_events/${scheduledEventUUID}`);
        const eventData = eventRes.data.resource;

        // Fetch invitee info
        const inviteeRes = await calendlyApi.get(`${eventData.uri}/invitees`);
        const inviteeData = inviteeRes.data.collection[0];

        // Rename timestamps to avoid conflicts
        eventData.created_at_timeline = eventData.created_at;
        eventData.updated_at_timeline = eventData.updated_at;
        delete eventData.created_at;
        delete eventData.updated_at;

        // Extract name details
        const [firstName, ...restName] = inviteeData?.name?.trim().split(' ') || [];
        const lastName = restName.join(' ');

        // Transform status
        const recentEvents = await Bookings.find({}).sort({ createdAt: -1 }).limit(2);
        const transformedStatus = determineStatus(eventData, recentEvents);

        const questionsAndAnswers = inviteeData?.questions_and_answers || [];

        // Enhance Phone Number question inline
        for (const qa of questionsAndAnswers) {
            if (qa.question === "Phone Number" && typeof qa.answer === "string") {
                const phoneMatch = qa.answer.trim().match(/^(\+\d{1,4})\s*(.+)$/);
                if (phoneMatch) {
                    qa.countryCode = phoneMatch[1]; // e.g., "+91"
                    qa.phoneNumber = phoneMatch[2].replace(/\s+/g, ''); // e.g., "9560432218"
                }
            }
        }



        // Build enriched object
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
        };

        console.log(`🧾 Enriched Event:\n`, JSON.stringify(enrichedEvent, null, 2));

        await Bookings.create(enrichedEvent); 
        res.status(200).json({ message: 'Enriched event data logged' });

    } catch (error) {
        console.error('❌ Error saving enriched event:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch/save enriched scheduled event data' });
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
