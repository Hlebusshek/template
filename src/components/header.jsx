import React from 'react';
import '../styles/header.css';

const Header = () => {
  return (
    <header className="site-header">
      <a href="#" className="logo">last.fm</a>
      <nav className="main-nav">
        <a href="#">Home</a>
        <a href="#">Live</a>
        <a href="#">Music</a>
        <a href="#">Charts</a>
        <a href="#">Events</a>
        <a href="#">Features</a>
        <form className="search-form" action="/search">
          <div className="search-container">
            <input type="text" placeholder="Search..." name="q" />
          </div>
        </form>
      </nav>
    </header>
  );
};

export default Header;