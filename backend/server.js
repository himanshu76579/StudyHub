const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');


dotenv.config();

// Establish Database Connection
connectDB(); 

const app = express();

// Middlewares
app.use(cors({
  origin: 'http://localhost:5173', // matlab kon sa frontend iss backend ko access kar sakta hai
  credentials: true       // cookie data aur jwt credentials wagerah jaa sakta hai ya nahi
}));
app.use(express.json());



// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/resources', require('./routes/resourceRoute'));



// Global Error Handler
app.use((err, req, res, next) => {
  console.error(" Server Error:", err.message);
  res.status(500).json({ 
    message: "Something went wrong!",   // try  me agar error aayega to catch k andar next(error) call hoga aur control yaha aa jaygea
    error: err.message 
  });
});


// port variable defination aur listerner
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));