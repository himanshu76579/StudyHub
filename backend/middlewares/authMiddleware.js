const jwt = require('jsonwebtoken');

// --- 1. Authentication Middleware ---
// Yeh function check karta hai ki user logged-in hai ya nahi
const protect = (req, res, next) => {
  let token = req.headers.authorization;

  // Check if token exists and starts with 'Bearer'
  if (token && token.startsWith('Bearer')) {
    try {
      // Token extract karein (Bearer ko hata kar)
      token = token.split(' ')[1];
      
      // Token verify karein
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      // Request mein user info attach karein taaki aage use ho sake
      req.user = decoded; 
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    return res.status(401).json({ message: 'Not authorized, no token' });
  }
};

// --- 2. Admin Authorization Middleware ---
// Yeh function check karta hai ki kya user Admin ya SuperAdmin hai
const adminOnly = (req, res, next) => {
  // Defensive check: Redux ya Frontend se bheje gaye object structure ke liye
  const role = req.user?.role || req.user?.user?.role; 

  if (role === 'admin' || role === 'superadmin') {
    next(); // Gate open, Admin allow ho gaya
  } else {
    res.status(403).json({ message: 'Access denied. Admin rights required.' });
  }
};

module.exports = { protect, adminOnly };