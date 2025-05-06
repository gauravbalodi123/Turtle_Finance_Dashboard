const express = require('express');
const router = express.Router();
const RowwiseTask = require('../models/rowwisetask.js');



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
        await RowwiseTask.create(rowWiseTaskData);
        res.status(200).json({ msg: "rowwisetask has been added sucessfully" });
    }
    catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong while creating a rowwisetask" })
    }
})

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


