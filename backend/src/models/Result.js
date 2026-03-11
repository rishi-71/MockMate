import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
    {
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
   question: {
  title: String,
  description: String,
  difficulty: String
},
    passed:Number,
    total:Number,
    isCorrect:Boolean,
    score:Number,
},
{timestamps:true}
);
export default mongoose.model("Result",resultSchema);