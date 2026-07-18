const Resource = require('../models/Resource');

//  1. Naya Resource Upload Karne Ka Logic (Admin ke liye)
exports.createResource = async (req, res) => {
  try {

const { title, type, branch, semester, subject, category } = req.body; 

// Aur jab DB mein save kar rahe hon, toh usme bhi pass karein:
const newResource = new Resource({
  title,
  type,
  branch,
  semester,
  subject,    
  category,   
  fileUrl: req.file ? req.file.path : req.body.fileUrl, 
  uploadedBy: req.user._id // ya jo bhi aapka user id ka logic hai
});


    await newResource.save();
    res.status(201).json({ message: 'Resource uploaded successfully!', resource: newResource });
    
  } catch (error) {
    res.status(500).json({ message: 'Error uploading resource', error: error.message });
  }
};

//  2. Saare Resources Fetch Karne Ka Logic (Student/Admin ke liye)
exports.getAllResources = async (req, res) => {
  try {
    // .populate() use karke hum uploader ka naam bhi sath mein fetch kar lenge
    const resources = await Resource.find().populate('uploadedBy', 'name email');
    res.status(200).json(resources);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching resources', error: error.message });
  }
};