import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEpisode } from '../../api/index.js';
import AudioPlayer from '../shared/audioPlayer/audioPlayer'; // Adjust this import path
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Link from '@material-ui/core/Link';

const Category = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);

  console.log(data, "DATA BRUH");

  const [responseList, setResponseList] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      const response = await getEpisode(id); // Make your API request here

      if (response && response.length > 0) {
        setData(response[0].message); // Access the first element of the array and its `message` property
      }
    };

    fetchData();
  }, [id]);

  const handleSuggestedItemClick = (item) => {
    console.log(item);
    // Perform the necessary action when a suggested item is clicked
  };

  const useStyles = makeStyles((theme) => ({
    root: {
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
    },
    main: {
      marginTop: theme.spacing(8),
      marginBottom: theme.spacing(2),
    },
    footer: {
      padding: theme.spacing(3, 2),
      marginTop: 'auto',
      backgroundColor:
        theme.palette.type === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
    },
  }));

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container component="main" className={classes.main} maxWidth="sm">

      {data ? (
        <div>
          <img src={data.image.url} alt={data.image.revised_prompt} width={300} />
          <Typography variant="h3" component="h3" gutterBottom>
            {data.title}
          </Typography>
          <Typography variant="body1">{data.result.text}</Typography>
          <AudioPlayer data={data.result.signedUrl} audioSrc={data.result.signedUrl} />
        </div>
      ) : (
        <p>Loading...</p>
      )}

      {responseList && responseList[0] && responseList[0].message ? (
        <div className="responseList">
          <h3>Here are some suggestions for you:</h3>
          {responseList[0].message.map((item, index) => (
            <button key={index} onClick={() => handleSuggestedItemClick(item)}>
              {item.replace('-', '')}
            </button>
          ))}
        </div>
      ) : ( 
        <p>No messages found.</p>
      )}

      </Container>

      <footer className={classes.footer}>
        <Container maxWidth="sm">
          <Typography variant="body1">My sticky footer can be found here.</Typography>
        </Container>
      </footer>


    </div>
  );
};

export default Category;
