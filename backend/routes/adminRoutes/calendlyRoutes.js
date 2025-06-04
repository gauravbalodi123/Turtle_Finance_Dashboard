const express = require('express');
const axios = require('axios');
const router = express.Router();
const Booking = require('../../models/booking')
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
       

//         // Step 3: Fetch events starting from Jan 1, 2025
//         const eventsRes = await calendlyApi.get(`/scheduled_events`, {
//             params: {
//                 organization: organizationUri,
               
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

// router.get('/scheduled_events/:uuid', async (req, res) => {
//     const { uuid } = req.params;

//     try {
//         const response = await calendlyApi.get(`/scheduled_events/${uuid}`);
//         res.json(response.data);
//     } catch (error) {
//         console.error('❌ Error fetching event:', error.response?.data || error.message);
//         res.status(500).json({ error: 'Failed to fetch scheduled event' });
//     }
// });






// Helper function to fetch all pages
// async function fetchAllScheduledEvents(organizationUri) {
//     let allEvents = [];
//     let nextPage = `/scheduled_events?organization=${organizationUri}`;

//     while (nextPage) {
//         const response = await calendlyApi.get(nextPage);
//         allEvents = allEvents.concat(response.data.collection);

//         const nextPageUrl = response.data.pagination?.next_page;
//         nextPage = nextPageUrl
//             ? new URL(nextPageUrl).pathname + new URL(nextPageUrl).search
//             : null;
//     }

//     return allEvents;
// }

// // Main route
// router.get('/scheduled_events', async (req, res) => {
//     try {
//         // Step 1: Get the user's organization URI
//         const userRes = await calendlyApi.get('/users/me');
//         const organizationUri = userRes.data.resource.current_organization;

//         // Step 2: Fetch ALL scheduled events (not just one page)
//         const events = await fetchAllScheduledEvents(organizationUri);
//         console.log(`📊 Total events fetched: ${events.length}`);

//         // Step 3: Enrich events with invitee info
//         const enrichedEvents = await Promise.all(events.map(async (event) => {
//             try {
//                 const inviteesRes = await calendlyApi.get(`${event.uri}/invitees`);
//                 const invitees = inviteesRes.data.collection;
//                 const invitee = invitees[0];

//                 let firstName = null, lastName = null;
//                 if (invitee?.name) {
//                     const nameParts = invitee.name.trim().split(' ');
//                     firstName = nameParts[0];
//                     lastName = nameParts.slice(1).join(' ');
//                 }

//                 return {
//                     ...event,
//                     invitee: {
//                         email: invitee?.email || null,
//                         fullName: invitee?.name || null,
//                         firstName,
//                         lastName,
//                     }
//                 };
//             } catch (inviteeError) {
//                 console.error(`Error fetching invitees for event ${event.uri}:`, inviteeError?.response?.data || inviteeError.message);
//                 return {
//                     ...event,
//                     invitee: null
//                 };
//             }
//         }));

//         res.json(enrichedEvents);
//     } catch (error) {
//         console.error(error?.response?.data || error.message);
//         res.status(500).json({ error: error.message });
//     }
// });




module.exports = {
    calendlyRoutes: router
}
