import dotenv from "dotenv";
dotenv.config();

export const ENV ={
    PORT : process.env.PORT,
    DB_URL: process.env.DB_URL,
    NODE_ENV : process.env.NODE_ENV,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY

};