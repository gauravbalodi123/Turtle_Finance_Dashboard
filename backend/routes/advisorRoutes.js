const express = require('express');
const router = express.Router();
const Advisor = require('../models/advisor')



router.get('/advisors',async (req, res) => {
    try {
        const fetchAllAdvisors = await Advisor.find({});
        res.status(200).json(fetchAllAdvisors);
    }
    catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong while fetching the advisors" });
    }
});


router.post('/addAdvisor', async (req, res) => {
    try {
        const advisorData = req.body;
        await Advisor.create(advisorData);
        res.status(200).json({ msg: "Advisor has been added sucessfully" });
    }
    catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong while creating a advisor" })
    }
});


router.get('/advisors/:id/editAdvisors', async (req, res) => {
    try {
        const { id } = req.params;
        const advisor = await Advisor.findById(id);
        // console.log(Advisor);
        res.status(200).json(advisor);
    }
    catch (e) {
        res.status(400).json({ msg: "Oops , Something went Wrong while fetching the data for a Advisor to edit it" })
    }
});


router.patch('/advisors/:id/editAdvisors', async (req, res) => {
    try {
        const { id } = req.params;
        const advisorData = req.body;
        const updatedAdvisor = await Advisor.findByIdAndUpdate(id, advisorData, {
            new: true,
            runValidators: true,
        });
        res.status(200).json(updatedAdvisor);

    } catch (e) {
        //  Original generic error message
        let response = {
            msg: "Oops , Something went Wrong while editing the data for a advisor"
        };

        //  Mongoose validation errors (e.g., enum, required, etc.)
        if (e.name === "ValidationError") {
            response.details = {};
            for (let field in e.errors) {
                response.details[field] = e.errors[field].message;
            }
        }

        //  MongoDB duplicate key errors (e.g., email or phone must be unique)
        if (e.code === 11000) {
            response.msg = "Duplicate field error";
            response.field = Object.keys(e.keyValue);
            response.value = Object.values(e.keyValue);
        }

        //  Log to server for dev debugging
        console.error("Edit Advisor Error:", e);

        res.status(400).json(response);
    }
});



router.delete('/advisors/:id/', async(req,res)=>{

    const {id} = req.params;
    const deleteAdvisor = await Advisor.findByIdAndDelete(id);
    if(!deleteAdvisor){
       return res.status(404).json({msg:"The Advisor does not exists or cannot be fetched"})
    }
    res.status(200).json({msg : "The Advisor has been successfully deleted"})
})



module.exports = {
    advisorRoutes: router
}












