const express = require('express');
const router = express.Router();
const Client = require('../../models/client');
const { protect, authorizeRoles } = require('../../middleware/authMiddleware'); // Import middleware
const { sendClientUpsert, sendClientDelete } = require('../../webhooks/webhookClientSync');


// GET all clients (protected, only admins can access)
router.get("/clients", protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const fetchAllClients = await Client.find({}).populate('advisors', 'advisorFullName email'); // 👈 ADD THIS
        res.status(200).json(fetchAllClients);
    } catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong" });
    }
});


// router.get("/selectiveClients", protect, authorizeRoles('admin'), async (req, res) => {
//     try {
//         const page = parseInt(req.query.page) || 1;
//         const limit = parseInt(req.query.limit) || 10;
//         const skip = (page - 1) * limit;

//         const search = req.query.search || "";
//         const sortField = req.query.sortField;
//         const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

//         // 🔍 Global search filter
//         const searchFilter = search
//             ? {
//                 $or: [
//                     { fullName: { $regex: search, $options: "i" } },
//                     { email: { $regex: search, $options: "i" } },
//                     { phone: { $regex: search, $options: "i" } },
//                     { companyName: { $regex: search, $options: "i" } },
//                     { subscriptionStatus: { $regex: search, $options: "i" } }
//                 ]
//             }
//             : {};

//         // 🧠 Default sort is createdAt desc unless overridden
//         const sortBy = sortField ? { [sortField]: sortOrder } : { subscriptionDate: -1 };

//         const [clients, total] = await Promise.all([
//             Client.find(searchFilter)
//                 .sort(sortBy)
//                 .skip(skip)
//                 .limit(limit)
//                 .populate('advisors', 'advisorFullName email'),
//             Client.countDocuments(searchFilter)
//         ]);

//         res.status(200).json({ clients, total });
//     } catch (e) {
//         console.error(e);
//         res.status(400).json({ msg: "Oops, something went wrong while fetching clients" });
//     }
// });


router.get("/selectiveClients", protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search || "";
        const sortField = req.query.sortField;
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        // 🔍 Global search filter
        const searchFilter = search
            ? {
                $or: [
                    { fullName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } },
                    { companyName: { $regex: search, $options: "i" } },
                    { subscriptionStatus: { $regex: search, $options: "i" } }
                ]
            }
            : {};

        // 🚫 Exclude prospects
        const finalFilter = { ...searchFilter, subscriptionStatus: { $ne: "Prospect" } };

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
        res.status(400).json({ msg: "Oops, something went wrong while fetching clients" });
    }
});




// ✅ Get paginated prospects only
router.get("/selectiveProspects", protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const search = req.query.search || "";
        const sortField = req.query.sortField;
        const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;

        // 🔍 Global search filter
        const searchFilter = search
            ? {
                $or: [
                    { fullName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                    { phone: { $regex: search, $options: "i" } },
                    { companyName: { $regex: search, $options: "i" } },
                    { subscriptionStatus: { $regex: search, $options: "i" } }
                ]
            }
            : {};

        // ✅ Only prospects
        const finalFilter = { ...searchFilter, subscriptionStatus: "Prospect" };

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
        res.status(400).json({ msg: "Oops, something went wrong while fetching prospects" });
    }
});




router.get('/clients/stats', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const [total, active, expired, upForRenewal, deadpool] = await Promise.all([
            // 🚫 Exclude Prospects from total count
            Client.countDocuments({ subscriptionStatus: { $ne: "Prospect" } }),
            Client.countDocuments({ subscriptionStatus: "Active" }),
            Client.countDocuments({ subscriptionStatus: "Expired" }),
            Client.countDocuments({ subscriptionStatus: "Up for Renewal" }),
            Client.countDocuments({ subscriptionStatus: "Deadpool" })
        ]);

        res.status(200).json({ total, active, expired, upForRenewal, deadpool });
    } catch (e) {
        console.error("Error fetching client stats", e);
        res.status(500).json({ msg: "Failed to fetch client stats" });
    }
});



// ✅ Get prospect stats (only total prospects)
router.get('/prospects/stats', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const totalProspects = await Client.countDocuments({ subscriptionStatus: "Prospect" });

        res.status(200).json({ total: totalProspects });
    } catch (e) {
        console.error("Error fetching prospect stats", e);
        res.status(500).json({ msg: "Failed to fetch prospect stats" });
    }
});



// POST add a new client (protected, only admins can access)
router.post('/addClient', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const clientData = req.body;
        const newClient = await Client.create(clientData);

        sendClientUpsert(newClient, 'created', 'Clients')
            .catch(err => console.error('[webhook] client.created failed:', err?.message));

        res.status(200).json({ msg: "Client has been added successfully", client: newClient });
    } catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong while creating a client" });
    }
});

// GET client details for editing (protected, only admins can access)
router.get('/clients/:id/editClients', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findById(id);
        res.status(200).json(client);
    } catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong while fetching the data for a client to edit it" });
    }
});

// PATCH update client details (protected, only admins can access)
router.patch('/clients/:id/editClients', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const clientData = req.body;
        const updatedClient = await Client.findByIdAndUpdate(id, clientData, {
            new: true,
            runValidators: true,
        });

        if (updatedClient) {
            // fire-and-forget webhook without void
            sendClientUpsert(updatedClient, 'updated', 'Clients')
                .catch(err => console.error('[webhook] client.updated failed:', err?.message));
        }

        res.status(200).json(updatedClient);
    } catch (e) {
        let response = {
            msg: "Oops , Something went Wrong while editing the data for a client"
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

        console.error("Edit Client Error:", e);
        res.status(400).json(response);
    }
});



// DELETE client (protected, only admins can access)
router.delete('/clients/:id/', protect, authorizeRoles('admin'), async (req, res) => {
    const { id } = req.params;
    const deleteClient = await Client.findByIdAndDelete(id);

    if (!deleteClient) {
        return res.status(404).json({ msg: "The Client does not exist or cannot be fetched" });
    }

    // fire-and-forget webhook without void
    sendClientDelete(id, 'Clients')
        .catch(err => console.error('[webhook] client.deleted failed:', err?.message));

    res.status(200).json({ msg: "The Client has been successfully deleted" });
});


module.exports = {
    adminClientRoutes: router
}
