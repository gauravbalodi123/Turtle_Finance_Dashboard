const express = require('express');
const router = express.Router();
const Prospect = require('../../models/prospect');



// GET all prospects with pagination
router.get('/prospects', async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const [prospects, total] = await Promise.all([
            Prospect.find({})
                .sort({ createdAt: -1 }) 
                .skip(skip)
                .limit(limit),
            Prospect.countDocuments()
        ]);

        res.status(200).json({ prospects, total });
    } catch (e) {
        console.error(e);
        res.status(400).json({ msg: "Oops, something went wrong while fetching the prospects." });
    }
});


// POST a new prospect
router.post('/addProspect', async (req, res) => {
    try {
        const prospectData = req.body;
        await Prospect.create(prospectData);
        res.status(200).json({ msg: "Prospect has been added successfully." });
    } catch (e) {
        res.status(400).json({ msg: "Oops, something went wrong while creating a prospect." });
    }
});

// GET single prospect data for edit
router.get('/prospects/:id/editProspect', async (req, res) => {
    try {
        const { id } = req.params;
        const prospect = await Prospect.findById(id);
        res.status(200).json(prospect);
    } catch (e) {
        res.status(400).json({ msg: "Oops, something went wrong while fetching the data for a prospect to edit it." });
    }
});

// PATCH to update a prospect
router.patch('/prospects/:id/editProspect', async (req, res) => {
    try {
        const { id } = req.params;
        const prospectData = req.body;
        const updatedProspect = await Prospect.findByIdAndUpdate(id, prospectData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json(updatedProspect);
    } catch (e) {
        let response = {
            msg: "Oops, something went wrong while editing the data for a prospect."
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

        console.error("Edit Prospect Error:", e);
        res.status(400).json(response);
    }
});

// DELETE a prospect
router.delete('/prospects/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const deleteProspect = await Prospect.findByIdAndDelete(id);
        if (!deleteProspect) {
            return res.status(404).json({ msg: "The prospect does not exist or cannot be fetched." });
        }
        res.status(200).json({ msg: "The prospect has been successfully deleted." });
    } catch (e) {
        res.status(400).json({ msg: "Oops, something went wrong while deleting the prospect." });
    }
});

module.exports = {
    prospectRoutes: router
};
