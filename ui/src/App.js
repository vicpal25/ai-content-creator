import logo from './logo.svg';
import './App.css';
import './components/home/home';
import Home from './components/home/home';
import { BrowserRouter as Router, Route, Routes, Switch } from 'react-router-dom';
import Navigation from './components/navigation/navigation';
import { getTopLevelCategories } from './api';
import Category from './components/category/category';


function App() {

  return (
    <div className="App">
      <header className="App-header">
        <Navigation/>
      </header>
      <body>


        <div>
        <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/category/:id" element={<Category />}  />
      </Routes>
    </Router>
        </div>


      </body>
      <footer>

        {/* <ul>
          <li>Home</li>
          <li>About Us</li>
          <li>Contact</li>
          <li>Services</li>
          <li>FAQ</li>
          <li>Blog</li>
          <li>Terms of Service</li>
          <li>Privacy Policy</li>
          <li>Careers</li>
          <li>Support</li>
        </ul> */}




      </footer>




    </div>
  );
}

export default App;