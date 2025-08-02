import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  text: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model("Feedback", feedbackSchema);
