import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Contact from './pages/Contact';
import Category from './pages/Category';
import Article from './pages/Article';
import Modules from './pages/Modules';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="contact" element={<Contact />} />
        <Route path="modules" element={<Modules />} />
        <Route path="category/:categoryId" element={<Category />} />
        <Route path="article/:articleId" element={<Article />} />
      </Route>
    </Routes>
  );
}

export default App;
