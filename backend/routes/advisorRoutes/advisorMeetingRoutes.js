const express = require('express');
const router = express.Router();
const Task = require('../../models/task');
const Advisor = require('../../models/advisor');
const { protect, authorizeRoles } = require('../../middleware/authMiddleware');


// ✅ Get all tasks for the logged-in advisor
router.get('/tasks', protect, authorizeRoles('advisor'), async (req, res) => {
    try {
        // Step 1: Find advisor record linked to this user
        const advisor = await Advisor.findOne({ userId: req.user._id });
        if (!advisor) {
            return res.status(404).json({ message: 'Advisor profile not found' });
        }

        // Step 2: Fetch tasks using advisor._id
        const tasks = await Task.find({ advisor: advisor._id })
            .populate('client', 'fullName email')
            .populate('advisor', 'advisorFullName email');

        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching advisor tasks' });
    }
});


// ✅ Paginated & searchable tasks for logged-in advisor
router.get('/selectiveTasks', protect, authorizeRoles('advisor'), async (req, res) => {
    try {
        const advisor = await Advisor.findOne({ userId: req.user._id });
        if (!advisor) {
            return res.status(404).json({ message: 'Advisor profile not found' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        const searchFilter = {
            advisor: advisor._id,
            ...(search && {
                $or: [
                    { title: { $regex: search, $options: 'i' } },
                    { status: { $regex: search, $options: 'i' } },
                    { responsiblePerson: { $regex: search, $options: 'i' } },
                ],
            }),
        };

        const [tasks, total] = await Promise.all([
            Task.find(searchFilter)
                .populate('client', 'fullName email')
                .populate('advisor', 'advisorFullName email')
                .skip(skip)
                .limit(limit)
                .sort({ createdAt: -1 }),
            Task.countDocuments(searchFilter),
        ]);

        res.status(200).json({ tasks, total });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching paginated tasks' });
    }
});



// ✅ Get single task (for editing) — only if this advisor owns it
router.get('/tasks/:id/editTasks', protect, authorizeRoles('advisor'), async (req, res) => {
    try {
        const advisor = await Advisor.findOne({ userId: req.user._id });
        if (!advisor) {
            return res.status(404).json({ message: 'Advisor profile not found' });
        }

        const { id } = req.params;
        const task = await Task.findOne({ _id: id, advisor: advisor._id })
            .populate('client', 'fullName email')
            .populate('advisor', 'advisorFullName email');

        if (!task) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        res.status(200).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching task for edit' });
    }
});



// ✅ Edit / Update a task — only if this advisor owns it
router.patch('/tasks/:id/editTasks', protect, authorizeRoles('advisor'), async (req, res) => {
    try {
        const advisor = await Advisor.findOne({ userId: req.user._id });
        if (!advisor) {
            return res.status(404).json({ message: 'Advisor profile not found' });
        }

        const { id } = req.params;
        const task = await Task.findOneAndUpdate(
            { _id: id, advisor: advisor._id },
            req.body,
            { new: true, runValidators: true }
        );

        if (!task) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        res.status(200).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating task' });
    }
});


// ✅ Delete a task — only if this advisor owns it
router.delete('/tasks/:id', protect, authorizeRoles('advisor'), async (req, res) => {
    try {
        const advisor = await Advisor.findOne({ userId: req.user._id });
        if (!advisor) {
            return res.status(404).json({ message: 'Advisor profile not found' });
        }

        const { id } = req.params;
        const deleted = await Task.findOneAndDelete({ _id: id, advisor: advisor._id });

        if (!deleted) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting task' });
    }
});


module.exports = { advisorTasksRoutes: router };
