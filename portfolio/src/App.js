import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';
import AsciiArtComponent from './AsciiArtComponent';
import ProjectCube from './ProjectCube';
import TechStack from './TechStack';
import planetariaRadioImage from './pictures/pr.png'; 
import sdm from './pictures/sdm.png';
import './App.css';

// Sample project data
const projects = [
  {
    title: "PLANETARIA RADIO",
    description: "Planetaria Radio is a unique platform that combines music streaming with blockchain technology. Users can stream music tracks, and if they have a specific polygon NFT in their wallet, they can upload tracks. Each track is stored as an encrypted file on IPFS, ensuring decentralized and secure storage. Track metadata and ownership are managed through smart contracts on Sepolia blockchain.",
    features: [
      "Create and upload music tracks with associated metadata.",
      "Play and stream music directly from the platform.",
      "Track play counts and engagement using blockchain technology.",
      "Decentralized file storage ensures longevity and resistance to censorship.",
      "NFT integration allows for unique ownership and potential monetization of tracks."
    ],
    stack: [
      "React", "GraphQL & Apollo Client", "Polygon", "Styled Components", 
      "Pinata & IPFS", "Remix", "Ethereum Sepolia", "Solidity", "Hardhat"
    ],
    link: "https://planetaria-rdo.onrender.com/",
    image: planetariaRadioImage // Use the imported image
  },
  {
    title: "SHINE DARK MUSIC LABEL SITE",
    description: "CSS AND DESIGN FUN",
    features: [
      "FUN FUN FUN"
    ],
    stack: ["Next.js"],
    link: "https://www.shinedarkmusic.com/",
    image: sdm
  },
  // Add more projects as needed
];

function App() {
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, headerRef.current.clientWidth / headerRef.current.clientHeight, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });
      renderer.setSize(headerRef.current.clientWidth, headerRef.current.clientHeight);
      headerRef.current.appendChild(renderer.domElement);

      const loader = new FontLoader();
      loader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
        const textGeometry = new TextGeometry('SHINE DARK', {
          font: font,
          size: 0.5,
          height: 0.1,
          curveSegments: 12,
          bevelEnabled: true,
          bevelThickness: 0.03,
          bevelSize: 0.02,
          bevelOffset: 0,
          bevelSegments: 5
        });
        textGeometry.center();
        const textMaterial = new THREE.MeshPhongMaterial({ 
          color: 0xffffff,
          specular: 0xffffff,
          shininess: 100
        });
        const textMesh = new THREE.Mesh(textGeometry, textMaterial);
        scene.add(textMesh);

        // Add lights to the scene
        const pointLight = new THREE.PointLight(0xffffff, 1, 100);
        pointLight.position.set(0, 0, 10);
        scene.add(pointLight);

        const ambientLight = new THREE.AmbientLight(0x404040); // soft white light
        scene.add(ambientLight);

        camera.position.z = 2;

        const animate = () => {
          requestAnimationFrame(animate);
          textMesh.rotation.y += 0.01;
          renderer.render(scene, camera);
        };
        animate();
      });

      // Handle window resize
      const handleResize = () => {
        camera.aspect = headerRef.current.clientWidth / headerRef.current.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(headerRef.current.clientWidth, headerRef.current.clientHeight);
      };
      window.addEventListener('resize', handleResize);

      return () => {
        window.removeEventListener('resize', handleResize);
        headerRef.current.removeChild(renderer.domElement);
      };
    }
  }, []);

  return (
    <div className="app">
      <header ref={headerRef} className="header">
        <div className="ascii-container">
          <AsciiArtComponent />
        </div>
      </header>
      <main className="main">
        <h1>Portfolio</h1>
        <TechStack />
        <div className="projects-container">
          {projects.map((project, index) => (
            <ProjectCube key={index} project={project} />
          ))}
        </div>
      </main>
      <footer className="footer">
        <p>© 2024 SHINE DARK. All rights reserved.</p>
        <p>
          <a href="https://x.com/ShineDarkmusic" target="_blank" rel="noopener noreferrer">
            Contact us on X (Twitter)
          </a>
        </p>
      </footer>
    </div>
  );
}

export default App;