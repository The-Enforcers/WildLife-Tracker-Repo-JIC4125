import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostById } from '../../services/postService';
import { Accordion, AccordionSummary, AccordionDetails, Typography, Button, CircularProgress } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

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

    if (!post) return <CircularProgress />; // Show a loading spinner while data is being fetched

    // Helper function to get the first word from a string
    const getFirstWord = (text) => text?.split(' ')[0] || 'N/A';

    return (
        <div style={{ margin: '20px', maxWidth: '1000px', marginLeft: 'auto', marginRight: 'auto' }}>
            <h1>{post.title}</h1>
            
            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Author ({getFirstWord(post.author)})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>{post.author}</Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Common Names ({getFirstWord(post.commonName)})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>{post.commonName}</Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Tracker Type ({getFirstWord(post.trackerType)})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>{post.trackerType}</Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Enclosure Type ({getFirstWord(post.enclosureType)})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>{post.enclosureType}</Typography>
                </AccordionDetails>
            </Accordion>

            <Accordion sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Attachment Type ({getFirstWord(post.attachmentType)})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>{post.attachmentType}</Typography>
                </AccordionDetails>
            </Accordion>

            {/* Recommendations section expanded by default */}
            <Accordion defaultExpanded sx={{ width: '100%' }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography>Recommendations ({getFirstWord(post.recommendations)})</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography>{post.recommendations}</Typography>
                </AccordionDetails>
            </Accordion>

            {/* Button to navigate back to the main page */}
            <Button variant="contained" onClick={() => navigate('/')} sx={{ marginTop: '20px' }}>
                Back to Main Page
            </Button>
        </div>
    );
};

export default PostDetailsPage;




