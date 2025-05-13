import React, { useState, useEffect, useContext } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { token } = useContext(AuthContext);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserId(decodedToken.userId);
        const fetchCart = async () => {
          try {
            const response = await axios.get(
              `/users/${decodedToken.userId}/cart`
            );
            setCartItems(response.data.cart);
          } catch (err) {
            setError("Error fetching user cart.");
            console.error("Error fetching cart:", err);
          }
        };
        fetchCart();
      } catch (err) {
        console.error("Error decoding token:", err);
      }
    }
  }, [token, userId]);

  const handleRemoveFromCart = async (itemId) => {
    if (userId) {
      try {
        const response = await axios.put(`/users/${userId}/cart/remove`, {
          itemId,
        });
        if (response.status === 200) {
          setCartItems(response.data.user.cart);
        }
      } catch (err) {
        setError("Could not remove the item from the cart.");
        console.error("Could not remove the item:", err);
      }
    }
  };

  const calculateTotal = () => {
    return cartItems.reduce((acc, item) => acc + item.price, 0);
  };

  const handleOrder = async () => {
    if (!userId) {
      setError("No user is logged in");
      return;
    }
    try {
      if (cartItems.length === 0) {
        setError("Cart is empty");
        return;
      }
      const orderedItemIds = [];
      const otps = [];
      for (const item of cartItems) {
        if (item && item._id && item.sellerId) {
          const orderData = {
            itemId: item._id,
            amount: item.price,
            sellerId: item.sellerId,
          };
          try {
            const response = await axios.post("/orders", orderData);
            if (response.status === 201) {
              localStorage.setItem(response.data.order._id, response.data.order.otp);
              orderedItemIds.push(response.data.order._id);
              otps.push(response.data.order.otp);
              try {
                await axios.put(`/items/${item._id}`, { status: "sold" });
              } catch (error) {
                console.error("Error updating the item status:", error);
              }
              try {
                await axios.put(`/users/${userId}/cart/remove`, {
                  itemId: item._id,
                });
              } catch (err) {
                console.error("Error removing item from cart:", err);
              }
            }
          } catch (error) {
            setError(`Failed to order item ${item.name}. Please try again.`);
            console.error(`Error creating order for item ${item._id}:`, error);
            return;
          }
        }
      }
      try {
        const newCartResponse = await axios.get(`/users/${userId}/cart`);
        setCartItems(newCartResponse.data.cart);
      } catch (error) {
        console.error("Error refreshing cart:", error);
      }

      navigate("/orders", { state: { otp: otps, orderIds: orderedItemIds } });


    } catch (error) {
      setError("Error placing order, please try again");
      console.error("Error placing order", error);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8 border border-gray-200 relative">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Your Cart
        </h1>
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}
        {cartItems.length === 0 ? (
          <p className="text-center text-gray-600 mt-4">Your cart is empty</p>
        ) : (
          <div className="space-y-4">
            {cartItems.map((item) => (
              <div
                key={item._id}
                className="flex items-center justify-between border-b pb-2"
              >
                <span className="font-medium text-gray-700">{item?.name}</span>
                <div className="flex items-center gap-4">
                  <span className="text-gray-600">₹{item?.price}</span>
                  <button
                    onClick={() => handleRemoveFromCart(item._id)}
                    className="w-auto bg-gray-900 hover:bg-gray-800 text-yellow-300 font-semibold py-1 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 active:bg-gray-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}

            <div className="flex justify-between items-center mt-4">
              <span className="font-bold text-gray-800">Total:</span>
              <span className="text-2xl text-gray-800">
                ₹{calculateTotal()}
              </span>
            </div>
            <div className="text-center mt-4">
              <button
                onClick={handleOrder}
                className="w-auto bg-gray-900 hover:bg-gray-800 text-yellow-300 font-semibold py-1 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 active:bg-gray-700"
              >
                Order Items
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Cart;