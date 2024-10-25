import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "../pages/Main/Main.jsx";
import PostDetailsPage from "../pages/ViewPost/PostDetailsPage.js";
import CreatePostPage from "../pages/CreatePost/CreatePostPage.js";
import SearchResultsPage from "../pages/SearchResultsPage/SearchResultsPage.js";
import ProfilePage from "../pages/ProfilePage/ProfilePage.js";
import LoginPage from "../pages/Login/login.js";
import Layout from "../pages/Layout/Layout.js";
import { UserProvider } from "../context/UserContext.js";
import { SnackbarProvider } from "../components/SnackBar/SnackBar.js";
import ProtectedRoute from "./ProtectedRoute.js";

const AppRoutes = () => (
  <Router>
    <SnackbarProvider>
      <UserProvider>
        <Routes>
          <Route
            path="/*"
            element={
              <Layout>
                <Routes>
                  <Route path="/" element={<Main />} />
                  <Route path="/posts" element={<SearchResultsPage />} />
                  <Route path="/posts/:id" element={<PostDetailsPage />} />

                  {/* Protected Routes */}
                  <Route path="/edit-post/:id" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
                  <Route path="/create" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
                  <Route path="/login" element={<LoginPage />} />
                </Routes>
              </Layout>
            }
          />
        </Routes>
      </UserProvider>
    </SnackbarProvider>
  </Router>
);

export default AppRoutes;
