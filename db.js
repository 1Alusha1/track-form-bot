import mongoose from "mongoose";
import { config } from "dotenv";
config();

export default async function db() {
  await mongoose.connect(process.env.MONGO_URI);
}
