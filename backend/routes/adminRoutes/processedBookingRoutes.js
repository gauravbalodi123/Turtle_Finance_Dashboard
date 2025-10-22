const express = require('express');
const router = express.Router();
const ProcessedBooking = require('../../models/processedBooking');
require('dotenv').config();

// ✅ Get all processed bookings
router.get("/allProcessedBookings", async (req, res) => {
    try {
        const fetchAllProcessedBookings = await ProcessedBooking.find({});
        res.status(200).json(fetchAllProcessedBookings);
    } catch (e) {
        res.status(400).json({ msg: "Oops, Something went Wrong" });
    }
});

// ✅ Get processed bookings with search, sort, pagination
router.get('/selectiveProcessedBookings', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search || "";
        const sortField = req.query.sortField;
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
        const selectedAdvisor = req.query.advisor || "";

        // Match stage
        const matchStage = {};

        if (search) {
            matchStage.$or = [
                { name: { $regex: search, $options: "i" } },
                { event_type: { $regex: search, $options: "i" } },
                { status: { $regex: search, $options: "i" } },
                { "invitee.email": { $regex: search, $options: "i" } },
                { "invitee.fullName": { $regex: search, $options: "i" } },
                { "invitee.firstName": { $regex: search, $options: "i" } },
                { "invitee.lastName": { $regex: search, $options: "i" } }
            ];
        }

        if (selectedAdvisor) {
            matchStage["advisors"] = selectedAdvisor;
        }

        // Define sort
        let sortBy = {};
        if (sortField) {
            sortBy[sortField] = sortOrder;
        } else {
            sortBy["createdAt"] = -1;
        }

        const processedBookingsAggregation = ProcessedBooking.aggregate([
            {
                $lookup: {
                    from: "advisors",
                    localField: "advisors",
                    foreignField: "_id",
                    as: "advisors",
                    pipeline: [
                        { $project: { _id: 1, email: 1 } }
                    ]
                }
            },
            {
                $addFields: {
                    advisorEmails: {
                        $map: { input: "$advisors", as: "a", in: "$$a.email" }
                    }
                }
            },
            { $match: matchStage },
            { $sort: sortBy },
            {
                $facet: {
                    processedBookings: [{ $skip: skip }, { $limit: limit }],
                    total: [{ $count: "count" }]
                }
            }
        ]);

        const result = await processedBookingsAggregation;
        const processedBookings = result[0].processedBookings;
        const total = result[0].total[0]?.count || 0;

        res.status(200).json({ processedBookings, total });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Oops, something went wrong while fetching processed bookings" });
    }
});

// ✅ Stats endpoint
router.get("/processedBookings/stats", async (req, res) => {
    try {
        const [total, upcoming, completed, issues] = await Promise.all([
            ProcessedBooking.countDocuments(),
            ProcessedBooking.countDocuments({ status: "upcoming" }),
            ProcessedBooking.countDocuments({ is_completed: "yes" }),
            ProcessedBooking.countDocuments({ status: { $in: ["canceled", "no-show", "rescheduled"] } }),
        ]);

        res.json({ total, upcoming, completed, issues });
    } catch (err) {
        console.error("Error fetching stats", err);
        res.status(500).json({ message: "Failed to fetch stats" });
    }
});

// ✅ Add a processed booking manually (if needed)
router.post('/addProcessedBooking', async (req, res) => {
    try {
        const bookingData = req.body;
        await ProcessedBooking.create(bookingData);
        res.status(200).json({ msg: "Processed booking has been added successfully" });
    } catch (e) {
        res.status(400).json({ msg: "Oops, something went wrong while creating the processed booking" });
    }
});

// ✅ Get a processed booking by ID
router.get('/processedBookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const booking = await ProcessedBooking.findById(id);
        res.status(200).json(booking);
    } catch (e) {
        res.status(400).json({ msg: "Oops, something went wrong while fetching the processed booking" });
    }
});

// ✅ Update a processed booking by ID
router.patch('/processedBookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const bookingData = req.body;
        const updatedBooking = await ProcessedBooking.findByIdAndUpdate(id, bookingData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json(updatedBooking);
    } catch (e) {
        let response = {
            msg: "Oops, something went wrong while updating the processed booking"
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

        console.error("Edit Processed Booking Error:", e);
        res.status(400).json(response);
    }
});

// ✅ Delete a processed booking by ID
router.delete('/processedBookings/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deletedBooking = await ProcessedBooking.findByIdAndDelete(id);
        if (!deletedBooking) {
            return res.status(404).json({ msg: "The processed booking does not exist or cannot be fetched" });
        }
        res.status(200).json({ msg: "The processed booking has been successfully deleted" });
    } catch (e) {
        res.status(400).json({ msg: "Oops, something went wrong while deleting the processed booking" });
    }
});

module.exports = {
    processedBookingRoutes: router
};
