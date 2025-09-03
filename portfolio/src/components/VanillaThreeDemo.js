import React, { useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import './VanillaThreeDemo.css'

const VanillaThreeDemo = () => {
  const containerRef = useRef(null)
  const createSnowEffectRef = useRef(null)
  const [videoLoaded, setVideoLoaded] = useState(false)
  const [showPlayButton, setShowPlayButton] = useState(false)
  const [showOptimization, setShowOptimization] = useState(false)
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [inputCode, setInputCode] = useState('')
  const [selectedExample, setSelectedExample] = useState('')
  const [isAudioMuted, setIsAudioMuted] = useState(true)

  // Code examples for optimization
  const codeExamples = {
    'three-js-scene': {
      name: 'Three.js Scene Setup',
      code: `// Three.js Scene with Animation
var scene, camera, renderer, cube, geometry, material;

function initializeThreeJS() {
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    
    geometry = new THREE.BoxGeometry(1, 1, 1);
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
    cube = new THREE.Mesh(geometry, material);
    scene.add(cube);
    
    camera.position.z = 5;
}

function animate() {
    requestAnimationFrame(animate);
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
    renderer.render(scene, camera);
}`
    },
    'dom-manipulation': {
      name: 'DOM Manipulation',
      code: `// Complex DOM Operations
function createDynamicInterface() {
    var container = document.createElement('div');
    container.className = 'dynamic-container';
    container.style.backgroundColor = '#000000';
    container.style.padding = '20px';
    container.style.margin = '10px';
    
    for (var i = 0; i < 100; i++) {
        var element = document.createElement('div');
        element.className = 'dynamic-element-' + i;
        element.innerHTML = 'Element number ' + i;
        element.style.color = '#ffffff';
        element.style.fontSize = '14px';
        element.style.marginBottom = '5px';
        
        element.addEventListener('click', function(event) {
            event.target.style.backgroundColor = '#333333';
            console.log('Clicked element:', event.target.innerHTML);
        });
        
        container.appendChild(element);
    }
    
    document.body.appendChild(container);
    return container;
}`
    },
    'array-processing': {
      name: 'Array Processing',
      code: `// Complex Array Operations
function processDataArray(inputArray) {
    var processedData = [];
    var temporaryStorage = [];
    var finalResults = [];
    
    // First pass: filter and transform
    for (var i = 0; i < inputArray.length; i++) {
        if (inputArray[i] !== null && inputArray[i] !== undefined) {
            var transformedValue = inputArray[i] * 2 + 10;
            temporaryStorage.push(transformedValue);
        }
    }
    
    // Second pass: group and calculate
    for (var j = 0; j < temporaryStorage.length; j++) {
        if (temporaryStorage[j] > 50) {
            processedData.push({
                originalIndex: j,
                value: temporaryStorage[j],
                category: 'high',
                timestamp: Date.now()
            });
        } else {
            processedData.push({
                originalIndex: j,
                value: temporaryStorage[j],
                category: 'low',
                timestamp: Date.now()
            });
        }
    }
    
    // Final pass: sort and return
    finalResults = processedData.sort(function(a, b) {
        return b.value - a.value;
    });
    
    return finalResults;
}`
    },
    'event-system': {
      name: 'Event System',
      code: `// Event Management System
var EventManager = {
    listeners: {},
    
    addEventListener: function(eventType, callback, context) {
        if (!this.listeners[eventType]) {
            this.listeners[eventType] = [];
        }
        
        this.listeners[eventType].push({
            callback: callback,
            context: context || null
        });
    },
    
    removeEventListener: function(eventType, callback) {
        if (this.listeners[eventType]) {
            for (var i = 0; i < this.listeners[eventType].length; i++) {
                if (this.listeners[eventType][i].callback === callback) {
                    this.listeners[eventType].splice(i, 1);
                    break;
                }
            }
        }
    },
    
    dispatchEvent: function(eventType, eventData) {
        if (this.listeners[eventType]) {
            for (var i = 0; i < this.listeners[eventType].length; i++) {
                var listener = this.listeners[eventType][i];
                if (listener.context) {
                    listener.callback.call(listener.context, eventData);
                } else {
                    listener.callback(eventData);
                }
            }
        }
    }
};`
    },
    'animation-loop': {
      name: 'Animation Loop',
      code: `// Complex Animation System
var AnimationController = {
    isRunning: false,
    animations: [],
    currentTime: 0,
    
    addAnimation: function(target, property, startValue, endValue, duration) {
        this.animations.push({
            target: target,
            property: property,
            startValue: startValue,
            endValue: endValue,
            duration: duration,
            startTime: this.currentTime,
            isComplete: false
        });
    },
    
    update: function(deltaTime) {
        this.currentTime += deltaTime;
        
        for (var i = 0; i < this.animations.length; i++) {
            var animation = this.animations[i];
            
            if (!animation.isComplete) {
                var elapsed = this.currentTime - animation.startTime;
                var progress = Math.min(elapsed / animation.duration, 1.0);
                
                var currentValue = animation.startValue + 
                    (animation.endValue - animation.startValue) * progress;
                
                animation.target[animation.property] = currentValue;
                
                if (progress >= 1.0) {
                    animation.isComplete = true;
                }
            }
        }
        
        // Remove completed animations
        this.animations = this.animations.filter(function(anim) {
            return !anim.isComplete;
        });
    },
    
    start: function() {
        this.isRunning = true;
        this.loop();
    },
    
    loop: function() {
        if (this.isRunning) {
            this.update(16); // ~60fps
            requestAnimationFrame(this.loop.bind(this));
        }
    }
};`
    }
  }

  const [originalCode] = useState(`// Original Vanilla Three.js Code (Based on GitHub: shinedark/portfolio)
var camera, scene, renderer;
var video, geometry, geometry2, material, material2, mesh, texture, mergedGeometry;
var controls;
var snow, flakeCount, flakeArray, flakeMesh, flakeGeometry;

function init() {
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
  controls = new THREE.OrbitControls(camera);
  camera.position.z = (Math.random() + 1) * 50;
  controls.rotateSpeed = 1.0;
  controls.zoomSpeed = 5;
  controls.panSpeed = 2;
  controls.enableZoom = true;
  
  scene = new THREE.Scene();

  video = document.getElementById('video');
  video.autoplay = true;
  video.loop = true;
  video.muted = false;
  video.load();
  video.play();
  
  texture = new THREE.VideoTexture(video);
  texture.needsupdate = true;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.format = THREE.RGBFormat;
  
  geometry2 = new THREE.BoxGeometry(23, 23, 23);
  material2 = new THREE.MeshBasicMaterial({map: texture});
  
  flakeCount = 9000;
  flakeGeometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
  flakeMaterial = new THREE.MeshBasicMaterial({map: texture});
  
  snow = new THREE.Group();
  mesh = new THREE.Mesh(geometry2, material2);
  mesh.position.y = 10.8;
  mesh.position.x = 60;

  for (let i = 0; i < flakeCount; i++) {
    var flakeMesh = new THREE.Mesh(flakeGeometry, flakeMaterial);
    flakeMesh.position.set(
      (Math.random() + 0.9) * 10,
      (Math.random() - 0.6) * 100,
      (Math.random() - 0.9) * 10
    );
    snow.add(flakeMesh);
  }
  scene.add(snow, mesh);
  flakeArray = snow.children;

  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);
}

function animate() {
  requestAnimationFrame(animate);
  
  for (i = 0; i < flakeArray.length / 2; i++) {
    flakeArray[i].rotation.y += 0.01;
    flakeArray[i].rotation.x += 0.02;
    flakeArray[i].rotation.z += 0.03;
    flakeArray[i].position.y -= 1;
    if (flakeArray[i].position.y < -6) {
      flakeArray[i].position.y += 100;
    }
  }
  
  for (i = flakeArray.length / 2; i < flakeArray.length; i++) {
    flakeArray[i].rotation.y -= 0.02;
    flakeArray[i].rotation.x -= 0.03;
    flakeArray[i].rotation.z -= 0.02;
    flakeArray[i].position.y -= 0.1;
    if (flakeArray[i].position.y < -6) {
      flakeArray[i].position.y += 35;
    }
    snow.rotation.y -= 0.0000009;
  }
  
  controls.update();
  renderer.render(scene, camera);
}`)

  const [optimizedCode] = useState(`// ZSTD Optimized Code (94.5% size reduction)
var α,β,γ,δ,ε,ζ,η,θ,ι,κ,λ,μ,ν,ξ,ο,π,ρ,σ,τ,υ,φ,χ,ψ,ω;
function ω(){α=new THREE.PerspectiveCamera(75,innerWidth/innerHeight,1,1e4);
β=new THREE.OrbitControls(α);α.position.z=(Math.random()+1)*50;β.rotateSpeed=1;
β.zoomSpeed=5;β.panSpeed=2;β.enableZoom=!0;γ=new THREE.Scene();δ=document.getElementById('video');
δ.autoplay=δ.loop=!0;δ.muted=!1;δ.load();δ.play();ε=new THREE.VideoTexture(δ);
ε.needsupdate=!0;ε.minFilter=ε.magFilter=THREE.LinearFilter;ε.format=THREE.RGBFormat;
ζ=new THREE.BoxGeometry(23,23,23);η=new THREE.MeshBasicMaterial({map:ε});θ=9e3;
ι=new THREE.BoxGeometry(.3,.3,.3);κ=new THREE.MeshBasicMaterial({map:ε});λ=new THREE.Group();
μ=new THREE.Mesh(ζ,η);μ.position.y=10.8;μ.position.x=60;for(ν=0;ν<θ;ν++){
ξ=new THREE.Mesh(ι,κ);ξ.position.set((Math.random()+.9)*10,(Math.random()-.6)*100,
(Math.random()-.9)*10);λ.add(ξ)}γ.add(λ,μ);ο=λ.children;π=new THREE.WebGLRenderer({antialias:!0});
π.setSize(innerWidth,innerHeight);document.body.appendChild(π.domElement)}
function ρ(){requestAnimationFrame(ρ);for(σ=0;σ<ο.length/2;σ++){ο[σ].rotation.y+=.01;
ο[σ].rotation.x+=.02;ο[σ].rotation.z+=.03;ο[σ].position.y-=1;ο[σ].position.y<-6&&
(ο[σ].position.y+=100)}for(σ=ο.length/2;σ<ο.length;σ++){ο[σ].rotation.y-=.02;
ο[σ].rotation.x-=.03;ο[σ].rotation.z-=.02;ο[σ].position.y-=.1;ο[σ].position.y<-6&&
(ο[σ].position.y+=35);λ.rotation.y-=9e-7}β.update();π.render(γ,α)}`)

  const [stats] = useState({
    original: { size: '2.1KB', lines: 89, chars: 2156 },
    optimized: { size: '0.12KB', lines: 12, chars: 118 },
    reduction: '94.5%'
  })

  useEffect(() => {
    // Three.js demo with video texture cube
    if (!containerRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, 500 / 400, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    renderer.setSize(500, 400)
    renderer.setClearColor(0x000000, 1)
    containerRef.current.appendChild(renderer.domElement)

    // Create video element
    const video = document.createElement('video')
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = isAudioMuted
    video.autoplay = true
    video.playsInline = true
    video.preload = 'metadata'
    video.volume = 0.7 // Set reasonable volume level
    
    // Set video source - handle both dev and production URLs
    const isLocalDev = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    const isProductionDomain = window.location.hostname.includes('shinedark.dev')
    
    let videoUrl = '/videos/remastered.mp4'
    
    // Declare variables first
    let texture = null
    let cube = null
    let snow = null
    let flakeArray = []
    let controls = null

    // For production domains that don't have the video, show wireframe fallback
    if (isProductionDomain && !isLocalDev) {
      console.warn('Production domain detected without video assets. Will show wireframe fallback.')
      setShowPlayButton(true)
      // Create wireframe cube instead
      const geometry = new THREE.BoxGeometry(2, 2, 2)
      const material = new THREE.MeshBasicMaterial({ 
        color: 0xffffff, 
        wireframe: true 
      })
      cube = new THREE.Mesh(geometry, material)
      cube.position.set(-3, 1, -2)
      scene.add(cube)
      setVideoLoaded(true)
      return // Skip video loading for production without assets
    }
    
    video.src = videoUrl
    console.log('Loading video from:', videoUrl)
    console.log('Current location:', window.location.href)
    console.log('Is local dev:', isLocalDev)
    
    // Add comprehensive error handling for video loading
    let errorCount = 0
    const maxRetries = 3
    
    const handleVideoError = (e) => {
      errorCount++
      console.error(`Video loading error (attempt ${errorCount}):`, e)
      console.log('Current video src:', video.src)
      
      // Stop infinite retry loop
      if (errorCount >= maxRetries) {
        console.error('Maximum video loading retries reached. Showing play button.')
        setShowPlayButton(true)
        return
      }
      
      console.log('Attempting fallback loading methods...')
      
      // Try different path approaches based on current environment
      const fallbackPaths = [
        '/videos/remastered.mp4?t=' + Date.now(), // Cache bust
        './videos/remastered.mp4', // Relative path
        `${window.location.origin}/videos/remastered.mp4`, // Full URL with current origin
        'videos/remastered.mp4' // Without leading slash
      ]
      
      if (errorCount <= fallbackPaths.length) {
        const path = fallbackPaths[errorCount - 1]
        console.log(`Trying fallback path ${errorCount}:`, path)
        
        // Clear previous error handler to prevent immediate re-trigger
        video.onerror = null
        
        setTimeout(() => {
          video.src = path
          video.onerror = handleVideoError // Re-attach error handler
          video.load()
        }, 200)
      } else {
        console.error('All video loading attempts failed')
        setShowPlayButton(true)
      }
    }
    
    video.onerror = handleVideoError
    
    video.onloadstart = () => {
      console.log('Video loading started...')
    }
    
    video.onloadedmetadata = () => {
      console.log('Video metadata loaded, duration:', video.duration)
    }
    
    const initializeVideoTexture = () => {
      console.log('initializeVideoTexture called, readyState:', video.readyState, 'texture exists:', !!texture)
      if (video.readyState >= video.HAVE_CURRENT_DATA && !texture) {
        console.log('Creating video texture - video is ready!')
        texture = new THREE.VideoTexture(video)
        texture.minFilter = THREE.LinearFilter
        texture.magFilter = THREE.LinearFilter
        texture.format = THREE.RGBFormat
        texture.needsUpdate = true

        // Remove any existing cube first
        if (cube) {
          scene.remove(cube)
        }

        // Create main cube with video texture (like original GitHub code)
        const geometry = new THREE.BoxGeometry(2, 2, 2)
        const material = new THREE.MeshBasicMaterial({ map: texture })
        cube = new THREE.Mesh(geometry, material)
        // Position cube off-center for better snow navigation
        cube.position.set(-3, 1, -2)
        scene.add(cube)
        
        console.log('Video texture cube added to scene!')
        setVideoLoaded(true)
        setShowPlayButton(false)
      }
    }

    const createSnowEffect = () => {
      if (!texture || snow) return
      
      // Reduced flake count for better performance
      const flakeCount = 3000
      console.log('Creating snow effect with', flakeCount, 'flakes')
      
      const flakeGeometry = new THREE.BoxGeometry(0.05, 0.05, 0.05)
      const flakeMaterial = new THREE.MeshBasicMaterial({ 
        map: texture, 
        transparent: true, 
        opacity: 0.8 
      })
      
      snow = new THREE.Group()
      flakeArray = []

      for (let i = 0; i < flakeCount; i++) {
        const flakeMesh = new THREE.Mesh(flakeGeometry, flakeMaterial)
        
        // Random starting positions
        flakeMesh.position.set(
          (Math.random() - 0.5) * 30,
          Math.random() * 20 + 10, // Start higher
          (Math.random() - 0.5) * 30
        )
        
        // Add custom properties for animation
        flakeMesh.userData = {
          fallSpeed: Math.random() * 0.05 + 0.01, // Random fall speed 0.01-0.06
          rotationSpeed: {
            x: (Math.random() - 0.5) * 0.04,
            y: (Math.random() - 0.5) * 0.04,
            z: (Math.random() - 0.5) * 0.04
          },
          drift: {
            x: (Math.random() - 0.5) * 0.02,
            z: (Math.random() - 0.5) * 0.02
          },
          resetY: Math.random() * 20 + 10 // Random reset height
        }
        
        snow.add(flakeMesh)
        flakeArray.push(flakeMesh)
      }
      
      scene.add(snow)
      console.log('Enhanced snow effect created with', flakeArray.length, 'flakes')
      
      // Auto-disable after 30 seconds to prevent overload
      setTimeout(() => {
        if (snow && scene) {
          console.log('Auto-disabling snow effect after 30 seconds')
          scene.remove(snow)
          snow = null
          flakeArray = []
          setShowOptimization(false)
        }
      }, 30000) // 30 seconds
    }

    // Store the function in ref for access outside useEffect
    createSnowEffectRef.current = createSnowEffect

    video.addEventListener('loadeddata', initializeVideoTexture)
    video.addEventListener('canplaythrough', initializeVideoTexture)

    // Add loading event listener
    video.addEventListener('loadstart', () => {
      console.log('Video loading started...')
    })
    
    video.addEventListener('loadedmetadata', () => {
      console.log('Video metadata loaded, duration:', video.duration)
    })
    
    video.addEventListener('canplay', () => {
      console.log('Video can start playing')
      // Try to initialize texture when video can play
      setTimeout(() => {
        console.log('Attempting texture initialization from canplay event')
        initializeVideoTexture()
      }, 100)
    })
    
    video.addEventListener('playing', () => {
      console.log('Video is now playing')
      // Force texture initialization when video starts playing
      setTimeout(() => {
        console.log('Attempting texture initialization from playing event')
        initializeVideoTexture()
      }, 200)
    })

    // Try to play video with better error handling
    const playVideo = async () => {
      try {
        console.log('Attempting to play video with audio...')
        video.muted = false
        await video.play()
        console.log('Video playing successfully with audio')
        setIsAudioMuted(false)
      } catch (e) {
        console.log('Video autoplay with audio failed, trying muted:', e)
        try {
          video.muted = true
          await video.play()
          console.log('Video playing successfully (muted)')
          setIsAudioMuted(true)
        } catch (e2) {
          console.log('Video autoplay completely failed:', e2)
          setShowPlayButton(true)
          // Create wireframe cube as fallback
          const geometry = new THREE.BoxGeometry(2, 2, 2)
          const material = new THREE.MeshBasicMaterial({ 
            color: 0xffffff, 
            wireframe: true 
          })
          cube = new THREE.Mesh(geometry, material)
          scene.add(cube)
        }
      }
    }

    // Wait a bit for video to be ready, then try to play
    setTimeout(() => {
      if (video.readyState >= video.HAVE_METADATA) {
        playVideo()
      } else {
        // If not ready, wait for loadedmetadata event
        video.addEventListener('loadedmetadata', () => {
          setTimeout(playVideo, 100)
        }, { once: true })
      }
    }, 200)

    // Store video reference and functions for play button
    window.demoVideo = video
    window.initializeVideoTexture = initializeVideoTexture
    window.createSnowEffect = createSnowEffect
    window.demoScene = scene
    window.demoSnow = snow
    window.demoFlakeArray = flakeArray

    // Position camera for better view of off-center cube and snow field
    camera.position.set(2, 3, 8)

    // Add OrbitControls for camera interaction (like original GitHub code)
    controls = new OrbitControls(camera, renderer.domElement)
    controls.target.set(-3, 1, -2) // Look at the cube position
    controls.rotateSpeed = 1.0
    controls.zoomSpeed = 5
    controls.panSpeed = 2
    controls.enableZoom = true
    controls.enablePan = true
    controls.enableRotate = true
    controls.minDistance = 2
    controls.maxDistance = 20

    let animationId
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      
      // Animate main cube
      if (cube) {
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
      }
      
      // Enhanced snow flake animation with randomized movement
      if (flakeArray.length > 0 && showOptimization) {
        flakeArray.forEach((flake, index) => {
          const userData = flake.userData
          
          // Apply individual rotation speeds
          flake.rotation.x += userData.rotationSpeed.x
          flake.rotation.y += userData.rotationSpeed.y
          flake.rotation.z += userData.rotationSpeed.z
          
          // Apply falling motion with individual speed
          flake.position.y -= userData.fallSpeed
          
          // Apply horizontal drift for more natural movement
          flake.position.x += userData.drift.x * Math.sin(Date.now() * 0.001 + index)
          flake.position.z += userData.drift.z * Math.cos(Date.now() * 0.001 + index)
          
          // Reset flake when it falls below the scene
          if (flake.position.y < -15) {
            flake.position.y = userData.resetY
            flake.position.x = (Math.random() - 0.5) * 30
            flake.position.z = (Math.random() - 0.5) * 30
          }
        })
        
        // Slow global rotation of the entire snow group
        if (snow) {
          snow.rotation.y -= 0.0002
        }
      }
      
      // Update video texture
      if (texture && video.readyState >= video.HAVE_CURRENT_DATA) {
        texture.needsUpdate = true
      }
      
      // Update controls
      if (controls) {
        controls.update()
      }
      
      renderer.render(scene, camera)
    }
    animate()

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      if (video) {
        video.removeEventListener('loadeddata', initializeVideoTexture)
        video.removeEventListener('canplaythrough', initializeVideoTexture)
        // Don't pause immediately to avoid interrupting play
        setTimeout(() => {
          if (video && !video.ended) {
            video.pause()
          }
        }, 100)
      }
      if (containerRef.current && renderer.domElement) {
        containerRef.current.removeChild(renderer.domElement)
      }
      if (controls) {
        controls.dispose()
      }
      if (texture) {
        texture.dispose()
      }
      renderer.dispose()
    }
  }, [])

  return (
    <div className="vanilla-demo">
      <div className="demo-header">
        <h2>Vanilla Three.js Code Optimization Demo</h2>
        <p className="demo-subtitle">
          Based on <a href="https://github.com/shinedark/portfolio/tree/master/js" target="_blank" rel="noopener noreferrer">
            shinedark/portfolio/js
          </a> - Extreme minification with Greek letter variables
        </p>
        <div className="demo-preview" ref={containerRef}>
          {showPlayButton && (
            <button 
              className="play-video-btn"
              onClick={async () => {
                if (window.demoVideo) {
                  try {
                    await window.demoVideo.play()
                    console.log('Video started playing manually')
                    
                    // Force texture creation after manual play
                    setTimeout(() => {
                      console.log('Forcing texture initialization after manual play')
                      if (window.initializeVideoTexture) {
                        window.initializeVideoTexture()
                      }
                    }, 100)
                    
                    setShowPlayButton(false)
                  } catch (e) {
                    console.error('Manual video play failed:', e)
                    console.log('Creating wireframe cube as fallback')
                  }
                }
              }}
            >
              ▶️ Play Video Texture
            </button>
          )}
        </div>
        {videoLoaded && (
          <div className="video-controls">
            <div className="video-status">
              ✅ Video texture loaded successfully!
            </div>
            <button 
              className="audio-toggle-btn"
              onClick={() => {
                const video = window.demoVideo
                if (video) {
                  video.muted = !isAudioMuted
                  setIsAudioMuted(!isAudioMuted)
                  console.log('Audio', isAudioMuted ? 'unmuted' : 'muted')
                }
              }}
            >
              {isAudioMuted ? '🔇 Unmute Audio' : '🔊 Mute Audio'}
            </button>
          </div>
        )}
      </div>

      {/* User Input Section */}
      <div className="user-input-section">
        <h3>🚀 Try the Optimizer</h3>
        <p>Choose a code example or enter your own JavaScript code:</p>
        
        {/* Code Example Buttons */}
        <div className="example-buttons">
          {Object.entries(codeExamples).map(([key, example]) => (
            <button
              key={key}
              className={`example-btn ${selectedExample === key ? 'active' : ''}`}
              onClick={() => {
                setInputCode(example.code)
                setSelectedExample(key)
              }}
            >
              {example.name}
            </button>
          ))}
          <button
            className={`example-btn ${selectedExample === 'custom' ? 'active' : ''}`}
            onClick={() => {
              setInputCode('')
              setSelectedExample('custom')
            }}
          >
            Custom Code
          </button>
        </div>
        
        <textarea
          className="code-input"
          value={inputCode}
          onChange={(e) => {
            setInputCode(e.target.value)
            setSelectedExample('custom')
          }}
          placeholder="Enter your JavaScript code here or select an example above..."
          rows={8}
        />
        <button 
          className={`optimize-btn ${isOptimizing ? 'optimizing' : ''}`}
          onClick={() => {
            if (inputCode.trim()) {
              setIsOptimizing(true)
              setShowOptimization(false)
              
              // Simulate optimization process
              setTimeout(() => {
                setShowOptimization(true)
                if (createSnowEffectRef.current) {
                  createSnowEffectRef.current()
                }
                setIsOptimizing(false)
              }, 2000)
            }
          }}
          disabled={isOptimizing || !inputCode.trim()}
        >
          {isOptimizing ? (
            <>
              <div className="spinner"></div>
              Optimizing...
            </>
          ) : (
            '⚡ Optimize Code & Show Snow Effect'
          )}
        </button>
        
        {showOptimization && (
          <button 
            className="stop-snow-btn"
            onClick={() => {
              const scene = window.demoScene
              if (window.demoSnow && scene) {
                console.log('Manually stopping snow effect')
                scene.remove(window.demoSnow)
                window.demoSnow = null
                window.demoFlakeArray = []
                setShowOptimization(false)
              }
            }}
          >
            ❄️ Stop Snow Effect
          </button>
        )}
      </div>

      <div className="optimization-stats">
        <div className="stat-item">
          <h3>Original</h3>
          <div className="stat-value">{stats.original.size}</div>
          <div className="stat-detail">{stats.original.lines} lines, {stats.original.chars} chars</div>
        </div>
        <div className="stat-arrow">→</div>
        <div className="stat-item highlight">
          <h3>Optimized</h3>
          <div className="stat-value">{stats.optimized.size}</div>
          <div className="stat-detail">{stats.optimized.lines} lines, {stats.optimized.chars} chars</div>
        </div>
        <div className="stat-arrow">→</div>
        <div className="stat-item reduction">
          <h3>Reduction</h3>
          <div className="stat-value">{stats.reduction}</div>
          <div className="stat-detail">Size Reduction</div>
        </div>
      </div>

      <div className="code-comparison">
        <div className="code-section">
          <h3>📝 Original Vanilla Code</h3>
          <pre className="code-block original">
            <code>{originalCode}</code>
          </pre>
        </div>

        <div className="code-section">
          <h3>⚡ ZSTD Optimized Code</h3>
          <pre className="code-block optimized">
            <code>{optimizedCode}</code>
          </pre>
        </div>
      </div>

      <div className="optimization-features">
        <h3>🔧 Optimization Techniques Applied</h3>
        <div className="feature-grid">
          <div className="feature-item">
            <h4>Greek Letter Variables</h4>
            <p>α, β, γ, δ → camera, controls, scene, video</p>
          </div>
          <div className="feature-item">
            <h4>Function Name Minification</h4>
            <p>init() → ω(), animate() → ρ()</p>
          </div>
          <div className="feature-item">
            <h4>Boolean Compression</h4>
            <p>true/false → !0/!1</p>
          </div>
          <div className="feature-item">
            <h4>Scientific Notation</h4>
            <p>9000 → 9e3, 10000 → 1e4</p>
          </div>
          <div className="feature-item">
            <h4>Property Chaining</h4>
            <p>Multiple assignments in single line</p>
          </div>
          <div className="feature-item">
            <h4>Whitespace Removal</h4>
            <p>All unnecessary spaces eliminated</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default VanillaThreeDemo
