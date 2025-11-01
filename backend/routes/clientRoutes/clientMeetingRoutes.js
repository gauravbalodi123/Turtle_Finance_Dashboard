const express = require('express');
const router = express.Router();
const Task = require('../../models/task');
const Client = require('../../models/client');
const { protect, authorizeRoles } = require('../../middleware/authMiddleware');


// ✅ Get all tasks for the logged-in client
router.get('/tasks', protect, authorizeRoles('client'), async (req, res) => {
    try {
        // Step 1: Find client record linked to this user
        const client = await Client.findOne({ userId: req.user._id });
        if (!client) {
            return res.status(404).json({ message: 'Client profile not found' });
        }

        // Step 2: Fetch tasks for this client
        const tasks = await Task.find({ client: client._id })
            .populate('client', 'fullName email')
            .populate('advisor', 'advisorFullName email');

        res.status(200).json(tasks);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching client tasks' });
    }
});


// ✅ Paginated & searchable tasks for logged-in client
router.get('/selectiveTasks', protect, authorizeRoles('client'), async (req, res) => {
    try {
        const client = await Client.findOne({ userId: req.user._id });
        if (!client) {
            return res.status(404).json({ message: 'Client profile not found' });
        }

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || '';

        const searchFilter = {
            client: client._id,
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
        res.status(500).json({ message: 'Error fetching paginated client tasks' });
    }
});


// ✅ Get single task (for viewing or editing) — only if this client owns it
router.get('/tasks/:id/editTasks', protect, authorizeRoles('client'), async (req, res) => {
    try {
        const client = await Client.findOne({ userId: req.user._id });
        if (!client) {
            return res.status(404).json({ message: 'Client profile not found' });
        }

        const { id } = req.params;
        const task = await Task.findOne({ _id: id, client: client._id })
            .populate('client', 'fullName email')
            .populate('advisor', 'advisorFullName email');

        if (!task) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        res.status(200).json(task);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching task for client' });
    }
});


// ✅ Edit / Update a task — only if this client owns it
router.patch('/tasks/:id/editTasks', protect, authorizeRoles('client'), async (req, res) => {
    try {
        const client = await Client.findOne({ userId: req.user._id });
        if (!client) {
            return res.status(404).json({ message: 'Client profile not found' });
        }

        const { id } = req.params;
        const task = await Task.findOneAndUpdate(
            { _id: id, client: client._id },
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


// ✅ Delete a task — only if this client owns it
router.delete('/tasks/:id', protect, authorizeRoles('client'), async (req, res) => {
    try {
        const client = await Client.findOne({ userId: req.user._id });
        if (!client) {
            return res.status(404).json({ message: 'Client profile not found' });
        }

        const { id } = req.params;
        const deleted = await Task.findOneAndDelete({ _id: id, client: client._id });

        if (!deleted) {
            return res.status(404).json({ message: 'Task not found or unauthorized' });
        }

        res.status(200).json({ message: 'Task deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error deleting task' });
    }
});

module.exports = { clientTasksRoutes: router };
