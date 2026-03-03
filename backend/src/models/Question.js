import mongoose from "mongoose";
const questionSchema = new mongoose.Schema({
    topic:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Topic",
    },
    title:String,
    description:String,
    difficulty:String,
    testCases:[{
        input:String,
        expectedOutput:String,
    }]
});

export default mongoose.model("Question",questionSchema);