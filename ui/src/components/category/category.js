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

import React, { useState, useEffect, useRef } from 'react';
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
  }, [audioRef.current]);

  const handlePlay = () => {
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
        <div className='category'>
          <p>{data.text}</p>
          <p>Additional content...</p>

          <div>
            <audio ref={audioRef} controls>
              <source
                src="https://storage.googleapis.com/ai-content-creator/corvette-zr1-vs-ford-gt00-1686165692096.mp3?GoogleAccessId=api-project%40api-project-108888684492.iam.gserviceaccount.com&Expires=1740816000&Signature=kvBnr3rZQI39YU%2BV0TrVjxzoOjqbee%2FmjPF8HxoobBPSzXC5ngfl9E9KgPqoalsgL9kNCBjc6lZU4fOj7I9Kff2t9ebvvxubeBhsrYMGf57smDsDhx%2FdCo1E3WnMk6Nyv0XZ7ruEu0WmtEA7MDZcyouGTl%2BPhksH1MsnAcXJ6qgHdOdaxIIaUL%2BrVE4OSVm3j0xzGHq6Pvjxt9H6psqek0011JcPt5PLMaQ8GZ9JtkswWUvOXn1Wtze%2Fvkua79ToNx6%2B520L4AFw%2BVSSkyPknrmQrYBl62R2WME%2FV0YsIpU1BTdYV7uqmORqrrPZw6gkE%2FyMXcDjDkPaPS6pITe%2BrA%3D%3D"
                type="audio/mp3"
              />
              Your browser does not support the audio element.
            </audio>

            <div>
              <button onClick={handlePlay}>Play</button>
              <button onClick={handlePause}>Pause</button>
              <button onClick={handleForward}>Forward 10s</button>
              <button onClick={handleRewind}>Rewind 10s</button>
            </div>
          </div>
        </div>
      ) : (
        <p>Loading...</p>
      )}

        {responseList && responseList[0] && responseList[0].message ? (
          <div className='responseList'>
            <h3>Here are some suggestions for you:</h3>
            {responseList[0].message.map((item, index) => (
              <Button key={index} variant="contained" onClick={() => handleSuggestedItemClick(item)}>
                {item.replace("-", "")}
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
