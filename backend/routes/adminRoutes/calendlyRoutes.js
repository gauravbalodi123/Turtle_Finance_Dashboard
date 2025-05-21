const express = require('express');
const axios = require('axios');
const router = express.Router();
require('dotenv').config();

const CALENDLY_API = 'https://api.calendly.com';
const CALENDLY_TOKEN = process.env.CALENDLY_TOKEN;

// Axios instance with headers set
const calendlyApi = axios.create({
    baseURL: CALENDLY_API,
    headers: {
        Authorization: `Bearer ${CALENDLY_TOKEN}`,
    },
});

// GET /api/calendly/user - Get current user
router.get('/user', async (req, res) => {
    try {
        const response = await calendlyApi.get('/users/me');
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// in order to GET /api/calendly/event-types - this will give al eevent type
// router.get('/event-types', async (req, res) => {
//     try {
//         const userRes = await calendlyApi.get('/users/me');
//         const userUri = userRes.data.resource.uri;

//         const eventTypesRes = await calendlyApi.get(`/event_types?user=${encodeURIComponent(userUri)}`);
//         res.json(eventTypesRes.data);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// GET /api/calendly/events - Get all scheduled events
// router.get('/scheduled_events', async (req, res) => {
//     try {
//         // Step 1: Get the user's organization URI
//         const userRes = await calendlyApi.get('/users/me');
//         const organizationUri = userRes.data.resource.current_organization;

//         // Step 2: Set min_start_time to Jan 1, 2025 in ISO format
//         const minStartTime = new Date('2025-01-01T00:00:00Z').toISOString();

//         // Step 3: Fetch events starting from Jan 1, 2025
//         const eventsRes = await calendlyApi.get(`/scheduled_events`, {
//             params: {
//                 organization: organizationUri,
//                 min_start_time: minStartTime,
//             }
//         });

//         // Step 4: Return upcoming events from 2025 onward
//         res.json(eventsRes.data);
//     } catch (error) {
//         console.error(error?.response?.data || error.message);
//         res.status(500).json({ error: error.message });
//     }
// });

router.get('/scheduled_events', async (req, res) => {
    try {
        // Step 1: Get the user's organization URI
        const userRes = await calendlyApi.get('/users/me');
        const organizationUri = userRes.data.resource.current_organization;

        // Step 2: Set min_start_time to Jan 1, 2025 in ISO format
        const minStartTime = new Date('2025-01-01T00:00:00Z').toISOString();

        // Step 3: Fetch scheduled events
        const eventsRes = await calendlyApi.get(`/scheduled_events`, {
            params: {
                organization: organizationUri,
                min_start_time: minStartTime,
            }
        });

        const events = eventsRes.data.collection;

        // Step 4: For each event, get invitees and extract names/emails
        const enrichedEvents = await Promise.all(events.map(async (event) => {
            try {
                const inviteesRes = await calendlyApi.get(`${event.uri}/invitees`);
                const invitees = inviteesRes.data.collection;

                // Assume only one invitee per event (which is typical)
                const invitee = invitees[0];

                // Split full name
                let firstName = null, lastName = null;
                if (invitee?.name) {
                    const nameParts = invitee.name.trim().split(' ');
                    firstName = nameParts[0];
                    lastName = nameParts.slice(1).join(' ');
                }

                return {
                    ...event,
                    invitee: {
                        email: invitee?.email || null,
                        fullName: invitee?.name || null,
                        firstName,
                        lastName,
                    }
                };
            } catch (inviteeError) {
                console.error(`Error fetching invitees for event ${event.uri}:`, inviteeError?.response?.data || inviteeError.message);
                return {
                    ...event,
                    invitee: null
                };
            }
        }));

        // Step 5: Return enriched events
        res.json(enrichedEvents);
    } catch (error) {
        console.error(error?.response?.data || error.message);
        res.status(500).json({ error: error.message });
    }
});

router.get('/event/:uuid', async (req, res) => {
    const { uuid } = req.params;

    try {
        const response = await calendlyApi.get(`/scheduled_events/${uuid}`);
        res.json(response.data);
    } catch (error) {
        console.error('❌ Error fetching event:', error.response?.data || error.message);
        res.status(500).json({ error: 'Failed to fetch scheduled event' });
    }
});




router.post('/webhook', (req, res) => {
    console.log('📩 Webhook payload received:', JSON.stringify(req.body, null, 2));

    const eventType = req.body.event;
    const payload = req.body.payload;

    if (eventType === 'invitee.created') {
        console.log('✅ New booking:', payload.email, payload.scheduled_event);
        // store to DB, notify someone, etc.
    } else if (eventType === 'invitee.canceled') {
        console.log('❌ Booking canceled:', payload.email, payload.cancellation?.reason);
        // handle cancellation
    }

    res.status(200).send('Webhook received');
});




// GET /api/calendly/invitees/:eventUuid - Get invitees for a specific scheduled event
// router.get('/invitees/:eventUuid', async (req, res) => {
//     try {
//         const { eventUuid } = req.params;
//         const inviteesRes = await calendlyApi.get(`/scheduled_events/${eventUuid}/invitees`);
//         res.json(inviteesRes.data);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

module.exports = {
    calendlyRoutes: router
}
