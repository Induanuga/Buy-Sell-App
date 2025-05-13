import React, { useState, useContext } from "react";
import axios from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");
  const { setAuthToken } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError("");
    try {
      const response = await axios.post("/auth/login", { email, password });
      if (response.status === 200) {
        setAuthToken(response.data.token);
        navigate("/profile");
      }
    } catch (error) {
      setLoginError(
        error.response?.data?.message
          ? error.response.data.message
          : "Login failed. Please try again."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white shadow-2xl rounded-xl p-8 w-full max-w-md border border-gray-300 relative">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Login
        </h1>
        {loginError && (
          <p className="text-red-500 text-sm mb-3">{loginError}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-900 text-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            />
          </div>
          <div className="relative">
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-600 bg-gray-900 text-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-900 hover:bg-gray-800 text-yellow-300 font-semibold py-2 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 active:bg-gray-700"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
