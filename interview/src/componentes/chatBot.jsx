import React, { useState } from "react";
import { FaRobot, FaTimes } from "react-icons/fa";
import axios from "axios";


const SYSTEM_PROMPT = `
You are TaskFlow's virtual assistant. TaskFlow is a modern web platform for managing personal and team tasks with features like:
- To-do list creation, editing, and deletion
- Feedback collection and management
- A clean dashboard with insights
- Responsive design for desktop and mobile
- Simple, intuitive interface for productivity

Always answer as a friendly and helpful assistant. Address questions about:
- How to create, edit, or delete tasks
- How to provide feedback
- How data is stored
- Customization options
- Any general information about TaskFlow
If a question is outside TaskFlow’s scope, politely redirect to features TaskFlow provides.
`;

const commonQuestions = [
  {
    question: "How do I add a new task?",
    answer:
      "Click the 'Add Task' button on the To-Do page, enter your task, and press 'Save'. It will appear in your task list instantly.",
  },
  {
    question: "Can I edit or delete tasks?",
    answer:
      "Yes. Click on a task to edit its details, or use the 'Delete' button to remove it permanently.",
  },
  {
    question: "How do I leave feedback?",
    answer:
      "Navigate to the 'Feedback' section, type your feedback in the input field, and click 'Submit'.",
  },
  {
    question: "Is my data saved permanently?",
    answer:
      "Your tasks and feedback are securely stored in our database. You can access them anytime.",
  },
  {
    question: "Can I access this on my phone?",
    answer:
      "Absolutely! TaskFlow is fully responsive, so you can manage tasks and feedback easily from mobile devices.",
  },
  {
    question: "Can I see how many tasks I have?",
    answer:
      "Yes. The dashboard provides a count of your tasks and feedback for quick tracking.",
  },
  {
    question: "Do I need an account to use TaskFlow?",
    answer:
      "Currently, TaskFlow does not require user authentication. All tasks and feedback are stored for your session.",
  },
  {
    question: "Can I categorize tasks?",
    answer:
      "The current version allows you to add tasks with names and details. Categorization features are coming soon!",
  },
  {
    question: "Can I download my tasks?",
    answer:
      "TaskFlow doesn’t support task export yet, but we are working on adding this feature.",
  },
  {
    question: "How do I get support?",
    answer:
      "Use the chatbot on the bottom right of the page or contact our team via the feedback section.",
  },
];


const TruncatedMessage = ({ text }) => {
  const [expanded, setExpanded] = useState(false);
  const limit = 50;

  if (text.length <= limit) {
    return <span>{text}</span>;
  }

  return (
    <span>
      {expanded ? (
        <>
          {text}{" "}
          <button
            onClick={() => setExpanded(false)}
            className="text-blue-600 hover:underline text-sm ml-1"
          >
            read less
          </button>
        </>
      ) : (
        <>
          {text.slice(0, limit)}...{" "}
          <button
            onClick={() => setExpanded(true)}
            className="text-blue-600 hover:underline text-sm ml-1"
          >
            more
          </button>
        </>
      )}
    </span>
  );
};

const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showCommonQuestions, setShowCommonQuestions] = useState(true);

  const toggleChat = () => setIsOpen(!isOpen);

  // Handle FAQ question click
  const handleCommonQuestionClick = (q) => {
    const userMessage = { sender: "user", text: q.question };
    const botMessage = { sender: "bot", text: q.answer };
    setMessages((prev) => [...prev, userMessage, botMessage]);
    setShowCommonQuestions(false);
  };

  // AI-based response (only used when user types custom query)
  const generate = async (overrideInput) => {
    const query = overrideInput || input;
    if (!query.trim()) return;

    const userMessage = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-8b:generateContent?key=${process.env.REACT_APP_AI_URL}`,
        {
          contents: [{ parts: [{ text: `${SYSTEM_PROMPT}\nUser: ${query}` }] }],
        }
      );

      let botText =
        response.data.candidates[0].content.parts[0].text || "No response";
      botText = botText
        .replace(/(\r\n|\n|\r)/gm, " ")
        .replace(/\s+/g, " ")
        .trim();

      const botMessage = { sender: "bot", text: botText };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error fetching AI response:", error);
      const errorMessage = {
        sender: "bot",
        text: "Sorry, there was an error processing your request.",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {!isOpen && (
        <button
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
          onClick={toggleChat}
        >
          <FaRobot size={24} />
        </button>
      )}

      {isOpen && (
        <div className="w-80 h-96 bg-white shadow-xl rounded-xl flex flex-col overflow-hidden">
          <div className="bg-blue-600 text-white flex justify-between items-center p-3">
            <h2 className="text-lg font-semibold">TaskFlow Assistant</h2>
            <FaTimes className="cursor-pointer" onClick={toggleChat} />
          </div>

          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`p-2 rounded-lg max-w-xs ${
                  msg.sender === "user"
                    ? "bg-blue-100 self-end text-right"
                    : "bg-gray-200 self-start text-left"
                }`}
              >
                {msg.sender === "bot" ? (
                  <TruncatedMessage text={msg.text} />
                ) : (
                  msg.text
                )}
              </div>
            ))}
            {isTyping && (
              <div className="p-2 rounded-lg max-w-xs bg-gray-200 self-start text-left italic text-gray-500">
                Typing...
              </div>
            )}
          </div>

          {showCommonQuestions && (
            <div className="p-2 border-t bg-gray-100">
              <div className="flex justify-between items-center mb-2">
                <p className="text-sm font-semibold">Common Questions:</p>
                <button
                  onClick={() => setShowCommonQuestions(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <FaTimes />
                </button>
              </div>
              <div className="flex flex-wrap gap-2">
                {commonQuestions.map((q, index) => (
                  <button
                    key={index}
                    onClick={() => handleCommonQuestionClick(q)}
                    className="bg-gray-200 text-sm px-3 py-1 rounded-full hover:bg-gray-300"
                  >
                    {q.question}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex items-center p-2 border-t">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && generate()}
              placeholder="Type a message..."
              className="flex-1 px-3 py-2 border rounded-l-full focus:outline-none"
            />
            <button
              onClick={() => generate()}
              className="bg-blue-600 text-white px-4 py-2 rounded-r-full hover:bg-blue-700"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBot;
