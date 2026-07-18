const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    trim: true 
  },
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    lowercase: true,
    trim: true 
  },
  password: { 
    type: String, 
    required: true 
  },
  role: { 
    type: String, 
    enum: ['student', 'admin'], 
    default: 'student' 
  },
  branch: { 
    type: String, 
    // Branch verification is only mandatory if the user registers as a student
    required: function() { return this.role === 'student'; },
    enum: ['ECE', 'CSE', 'EE', 'ME', 'CE']
  },

  rollNo: {
    type: String,
    // 🔐 Only require a Roll Number if the registering user is a student
    required: function() { 
      return this.role === 'student'; 
    },
    trim: true
  },
  // 🔐 THE SAFEGUARD ACCREDITATION BLOCK
  isApproved: { 
    type: Boolean, 
    default: function() { 
      // If they are registering as an admin, they must wait for you.
      // Students bypass this gate and get true instantly.
      return this.role !== 'admin'; 
    }
  }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);