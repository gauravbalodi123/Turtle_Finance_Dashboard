const express = require('express');
const router = express.Router();
const Booking = require('../../models/booking');
require('dotenv').config();

// ✅ Get all bookings
router.get("/allbookings", async (req, res) => {
    try {
        const fetchAllBookings = await Booking.find({});
        res.status(200).json(fetchAllBookings);
    } catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong" });
    }
});


// ✅ Get paginated bookings
router.get('/bookings', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [bookings, total] = await Promise.all([
            Booking.find({})
                .sort({ createdAt: -1 }) // ✅ Ensure latest bookings first
                .skip(skip)
                .limit(limit),
            Booking.countDocuments()
        ]);

        res.status(200).json({ bookings, total });
    } catch (e) {
        console.error(e);
        res.status(400).json({ msg: "Oops, something went wrong while fetching bookings" });
    }
});


router.get("/bookings/stats", async (req, res) => {
    try {
        const [total, upcoming, completed, issues] = await Promise.all([
            Booking.countDocuments(),
            Booking.countDocuments({ status: "upcoming" }),
            Booking.countDocuments({ status: "completed" }),
            Booking.countDocuments({ status: { $in: ["canceled", "no-show", "rescheduled"] } }),
        ]);

        res.json({ total, upcoming, completed, issues });
    } catch (err) {
        console.error("Error fetching stats", err);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
});



// ✅ Add a new booking
router.post('/addBooking', async (req, res) => {
    try {
        const bookingData = req.body;
        await Booking.create(bookingData);
        res.status(200).json({ msg: "Booking has been added successfully" });
    } catch (e) {
        res.status(400).json({ msg: "Oops, something went wrong while creating the booking" });
    }
});

// ✅ Get a booking by ID (for editing/viewing)
router.get('/bookings/:id/editBooking', async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await Booking.findById(id);
        res.status(200).json(booking);
    } catch (e) {
        res.status(400).json({ msg: "Oops, something went wrong while fetching the booking to edit" });
    }
});

// ✅ Update a booking by ID
router.patch('/bookings/:id/editBooking', async (req, res) => {
    try {
        const { id } = req.params;
        const bookingData = req.body;
        const updatedBooking = await Booking.findByIdAndUpdate(id, bookingData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json(updatedBooking);
    } catch (e) {
        let response = {
            msg: "Oops, something went wrong while updating the booking"
        };

        if (e.name === "ValidationError") {
            response.details = {};
            for (let field in e.errors) {
                response.details[field] = e.errors[field].message;
            }
        }

        if (e.code === 11000) {
            response.msg = "Duplicate field error";
            response.field = Object.keys(e.keyValue);
            response.value = Object.values(e.keyValue);
        }

        console.error("Edit Booking Error:", e);
        res.status(400).json(response);
    }
});

// ✅ Delete a booking by ID
router.delete('/bookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBooking = await Booking.findByIdAndDelete(id);
        if (!deletedBooking) {
            return res.status(404).json({ msg: "The booking does not exist or cannot be fetched" });
        }
        res.status(200).json({ msg: "The booking has been successfully deleted" });
    } catch (e) {
        res.status(400).json({ msg: "Oops, something went wrong while deleting the booking" });
    }
});

module.exports = {
    bookingRoutes: router
};
