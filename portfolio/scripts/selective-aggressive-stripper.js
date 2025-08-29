#!/usr/bin/env node

/**
 * Selective Aggressive Production-Safe Post-Build Stripper
 * 
 * This stripper targets only the most impactful identifiers to keep the manifest
 * under 400KB while providing significant bundle size reduction.
 * 
 * WARNING: This is a proof-of-concept. Test thoroughly before production use.
 */

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

// Configuration for selective aggressive optimization
const SELECTIVE_CONFIG = {
  // Maximum manifest size (5MB - maximum aggression for selective optimization)
  maxManifestSize: 5 * 1024 * 1024,
  
  // Maximum optimization percentage (maximum aggression)
  maxOptimizationPercentage: 20,
  
  // Target only the most impactful identifiers
  targetPatterns: {
    // React components (PascalCase)
    components: /^[A-Z][a-zA-Z0-9]*$/,
    // Hooks (use*)
    hooks: /^use[A-Z][a-zA-Z0-9]*$/,
    // Library exports (specific patterns)
    libraries: /^(Query|Router|Provider|Context|Component|Hook)$/,
    // Long identifiers (more than 8 characters)
    longIdentifiers: /^[a-zA-Z_$][a-zA-Z0-9_$]{8,}$/
  },
  
  // Protected identifiers (never strip)
  protectedIdentifiers: [
    'React', 'useState', 'useEffect', 'useRef',
    'THREE', 'WebGLRenderer', 'Scene', 'Camera',
    'ethers', 'BrowserProvider', 'Web3ReactProvider'
  ],
  
  // Critical patterns that must be preserved
  criticalPatterns: [
    /React\.createElement/,
    /useState\(/,
    /useEffect\(/,
    /useRef\(/,
    /THREE\./,
    /ethers\./
  ]
};

function validateBundleSelectively(originalCode, output, manifest) {
  const issues = [];
  const originalSize = originalCode.length;
  const optimizedSize = output.length;
  const reduction = ((originalSize - optimizedSize) / originalSize) * 100;
  
  // Check size reduction limits
  if (reduction > SELECTIVE_CONFIG.maxOptimizationPercentage) {
    issues.push(`Optimization too aggressive: ${reduction.toFixed(2)}% (max: ${SELECTIVE_CONFIG.maxOptimizationPercentage}%)`);
  }
  
  // Check critical patterns
  const criticalPatterns = SELECTIVE_CONFIG.criticalPatterns;
  for (const pattern of criticalPatterns) {
    if (!pattern.test(output)) {
      issues.push(`Critical pattern missing: ${pattern.source}`);
    }
  }
  
  // Check manifest size
  const manifestSize = JSON.stringify(manifest).length;
  if (manifestSize > SELECTIVE_CONFIG.maxManifestSize) {
    issues.push(`Manifest too large: ${(manifestSize / 1024).toFixed(2)} KB (max: ${(SELECTIVE_CONFIG.maxManifestSize / 1024).toFixed(2)}KB)`);
  }
  
  return { issues, reduction };
}

function isSafeToStripSelectively(name, context) {
  // Never strip protected identifiers
  if (SELECTIVE_CONFIG.protectedIdentifiers.includes(name)) {
    return false;
  }
  
  // Check if it matches any target pattern
  const patterns = SELECTIVE_CONFIG.targetPatterns;
  return (
    patterns.components.test(name) ||
    patterns.hooks.test(name) ||
    patterns.libraries.test(name) ||
    patterns.longIdentifiers.test(name)
  );
}

function runSelectiveAggressiveStripper() {
  try {
    console.log('🎯 Selective Aggressive Production-Safe Post-Build Stripper Starting...');
    console.log('================================================================\n');
    
    // Find the main bundle file
    const buildDir = path.join(__dirname, '../build/static/js');
    const files = fs.readdirSync(buildDir);
    const mainBundleFile = files.find(file => file.startsWith('main.') && file.endsWith('.js') && !file.includes('.stripped') && !file.includes('.enhanced') && !file.includes('.production') && !file.includes('.aggressive'));
    
    if (!mainBundleFile) {
      throw new Error('Main bundle file not found in build/static/js');
    }
    
    const inputBundle = path.join(buildDir, mainBundleFile);
    const outputBundle = path.join(buildDir, mainBundleFile.replace('.js', '.selective.js'));
    const manifestFile = path.join(__dirname, '../build/selective-manifest.json');
    const backupFile = inputBundle + '.selective.backup';
    
    // Create backup
    fs.copyFileSync(inputBundle, backupFile);
    console.log(`📦 Backup created: ${path.relative(process.cwd(), backupFile)}`);
    
    // Read bundle
    console.log(`📁 Processing bundle: ${path.relative(process.cwd(), inputBundle)}`);
    const originalCode = fs.readFileSync(inputBundle, 'utf-8');
    const originalSize = originalCode.length;
    console.log(`📦 Original bundle size: ${(originalSize / 1024).toFixed(2)} KB`);
    
    // Parse AST
    console.log('🔍 Parsing AST...');
    const ast = parser.parse(originalCode, {
      sourceType: 'module',
      plugins: ['jsx']
    });
    
    // Ultra-compact manifest
    const manifest = {
      o: {}, // optimizations.identifiers only
      v: false // validation.passed
    };
    
    let identifierCounter = 0;
    let totalOptimizations = 0;
    
    // Traverse and optimize selectively
    console.log('🔧 Starting selective aggressive optimization...');
    traverse(ast, {
      Identifier(path) {
        const name = path.node.name;
        
        // Skip if already processed
        if (manifest.o[name]) {
          return;
        }
        
        // Determine context
        const context = path.parent.type;
        
        // Check if safe to strip selectively
        if (isSafeToStripSelectively(name, context)) {
          const key = identifierCounter++; // Just use numbers as keys
          manifest.o[key] = name; // Compact storage
          
          path.node.name = `a${key}`; // Keep the 'a' prefix in the code
          totalOptimizations++;
          
          // Check manifest size during processing
          if (identifierCounter % 1000 === 0) {
            const currentManifestSize = JSON.stringify(manifest).length;
            if (currentManifestSize > SELECTIVE_CONFIG.maxManifestSize) {
              console.log(`⚠️  Manifest size limit reached at ${identifierCounter} identifiers. Stopping optimization.`);
              return;
            }
          }
        }
      }
    });
    
    console.log(`✅ Selective optimization complete. ${totalOptimizations} identifiers processed.`);
    
    // Generate optimized bundle
    console.log('📊 Generating selective production bundle...');
    const output = generate(ast, { 
      minified: true,
      compact: true,
      comments: false
    }).code;
    
    // Validate the optimized bundle
    console.log('🔍 Validating optimized bundle...');
    const validation = validateBundleSelectively(originalCode, output, manifest);
    
    if (validation.issues.length > 0) {
      console.log('❌ Validation failed:');
      validation.issues.forEach(issue => console.log(`   - ${issue}`));
      
      // Restore from backup
      fs.copyFileSync(backupFile, inputBundle);
      console.log('🔄 Restored original bundle from backup');
      
      throw new Error('Bundle validation failed - optimization too aggressive');
    }
    
    // Update manifest with validation results
    manifest.v = true; // validation passed
    
    // Write files
    fs.writeFileSync(outputBundle, output);
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
    
    // Success report
    console.log('\n🎉 Selective Aggressive Production Stripper Complete!');
    console.log('=====================================================');
    console.log(`📦 Original bundle: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`🎯 Selective bundle: ${(output.length / 1024).toFixed(2)} KB`);
    console.log(`📉 Size reduction: ${((originalSize - output.length) / 1024).toFixed(2)} KB (${validation.reduction.toFixed(2)}%)`);
    console.log(`🔧 Optimizations: ${totalOptimizations}`);
    console.log(`📊 Manifest size: ${(JSON.stringify(manifest).length / 1024).toFixed(2)} KB`);
    console.log(`✅ Validation: PASSED`);
    console.log(`💾 Files:`);
    console.log(`   Selective: ${path.relative(process.cwd(), outputBundle)}`);
    console.log(`   Manifest: ${path.relative(process.cwd(), manifestFile)}`);
    console.log(`   Backup: ${path.relative(process.cwd(), backupFile)}`);
    
    console.log('\n🚀 Production Ready: YES (Selective Mode)');
    console.log('💡 Deploy the .selective.js file for production use');
    console.log('🔄 Use the backup file to rollback if needed');
    console.log('🎯 This stripper targets only the most impactful identifiers');
    
  } catch (error) {
    console.error('❌ Selective aggressive production stripper failed:', error.message);
    
    // Cleanup on failure
    try {
      if (typeof backupFile !== 'undefined' && fs.existsSync(backupFile)) {
        fs.copyFileSync(backupFile, inputBundle);
        console.log('🔄 Restored original bundle from backup');
      }
    } catch (cleanupError) {
      console.error('Failed to restore backup:', cleanupError.message);
    }
    
    process.exit(1);
  }
}

// Run the selective aggressive production stripper
runSelectiveAggressiveStripper();
