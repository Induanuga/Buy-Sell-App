import React, { useState, useEffect, useContext } from 'react';
import axios from '../utils/axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { jwtDecode } from 'jwt-decode';

const ItemDetails = () => {
  const { itemId } = useParams();
  const [item, setItem] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);


  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId);
      }
      catch (err) {
        console.error("Error decoding token:", err)
      }
    }
    const fetchItemDetails = async () => {
      try {
        const response = await axios.get(`/items/${itemId}`);
        setItem(response.data);
      } catch (err) {
        setError("Error fetching item details.");
        console.error("Error fetching item details:", err);
      }
    };
    fetchItemDetails();
  }, [itemId, token]);



  const handleAddToCart = async () => {
    if (!userId) {
      setError("You must be logged in to add items to cart");
      return;
    }
    try {
      const response = await axios.put(`/users/${userId}/cart/add`, { itemId });
      if (response.status === 200) {
        navigate('/cart')
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not add to cart");
      console.error("Could not add to cart:", err);
    }
  };


  if (!item) {
    return <div className="text-center">Loading Item Details...</div>;
  }


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8 border border-gray-200 relative">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Item Details</h1>
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-medium">Name:</span>
            <span className="text-gray-800">{item.name}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-medium">Price:</span>
            <span className="text-gray-800">₹{item.price}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-medium">Description:</span>
            <span className="text-gray-800">{item.description}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-medium">Category:</span>
            <span className="text-gray-800">{item.category}</span>
          </div>
          <div className="flex justify-between items-center border-b pb-2">
            <span className="text-gray-600 font-medium">Seller:</span>
            <span className="text-gray-800">{item.sellerId?.firstName} {item.sellerId?.lastName}</span>
          </div>
          <div className="text-center mt-4">
            <button
              onClick={handleAddToCart}
              className="w-auto bg-gray-900 hover:bg-gray-800 text-yellow-300 font-semibold py-1 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 active:bg-gray-700"
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemDetails;