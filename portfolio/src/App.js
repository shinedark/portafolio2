import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import AsciiArtComponent from './AsciiArtComponent'
import ProjectCube from './ProjectCube'
import TechStack from './TechStack'
import Interest from './Interest'
import SmileyOverlay from './components/SmileyOverlay' // Import the new component
import planetariaRadioImage from './pictures/pr.png'
import sdm from './pictures/sdm.png'
import mmt from './pictures/mmt.png'
import repo from './pictures/repo.png'
import nms from './pictures/nms.png'
import vid from './pictures/vid.png'
import guide from './pictures/guide.png'
import PrototypeShowcase from './components/PrototypeShowcase'
import RouteContainer from './components/RouteContainer'
import SDProject from './components/routes/SDProject'
import BusinessPlan from './components/routes/BusinessPlan'
import Timeline from './components/routes/Timeline'
import Development from './components/routes/Development'
import Invest from './components/routes/Invest'
import './App.css'

// Sample project data
const projects = [
  {
    title: 'PLANETARIA RADIO',
    description:
      'Planetaria Radio is a unique platform that combines music streaming with blockchain technology. Users can stream music tracks, and if they have a specific polygon NFT in their wallet, they can upload tracks. Each track is stored as an encrypted file on IPFS, ensuring decentralized and secure storage. Track metadata and ownership are managed through smart contracts on Sepolia blockchain.',
    features: [
      'Create and upload music tracks with associated metadata.',
      'Play and stream music directly from the platform.',
      'Track play counts and engagement using blockchain technology.',
      'Decentralized file storage ensures longevity and resistance to censorship.',
      'NFT integration allows for unique ownership and potential monetization of tracks.',
    ],
    stack: [
      'React',
      'GraphQL & Apollo Client',
      'Polygon',
      'Styled Components',
      'Pinata & IPFS',
      'Remix',
      'Ethereum Sepolia',
      'Solidity',
      'Hardhat',
    ],
    link: 'https://planetaria-rdo.onrender.com/',
    image: planetariaRadioImage, // Use the imported image
  },
  {
    title: 'SHINE DARK MUSIC LABEL SITE',
    description: 'CSS AND DESIGN FUN',
    features: ['FUN FUN FUN'],
    stack: ['Next.js'],
    link: 'https://www.shinedarkmusic.com/',
    image: sdm,
  },
  {
    title: 'MY MED HISTORY ',
    description:
      "Creates history to be shared with new doctors or anyone who want's to comprehend more about my health treatment.",
    features: [
      'Log medications, supplements, history, informations, share with doctors or family, protected by blockchain technology.',
    ],
    stack: ['Reatc, Graphql, Web3, '],
    link: 'https://tribe-made-frontend.onrender.com/',
    image: mmt,
  },
  {
    title: 'REPO ANALYZER',
    description: `This project serves two main objectives:
Study Tool: A structured approach to analyze and understand code repositories
Analysis Framework: A tool for conducting systematic code repository reviews
`,
    features: [
      'Study Tool',
      'Analysis Framework, Gas Price per file calculator, Github Api',
    ],
    stack: ['React', 'Cursor', 'React Flow'],
    link: 'https://repo-analyzer.onrender.com/',
    image: repo,
  },
  {
    title: 'NOISE MACHINE SAMPLER',
    description: 'Toy Mobile App',
    features: [
      `Noise Machine Sampler There are 12 slots available to loaded. Each slot has 6 sounds to pick from.

To Load slots click on Search Samples then press each slot you want to load.
As you press each slot samples will play, if you like what you hear press Set samples.
Make Noise !!!`,
    ],
    stack: ['React Native, Expo'],
    link: 'https://github.com/shinedark/NoiseMachineSampler',
    image: nms,
  },
  {
    title: 'VID',
    description: 'Keyboard music sampler and css exercise',
    features: ['Animations and css'],
    stack: ['Html,Css, Js'],
    link: 'https://shinedark.github.io/vid/',
    image: vid,
  },
  {
    title: 'Guide',
    description: 'SHINE DARK mental health recovery guide',
    features: ['Media and creative'],
    stack: ['Html, Css, Js'],
    link: 'https://shinedark.github.io/guide/',
    image: guide,
  },
]

function App() {
  const headerRef = useRef(null)
  const [showOverlay, setShowOverlay] = useState(true)
  const [selectedTech, setSelectedTech] = useState(null)
  const [currentProjectIndex, setCurrentProjectIndex] = useState(0)
  const [isAnimating, setIsAnimating] = useState(false)
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768)
  const [activeRoute, setActiveRoute] = useState('projects')

  const handleProjectClick = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 2000)
  }

  const selectedProjects = projects // Display all projects without filtering

  const handleNextProject = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 2000)
    setCurrentProjectIndex(
      (prevIndex) => (prevIndex + 1) % selectedProjects.length,
    )
  }

  const handlePreviousProject = () => {
    setIsAnimating(true)
    setTimeout(() => setIsAnimating(false), 2000)
    setCurrentProjectIndex(
      (prevIndex) =>
        (prevIndex - 1 + selectedProjects.length) % selectedProjects.length,
    )
  }

  useEffect(() => {
    if (headerRef.current) {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        75,
        headerRef.current.clientWidth / headerRef.current.clientHeight,
        0.1,
        1000,
      )
      const renderer = new THREE.WebGLRenderer({ alpha: true })
      renderer.setSize(
        headerRef.current.clientWidth,
        headerRef.current.clientHeight,
      )
      headerRef.current.appendChild(renderer.domElement)

      const loader = new FontLoader()
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
          bevelSegments: 5,
        })
        textGeometry.center()
        const textMaterial = new THREE.MeshPhongMaterial({
          color: 0xffffff,
          specular: 0xffffff,
          shininess: 100,
        })
        const textMesh = new THREE.Mesh(textGeometry, textMaterial)
        scene.add(textMesh)

        // Add lights to the scene
        const pointLight = new THREE.PointLight(0xffffff, 1, 100)
        pointLight.position.set(0, 0, 10)
        scene.add(pointLight)

        const ambientLight = new THREE.AmbientLight(0x404040) // soft white light
        scene.add(ambientLight)

        camera.position.z = 2

        const animate = () => {
          requestAnimationFrame(animate)
          textMesh.rotation.y += 0.01
          renderer.render(scene, camera)
        }
        animate()
      })

      // Handle window resize
      const handleResize = () => {
        camera.aspect =
          headerRef.current.clientWidth / headerRef.current.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(
          headerRef.current.clientWidth,
          headerRef.current.clientHeight,
        )
      }
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        if (headerRef.current) {
          headerRef.current.removeChild(renderer.domElement)
        }
      }
    }
  }, [])

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="app">
      {showOverlay && <SmileyOverlay onClose={() => setShowOverlay(false)} />}

      <header ref={headerRef} className="header">
        <div className="ascii-container">
          <AsciiArtComponent />
        </div>
      </header>
      <main className="main">
        <PrototypeShowcase />
        <div className="content-wrapper">
          <RouteContainer
            activeRoute={activeRoute}
            onRouteChange={setActiveRoute}
          >
            {activeRoute === 'projects' && <SDProject />}
            {activeRoute === 'business-plan' && <BusinessPlan />}
            {activeRoute === 'timeline' && <Timeline />}
            {activeRoute === 'development' && <Development />}
            {activeRoute === 'invest' && <Invest />}
          </RouteContainer>
          <>
            <div className="header-container">
              {isMobile ? (
                <div className="mobile-projects">
                  {selectedProjects.map((project, index) => (
                    <div className="project-container" key={index}>
                      <ProjectCube
                        project={project}
                        onProjectClick={handleProjectClick}
                      />
                    </div>
                  ))}
                </div>
              ) : (
                <>
                  {selectedTech ? (
                    <div className="project-cube-wrapper">
                      <ProjectCube
                        project={selectedProjects[currentProjectIndex]}
                        onProjectClick={handleProjectClick}
                      />
                      <div className="navigation-buttons">
                        <button onClick={handlePreviousProject}>{`<`}</button>
                        <button onClick={handleNextProject}>{`>`}</button>
                      </div>
                    </div>
                  ) : (
                    <div className="projects-h1">
                      <h1>LegacyProjects</h1>
                    </div>
                  )}
                  <TechStack
                    isAnimating={isAnimating}
                    selectedTech={selectedTech}
                    onTechSelect={setSelectedTech}
                  />
                </>
              )}
            </div>
          </>
          {isMobile && activeRoute === 'projects' && (
            <TechStack
              isAnimating={isAnimating}
              selectedTech={selectedTech}
              onTechSelect={setSelectedTech}
            />
          )}
          <Interest />
        </div>
      </main>
      <footer className="footer">
        <p>© 2024 SHINE DARK. All rights reserved.</p>
        <p>
          <a
            href="https://x.com/ShineDarkmusic"
            target="_blank"
            rel="noopener noreferrer"
          >
            Contact us on X (Twitter)
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
