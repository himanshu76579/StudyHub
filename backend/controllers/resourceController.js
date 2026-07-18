const Resource = require('../models/Resource');
const cloudinary = require('cloudinary').v2;
const fs = require('fs');

// 1. Upload Logic
exports.uploadResource = async (req, res) => {
  try {
    let finalUrl = null;

    if (req.body.type === 'link') {  
      finalUrl = req.body.externalUrl || req.body.fileUrl;
      if (!finalUrl || finalUrl === 'undefined') {
        return res.status(400).json({ message: "Bhai, Link URL missing hai!" });
      }
    } else if (req.file) {
      const result = await cloudinary.uploader.upload(req.file.path, {
        folder: 'study-nitp-resources',
        resource_type: 'auto'
      });
      finalUrl = result.secure_url || result.url; // cloudinary ka link....
      if (fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    } else {
      return res.status(400).json({ message: "Please select a file or enter a link." });
    }

    const newResource = await Resource.create({
      title: req.body.title,
      type: req.body.type,
      branch: req.body.branch,
      semester: req.body.semester,
      subject: req.body.subject,
      category: req.body.category,
      fileUrl: finalUrl,
      uploadedBy: req.user._id || req.user.id,
    });

    res.status(201).json({ message: " Resource uploaded successfully!", resource: newResource });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: error.message });
  }
};

// 2. Fetch Logic
exports.getAllResources = async (req, res) => {
  try {
    const resources = await Resource.find().populate('uploadedBy', 'name').sort({ createdAt: -1 });
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 3. Delete Logic
exports.deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).json({ message: "Resource not found" });

    const isAdmin = req.user && (req.user.role === 'admin' || req.user.role === 'superadmin');
    const currentUserId = req.user ? (req.user._id || req.user.id) : null;
    let uploaderId = resource.uploadedBy ? (resource.uploadedBy._id || resource.uploadedBy) : null;

    if (!isAdmin && currentUserId.toString() !== uploaderId.toString()) {
      return res.status(403).json({ message: "Tum delete nahi kar sakte!" });
    }

    await resource.deleteOne();
    res.json({ message: "Resource deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};