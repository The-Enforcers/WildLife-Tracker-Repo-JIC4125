import React, { useEffect, useState } from 'react';
import { getPosts } from '../services/postService';
import PostCard from '../components/PostCard';
import { Link } from 'react-router-dom';
import '../styles/MainPage.css'; // Import the CSS file for styling

const MainPage = () => {
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchPosts = async () => {
            const data = await getPosts();
            setPosts(data);
        };
        fetchPosts();
    }, []);

    return (
        <div>
            <h1>Wildlife Tracking Posts</h1>
            <div className="grid">
                {posts.map(post => (
                    <PostCard key={post._id} post={post} />
                ))}
            </div>
            <Link to="/create">
                <button>Create New Post</button>
            </Link>
        </div>
    );
};

export default MainPage;
