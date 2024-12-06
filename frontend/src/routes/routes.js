import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "../pages/Main/Main.jsx";
import PostDetailsPage from "../pages/ViewPost/PostDetailsPage.js";
import CreatePostPage from "../pages/CreatePost/CreatePostPage.js";
import SearchResultsPage from "../pages/SearchResultsPage/SearchResultsPage.js";
import ProfilePage from "../pages/ProfilePage/ProfilePage.js";
import LoginPage from "../pages/Login/login.js";
import AdminManage from "../pages/AdminManage/AdminManage.js"
import Layout from "../pages/Layout/Layout.js";
import { UserProvider } from "../context/UserContext.js";
import { SnackbarProvider } from "../components/SnackBar/SnackBar.js";
import ProtectedRoute from "./ProtectedRoute.js";
import AdminRoute from "./AdminRoute";
import MunchPage from "../pages/munch/munch.js";
import CreditsPage from "../pages/Credits/credits.js";
const AppRoutes = () => {
  
  return (
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
                    <Route path="/user/:id" element={<ProfilePage />} />
                    <Route path="/munch" element={<MunchPage />} />
                    <Route path="/credits" element={<CreditsPage />} />
                    {/* Protected Routes */}
                    <Route path="/edit-post/:id" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
                    <Route path="/create" element={<ProtectedRoute><CreatePostPage /></ProtectedRoute>} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/admin" element={<AdminRoute><AdminManage /></AdminRoute>} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </UserProvider>
      </SnackbarProvider>
    </Router>
  );
};

export default AppRoutes;
