import React from "react";
import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import HouseDetails from "./pages/HouseDetails";
import UserProfile from "./pages/UserProfile";
import Layout from "./components/Layout";

const App = () => {
  return (
    <React.Fragment>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/house-details/:meta_code"
          element={
            <Layout>
              <HouseDetails />
            </Layout>
          }
        />
        <Route
          path="/user-profile/:id"
          element={
            <Layout>
              <UserProfile />
            </Layout>
          }
        ></Route>
      </Routes>
    </React.Fragment>
  );
};

export default App;
