const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const BookingSchema = new mongoose.Schema(
    {
        bookingId: {
            type: String,
            default: uuidv4,
            unique: true,
            required: true,
        },
        calendar_event: {
            external_id: { type: String },
            kind: { type: String, default: null },
        },
        cancellation: {
            canceled_by: { type: String, default: null },
            canceler_type: { type: String, default: null },
            created_at: { type: Date, default: null },
            reason: { type: String, default: null },
        },
        created_at_timeline: { type: Date, default: null },
        updated_at_timeline: { type: Date, default: null },
        start_time: { type: Date, default: null },
        end_time: { type: Date, default: null },
        name: { type: String, required: true },
        status: { type: String, enum: ['active', 'canceled', 'upcoming', 'completed', 'no-show', 'rescheduled'], default: 'null' },
        uri: { type: String, required: true },

        event_guests: [
            {
                created_at: { type: Date, default: null },
                email: { type: String, default: null },
                updated_at: { type: Date, default: null },
            }
        ],


        event_type: { type: String, required: true },

        invitees_counter: {
            active: { type: Number, default: 0 },
            limit: { type: Number, default: 1 },
            total: { type: Number, default: 1 },
        },

        location: {
            join_url: { type: String, default: null },
            status: { type: String, default: null },
            type: { type: String, default: null },
        },

        event_memberships: [
            {
                buffered_start_time: { type: Date },
                buffered_end_time: { type: Date },
                user: { type: String },
                user_email: { type: String },
                user_name: { type: String },
            }
        ],

        invitee: {
            email: { type: String, required: true },
            fullName: { type: String, required: true },
            firstName: { type: String, default: null },
            lastName: { type: String, default: null },

            cancelUrl: { type: String, default: null },
            rescheduleUrl: { type: String, default: null },

            questionsAndAnswers: [
                {
                    question: { type: String },
                    answer: { type: String },
                    position: { type: Number },

                    // These will only be present for "Phone Number" questions
                    countryCode: { type: String, default: null },
                    phoneNumber: { type: String, default: null }
                }
            ]
        },


        meeting_notes_html: { type: String, default: null },
        meeting_notes_plain: { type: String, default: null },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Booking", BookingSchema);
