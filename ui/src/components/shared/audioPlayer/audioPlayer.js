import React, { useEffect, useRef, useState } from 'react';
import { setSuggestions } from '../../../api/index';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';

const AudioPlayer = ({ data, audioSrc }) => {
  const audioRef = useRef(null);
  const [responseList, setResponseList] = useState([]);

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
    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioFinished);

      return () => {
        audioRef.current.removeEventListener('ended', handleAudioFinished);
      };
    }
  }, []);

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

  return (
    <div className='category'>
      {data ? (

            <Card sx={{ maxWidth: 345 }}>
            <CardMedia
            sx={{ height: 140 }}
            image="/static/images/cards/contemplative-reptile.jpg"
            title="green iguana"
            />
            <CardContent>
            <Typography gutterBottom variant="h5" component="div">
                Lizard
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {data.text}
            </Typography>
            <div>
            <audio ref={audioRef} controls>
              <source src={audioSrc} type="audio/mp3" />
              Your browser does not support the audio element.
            </audio>

            <div>
              <button onClick={handlePlay}>Play</button>
              <button onClick={handlePause}>Pause</button>
              <button onClick={handleForward}>Forward 10s</button>
              <button onClick={handleRewind}>Rewind 10s</button>
            </div>
          </div>

            </CardContent>
            <CardActions>
            <Button size="small">Share</Button>
            <Button size="small">Learn More</Button>
            </CardActions>
            </Card>

      ) : (
        <p>Loading...</p>
      )}

      <ul>
        {responseList.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default AudioPlayer;
