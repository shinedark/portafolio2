import * as THREE from 'three'
import React, { useState, useRef, useEffect,} from 'react'
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
    const flakeCount2 = 3000
    const flakeCount3 = 6000
    const flakeGeometry = new THREE.TorusBufferGeometry( 0.010, 0.03, 0.016, 0.0100 );
    const flakeMaterial =  new THREE.MeshBasicMaterial({ color: '#ffffff' })
    const flakeGeometry2 = new THREE.BoxGeometry( 0.1, 0.1, 0.1 );
    const flakeMaterial2 =  new THREE.MeshBasicMaterial({ color: '#c2dff9' })
    const flakeGeometry3 = new THREE.TorusKnotBufferGeometry( 0.01, 0.03, 0.010, 0.016 );
    const flakeMaterial3 =  new THREE.MeshBasicMaterial({ color: '#fd5454' })
    const cube = new THREE.Group();
    const cube2 = new THREE.Group();
    const cube3 = new THREE.Group();

    for (let i = 0; i < flakeCount; i++) {
      var flakeMesh = new THREE.Mesh(flakeGeometry, flakeMaterial);
      flakeMesh.position.set(
        (Math.random() + 0.9) * 10,
        (Math.random() - 0.6) * 100,
        (Math.random() - 0.9) * 10
      );
      cube.add(flakeMesh);
    }

    for (let i = 0; i < flakeCount2; i++) {
      var flakeMesh2 = new THREE.Mesh(flakeGeometry2, flakeMaterial2);
      flakeMesh2.position.set(
        (Math.random() + 0.1) * 10,
        (Math.random() - 0.7) * 100,
        (Math.random() - 0.8) * 10
      );
      cube2.add(flakeMesh2);
    }

    for (let i = 0; i < flakeCount3; i++) {
      var flakeMesh3 = new THREE.Mesh(flakeGeometry3, flakeMaterial3);
      flakeMesh3.position.set(
        (Math.random() + 0.3) * 10,
        (Math.random() - 0.6) * 10,
        (Math.random() - 0.9) * 100
      );
      cube3.add(flakeMesh3);
    }

    const flakeArray = cube.children;
    const flakeArray2 = cube2.children;
    const flakeArray3 = cube3.children;

    camera.position.z = 3
    scene.add(cube, cube2, cube3)
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
      cube2.rotation.x += 0.001
      cube2.rotation.y += 0.01
      cube3.rotation.x += 0.001
      cube3.rotation.y += 0.001

      for (let i = flakeArray.length / 6; i < flakeArray2.length; i++) {
        flakeArray[i].rotation.y += 0.02;
        flakeArray[i].rotation.x -= 0.03;
        flakeArray[i].rotation.z -= 0.02;
        flakeArray[i].position.y -= 0.001;
        if (flakeArray3[i].position.y < 0.006) {
          flakeArray2[i].position.y += 0.003;
        }

        
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

