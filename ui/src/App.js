import React from 'react';
import Home from './components/home/home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navigation from './components/navigation/navigation';
import Category from './components/category/category';
import Categories from './components/categories/categories';
import Chat from './components/chat/chat';

function App() {
  return (
    <Router>
      <div className="App">
        <header className="App-header">
          <Navigation />
        </header>
        <div>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/categories" element={<Categories />} />
            <Route path="/category/:id" element={<Category />} />
            <Route path="/chat" element={<Chat />} />
          </Routes>
        </div>
        <footer></footer>
      </div>
    </Router>
  );
}

export default App;
