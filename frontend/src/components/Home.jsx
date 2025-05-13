import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-50 to-purple-50 flex items-center justify-center p-6">
      <div className="bg-white p-16 rounded-xl shadow-2xl w-full max-w-2xl text-center">
        <h1 className="text-5xl font-bold text-gray-800 mb-8">
          Buy, Sell @ IIITH
        </h1>

        <Link to="/login">
          <button className="w-full px-6 py-3 border border-gray-600 bg-gray-900 text-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none mb-4">
            Login
          </button>
        </Link>

        <h3 className="text-gray-600 mb-4">Don't have an account?</h3>

        <Link to="/register">
          <button className="w-full px-6 py-3 border border-gray-600 bg-gray-900 text-yellow-300 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none">
            Register
          </button>
        </Link>
      </div>
    </div>
  );
}
