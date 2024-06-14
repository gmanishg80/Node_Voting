const express = require("express");
const router = express.Router();
const {addCandidate,updateCandidate,allCandidates,deleteCandidate,voteForCandidate,countVote,listOfCandidate} = require("../controllers/candidate.controller");

// router.post("/signup",candidateController);

router.post("/addCandidate", addCandidate);
router.put("/updateCandidate/:candidateID", updateCandidate);
router.get("/allCandidates", allCandidates);
router.delete("/deleteCandidate/:candidateID", deleteCandidate);
router.post("/voteForCandidate/:candidateID", voteForCandidate);
router.get("/countVote", countVote);
router.get("/listOfCandidate", listOfCandidate);


module.exports=router;
 
