import Topic from "../models/Topic.js";
import Question from "../models/Question.js";
import Result from "../models/Result.js";

export const getTopics = async (req,res) =>{
    const topics = await Topic.find();
    res.json(topics);
};

export const getQuestions = async (req,res)=>{
    const {topicId} = req.params;

    const questions = await Question.find({topic: topicId});

    res.json(questions);
}

export const getHint = async (req,res)=>{
    const {questionId} = req.body;

    //dummy Hint
    res.json({
        hint: "try solving the problem using a brute force approach first, then optimize"
    });
};

export const submitAttempt = async (req,res)=>{
    const {questionId,isCorrect} = req.body;

    const result = await Result.create({
        user:req.user,
        question:questionId,
        isCorrect,
        score: isCorrect ? 10 : 0,
    });
    res.json({
        message:"Attempt saved",
        result,
    });
};