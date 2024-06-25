// src/components/Hero.jsx
import React from 'react';

const Hero = ({ title, subtitle }) => (
  <div className="hero">
    <h1>{title}</h1>
    <h2>{subtitle}</h2>
  </div>
);

export default Hero;