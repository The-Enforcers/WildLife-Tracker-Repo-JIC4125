import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Main from "./pages/Main/Main.jsx";
import PostDetailsPage from "./pages/ViewPost/PostDetailsPage.js";
import CreatePostPage from "./pages/CreatePost/CreatePostPage.js";
import SearchResultsPage from "./pages/SearchResultsPage/SearchResultsPage.js";
import ProfilePage from "./pages/ProfilePage/ProfilePage.js";
import LoginPage from "./pages/Login/login.js";
import Layout from "./pages/Layout/Layout.js";
import { UserProvider } from "./context/UserContext";
import { SnackbarProvider } from "./components/SnackBar/SnackBar.js"; // Correct import for SnackbarProvider

const AppRoutes = () => (
  <Router>
    <SnackbarProvider> {/* Page Notifications */}
      <UserProvider>
        <Routes>
          <Route
            path="/*"
            element={
              <Layout> {/* Page layout - has Sidebar and Navbar */}
                <Routes>
                  <Route path="/" element={<Main />} />
                  <Route path="/results" element={<SearchResultsPage />} />
                  <Route path="/post/:id" element={<PostDetailsPage />} />
                  <Route path="/edit-post/:id" element={<CreatePostPage />} />
                  <Route path="/create" element={<CreatePostPage />} />
                  <Route path="/profile" element={<ProfilePage />} />
                </Routes>
              </Layout>
            }
          />

          {/* LoginPage without Layout */}
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </UserProvider>
    </SnackbarProvider>
  </Router>
);

export default AppRoutes;
