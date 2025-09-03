#!/usr/bin/env node

/**
 * Build script that integrates VanillaThreeDemo with the optimized build system
 */

const { execSync } = require('child_process')
const path = require('path')
const fs = require('fs')

console.log('🚀 Starting optimized build process...')

// Step 1: Create React production build
console.log('📦 Building React production bundle...')
try {
  execSync('npm run build', { stdio: 'inherit' })
  console.log('✅ React build completed')
} catch (error) {
  console.error('❌ React build failed:', error.message)
  process.exit(1)
}

// Step 2: Run semantic optimization
console.log('⚡ Running semantic optimization...')
try {
  const buildDir = path.join(__dirname, '..', 'build')
  const optimizerPath = path.join(__dirname, '..', 'new-optimized-build-system', 'scripts', 'universal-optimizer.js')
  
  if (!fs.existsSync(buildDir)) {
    console.error('❌ Build directory not found:', buildDir)
    process.exit(1)
  }
  
  if (!fs.existsSync(optimizerPath)) {
    console.error('❌ Optimizer not found:', optimizerPath)
    process.exit(1)
  }
  
  // Run with max-aggression strategy for maximum compression
  const optimizeCmd = `node "${optimizerPath}" --strategy max-aggression --build-dir "${buildDir}"`
  console.log('Running:', optimizeCmd)
  
  execSync(optimizeCmd, { stdio: 'inherit', cwd: path.join(__dirname, '..', 'new-optimized-build-system') })
  console.log('✅ Semantic optimization completed')
} catch (error) {
  console.error('❌ Semantic optimization failed:', error.message)
  process.exit(1)
}

// Step 3: Generate optimization report
console.log('📊 Generating optimization report...')
try {
  const buildDir = path.join(__dirname, '..', 'build')
  const reportPath = path.join(buildDir, 'optimization-report.json')
  
  if (fs.existsSync(reportPath)) {
    const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'))
    console.log('📈 Optimization Results:')
    console.log(`   Original Size: ${report.originalSize || 'Unknown'}`)
    console.log(`   Optimized Size: ${report.optimizedSize || 'Unknown'}`)
    console.log(`   Reduction: ${report.reduction || 'Unknown'}%`)
    console.log(`   Strategy: ${report.strategy || 'max-aggression'}`)
  }
} catch (error) {
  console.warn('⚠️  Could not generate report:', error.message)
}

console.log('🎉 Optimized build process completed!')
console.log('📁 Output directory: build/')
console.log('🚀 Ready for deployment!')
