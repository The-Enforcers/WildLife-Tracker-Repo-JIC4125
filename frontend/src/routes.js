import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import MainPage from "./pages/MainPage";
import PostDetailsPage from "./pages/PostDetailsPage";
import CreatePostPage from "./pages/CreatePostPage";


const AppRoutes = () => (
  <Router>
    <Routes>
      <Route path="/" element={<MainPage />} />
      <Route path="/post/:id" element={<PostDetailsPage />} />
      <Route path="/create" element={<CreatePostPage />} />
    </Routes>
  </Router>
);

export default AppRoutes;
