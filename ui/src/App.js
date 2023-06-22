import './App.css';
import { BrowserRouter as Router, Route, Routes, Outlet } from 'react-router-dom';
import Navigation from './components/navigation/navigation';
import Home from './components/home/home';
import Category from './components/category/category';

const App = () => {
  return (
    <div className="App">
      <header className="App-header">
        <Navigation />
      </header>
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/category/:id" element={<Outlet><Category /></Outlet>} />
        </Routes>
      </Router>
      <footer></footer>
    </div>
  );
};

export default App;
