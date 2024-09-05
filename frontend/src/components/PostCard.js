import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
    return (
        <div className="post-card">
            <Link to={`/post/${post._id}`}>
                <h2>{post.title}</h2>
            </Link>
            <p>Common Names: {post.common_names}</p>
            <p>Author: {post.author}</p>
            <p>{post.description}</p>
            <p>{post.date}</p>
        </div>
    );
};

export default PostCard;
