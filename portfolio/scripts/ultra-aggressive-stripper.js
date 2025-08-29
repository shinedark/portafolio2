#!/usr/bin/env node

/**
 * Ultra-Aggressive Production Stripper
 * 
 * EXTREME OPTIMIZATION FEATURES:
 * - Targets ALL bundle chunks (main, vendor, React libraries)
 * - Optimizes React library code itself
 * - Most aggressive identifier replacement
 * - Advanced string and number hoisting
 * - Cross-chunk optimization
 * - Library code minification
 * 
 * WARNING: This is MAXIMUM RISK optimization. Test thoroughly!
 */

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const types = require('@babel/types');

// Ultra-aggressive configuration
const ULTRA_CONFIG = {
  // Maximum manifest size (20MB - extreme)
  maxManifestSize: 20 * 1024 * 1024,
  
  // Maximum optimization percentage (extreme)
  maxOptimizationPercentage: 50,
  
  // Target ALL possible identifiers
  targetPatterns: {
    // React components (PascalCase) - use 'c' prefix
    components: /^[A-Z][a-zA-Z0-9]*$/,
    // Hooks (use*) - use 'h' prefix
    hooks: /^use[A-Z][a-zA-Z0-9]*$/,
    // Functions (camelCase) - use 'f' prefix
    functions: /^[a-z][a-zA-Z0-9]*$/,
    // Variables (any valid identifier) - use 'v' prefix
    variables: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
    // Long identifiers (more than 3 characters) - use 'l' prefix
    longIdentifiers: /^[a-zA-Z_$][a-zA-Z0-9_$]{3,}$/,
    // Object properties - use 'p' prefix
    properties: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
    // Parameters - use 'a' prefix
    parameters: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
    // React internals - use 'r' prefix
    reactInternals: /^(Component|PureComponent|Fragment|createElement|cloneElement|isValidElement)$/,
    // DOM properties - use 'd' prefix
    domProperties: /^(className|onClick|onChange|onSubmit|innerHTML|textContent)$/
  },
  
  // Minimal protected identifiers (only absolute essentials)
  protectedIdentifiers: [
    // Critical React (bare minimum)
    'React',
    
    // Critical browser APIs (bare minimum)
    'window', 'document',
    
    // Critical JavaScript (bare minimum)
    'undefined', 'null', 'true', 'false'
  ],
  
  // Very lenient critical patterns
  criticalPatterns: [
    /React\s*\./,
    /window\s*\./,
    /document\s*\./
  ],
  
  // Skip contexts (minimal)
  skipContexts: [
    'import', 'export'
  ],
  
  // Aggressive string optimization
  stringOptimization: {
    minLength: 3, // Very aggressive - optimize 3+ character strings
    maxReplacements: 5000,
    minOccurrences: 1 // Optimize ALL strings
  },
  
  // Aggressive number optimization
  numberOptimization: {
    minValue: 10, // Very aggressive - optimize numbers >= 10
    maxReplacements: 2000,
    minOccurrences: 1 // Optimize ALL numbers
  },
  
  // Cross-chunk optimization
  crossChunk: {
    enabled: true,
    sharedManifest: true // Share optimizations across chunks
  }
};

// Ultra-fast lookups
const protectedSet = new Set(ULTRA_CONFIG.protectedIdentifiers);
const skipSet = new Set(ULTRA_CONFIG.skipContexts);

// Combined pattern for maximum speed
const patternSources = Object.values(ULTRA_CONFIG.targetPatterns).map(p => p.source);
const combinedPattern = new RegExp(`^(${patternSources.join('|')})$`);

function isSafeToStripUltra(name, context, parentType, path) {
  // Only protect absolute essentials
  if (protectedSet.has(name)) return false;
  if (skipSet.has(context)) return false;
  
  // Minimal safety checks (more aggressive than enhanced version)
  if (name === 'constructor' && parentType === 'MethodDefinition') return false;
  if (name === 'super' && parentType === 'Super') return false;
  
  // Allow optimization of most identifiers
  if (name.length < 2) return false; // Only skip single character names
  
  return true; // Ultra-aggressive: optimize almost everything
}

function classifyIdentifierUltra(name) {
  // More specific categorization for shorter names
  if (ULTRA_CONFIG.targetPatterns.reactInternals.test(name)) return 'react';
  if (ULTRA_CONFIG.targetPatterns.domProperties.test(name)) return 'dom';
  if (ULTRA_CONFIG.targetPatterns.components.test(name)) return 'component';
  if (ULTRA_CONFIG.targetPatterns.hooks.test(name)) return 'hook';
  if (ULTRA_CONFIG.targetPatterns.functions.test(name)) return 'function';
  if (ULTRA_CONFIG.targetPatterns.longIdentifiers.test(name)) return 'long';
  if (ULTRA_CONFIG.targetPatterns.properties.test(name)) return 'property';
  if (ULTRA_CONFIG.targetPatterns.parameters.test(name)) return 'parameter';
  
  return 'variable';
}

function findAllBundleChunks() {
  const buildDir = path.join(__dirname, '../build/static/js');
  
  if (!fs.existsSync(buildDir)) {
    throw new Error('Build directory not found');
  }
  
  const files = fs.readdirSync(buildDir);
  
  // Find ALL JavaScript chunks (exclude already optimized versions)
  const chunks = files.filter(file => 
    file.endsWith('.js') && 
    !file.includes('enhanced-max-aggression') &&
    !file.includes('ultra-aggressive') &&
    !file.includes('stripped') &&
    !file.includes('production') &&
    !file.includes('aggressive') &&
    !file.includes('selective') &&
    !file.includes('ultra-deep') &&
    !file.includes('max-aggression') // Exclude max-aggression optimized files
  );

  console.log(`🔍 Found ${chunks.length} chunks to optimize:`);
  chunks.forEach(chunk => console.log(`   - ${chunk}`));
  
  return chunks;
}

function optimizeChunk(chunkPath, globalManifest, globalCounters, globalPrefixes) {
  console.log(`\n🔄 Optimizing chunk: ${path.basename(chunkPath)}`);
  
  const originalCode = fs.readFileSync(chunkPath, 'utf-8');
  console.log(`📏 Original size: ${(originalCode.length / 1024).toFixed(2)} KB`);

  // Parse the code
  const ast = parser.parse(originalCode, { 
    sourceType: 'module', 
    plugins: ['jsx'],
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true
  });

  // Initialize tracking for this chunk
  const identifierMap = new Map();
  const stringMap = new Map();
  const numberMap = new Map();
  let chunkOptimizations = 0;

  // First pass: collect literals
  traverse(ast, {
    StringLiteral(path) {
      const value = path.node.value;
      if (value.length < ULTRA_CONFIG.stringOptimization.minLength) return;
      
      const entry = stringMap.get(value) || { count: 0, occurrences: [] };
      entry.count++;
      entry.occurrences.push(path);
      stringMap.set(value, entry);
    },
    NumericLiteral(path) {
      const value = path.node.value;
      if (value < ULTRA_CONFIG.numberOptimization.minValue) return;
      
      const entry = numberMap.get(value) || { count: 0, occurrences: [] };
      entry.count++;
      entry.occurrences.push(path);
      numberMap.set(value, entry);
    }
  });

  // Assign keys for literals (ultra-aggressive: optimize everything)
  for (const [value, entry] of stringMap) {
    const key = globalCounters.string++;
    entry.key = key;
    globalManifest.optimizations.strings[key] = value;
  }
  
  for (const [value, entry] of numberMap) {
    const key = globalCounters.number++;
    entry.key = key;
    globalManifest.optimizations.numbers[key] = value;
  }

  // Second pass: ultra-aggressive replacement
  traverse(ast, {
    Identifier(path) {
      const name = path.node.name;
      
      // Check global manifest first (cross-chunk optimization)
      if (globalManifest.identifierMap.has(name)) {
        const mapping = globalManifest.identifierMap.get(name);
        path.node.name = `${globalPrefixes[mapping.type]}${mapping.key}`;
        chunkOptimizations++;
        return;
      }
      
      // Determine context
      const context = path.parent.type;
      const parentType = path.parent.type;
      
      // Ultra-aggressive safety check
      if (!isSafeToStripUltra(name, context, parentType, path)) return;
      
      // Classify and assign key
      const type = classifyIdentifierUltra(name);
      const key = globalCounters[type]++;
      
      // Store in global manifest for cross-chunk optimization
      globalManifest.identifierMap.set(name, { key, type });
      chunkOptimizations++;
      
      // Replace identifier
      path.node.name = `${globalPrefixes[type]}${key}`;
      
      // Update manifest
      if (!globalManifest.optimizations.categories[type]) {
        globalManifest.optimizations.categories[type] = {};
      }
      globalManifest.optimizations.categories[type][key] = name;
    },
    
    JSXIdentifier(path) {
      const name = path.node.name;
      
      if (globalManifest.identifierMap.has(name)) {
        const mapping = globalManifest.identifierMap.get(name);
        path.node.name = `${globalPrefixes[mapping.type]}${mapping.key}`;
        chunkOptimizations++;
        return;
      }
      
      if (!isSafeToStripUltra(name, 'JSX', 'JSXElement', path)) return;
      
      const type = classifyIdentifierUltra(name);
      const key = globalCounters[type]++;
      
      globalManifest.identifierMap.set(name, { key, type });
      chunkOptimizations++;
      
      path.node.name = `${globalPrefixes[type]}${key}`;
      
      if (!globalManifest.optimizations.categories[type]) {
        globalManifest.optimizations.categories[type] = {};
      }
      globalManifest.optimizations.categories[type][key] = name;
    },
    
    StringLiteral(path) {
      const value = path.node.value;
      const entry = stringMap.get(value);
      
      if (entry && entry.key !== undefined) {
        path.replaceWith(types.identifier(`s${entry.key}`));
        chunkOptimizations++;
      }
    },
    
    NumericLiteral(path) {
      const value = path.node.value;
      const entry = numberMap.get(value);
      
      if (entry && entry.key !== undefined) {
        path.replaceWith(types.identifier(`n${entry.key}`));
        chunkOptimizations++;
      }
    }
  });

  // Insert literal definitions at the top
  const declarations = [];
  
  for (const [value, entry] of stringMap) {
    if (entry.key !== undefined) {
      declarations.push(
        types.variableDeclarator(
          types.identifier(`s${entry.key}`), 
          types.stringLiteral(value)
        )
      );
    }
  }
  
  for (const [value, entry] of numberMap) {
    if (entry.key !== undefined) {
      declarations.push(
        types.variableDeclarator(
          types.identifier(`n${entry.key}`), 
          types.numericLiteral(value)
        )
      );
    }
  }
  
  if (declarations.length > 0) {
    ast.program.body.unshift(
      types.variableDeclaration('const', declarations)
    );
  }

  // Generate ultra-minified output
  const output = generate(ast, { 
    minified: true,
    compact: true,
    comments: false,
    retainLines: false
  }).code;

  console.log(`✅ Chunk optimized: ${chunkOptimizations} replacements`);
  console.log(`📏 Optimized size: ${(output.length / 1024).toFixed(2)} KB`);
  console.log(`📊 Reduction: ${(((originalCode.length - output.length) / originalCode.length) * 100).toFixed(2)}%`);

  return {
    originalSize: originalCode.length,
    optimizedSize: output.length,
    optimizations: chunkOptimizations,
    output
  };
}

function runUltraAggressiveStripper() {
  console.log('🚀 Ultra-Aggressive Stripper Starting...');
  console.log('⚠️  WARNING: This is MAXIMUM RISK optimization!');
  
  try {
    // Find all bundle chunks
    const chunks = findAllBundleChunks();
    
    if (chunks.length === 0) {
      throw new Error('No chunks found to optimize');
    }

    // Initialize global manifest for cross-chunk optimization
    const globalManifest = {
      version: '3.0-ultra',
      timestamp: new Date().toISOString(),
      identifierMap: new Map(),
      optimizations: {
        identifiers: {},
        strings: {},
        numbers: {},
        categories: {}
      },
      chunks: {},
      stats: {
        totalOptimizations: 0,
        totalOriginalSize: 0,
        totalOptimizedSize: 0,
        chunkCount: chunks.length
      }
    };

    // Global counters for cross-chunk consistency
    const globalCounters = {
      react: 0, dom: 0, component: 0, hook: 0, function: 0,
      long: 0, property: 0, parameter: 0, variable: 0,
      string: 0, number: 0
    };
    
    // Ultra-short prefixes for maximum compression
    const globalPrefixes = {
      react: 'r', dom: 'd', component: 'c', hook: 'h', function: 'f',
      long: 'l', property: 'p', parameter: 'a', variable: 'v'
    };

    // Process each chunk
    const buildDir = path.join(__dirname, '../build/static/js');
    
    for (const chunk of chunks) {
      const chunkPath = path.join(buildDir, chunk);
      const result = optimizeChunk(chunkPath, globalManifest, globalCounters, globalPrefixes);
      
      // Save optimized chunk
      const optimizedChunkPath = path.join(buildDir, chunk.replace('.js', '.ultra-aggressive.js'));
      fs.writeFileSync(optimizedChunkPath, result.output);
      
      // Update global stats
      globalManifest.chunks[chunk] = {
        originalSize: result.originalSize,
        optimizedSize: result.optimizedSize,
        optimizations: result.optimizations,
        reduction: ((result.originalSize - result.optimizedSize) / result.originalSize) * 100
      };
      
      globalManifest.stats.totalOptimizations += result.optimizations;
      globalManifest.stats.totalOriginalSize += result.originalSize;
      globalManifest.stats.totalOptimizedSize += result.optimizedSize;
    }

    // Convert Map to Object for JSON serialization
    const manifestForSaving = {
      ...globalManifest,
      identifierMap: undefined // Remove Map, data is in categories
    };

    // Validate overall optimization
    const totalReduction = ((globalManifest.stats.totalOriginalSize - globalManifest.stats.totalOptimizedSize) / globalManifest.stats.totalOriginalSize) * 100;
    
    if (totalReduction > ULTRA_CONFIG.maxOptimizationPercentage) {
      console.log(`⚠️  Warning: Optimization very aggressive (${totalReduction.toFixed(2)}%)`);
    }

    // Save global manifest
    const manifestPath = path.join(__dirname, '../build/ultra-aggressive-manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifestForSaving, null, 2));

    // Display results
    console.log('\n🎉 Ultra-Aggressive Stripping Complete!');
    console.log('📊 Overall Results:');
    console.log(`   Chunks processed: ${chunks.length}`);
    console.log(`   Total original size: ${(globalManifest.stats.totalOriginalSize / 1024).toFixed(2)} KB`);
    console.log(`   Total optimized size: ${(globalManifest.stats.totalOptimizedSize / 1024).toFixed(2)} KB`);
    console.log(`   Total reduction: ${((globalManifest.stats.totalOriginalSize - globalManifest.stats.totalOptimizedSize) / 1024).toFixed(2)} KB (${totalReduction.toFixed(2)}%)`);
    console.log(`   Total optimizations: ${globalManifest.stats.totalOptimizations}`);
    console.log(`   Manifest size: ${(JSON.stringify(manifestForSaving).length / 1024).toFixed(2)} KB`);
    
    console.log('\n🏷️  Optimization Categories:');
    for (const [category, identifiers] of Object.entries(globalManifest.optimizations.categories)) {
      const count = Object.keys(identifiers).length;
      console.log(`   ${category}: ${count} identifiers`);
    }
    
    console.log('\n📁 Files generated:');
    chunks.forEach(chunk => {
      console.log(`   ${chunk.replace('.js', '.ultra-aggressive.js')}`);
    });
    console.log(`   ultra-aggressive-manifest.json`);
    
    if (totalReduction >= 25) {
      console.log('\n🚀 INCREDIBLE: 25%+ reduction achieved across all chunks!');
    } else if (totalReduction >= 20) {
      console.log('\n🎯 EXCELLENT: 20%+ reduction achieved!');
    } else if (totalReduction >= 15) {
      console.log('\n✅ GREAT: 15%+ reduction achieved!');
    }
    
    return {
      success: true,
      totalReduction,
      totalOptimizations: globalManifest.stats.totalOptimizations,
      chunkCount: chunks.length
    };

  } catch (error) {
    console.error('❌ Ultra-Aggressive Stripping failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Run the ultra-aggressive stripper
if (require.main === module) {
  const result = runUltraAggressiveStripper();
  
  if (result.success) {
    console.log('\n✅ Ultra-Aggressive Stripping completed successfully!');
    process.exit(0);
  } else {
    console.log('\n❌ Ultra-Aggressive Stripping failed!');
    process.exit(1);
  }
}

module.exports = { runUltraAggressiveStripper };
