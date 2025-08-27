const express = require('express');
const router = express.Router();
const RowwiseTask = require('../models/rowwisetask.js');
const Advisor = require('../models/advisor.js');
const Client = require('../models/client.js');




router.get("/rowwisetasks", async (req, res) => {

    try {
        const fetchAllRowWiseTasks = await RowwiseTask.find({})
            .populate("client", "fullName email")
            .populate("advisor", "advisorFullName email");

        res.status(200).json(fetchAllRowWiseTasks);
    }
    catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong while adding the rowwisetasks" });
    }
})



router.get("/selectiveRowwiseTasks", async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search || "";
        const sortField = req.query.sortField;
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        const selectedAdvisor = req.query.advisor || "";
        const selectedClient = req.query.client || "";

        const sortBy = {};
        if (sortField) {
            sortBy[sortField] = sortOrder;
        } else {
            sortBy["createdAt"] = -1; // default sort
        }

        const matchStage = {};

        if (search) {
            matchStage.$or = [
                { "client.fullName": { $regex: search, $options: "i" } },
                { "client.email": { $regex: search, $options: "i" } },
                { "advisor.advisorFullName": { $regex: search, $options: "i" } },
                { "advisor.email": { $regex: search, $options: "i" } },
                { title: { $regex: search, $options: "i" } },
                { actionItems: { $regex: search, $options: "i" } },
                { responsiblePerson: { $regex: search, $options: "i" } },
                { participants: { $regex: search, $options: "i" } },
            ];
        }

        if (selectedClient) {
            matchStage["client.fullName"] = selectedClient;
        }

        if (selectedAdvisor) {
            matchStage["advisor.advisorFullName"] = selectedAdvisor;
        }

        const result = await RowwiseTask.aggregate([
            {
                $lookup: {
                    from: "clients",
                    localField: "client",
                    foreignField: "_id",
                    as: "client",
                },
            },
            {
                $unwind: {
                    path: "$client",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $lookup: {
                    from: "advisors",
                    localField: "advisor",
                    foreignField: "_id",
                    as: "advisor",
                },
            },
            {
                $unwind: {
                    path: "$advisor",
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    clientFullName: "$client.fullName",
                    clientEmail: "$client.email",
                    advisorFullName: "$advisor.advisorFullName",
                    advisorEmail: "$advisor.email",
                },
            },
            {
                $match: matchStage,
            },
            {
                $sort: sortBy,
            },
            {
                $facet: {
                    tasks: [{ $skip: skip }, { $limit: limit }],
                    totalCount: [{ $count: "count" }],
                },
            },
        ]);

        const tasks = result[0].tasks;
        const total = result[0].totalCount[0]?.count || 0;

        res.status(200).json({ tasks, total });
    } catch (e) {
        console.error("Error fetching rowwise tasks:", e);
        res.status(400).json({ msg: "Oops, something went wrong while fetching tasks" });
    }
});



router.get('/allAdvisorsClientsRowWiseTasks', async (req, res) => {
    try {
        const advisors = await Advisor.find({}, 'advisorFullName email');
        const clients = await Client.find({}, 'fullName email');
        res.json({ advisors, clients });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching advisors/clients' });
    }
});




router.get("/rowwiseTasks/stats", async (req, res) => {
    try {
        const [completed, pending, overdue] = await Promise.all([
            RowwiseTask.countDocuments({ status: "Completed" }),
            RowwiseTask.countDocuments({ status: "Pending" }),
            RowwiseTask.countDocuments({ status: "Overdue" }),
        ]);

        res.status(200).json({ completed, pending, overdue });
    } catch (e) {
        console.error("Error fetching rowwise task stats:", e);
        res.status(500).json({ msg: "Failed to fetch task stats." });
    }
});


router.get('/rowwisetasks/parent/:parentId', async (req, res) => {
    const { parentId } = req.params;
    try {
        const actionItems = await RowwiseTask.find({ parentTaskId: parentId });
        res.json(actionItems);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch action items" });
    }
});


router.post('/rowwisetasks/addRowWiseTask', async (req, res) => {
    try {
        const rowWiseTaskData = req.body;

        // Step 1: Create the task
        const newTask = await RowwiseTask.create(rowWiseTaskData);

        // Step 2: Populate client and advisor
        const populatedTask = await RowwiseTask.findById(newTask._id)
            .populate("client")
            .populate("advisor");

        // Step 3: Send it back to frontend
        res.status(200).json(populatedTask);
    } catch (e) {
        console.error("Error adding rowwisetask:", e);
        res.status(400).json({ msg: "Oops, something went wrong while creating a rowwisetask" });
    }
});



router.get('/rowwisetasks/:id/editRowWiseTasks', async (req, res) => {
    try {
        const { id } = req.params;
        const rowWiseTask = await RowwiseTask.findById(id);
        res.status(200).json(rowWiseTask);
    }
    catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong while fetching the data for a rowWiseTask to edit it" })
    }
})

router.patch('/rowwisetasks/:id/editRowWiseTasks', async (req, res) => {
    try {
        const { id } = req.params;
        const rowWiseTaskData = req.body;
        const updatedTask = await RowwiseTask.findByIdAndUpdate(id, rowWiseTaskData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json(updatedTask);

    } catch (e) {
        // 👇 Original generic error message
        let response = {
            msg: "Oops , Something went Wrong while editing the data for a rowwisetasks"
        };

        // 👇 Mongoose validation errors (e.g., enum, required, etc.)
        if (e.name === "ValidationError") {
            response.details = {};
            for (let field in e.errors) {
                response.details[field] = e.errors[field].message;
            }
        }

        // 👇 MongoDB duplicate key errors (e.g., email or phone must be unique)
        if (e.code === 11000) {
            response.msg = "Duplicate field error";
            response.field = Object.keys(e.keyValue);
            response.value = Object.values(e.keyValue);
        }

        // 👇 Log to server for dev debugging
        console.error("Edit rowwisetasks Error:", e);

        res.status(400).json(response);
    }
});


router.delete('/rowwisetasks/:id/', async (req, res) => {

    const { id } = req.params;
    const deleteRowWiseTask = await RowwiseTask.findByIdAndDelete(id);
    if (!deleteRowWiseTask) {
        return res.status(404).json({ msg: "The rowwisetasks does not exists or cannot be fetched" })
    }
    res.status(200).json({ msg: "The rowwisetasks has been successfully deleted" })
})

module.exports = {
    rowWiseTaskRoutes: router
}


