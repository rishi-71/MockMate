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

passed:{
type:Number,
default:0
},

total:{
type:Number,
default:0
},

isCorrect:{
type:Boolean,
default:false
},

score:{
type:Number,
default:0
}

},{timestamps:true});

export default mongoose.model("CodingResult",codingResultSchema);