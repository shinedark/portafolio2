import React, { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader'
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry'
import AsciiArtComponent from './components/random/AsciiArtComponent'
import ProjectCube from './components/random/ProjectCube'
import TechStack from './components/random/TechStack'
import Interest from './components/random/Interest'
import SmileyOverlay from './components/random/SmileyOverlay'
import PrototypeShowcase from './components/random/PrototypeShowcase'
import RouteContainer from './components/Navigation/RouteContainer'
import SDProject from './components/routes/SDProject'
import BusinessPlan from './components/routes/BusinessPlan'
import Timeline from './components/routes/Timeline'
import Development from './components/routes/Development'
import Invest from './components/routes/Invest'
import AdminRoute from './components/routes/AdminRoute'
import { AuthProvider, useAuth } from './components/auth/AuthContext'
import Subscribe from './components/common/Subscribe'
import planetariaRadioImage from './pictures/pr.png'
import sdm from './pictures/sdm.png'
import mmt from './pictures/mmt.png'
import repo from './pictures/repo.png'
import nms from './pictures/nms.png'
import vid from './pictures/vid.png'
import guide from './pictures/guide.png'
import './App.css'
import { BrowserRouter } from 'react-router-dom'

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
  // const { isAdmin } = useAuth()

  const handleProjectClick = () => {
    setIsAnimating(true)
    const timeoutId = window.setTimeout(() => setIsAnimating(false), 2000)
    return () => window.clearTimeout(timeoutId)
  }

  const selectedProjects = projects // Display all projects without filtering

  const handleNextProject = () => {
    setIsAnimating(true)
    const timeoutId = window.setTimeout(() => setIsAnimating(false), 2000)
    setCurrentProjectIndex(
      (prevIndex) => (prevIndex + 1) % selectedProjects.length,
    )
    return () => window.clearTimeout(timeoutId)
  }

  const handlePreviousProject = () => {
    setIsAnimating(true)
    const timeoutId = window.setTimeout(() => setIsAnimating(false), 2000)
    setCurrentProjectIndex(
      (prevIndex) =>
        (prevIndex - 1 + selectedProjects.length) % selectedProjects.length,
    )
    return () => window.clearTimeout(timeoutId)
  }

  useEffect(() => {
    const headerElement = headerRef.current
    if (headerElement) {
      const scene = new THREE.Scene()
      const camera = new THREE.PerspectiveCamera(
        75,
        headerElement.clientWidth / headerElement.clientHeight,
        0.1,
        1000,
      )
      const renderer = new THREE.WebGLRenderer({ alpha: true })
      renderer.setSize(headerElement.clientWidth, headerElement.clientHeight)
      headerElement.appendChild(renderer.domElement)

      const loader = new FontLoader()
      loader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
        const textGeometry = new TextGeometry('SHINE DARK', {
          font: font,
          size: 0.5,
          depth: 0.1,
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

        const pointLight = new THREE.PointLight(0xffffff, 1, 100)
        pointLight.position.set(0, 0, 10)
        scene.add(pointLight)

        const ambientLight = new THREE.AmbientLight(0x404040)
        scene.add(ambientLight)

        camera.position.z = 2

        let animationFrameId

        const animate = () => {
          animationFrameId = requestAnimationFrame(animate)
          textMesh.rotation.y += 0.01
          renderer.render(scene, camera)
        }
        animate()

        // Cleanup animation frame
        return () => {
          if (animationFrameId) {
            cancelAnimationFrame(animationFrameId)
          }
        }
      })

      const handleResize = () => {
        camera.aspect = headerElement.clientWidth / headerElement.clientHeight
        camera.updateProjectionMatrix()
        renderer.setSize(headerElement.clientWidth, headerElement.clientHeight)
      }
      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        if (headerElement) {
          headerElement.removeChild(renderer.domElement)
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
    <BrowserRouter>
      <AuthProvider>
        <div className="app">
          {showOverlay && (
            <SmileyOverlay onClose={() => setShowOverlay(false)} />
          )}

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
                {activeRoute === 'admin' && <AdminRoute />}
              </RouteContainer>
              <br />
              <Subscribe />
              <br />
              <Interest />
              <br />
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
                            <button
                              onClick={handlePreviousProject}
                            >{`<`}</button>
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
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
