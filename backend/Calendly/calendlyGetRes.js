const express = require('express');
const axios = require('axios');
const router = express.Router();
const Bookings = require('../models/booking');
const Advisor = require('../models/advisor');
const Client = require('../models/client');
require('dotenv').config();
const { sendClientUpsert} = require('../webhooks/webhookClientSync');

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

        const inviteeRes = await calendlyApi.get(`${eventData.uri}/invitees`);
        const inviteeData = inviteeRes.data.collection[0];

        if (!inviteeData) {
            console.log("❌ No invitee data found.");
            return res.status(400).json({ error: 'No invitee data found' });
        }

        // Map timestamps
        eventData.created_at_timeline = eventData.created_at;
        eventData.updated_at_timeline = eventData.updated_at;
        delete eventData.created_at;
        delete eventData.updated_at;

        // Parse name
        const [firstName, ...restName] = inviteeData?.name?.trim().split(' ') || [];
        const lastName = restName.join(' ');

        // Phone number parsing
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

        // Validate email if not in allowed names
        const normalizedName = (eventData?.name || '').toLowerCase();
        if (!allowedNames.includes(normalizedName)) {
            const inviteeEmail = inviteeData?.email?.trim().toLowerCase();
            if (inviteeEmail) {
                const matchedClient = await Client.findOne({ email: inviteeEmail }).select('_id');
                if (!matchedClient) inviteeData.email = '';
            } else {
                inviteeData.email = '';
            }
        }

        // Find advisors
        const guestEmails = (eventData.event_guests || []).map(g => g.email).filter(Boolean);
        let advisors = (await Advisor.find({ email: { $in: guestEmails } }).select('_id')).map(a => a._id);

        if (advisors.length === 0) {
            const normalizedEventName = (eventData?.name || '').trim().toLowerCase();
            const matchedByEventName = await Advisor.find({
                eventName: { $elemMatch: { $regex: new RegExp(`^${normalizedEventName}$`, 'i') } }
            }).select('_id');

            advisors = matchedByEventName.map(a => a._id);
        }

        // -----------------------
        // Handle reschedule logic
        // -----------------------
        const externalId = eventData.calendar_event?.external_id;
        const startTime = new Date(eventData.start_time);

        if (externalId) {
            // 1️⃣ Old canceled booking that was rescheduled
            await Bookings.updateMany(
                {
                    "calendar_event.external_id": externalId,
                    status: "canceled",
                    rescheduled: true,
                },
                { $set: { status: "rescheduled_canceled" } }
            );

            // 2️⃣ Check if this booking is the new active/upcoming one
            const oldCanceled = await Bookings.findOne({
                "calendar_event.external_id": externalId,
                status: "rescheduled_canceled",
            });

            if (oldCanceled && eventData.status === "active") {
                transformedStatus = "rescheduled";
            } else {
                transformedStatus = determineStatus(eventData);
            }
        } else {
            transformedStatus = determineStatus(eventData);
        }

        const enrichedEvent = {
            ...eventData,
            rescheduled: inviteeData?.rescheduled || false,
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
        // await Bookings.create(enrichedEvent);
        const newBooking = await Bookings.create(enrichedEvent);

        //webhook to send data to excel
        sendClientUpsert(newBooking, 'created', 'Bookings')
            .catch(err => console.error('[webhook] booking.created failed:', err?.message));
        ;

        return res.status(200).json({ message: 'Enriched event data saved with advisors' });

    } catch (error) {
        console.error('❌ Error saving enriched event:', error?.response?.data || error.message);
        return res.status(500).json({ error: 'Failed to fetch/save enriched scheduled event data' });
    }
});

function determineStatus(eventData) {
    const now = new Date();
    const start = new Date(eventData.start_time);

    if (eventData.status === "canceled") {
        return eventData.rescheduled ? "rescheduled_canceled" : "canceled";
    }

    if (eventData.status === "active") {
        return start > now ? "upcoming" : "completed";
    }

    return eventData.status;
}

module.exports = {
    calendlyRes: router
};
