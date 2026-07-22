import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("MongoDB Connected");
    console.log("DB NAME:", mongoose.connection.name);
    console.log("HOST:", mongoose.connection.host);

  } catch (error) {
    console.log(error);
  }
};
