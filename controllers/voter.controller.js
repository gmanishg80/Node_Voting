const Voter = require("../models/voter.model");
const { validateVoter } = require("../validations/validateVoter");
const { validationResult } = require("express-validator");
const { generateToken } = require("../validations/jwt");
const responses = require("../validations/responses");

// const signup = [
//   validateVoter,
//   async (req, res) => {
//     try {
//       const errors = validationResult(req);
//       if (!errors.isEmpty()) {
//         return res.status(400).json({ errors: errors.array() });
//       }

//       const voterData = req.body; // Assuming the request body contains the Voter data

//       // Check if a Voter with the same Aadhar Card Number already exists
//       const existingVoter = await Voter.findOne({
//         aadharCardNumber: voterData.aadharCardNumber,
//       });
//       if (existingVoter) {
//         return res.status(400).json({
//           error: "Voter with the same Aadhar Card Number already exists",
//         });
//       }

//       const newVoter = new Voter(voterData); // Create a new User document using the Mongoose model
//       const response = await newVoter.save(); // Save the new user to the database
//       console.log("data saved");

//       const payload = {
//         id: response.id,
//       };
//       console.log(JSON.stringify(payload)); //printing payload
//       const token = generateToken(payload);
     
//       res.status(200).json({ response: response, token: token });
//     } catch (error) {
//       res.status(500).json({ error: "Internal Server Error" });
//     }
//   },
// ];




const signup = [
  validateVoter,
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return responses.badRequest(res, errors.array());
      }

      const voterData = req.body; // Assuming the request body contains the Voter data

      // Check if a Voter with the same Aadhar Card Number already exists
      const existingVoter = await Voter.findOne({
        aadharCardNumber: voterData.aadharCardNumber,
      });
      if (existingVoter) {
        return responses.badRequest(res, "Voter with the same Aadhar Card Number already exists");
      }

      const newVoter = new Voter(voterData); // Create a new User document using the Mongoose model
      const savedVoter = await newVoter.save(); // Save the new user to the database
      console.log("data saved");

      const payload = {
        id: savedVoter.id,
      };
      console.log(JSON.stringify(payload)); // Printing payload
      const token = generateToken(payload);
     
      responses.created(res, { voter: savedVoter, token: token }, "Voter registered successfully");
    } catch (error) {
      responses.serverError(res, "Internal Server Error");
    }
  },
];






module.exports = { signup };
