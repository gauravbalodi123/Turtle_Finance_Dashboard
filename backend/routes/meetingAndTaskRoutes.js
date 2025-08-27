const express = require('express');
const router = express.Router();
const Task = require('../models/task.js');
const Advisor =  require('../models/advisor.js');
const Client =  require('../models/client.js');


router.get("/tasks", async (req, res) => {

    try {
        const fetchAllTasks = await Task.find({})
            .populate("client", "fullName email")
            .populate("advisor", "advisorFullName email");

        res.status(200).json(fetchAllTasks);
    }
    catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong while adding the task" });
    }
})

// ✅ Get paginated tasks
// ✅ Get paginated, searchable, sortable tasks

// router.get("/selectiveTasks", async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         const search = req.query.search || "";
//         const sortField = req.query.sortField;
//         const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

//         const searchFilter = search
//             ? {
//                 $or: [
//                     { title: { $regex: search, $options: "i" } },
//                     { description: { $regex: search, $options: "i" } },
//                     { status: { $regex: search, $options: "i" } },
//                 ]
//             }
//             : {};

//         const sortBy = sortField ? { [sortField]: sortOrder } : { createdAt: -1 };

//         const [tasks, total] = await Promise.all([
//             Task.find(searchFilter)
//                 .sort(sortBy)
//                 .skip(skip)
//                 .limit(limit)
//                 .populate("client", "fullName email")
//                 .populate("advisor", "advisorFullName email"),
//             Task.countDocuments(searchFilter),
//         ]);

//         res.status(200).json({ tasks, total });
//     } catch (e) {
//         console.error(e);
//         res.status(400).json({ msg: "Oops, something went wrong while fetching tasks" });
//     }
// });


router.get("/selectiveTasks", async (req, res) => {
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

        // Apply search filter
        if (search) {
            matchStage.$or = [
                { title: { $regex: search, $options: "i" } },
                { status: { $regex: search, $options: "i" } },
                { clientFullName: { $regex: search, $options: "i" } },
                { clientEmail: { $regex: search, $options: "i" } },
                { advisorFullName: { $regex: search, $options: "i" } },
                { advisorEmail: { $regex: search, $options: "i" } },
                { responsiblePerson: { $regex: search, $options: "i" } },
            ];
        }

        // Apply advisor filter
        if (selectedAdvisor) {
            matchStage.advisorFullName = selectedAdvisor;
        }

        // Apply client filter
        if (selectedClient) {
            matchStage.clientFullName = selectedClient;
        }

        const tasksAggregation = Task.aggregate([
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
            { $sort: sortBy },
            {
                $facet: {
                    tasks: [{ $skip: skip }, { $limit: limit }],
                    total: [{ $count: "count" }],
                },
            },
        ]);

        const result = await tasksAggregation;

        const tasks = result[0].tasks;
        const total = result[0].total[0]?.count || 0;

        res.status(200).json({ tasks, total });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: "Oops, something went wrong while fetching tasks" });
    }
});





router.get('/allAdvisorsClients', async (req, res) => {
    try {
        const advisors = await Advisor.find({}, 'advisorFullName');
        const clients = await Client.find({}, 'fullName');
        res.json({ advisors, clients });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching advisors/clients' });
    }
});





router.post('/addTask', async (req, res) => {
    try {
        const taskData = req.body;
        await Task.create(taskData);
        res.status(200).json({ msg: "Task has been added sucessfully" });
    }
    catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong while creating a Task" })
    }
})

router.get('/tasks/:id/editTasks', async (req, res) => {
    try {
        const { id } = req.params;
        const task = await Task.findById(id);
        res.status(200).json(task);
    }
    catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong while fetching the data for a task to edit it" })
    }
})

router.patch('/tasks/:id/editTasks', async (req, res) => {
    try {
        const { id } = req.params;
        const taskData = req.body;
        const updatedTask = await Task.findByIdAndUpdate(id, taskData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json(updatedTask);

    } catch (e) {
        // 👇 Original generic error message
        let response = {
            msg: "Oops , Something went Wrong while editing the data for a task"
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
        console.error("Edit Task Error:", e);

        res.status(400).json(response);
    }
});


router.delete('/tasks/:id/', async (req, res) => {

    const { id } = req.params;
    const deleteTask = await Task.findByIdAndDelete(id);
    if (!deleteTask) {
        return res.status(404).json({ msg: "The task does not exists or cannot be fetched" })
    }
    res.status(200).json({ msg: "The task has been successfully deleted" })
})

module.exports = {
    meetingAndTasksRoutes: router
}


