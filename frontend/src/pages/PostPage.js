// src/pages/PostDetailsPage.js
import React from 'react';
import { useParams } from 'react-router-dom';

const PostDetailsPage = () => {
    const { id } = useParams();

    return (
        <div>
            <h1>Post Details for {id}</h1>
            {/* Full post details will go here */}
        </div>
    );
};

export default PostDetailsPage;
