const { protect, authorizeRoles } = require('../../middleware/authMiddleware'); // Import middleware
const express = require('express');
const router = express.Router();
const multer = require('multer');
const TaxPlanningForm = require('../../models/taxPlanningForm');
const File = require('../../models/fileModel');
const Client = require('../../models/client');
const CreditCardForm = require('../../models/creditCardForm');
const InsuranceForm = require('../../models/insuranceForm');
const WillDraftingForm = require('../../models/willDraftingForm');




const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 15 * 1024 * 1024, // 15MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error('Only JPEG, PNG, and PDF files are allowed'));
    }
    cb(null, true);
  }
});



router.post('/tax-planning', protect, authorizeRoles("client"), upload.fields([
  { name: 'salary_slip', maxCount: 1 },
  { name: 'previous_it_return', maxCount: 1 },
  { name: 'tax_declaration', maxCount: 1 },
  { name: 'capital_gain_statement', maxCount: 1 },
  { name: 'unrealised_gains_losses', maxCount: 1 },
  { name: 'additional_documents_file', maxCount: 1 },
]), async (req, res) => {
  try {
    const userId = req.user._id;

    const client = await Client.findOne({ userId });
    if (!client) {
      return res.status(404).json({ msg: "Client not found for this user." });
    }

    const clientId = client._id;
    const files = req.files;
    const savedFileRefs = {};

    const fileFields = [
      'salary_slip',
      'previous_it_return',
      'tax_declaration',
      'capital_gain_statement',
      'unrealised_gains_losses',
      'additional_documents_file'
    ];

    for (const field of fileFields) {
      if (files && files[field] && files[field][0]) {
        const file = files[field][0];
        const fileDoc = new File({
          filename: file.originalname,
          contentType: file.mimetype,
          size: file.size,
          data: file.buffer,
          uploadedBy: userId,
          clientId:clientId
        });
        const savedFile = await fileDoc.save();
        savedFileRefs[field] = savedFile._id;
      }
    }

    // Combine request body with file refs and identifiers
    const formData = new TaxPlanningForm({
      ...req.body,
      ...savedFileRefs,
      userId: req.user._id,
      clientId: client._id
    });

    const savedForm = await formData.save();

    res.status(201).json({
      message: "Tax Planning form submitted successfully",
      formId: savedForm._id,
      savedFiles: savedFileRefs,
    });

  } catch (error) {
    console.error("Error saving tax planning form:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});



router.post(
  '/credit-card',
  protect,
  authorizeRoles('client'),
  upload.single('additional_documents_file'),
  async (req, res) => {
    try {
      const userId = req.user._id;

      // Ensure file was uploaded
      let fileId = null;
      if (req.file) {
        const client = await Client.findOne({ userId: userId });
        if (!client) {
          return res.status(404).json({ message: 'Client not found' });
        }

        const file = new File({
          filename: req.file.originalname,
          contentType: req.file.mimetype,
          size: req.file.size,
          data: req.file.buffer,
          uploadedBy: userId,
          clientId: client._id
        });

        const savedFile = await file.save();
        fileId = savedFile._id;
      }

      const client = await Client.findOne({ userId: userId });
      if (!client) {
        return res.status(404).json({ message: 'Client not found' });
      }

      const form = new CreditCardForm({
        ...req.body,
        userId: userId,
        clientId: client._id,
        additional_documents_file: fileId
      });

      const savedForm = await form.save();

      res.status(201).json({
        message: 'Credit Card form submitted successfully',
        formId: savedForm._id
      });
    } catch (error) {
      console.error('Error saving credit card form:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);

router.post(
  '/insurance',
  protect,
  authorizeRoles('client'),
  upload.fields([
    { name: 'life_insurance_policy_file', maxCount: 1 },
    { name: 'health_insurance_policy_file', maxCount: 1 },
    { name: 'additional_documents_file', maxCount: 1 },
  ]),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const client = await Client.findOne({ userId });
      if (!client) return res.status(404).json({ message: 'Client not found' });

      const fileRefs = {};
      const fileFields = ['life_insurance_policy_file', 'health_insurance_policy_file', 'additional_documents_file'];

      for (const field of fileFields) {
        if (req.files && req.files[field]) {
          const fileData = req.files[field][0];
          const file = new File({
            filename: fileData.originalname,
            contentType: fileData.mimetype,
            size: fileData.size,
            data: fileData.buffer,
            uploadedBy: userId,
            clientId: client._id
          });
          const savedFile = await file.save();
          fileRefs[field] = savedFile._id;
        }
      }

      const insuranceData = {
        userId:userId,
        clientId: client._id,
        ...req.body,
        ...fileRefs
      };

      const insurance = new InsuranceForm(insuranceData);
      const savedInsurance = await insurance.save();

      res.status(201).json({
        message: 'Insurance form submitted successfully',
        insuranceId: savedInsurance._id
      });
    } catch (err) {
      console.error('Insurance form error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);



router.post(
  '/will-drafting',
  protect,
  authorizeRoles('client'),
  upload.fields([
    { name: 'additional_documents_file', maxCount: 1 },
    // Add more file fields here if needed
  ]),
  async (req, res) => {
    try {
      const userId = req.user._id;
      const client = await Client.findOne({ userId });
      if (!client) return res.status(404).json({ message: 'Client not found' });

      const fileRefs = {};
      const fileFields = ['additional_documents_file'];

      for (const field of fileFields) {
        if (req.files && req.files[field]) {
          const fileData = req.files[field][0];
          const file = new File({
            filename: fileData.originalname,
            contentType: fileData.mimetype,
            size: fileData.size,
            data: fileData.buffer,
            uploadedBy: userId,
            clientId: client._id,
          });
          const savedFile = await file.save();
          fileRefs[field] = savedFile._id;
        }
      }

      const willData = {
        userId: userId,
        clientId: client._id,
        // Spread req.body for all form fields (witnesses, executors, beneficiaries, assets, etc.)
        ...req.body,
        ...fileRefs,
      };

      // Create or update existing form
      let willDraftingForm = await WillDraftingForm.findOne({ userId });
      if (willDraftingForm) {
        willDraftingForm = Object.assign(willDraftingForm, willData);
      } else {
        willDraftingForm = new WillDraftingForm(willData);
      }

      const savedForm = await willDraftingForm.save();

      res.status(201).json({
        message: 'Will drafting form submitted successfully',
        willDraftingFormId: savedForm._id,
      });
    } catch (err) {
      console.error('Will drafting form error:', err);
      res.status(500).json({ message: 'Internal server error' });
    }
  }
);



module.exports = router;