import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./components/Register";
import Login from "./components/Login";
import Home from "./components/Home";
import Layout from "./components/Layout";
import { AuthProvider } from "./context/AuthContext";
import ProtectRoutes from "./components/ProtectRoutes";
import Profile from "./components/Profile";
import SearchItems from "./components/SearchItems";
import ItemDetails from "./components/ItemDetails";
import Cart from "./components/Cart";
import OrdersHistory from "./components/OrdersHistory";
import DeliverItems from "./components/DeliverItems";
import Support from "./components/Support";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          <Route
            path="/profile"
            element={
              <ProtectRoutes>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectRoutes>
            }
          />

          <Route
            path="/search"
            element={
              <ProtectRoutes>
                <Layout>
                  <SearchItems />
                </Layout>
              </ProtectRoutes>
            }
          />

          <Route
            path="/item/:itemId"
            element={
              <ProtectRoutes>
                <Layout>
                  <ItemDetails />
                </Layout>
              </ProtectRoutes>
            }
          />

          <Route
            path="/orders"
            element={
              <ProtectRoutes>
                <Layout>
                  <OrdersHistory />
                </Layout>
              </ProtectRoutes>
            }
          />

          <Route
            path="/deliver"
            element={
              <ProtectRoutes>
                <Layout>
                  <DeliverItems />
                </Layout>
              </ProtectRoutes>
            }
          />

          <Route
            path="/cart"
            element={
              <ProtectRoutes>
                <Layout>
                  <Cart />
                </Layout>
              </ProtectRoutes>
            }
          />

          <Route
            path="/support"
            element={
              <ProtectRoutes>
                <Layout>
                  <Support />
                </Layout>
              </ProtectRoutes>
            }
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
