const { protect, authorizeRoles } = require('../../middleware/authMiddleware');
const express = require('express');
const router = express.Router();
const multer = require('multer');
const File = require('../../models/fileModel');
const KYC = require('../../models/kycData');
const Client = require('../../models/client');

// Configure Multer for file uploads
const upload = multer({
    limits: {
        fileSize: 15 * 1024 * 1024 // 15MB limit (under MongoDB's 16MB)
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (!allowedTypes.includes(file.mimetype)) {
            return cb(new Error(`Invalid file type: ${file.mimetype}. Only JPEG, PNG, and PDF are allowed.`));
        }
        cb(null, true);
    }
});

// ✅ Middleware wrapper to catch Multer errors
const uploadMiddleware = (fieldName) => (req, res, next) => {
    upload.single(fieldName)(req, res, (err) => {
        if (err) {
            console.error(`[UPLOAD ERROR] Field: ${fieldName}, User: ${req.user?._id}, Details:`, err);
            if (err.code === "LIMIT_FILE_SIZE") {
                return res.status(400).json({
                    error: `File too large. Max size is 15MB.`,
                    details: err.message
                });
            }
            return res.status(400).json({ error: err.message });
        }
        next();
    });
};


// ---------------- Aadhaar Upload ----------------
router.post('/aadhaar', protect, authorizeRoles("client"), uploadMiddleware('aadhaar'), async (req, res) => {
    console.log('REQ.FILE:', req.file);
    console.log('REQ.BODY:', req.body);

    try {
        const userId = req.user._id;

        if (!req.file) {
            console.warn(`[AADHAAR] User ${userId} tried to upload but no file found.`);
            return res.status(400).json({ error: 'No Aadhaar file uploaded' });
        }

        const client = await Client.findOne({ userId });
        if (!client) {
            console.error(`[AADHAAR] User ${userId} has no client record.`);
            return res.status(404).json({ msg: "Client not found for this user." });
        }

        const aadhaarFile = new File({
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            size: req.file.size,
            data: req.file.buffer,
            uploadedBy: userId,
            clientId: client._id
        });

        const savedFile = await aadhaarFile.save();

        const kycRecord = await KYC.findOneAndUpdate(
            { userId },
            { $set: { clientId: client._id, aadhaarFileId: savedFile._id } },
            { upsert: true, new: true }
        );

        res.status(201).json({
            message: 'Aadhaar document uploaded successfully',
            fileId: savedFile._id,
            kycId: kycRecord._id
        });

    } catch (error) {
        console.error(`[AADHAAR ERROR] User: ${req.user?._id}, Details:`, error);
        res.status(500).json({ error: 'Failed to upload Aadhaar document' });
    }
});


// ---------------- PAN Upload ----------------
router.post('/pan', protect, authorizeRoles("client"), uploadMiddleware('pan'), async (req, res) => {
    try {
        const userId = req.user._id;

        if (!req.file) {
            console.warn(`[PAN] User ${userId} tried to upload but no file found.`);
            return res.status(400).json({ error: 'No PAN card file uploaded' });
        }

        const client = await Client.findOne({ userId });
        if (!client) {
            console.error(`[PAN] User ${userId} has no client record.`);
            return res.status(404).json({ msg: "Client not found for this user." });
        }

        const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
        if (!allowedTypes.includes(req.file.mimetype)) {
            console.warn(`[PAN] Invalid file type: ${req.file.mimetype} by user ${userId}`);
            return res.status(400).json({ error: 'Only PDF, JPEG, or PNG files are allowed for PAN card' });
        }

        const panFile = new File({
            filename: req.file.originalname,
            contentType: req.file.mimetype,
            size: req.file.size,
            data: req.file.buffer,
            uploadedBy: userId,
            clientId: client._id,
            documentType: 'pan'
        });

        const savedFile = await panFile.save();

        const kycRecord = await KYC.findOneAndUpdate(
            { userId },
            { $set: { clientId: client._id, panFileId: savedFile._id } },
            { upsert: true, new: true }
        );

        res.status(201).json({
            success: true,
            message: 'PAN card uploaded successfully',
            fileId: savedFile._id,
            kycId: kycRecord._id,
            documentType: 'pan'
        });

    } catch (error) {
        console.error(`[PAN ERROR] User: ${req.user?._id}, Details:`, error);
        res.status(500).json({
            success: false,
            error: 'Failed to upload PAN card'
        });
    }
});


// ---------------- Aadhaar Download ----------------
router.get('/aadhaar/download', protect, authorizeRoles("client"), async (req, res) => {
    try {
        const kycRecord = await KYC.findOne({ userId: req.user._id });

        if (!kycRecord || !kycRecord.aadhaarFileId) {
            console.warn(`[DOWNLOAD Aadhaar] User ${req.user._id} has no Aadhaar file.`);
            return res.status(404).json({ error: 'Aadhaar document not found' });
        }

        const aadhaarFile = await File.findById(kycRecord.aadhaarFileId);
        if (!aadhaarFile) {
            console.error(`[DOWNLOAD Aadhaar] File not found for user ${req.user._id}.`);
            return res.status(404).json({ error: 'File not found' });
        }

        res.set({
            'Content-Type': aadhaarFile.contentType,
            'Content-Disposition': `attachment; filename="${aadhaarFile.filename}"`
        });

        return res.send(aadhaarFile.data);

    } catch (error) {
        console.error(`[DOWNLOAD Aadhaar ERROR] User: ${req.user?._id}, Details:`, error);
        res.status(500).json({ error: 'Failed to download Aadhaar document' });
    }
});

module.exports = router;
