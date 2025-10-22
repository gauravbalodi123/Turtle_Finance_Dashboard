// const ProcessedBooking = require('../models/processedBooking');
// const Bookings = require('../models/booking');

// async function processBooking(rawBooking) {
//     try {
//         const uri = rawBooking.uri;
//         if (!uri) {
//             console.warn('Skipping booking with no uri', rawBooking._id);
//             return null;
//         }

//         // Extract eventId from URI
//         const eventId = uri.split('/').pop();

//         // Fetch ALL raw bookings for this eventId, order by creation
//         const rawList = await Bookings.find({ uri })
//             .sort({ created_at_timeline: 1, createdAt: 1 })
//             .lean();

//         if (!rawList || rawList.length === 0) {
//             console.warn('No raw bookings found for eventId', eventId);
//             return null;
//         }

//         const now = new Date();
//         const itemsToUpsert = [];
//         let occurrenceIndex = 0;

//         // Process active bookings
//         for (const rb of rawList) {
//             if (String(rb.status) === 'active') {
//                 const end = rb.end_time ? new Date(rb.end_time) : null;
//                 const procStatus = occurrenceIndex === 0 ? 'upcoming' : 'rescheduled';
//                 const isCompleted = end && end < now ? 'yes' : 'no';

//                 itemsToUpsert.push({
//                     occurrence: occurrenceIndex,
//                     raw: rb,
//                     processedStatus: procStatus,
//                     isCompleted
//                 });

//                 occurrenceIndex++;
//             }
//         }

//         // Handle canceled status if last booking canceled
//         const lastRaw = rawList[rawList.length - 1];
//         if (String(lastRaw.status) === 'canceled') {
//             itemsToUpsert.push({
//                 occurrence: occurrenceIndex,
//                 raw: lastRaw,
//                 processedStatus: 'canceled',
//                 isCompleted: 'no'
//             });
//             occurrenceIndex++;
//         }

//         // Mark previous records as not latest
//         await ProcessedBooking.updateMany({ event_id: eventId }, { $set: { is_latest: false } });

//         // Upsert each processed booking
//         for (const it of itemsToUpsert) {
//             await ProcessedBooking.findOneAndUpdate(
//                 { event_id: eventId, occurrence: it.occurrence },
//                 {
//                     $set: {
//                         event_id: eventId,
//                         uri,
//                         raw_booking: it.raw._id,
//                         status: it.processedStatus,
//                         is_completed: it.isCompleted,
//                         occurrence: it.occurrence,
//                         start_time: it.raw.start_time || null,
//                         end_time: it.raw.end_time || null,
//                         name: it.raw.name,
//                         event_type: it.raw.event_type,
//                         invitee: it.raw.invitee,
//                         advisors: it.raw.advisors,
//                         location: it.raw.location,
//                         source_status: it.raw.status || null,
//                         created_from: it.raw.backfillStatus ? 'backfill' : 'webhook',
//                         created_at_timeline: it.raw.created_at_timeline || null,
//                         updated_at_timeline: it.raw.updated_at_timeline || null,
//                         is_latest: false
//                     }
//                 },
//                 { upsert: true, new: true, setDefaultsOnInsert: true }
//             );
//         }

//         // Mark only the last record as latest
//         const lastOccurrence = itemsToUpsert.length - 1;
//         if (lastOccurrence >= 0) {
//             await ProcessedBooking.findOneAndUpdate(
//                 { event_id: eventId, occurrence: lastOccurrence },
//                 { $set: { is_latest: true } }
//             );
//         }

//         // Remove stale rows
//         await ProcessedBooking.deleteMany({
//             event_id: eventId,
//             occurrence: { $gt: lastOccurrence }
//         });

//         return { eventId, createdOrUpdated: itemsToUpsert.length };
//     } catch (err) {
//         console.error('processBooking error:', err);
//         throw err;
//     }
// }

// module.exports = processBooking;
