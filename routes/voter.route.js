const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");
const { signup, login, profile, updatePassword } = require("../controllers/voter.controller");

router.post(
  "/signup",
  upload.fields([
    {
      name: "profile", // Ensure this matches the field name in the form data
      maxCount: 1,
    },
  ]),
  signup
);
router.post("/login", login);
router.get("/profile", profile);
router.put("/updatePassword", updatePassword);

module.exports = router;
