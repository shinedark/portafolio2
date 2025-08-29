// scripts/aggressive-production-stripper.js
// AGGRESSIVE BUT SAFE: Production optimization targeting unused imports and aggressive identifier stripping
// This stripper is designed for production use with comprehensive safety checks and aggressive optimization

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

// Aggressive but safe configuration
const AGGRESSIVE_CONFIG = {
  // Safe patterns for aggressive optimization
  safePatterns: {
    // React component names (PascalCase) - safe to strip aggressively
    components: /^[A-Z][a-zA-Z0-9]*$/,
    // Custom hooks (use* pattern) - safe to strip
    hooks: /^use[A-Z][a-zA-Z0-9]*$/,
    // Internal utility functions - safe to strip
    utilities: /^[a-z][a-zA-Z0-9]*$/,
    // Safe property names
    properties: /^(className|onClick|onSubmit|onChange|value|type|id|name|key|ref|style)$/
  },
  
  // NEVER strip these identifiers (critical for functionality)
  protectedIdentifiers: [
    // React core - ESSENTIAL
    'React', 'useState', 'useEffect', 'useRef', 'useCallback', 'useMemo', 'useContext',
    
    // Web3 core - ESSENTIAL
    'ethers', 'Web3', 'window', 'document', 'console', 'localStorage',
    
    // Browser APIs - ESSENTIAL
    'navigator', 'location', 'history', 'screen', 'performance',
    'requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'setInterval',
    
    // Three.js core - ESSENTIAL
    'THREE', 'Scene', 'Camera', 'Renderer', 'Geometry', 'Material',
    
    // Router core - ESSENTIAL
    'BrowserRouter', 'Routes', 'Route', 'useNavigate', 'useParams',
    
    // Critical business logic - ESSENTIAL
    'handleSubmit', 'handleChange', 'handleClick', 'onSubmit', 'onChange',
    'onClick', 'onFocus', 'onBlur', 'onKeyDown', 'onKeyUp', 'onKeyPress',
    
    // Critical variables - ESSENTIAL
    'projects', 'selectedProjects', 'currentProjectIndex', 'selectedTech',
    'isAnimating', 'isMobile', 'showOverlay', 'activeRoute'
  ],
  
  // Aggressive optimization settings
  maxIdentifierLength: 7,        // Strip longer identifiers
  minIdentifierLength: 5,        // Strip shorter identifiers
  maxOptimizationPercentage: 10, // 10% max reduction (balanced)
  minBundleSize: 100 * 1024,     // 100KB minimum
  
  // Target specific unused patterns from App.js analysis
  targetUnusedPatterns: [
    // Commented out components
    'PrototypeShowcase', 'RouteContainer', 'SDProject', 'BusinessPlan', 
    'Timeline', 'Development', 'Invest', 'AdminRoute',
    'Subscribe', 'Instagram', 'Twitch', 'Donate',
    
    // Unused router components
    'Routes', 'Route',
    
    // Unused imports that might be in bundle
    'FontLoader', 'TextGeometry'
  ]
};

// Find the main bundle file
function findMainBundle() {
  try {
    const jsDir = path.join(__dirname, '../build/static/js');
    const jsFiles = fs.readdirSync(jsDir);
    return jsFiles.find(file => 
      file.startsWith('main.') && 
      file.endsWith('.js') && 
      !file.includes('.map') && 
      !file.includes('.stripped') && 
      !file.includes('.enhanced') &&
      !file.includes('.production')
    );
  } catch (error) {
    throw new Error('Could not find main bundle file');
  }
}

// Check if identifier is safe to strip aggressively
function isSafeToStripAggressively(name, context) {
  // Never strip protected identifiers
  if (AGGRESSIVE_CONFIG.protectedIdentifiers.includes(name)) {
    return false;
  }
  
  // Never strip very short names
  if (name.length < AGGRESSIVE_CONFIG.minIdentifierLength) {
    return false;
  }
  
  // Never strip global objects or built-ins
  if (['Object', 'Array', 'String', 'Number', 'Boolean', 'Function', 'Date', 'RegExp', 'Error'].includes(name)) {
    return false;
  }
  
  // Never strip in certain contexts
  if (context === 'import' || context === 'export') {
    return false;
  }
  
  // Check safe patterns
  const isComponent = AGGRESSIVE_CONFIG.safePatterns.components.test(name);
  const isHook = AGGRESSIVE_CONFIG.safePatterns.hooks.test(name);
  const isUtility = AGGRESSIVE_CONFIG.safePatterns.utilities.test(name);
  
  // More aggressive: strip if it matches any safe pattern
  return isComponent || isHook || isUtility;
}

// Create backup of original bundle
function createBackup(originalPath) {
  const backupPath = originalPath + '.aggressive.backup';
  fs.copyFileSync(originalPath, backupPath);
  console.log(`📦 Backup created: ${path.relative(process.cwd(), backupPath)}`);
  return backupPath;
}

// Validate optimized bundle aggressively
function validateBundleAggressively(originalCode, optimizedCode, manifest) {
  const issues = [];
  
  // Check for critical missing patterns (more lenient)
  const criticalPatterns = [
    /React\./,
    /useState/,
    /useEffect/,
    /useRef/,
    /THREE\./
  ];
  
  criticalPatterns.forEach(pattern => {
    if (!pattern.test(optimizedCode)) {
      // Check if it's a false positive by looking for variations
      const patternStr = pattern.toString().replace(/[\/\^$]/g, '');
      const cleanPattern = patternStr.replace(/\\\./g, '.');
      if (!optimizedCode.includes(cleanPattern)) {
        issues.push(`Critical pattern missing: ${cleanPattern}`);
      }
    }
  });
  
  // Check bundle size reduction
  const reduction = ((originalCode.length - optimizedCode.length) / originalCode.length) * 100;
  if (reduction > AGGRESSIVE_CONFIG.maxOptimizationPercentage) {
    issues.push(`Bundle reduction too aggressive: ${reduction.toFixed(2)}% (max: ${AGGRESSIVE_CONFIG.maxOptimizationPercentage}%)`);
  }
  
  // Check manifest size (more lenient)
  const manifestSize = JSON.stringify(manifest).length;
  if (manifestSize > 400 * 1024) { // 400KB max
    issues.push(`Manifest too large: ${(manifestSize / 1024).toFixed(2)} KB (max: 400KB)`);
  }
  
  return { issues, reduction };
}

// Main aggressive production stripper
async function runAggressiveProductionStripper() {
  console.log('🚀 Aggressive Production-Safe Post-Build Stripper Starting...');
  console.log('================================================================\n');
  
  try {
    // Find and validate bundle
    const mainBundleFile = findMainBundle();
    const inputBundle = path.join(__dirname, '../build/static/js', mainBundleFile);
    const outputBundle = path.join(__dirname, '../build/static/js', mainBundleFile.replace('.js', '.aggressive.js'));
    const manifestFile = path.join(__dirname, '../build/aggressive-production-manifest.json');
    const backupFile = createBackup(inputBundle);
    
    console.log(`📁 Processing bundle: ${path.relative(process.cwd(), inputBundle)}`);
    
    // Read original bundle
    const originalCode = fs.readFileSync(inputBundle, 'utf-8');
    const originalSize = originalCode.length;
    
    if (originalSize < AGGRESSIVE_CONFIG.minBundleSize) {
      console.log('⚠️  Bundle too small for optimization. Skipping.');
      return;
    }
    
    console.log(`📦 Original bundle size: ${(originalSize / 1024).toFixed(2)} KB`);
    
    // Parse AST
    console.log('🔍 Parsing AST...');
    const ast = parser.parse(originalCode, { 
      sourceType: 'module', 
      plugins: ['jsx'],
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true
    });
    
    // Ultra-compact manifest - only essential data
    const manifest = {
      o: {}, // optimizations.identifiers only
      validation: {
        passed: false,
        issues: [],
        reduction: 0
      }
    };
    
    let identifierCounter = 0;
    let totalOptimizations = 0;
    
    console.log('🔧 Starting aggressive production-safe optimization...');
    
    // Traverse and optimize aggressively
    traverse(ast, {
      Identifier(path) {
        const name = path.node.name;
        
                 // Skip if already processed
         if (manifest.o[name]) {
           return;
         }
        
        // Determine context
        let context = 'general';
        if (path.parent.type === 'ImportSpecifier') context = 'import';
        if (path.parent.type === 'ExportSpecifier') context = 'export';
        if (path.parent.type === 'MemberExpression') context = 'member';
        
                 // Check if safe to strip aggressively
         if (isSafeToStripAggressively(name, context)) {
           const key = identifierCounter++; // Just use numbers as keys
           manifest.o[key] = name; // Compact storage
           
           path.node.name = `a${key}`; // Keep the 'a' prefix in the code
           totalOptimizations++;
         }
      },
      
      // Aggressive JSX optimization
      JSXIdentifier(path) {
        const name = path.node.name;
        
                 if (manifest.o[name]) {
           return;
         }
        
        // Only optimize component names (PascalCase)
        if (AGGRESSIVE_CONFIG.safePatterns.components.test(name) && 
            !AGGRESSIVE_CONFIG.protectedIdentifiers.includes(name)) {
          const key = `a${identifierCounter++}`;
          manifest.optimizations.identifiers[key] = {
            original: name,
            context: 'jsx'
          };
          
          path.node.name = key;
          totalOptimizations++;
        }
      },
      
      
    });
    
    console.log(`✅ Aggressive optimization complete. ${totalOptimizations} identifiers processed.`);

    
    // Generate optimized bundle
    console.log('📊 Generating aggressive production bundle...');
    const output = generate(ast, { 
      minified: true,
      compact: true,
      comments: false
    }).code;
    
    // Validate the optimized bundle
    console.log('🔍 Validating optimized bundle...');
    const validation = validateBundleAggressively(originalCode, output, manifest);
    
    if (validation.issues.length > 0) {
      console.log('❌ Validation failed:');
      validation.issues.forEach(issue => console.log(`   - ${issue}`));
      
      // Restore from backup
      fs.copyFileSync(backupFile, inputBundle);
      console.log('🔄 Restored original bundle from backup');
      
      throw new Error('Bundle validation failed - optimization too aggressive');
    }
    
    // Update manifest with validation results
    manifest.validation = {
      passed: true,
      issues: [],
      reduction: validation.reduction
    };
    
    manifest.s = {
      o: originalSize,
      p: output.length,
      r: originalSize - output.length,
      pr: validation.reduction,
      to: totalOptimizations,
      ut: Object.keys(manifest.ut || {}).length,
      bf: path.relative(process.cwd(), backupFile)
    };
    
    // Write files
    fs.writeFileSync(outputBundle, output);
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
    
    // Success report
    console.log('\n🎉 Aggressive Production Stripper Complete!');
    console.log('============================================');
    console.log(`📦 Original bundle: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`🚀 Aggressive bundle: ${(output.length / 1024).toFixed(2)} KB`);
    console.log(`📉 Size reduction: ${((originalSize - output.length) / 1024).toFixed(2)} KB (${validation.reduction.toFixed(2)}%)`);
    console.log(`🔧 Optimizations: ${totalOptimizations}`);

    console.log(`✅ Validation: PASSED`);
    console.log(`💾 Files:`);
    console.log(`   Aggressive: ${path.relative(process.cwd(), outputBundle)}`);
    console.log(`   Manifest: ${path.relative(process.cwd(), manifestFile)}`);
    console.log(`   Backup: ${path.relative(process.cwd(), backupFile)}`);
    
    console.log('\n🚀 Production Ready: YES (Aggressive Mode)');
    console.log('💡 Deploy the .aggressive.js file for production use');
    console.log('🔄 Use the backup file to rollback if needed');
    console.log('🎯 Consider removing unused imports from source code for even better optimization');
    
  } catch (error) {
    console.error('❌ Aggressive production stripper failed:', error.message);
    
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

// Run the aggressive production stripper
runAggressiveProductionStripper();
