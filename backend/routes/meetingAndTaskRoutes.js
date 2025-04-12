const express = require('express');
const router = express.Router();
const Task = require('../models/task.js');



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


