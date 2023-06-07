import { useParams } from 'react-router-dom';
import { getEpisode } from '../../api/index.js';
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
import React, { useState, useEffect } from 'react';
import { createMuiTheme, ThemeProvider } from '@material-ui/core';
import AudioPlayer from 'material-ui-audio-player';
import { PlayCircleFilled, PauseCircleFilled } from '@material-ui/icons';

const Category = () => {
    const { id } = useParams();
    const [data, setData] = useState(null);
    const [expanded, setExpanded] = React.useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
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


   return (
    <div>
      {data ? (
        <div>
          <p>{data.text}</p>
          <p>Additional content...</p>

          <AudioPlayer
            src={data.signedUrl}
            layout="horizontal"
            customIcons={{
              play: <PlayCircleFilled />,
              pause: <PauseCircleFilled />,
            }}
          />

        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Category;