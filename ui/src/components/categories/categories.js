import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getTopLevelCategories } from '../../api/index.js';
import Button from '@mui/material/Button';

const Categories = () => {
  const [categories, setCategories] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      const data = await getTopLevelCategories();
      setCategories(data);
    };

    fetchCategories();
  }, []);

  return (
    <div className="home">

      {categories ? (
        <div>
          {categories.map((category) => (
            <Button
              key={category.id}
              component={Link}
              to={`/category/${category.id}`}
              variant="contained"
              color="primary"
              sx={{ m: 2 }}
            >
              {category.title}
            </Button>
          ))}
        </div>
      ) : (
        'Loading categories...'
      )}
    </div>
  );
};

Categories.propTypes = {};
Categories.defaultProps = {};

export default Categories;
