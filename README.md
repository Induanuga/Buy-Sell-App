# Buy-Sell App @ IIITH

A full-stack web application for buying and selling items within the IIIT Hyderabad community. The platform supports user authentication, item listing, cart management, order placement with OTP verification, reviews, and a support chat powered by Google Gemini.

---

## Features

- **User Authentication:** Register and login with IIIT email verification.
- **Profile Management:** View and update user details, change password, and see cart and reviews.
- **Item Listing & Search:** Browse, search, and filter items by category.
- **Cart System:** Add and remove items from the cart.
- **Order Placement:** Place orders for items in the cart, with OTP-based transaction completion.
- **Order History:** View bought, sold, and pending orders.
- **Review System:** Buyers can review sellers after completing orders.
- **Support Chat:** Integrated AI-powered support chat (Google Gemini).
- **Secure API:** JWT-based authentication for all protected routes.

---

## API Routes

### Auth Routes

- `POST /api/auth/register`  
  Register a new user (IIIT email required).

- `POST /api/auth/login`  
  Login and receive a JWT token.

### User Routes

- `GET /api/users/:userId`  
  Get user profile.

- `PUT /api/users/:userId`  
  Update user profile.

- `PUT /api/users/:userId/password`  
  Change password.

- `PUT /api/users/:userId/cart/add`  
  Add item to cart.

- `PUT /api/users/:userId/cart/remove`  
  Remove item from cart.

- `GET /api/users/:userId/cart`  
  Get all cart items.

- `GET /api/users/:userId/reviews`  
  Get reviews for a user.

- `POST /api/users/:sellerId/reviews`  
  Add a review for a seller (after purchase).

### Item Routes

- `GET /api/items`  
  List/search available items.

- `GET /api/items/:itemId`  
  Get item details.

- `POST /api/items`  
  Create a new item (for sellers).

- `PUT /api/items/:itemId`  
  Update item status (e.g., mark as sold).

- `DELETE /api/items/:itemId`  
  Delete an item.

### Order Routes

- `POST /api/orders`  
  Place a new order (creates OTP).

- `GET /api/orders/user`  
  Get all orders for the logged-in user (bought/sold).

- `GET /api/orders/pending`  
  Get all pending orders

- `PUT /api/orders/:orderId/regenerate-otp`  
  Regenerate OTP for an order.

- `PUT /api/orders/:orderId/complete`  
  Complete an order by verifying OTP.

---

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [MongoDB](https://www.mongodb.com/) (local or remote)
- [npm](https://www.npmjs.com/)

### Backend Setup

1. **Make sure MongoDB is running locally**  
   (or update the connection string in `backend/config/connectToMongoDB.js` to use a remote database).

2. **Navigate to the backend folder:**
   ```sh
   cd backend
   ```

3. **Install dependencies:**
   ```sh
   npm install
   ```

4. **Create a `.env` file in the `backend` folder with the following content:**
   ```
   PORT=5000
   JWT_SECRET=your_secret_key
   ```

5. **Start the backend server:**
   ```sh
   npm start
   ```
   The backend will run on `http://localhost:5000`.

### Frontend Setup

1. **Navigate to the frontend folder:**
   ```sh
   cd frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Create a `.env` file in the `frontend` folder with the following content:**
   ```
   VITE_GEMINI_API_KEY=your_google_gemini_api_key
   ```

4. **Start the frontend dev server:**
   ```sh
   npm run dev
   ```
   The frontend will run on `http://localhost:5173` (or as shown in the terminal).

---

## Usage

- Open [http://localhost:5173](http://localhost:5173) in your browser.
- Register with your IIIT email (`@iiit.ac.in`).
- Login and explore features: search, buy, sell, review, and chat with support.

---

## Tech Stack

- **Frontend:** React, Vite, Tailwind CSS, Axios, React Router
- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT, bcrypt
- **AI Support:** Google Gemini API

---

## Notes

- Use Postman or any API client to test the routes.
- If your frontend needs to communicate with the backend, ensure API URLs in your frontend code point to the correct backend server (e.g., `http://localhost:5000/api`). If you want to use a proxy for API requests during development, you can configure it in `frontend/vite.config.js`.
- For support chat, you need a valid Google Gemini API key.


---

## Contributing

Pull requests are welcome! For major changes, please open an issue first.
