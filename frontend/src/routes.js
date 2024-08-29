// src/routes.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MainPage from './pages/MainPage';
import PostPage from './pages/PostPage';
import CreatePostPage from './pages/CreatePostPage';

const AppRoutes = () => (
    <Router>
        <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/post/:id" element={<PostPage />} />
            <Route path="/create" element={<CreatePostPage />} />
        </Routes>
    </Router>
);

export default AppRoutes;
