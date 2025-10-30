const express = require('express');
const router = express.Router();
const SubscriptionPlan = require('../../models/subscription');
const RiskProfile = require('../../models/riskProfile');
const { protect, authorizeRoles } = require('../../middleware/authMiddleware'); // Import middleware
const File = require('../../models/fileModel'); // Import your models
const KYC = require('../../models/kycData');
const DigioResponse = require('../../models/digioResponse');
const Client = require('../../models/client')
const User = require('../../models/user')
const multer = require('multer');



router.put('/updatePlanByName/:planName', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { priceRupees, priceDollar } = req.body;
    const { planName } = req.params;

    // List of valid plan names
    const validPlans = ['Indian', 'NRI', 'Indian Renewal', 'NRI Renewal'];

    if (!validPlans.includes(planName)) {
      return res.status(400).json({ msg: "Invalid planName. Must be one of: 'Indian', 'NRI', 'Indian Renewal', 'NRI Renewal'" });
    }

    // Validation based on plan
    if (planName === 'Indian' || planName === 'Indian Renewal') {
      if (priceRupees == null) {
        return res.status(400).json({ msg: `${planName} plan requires priceRupees` });
      }
    }

    if (planName === 'NRI' || planName === 'NRI Renewal') {
      if (priceRupees == null || priceDollar == null) {
        return res.status(400).json({ msg: `${planName} plan requires both priceRupees and priceDollar` });
      }
    }

    const updateFields = { planName };
    if (priceRupees != null) updateFields.priceRupees = priceRupees;
    if (priceDollar != null) updateFields.priceDollar = priceDollar;

    const updatedPlan = await SubscriptionPlan.findOneAndUpdate(
      { planName },
      updateFields,
      {
        new: true,
        upsert: true,            // 🔥 Create if not exists
        runValidators: true,
        setDefaultsOnInsert: true
      }
    );

    res.status(200).json({
      msg: `Plan '${planName}' updated successfully`,
      updatedPlan
    });


  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Error updating subscription plan prices" });
  }
});






router.get('/getPlanByName/:planName', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { planName } = req.params;

    // List of valid plan names
    const validPlans = ['Indian', 'NRI', 'Indian Renewal', 'NRI Renewal'];

    if (!validPlans.includes(planName)) {
      return res.status(400).json({ msg: "Invalid planName. Must be one of: 'Indian', 'NRI', 'Indian Renewal', 'NRI Renewal'" });
    }

    const plan = await SubscriptionPlan.findOne({ planName });

    if (!plan) {
      return res.status(404).json({ msg: "Plan not found" });
    }

    res.status(200).json({
      msg: `Plan '${planName}' fetched successfully`,
      plan
    });

  } catch (e) {
    console.error(e);
    res.status(500).json({ msg: "Error fetching subscription plan" });
  }
});



// ✅ Get one specific Risk Profile by its ID (admin view)
router.get('/edit/:id/riskProfile', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;

    const profile = await RiskProfile.findById(id);

    if (!profile) {
      return res.status(404).json({ msg: "Risk profile not found" });
    }

    res.status(200).json(profile);
  } catch (e) {
    console.error("Error fetching risk profile:", e);
    res.status(500).json({
      msg: "Oops, something went wrong while fetching the risk profile data."
    });
  }
});

// PATCH: update specific risk profile by its ID
router.patch('/edit/:id/riskProfile', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    // Find risk profile by its ID
    const existingProfile = await RiskProfile.findById(id);

    if (!existingProfile) {
      return res.status(404).json({ msg: "Risk profile not found." });
    }

    // Update fields
    Object.assign(existingProfile, updatedData);

    const savedProfile = await existingProfile.save();

    res.status(200).json({
      msg: "Risk profile updated successfully.",
      data: savedProfile,
    });
  } catch (e) {
    console.error("Error updating risk profile:", e.message);
    res.status(400).json({ msg: "Failed to update risk profile." });
  }
});













router.get('/clients/aadhaar/download/:clientId', protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const clientId = req.params.clientId;

    const kycRecord = await KYC.findOne({ clientId });

    if (!kycRecord || !kycRecord.aadhaarFileId) {
      return res.status(404).json({ error: 'Aadhaar document not found' });
    }

    const aadhaarFile = await File.findById(kycRecord.aadhaarFileId);

    if (!aadhaarFile) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set headers for download
    res.set({
      'Content-Type': aadhaarFile.contentType,
      'Content-Disposition': `attachment; filename="${aadhaarFile.filename}"`
    });

    return res.send(aadhaarFile.data);

  } catch (error) {
    console.error('Error downloading Aadhaar file:', error);
    res.status(500).json({ error: 'Failed to download Aadhaar document' });
  }
});


router.get('/clients/pan/download/:clientId', protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const clientId = req.params.clientId;

    const kycRecord = await KYC.findOne({ clientId });

    if (!kycRecord || !kycRecord.panFileId) {
      return res.status(404).json({ error: 'PAN document not found' });
    }

    const panFile = await File.findById(kycRecord.panFileId);

    if (!panFile) {
      return res.status(404).json({ error: 'File not found' });
    }

    // Set headers for download
    res.set({
      'Content-Type': panFile.contentType,
      'Content-Disposition': `attachment; filename="${panFile.filename}"`
    });

    return res.send(panFile.data);

  } catch (error) {
    console.error('Error downloading PAN file:', error);
    res.status(500).json({ error: 'Failed to download PAN document' });
  }
});











router.post('/clients/:clientId/digio-response', protect, authorizeRoles('admin'), async (req, res) => {
  try {
    const { clientId } = req.params;
    const { digio_doc_id, message } = req.body;

    if (!digio_doc_id) {
      return res.status(400).json({ msg: "digio_doc_id are required." });
    }

    // Check if the client exists
    const client = await Client.findById(clientId);
    if (!client) {
      return res.status(404).json({ msg: "Client not found." });
    }

    // Optional: Check if digio_doc_id already exists
    const existing = await DigioResponse.findOne({ digio_doc_id });
    if (existing) {
      return res.status(409).json({ msg: "Digio document already exists." });
    }

    const digioResponse = await DigioResponse.create({
      digio_doc_id,
      message,
      userId: client.userId,
      clientId: client._id,
    });

    return res.status(201).json({
      msg: "Digio response successfully saved for the client.",
      data: digioResponse,
    });
  } catch (error) {
    console.error("Error saving Digio response by admin:", error.message);
    return res.status(500).json({ msg: "Internal server error." });
  }
});




// Configure Multer for file uploads
const upload = multer({
  limits: {
    fileSize: 15 * 1024 * 1024 // 15MB limit (under MongoDB's 16MB)
  },
  fileFilter: (req, file, cb) => {
    // Validate file types
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, and PDF files are allowed'));
    }
    cb(null, true);
  }
});





// GET: Get all digio responses for a client
router.get('/clients/:clientId/digio-responses', async (req, res) => {
  try {
    const { clientId } = req.params;

    const responses = await DigioResponse.find({ clientId }).sort({ timestamps: -1 });

    res.status(200).json({ success: true, data: responses });
  } catch (error) {
    console.error('Error fetching digio responses:', error);
    res.status(500).json({ success: false, msg: 'Failed to fetch digio responses.' });
  }
});


const config = {
  UPLOAD_FOLDER: 'uploads',
  DIGIO_UPLOAD_URL: process.env.DIGIO_UPLOAD_URL,
  DIGIO_CLIENT_ID: process.env.DIGIO_CLIENT_ID,
  DIGIO_CLIENT_SECRET: process.env.DIGIO_CLIENT_SECRET,
  DIGIO_RESPONSE_URL: process.env.DIGIO_RESPONSE_URL
};
const axios = require('axios');

router.get("/digioDownload", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { digio_doc_id } = req.query; // You can also use req.body for POST

    if (!digio_doc_id) {
      return res.status(400).json({ msg: "digio_doc_id is required in query." });
    }

    // Create Basic Auth Token from env config
    const authToken = Buffer.from(`${config.DIGIO_CLIENT_ID}:${config.DIGIO_CLIENT_SECRET}`).toString('base64');

    console.log("Calling Digio API for doc ID:", digio_doc_id);

    // Call Digio Download API
    const digioRes = await axios.get(`${config.DIGIO_RESPONSE_URL}`, {
      headers: {
        Authorization: `Basic ${authToken}`,
      },
      params: {
        document_id: digio_doc_id
      },
      responseType: 'arraybuffer'
    });

    console.log("Digio API status:", digioRes.status);
    console.log("Digio headers:", digioRes.headers);

    // Set headers for download
    res.set({
      'Content-Type': 'application/pdf',
      // 'Content-Disposition': `attachment; filename="Digio-Document-${digio_doc_id}.pdf"`
      'Content-Disposition': `inline; filename="Digio-Document-${digio_doc_id}.pdf"`
    });

    res.send(digioRes.data);

  } catch (error) {
    console.error("Error downloading Digio document:", error.message);
    console.error("Status:", error.response?.status);
    console.error("Headers:", error.response?.headers);
    console.error("Data:", error.response?.data?.toString?.() || error.response?.data || error.message);

    if (!res.headersSent) {
      return res.status(500).json({
        msg: "Failed to download Digio document.",
        digioError: error.response?.data
      });
    }
  }
});


// DELETE /admin/digio-response?digio_doc_id=DOCUMENT_ID
router.delete("/digio-response", protect, authorizeRoles("admin"), async (req, res) => {
  try {
    const { digio_doc_id } = req.query;

    if (!digio_doc_id) {
      return res.status(400).json({ msg: "digio_doc_id is required." });
    }

    const deleted = await DigioResponse.findOneAndDelete({ digio_doc_id });

    if (!deleted) {
      return res.status(404).json({ msg: "No Digio response found with the provided digio_doc_id." });
    }

    res.status(200).json({ msg: "Digio response deleted successfully." });
  } catch (error) {
    console.error("Error deleting Digio response:", error);
    res.status(500).json({ msg: "Server error while deleting Digio response." });
  }
});




router.post(
  '/clients/:clientId/aadhaar',
  protect,
  authorizeRoles('admin'),
  upload.single('aadhaar'),
  async (req, res) => {
    try {
      const { clientId } = req.params;

      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded' });
      }

      const client = await Client.findById(clientId);
      console.log(client)
      if (!client) {
        return res.status(404).json({ msg: 'Client not found.' });
      }

      const userId = client.userId;

      const aadhaarFile = new File({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer,
        uploadedBy: req.user._id, // the admin
        clientId: client._id,
        documentType: 'aadhaar',
      });

      const savedFile = await aadhaarFile.save();

      const kycRecord = await KYC.findOneAndUpdate(
        { clientId: client._id },
        {
          $set: {
            userId,
            aadhaarFileId: savedFile._id,
          },
        },
        { upsert: true, new: true }
      );

      res.status(201).json({
        message: 'Aadhaar uploaded by admin successfully',
        fileId: savedFile._id,
        kycId: kycRecord._id,
      });
    } catch (error) {
      console.error('Admin Aadhaar upload error:', error);
      res.status(500).json({ error: 'Failed to upload Aadhaar document' });
    }
  }
);

router.post(
  '/clients/:clientId/pan',
  protect,
  authorizeRoles('admin'),
  upload.single('pan'),
  async (req, res) => {
    try {
      const { clientId } = req.params;

      if (!req.file) {
        return res.status(400).json({ error: 'No PAN card file uploaded' });
      }

      const client = await Client.findById(clientId);
      console.log(client)
      if (!client) {
        return res.status(404).json({ msg: 'Client not found.' });
      }

      const userId = client.userId;

      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
      if (!allowedTypes.includes(req.file.mimetype)) {
        return res.status(400).json({ error: 'Only PDF, JPEG, or PNG files are allowed for PAN card' });
      }

      const panFile = new File({
        filename: req.file.originalname,
        contentType: req.file.mimetype,
        size: req.file.size,
        data: req.file.buffer,
        uploadedBy: req.user._id,
        clientId: client._id,
        documentType: 'pan',
      });

      const savedFile = await panFile.save();

      const kycRecord = await KYC.findOneAndUpdate(
        { clientId: client._id },
        {
          $set: {
            userId,
            panFileId: savedFile._id,
          },
        },
        { upsert: true, new: true }
      );

      res.status(201).json({
        success: true,
        message: 'PAN uploaded by admin successfully',
        fileId: savedFile._id,
        kycId: kycRecord._id,
      });
    } catch (error) {
      console.error('Admin PAN upload error:', error);
      res.status(500).json({ error: 'Failed to upload PAN document' });
    }
  }
);


module.exports = router; 
