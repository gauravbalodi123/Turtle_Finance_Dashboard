const express = require('express');
const router = express.Router();
const Advisor = require('../models/advisor')



router.get('/advisors', async (req, res) => {
    try {
        const fetchAllAdvisors = await Advisor.find({});
        res.status(200).json(fetchAllAdvisors);
    }
    catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong while fetching the advisors" });
    }
});



// ✅ Get paginated advisors
router.get('/selectiveAdvisors', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search || "";
        const sortField = req.query.sortField;
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        // 🔍 Searchable fields based on your schema
        const searchFilter = search
            ? {
                $or: [
                    { advisorFullName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } },
                    { advisorDomain: { $elemMatch: { $regex: search, $options: "i" } } },
                    { eventName: { $elemMatch: { $regex: search, $options: "i" } } },
                    { salutation: { $regex: search, $options: "i" } },
                    { countryCode: { $regex: search, $options: "i" } },
                    { address: { $regex: search, $options: "i" } },
                    { gender: { $regex: search, $options: "i" } },
                    { qualification: { $regex: search, $options: "i" } },
                    { credentials: { $regex: search, $options: "i" } },
                    { bio: { $regex: search, $options: "i" } },
                    { linkedinProfile: { $regex: search, $options: "i" } },
                ],
            }
            : {};

        // 🧠 Default sort by createdAt desc unless specified
        const sortBy = sortField
            ? { [sortField]: sortOrder }
            : { createdAt: -1 }; // ✅ default when no sort field is passed

        const [advisors, total] = await Promise.all([
            Advisor.find(searchFilter)
                .sort(sortBy)
                .skip(skip)
                .limit(limit),
            Advisor.countDocuments(searchFilter),
        ]);

        res.status(200).json({ advisors, total });
    } catch (e) {
        console.error("Error fetching paginated advisors:", e);
        res.status(400).json({ msg: "Oops, something went wrong while fetching advisors" });
    }
});





// ✅ Get advisor stats (total, active, inactive)
router.get('/advisors/stats', async (req, res) => {
    try {
        const [total, active, inactive] = await Promise.all([
            Advisor.countDocuments({}),
            Advisor.countDocuments({ status: "Active" }),
            Advisor.countDocuments({ status: "Inactive" })
        ]);

        res.status(200).json({ total, active, inactive });
    } catch (e) {
        console.error("Error fetching advisor stats", e);
        res.status(500).json({ msg: "Failed to fetch advisor stats" });
    }
});


router.post('/addAdvisor', async (req, res) => {
    try {
        const advisorData = req.body;
        await Advisor.create(advisorData);
        res.status(200).json({ msg: "Advisor has been added sucessfully" });
    }
    catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong while creating a advisor" })
    }
});


router.get('/advisors/:id/editAdvisors', async (req, res) => {
    try {
        const { id } = req.params;
        const advisor = await Advisor.findById(id);
        // console.log(Advisor);
        res.status(200).json(advisor);
    }
    catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong while fetching the data for a Advisor to edit it" })
    }
});


router.patch('/advisors/:id/editAdvisors', async (req, res) => {
    try {
        const { id } = req.params;
        const advisorData = req.body;
        const updatedAdvisor = await Advisor.findByIdAndUpdate(id, advisorData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json(updatedAdvisor);

    } catch (e) {
        //  Original generic error message
        let response = {
            msg: "Oops , Something went Wrong while editing the data for a advisor"
        };

        //  Mongoose validation errors (e.g., enum, required, etc.)
        if (e.name === "ValidationError") {
            response.details = {};
            for (let field in e.errors) {
                response.details[field] = e.errors[field].message;
            }
        }

        //  MongoDB duplicate key errors (e.g., email or phone must be unique)
        if (e.code === 11000) {
            response.msg = "Duplicate field error";
            response.field = Object.keys(e.keyValue);
            response.value = Object.values(e.keyValue);
        }

        //  Log to server for dev debugging
        console.error("Edit Advisor Error:", e);

        res.status(400).json(response);
    }
});



router.delete('/advisors/:id/', async (req, res) => {

    const { id } = req.params;
    const deleteAdvisor = await Advisor.findByIdAndDelete(id);
    if (!deleteAdvisor) {
        return res.status(404).json({ msg: "The Advisor does not exists or cannot be fetched" })
    }
    res.status(200).json({ msg: "The Advisor has been successfully deleted" })
})



module.exports = {
    advisorRoutes: router
}












