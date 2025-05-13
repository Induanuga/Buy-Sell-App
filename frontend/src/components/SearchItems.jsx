import React, { useState, useEffect, useContext } from "react";
import axios from "../utils/axios";
import { useNavigate } from "react-router-dom";
import { categories } from "../utils/categories";
import { AuthContext } from "../context/AuthContext";
import { jwtDecode } from "jwt-decode";

const SearchItems = () => {
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);

  const navigate = useNavigate();
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
    const fetchItems = async () => {
      try {
        const response = await axios.get("/items");
        setItems(response.data);
      } catch (err) {
        setError("Error fetching items.");
        console.error("Error fetching items:", err);
      }
    };
    fetchItems();
  }, [token]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter((cat) => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch = item.name
      ?.toLowerCase()
      .includes(searchQuery.toLowerCase());

    const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(item.category);
    const notOwnItem = !userId || item.sellerId?._id !== userId;

    return matchesSearch && matchesCategory && notOwnItem;
  });
  const goToItemPage = (itemId) => {
    navigate(`/item/${itemId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-xl p-8 border border-gray-200 relative">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Search Items
        </h1>
        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}
        <div className="flex items-center mb-4 gap-4">
          <input
            type="text"
            placeholder="Search items..."
            value={searchQuery}
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-yellow-500 focus:outline-none text-gray-700"
          />
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <label
                key={category}
                className="flex items-center space-x-2"
              >
                <input
                  type="checkbox"
                  value={category}
                  checked={selectedCategories.includes(category)}
                  onChange={handleCategoryChange}
                  className="rounded border border-gray-600 text-yellow-500 focus:ring-yellow-500"
                />
                <span className="text-gray-700">{category}</span>
              </label>
            ))}
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <p className="text-gray-600 text-center mt-4">No items found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredItems.map((item) => (
              <div
                key={item._id}
                className="bg-gray-100 rounded-lg p-4 hover:shadow-lg transition-shadow duration-300 cursor-pointer"
                onClick={() => goToItemPage(item._id)}
              >
                <div className="flex justify-between items-center mb-2">
                  <h2 className="text-xl font-semibold text-gray-800">
                    {item.name}
                  </h2>
                </div>
                <p className="text-gray-600">Price: ₹{item.price}</p>
                <p className="text-gray-600">Category: {item.category}</p>
                <p className="text-gray-600">
                  Seller: {item.sellerId?.firstName} {item.sellerId?.lastName}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchItems;
