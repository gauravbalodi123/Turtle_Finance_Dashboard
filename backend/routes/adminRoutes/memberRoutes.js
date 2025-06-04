const express = require('express');
const router = express.Router();
const Member = require('../../models/member');

// GET all members
router.get('/members', async (req, res) => {
    try {
        const allMembers = await Member.find({})
            .populate('client')
            .populate('booking');
         console.log(allMembers);
        res.status(200).json(allMembers);
        
    } catch (e) {
        res.status(400).json({ msg: "Oops, something went wrong while fetching members." });
    }
});

// GET a single member by ID
router.get('/members/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const member = await Member.findById(id)
            .populate('client')
            .populate('booking');

        if (!member) {
            return res.status(404).json({ msg: "Member not found." });
        }

        res.status(200).json(member);
    } catch (e) {
        res.status(400).json({ msg: "Oops, something went wrong while fetching the member." });
    }
});

module.exports = {
    adminMemberRoutes: router
};
