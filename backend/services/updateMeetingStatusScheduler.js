const Booking = require('../models/booking');

async function markCompletedMeetings() {
    try {
        const now = new Date();

        // Bulk update with index support
        const result = await Booking.updateMany(
            {
                // status: { $in: ['upcoming', 'rescheduled'] },
                end_time: { $lt: now },
                is_completed: 'no'
            },
            { $set: { is_completed: 'yes' } }
        );

        console.log(`✅ Marked ${result.modifiedCount} meetings as completed`);
    } catch (err) {
        console.error('Error updating completed meetings:', err);
    }
}

module.exports = markCompletedMeetings;
