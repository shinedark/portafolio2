import React, { useEffect, useRef } from 'react';
import './ProjectCube.css';

const ProjectCube = ({ project }) => {
  const cubeRef = useRef(null);

  useEffect(() => {
    const cube = cubeRef.current;
    let mouseX = 0;
    let mouseY = 0;
    let isRotating = false;
    let rotateX = 0;
    let rotateY = 0;

    const handleMouseDown = (e) => {
      isRotating = true;
      mouseX = e.clientX;
      mouseY = e.clientY;
    };

    const handleMouseUp = () => {
      isRotating = false;
    };

    const handleMouseMove = (e) => {
      if (!isRotating) return;
      const deltaX = e.clientX - mouseX;
      const deltaY = e.clientY - mouseY;
      mouseX = e.clientX;
      mouseY = e.clientY;
      rotateY += deltaX * 0.5;
      rotateX -= deltaY * 0.5;
      cube.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    cube.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);
    document.addEventListener('mousemove', handleMouseMove);

    return () => {
      cube.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
      document.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="project-cube">
      <div className="scene">
        <div className="cube" ref={cubeRef}>
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