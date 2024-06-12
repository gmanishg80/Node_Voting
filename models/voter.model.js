const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const voterSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      required: true,
    },
    email: {
      type: String,
    },
    mobile: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    aadharCardNumber: {
      type: Number,
      required: true,
      unique: true, 
    },
    password: {
      type: String,
      required: true,
    },
    profile: {
      type: String,
      // required: true,
    },
    role: {
      type: String,
      enum: ["voter", "admin"],
      default: "voter",
    },
    isVoted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

voterSchema.pre("save", async function (next) {
  const voter = this;
  //voter = will show the json result
  // example:-  name: 'rahul',
  // age: 30,
  // email: 'john.doe@example.com',

  // Hash the password only if it has been modified (or is new)
  if (!voter.isModified("password")) return next();
  try {
    // hash password generation
    const salt = await bcrypt.genSalt(10);

    // hash password
    const hashedPassword = await bcrypt.hash(voter.password, salt);

    // Override the plain password with the hashed one
    voter.password = hashedPassword;
    next();
  } catch (err) {
    return next(err);
  }
});

voterSchema.methods.comparePassword = async function (voterPassword) {
  try {
    // Use bcrypt to compare the provided password with the hashed password
    const isMatch = await bcrypt.compare(voterPassword, this.password);
    return isMatch;
  } catch (err) {
    throw err;
  }
};

const voter = mongoose.model("voter", voterSchema);
module.exports = voter;
