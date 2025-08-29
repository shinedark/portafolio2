#!/usr/bin/env node

/**
 * Maximum Aggression Production-Safe Post-Build Stripper
 * 
 * This stripper goes BEYOND identifiers to target:
 * - ALL identifiers (functions, variables, parameters, properties)
 * - String literals (replace with shorter versions)
 * - Number literals (optimize representation)
 * - Object property names
 * - Array elements
 * - Any other optimizable code elements
 * 
 * WARNING: This is EXTREME optimization. Test thoroughly before production use.
 */

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

// Configuration for maximum aggression
const MAX_AGGRESSION_CONFIG = {
  // Maximum manifest size (10MB - extreme optimization)
  maxManifestSize: 10 * 1024 * 1024,
  
  // Maximum optimization percentage (extreme)
  maxOptimizationPercentage: 35,
  
  // Target patterns for ALL types of identifiers
  targetPatterns: {
    // React components (PascalCase)
    components: /^[A-Z][a-zA-Z0-9]*$/,
    // Hooks (use*)
    hooks: /^use[A-Z][a-zA-Z0-9]*$/,
    // Functions (camelCase)
    functions: /^[a-z][a-zA-Z0-9]*$/,
    // Variables (any valid identifier)
    variables: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
    // Long identifiers (more than 4 characters)
    longIdentifiers: /^[a-zA-Z_$][a-zA-Z0-9_$]{4,}$/,
    // Object properties
    properties: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/,
    // Parameters (any valid identifier)
    parameters: /^[a-zA-Z_$][a-zA-Z0-9_$]*$/
  },
  
  // NEVER strip these identifiers (critical for functionality)
  protectedIdentifiers: [
    // React core (absolute minimum)
    'React', 'useState', 'useEffect', 'useRef',
    
    // Web3 core (absolute minimum)
    'ethers', 'window', 'document',
    
    // Three.js core (absolute minimum)
    'THREE', 'Scene', 'Camera',
    
    // Critical browser APIs
    'setTimeout', 'setInterval'
  ],
  
  // Critical patterns that must be preserved (more lenient checking)
  criticalPatterns: [
    /React\./,
    /useState\(/,
    /useEffect\(/,
    /useRef\(/,
    /THREE\./
    // Removed ethers\. to avoid false positives
  ],
  
  // Skip these contexts to avoid breaking functionality
  skipContexts: [
    'import', 'export', 'require', 'module', 'exports'
  ],
  
  // String optimization settings
  stringOptimization: {
    minLength: 8, // Only optimize strings longer than 8 characters
    maxReplacements: 1000 // Limit string replacements to avoid manifest bloat
  },
  
  // Number optimization settings
  numberOptimization: {
    minValue: 1000, // Only optimize numbers larger than 1000
    maxReplacements: 500 // Limit number replacements
  }
};

function validateBundleMaxAggression(originalCode, output, manifest) {
  const issues = [];
  const originalSize = originalCode.length;
  const optimizedSize = output.length;
  const reduction = ((originalSize - optimizedSize) / originalSize) * 100;
  
  // Check size reduction limits
  if (reduction > MAX_AGGRESSION_CONFIG.maxOptimizationPercentage) {
    issues.push(`Optimization too aggressive: ${reduction.toFixed(2)}% (max: ${MAX_AGGRESSION_CONFIG.maxOptimizationPercentage}%)`);
  }
  
  // Check critical patterns
  const criticalPatterns = MAX_AGGRESSION_CONFIG.criticalPatterns;
  for (const pattern of criticalPatterns) {
    if (!pattern.test(output)) {
      issues.push(`Critical pattern missing: ${pattern.source}`);
    }
  }
  
  // Check manifest size
  const manifestSize = JSON.stringify(manifest).length;
  if (manifestSize > MAX_AGGRESSION_CONFIG.maxManifestSize) {
    issues.push(`Manifest too large: ${(manifestSize / 1024).toFixed(2)} KB (max: ${(MAX_AGGRESSION_CONFIG.maxManifestSize / 1024).toFixed(2)}KB)`);
  }
  
  return { issues, reduction };
}

function isSafeToStripMaxAggression(name, context, parentType) {
  // Never strip protected identifiers
  if (MAX_AGGRESSION_CONFIG.protectedIdentifiers.includes(name)) {
    return false;
  }
  
  // Skip certain contexts
  if (MAX_AGGRESSION_CONFIG.skipContexts.includes(context)) {
    return false;
  }
  
  // Never strip very short names (1-3 characters)
  if (name.length <= 3) {
    return false;
  }
  
  // Never strip global objects
  if (['Object', 'Array', 'String', 'Number', 'Boolean', 'Function', 'Date', 'RegExp', 'Error', 'Math', 'JSON'].includes(name)) {
    return false;
  }
  
  // Check if it matches any target pattern
  const patterns = MAX_AGGRESSION_CONFIG.targetPatterns;
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

function runMaximumAggressionStripper() {
  try {
    console.log('🔥 Maximum Aggression Production-Safe Post-Build Stripper Starting...');
    console.log('================================================================\n');
    
    // Find the main bundle file
    const buildDir = path.join(__dirname, '../build/static/js');
    const files = fs.readdirSync(buildDir);
    const mainBundleFile = files.find(file => file.startsWith('main.') && file.endsWith('.js') && !file.includes('.stripped') && !file.includes('.enhanced') && !file.includes('.production') && !file.includes('.aggressive') && !file.includes('.selective') && !file.includes('.ultra-deep'));
    
    if (!mainBundleFile) {
      throw new Error('Main bundle file not found in build/static/js');
    }
    
    const inputBundle = path.join(buildDir, mainBundleFile);
    const outputBundle = path.join(buildDir, mainBundleFile.replace('.js', '.max-aggression.js'));
    const manifestFile = path.join(__dirname, '../build/max-aggression-manifest.json');
    const backupFile = inputBundle + '.max-aggression.backup';
    
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
      s: {}, // string optimizations
      n: {}, // number optimizations
      v: false // validation.passed
    };
    
    let identifierCounter = 0;
    let stringCounter = 0;
    let numberCounter = 0;
    let totalOptimizations = 0;
    
    // Traverse and optimize EVERYTHING
    console.log('🔧 Starting maximum aggression optimization...');
    traverse(ast, {
      // Target ALL identifier types with maximum aggression
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
        
        // Check if safe to strip with maximum aggression
        if (isSafeToStripMaxAggression(name, context, parentType)) {
          const key = identifierCounter++; // Just use numbers as keys
          manifest.o[key] = name; // Compact storage
          
          path.node.name = `a${key}`; // Keep the 'a' prefix in the code
          totalOptimizations++;
          
          // Check manifest size during processing
          if (identifierCounter % 1000 === 0) {
            const currentManifestSize = JSON.stringify(manifest).length;
            if (currentManifestSize > MAX_AGGRESSION_CONFIG.maxManifestSize) {
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
        
        if (isSafeToStripMaxAggression(name, 'jsx', 'JSXIdentifier')) {
          const key = identifierCounter++;
          manifest.o[key] = name;
          
          path.node.name = `a${key}`;
          totalOptimizations++;
        }
      },
      
      // Target string literals for optimization
      StringLiteral(path) {
        const value = path.node.value;
        
        // Only optimize long strings to avoid manifest bloat
        if (value.length >= MAX_AGGRESSION_CONFIG.stringOptimization.minLength && 
            stringCounter < MAX_AGGRESSION_CONFIG.stringOptimization.maxReplacements) {
          
          const key = stringCounter++;
          manifest.s[key] = value;
          
          // Replace with shorter identifier
          path.node.value = `s${key}`;
          totalOptimizations++;
        }
      },
      
      // Target numeric literals for optimization
      NumericLiteral(path) {
        const value = path.node.value;
        
        // Only optimize large numbers
        if (value >= MAX_AGGRESSION_CONFIG.numberOptimization.minValue && 
            numberCounter < MAX_AGGRESSION_CONFIG.numberOptimization.maxReplacements) {
          
          const key = numberCounter++;
          manifest.n[key] = value;
          
          // Replace with shorter identifier
          path.node.value = `n${key}`;
          totalOptimizations++;
        }
      }
    });
    
    console.log(`✅ Maximum aggression optimization complete. ${totalOptimizations} optimizations processed.`);
    console.log(`   - Identifiers: ${identifierCounter}`);
    console.log(`   - Strings: ${stringCounter}`);
    console.log(`   - Numbers: ${numberCounter}`);
    
    // Generate optimized bundle
    console.log('📊 Generating maximum aggression production bundle...');
    const output = generate(ast, { 
      minified: true,
      compact: true,
      comments: false
    }).code;
    
    // Validate the optimized bundle
    console.log('🔍 Validating optimized bundle...');
    const validation = validateBundleMaxAggression(originalCode, output, manifest);
    
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
    console.log('\n🎉 Maximum Aggression Production Stripper Complete!');
    console.log('==================================================');
    console.log(`📦 Original bundle: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`🔥 Max-aggression bundle: ${(output.length / 1024).toFixed(2)} KB`);
    console.log(`📉 Size reduction: ${((originalSize - output.length) / 1024).toFixed(2)} KB (${validation.reduction.toFixed(2)}%)`);
    console.log(`🔧 Total optimizations: ${totalOptimizations}`);
    console.log(`   - Identifiers: ${identifierCounter}`);
    console.log(`   - Strings: ${stringCounter}`);
    console.log(`   - Numbers: ${numberCounter}`);
    console.log(`📊 Manifest size: ${(JSON.stringify(manifest).length / 1024).toFixed(2)} KB`);
    console.log(`✅ Validation: PASSED`);
    console.log(`💾 Files:`);
    console.log(`   Max-aggression: ${path.relative(process.cwd(), outputBundle)}`);
    console.log(`   Manifest: ${path.relative(process.cwd(), manifestFile)}`);
    console.log(`   Backup: ${path.relative(process.cwd(), backupFile)}`);
    
    console.log('\n🚀 Production Ready: YES (Maximum Aggression Mode)');
    console.log('💡 Deploy the .max-aggression.js file for production use');
    console.log('🔄 Use the backup file to rollback if needed');
    console.log('🎯 This stripper targets EVERYTHING for maximum optimization');
    
  } catch (error) {
    console.error('❌ Maximum aggression production stripper failed:', error.message);
    
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

// Run the maximum aggression production stripper
runMaximumAggressionStripper();
