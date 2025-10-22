const express = require('express');
const router = express.Router();
const Booking = require('../../models/booking');
const Advisor = require('../../models/advisor');
const { protect, authorizeRoles } = require('../../middleware/authMiddleware');


// ✅ Get all bookings for the logged-in advisor
router.get("/allbookings", protect, authorizeRoles("advisor"), async (req, res) => {
    try {
        const advisor = await Advisor.findOne({ userId: req.user._id });
        if (!advisor) {
            return res.status(404).json({ message: "Advisor profile not found" });
        }

        const bookings = await Booking.find({ advisors: advisor._id });
        res.status(200).json(bookings);
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Oops, something went wrong while fetching advisor bookings" });
    }
});


// ✅ Paginated & searchable bookings for logged-in advisor
router.get("/selectiveBookings", protect, authorizeRoles("advisor"), async (req, res) => {
    try {
        // ✅ 1. Get the advisor from the logged-in user
        const advisor = await Advisor.findOne({ userId: req.user._id });
        if (!advisor) {
            return res.status(404).json({ message: "Advisor profile not found" });
        }

        // ✅ 2. Pagination, sorting & searching
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";
        const sortField = req.query.sortField;
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        // ✅ 3. Match bookings where this advisor is part of advisors array
        const matchStage = { advisors: advisor._id };

        if (search) {
            matchStage.$or = [
                { name: { $regex: search, $options: "i" } },
                { status: { $regex: search, $options: "i" } },
                { type: { $regex: search, $options: "i" } },
                { "invitee.email": { $regex: search, $options: "i" } },
                { "invitee.fullName": { $regex: search, $options: "i" } },
                { "invitee.first_name": { $regex: search, $options: "i" } },
                { "invitee.last_name": { $regex: search, $options: "i" } },
                { "invitee.questionsAndAnswers.question": { $regex: search, $options: "i" } },
                { "invitee.questionsAndAnswers.answer": { $regex: search, $options: "i" } },
                { "event_guests.email": { $regex: search, $options: "i" } },
                { phoneNumber: { $regex: search, $options: "i" } },
                { countryCode: { $regex: search, $options: "i" } }
            ];
        }

        // ✅ 4. Sorting logic
        let sortBy = {};
        if (sortField) sortBy[sortField] = sortOrder;
        else sortBy["createdAt"] = -1;

        // ✅ 5. Aggregation pipeline (same structure as admin API)
        const bookingsAggregation = Booking.aggregate([
            { $match: matchStage },

            // 👇 Lookup advisor emails
            {
                $lookup: {
                    from: "advisors",
                    localField: "advisors",
                    foreignField: "_id",
                    as: "advisors",
                    pipeline: [{ $project: { _id: 1, email: 1 } }]
                }
            },

            // 👇 Flatten invitee fields and extract phone info
            {
                $addFields: {
                    advisorEmails: {
                        $map: { input: "$advisors", as: "a", in: "$$a.email" }
                    },
                    inviteeEmail: "$invitee.email",
                    inviteeFullName: "$invitee.fullName",
                    inviteePhone: "$invitee.phone_number",
                    phoneNumber: {
                        $first: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$invitee.questionsAndAnswers",
                                        as: "qa",
                                        cond: { $eq: ["$$qa.question", "Phone Number"] }
                                    }
                                },
                                as: "match",
                                in: "$$match.phoneNumber"
                            }
                        }
                    },
                    countryCode: {
                        $first: {
                            $map: {
                                input: {
                                    $filter: {
                                        input: "$invitee.questionsAndAnswers",
                                        as: "qa",
                                        cond: { $eq: ["$$qa.question", "Phone Number"] }
                                    }
                                },
                                as: "match",
                                in: "$$match.countryCode"
                            }
                        }
                    }
                }
            },

            { $sort: sortBy },
            {
                $facet: {
                    bookings: [{ $skip: skip }, { $limit: limit }],
                    total: [{ $count: "count" }]
                }
            }
        ]);

        // ✅ 6. Send back paginated results
        const result = await bookingsAggregation;
        const bookings = result[0].bookings;
        const total = result[0].total[0]?.count || 0;

        res.status(200).json({ bookings, total });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Oops, something went wrong while fetching advisor bookings" });
    }
});



// ✅ Get single booking (for viewing/edit)
router.get("/bookings/:id/editBooking", protect, authorizeRoles("advisor"), async (req, res) => {
    try {
        const advisor = await Advisor.findOne({ userId: req.user._id });
        if (!advisor) {
            return res.status(404).json({ message: "Advisor profile not found" });
        }

        const { id } = req.params;
        const booking = await Booking.findOne({ _id: id, advisors: advisor._id });

        if (!booking) {
            return res.status(404).json({ msg: "Booking not found or unauthorized" });
        }

        res.status(200).json(booking);
    } catch (e) {
        console.error(e);
        res.status(400).json({ msg: "Error fetching booking details" });
    }
});


// ✅ Update a booking (only if advisor is part of it)
router.patch("/bookings/:id/editBooking", protect, authorizeRoles("advisor"), async (req, res) => {
    try {
        const advisor = await Advisor.findOne({ userId: req.user._id });
        if (!advisor) {
            return res.status(404).json({ message: "Advisor profile not found" });
        }

        const { id } = req.params;
        const updatedBooking = await Booking.findOneAndUpdate(
            { _id: id, advisors: advisor._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedBooking) {
            return res.status(404).json({ msg: "Booking not found or unauthorized" });
        }

        res.status(200).json(updatedBooking);
    } catch (e) {
        console.error("Error updating booking:", e);
        res.status(400).json({ msg: "Error updating booking" });
    }
});


// ✅ Delete a booking (optional – typically advisors shouldn’t delete)
router.delete("/bookings/:id", protect, authorizeRoles("advisor"), async (req, res) => {
    try {
        const advisor = await Advisor.findOne({ userId: req.user._id });
        if (!advisor) {
            return res.status(404).json({ message: "Advisor profile not found" });
        }

        const { id } = req.params;
        const deleted = await Booking.findOneAndDelete({ _id: id, advisors: advisor._id });

        if (!deleted) {
            return res.status(404).json({ msg: "Booking not found or unauthorized" });
        }

        res.status(200).json({ msg: "Booking deleted successfully" });
    } catch (e) {
        console.error(e);
        res.status(400).json({ msg: "Error deleting booking" });
    }
});


module.exports = {
    advisorBookingsRoutes: router
};
