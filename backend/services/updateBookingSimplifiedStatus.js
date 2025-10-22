const mongoose = require('mongoose');
const Booking = require('../models/booking');

const run = async () => {
    try {
        await mongoose.connect(
            'mongodb+srv://tech:admin1234@turtle-finance-cluster.ogdd0ca.mongodb.net/turtle-finance-db?retryWrites=true&w=majority&appName=Turtle-Finance-cluster'
        );
        console.log('✅ Connected to MongoDB');

        // 1️⃣ Upcoming — if completed = yes → completed
        await Booking.updateMany(
            { status: 'upcoming', is_completed: 'yes' },
            { $set: { simplifiedStatus: 'completed' } }
        );

        // 2️⃣ Upcoming — if completed = no → stays upcoming
        await Booking.updateMany(
            { status: 'upcoming', is_completed: 'no' },
            { $set: { simplifiedStatus: 'upcoming' } }
        );

        // 3️⃣ Rescheduled — if completed = yes → completed_rescheduled
        await Booking.updateMany(
            { status: 'rescheduled', is_completed: 'yes' },
            { $set: { simplifiedStatus: 'completed_rescheduled' } }
        );

        // 4️⃣ Rescheduled — if completed = no → stays rescheduled
        await Booking.updateMany(
            { status: 'rescheduled', is_completed: 'no' },
            { $set: { simplifiedStatus: 'rescheduled' } }
        );

        // 5️⃣ Rescheduled Canceled — stays the same
        await Booking.updateMany(
            { status: 'rescheduled_canceled' },
            { $set: { simplifiedStatus: 'rescheduled_canceled' } }
        );

        // 6️⃣ Canceled — stays canceled
        await Booking.updateMany(
            { status: 'canceled' },
            { $set: { simplifiedStatus: 'canceled' } }
        );

        console.log('🎉 Migration complete!');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during migration:', err);
        process.exit(1);
    }
};

run();
