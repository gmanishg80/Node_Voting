const express = require("express");
const app = express();
const Database= require('./db');
const colors = require("colors");
// const dotenv = require('dotenv');
// dotenv.config();
//---------------------OR--------For config .env
require('dotenv').config();

app.use(express.json());
app.use(express.urlencoded({extended: true, limit: "16kb"}))

// Import the router files
const voterRoute = require("./routes/voter.route");
const candidateRoute = require("./routes/candidate.route");



// Use the routers
app.use('/voter', voterRoute);
app.use('/candidate', candidateRoute);


const PORT = process.env.PORT || 8080;
app.get("/", (req, res) => {
    res.send("Server Connected");
  console.log(`Server is running at : ${PORT}`.bgBlue);
});
app.listen(PORT, () => {
  console.log("Server Connected !!!".black.bold.underline.bgRed);
});
