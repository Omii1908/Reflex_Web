
import React from 'react';

const CarLogo = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-brand-danger" viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.21.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.5 16c-.83 0-1.5-.67-1.5-1.5S5.67 13 6.5 13s1.5.67 1.5 1.5S7.33 16 6.5 16zm11 0c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5zM5 11l1.5-4.5h11L19 11H5z"/>
  </svg>
);

const Header: React.FC = () => {
  return (
    <header className="bg-brand-secondary/50 backdrop-blur-sm p-4 sticky top-0 z-50 border-b border-gray-700">
      <div className="container mx-auto flex items-center">
        <CarLogo />
        <h1 className="text-2xl font-bold ml-3 tracking-wider font-orbitron">
          <span className="text-white">REFLEX</span>
          <span className="text-brand-danger">.</span>
        </h1>
        <p className="ml-auto text-sm text-gray-400 hidden md:block">AI Accident Detection System</p>
      </div>
    </header>
  );
};

export default Header;
