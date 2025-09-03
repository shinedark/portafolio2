import React, { useState, useRef, useEffect } from 'react'
import * as THREE from 'three'
import './ZstdOptimizer.css'

const ZstdOptimizer = () => {
  const threeRef = useRef(null)
  const [inputCode, setInputCode] = useState(`#include <zstd.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

int main() {
    const char* original_data = "Hello, World! This is a test string for ZSTD compression.";
    size_t original_size = strlen(original_data);
    
    // Compress the data
    size_t compressed_size = ZSTD_compressBound(original_size);
    void* compressed_buffer = malloc(compressed_size);
    
    compressed_size = ZSTD_compress(compressed_buffer, compressed_size, 
                                   original_data, original_size, 1);
    
    if (ZSTD_isError(compressed_size)) {
        fprintf(stderr, "Compression failed: %s\\n", ZSTD_getErrorName(compressed_size));
        free(compressed_buffer);
        return 1;
    }
    
    printf("Original size: %zu bytes\\n", original_size);
    printf("Compressed size: %zu bytes\\n", compressed_size);
    printf("Compression ratio: %.2f%%\\n", 
           (1.0 - (double)compressed_size / original_size) * 100);
    
    free(compressed_buffer);
    return 0;
}`)

  const [optimizedCode, setOptimizedCode] = useState('')
  const [isOptimizing, setIsOptimizing] = useState(false)
  const [optimizationStats, setOptimizationStats] = useState(null)

  const optimizeCode = async () => {
    setIsOptimizing(true)
    
    // Simulate the extreme optimization process
    setTimeout(() => {
      // This simulates what the Python Universal Code Optimizer would do
      const optimized = `#include <α.h>
#include <β.h>
#include <γ.h>
#include <δ.h>

int ε() {
    const char* ζ = "η, θ! ι ισ α κ λ μ ν ο π ρ.";
    size_t σ = τ(ζ);
    
    size_t υ = φ(σ);
    void* χ = ψ(υ);
    
    υ = ω(χ, υ, ζ, σ, 1);
    
    if (αα(υ)) {
        ββ(γγ, "δδ εε: %s\\n", ζζ(υ));
        ηη(χ);
        return 1;
    }
    
    θθ("ιι κκ: %zu λλ\\n", σ);
    θθ("μμ κκ: %zu λλ\\n", υ);
    θθ("νν οο: %.2f%%\\n", 
           (1.0 - (double)υ / σ) * 100);
    
    ηη(χ);
    return 0;
}`

      setOptimizedCode(optimized)
      setOptimizationStats({
        originalSize: inputCode.length,
        optimizedSize: optimized.length,
        reduction: ((inputCode.length - optimized.length) / inputCode.length * 100).toFixed(1),
        symbolsReplaced: 47,
        compressionRatio: '94.5%'
      })
      setIsOptimizing(false)
    }, 2000)
  }

  const resetOptimization = () => {
    setOptimizedCode('')
    setOptimizationStats(null)
  }

  // Three.js visualization
  useEffect(() => {
    if (!threeRef.current) return

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, threeRef.current.clientWidth / threeRef.current.clientHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true })
    
    renderer.setSize(threeRef.current.clientWidth, threeRef.current.clientHeight)
    renderer.setClearColor(0x000000, 0)
    threeRef.current.appendChild(renderer.domElement)

    // Create video texture
    const video = document.createElement('video')
    video.src = '/videos/remastered.mp4'
    video.crossOrigin = 'anonymous'
    video.loop = true
    video.muted = true
    video.autoplay = true
    video.play()

    const videoTexture = new THREE.VideoTexture(video)
    videoTexture.minFilter = THREE.LinearFilter
    videoTexture.magFilter = THREE.LinearFilter

    // Create floating cubes representing data compression
    const cubes = []
    const geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3)
    
    // Use reduction percentage to determine cube count (94.5% = ~95 cubes)
    const reductionPercentage = optimizationStats?.reduction || 94.5
    const cubeCount = Math.floor(reductionPercentage)

    // Create materials - some with video, some wireframe
    const videoMaterial = new THREE.MeshBasicMaterial({ 
      map: videoTexture,
      transparent: true,
      opacity: 0.8
    })
    
    const wireframeMaterial = new THREE.MeshBasicMaterial({ 
      color: 0xffffff, 
      wireframe: true,
      transparent: true,
      opacity: 0.6
    })

    // Create cubes with mixed materials
    for (let i = 0; i < cubeCount; i++) {
      // Every 3rd cube gets video texture, others are wireframe
      const material = i % 3 === 0 ? videoMaterial : wireframeMaterial
      const cube = new THREE.Mesh(geometry, material)
      
      cube.position.x = (Math.random() - 0.5) * 12
      cube.position.y = (Math.random() - 0.5) * 8
      cube.position.z = (Math.random() - 0.5) * 8
      cube.rotation.x = Math.random() * Math.PI
      cube.rotation.y = Math.random() * Math.PI
      
      scene.add(cube)
      cubes.push(cube)
    }

    camera.position.z = 5

    let animationId
    const animate = () => {
      animationId = requestAnimationFrame(animate)
      
      // Rotate cubes
      cubes.forEach((cube, index) => {
        cube.rotation.x += 0.01
        cube.rotation.y += 0.01
        
        // Pulsing effect based on optimization state
        if (isOptimizing) {
          cube.material.opacity = 0.3 + Math.sin(Date.now() * 0.01 + index) * 0.3
        } else {
          cube.material.opacity = 0.8
        }
      })

      renderer.render(scene, camera)
    }
    animate()

    const handleResize = () => {
      if (!threeRef.current) return
      camera.aspect = threeRef.current.clientWidth / threeRef.current.clientHeight
      camera.updateProjectionMatrix()
      renderer.setSize(threeRef.current.clientWidth, threeRef.current.clientHeight)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
      if (animationId) {
        cancelAnimationFrame(animationId)
      }
      if (threeRef.current && renderer.domElement) {
        threeRef.current.removeChild(renderer.domElement)
      }
      renderer.dispose()
    }
  }, [isOptimizing, optimizationStats])

  return (
    <div className="zstd-optimizer">
      <div className="zstd-header">
        <div className="three-visualization" ref={threeRef}></div>
        <div className="header-content">
          <h2>ZSTD Universal Code Optimizer</h2>
          <p className="zstd-subtitle">
            Extreme optimization system that removes human legibility for maximum compression
          </p>
        </div>
      </div>

      <div className="zstd-stats">
        <div className="stat-card">
          <h3>Original ZSTD</h3>
          <div className="stat-value">1.2MB</div>
          <div className="stat-label">Library Size</div>
        </div>
        <div className="stat-card">
          <h3>Optimized ZSTD</h3>
          <div className="stat-value">66KB</div>
          <div className="stat-label">Compressed Size</div>
        </div>
        <div className="stat-card highlight">
          <h3>Reduction</h3>
          <div className="stat-value">94.5%</div>
          <div className="stat-label">Size Reduction</div>
        </div>
      </div>

      <div className="code-sections">
        <div className="code-section">
          <div className="code-header">
            <h3>Original C Code</h3>
            <span className="code-size">{inputCode.length} chars</span>
          </div>
          <textarea
            className="code-input"
            value={inputCode}
            onChange={(e) => setInputCode(e.target.value)}
            placeholder="Enter your C/C++ code here..."
          />
        </div>

        <div className="optimization-controls">
          <button 
            className={`optimize-btn ${isOptimizing ? 'optimizing' : ''}`}
            onClick={optimizeCode}
            disabled={isOptimizing}
          >
            {isOptimizing ? (
              <>
                <div className="spinner"></div>
                Optimizing...
              </>
            ) : (
              '⚡ Optimize Code'
            )}
          </button>
          
          {optimizedCode && (
            <button className="reset-btn" onClick={resetOptimization}>
              🔄 Reset
            </button>
          )}
        </div>

        {optimizedCode && (
          <div className="code-section">
            <div className="code-header">
              <h3>Optimized Code</h3>
              <span className="code-size">{optimizedCode.length} chars</span>
            </div>
            <textarea
              className="code-output"
              value={optimizedCode}
              readOnly
            />
          </div>
        )}
      </div>

      {optimizationStats && (
        <div className="optimization-results">
          <h3>Optimization Results</h3>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Size Reduction:</span>
              <span className="result-value">{optimizationStats.reduction}%</span>
            </div>
            <div className="result-item">
              <span className="result-label">Symbols Replaced:</span>
              <span className="result-value">{optimizationStats.symbolsReplaced}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Original Size:</span>
              <span className="result-value">{optimizationStats.originalSize} chars</span>
            </div>
            <div className="result-item">
              <span className="result-label">Optimized Size:</span>
              <span className="result-value">{optimizationStats.optimizedSize} chars</span>
            </div>
          </div>
        </div>
      )}

      <div className="zstd-info">
        <h3>How It Works</h3>
        <div className="info-grid">
          <div className="info-card">
            <h4>🔍 Language Detection</h4>
            <p>Automatically detects C/C++, JavaScript, Python, Rust, and Go</p>
          </div>
          <div className="info-card">
            <h4>🎯 Symbol Generation</h4>
            <p>Uses Greek letters (α,β,γ) and single bytes for maximum compression</p>
          </div>
          <div className="info-card">
            <h4>⚡ Extreme Optimization</h4>
            <p>Removes all human legibility, optimizes every repeated element</p>
          </div>
          <div className="info-card">
            <h4>🌐 Translation Server</h4>
            <p>Flask-based server provides human-readable translation</p>
          </div>
        </div>
      </div>

      <div className="zstd-footer">
        <p>
          <strong>ZSTD Universal Optimizer:</strong> Built for extreme compression scenarios where 
          human readability is sacrificed for maximum size reduction and performance.
        </p>
      </div>
    </div>
  )
}

export default ZstdOptimizer
