import React from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css';
import Navbar from './components/layout/Navbar';
import HomePage from './pages/HomePage';
import FeedbackPage from './pages/FeedbackPage';
import SuccessPage from './pages/SuccessPage';

const App = () => (
  <Router>
    <Navbar />
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/feedback" element={<FeedbackPage />} />
      <Route path="/success" element={<SuccessPage />} />
    </Routes>
  </Router>
);

export default App;
