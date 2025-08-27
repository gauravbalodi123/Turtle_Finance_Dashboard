const express = require('express');
const router = express.Router();
const Client = require('../../models/client');
const { protect, authorizeRoles } = require('../../middleware/authMiddleware'); // Import middleware


// GET all clients (protected, only admins can access)
router.get("/clients", protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const fetchAllClients = await Client.find({}).populate('advisors', 'advisorFullName email'); // 👈 ADD THIS
        res.status(200).json(fetchAllClients);
    } catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong" });
    }
});

// ✅ Get paginated clients
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

        // 🧠 Default sort is createdAt desc unless overridden
        const sortBy = sortField ? { [sortField]: sortOrder } : { subscriptionDate: -1 };

        const [clients, total] = await Promise.all([
            Client.find(searchFilter)
                .sort(sortBy)
                .skip(skip)
                .limit(limit)
                .populate('advisors', 'advisorFullName email'),
            Client.countDocuments(searchFilter)
        ]);

        res.status(200).json({ clients, total });
    } catch (e) {
        console.error(e);
        res.status(400).json({ msg: "Oops, something went wrong while fetching clients" });
    }
});




// ✅ Get client stats (total, active, expired)
router.get('/clients/stats', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const [total, active, expired] = await Promise.all([
            Client.countDocuments({}),
            Client.countDocuments({ subscriptionStatus: "Active" }),
            Client.countDocuments({ subscriptionStatus: "Expired" })
        ]);

        res.status(200).json({ total, active, expired });
    } catch (e) {
        console.error("Error fetching client stats", e);
        res.status(500).json({ msg: "Failed to fetch client stats" });
    }
});



// GET summary stats for clients (protected, admin only)
// router.get('/clients/summary', protect, authorizeRoles('admin'), async (req, res) => {
//     try {
//         const totalClients = await Client.countDocuments({});
//         const activeClients = await Client.countDocuments({ subscriptionStatus: "Active" });
//         const expiredClients = await Client.countDocuments({ subscriptionStatus: "Expired" });

//         // For revenue (you’ll need a Payment model for this part):
//         // const totalRevenueResult = await Payment.aggregate([
//         //     { $match: { status: "completed" } },
//         //     { $group: { _id: null, totalRevenue: { $sum: "$amount" } } }
//         // ]);

//         // const totalRevenue = totalRevenueResult[0]?.totalRevenue || 0;

//         res.status(200).json({
//             totalClients,
//             activeClients,
//             expiredClients,
//             // totalRevenue
            
//         });
//     } catch (e) {
//         console.error(e);
//         res.status(500).json({ msg: "Failed to fetch client summary." });
//     }
// });



// POST add a new client (protected, only admins can access)
router.post('/addClient', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const clientData = req.body;
        await Client.create(clientData);
        res.status(200).json({ msg: "Client has been added successfully" });
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
    res.status(200).json({ msg: "The Client has been successfully deleted" });
});

module.exports = {
    adminClientRoutes: router
}
