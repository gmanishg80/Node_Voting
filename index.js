const express = require("express");
const colors = require("colors");
const Database= require('./db');
const dotenv = require('dotenv');
dotenv.config();

const app = express();
app.use(express.json());
const PORT = process.env.PORT || 8080;
app.get("/", (req, res) => {
  console.log(`Server is running at : ${PORT}`.bgBlue);
});
app.listen(PORT, () => {
  console.log("Server Connected !!!".black.bold.underline.bgRed);
});
