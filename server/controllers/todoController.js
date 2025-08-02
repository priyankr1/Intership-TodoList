import Todo from "../models/Todo.js";

export const getTodos = async (req, res) => {
  try {
    const todos = await Todo.find().sort({ createdAt: -1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: "Error fetching todos" });
  }
};

export const addTodo = async (req, res) => {
  try {
    const todo = new Todo({ text: req.body.text, completed: false });
    await todo.save();
    res.json(todo);
  } catch (err) {
    res.status(500).json({ message: "Error adding todo" });
  }
};

export const updateTodo = async (req, res) => {
  try {
    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error updating todo" });
  }
};

export const deleteTodo = async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Error deleting todo" });
  }
};
