import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./pages/Main/Main.jsx";
import PostDetailsPage from "./pages/ViewPost/PostDetailsPage.js";
import CreatePostPage from "./pages/CreatePost/CreatePostPage.js";

const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/post" element={<PostDetailsPage />} />
      <Route path="/create" element={<CreatePostPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
