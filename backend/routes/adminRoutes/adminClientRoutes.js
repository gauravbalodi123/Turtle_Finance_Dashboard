const express = require('express');
const router = express.Router();
const Client = require('../../models/client');
const { protect, authorizeRoles } = require('../../middleware/authMiddleware'); // Import middleware
const { sendClientUpsert, sendClientDelete } = require('../../webhooks/webhookClientSync');
const RiskProfile = require('../../models/riskProfile');
const KYC = require('../../models/kycData');
const DigioResponse = require('../../models/digioResponse');


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
        const subscriptionStatus = req.query.subscriptionStatus || null; // 👈 new filter param

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

        // 🧠 Build main filter
        const finalFilter = {
            ...searchFilter,
            // Always exclude prospects
            subscriptionStatus: { $ne: "Prospect" },
        };

        // 🧩 Add optional status filter
        if (subscriptionStatus && subscriptionStatus !== "null") {
            // Merge it with the exclusion rule
            finalFilter.subscriptionStatus = {
                $eq: subscriptionStatus
            };
        }

        const sortBy = sortField
            ? { [sortField]: sortOrder }
            : { subscriptionDate: -1 };

        const [clients, total] = await Promise.all([
            Client.find(finalFilter)
                .sort(sortBy)
                .skip(skip)
                .limit(limit)
                .populate('advisors', 'advisorFullName email'),
            Client.countDocuments(finalFilter),
        ]);

        res.status(200).json({ clients, total });
    } catch (e) {
        console.error("Error fetching selective clients:", e);
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
        console.error("Add Client Error:", e); // Log full error in backend console
        res.status(400).json({
            msg: "Client creation failed",
            error: e.message,
            details: e.errors || e,
        });
    }

});

// GET client details for editing (protected, only admins can access)
router.get('/clients/:id/editClients', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const { id } = req.params;

        // ✅ Populate advisors (only needed fields)
        const client = await Client.findById(id)
            .populate('advisors', 'advisorFullName email');

        if (!client) {
            return res.status(404).json({ msg: "Client not found" });
        }

        res.status(200).json(client);
    } catch (e) {
        console.error("Error fetching client details:", e);
        res.status(500).json({
            msg: "Oops, something went wrong while fetching the data for a client to edit it"
        });
    }
});


// PATCH update client details (protected, only admins can access)
router.patch('/clients/:id/editClients', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const { id } = req.params;
        const clientData = req.body;

        // ✅ Update and populate advisors for immediate return
        const updatedClient = await Client.findByIdAndUpdate(id, clientData, {
            new: true,
            runValidators: true,
        }).populate('advisors', 'advisorFullName email');

        if (!updatedClient) {
            return res.status(404).json({ msg: "Client not found" });
        }

        // Fire-and-forget webhook
        sendClientUpsert(updatedClient, 'updated', 'Clients')
            .catch(err => console.error('[webhook] client.updated failed:', err?.message));

        res.status(200).json(updatedClient);
    } catch (e) {
        console.error("Edit Client Error:", e);

        let response = {
            msg: "Oops, something went wrong while editing the data for a client"
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









// ✅ GET General Info (aggregated data for one client)
router.get('/clients/:id/general-info', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const clientId = req.params.id;

        // --- 1️⃣ Fetch Client Basic Info ---
        const client = await Client.findById(clientId)
            .populate('advisors', 'advisorFullName email')
            .lean();

        if (!client) {
            return res.status(404).json({ msg: "Client not found" });
        }

        // --- 2️⃣ Fetch Risk Profiles (Sorted by submittedAt, fallback to createdAt if missing) ---
        const riskProfiles = await RiskProfile.find({ clientId })
            .sort({ submittedAt: -1, createdAt: -1 }) // 👈 updated line
            .lean();

        const latestRiskProfile = riskProfiles[0] || null;
        const olderRiskProfiles = riskProfiles.slice(1);

        // --- 3️⃣ Fetch KYC Data ---
        const kycs = await KYC.find({ clientId })
            .populate('aadhaarFileId panFileId', 'filename createdAt')
            .sort({ createdAt: -1 })
            .lean();

        const latestKYC = kycs[0] || null;
        const olderKYC = kycs.slice(1);

        // --- 4️⃣ Fetch Digio Responses ---
        const digios = await DigioResponse.find({ clientId })
            .sort({ timestamps: -1 })
            .lean();

        const latestDigio = digios[0] || null;
        const olderDigio = digios.slice(1);

        // --- 5️⃣ Construct Response ---
        const generalInfo = {
            client: {
                fullName: client.fullName,
                email: client.email,
                phone: client.phone,
                subscriptionStatus: client.subscriptionStatus,
                subscriptionDate: client.subscriptionDate,
                subscriptionDue: client.subscriptionDue,
                advisors: client.advisors || [],
            },
            riskProfiles: {
                latest: latestRiskProfile,
                older: olderRiskProfiles,
            },
            kyc: {
                latest: latestKYC,
                older: olderKYC,
            },
            digio: {
                latest: latestDigio,
                older: olderDigio,
            },
        };

        res.status(200).json(generalInfo);
    } catch (err) {
        console.error("Error fetching general info:", err);
        res.status(500).json({
            msg: "Failed to fetch client general info",
            error: err.message,
        });
    }
});





module.exports = {
    adminClientRoutes: router
}
