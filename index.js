const express = require('express');
const app = express();
const cors = require('cors');
const { render } = require('@nexrender/core')
const path = require('path');
const templatesRoutes = require('./routes/templates'); // Import the user routes

// Middleware for JSON parsing
app.use(express.json());

// Enable CORS for all routes
app.use(cors());

// Use the route handlers
app.use('/', (req,res)=> {
  res.send("🚀 running... 🚀")
});
app.use('/templates', templatesRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
