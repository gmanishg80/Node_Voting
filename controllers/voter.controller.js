const Voter = require("../models/voter.model");
const { validateVoter } = require("../validations/validateVoter");
const { validationResult } = require("express-validator");
const { generateToken, jwtAuthMiddleware } = require("../validations/jwt");
const responses = require("../validations/responses");
const { uploadFile } = require("../cloudnary");

const signup = [
  validateVoter,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return responses.badRequest(res, errors.array());
      }

      const { name, age, email, mobile, address, aadharCardNumber, password, role, isVoted } = req.body;

      // Check if a Voter with the same Aadhar Card Number already exists
      const existingVoter = await Voter.findOne({ aadharCardNumber });
      if (existingVoter) {
        return responses.badRequest(res, "Voter with the same Aadhar Card Number already exists");
      }

      // Profile image upload
      const profileLocalPath = req.files?.profile?.[0]?.path;
      if (!profileLocalPath) {
        return responses.badRequest(res, "Profile Photo is required");
      }

      const profile = await uploadFile(profileLocalPath);
      if (!profile) {
        return responses.badRequest(res, "Profile File upload failed");
      }

      const newVoter = await Voter.create({
        name,
        age,
        email,
        mobile,
        address,
        aadharCardNumber,
        password,
        profile: profile.url,
        role,
        isVoted,
      });

      const savedVoterData = await newVoter.save();
      console.log("data saved");

      const payload = { id: savedVoterData.id };
      console.log(JSON.stringify(payload));
      const token = generateToken(payload);

      responses.created(res, { voter: savedVoterData, token }, "Voter registered successfully");
    } catch (error) {
      console.error(error);
      responses.serverError(res, "Internal Server Error");
    }
  },
];

// Voter-login

const login = [
  validateVoter,
  async (req, res) => {
    try {
      // Extract aadharCardNumber and password from request body
      const { aadharCardNumber, password } = req.body;

      // Check if aadharCardNumber or password is missing
      if (!aadharCardNumber || !password) {
        return responses.badRequest(
          res,
          "Aadhar Card Number and password are required"
        );
      }

      // Find the user by aadharCardNumber
      const user = await Voter.findOne({ aadharCardNumber: aadharCardNumber });

      // If user does not exist or password does not match, return error
      if (!user || !(await user.comparePassword(password))) {
        return responses.unauthorized(
          res,
          "Invalid Aadhar Card Number or Password"
        );
      }

      // Generate Token
      const payload = {
        id: user.id,
      };
      const token = generateToken(payload);

      // Return token as response
      responses.success(res, { user, token }, "Login successful");
    } catch (err) {
      console.error(err);
      responses.serverError(res, "Internal Server Error");
    }
  },
];

// Get profile detailes

const profile = [
  jwtAuthMiddleware,
  async (req, res) => {
    try {
      const voterData = req.user;
      console.log("voterData := ", voterData);
      const voterId = voterData.id;
      const voter = await Voter.findById(voterId);
      responses.success(res, { voter });
    } catch (err) {
      console.error(err);
      responses.serverError(res, "Internal Server Error");
    }
  },
];

//update voter-password
const updatePassword = [
  jwtAuthMiddleware,
  async (req, res) => {
    try {
      const voterId = req.user.id; // Extract the id from the token
      const { currentPassword, newPassword } = req.body; // Extract current and new passwords from request body
      // Check if currentPassword and newPassword are present in the request body
      if (!currentPassword || !newPassword) {
        return responses.badRequest(
          res,
          "Both currentPassword and newPassword are required"
        );
      }
      // Find the voter by userID
      const voter = await Voter.findById(voterId);

      // If voter does not exist or password does not match, return error
      if (!voter || !(await voter.comparePassword(currentPassword))) {
        return responses.unauthorized(res, "Invalid current password");
      }

      // Update the user's password
      voter.password = newPassword;
      await voter.save();

      console.log("password updated");
      responses.success(res, "Password updated");
    } catch (error) {
      console.error(error);
      responses.serverError(res);
    }
  },
];

module.exports = { signup, login, profile, updatePassword };
