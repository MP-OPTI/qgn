// src/components/Footer.jsx
import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer>
      <nav className="footer-nav">
        <Link to="/register">Register</Link>
        <Link to="/login">Login</Link>
        <Link to="/blog">Blog</Link>
      </nav>
      <p>&copy; {new Date().getFullYear()} Morten Pradsgaard. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
