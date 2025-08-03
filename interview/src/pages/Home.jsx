import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { motion } from "framer-motion";
import { PlusCircle } from "lucide-react";

export default function Home() {
  const { backendURL } = useContext(AppContext);
  const [todoCount, setTodoCount] = useState(0);
  const [feedbackCount, setFeedbackCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const todosRes = await axios.get(`${backendURL}/api/todos`);
        const feedbackRes = await axios.get(`${backendURL}/feedbacks`);
        setTodoCount(todosRes.data.length || 0);
        setFeedbackCount(feedbackRes.data.length || 0);
      } catch (error) {
        console.error("Error fetching counts:", error);
      }
    };
    fetchCounts();
  }, [backendURL]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-6">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-12"
      >
        <h1 className="text-5xl font-extrabold text-gray-800 tracking-tight">
          Welcome to <span className="text-blue-600">TaskFlow</span>
        </h1>
        <p className="text-lg text-gray-600 mt-4 max-w-2xl mx-auto">
          Your all-in-one solution to manage tasks and gather user insights. 
          Quickly track your work progress and collect valuable feedback in one place.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl w-full">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-8 cursor-pointer border border-gray-200 hover:shadow-2xl transition"
          onClick={() => navigate("/todos")}
        >
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            📝 Todos
          </h2>
          <p className="text-4xl font-bold text-blue-600 mt-4">{todoCount}</p>
          <p className="text-gray-500 mt-1">Manage your daily tasks</p>
          <button
            onClick={(e) => { e.stopPropagation(); navigate("/todos"); }}
            className="mt-4 flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition"
          >
            <PlusCircle size={18} /> Add Task
          </button>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.05 }}
          className="bg-white/80 backdrop-blur-md shadow-lg rounded-2xl p-8 cursor-pointer border border-gray-200 hover:shadow-2xl transition"
          onClick={() => navigate("/feedbacks")}
        >
          <h2 className="text-xl font-semibold text-gray-700 flex items-center gap-2">
            💬 Feedback
          </h2>
          <p className="text-4xl font-bold text-green-600 mt-4">{feedbackCount}</p>
          <p className="text-gray-500 mt-1">See what users are saying</p>
          <button
            onClick={(e) => { e.stopPropagation(); navigate("/feedbacks"); }}
            className="mt-4 flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
          >
            <PlusCircle size={18} /> Add Feedback
          </button>
        </motion.div>
      </div>
    </div>
  );
}
