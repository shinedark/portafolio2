import React, { useEffect, useRef, useState } from 'react';
import './ProjectCube.css';

const ProjectCube = ({ project }) => {
  const cubeRef = useRef(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const animationRef = useRef(null);
  const rotateYRef = useRef(0);

  useEffect(() => {
    const cube = cubeRef.current;

    const spin = () => {
      rotateYRef.current += 2;
      cube.style.transform = `rotateY(${rotateYRef.current}deg)`;
      animationRef.current = requestAnimationFrame(spin);
    };

    if (isSpinning) {
      spin();
    } else {
      cancelAnimationFrame(animationRef.current);
    }

    return () => {
      cancelAnimationFrame(animationRef.current);
    };
  }, [isSpinning]);

  const handleClick = () => {
    setIsSpinning(!isSpinning);
  };

  return (
    <div className="project-cube">
      <div className="scene">
        <div className="cube" ref={cubeRef} onClick={handleClick}>
          <div className="cube__face cube__face--front" style={{backgroundImage: `url(${project.image})`}}></div>
          <div className="cube__face cube__face--back" style={{backgroundImage: `url(${project.image})`}}></div>
          <div className="cube__face cube__face--right" style={{backgroundImage: `url(${project.image})`}}></div>
          <div className="cube__face cube__face--left" style={{backgroundImage: `url(${project.image})`}}></div>
          <div className="cube__face cube__face--top" style={{backgroundImage: `url(${project.image})`}}></div>
          <div className="cube__face cube__face--bottom" style={{backgroundImage: `url(${project.image})`}}></div>
        </div>
      </div>
      <div className="project-info">
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <h4>Key Features:</h4>
        <ul>
          {project.features.map((feature, index) => (
            <li key={index}>{feature}</li>
          ))}
        </ul>
        <h4>Tech Stack:</h4>
        <ul>
          {project.stack.map((tech, index) => (
            <li key={index}>{tech}</li>
          ))}
        </ul>
        <a href={project.link} target="_blank" rel="noopener noreferrer">View Project</a>
      </div>
    </div>
  );
};

export default ProjectCube;