const Candidate = require("../models/candidate-model");
const Voter = require("../models/voter.model");
const { generateToken, jwtAuthMiddleware } = require("../Helper/jwt");
const responses = require("../Helper/responses");

const checkAdminRole = async (userID) => {
  try {
    const user = await Voter.findById(userID);
    if (user.role === "admin") {
      return true;
    }
  } catch (err) {
    return false;
  }
  return false; // Ensure a boolean is always returned
};

// POST route to add a candidate
const addCandidate = [
  jwtAuthMiddleware,
  async (req, res) => {
    try {
      if (!(await checkAdminRole(req.user.id))) {
        return responses.forbidden(res, "User does not have admin role");
      }

      const data = req.body; // Assuming the request body contains the candidate data

      // Create a new User document using the Mongoose model
      const newCandidate = new Candidate(data);

      // Save the new user to the database
      const response = await newCandidate.save();
      console.log("Data saved");
      return responses.created(res, response, "Candidate created successfully");
    } catch (err) {
      console.log(err);
      return responses.serverError(res, "Internal Server Error");
    }
  },
];

// update candidate

const updateCandidate = [
  jwtAuthMiddleware,
  async (req, res) => {
    try {
      if (!(await checkAdminRole(req.user.id))) {
        return responses.forbidden(res, "User does not have admin role");
      }

      const candidateID = req.params.candidateID; // Extract the id from the URL parameter
      const updatedCandidateData = req.body; // Updated data for the candidate

      const response = await Candidate.findByIdAndUpdate(
        candidateID,
        updatedCandidateData,
        {
          new: true, // Return the updated document
          runValidators: true, // Run Mongoose validation
        }
      );

      if (!response) {
        return responses.notFound(res, "Candidate not found");
      }

      console.log("Candidate data updated");
      return responses.success(res, response, "Candidate updated successfully");
    } catch (err) {
      console.log(err);
      return responses.serverError(res, "Internal Server Error");
    }
  },
];

//get all cadidates

const allCandidates = [
  jwtAuthMiddleware,
  async (req, res) => {
    try {
      const candidates = await Candidate.find();
      const totalCandidates = await Candidate.countDocuments();
      // output will be the total count of candidates,  example:Total_Candidates: 4
      // return responses.success(res, {  totalCandidates,candidates }, 'Candidates retrieved successfully');
      return responses.success(
        res,
        { Total_Candidates: totalCandidates, candidates },
        "Candidates retrieved successfully"
      );
    } catch (err) {
      console.log(err);
      return responses.serverError(res, "Internal Server Error");
    }
  },
];

//delete candidate by id
const deleteCandidate = [
  jwtAuthMiddleware,
  async (req, res) => {
    try {
      if (!(await checkAdminRole(req.user.id))) {
        return responses.forbidden(res, "User does not have admin role");
      }

      const candidateID = req.params.candidateID; // Extract the id from the URL parameter

      const response = await Candidate.findByIdAndDelete(candidateID);

      if (!response) {
        return responses.notFound(res, "Candidate not found");
      }

      console.log("Candidate deleted");
      return responses.success(res, response, "Candidate deleted successfully");
    } catch (err) {
      console.log(err);
      return responses.serverError(res, "Internal Server Error");
    }
  },
];

//start voting

const voteForCandidate = [
  jwtAuthMiddleware,
  async (req, res) => {
    const candidateID = req.params.candidateID;
    const userId = req.user.id;

    try {
      // Find the Candidate document with the specified candidateID
      const candidate = await Candidate.findById(candidateID);
      if (!candidate) {
        return responses.notFound(res, "Candidate not found");
      }

      const voter = await Voter.findById(userId);
      if (!voter) {
        return responses.notFound(res, "User not found");
      }
      if (voter.role == "admin") {
        return responses.forbidden(res, "Admin is not allowed to vote");
      }
      if (voter.isVoted) {
        return responses.badRequest(res, "You have already voted");
      }

      // Update the Candidate document to record the vote
      candidate.votes.push({ user: userId });
      candidate.voteCount++;
      await candidate.save();

      // Update the user document
      voter.isVoted = true;
      await voter.save();

      return responses.success(res, null, "Vote recorded successfully");
    } catch (err) {
      console.log(err);
      return responses.serverError(res, "Internal Server Error");
    }
  },
];

// count Vote

const countVote = [
  async (req, res) => {
    try {
      // Find all candidates and sort them by voteCount in descending order
      const candidates = await Candidate.find().sort({ voteCount: -1 });

      // Map the candidates to only return their party and voteCount
      const voteRecord = candidates.map((data) => ({
        party: data.party,
        count: data.voteCount,
      }));

      return responses.success(
        res,
        voteRecord,
        "Vote count retrieved successfully"
      );
    } catch (err) {
      console.log(err);
      return responses.serverError(res, "Internal Server Error");
    }
  },
];

// Get List of all candidates with only name and party fields

const listOfCandidate = [
  async (req, res) => {
    try {
      // Find all candidates and select only the name and party fields, excluding _id
      const candidates = await Candidate.find({}, "name party -_id");

      // Return the list of candidates
      res.status(200).json(candidates);
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
];

module.exports = {
  addCandidate,
  updateCandidate,
  allCandidates,
  deleteCandidate,
  voteForCandidate,
  countVote,
  listOfCandidate,
};
