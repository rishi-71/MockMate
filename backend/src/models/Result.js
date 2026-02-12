import mongoose from "mongoose";

const resultSchema = new mongoose.Schema(
    {
    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
    },
    question:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Question",
    },
    isCorrect:Boolean,
    score:Number,
},
{timestamps:true}
);
export default mongoose.model("Result",resultSchema);