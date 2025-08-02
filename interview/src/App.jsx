import React from "react";
import { Routes, Route, NavLink, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import TodoManager from "./pages/TodoManager";
import FeedbackTracker from "./pages/FeedbackTracker";
import { Toaster } from "react-hot-toast";
import ChatBot from "./componentes/chatBot";

export default function App() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-200">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-md shadow-md px-8 py-4 flex justify-between items-center">
        <h1 onClick={()=>navigate('/')} className="text-2xl font-bold text-blue-600 cursor-pointer">TaskFlow</h1>
        <div className="flex gap-6">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `hover:text-blue-600 ${isActive ? "text-blue-600 font-semibold" : "text-gray-700"}`
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/todos"
            className={({ isActive }) =>
              `hover:text-blue-600 ${isActive ? "text-blue-600 font-semibold" : "text-gray-700"}`
            }
          >
            Todos
          </NavLink>
          <NavLink
            to="/feedbacks"
            className={({ isActive }) =>
              `hover:text-blue-600 ${isActive ? "text-blue-600 font-semibold" : "text-gray-700"}`
            }
          >
            Feedback
          </NavLink>
        </div>
      </nav>

      {/* Routes */}
      <div className="p-6">
        <ChatBot/>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/todos" element={<TodoManager />} />
          <Route path="/feedbacks" element={<FeedbackTracker />} />
        </Routes>
      </div>

      {/* Toasts */}
      <Toaster position="top-center" reverseOrder={false} />
    </div>
  );
}
