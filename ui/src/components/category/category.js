import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { getEpisode, setSuggestions } from '../../api/index.js';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red, amber } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Button from '@mui/material/Button';

import './category.css';

const Category = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [expanded, setExpanded] = useState(false);
  const [responseList, setResponseList] = useState([]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleAudioFinished = async () => {
    try {
      console.log('API post request started');
      const response = await setSuggestions('Ford vs Mustang history');
      console.log('API post request successful');
      console.log(response);
      setResponseList(response); // Update the response list state with the API response
    } catch (error) {
      console.error('API post request failed:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const response = await getEpisode(id); // Make your API request here

      if (response && response.length > 0) {
        setData(response[0].message); // Access the first element of the array and its `message` property
      }
    };

    fetchData();
  }, [id]);

  const audioRef = useRef(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioFinished);

      return () => {
        audioRef.current.removeEventListener('ended', handleAudioFinished);
      };
    }
  }, []);

  const handlePlay = () => {
    audioRef.current.src = data.audio; // Assuming `data.audio` contains the audio source URL
    audioRef.current.play();
  };

  const handlePause = () => {
    audioRef.current.pause();
  };

  const handleForward = () => {
    audioRef.current.currentTime += 10; // Forward by 10 seconds
  };

  const handleRewind = () => {
    audioRef.current.currentTime -= 10; // Rewind by 10 seconds
  };

  const handleSuggestedItemClick = (item) => {
    console.log(item);
    audioRef.current.pause();
  };

  return (
    <div>
      {data ? (
        <div className="category" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Card sx={{ maxWidth: 345 }}>
            <CardMedia sx={{ height: 140 }} image={data.image} title="green iguana" />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {data.title}
              </Typography>
              <Typography variant="body2" color="text.secondary" style={{ maxHeight: 250, overflowY: 'scroll' }}>
                {data.text}
              </Typography>
              <div>
                <audio ref={audioRef} controls>
                  <source src={data.audio} type="audio/mp3" /> // Assuming `data.audio` contains the audio source URL
                  Your browser does not support the audio element.
                </audio>
                <div>
                  <Button onClick={handlePlay}>Play</Button>
                  <Button onClick={handlePause}>Pause</Button>
                  <Button onClick={handleForward}>Forward 10s</Button>
                  <Button onClick={handleRewind}>Rewind 10s</Button>
                </div>
              </div>
            </CardContent>
            <CardActions>
              <Button size="small">Share</Button>
              <Button size="small">Learn More</Button>
            </CardActions>
          </Card>
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {responseList && responseList[0] && responseList[0].message ? (
        <div className="responseList">
          <h3>Here are some suggestions for you:</h3>
          {responseList[0].message.map((item, index) => (
            <Button key={index} variant="contained" onClick={() => handleSuggestedItemClick(item)}>
              {item.replace('-', '')}
            </Button>
          ))}
        </div>
      ) : (
        <p>No messages found.</p>
      )}
    </div>
  );
};

export default Category;
