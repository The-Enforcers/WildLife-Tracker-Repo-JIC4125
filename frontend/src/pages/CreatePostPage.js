import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createPost } from '../services/postService';

const CreatePostPage = () => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const navigate = useNavigate(); // Hook for programmatic navigation

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newPost = { title, description };
        
        try {
            // Call the service function to create a new post
            await createPost(newPost);
            
            // After successfully creating the post, navigate back to the main page
            navigate('/');
        } catch (error) {
            console.error('Error creating post:', error);
            // You can display an error message to the user here
        }
    };

    return (
        <div>
            <h1>Create a New Post</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label>Title</label>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />
                </div>
                <div>
                    <label>Description</label>
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <button type="submit">Submit</button>
            </form>
        </div>
    );
};

export default CreatePostPage;
