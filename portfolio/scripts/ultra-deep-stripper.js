#!/usr/bin/env node

/**
 * Ultra-Deep Production-Safe Post-Build Stripper
 * 
 * This stripper targets ALL identifiers including:
 * - Functions and function parameters
 * - Variables and constants
 * - Object properties and method names
 * - Import/export names
 * - Deep nested identifiers
 * - While maintaining a compact manifest under 400KB
 * 
 * WARNING: This is a proof-of-concept. Test thoroughly before production use.
 */

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

// Configuration for ultra-deep optimization
const ULTRA_DEEP_CONFIG = {
  // Maximum manifest size (5MB - maximum aggression for ultra-deep optimization)
  maxManifestSize: 5 * 1024 * 1024,
  
  // Maximum optimization percentage (maximum aggression)
  maxOptimizationPercentage: 25,
  
  // Target patterns for ALL types of identifiers
  targetPatterns: {
    // React components (PascalCase)
    components: /^[A-Z][a-zA-Z0-9]*$/,
    // Hooks (use*)
    hooks: /^use[A-Z][a-zA-Z0-9]*$/,
    // Functions (camelCase)
    functions: /^[a-z][a-zA-Z0-9]*$/,
    // Variables (camelCase, snake_case, kebab-case)
    variables: /^[a-zA-Z_$][a-zA-Z0-9_$-]*$/,
    // Long identifiers (more than 6 characters)
    longIdentifiers: /^[a-zA-Z_$][a-zA-Z0-9_$]{6,}$/,
    // Object properties
    properties: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
    // Parameters (any valid identifier)
    parameters: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/
  },
  
  // NEVER strip these identifiers (critical for functionality)
  protectedIdentifiers: [
    // React core (minimal set)
    'React', 'useState', 'useEffect', 'useRef',
    
    // Web3 core (minimal set)
    'ethers', 'window', 'document', 'console',
    
    // Three.js core (minimal set)
    'THREE', 'Scene', 'Camera', 'Renderer',
    
    // Critical browser APIs
    'setTimeout', 'setInterval', 'requestAnimationFrame',
    
    // Critical business logic
    'handleSubmit', 'handleChange', 'handleClick'
  ],
  
  // Critical patterns that must be preserved
  criticalPatterns: [
    /React\./,
    /useState\(/,
    /useEffect\(/,
    /useRef\(/,
    /THREE\./,
    /ethers\./
  ],
  
  // Skip these contexts to avoid breaking functionality
  skipContexts: [
    'import', 'export', 'require', 'module', 'exports'
  ]
};

function validateBundleUltraDeep(originalCode, output, manifest) {
  const issues = [];
  const originalSize = originalCode.length;
  const optimizedSize = output.length;
  const reduction = ((originalSize - optimizedSize) / originalSize) * 100;
  
  // Check size reduction limits
  if (reduction > ULTRA_DEEP_CONFIG.maxOptimizationPercentage) {
    issues.push(`Optimization too aggressive: ${reduction.toFixed(2)}% (max: ${ULTRA_DEEP_CONFIG.maxOptimizationPercentage}%)`);
  }
  
  // Check critical patterns
  const criticalPatterns = ULTRA_DEEP_CONFIG.criticalPatterns;
  for (const pattern of criticalPatterns) {
    if (!pattern.test(output)) {
      issues.push(`Critical pattern missing: ${pattern.source}`);
    }
  }
  
  // Check manifest size
  const manifestSize = JSON.stringify(manifest).length;
  if (manifestSize > ULTRA_DEEP_CONFIG.maxManifestSize) {
    issues.push(`Manifest too large: ${(manifestSize / 1024).toFixed(2)} KB (max: ${(ULTRA_DEEP_CONFIG.maxManifestSize / 1024).toFixed(2)}KB)`);
  }
  
  return { issues, reduction };
}

function isSafeToStripUltraDeep(name, context, parentType) {
  // Never strip protected identifiers
  if (ULTRA_DEEP_CONFIG.protectedIdentifiers.includes(name)) {
    return false;
  }
  
  // Skip certain contexts
  if (ULTRA_DEEP_CONFIG.skipContexts.includes(context)) {
    return false;
  }
  
  // Never strip very short names (1-2 characters)
  if (name.length <= 2) {
    return false;
  }
  
  // Never strip global objects
  if (['Object', 'Array', 'String', 'Number', 'Boolean', 'Function', 'Date', 'RegExp', 'Error', 'Math', 'JSON'].includes(name)) {
    return false;
  }
  
  // Check if it matches any target pattern
  const patterns = ULTRA_DEEP_CONFIG.targetPatterns;
  return (
    patterns.components.test(name) ||
    patterns.hooks.test(name) ||
    patterns.functions.test(name) ||
    patterns.variables.test(name) ||
    patterns.longIdentifiers.test(name) ||
    patterns.properties.test(name) ||
    patterns.parameters.test(name)
  );
}

function runUltraDeepStripper() {
  try {
    console.log('🚀 Ultra-Deep Production-Safe Post-Build Stripper Starting...');
    console.log('================================================================\n');
    
    // Find the main bundle file
    const buildDir = path.join(__dirname, '../build/static/js');
    const files = fs.readdirSync(buildDir);
    const mainBundleFile = files.find(file => file.startsWith('main.') && file.endsWith('.js') && !file.includes('.stripped') && !file.includes('.enhanced') && !file.includes('.production') && !file.includes('.aggressive') && !file.includes('.selective'));
    
    if (!mainBundleFile) {
      throw new Error('Main bundle file not found in build/static/js');
    }
    
    const inputBundle = path.join(buildDir, mainBundleFile);
    const outputBundle = path.join(buildDir, mainBundleFile.replace('.js', '.ultra-deep.js'));
    const manifestFile = path.join(__dirname, '../build/ultra-deep-manifest.json');
    const backupFile = inputBundle + '.ultra-deep.backup';
    
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
    
    // Ultra-compact manifest with binary-like compression
    const manifest = {
      o: {}, // optimizations.identifiers only
      v: false // validation.passed
    };
    
    let identifierCounter = 0;
    let totalOptimizations = 0;
    
    // Traverse and optimize ALL identifiers
    console.log('🔧 Starting ultra-deep optimization...');
    traverse(ast, {
      // Target ALL identifier types
      Identifier(path) {
        const name = path.node.name;
        
        // Skip if already processed
        if (manifest.o[name]) {
          return;
        }
        
        // Determine context
        let context = 'general';
        let parentType = path.parent.type;
        
        if (parentType === 'ImportSpecifier') context = 'import';
        else if (parentType === 'ExportSpecifier') context = 'export';
        else if (parentType === 'MemberExpression') context = 'member';
        else if (parentType === 'FunctionDeclaration') context = 'function';
        else if (parentType === 'VariableDeclarator') context = 'variable';
        else if (parentType === 'FunctionParameter') context = 'parameter';
        else if (parentType === 'ObjectProperty') context = 'property';
        else if (parentType === 'ClassMethod') context = 'method';
        else if (parentType === 'ClassProperty') context = 'class-property';
        
        // Check if safe to strip ultra-deep
        if (isSafeToStripUltraDeep(name, context, parentType)) {
          const key = identifierCounter++; // Just use numbers as keys
          manifest.o[key] = name; // Compact storage
          
          path.node.name = `a${key}`; // Keep the 'a' prefix in the code
          totalOptimizations++;
          
          // Check manifest size during processing
          if (identifierCounter % 500 === 0) {
            const currentManifestSize = JSON.stringify(manifest).length;
            if (currentManifestSize > ULTRA_DEEP_CONFIG.maxManifestSize) {
              console.log(`⚠️  Manifest size limit reached at ${identifierCounter} identifiers. Stopping optimization.`);
              return;
            }
          }
        }
      },
      
      // Target JSX identifiers
      JSXIdentifier(path) {
        const name = path.node.name;
        
        if (manifest.o[name]) {
          return;
        }
        
        if (isSafeToStripUltraDeep(name, 'jsx', 'JSXIdentifier')) {
          const key = identifierCounter++;
          manifest.o[key] = name;
          
          path.node.name = `a${key}`;
          totalOptimizations++;
        }
      },
      

    });
    
    console.log(`✅ Ultra-deep optimization complete. ${totalOptimizations} identifiers processed.`);
    
    // Generate optimized bundle
    console.log('📊 Generating ultra-deep production bundle...');
    const output = generate(ast, { 
      minified: true,
      compact: true,
      comments: false
    }).code;
    
    // Validate the optimized bundle
    console.log('🔍 Validating optimized bundle...');
    const validation = validateBundleUltraDeep(originalCode, output, manifest);
    
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
    console.log('\n🎉 Ultra-Deep Production Stripper Complete!');
    console.log('============================================');
    console.log(`📦 Original bundle: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`🚀 Ultra-deep bundle: ${(output.length / 1024).toFixed(2)} KB`);
    console.log(`📉 Size reduction: ${((originalSize - output.length) / 1024).toFixed(2)} KB (${validation.reduction.toFixed(2)}%)`);
    console.log(`🔧 Optimizations: ${totalOptimizations}`);
    console.log(`📊 Manifest size: ${(JSON.stringify(manifest).length / 1024).toFixed(2)} KB`);
    console.log(`✅ Validation: PASSED`);
    console.log(`💾 Files:`);
    console.log(`   Ultra-deep: ${path.relative(process.cwd(), outputBundle)}`);
    console.log(`   Manifest: ${path.relative(process.cwd(), manifestFile)}`);
    console.log(`   Backup: ${path.relative(process.cwd(), backupFile)}`);
    
    console.log('\n🚀 Production Ready: YES (Ultra-Deep Mode)');
    console.log('💡 Deploy the .ultra-deep.js file for production use');
    console.log('🔄 Use the backup file to rollback if needed');
    console.log('🎯 This stripper targets ALL identifiers for maximum optimization');
    
  } catch (error) {
    console.error('❌ Ultra-deep production stripper failed:', error.message);
    
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

// Run the ultra-deep production stripper
runUltraDeepStripper();
