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
        <div style={styles.container}>
            <h1 style={styles.title}>{post.title}</h1>
            <div style={styles.detailsContainer}>
                <p><strong>Author:</strong> {post.author}</p>
                <p><strong>Common names:</strong> {post.commonName}</p>
                <p><strong>Tracker Type:</strong> {post.trackerType}</p>
                <p><strong>Enclosure Type:</strong> {post.enclosureType}</p>
                <p><strong>Attachment Type:</strong> {post.attachmentType}</p>
                <p><strong>Recommendations:</strong> {post.recommendations}</p>
            </div>
            <button style={styles.button} onClick={() => navigate('/')}>Back to Main Page</button>
        </div>
    );
};

const styles = {
    container: {
        maxWidth: '600px',
        margin: '40px auto',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
    },
    title: {
        fontSize: '28px',
        fontWeight: 'bold',
        marginBottom: '20px',
        textAlign: 'center',
        color: '#333',
    },
    detailsContainer: {
        marginBottom: '20px',
    },
    button: {
        display: 'block',
        width: '100%',
        padding: '10px 15px',
        backgroundColor: '#4CAF50',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    loading: {
        fontSize: '18px',
        textAlign: 'center',
        marginTop: '50px',
    }
};


export default PostDetailsPage;
