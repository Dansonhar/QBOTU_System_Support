import React from 'react';
import { Routes, Route } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Home from './pages/Home';
import Modules from './pages/Modules';
import Contact from './pages/Contact';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="modules" element={<Modules />} />
        <Route path="contact" element={<Contact />} />
        {/* Placeholder routes for now */}
        <Route path="category/:categoryId" element={<div className="container" style={{ padding: '48px' }}>Category Page (Coming Soon)</div>} />
        <Route path="article/:articleId" element={<div className="container" style={{ padding: '48px' }}>Article Page (Coming Soon)</div>} />
        <Route path="module/:moduleId" element={<div className="container" style={{ padding: '48px' }}>Module Page (Coming Soon)</div>} />
      </Route>
    </Routes>
  );
}

export default App;
