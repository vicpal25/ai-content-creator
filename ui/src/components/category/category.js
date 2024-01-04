import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getEpisode } from '../../api/index.js';
import AudioPlayer from '../shared/audioPlayer/audioPlayer'; // Adjust this import path

const Category = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
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

  return (
    <div>
      {data ? (
        <div>
          <img src={data.image} alt="Cover" />
          <h3>{data.title}</h3>
          <p>{data.result.text}</p>
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
    </div>
  );
};

export default Category;
