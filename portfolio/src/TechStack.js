import React, { useEffect, useState } from 'react';
import './TechStack.css';

const TechStack = () => {
  const technologies = ['JS', 'TS', 'GRAPHQL', 'SOLIDITY', 'NODE', 'MOBILE', 'WEB'];
  const [animatedTechs, setAnimatedTechs] = useState([]);

  useEffect(() => {
    const animationDelay = 200; // milliseconds between each word animation

    technologies.forEach((tech, index) => {
      setTimeout(() => {
        setAnimatedTechs(technologies.slice(0, index + 1));
      }, index * animationDelay);
    });
  }, []);

  return (
    <div className="tech-stack">
      {animatedTechs.map((tech, index) => (
        <span key={index} className="tech-item animate-bounce">{tech}</span>
      ))}
    </div>
  );
};

export default TechStack;