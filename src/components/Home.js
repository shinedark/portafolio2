import * as THREE from 'three'
import React, { useState, useRef, useEffect,} from 'react'
import * as meshline from 'three.meshline'
import './Home.css'


const Home = () => {
  const mount = useRef(null)
  const [isAnimating, setAnimating] = useState(true)
  const controls = useRef(null)
  
  useEffect(() => {
    let width = mount.current.clientWidth
    let height = mount.current.clientHeight
    let frameId

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    const flakeCount = 9000
    const flakeGeometry = new THREE.BoxGeometry( 0.3, 0.3, 0.3 );
    const flakeMaterial =  new THREE.MeshBasicMaterial({ color: '#e4d661' })
    const cube = new THREE.Group();

    // const geometry = new THREE.BoxGeometry(1, 1, 1)
    // const material = new THREE.MeshBasicMaterial({ color: '#e4d661' })
    // const cube = new THREE.Mesh(geometry, material)
    for (let i = 0; i < flakeCount; i++) {
      var flakeMesh = new THREE.Mesh(flakeGeometry, flakeMaterial);
      flakeMesh.position.set(
        (Math.random() + 0.9) * 10,
        (Math.random() - 0.6) * 100,
        (Math.random() - 0.9) * 10
      );
      cube.add(flakeMesh);
    }

    const flakeArray = cube.children;

    camera.position.z = 3
    scene.add(cube)
    renderer.setClearColor('#000000')
    renderer.setSize(width, height)

    const renderScene = () => {
      renderer.render(scene, camera)
    }

    const handleResize = () => {
      width = mount.current.clientWidth
      height = mount.current.clientHeight
      renderer.setSize(width, height)
      camera.aspect = width / height
      camera.updateProjectionMatrix()
      renderScene()
    }
    
    const animate = () => {
      cube.rotation.x += 0.01
      cube.rotation.y += 0.01

      for (let i = flakeArray.length / 2; i < flakeArray.length; i++) {
        flakeArray[i].rotation.y -= 0.02;
        flakeArray[i].rotation.x -= 0.03;
        flakeArray[i].rotation.z -= 0.02;
        flakeArray[i].position.y -= 0.001;
        if (flakeArray[i].position.y < -6) {
          flakeArray[i].position.y += 0.35;
        }

        // cube.rotation.y -= 0.0000009;
      }

      renderScene()
      frameId = window.requestAnimationFrame(animate)
    }

    const start = () => {
      if (!frameId) {
        frameId = requestAnimationFrame(animate)
      }
    }

    const stop = () => {
      cancelAnimationFrame(frameId)
      frameId = null
    }

    mount.current.appendChild(renderer.domElement)
    window.addEventListener('resize', handleResize)
    start()

    controls.current = { start, stop }
    
    return () => {
      stop()
      window.removeEventListener('resize', handleResize)
      mount.current.removeChild(renderer.domElement)

      scene.remove(cube)
      flakeGeometry.dispose()
      flakeMaterial.dispose()
    }
  }, [])

  useEffect(() => {
    if (isAnimating) {
      controls.current.start()
    } else {
      controls.current.stop()
    }
  }, [isAnimating])
  
  return (
    <div style={{marginLeft: '5vw', marginRight: '5vw', height: '75vh'}} ref={mount} onClick={() => setAnimating(!isAnimating)}>
      <h1  className="header"> Shine Dark</h1>
    </div>
  )

}



export default Home;

