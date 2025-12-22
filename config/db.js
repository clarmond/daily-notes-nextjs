import mongoose from "mongoose";

let connected = false;

const connectDB = async () => {
  mongoose.set("strictQuery", true);

  if (connected) {
    return;
  }

  // Select database URI based on NODE_ENV
  const isProduction = process.env.NODE_ENV === "production";
  const mongoURI = isProduction
    ? process.env.MONGODB_URI_PRODUCTION
    : process.env.MONGODB_URI_DEVELOPMENT;

  if (!mongoURI) {
    throw new Error(
      `MongoDB URI not found for environment: ${process.env.NODE_ENV}`
    );
  }

  try {
    await mongoose.connect(mongoURI);
    connected = true;
    console.log(
      `MongoDB connected to ${isProduction ? "PRODUCTION" : "DEVELOPMENT"} database`
    );
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

export default connectDB;
