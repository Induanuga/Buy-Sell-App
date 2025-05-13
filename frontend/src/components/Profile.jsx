import { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import axios from "../utils/axios";
import { jwtDecode } from "jwt-decode";

export default function Profile() {
  const { token } = useContext(AuthContext);
  const decodedToken = jwtDecode(token);
  const userId = decodedToken.userId;
  const [isEditing, setIsEditing] = useState(false);
  const [isPasswordEditing, setIsPasswordEditing] = useState(false);
  const [userDetails, setUserDetails] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [editedDetails, setEditedDetails] = useState({});
  const [error, setError] = useState("");
  const [sellerReviews, setSellerReviews] = useState([]);
  const [reviewItems, setReviewItems] = useState({});
  const [passwordFields, setPasswordFields] = useState({
    oldPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });


  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const response = await axios.get(`/users/${userId}`);
        setUserDetails(response.data.user);
        setEditedDetails(response.data.user);
      } catch (err) {
        setError("Failed to fetch user details.");
        console.error("Error fetching user details:", err);
      }
    };
    const fetchSellerReviews = async () => {
      try {
        const response = await axios.get(`/users/${userId}/reviews`);
        const reviews = response.data.reviews
        setSellerReviews(reviews)
        const items = {};
        for (const review of reviews) {
          try {
            const itemResponse = await axios.get(`/items/${review.itemId}`);
            items[review._id] = itemResponse.data;
          }
          catch (error) {
            console.error("Failed to fetch items for review", review._id, error);
          }
        }
        setReviewItems(items)
      }
      catch (err) {
        setError("Failed to fetch seller reviews.");
        console.error("Error fetching seller reviews:", err);
      }
    };
    const fetchCartDetails = async () => {
      try {
        const response = await axios.get(`/users/${userId}/cart`);
        setCartItems(response.data.cart);
      } catch (err) {
        setError("Failed to fetch user cart details.");
        console.error("Error fetching user cart details:", err);
      }
    };
    fetchUserDetails();
    fetchCartDetails();
    fetchSellerReviews();
  }, [userId, token]);

  const handleEdit = () => {
    setIsEditing(true);
  };
  const handleEditPassword = () => {
    setIsPasswordEditing(true);
  };
  const handleCancelPasswordEdit = () => {
    setIsPasswordEditing(false);
    setPasswordFields({
      oldPassword: "",
      newPassword: "",
      confirmNewPassword: "",
    });
    setError("");
  };


  const handleCancel = () => {
    setIsEditing(false);
    setEditedDetails(userDetails);
    setError("");
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedDetails({ ...editedDetails, [name]: value });
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordFields({ ...passwordFields, [name]: value });
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await axios.put(`/users/${userId}`, editedDetails);
      if (response.status === 200) {
        setUserDetails(response.data.user);
        setIsEditing(false);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update user details.");
      console.error("Error updating user details:", err);
    }
  };


  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    setError("");
    const { oldPassword, newPassword, confirmNewPassword } = passwordFields;
    if (!oldPassword) {
      setError("Please provide your old password");
      return;
    }
    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters');
      return;
    }
    if (newPassword !== confirmNewPassword) {
      setError("New passwords do not match")
      return;
    }
    try {
      const response = await axios.put(`/users/${userId}/password`, { oldPassword, password: newPassword });
      if (response.status === 200) {
        alert(response.data.message)
        setIsPasswordEditing(false);
        setPasswordFields({
          oldPassword: "",
          newPassword: "",
          confirmNewPassword: "",
        });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update password.");
      console.error("Error updating password:", err);
    }
  };




  if (!userDetails) {
    return <div className="text-center">Loading user profile...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8 border border-gray-200 relative">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Profile
        </h1>
        <div className="flex justify-center items-center flex-col">
          {error && (
            <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
          )}
        </div>

        {!isEditing && !isPasswordEditing ? (
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-medium">First Name:</span>
              <span className="text-gray-800">{userDetails.firstName}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-medium">Last Name:</span>
              <span className="text-gray-800">{userDetails.lastName}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-medium">Email:</span>
              <span className="text-gray-800">{userDetails.email}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-medium">Age:</span>
              <span className="text-gray-800">{userDetails.age}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-medium">Contact Number:</span>
              <span className="text-gray-800">{userDetails.contactNumber}</span>
            </div>


            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-gray-600 font-medium">Cart Items:</span>
              <span className="text-gray-800">
                {cartItems.length === 0 && (
                  <p className="text-gray-600">Your cart is empty.</p>
                )}
                {cartItems.length > 0 && (
                  <ul className="space-y-2">
                    {cartItems.map((item) => (
                      <li
                        key={item._id}
                        className="flex items-center justify-between border-b pb-2"
                      >
                        <span className="font-small text-gray-700">{item.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </span>
            </div>
            <div className="flex justify-between items-start border-b pb-2">
              <span className="text-gray-600 font-medium">Seller Reviews:</span>
              <span className="text-gray-800">
                {sellerReviews.length === 0 && (
                  <p className="text-gray-600">No Reviews yet.</p>
                )}
                {sellerReviews.length > 0 && (
                  <ul className="space-y-2">
                    {sellerReviews.map((review) => (

                      <li key={review._id} className="border rounded p-2 mt-2">
                        <div className="mb-1">
                          <span className="font-semibold">Buyer:</span>{" "}
                          <span>{review.buyerId?.firstName} {review.buyerId?.lastName}</span>
                        </div>
                        <div className="mb-1">
                          <span className="font-semibold">Item:</span>{" "}
                          <span>{reviewItems[review._id]?.name}</span>
                        </div>
                        <div className="mb-1">
                          <span className="font-semibold">Rating:</span>
                          <span>{review.rating}</span>
                        </div>
                        <div className="mb-1">
                          <span className="font-semibold">Comment:</span>
                          <span>{review.comment}</span>
                        </div>
                      </li>

                    ))}
                  </ul>
                )}
              </span>
            </div>
            <div className="text-center mt-4 flex justify-center gap-3">
              <button
                onClick={handleEdit}
                className="w-auto bg-gray-900 hover:bg-gray-800 text-yellow-300 font-semibold py-1 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 active:bg-gray-700"
              >
                Edit Profile
              </button>
              <button
                onClick={handleEditPassword}
                className="w-auto bg-gray-900 hover:bg-gray-800 text-yellow-300 font-semibold py-1 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 active:bg-gray-700"
              >
                Update Password
              </button>
            </div>
          </div>
        ) : isEditing ? (
          <form
            onSubmit={handleSubmit}
            className="space-y-4 flex flex-col gap-4"
          >
            <div className="flex items-center">
              <label
                htmlFor="firstName"
                className="text-gray-600 font-medium w-1/3 pr-4"
              >
                First Name:
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                placeholder="First Name"
                value={editedDetails.firstName}
                onChange={handleChange}
                className="w-2/3 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-700"
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="lastName"
                className="text-gray-600 font-medium w-1/3 pr-4"
              >
                Last Name:
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                placeholder="Last Name"
                value={editedDetails.lastName}
                onChange={handleChange}
                className="w-2/3 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-700"
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="email"
                className="text-gray-600 font-medium w-1/3 pr-4"
              >
                Email:
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Email"
                value={editedDetails.email}
                onChange={handleChange}
                className="w-2/3 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-700"
                disabled
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="age"
                className="text-gray-600 font-medium w-1/3 pr-4"
              >
                Age:
              </label>
              <input
                type="number"
                id="age"
                name="age"
                placeholder="Age"
                value={editedDetails.age}
                onChange={handleChange}
                className="w-2/3 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-700"
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="contactNumber"
                className="text-gray-600 font-medium w-1/3 pr-4"
              >
                Contact Number:
              </label>
              <input
                type="text"
                id="contactNumber"
                name="contactNumber"
                placeholder="Contact Number"
                value={editedDetails.contactNumber}
                onChange={handleChange}
                className="w-2/3 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-700"
              />
            </div>
            <div className="flex justify-center gap-3 mt-4">
              <button
                type="submit"
                className="w-auto bg-gray-900 hover:bg-gray-800 text-yellow-300 font-semibold py-1 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 active:bg-gray-700"
              >
                Save
              </button>
              <button
                type="button"
                onClick={handleCancel}
                className="w-auto bg-gray-900 hover:bg-gray-800 text-yellow-300 font-semibold py-1 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 active:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <form
            onSubmit={handlePasswordUpdate}
            className="space-y-4 flex flex-col gap-4"
          >
            <div className="flex items-center">
              <label
                htmlFor="oldPassword"
                className="text-gray-600 font-medium w-1/3 pr-4"
              >
                Old Password:
              </label>
              <input
                type="password"
                id="oldPassword"
                name="oldPassword"
                placeholder="Old Password"
                value={passwordFields.oldPassword}
                onChange={handlePasswordChange}
                className="w-2/3 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-700"
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="newPassword"
                className="text-gray-600 font-medium w-1/3 pr-4"
              >
                New Password:
              </label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                placeholder="New Password"
                value={passwordFields.newPassword}
                onChange={handlePasswordChange}
                className="w-2/3 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-700"
              />
            </div>
            <div className="flex items-center">
              <label
                htmlFor="confirmNewPassword"
                className="text-gray-600 font-medium w-1/3 pr-4"
              >
                Confirm New Password:
              </label>
              <input
                type="password"
                id="confirmNewPassword"
                name="confirmNewPassword"
                placeholder="Confirm New Password"
                value={passwordFields.confirmNewPassword}
                onChange={handlePasswordChange}
                className="w-2/3 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-300 focus:outline-none text-gray-700"
              />
            </div>
            <div className="flex justify-center gap-3 mt-4">
              <button
                type="submit"
                className="w-auto bg-gray-900 hover:bg-gray-800 text-yellow-300 font-semibold py-1 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 active:bg-gray-700"
              >
                Update Password
              </button>
              <button
                type="button"
                onClick={handleCancelPasswordEdit}
                className="w-auto bg-gray-900 hover:bg-gray-800 text-yellow-300 font-semibold py-1 px-4 rounded-md transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-opacity-75 active:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}