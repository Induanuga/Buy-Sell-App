import React, { useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

const Support = () => {
    const [messages, setMessages] = useState([]);
    const [userInput, setUserInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userInput.trim()) return;

        const userMessage = { role: "user", content: userInput };
        setMessages((prev) => [...prev, userMessage]);
        setUserInput("");
        setIsLoading(true);

        try {
            const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
            const chatHistory = messages.map((msg) => msg.content);
            const response = await model.generateContent([...chatHistory, userInput]);

            const aiMessage = { role: "assistant", content: response.response.text() };
            setMessages((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Error fetching response:", error);
            setMessages((prev) => [...prev, { role: "assistant", content: "Sorry, something went wrong. Try again!" }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8 border border-gray-700 flex flex-col">
                <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Support Chat</h1>
                <div className="flex-1 overflow-y-auto space-y-4 mb-4 h-80 p-2 border rounded-md bg-gray-100 border-gray-600">
                    {messages.map((message, index) => (
                        <div key={index} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                            <div
                                className={`p-3 max-w-xs rounded-lg ${message.role === "user" ? "bg-yellow-500 text-gray-900" : "bg-gray-600 text-yellow-300"
                                    }`}
                            >
                                {message.content}
                            </div>
                        </div>
                    ))}
                    {isLoading && <div className="text-center text-black-300">Thinking...</div>}
                </div>
                <form onSubmit={handleSubmit} className="flex gap-2">
                    <input
                        type="text"
                        value={userInput}
                        onChange={(e) => setUserInput(e.target.value)}
                        placeholder="Type your message..."
                        className="flex-1 px-4 py-2 border border-gray-600 rounded-md bg-gray-100 text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                    />
                    <button
                        type="submit"
                        className="w-auto bg-gray-900 hover:bg-gray-800 text-yellow-300 font-semibold py-1 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 active:bg-gray-700"
                    >
                        Send
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Support;
