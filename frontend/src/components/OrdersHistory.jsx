import React, { useState, useEffect, useContext, useRef } from "react";
import axios from "../utils/axios";
import { useLocation } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const OrdersHistory = () => {
  const [boughtOrders, setBoughtOrders] = useState([]);
  const [soldOrders, setSoldOrders] = useState([]);
  const [activeTab, setActiveTab] = useState("pending");
  const location = useLocation();
  const [pendingOrders, setPendingOrders] = useState([]);
  const [error, setError] = useState("");
  const [reviewInputs, setReviewInputs] = useState({});
  const [otpMap, setOtpMap] = useState({});
  const initialBoughtOrdersRef = useRef([]);
  const { token } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);


  const fetchOrders = async () => {
    try {
      const response = await axios.get("/orders/user");

      if (activeTab === 'bought') {
        const newOrders = response.data.boughtOrders;
        if (initialBoughtOrdersRef.current.length > 0) {
          const newBoughtOrders = newOrders.filter((order) => {
            return !initialBoughtOrdersRef.current.some(initialOrder => initialOrder._id === order._id);
          });
          setBoughtOrders((prevOrders) => [...prevOrders, ...newBoughtOrders]);
        } else {
          setBoughtOrders(newOrders);
          initialBoughtOrdersRef.current = newOrders
        }
      }
      if (activeTab === 'sold') {
        setSoldOrders(response.data.soldOrders);
      }


    } catch (err) {
      setError("Failed to fetch order details.");
      console.error("Error fetching orders:", err);
    }
  };


  const fetchPendingOrders = async () => {
    try {
      const response = await axios.get("/orders/pending");
      const initialOtps = {};
      response.data.pendingBuyerOrders.forEach((order) => {
        initialOtps[order._id] = localStorage.getItem(order._id) || "N/A";
      });
      setOtpMap(initialOtps);
      setPendingOrders(response.data.pendingBuyerOrders);

    } catch (err) {
      console.error("Error fetching pending orders:", err);
      setError("Failed to fetch pending order details.")
    }
  };

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId);
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
    if (activeTab === "pending") {
      fetchPendingOrders();
    }
    if (activeTab === "bought" || activeTab === "sold") {
      fetchOrders();
    }

    if (location.state?.otp) {
      setOtpMap(prevOtpMap => {
        const newOtpMap = { ...prevOtpMap }
        if (Array.isArray(location.state.otp)) {
          location.state.orderIds.forEach((orderId, index) => {
            newOtpMap[orderId] = localStorage.getItem(orderId) || "N/A";
          })
        } else if (location.state.orderId) {
          newOtpMap[location.state.orderId] = localStorage.getItem(location.state.orderId) || "N/A";

        }
        return newOtpMap;
      });
    }
  }, [token, userId, location.state, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === 'bought' || tab === 'sold') {
      fetchOrders();
    }
  }


  const handleRegenerateOTP = async (orderId) => {
    try {
      const response = await axios.put(`/orders/${orderId}/regenerate-otp`);
      if (response.status === 200) {
        localStorage.setItem(orderId, response.data.otp)
        setOtpMap(prevState => ({ ...prevState, [orderId]: response.data.otp }));
      }
    } catch (err) {
      setError("Failed to re-generate OTP.");
      console.error("Error re-generating otp:", err);
    }
  };

  const handleReviewSubmit = async (orderId) => {
    try {
      const { rating, comment } = reviewInputs[orderId];
      if (!rating || !comment) {
        setError("Please provide a rating and comment to submit a review");
        return;
      }
      const order = boughtOrders.find((order) => order._id === orderId);
      const response = await axios.post(`/users/${order.sellerId._id}/reviews`, {
        itemId: order.itemId._id,
        rating,
        comment,
      });
      if (response.status === 201) {
        alert(`Review added successfully for Item: ${order.itemId.name}`);
        setReviewInputs({ ...reviewInputs, [orderId]: { rating: "", comment: "" } });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error adding review.");
      console.error("Error submitting review:", err);
    }
  };



  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-5xl mx-auto bg-white rounded-lg shadow-xl p-8 border border-gray-200 relative">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Orders History
        </h1>
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <div className="flex justify-center space-x-6 mb-4">
          <button
            onClick={() => handleTabChange("pending")}
            className={`py-2 px-4 rounded-md focus:outline-none transition-colors duration-300 ${activeTab === "pending"
              ? "bg-[#e1c16e] text-gray-900 hover:bg-[#cfa04f]"
              : "bg-gray-600 text-gray-200 hover:bg-gray-700"
              }`}
          >
            Pending
          </button>
          <button
            onClick={() => handleTabChange("bought")}
            className={`py-2 px-4 rounded-md focus:outline-none transition-colors duration-300 ${activeTab === "bought"
              ? "bg-[#e1c16e] text-gray-900 hover:bg-[#cfa04f]"
              : "bg-gray-600 text-gray-200 hover:bg-gray-700"
              }`}
          >
            Bought
          </button>
          <button
            onClick={() => handleTabChange("sold")}
            className={`py-2 px-4 rounded-md focus:outline-none transition-colors duration-300 ${activeTab === "sold"
              ? "bg-[#e1c16e] text-gray-900 hover:bg-[#cfa04f]"
              : "bg-gray-600 text-gray-200 hover:bg-gray-700"
              }`}
          >
            Sold
          </button>
        </div>
        <div>
          {activeTab === "pending" && (
            <div>
              {pendingOrders.length === 0 ? (
                <p className="text-center text-gray-600 mt-4">
                  No pending orders found
                </p>
              ) : (
                <div className="space-y-4">
                  {pendingOrders.map((order) => (
                    <div
                      key={order._id}
                      className="border p-4 rounded-lg shadow-md"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">Item:</span>
                        <span className="text-gray-700">
                          {order.itemId?.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">
                          Price:
                        </span>
                        <span className="text-gray-700">
                          ₹{order.itemId?.price}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">
                          Seller Name:
                        </span>
                        <span className="text-gray-700">
                          {order.sellerId?.firstName} {order.sellerId?.lastName}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">
                          OTP:
                        </span>
                        <span className="text-gray-700">
                          {otpMap[order._id] || "N/A"}
                        </span>
                      </div>
                      {order.buyerId === userId && (
                        <button
                          onClick={() => handleRegenerateOTP(order._id)}
                          className="w-auto bg-gray-900 hover:bg-gray-800 text-yellow-300 font-semibold py-1 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 active:bg-gray-700"
                        >
                          Regenerate OTP
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "bought" && (
            <div>
              {boughtOrders.length === 0 ? (
                <p className="text-center text-gray-600 mt-4">
                  No bought orders found
                </p>
              ) : (
                <div className="space-y-4">
                  {boughtOrders.map((order) => (
                    <div
                      key={order._id}
                      className="border p-4 rounded-lg shadow-md"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">Item:</span>
                        <span className="text-gray-700">
                          {order.itemId?.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">
                          Price:
                        </span>
                        <span className="text-gray-700">
                          ₹{order.itemId?.price}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">
                          Seller Name:
                        </span>
                        <span className="text-gray-700">
                          {order.sellerId?.firstName} {order.sellerId?.lastName}
                        </span>
                      </div>
                      <div className='space-y-2'>
                        {/* Review input section */}
                        <div className='flex items-center gap-2'>
                          <label
                            htmlFor={`rating-${order._id}`}
                            className="font-semibold text-gray-600"
                          >
                            Rating:
                          </label>
                          <select
                            id={`rating-${order._id}`}
                            value={reviewInputs[order._id]?.rating || ''}
                            onChange={(e) => setReviewInputs({
                              ...reviewInputs,
                              [order._id]: {
                                ...reviewInputs[order._id],
                                rating: e.target.value,
                              }
                            })}
                            className="border rounded px-2 py-1 focus:ring-blue-300 focus:outline-none"
                          >
                            <option value="">Select Rating</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                          </select>
                        </div>
                        <div className='flex items-center gap-2'>
                          <label
                            htmlFor={`comment-${order._id}`}
                            className="font-semibold text-gray-600"
                          >
                            Comment:
                          </label>
                          <textarea
                            id={`comment-${order._id}`}
                            value={reviewInputs[order._id]?.comment || ''}
                            onChange={(e) => setReviewInputs({
                              ...reviewInputs,
                              [order._id]: {
                                ...reviewInputs[order._id],
                                comment: e.target.value,
                              }
                            })}
                            className="border rounded px-2 py-1 focus:ring-blue-300 focus:outline-none w-full"
                            placeholder="Add a comment"
                            rows={2}
                          />
                        </div>

                        <button
                          onClick={() => handleReviewSubmit(order._id)}
                          className="bg-[#e1c16e] hover:bg-[#cfa04f] text-gray-900 font-semibold py-2 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 active:bg-[#cfa04f]"
                        >
                          Submit Review
                        </button>

                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
          {activeTab === "sold" && (
            <div>
              {soldOrders.length === 0 ? (
                <p className="text-center text-gray-600 mt-4">
                  No sold orders found
                </p>
              ) : (
                <div className="space-y-4">
                  {soldOrders.map((order) => (
                    <div
                      key={order._id}
                      className="border p-4 rounded-lg shadow-md"
                    >
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">Item:</span>
                        <span className="text-gray-700">
                          {order.itemId?.name}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">
                          Price:
                        </span>
                        <span className="text-gray-700">
                          ₹{order.itemId?.price}
                        </span>
                      </div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-semibold text-gray-700">
                          Buyer Name:
                        </span>
                        <span className="text-gray-700">
                          {order.buyerId?.firstName} {order.buyerId?.lastName}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrdersHistory;