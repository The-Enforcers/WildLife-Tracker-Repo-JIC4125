import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById } from '../../services/postService';

const PostDetailsPage = () => {
    const { id } = useParams();
    const [post, setPost] = useState(null);
    const [error, setError] = useState(null);
    const [hover, setHover] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const data = await getPostById(id);
                setPost(data);
            } catch (error) {
                setError('Failed to fetch post data.');
                console.error("Failed to fetch post", error);
            }
        };
        fetchPost();
    }, [id]);

    if (error) return <div style={styles.error}>{error}</div>;
    if (!post) return <div style={styles.loading}>Loading...</div>;

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
            <button
                style={hover ? { ...styles.button, ...styles.buttonHover } : styles.button}
                onMouseEnter={() => setHover(true)}
                onMouseLeave={() => setHover(false)}
                onClick={() => navigate('/')}
            >
                Back to Main Page
            </button>
        </div>
    );
};

const styles = {
    container: {
        width: '100%',
        maxWidth: '1200px',
        margin: '20px auto',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#f9f9f9',
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
        fontFamily: 'Arial, sans-serif',
        minHeight: '80vh',
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
        width: '200px',
        padding: '10px 15px',
        backgroundColor: '#4CAF50',
        color: 'white',
        fontSize: '16px',
        fontWeight: 'bold',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: 'background-color 0.3s',
    },
    buttonHover: {
        backgroundColor: '#45a049',
    },
    loading: {
        fontSize: '18px',
        textAlign: 'center',
        marginTop: '50px',
        color: '#666',
    },
    error: {
        fontSize: '18px',
        textAlign: 'center',
        marginTop: '50px',
        color: 'red',
    },
};

export default PostDetailsPage;
