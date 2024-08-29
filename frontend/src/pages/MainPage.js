import React, { useEffect, useState } from 'react';
import { getPosts } from '../services/postService';
import { Link } from 'react-router-dom';

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
                    <div key={post._id}>
                        <h2>{post.title}</h2>
                        <p>{post.description}</p>
                    </div>
                ))}
            </div>
            {/* Add the button to navigate to the Create Post page */}
            <Link to="/create">
                <button>Create New Post</button>
            </Link>
        </div>
    );
};

export default MainPage;
