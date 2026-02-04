import User from "../models/User.js";
import bcrypt from "bcrypt";


export const registerUser = async (req,res) =>{
    try{
        const {name,email,password} = req.body;

        const userExists = await User.findOne({email});
        if(userExists){
            return res.send(400).json({
                message : "User already exists"
            });
        }
        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            name,
            email,
            password : hashedPassword,
        });

        res.status(201).json({
            message : "User registered successfully",
            userId : user._id,
        });

    }catch(err){
        res.status(500).json({
            message: err.message
        });
    }
};