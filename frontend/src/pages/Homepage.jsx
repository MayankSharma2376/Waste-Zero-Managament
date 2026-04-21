import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Stats from '../components/Stats';
import Services from '../components/Services';
import Mission from '../components/Mission';
import Pickup from '../components/Pickup';
import Footer from '../components/Footer';

const HomePage = () => {
  const { isDarkMode } = useTheme();
  
  return (
    <div className={`homepage min-h-screen transition-colors duration-500 ${
      isDarkMode ? 'bg-gray-950' : 'bg-white'
    }`}>
      <Header />
      <Hero />
      <Stats />
      <Services />
      <Mission />
      <Pickup />
      <Footer />
    </div>
  );
};

export default HomePage;