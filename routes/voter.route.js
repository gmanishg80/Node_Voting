const express = require("express");
const router = express.Router();
const { signup } = require("../controllers/voter.controller"); // Destructure the signup function


router.post("/signup", signup); // Use the signup function directly

module.exports = router;
