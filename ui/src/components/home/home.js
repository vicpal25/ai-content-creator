import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import Button from '@mui/material/Button';
import HomeNav from '../../components/homeNav/homeNav';

const Home = () => {
  return (
    <div className="home">
    <HomeNav />
    <style jsx>{`
          .home {
            border: 1px solid #eaeaea;
            padding: 15px;
            text-align: center;
          }
      `}
      </style>
    </div>
  );
};


export default Home;
