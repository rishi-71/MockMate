import mongoose from "mongoose";

const codingResultSchema = new mongoose.Schema({

  user:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"User",
    required:true
  },

  question:{
    type:mongoose.Schema.Types.ObjectId,
    ref:"Question"
  },

  passed:Number,
  total:Number,

  isCorrect:Boolean,

  score:Number

},{timestamps:true});

export default mongoose.model("CodingResult",codingResultSchema);