const express = require('express');
const router = express.Router();
const Client = require('../models/client');



router.get("/clients", async (req, res) => {

    try {
        const fetchAllClients = await Client.find({});
        res.status(200).json(fetchAllClients);
    }
    catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong" });
    }
})

router.post('/addClient', async (req, res) => {
    try {
        const clientData = req.body;
        await Client.create(clientData);
        res.status(200).json({ msg: "Client has been added sucessfully" });
    }
    catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong while creating a client" })
    }
})

router.get('/clients/:id/editClients', async (req, res) => {
    try {
        const { id } = req.params;
        const client = await Client.findById(id);
        // console.log(client);
        res.status(200).json(client);
    }
    catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong while fetching the data for a client to edit it" })
    }
})

router.patch('/clients/:id/editClients', async (req, res) => {
    try {
        const { id } = req.params;
        const clientData = req.body;
        const updatedClient = await Client.findByIdAndUpdate(id, clientData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json(updatedClient);

    } catch (e) {
        // 👇 Original generic error message
        let response = {
            msg: "Oops , Something went Wrong while editing the data for a client"
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
        console.error("Edit Client Error:", e);

        res.status(400).json(response);
    }
});


router.delete('/clients/:id/', async(req,res)=>{

    const {id} = req.params;
    const deleteClient = await Client.findByIdAndDelete(id);
    if(!deleteClient){
       return res.status(404).json({msg:"The Client does not exists or cannot be fetched"})
    }
    res.status(200).json({msg : "The Client has been successfully deleted"})
})








module.exports = {
    clientRoutes: router
}
