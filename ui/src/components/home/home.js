import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { getTopLevelCategories } from '../../api/index.js';
import { Button } from '@mui/material';
import { AppBar, Tab, Tabs } from '@mui/material';

// import axios from 'axios';
// export async function getTopLevelCategories() {
//     const response = await axios.get(`${BASE_URL}/shows/25`);
//     return [response.data];
//   }

const Home = () => {
   const [categories, setCategories] = useState(null);
 
   useEffect(() => {
     const fetchCategories = async () => {
       const data = await getTopLevelCategories();
       console.log(data);
       setCategories(data);
     };
 
     fetchCategories();
   }, []);
 
   return (
     <div class="home">
       {categories ? (
         // Render your categories here. This is just an example,
         // you will need to adjust this to match the shape of your data
         categories.map((category) => (

          <AppBar position="static">

          <Tabs>
            <Tab label={category.title} 
        to={`/category/${category.id}`}
                    component={Link} />
          </Tabs>
        </AppBar>

         ))
       ) : (
         'Loading categories...'
       )}
     </div>
   );
 };
 
Home.propTypes = {};
Home.defaultProps = {};

export default Home;