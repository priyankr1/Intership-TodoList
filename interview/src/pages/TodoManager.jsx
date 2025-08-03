import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "react-hot-toast";

export default function TodoManager() {
  const { backendURL } = useContext(AppContext);
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editValue, setEditValue] = useState("");

  // Fetch todos
  useEffect(() => {
    axios.get(`${backendURL}/api/todos`)
      .then(res => setTodos(res.data))
      .catch(() => toast.error("Failed to load todos"));
  }, [backendURL]);

  // Add new todo
  const addTodo = async () => {
    if (!input.trim()) return;
    try {
      const res = await axios.post(`${backendURL}/api/todos`, { text: input });
      setTodos([res.data, ...todos]);
      setInput("");
      toast.success("Task added!");
    } catch {
      toast.error("Error adding task");
    }
  };

  // Toggle completed
  const toggleComplete = async (id) => {
    try {
      const todo = todos.find(t => t._id === id);
      const updated = { ...todo, completed: !todo.completed };
      await axios.put(`${backendURL}/api/todos/${id}`, updated);
      setTodos(todos.map(t => (t._id === id ? updated : t)));
    } catch {
      toast.error("Error updating task");
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
      const updated = await axios.put(`${backendURL}/api/todos/${id}`, { text: editValue });
      setTodos(todos.map(t => (t._id === id ? updated.data : t)));
      setEditingId(null);
      toast.success("Task updated!");
    } catch {
      toast.error("Error updating task");
    }
  };

  // Delete with confirmation
  const deleteTodo = async (id) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`${backendURL}/api/todos/${id}`);
      setTodos(todos.filter(t => t._id !== id));
      toast.success("Task deleted!");
    } catch {
      toast.error("Error deleting task");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="w-full max-w-md bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-6 border">
        <h2 className="text-2xl font-extrabold text-gray-800 mb-4 text-center">My Tasks</h2>

        {/* Input */}
        <div className="flex gap-2 mb-6">
          <input
            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Add a new task..."
          />
          <button
            className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white px-5 py-2 rounded-lg hover:scale-105 transition"
            onClick={addTodo}
          >
            Add
          </button>
        </div>

        {/* Todo List */}
        <ul className="space-y-3">
          <AnimatePresence>
            {todos.length === 0 ? (
              <p className="text-gray-500 text-center italic">No tasks yet. Add one!</p>
            ) : (
              todos.map((t) => (
                <motion.li
                  key={t._id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: 50 }}
                  className="flex justify-between items-center bg-gray-50 shadow-sm border rounded-lg px-4 py-3 hover:bg-gray-100 transition"
                >
                  {editingId === t._id ? (
                    <input
                      value={editValue}
                      onChange={e => setEditValue(e.target.value)}
                      onBlur={() => saveEdit(t._id)}
                      className="flex-1 border-b border-gray-400 focus:outline-none"
                      autoFocus
                    />
                  ) : (
                    <div className="flex items-center gap-3 flex-1">
                      <input
                        type="checkbox"
                        checked={t.completed}
                        onChange={() => toggleComplete(t._id)}
                        className="w-5 h-5 accent-blue-500 cursor-pointer"
                      />
                      <span
                        className={`text-gray-800 cursor-pointer ${t.completed ? "line-through text-gray-400" : ""}`}
                        onDoubleClick={() => startEditing(t._id, t.text)}
                      >
                        {t.text}
                      </span>
                    </div>
                  )}
                  <button
                    onClick={() => deleteTodo(t._id)}
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
