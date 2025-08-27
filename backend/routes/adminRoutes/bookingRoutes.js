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


router.get('/selectiveBookings', async (req, res) => {
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
               
                { advisorEmails: { $regex: search, $options: "i" } },
                { status: { $regex: search, $options: "i" } },
                { type: { $regex: search, $options: "i" } },
                { name: { $regex: search, $options: "i" } },
                { "event_guests.email": { $regex: search, $options: "i" } },
                { "invitee.email": { $regex: search, $options: "i" } },
                { "invitee.fullName": { $regex: search, $options: "i" } },
                { "invitee.first_name": { $regex: search, $options: "i" } },
                { "invitee.last_name": { $regex: search, $options: "i" } },
                { "questionsAndAnswers.question": { $regex: search, $options: "i" } },
                { "questionsAndAnswers.answer": { $regex: search, $options: "i" } },
                { phoneNumber: { $regex: search, $options: "i" } }, // ✅ Add this
                { countryCode: { $regex: search, $options: "i" } }  // ✅ And this
            ];
        }

        if (selectedAdvisor) {
            matchStage.advisorEmails = selectedAdvisor;
        }

        // Define default sort (if none sent)
        let sortBy = {};
        if (sortField === "phoneNumber" || sortField === "countryCode") {
            sortBy[sortField] = sortOrder;
        } else if (sortField) {
            sortBy[sortField] = sortOrder;
        } else {
            sortBy["createdAt"] = -1;
        }

        const bookingsAggregation = Booking.aggregate([
            // Join advisors
            {
                $lookup: {
                    from: "advisors",
                    localField: "advisors",
                    foreignField: "_id",
                    as: "advisors",
                    pipeline: [
                        { $project: { _id: 1, email: 1 } } // only return what you need
                    ]
                }
            },
            // {
            //     $unwind: {
            //         path: "$advisors",
            //         preserveNullAndEmptyArrays: true
            //     }
            // },

            // Extract phoneNumber & countryCode from nested Q&A
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
            { $match: matchStage },
            { $sort: sortBy },
            {
                $facet: {
                    bookings: [{ $skip: skip }, { $limit: limit }],
                    total: [{ $count: "count" }]
                }
            }
        ]);

        const result = await bookingsAggregation;
        const bookings = result[0].bookings;
        const total = result[0].total[0]?.count || 0;

        res.status(200).json({ bookings, total });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Oops, something went wrong while fetching bookings" });
    }
});






// router.get('/selectiveBookings', async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         const search = req.query.search || "";
//         const sortField = req.query.sortField;
//         const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
//         const selectedAdvisor = req.query.advisor || "";

//         const sortBy = {};
//         if (sortField) {
//             sortBy[sortField] = sortOrder;
//         } else {
//             sortBy["createdAt"] = -1;
//         }

//         const matchStage = {};

//         // 🌟 Expanded search fields
//         if (search) {
//             matchStage.$or = [
//                 { purpose: { $regex: search, $options: "i" } },
//                 { notes: { $regex: search, $options: "i" } },
//                 { advisorEmail: { $regex: search, $options: "i" } },
//                 { status: { $regex: search, $options: "i" } },
//                 { type: { $regex: search, $options: "i" } },
//                 { name: { $regex: search, $options: "i" } },
//                 { event_guests: { $elemMatch: { $regex: search, $options: "i" } } },
//                 { "invitee.email": { $regex: search, $options: "i" } },
//                 { "invitee.fullName": { $regex: search, $options: "i" } },
//                 { "invitee.first_name": { $regex: search, $options: "i" } },
//                 { "invitee.last_name": { $regex: search, $options: "i" } },
//                 { "questionsAndAnswers.question": { $regex: search, $options: "i" } },
//                 { "questionsAndAnswers.answer": { $regex: search, $options: "i" } },
//             ];
//         }

//         if (selectedAdvisor) {
//             matchStage.advisorEmail = selectedAdvisor;
//         }

//         const bookingsAggregation = Booking.aggregate([
//             {
//                 $lookup: {
//                     from: "advisors",
//                     localField: "advisors",
//                     foreignField: "_id",
//                     as: "advisors"
//                 }
//             },
//             {
//                 $unwind: {
//                     path: "$advisors",
//                     preserveNullAndEmptyArrays: true
//                 }
//             },
//             {
//                 $addFields: {
//                     advisorEmail: "$advisors.email",
//                     inviteeEmail: "$invitee.email",
//                     inviteeFullName: "$invitee.fullName",
//                     inviteePhone: "$invitee.phone_number",


//                 }
//             },
//             {
//                 $match: matchStage
//             },
//             {
//                 $sort: sortBy
//             },
//             {
//                 $facet: {
//                     bookings: [{ $skip: skip }, { $limit: limit }],
//                     total: [{ $count: "count" }]
//                 }
//             }
//         ]);

//         const result = await bookingsAggregation;
//         const bookings = result[0].bookings;
//         const total = result[0].total[0]?.count || 0;

//         res.status(200).json({ bookings, total });
//     } catch (e) {
//         console.error(e);
//         res.status(500).json({ msg: "Oops, something went wrong while fetching bookings" });
//     }
// });

// router.get('/allAdvisors', async (req, res) => {
//     try {
//         const advisors = await Advisor.find({}, 'advisorFullName');
//         res.json({ advisors });
//     } catch (err) {
//         res.status(500).json({ message: 'Error fetching advisors/clients' });
//     }
// });



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
