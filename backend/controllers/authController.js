const User = require('../models/User');
const Resource = require('../models/Resource');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- 1. USER REGISTRATION LOGIC ---
exports.register = async (req, res) => {
  try {
    const { name, rollNo, branch, username, email, password, role } = req.body;
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    
    if (userExists) return res.status(400).json({ message: 'User already exists' });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ name, rollNo, branch, username, email, password: hashedPassword, role: role || 'student' });
    res.status(201).json({ message: 'User registered successfully!' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 2. USER LOGIN LOGIC ---
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    if (user.role === 'admin' && !user.isApproved) {
      return res.status(403).json({ 
        message: "Your account registration request is pending approval from the Super Admin." 
      });
    }

    const token = jwt.sign(
      { id: user._id, role: user.role, branch: user.branch, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(200).json({ 
        token, 
        user: { name: user.name, username: user.username, role: user.role, branch: user.branch } 
    });
  } catch (error) {
    console.error("Login Error:", error.message); // Sirf Error log rakha hai
    res.status(500).json({ message: error.message });
  }
};

// --- 3. GET ALL PENDING ADMIN REQUESTS LOGIC ---
exports.getPendingAdmins = async (req, res) => {
  try {
    const pendingAdmins = await User.find({ role: 'admin', isApproved: false })
      .select('-password') 
      .sort({ createdAt: -1 });

    res.status(200).json(pendingAdmins);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 4. GRANT ADMIN APPROVAL LOGIC ---
exports.approveAdmin = async (req, res) => {
  try {
    const { id } = req.params;

    const approvedUser = await User.findByIdAndUpdate(
      id, 
      { isApproved: true }, 
      { new: true } 
    );

    if (!approvedUser) {
      return res.status(404).json({ message: 'Target account registry item not found.' });
    }

    res.status(200).json({ 
      message: `${approvedUser.name} has been successfully approved as an Admin.`,
      user: approvedUser 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// --- 5. GET PUBLIC USER PROFILE LOGIC ---
exports.getUserProfile = async (req, res) => {
  try {
    const userProfile = await User.findById(req.params.id).select('-password');
    if (!userProfile) {
      return res.status(404).json({ message: "User not found" });
    }

    const userNotes = await Resource.find({ uploadedBy: req.params.id }).sort({ createdAt: -1 });

    res.json({ profile: userProfile, notes: userNotes });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};