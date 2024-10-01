import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./pages/Main/Main.jsx";
import PostDetailsPage from "./pages/ViewPost/PostDetailsPage.js";
import CreatePostPage from "./pages/CreatePost/CreatePostPage.js";
import SearchResultsPage from "./pages/Main/SearchResultsPage.js";
import LoginPage from "./pages/Login/login.js";
import ProfilePage from "./pages/ProfilePage/ProfilePage.js";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/results" element={<SearchResultsPage />} />
      <Route path="/post/:id" element={<PostDetailsPage />} />
      <Route path="/create" element={<CreatePostPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/profile" element={<ProfilePage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
