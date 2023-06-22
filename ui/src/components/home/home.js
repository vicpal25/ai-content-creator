import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getTopLevelCategories } from '../../api/index.js';
import { Button } from '@mui/material';

const Home = () => {
  const [categories, setCategories] = useState(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  useEffect(() => {
    console.log('useEffect');
    if (!dataLoaded) {
      const fetchCategories = async () => {
        const data = await getTopLevelCategories();
        setCategories(data);
        setDataLoaded(true);
      };

      fetchCategories();
    }
  }, []); // Empty dependency array to run effect only once on component mount

  const handleCategoryClick = (event) => {
    event.stopPropagation();
    // Additional logic or handling for category click if needed
  };

  return (
    <div className="home">
      {categories ? (
        <div>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="category-link"
              onClick={handleCategoryClick}
            >
              <h1>{category.title}</h1>
            </Link>
          ))}
        </div>
      ) : (
        'Loading categories...'
      )}
    </div>
  );
};

Home.propTypes = {};
Home.defaultProps = {};

export default Home;
