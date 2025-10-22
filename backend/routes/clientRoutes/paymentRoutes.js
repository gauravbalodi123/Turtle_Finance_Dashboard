const express = require('express');
const router = express.Router();
const Payment = require('../../models/payment'); // Adjust the path to your model
const Client = require('../../models/client')
const SubscriptionPlan = require('../../models/subscription');
const { protect, authorizeRoles } = require('../../middleware/authMiddleware'); // Import middleware




// GET /client/payments/plan
router.get('/payments/plan', protect, authorizeRoles('client'), async (req, res) => {
  try {
    // 1️⃣ Find the client based on logged-in user
    const client = await Client.findOne({ userId: req.user._id });

    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    // 2️⃣ Get clientType (Indian or NRI)
    const clientType = client.clientType;
    if (!clientType) {
      return res.status(400).json({ message: "Client type not set" });
    }

    // 3️⃣ Validate plan name
    const validPlans = ['Indian', 'NRI', 'Indian Renewal', 'NRI Renewal'];
    if (!validPlans.includes(clientType)) {
      return res.status(400).json({ message: "Invalid clientType in client record" });
    }

    // 4️⃣ Fetch subscription plan based on clientType
    const plan = await SubscriptionPlan.findOne({ planName: clientType });

    if (!plan) {
      return res.status(404).json({ message: `No plan found for ${clientType}` });
    }

    // 5️⃣ Return plan details
    return res.status(200).json({
      message: `Plan for clientType '${clientType}' fetched successfully`,
      plan
    });

  } catch (error) {
    console.error("Error fetching client plan:", error);
    return res.status(500).json({ message: "Server error" });
  }
});




// POST /payments
router.post('/payments', protect, authorizeRoles('client'), async (req, res) => {
  try {
    const userId = req.user._id;
    const client = await Client.findOne({ userId: req.user._id });
    const clientId = client._id;

    if (!userId || !clientId) {
      return res.status(400).json({ message: 'userId and clientId are required' });
    }

    const payment = new Payment({
      userId,
      clientId,
      //amount: 0, // set default or required in frontend
      // method: 'manual', // or fetch from req.body if needed
      status: 'completed'
    });

    await payment.save();
    res.status(201).json({ message: 'Payment submitted successfully', payment });

  } catch (error) {
    console.error('Error submitting payment:', error);
    res.status(500).json({ message: 'Server error' });
  }
});


// GET /client/payments/status
router.get('/payments/status', protect, authorizeRoles('client'), async (req, res) => {
  try {
    const client = await Client.findOne({ userId: req.user._id });
    if (!client) {
      return res.status(404).json({ message: "Client not found" });
    }

    const payment = await Payment.findOne({ clientId: client._id }).sort({ createdAt: -1 });

    if (!payment) {
      return res.json({ status: 'pending' }); // No payment yet
    }

    return res.json({ status: payment.status });
  } catch (error) {
    console.error("Error fetching payment status:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// GET /payments/completed - Returns completed payments with client details
router.get('/payments/completed', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const completedPayments = await Payment.find({ status: 'completed' }).populate('clientId');
    res.status(200).json(completedPayments);
  } catch (error) {
    console.error("Error fetching completed payments:", error);
    res.status(500).json({ message: "Server error" });
  }
});




module.exports = router;
