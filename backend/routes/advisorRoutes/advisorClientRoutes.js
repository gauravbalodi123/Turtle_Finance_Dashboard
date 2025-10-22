// 📄 routes/advisorClientRoutes.js
const express = require('express');
const router = express.Router();
const Client = require('../../models/client');
const Advisor = require('../../models/advisor');
const { protect, authorizeRoles } = require('../../middleware/authMiddleware');

// 🧠 Helper: Build advisor filter
const buildAdvisorFilter = (advisorId, extraFilter = {}) => ({
    advisors: advisorId,
    ...extraFilter
});

// 🧭 Helper: Get advisor ID from logged-in user
const getAdvisorId = async (userId) => {
    const advisor = await Advisor.findOne({ userId });
    if (!advisor) return null;
    return advisor._id;
};

// ✅ GET all clients for a specific advisor
router.get('/clients', protect, authorizeRoles('advisor'), async (req, res) => {
    try {
        const advisorId = await getAdvisorId(req.user._id);
        if (!advisorId) return res.status(404).json({ msg: 'Advisor profile not found' });

        const clients = await Client.find(buildAdvisorFilter(advisorId))
            .populate('advisors', 'advisorFullName email');

        res.status(200).json(clients);
    } catch (e) {
        console.error(e);
        res.status(400).json({ msg: 'Oops, something went wrong while fetching advisor clients' });
    }
});

// ✅ GET selective clients with search, pagination, sorting
router.get('/selectiveClients', protect, authorizeRoles('advisor'), async (req, res) => {
    try {
        const advisorId = await getAdvisorId(req.user._id);
        if (!advisorId) return res.status(404).json({ msg: 'Advisor profile not found' });

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";
        const sortField = req.query.sortField;
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        const searchFilter = search ? {
            $or: [
                { fullName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { companyName: { $regex: search, $options: "i" } },
                { subscriptionStatus: { $regex: search, $options: "i" } }
            ]
        } : {};

        const finalFilter = buildAdvisorFilter(advisorId, {
            ...searchFilter,
            subscriptionStatus: { $ne: "Prospect" }
        });

        const sortBy = sortField ? { [sortField]: sortOrder } : { subscriptionDate: -1 };

        const [clients, total] = await Promise.all([
            Client.find(finalFilter)
                .sort(sortBy)
                .skip(skip)
                .limit(limit)
                .populate('advisors', 'advisorFullName email'),
            Client.countDocuments(finalFilter)
        ]);

        res.status(200).json({ clients, total });
    } catch (e) {
        console.error(e);
        res.status(400).json({ msg: 'Oops, something went wrong while fetching advisor selective clients' });
    }
});

// ✅ GET only Prospects for the advisor
router.get('/selectiveProspects', protect, authorizeRoles('advisor'), async (req, res) => {
    try {
        const advisorId = await getAdvisorId(req.user._id);
        if (!advisorId) return res.status(404).json({ msg: 'Advisor profile not found' });

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";
        const sortField = req.query.sortField;
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        const searchFilter = search ? {
            $or: [
                { fullName: { $regex: search, $options: "i" } },
                { email: { $regex: search, $options: "i" } },
                { phone: { $regex: search, $options: "i" } },
                { companyName: { $regex: search, $options: "i" } },
                { subscriptionStatus: { $regex: search, $options: "i" } }
            ]
        } : {};

        const finalFilter = buildAdvisorFilter(advisorId, {
            ...searchFilter,
            subscriptionStatus: "Prospect"
        });

        const sortBy = sortField ? { [sortField]: sortOrder } : { subscriptionDate: -1 };

        const [prospects, total] = await Promise.all([
            Client.find(finalFilter)
                .sort(sortBy)
                .skip(skip)
                .limit(limit)
                .populate('advisors', 'advisorFullName email'),
            Client.countDocuments(finalFilter)
        ]);

        res.status(200).json({ clients: prospects, total });
    } catch (e) {
        console.error(e);
        res.status(400).json({ msg: 'Oops, something went wrong while fetching advisor prospects' });
    }
});

// ✅ GET client stats for advisor (exclude prospects)
router.get('/clients/stats', protect, authorizeRoles('advisor'), async (req, res) => {
    try {
        const advisorId = await getAdvisorId(req.user._id);
        if (!advisorId) return res.status(404).json({ msg: 'Advisor profile not found' });

        const [total, active, expired, upForRenewal, deadpool] = await Promise.all([
            Client.countDocuments(buildAdvisorFilter(advisorId, { subscriptionStatus: { $ne: "Prospect" } })),
            Client.countDocuments(buildAdvisorFilter(advisorId, { subscriptionStatus: "Active" })),
            Client.countDocuments(buildAdvisorFilter(advisorId, { subscriptionStatus: "Expired" })),
            Client.countDocuments(buildAdvisorFilter(advisorId, { subscriptionStatus: "Up for Renewal" })),
            Client.countDocuments(buildAdvisorFilter(advisorId, { subscriptionStatus: "Deadpool" }))
        ]);

        res.status(200).json({ total, active, expired, upForRenewal, deadpool });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Failed to fetch advisor client stats' });
    }
});


// ✅ GET prospect stats for advisor
router.get('/prospects/stats', protect, authorizeRoles('advisor'), async (req, res) => {
    try {
        const advisorId = await getAdvisorId(req.user._id);
        if (!advisorId) return res.status(404).json({ msg: 'Advisor profile not found' });

        const totalProspects = await Client.countDocuments(
            buildAdvisorFilter(advisorId, { subscriptionStatus: "Prospect" })
        );

        res.status(200).json({ total: totalProspects });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Failed to fetch advisor prospect stats' });
    }
});

// ✅ GET a single client (ensure advisor has access)
router.get('/clients/:id', protect, authorizeRoles('advisor'), async (req, res) => {
    try {
        const advisorId = await getAdvisorId(req.user._id);
        if (!advisorId) return res.status(404).json({ msg: 'Advisor profile not found' });

        const client = await Client.findOne({
            _id: req.params.id,
            advisors: advisorId
        }).populate('advisors', 'advisorFullName email');

        if (!client) {
            return res.status(404).json({ msg: 'Client not found or access denied' });
        }

        res.status(200).json(client);
    } catch (e) {
        console.error(e);
        res.status(400).json({ msg: 'Oops, something went wrong while fetching client details' });
    }
});

// ✅ PATCH update client (ensure advisor has access)
router.patch('/clients/:id', protect, authorizeRoles('advisor'), async (req, res) => {
    try {
        const advisorId = await getAdvisorId(req.user._id);
        if (!advisorId) return res.status(404).json({ msg: 'Advisor profile not found' });

        const client = await Client.findOne({ _id: req.params.id, advisors: advisorId });
        if (!client) {
            return res.status(404).json({ msg: 'Client not found or access denied' });
        }

        const updatedClient = await Client.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        ).populate('advisors', 'advisorFullName email');

        res.status(200).json(updatedClient);
    } catch (e) {
        console.error(e);
        res.status(400).json({ msg: 'Oops, something went wrong while updating client' });
    }
});

// ✅ DELETE client (ensure advisor has access)
router.delete('/clients/:id', protect, authorizeRoles('advisor'), async (req, res) => {
    try {
        const advisorId = await getAdvisorId(req.user._id);
        if (!advisorId) return res.status(404).json({ msg: 'Advisor profile not found' });

        const client = await Client.findOne({ _id: req.params.id, advisors: advisorId });
        if (!client) {
            return res.status(404).json({ msg: 'Client not found or access denied' });
        }

        await Client.findByIdAndDelete(req.params.id);

        res.status(200).json({ msg: 'Client deleted successfully' });
    } catch (e) {
        console.error(e);
        res.status(400).json({ msg: 'Oops, something went wrong while deleting client' });
    }
});

module.exports = {
    advisorClientRoutes: router
};
