require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const EmployeeRegisterRoute = require("./Routes/EmployeeRegisterRoute");
const AuthRoute = require("./Routes/AuthRoute.js");
const BreakRoute = require("./Routes/BreakRoute.js");



const app = express();
app.use(cors({
  url: 'http://172.16.0.5:3000'
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
      console.log('Database connected successfully');
    })
    .catch((err) => {
      console.error('Error connecting to MongoDB:', err.message);
    });

app.use(EmployeeRegisterRoute);
app.use(AuthRoute);
app.use(BreakRoute);


// API endpoint to record attendance
app.get("/", async (req, res) => {
  res.status(200).json({ message: "This is a backend data.!" });
});

const port = 5000;

// Start the Express server
// Listen on the static IP
const staticIp = '172.16.0.5';  // Your static IP address
app.listen(port, staticIp, () => {
  console.log(`Server is running at http://${staticIp}:${port}`);
});
