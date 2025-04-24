const express = require('express');
const router = express.Router();
const Client = require('../../models/client');
const { protect, authorizeRoles } = require('../../middleware/authMiddleware'); // Import middleware

// GET all clients (protected, only admins can access)
router.get("/clients", protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const fetchAllClients = await Client.find({});
        res.status(200).json(fetchAllClients);
    } catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong" });
    }
});

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
