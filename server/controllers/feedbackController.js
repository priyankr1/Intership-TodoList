import Feedback from "../models/Feedback.js";

export const getFeedbacks = async (req, res) => {
  try {
    const feedbacks = await Feedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ message: "Error fetching feedbacks" });
  }
};

export const addFeedback = async (req, res) => {
  try {
    const feedback = new Feedback({ text: req.body.text });
    await feedback.save();
    res.json(feedback);
  } catch (err) {
    res.status(500).json({ message: "Error adding feedback" });
  }
};

export const deleteFeedback = async (req, res) => {
  try {
    await Feedback.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Feedback deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting feedback" });
  }
};
