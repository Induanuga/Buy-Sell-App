import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Layout({ children }) {
  const { handleLogout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-800">
      <nav className="bg-gray-900 p-6 text-yellow-300 shadow-xl w-full border-b border-gray-700">
        <div className="max-w-screen-2xl mx-auto flex justify-between items-center">
          <ul className="flex space-x-12 flex-grow justify-center">
            <li>
              <Link
                to="/profile"
                className="relative py-2 px-4 text-yellow-300 hover:text-yellow-100 focus:outline-none transition-all duration-200 ease-in-out active:text-yellow-400 text-lg font-semibold"
                style={{ textDecoration: "none" }}
              >
                Profile
              </Link>
            </li>
            <li>
              <Link
                to="/search"
                className="relative py-2 px-4 text-yellow-300 hover:text-yellow-100 focus:outline-none transition-all duration-200 ease-in-out active:text-yellow-400 text-lg font-semibold"
                style={{ textDecoration: "none" }}
              >
                Search
              </Link>
            </li>
            <li>
              <Link
                to="/orders"
                className="relative py-2 px-4 text-yellow-300 hover:text-yellow-100 focus:outline-none transition-all duration-200 ease-in-out active:text-yellow-400 text-lg font-semibold"
                style={{ textDecoration: "none" }}
              >
                Orders
              </Link>
            </li>
            <li>
              <Link
                to="/deliver"
                className="relative py-2 px-4 text-yellow-300 hover:text-yellow-100 focus:outline-none transition-all duration-200 ease-in-out active:text-yellow-400 text-lg font-semibold"
                style={{ textDecoration: "none" }}
              >
                Deliver
              </Link>
            </li>
            <li>
              <Link
                to="/cart"
                className="relative py-2 px-4 text-yellow-300 hover:text-yellow-100 focus:outline-none transition-all duration-200 ease-in-out active:text-yellow-400 text-lg font-semibold"
                style={{ textDecoration: "none" }}
              >
                Cart
              </Link>
            </li>
            <li>
              <Link
                to="/support"
                className="relative py-2 px-4 text-yellow-300 hover:text-yellow-100 focus:outline-none transition-all duration-200 ease-in-out active:text-yellow-400 text-lg font-semibold"
                style={{ textDecoration: "none" }}
              >
                Support
              </Link>
            </li>
          </ul>
          <button
            onClick={handleLogout}
            className="relative py-2 px-6 text-yellow-300 hover:text-yellow-100 focus:outline-none transition-all duration-200 ease-in-out active:text-yellow-400 text-lg font-semibold"
            style={{ textDecoration: "none" }}
          >
            Logout
          </button>
        </div>
      </nav>
      <main>{children}</main>
    </div>
  );
}
