const mongoose = require('mongoose');

const ResourceSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true }, 
  branch: { type: String, required: true },
  semester: { type: Number, required: true, min: 1, max: 8 },
  
  // 👇 Ye dono fields missing the, ab add kar diye hain
  subject: { type: String, required: true, default: 'General / Other Subjects' },
  category: { type: String, required: true, default: 'Notes/PDF' },
  
  fileUrl: { type: String, required: true },
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('Resource', ResourceSchema);