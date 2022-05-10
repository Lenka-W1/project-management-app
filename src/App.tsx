import React from 'react';
import './App.css';
import AppRoutes from './pages/AppRoutes';
import TempHeader from './components/Header/TempHeader';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div>
      <TempHeader />
      <AppRoutes />
      <Footer />
    </div>
  );
}

export default App;
