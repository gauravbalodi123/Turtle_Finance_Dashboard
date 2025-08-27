const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const { Parser } = require('json2csv');
const Booking = require('../models/booking');

// Connect to MongoDB
const MONGO_URI = "mongodb+srv://tech:admin1234@turtle-finance-cluster.ogdd0ca.mongodb.net/turtle-finance-db?retryWrites=true&w=majority&appName=Turtle-Finance-cluster";
mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });



(async () => {
    try {
        const bookings = await Booking.find().lean();

        const rows = [];

        bookings.forEach(booking => {
            // Flatten event_guests
            const guests = booking.event_guests?.map(g => g.email).join('; ') || '';

            // Flatten questionsAndAnswers
            const qna = booking.invitee?.questionsAndAnswers?.map(q =>
                `${q.position || ''}:${q.question || ''}:${q.answer || ''}:${q.countryCode || ''}:${q.phoneNumber || ''}`
            ).join('; ') || '';

            // Flatten cancellation info
            const canceled_by = booking.cancellation?.canceled_by || '';
            const canceler_type = booking.cancellation?.canceler_type || '';
            const cancel_reason = booking.cancellation?.reason || '';

            rows.push({
                bookingId: booking.bookingId,
                start_time: booking.start_time,
                end_time: booking.end_time,
                name: booking.name,
                status: booking.status,
                uri: booking.uri,
                event_type: booking.event_type,
                canceled_by,
                canceler_type,
                cancel_reason,
                event_guests: guests,
                invitee_email: booking.invitee?.email || '',
                invitee_fullName: booking.invitee?.fullName || '',
                questionsAndAnswers: qna
            });
        });

        const fields = Object.keys(rows[0] || {});
        const parser = new Parser({ fields });
        const csv = parser.parse(rows);

        const outDir = path.join(__dirname, '..', 'csv'); // go up from services to backend/csv
        if (!fs.existsSync(outDir)) {
            fs.mkdirSync(outDir, { recursive: true });
        }

        const outPath = path.join(outDir, 'bookings_export.csv');
        fs.writeFileSync(outPath, csv);
        console.log(`✅ Exported ${rows.length} bookings to ${outPath}`);

        process.exit(0);
    } catch (err) {
        console.error('❌ Error exporting bookings:', err);
        process.exit(1);
    }
})();
