import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById } from '../../services/postService';

const PostDetailsPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const navigate = useNavigate(); // Hook to navigate programmatically

    useEffect(() => {
        const fetchPost = async () => {
            const data = await getPostById(id);
            setPost(data);
        };
        fetchPost();
    }, [id]);

    if (!post) return <div>Loading...</div>;

    return (
        <div>
            <h1>{post.title}</h1>
            <p>Author: {post.author}</p>
            <p>Common names: {post.common_names}</p>
            <p>Description: {post.description}</p>
            <p>Tracker Type: {post.tracker_type}</p>
            <p>Enclosure Type: {post.enclosure_type}</p>
            <p>Attachment Type: {post.attachment_type}</p>
            <p>Recommendations: {post.recommendations}</p>
            {/* Button to navigate back to the main page */}
            <button onClick={() => navigate('/')}>Back to Main Page</button>
        </div>
    );
};

export default PostDetailsPage;
