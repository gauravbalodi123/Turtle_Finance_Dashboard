// 📄 routes/clientAdvisorRoutes.js
const express = require('express');
const router = express.Router();
const Client = require('../../models/client');
const Advisor = require('../../models/advisor');
const { protect, authorizeRoles } = require('../../middleware/authMiddleware');

// 🧭 Helper: Get client ID from logged-in user
const getClientId = async (userId) => {
    const client = await Client.findOne({ userId });
    if (!client) return null;
    return client._id;
};

// ✅ GET all advisors for a specific client
router.get('/advisors', protect, authorizeRoles('client'), async (req, res) => {
    try {
        const clientId = await getClientId(req.user._id);
        if (!clientId) return res.status(404).json({ msg: 'Client profile not found' });

        const client = await Client.findById(clientId).populate('advisors', 'advisorFullName email phone');
        if (!client) return res.status(404).json({ msg: 'Client not found' });

        res.status(200).json(client.advisors);
    } catch (e) {
        console.error(e);
        res.status(400).json({ msg: 'Oops, something went wrong while fetching client advisors' });
    }
});

// ✅ GET advisors with search, pagination, sorting (for client dashboard)
router.get('/selectiveAdvisors', protect, authorizeRoles('client'), async (req, res) => {
    try {
        const clientId = await getClientId(req.user._id);
        if (!clientId) return res.status(404).json({ msg: 'Client profile not found' });

        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const search = req.query.search || "";
        const sortField = req.query.sortField;
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        // Find client first to get assigned advisors
        const client = await Client.findById(clientId).populate('advisors');
        if (!client) return res.status(404).json({ msg: 'Client not found' });

        let advisors = client.advisors;

        // Search filter
        if (search) {
            advisors = advisors.filter(a =>
                (a.advisorFullName && a.advisorFullName.toLowerCase().includes(search.toLowerCase())) ||
                (a.email && a.email.toLowerCase().includes(search.toLowerCase())) ||
                (a.phone && a.phone.includes(search))
            );
        }

        // Sorting
        if (sortField) {
            advisors.sort((a, b) => {
                const valA = a[sortField] ?? "";
                const valB = b[sortField] ?? "";
                if (typeof valA === 'string' && typeof valB === 'string') {
                    return sortOrder === 1
                        ? valA.localeCompare(valB)
                        : valB.localeCompare(valA);
                }
                return sortOrder === 1 ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
            });
        }

        const total = advisors.length;
        const paginated = advisors.slice(skip, skip + limit);

        res.status(200).json({ advisors: paginated, total });
    } catch (e) {
        console.error(e);
        res.status(400).json({ msg: 'Oops, something went wrong while fetching selective advisors' });
    }
});


// ✅ GET advisor stats for client (just how many assigned)
router.get('/advisors/stats', protect, authorizeRoles('client'), async (req, res) => {
    try {
        const clientId = await getClientId(req.user._id);
        if (!clientId) return res.status(404).json({ msg: 'Client profile not found' });

        const client = await Client.findById(clientId);
        const totalAdvisors = client?.advisors?.length || 0;

        res.status(200).json({ total: totalAdvisors });
    } catch (e) {
        console.error(e);
        res.status(500).json({ msg: 'Failed to fetch client advisor stats' });
    }
});



// ✅ GET single advisor details for a client
router.get('/advisors/:id', protect, authorizeRoles('client'), async (req, res) => {
    try {
        const clientId = await getClientId(req.user._id);
        if (!clientId) return res.status(404).json({ msg: 'Client profile not found' });

        const client = await Client.findById(clientId);
        if (!client) return res.status(404).json({ msg: 'Client not found' });

        // Check if advisor is assigned to this client
        const advisor = await Advisor.findById(req.params.id);
        if (!advisor || !client.advisors.includes(advisor._id)) {
            return res.status(404).json({ msg: 'Advisor not assigned to this client' });
        }

        res.status(200).json(advisor);
    } catch (e) {
        console.error(e);
        res.status(400).json({ msg: 'Oops, something went wrong while fetching advisor details' });
    }
});



module.exports = {
    clientAdvisorRoutes: router
};
