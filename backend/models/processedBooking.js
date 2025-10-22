const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const ProcessedBookingSchema = new mongoose.Schema(
    {
        processedId: {
            type: String,
            default: uuidv4,
            unique: true,
            required: true,
        },

        // ✅ Full URI for reference, not used for deduplication anymore
        uri: {
            type: String,
            required: true,
        },

        // ✅ Extracted ID from URI for deduplication + querying
        event_id: {
            type: String,
            required: true,
            index: true,
        },

        raw_booking: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Booking',
            required: true,
            index: true,
        },

        status: {
            type: String,
            enum: ['upcoming', 'rescheduled', 'canceled', 'completed', 'no-show'],
            required: true,
            index: true,
        },

        is_completed: {
            type: String,
            enum: ['yes', 'no'],
            default: 'no',
            index: true,
        },

        // 0 = first booking, 1 = first reschedule, 2 = second reschedule...
        occurrence: {
            type: Number,
            min: 0,
            default: 0,
            index: true,
        },

        is_latest: {
            type: Boolean,
            default: false,
            index: true,
        },

        // Fast UI queries
        start_time: { type: Date, default: null },
        end_time: { type: Date, default: null },

        name: { type: String, required: true },
        event_type: { type: String, required: true },

        invitee: {
            email: { type: String, default: null },
            fullName: { type: String, required: true },
            firstName: { type: String, default: null },
            lastName: { type: String, default: null },
        },

        advisors: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Advisor' }],

        location: {
            join_url: { type: String, default: null },
            status: { type: String, default: null },
            type: { type: String, default: null },
        },

        source_status: {
            type: String,
            enum: ['active', 'canceled', null],
            default: null,
        },

        created_from: {
            type: String,
            enum: ['webhook', 'backfill'],
            default: 'webhook',
            index: true,
        },

        created_at_timeline: { type: Date, default: null },
        updated_at_timeline: { type: Date, default: null },
    },
    { timestamps: true }
);

// ✅ Deduplication: One record per (event_id, occurrence)
ProcessedBookingSchema.index(
    { event_id: 1, occurrence: 1 },
    { unique: true, name: 'uniq_event_occurrence' }
);

// ✅ Raw booking uniqueness per event_id
ProcessedBookingSchema.index(
    { event_id: 1, raw_booking: 1 },
    { unique: true, name: 'uniq_event_raw_pair' }
);

// ✅ Query optimization for status + end_time + completion filters
ProcessedBookingSchema.index(
    { status: 1, end_time: 1, is_completed: 1 },
    { name: 'status_endtime_completed_idx' }
);

// ✅ For fetching latest version quickly
ProcessedBookingSchema.index(
    { event_id: 1, is_latest: 1 },
    { name: 'latest_booking_idx' }
);

module.exports = mongoose.model('ProcessedBooking', ProcessedBookingSchema);
