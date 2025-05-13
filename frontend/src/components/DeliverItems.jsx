import React, { useState, useEffect, useContext } from "react";
import axios from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const DeliverItems = () => {
  const [pendingOrders, setPendingOrders] = useState([]);
  const [error, setError] = useState("");
  const [otpInputs, setOtpInputs] = useState({});
  const { token } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
    const fetchPendingOrders = async () => {
      try {
        const response = await axios.get("/orders/pending");

        setPendingOrders(response.data.pendingSellerOrders);

      } catch (err) {
        setError("Failed to fetch pending order details.");
        console.error("Error fetching pending order details:", err);
      }
    };
    fetchPendingOrders();
  }, [token, userId]);
  const handleOtpChange = (orderId, e) => {
    setOtpInputs({ ...otpInputs, [orderId]: e.target.value });
  };

  const handleCompleteTransaction = async (orderId) => {
    const otp = otpInputs[orderId];
    if (!otp) {
      setError("Please enter OTP");
      return;
    }
    try {
      const response = await axios.put(`/orders/${orderId}/complete`, { otp });
      if (response.status === 200) {
        setPendingOrders((prevOrders) =>
          prevOrders.filter((order) => order._id !== orderId)
        );

        alert(
          `Transaction closed successfully for order : ${response.data.order.itemId?.name}`
        );


      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Failed to complete transaction."
      );
      console.error("Error closing transaction:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-xl p-8 border border-gray-200 relative">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Deliver Items
        </h1>
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}
        {pendingOrders.length === 0 ? (
          <p className="text-gray-600 text-center mt-4">
            No pending orders to deliver
          </p>
        ) : (
          <div className="space-y-4">
            {pendingOrders.map((order) => (
              <div key={order._id} className="border p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">Item:</span>
                  <span className="text-gray-700">{order.itemId?.name}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">Price:</span>
                  <span className="text-gray-700">₹{order.itemId?.price}</span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="font-semibold text-gray-700">Buyer:</span>
                  <span className="text-gray-700">
                    {order.buyerId?.firstName} {order.buyerId?.lastName}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otpInputs[order._id] || ""}
                    onChange={(e) => handleOtpChange(order._id, e)}
                    className="flex-1 px-4 py-2 border border-gray-600 rounded-md bg-gray-100 text-gray-900 placeholder-gray-600 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
                  />
                  <button
                    onClick={() => handleCompleteTransaction(order._id)}
                    className="w-auto bg-gray-900 hover:bg-gray-800 text-yellow-300 font-semibold py-1 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 active:bg-gray-700"
                  >
                    Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeliverItems;