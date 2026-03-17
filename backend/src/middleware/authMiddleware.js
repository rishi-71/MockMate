import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req,res,next)=>{

try{

const token = req.headers.authorization?.split(" ")[1];

if(!token){
return res.status(401).json({message:"Not authorized"});
}

const decoded = jwt.verify(token,process.env.JWT_SECRET);

const user = await User.findById(decoded.id);

req.user = user;

next();

}catch(err){

res.status(401).json({message:"Token invalid"});

}

};

// This assumes you already have a middleware that verifies the JWT 
// and attaches the user info to req.user

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next(); 
  } else {
    res.status(403).json({ message: "Access denied. Admin privileges required." });
  }
};