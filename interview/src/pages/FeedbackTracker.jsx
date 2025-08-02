import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function FeedbackTracker() {
  const { backendURL } = useContext(AppContext);
  const [feedbacks, setFeedbacks] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Fetch feedbacks
  useEffect(() => {
    axios.get(`${backendURL}/feedbacks`)
      .then(res => setFeedbacks(res.data))
      .catch(() => toast.error("Failed to load feedbacks"));
  }, [backendURL]);

  // Add new feedback
  const addFeedback = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(`${backendURL}/feedbacks`, { text: input });
      setFeedbacks([res.data, ...feedbacks]);
      setInput("");
      toast.success("Feedback added!");
    } catch {
      toast.error("Error adding feedback");
    }
  };

  // Start editing
  const startEditing = (id, text) => {
    setEditingId(id);
    setEditValue(text);
  };

  // Save edit
  const saveEdit = async (id) => {
    try {
      const updated = await axios.put(`${backendURL}/feedbacks/${id}`, { text: editValue });
      setFeedbacks(feedbacks.map(f => (f._id === id ? updated.data : f)));
      setEditingId(null);
      toast.success("Feedback updated!");
    } catch {
      toast.error("Error updating feedback");
    }
  };

  // Delete with confirmation
  const deleteFeedback = async (id) => {
    if (!window.confirm("Are you sure you want to delete this feedback?")) return;
    try {
      await axios.delete(`${backendURL}/feedbacks/${id}`);
      setFeedbacks(feedbacks.filter(f => f._id !== id));
      toast.success("Feedback deleted!");
    } catch {
      toast.error("Error deleting feedback");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 border">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-4 text-center">Feedback Board</h2>

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Share your feedback..."
          />
          <button
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-5 py-2 rounded-lg hover:scale-105 transition"
            onClick={addFeedback}
          >
            Submit
          </button>
        </div>

        {/* Feedback List */}
        <ul className="space-y-3">
          <AnimatePresence>
            {feedbacks.length === 0 ? (
              <p className="text-gray-500 text-center italic">No feedback yet. Be the first!</p>
            ) : (
              feedbacks.map((f) => (
                <motion.li
                  key={f._id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="flex justify-between items-center bg-gray-50 shadow-sm border rounded-lg px-4 py-3 hover:bg-gray-100 transition"
                >
                  {editingId === f._id ? (
                    <input
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => saveEdit(f._id)}
                      className="flex-1 border-b border-gray-400 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <span
                      className="text-gray-800 cursor-pointer flex-1"
                      onDoubleClick={() => startEditing(f._id, f.text)}
                    >
                      {f.text}
                    </span>
                  )}
                  <button
                    onClick={() => deleteFeedback(f._id)}
                    className="text-red-500 hover:text-red-700 font-medium"
                  >
                    ✕
                  </button>
                </motion.li>
              ))
            )}
          </AnimatePresence>
        </ul>
      </div>
    </div>
  );
}
