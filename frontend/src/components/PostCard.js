import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
    return (
        <div className="post-card">
            <Link to={`/post/${post._id}`}>
                <h2>{post.title}</h2>
            </Link>
            <p>{post.description}</p>
        </div>
    );
};

export default PostCard;
