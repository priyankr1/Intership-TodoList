import express from "express";
import { getFeedbacks, addFeedback, deleteFeedback } from "../controllers/feedbackController.js";

const router = express.Router();

router.get("/", getFeedbacks);
router.post("/", addFeedback);
router.delete("/:id", deleteFeedback);

export default router;
