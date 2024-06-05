const mongoose = require("mongoose");

const voterSchema = new mongoose.Schema(
  {
    name:{
        type:String,
        required:[true,"Name is required"],
        unique:true,
    },
    age:{
        type:Number,
        required:true,
    },
    gender:{
        type:String,
        required:true,
        enum:["Male","Female"],

    },
    password:{
        type:String,
        required:[true,"Password is required"],
        
    },
    aadharNumber:{
        type:Number,
        required:[true,"aadharNumber is required"],
        unique:true,
    },
    candidateId:{
        type:mongoose.Types.ObjectId,
        ref:"candidate",
    }
  },
  { timestamps: true }
);

const voter = mongoose.model("voter", voterSchema);
module.exports = voter; 
