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
        status: { type: String, enum: ['canceled', 'upcoming', 'rescheduled', 'rescheduled_canceled'], default: 'null' },

        simplifiedStatus: {
            type: String,
            enum: [
                'canceled',
                'upcoming',
                'completed',
                'completed_rescheduled',
                'rescheduled_canceled',
                null,
            ]
        },

        uri: { type: String, required: true },
        rescheduled: { type: Boolean, default: false },
        event_guests: [
            {
                created_at: { type: Date, default: null },
                email: { type: String, default: null },
                updated_at: { type: Date, default: null },
            }
        ],
        advisors: [{ type: mongoose.Schema.Types.ObjectId, ref: "Advisor" }],
        is_completed: {
            type: String,
            enum: ['yes', 'no'],
            // default: 'no'
        },


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
            email: { type: String },
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


        tracking: {
            utm_campaign: { type: String, default: null },
            utm_source: { type: String, default: null },
            utm_medium: { type: String, default: null },
            utm_content: { type: String, default: null },
            utm_term: { type: String, default: null },
            salesforce_uuid: { type: String, default: null }
        },

        backfillStatus: {
            type: String,
            enum: ['success', 'error', null],
            default: null,
        },

        errorMessage: {
            type: String,
            default: null
        },


        meeting_notes_html: { type: String, default: null },
        meeting_notes_plain: { type: String, default: null },
    },
    { timestamps: true }
);




BookingSchema.pre('save', function (next) {
    if (this.status === 'completed') {
        this.simplifiedStatus = 'completed';
    } else if (this.status === 'rescheduled') {
        this.simplifiedStatus = 'completed_rescheduled';
    } else if (this.status === 'rescheduled_canceled') {
        this.simplifiedStatus = 'completed_rescheduled_canceled';
    } else {
        this.simplifiedStatus = this.status || null;
    }
    next();
});


BookingSchema.pre('findOneAndUpdate', function (next) {
    const update = this.getUpdate();

    // If the status is being updated
    if (update.status) {
        if (update.status === 'completed') {
            update.simplifiedStatus = 'completed';
        } else if (update.status === 'rescheduled') {
            update.simplifiedStatus = 'completed_rescheduled';
        } else if (update.status === 'rescheduled_canceled') {
            update.simplifiedStatus = 'completed_rescheduled_canceled';
        } else {
            update.simplifiedStatus = update.status || null;
        }

        this.setUpdate(update);
    }

    next();
});





module.exports = mongoose.model("Booking", BookingSchema);
