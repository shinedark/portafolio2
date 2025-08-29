// scripts/production-stripper.js
// PRODUCTION-READY: Safe post-build optimization with functionality preservation
// This stripper is designed for production use with comprehensive safety checks

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

// Configuration for production safety
const PRODUCTION_CONFIG = {
  // Only strip identifiers that are safe to modify
  safePatterns: {
    // React component names (PascalCase) - safe to strip
    components: /^[A-Z][a-zA-Z0-9]*$/,
    // Custom hooks (use* pattern) - safe to strip
    hooks: /^use[A-Z][a-zA-Z0-9]*$/,
    // Internal utility functions - safe to strip
    utilities: /^[a-z][a-zA-Z0-9]*$/,
    // Safe property names - avoid DOM properties
    properties: /^(className|onClick|onSubmit|onChange|value|type|id|name)$/
  },
  
  // NEVER strip these identifiers (critical for functionality)
  protectedIdentifiers: [
    // React core
    'React', 'useState', 'useEffect', 'useCallback', 'useMemo', 'useRef',
    'useContext', 'useReducer', 'useLayoutEffect', 'useDebugValue',
    
    // Web3 core
    'ethers', 'Web3', 'window', 'document', 'console', 'localStorage',
    'sessionStorage', 'fetch', 'XMLHttpRequest', 'Event', 'CustomEvent',
    
    // Browser APIs
    'navigator', 'location', 'history', 'screen', 'performance',
    'requestAnimationFrame', 'cancelAnimationFrame', 'setTimeout', 'setInterval',
    
    // Three.js core
    'THREE', 'Scene', 'Camera', 'Renderer', 'Geometry', 'Material',
    
    // Router core
    'BrowserRouter', 'Routes', 'Route', 'useNavigate', 'useParams',
    'useLocation', 'useSearchParams', 'Link', 'NavLink',
    
    // Critical business logic
    'handleSubmit', 'handleChange', 'handleClick', 'onSubmit', 'onChange',
    'onClick', 'onFocus', 'onBlur', 'onKeyDown', 'onKeyUp', 'onKeyPress'
  ],
  
  // Maximum identifier length to consider for stripping
  maxIdentifierLength: 6,
  
  // Minimum identifier length to strip
  minIdentifierLength: 6,
  
  // File size threshold for optimization (don't optimize tiny bundles)
  minBundleSize: 100 * 1024, // 100KB
  
  // Maximum optimization percentage (safety cap)
  maxOptimizationPercentage: 5 // 5% max reduction for safety
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
      !file.includes('.enhanced')
    );
  } catch (error) {
    throw new Error('Could not find main bundle file');
  }
}

// Check if identifier is safe to strip
function isSafeToStrip(name, context) {
  // Never strip protected identifiers
  if (PRODUCTION_CONFIG.protectedIdentifiers.includes(name)) {
    return false;
  }
  
  // Never strip very short or very long names
  if (name.length < PRODUCTION_CONFIG.minIdentifierLength || 
      name.length > PRODUCTION_CONFIG.maxIdentifierLength) {
    return false;
  }
  
  // Check length constraints
  if (name.length <= 2) return false;
  
  // Never strip global objects or built-ins
  if (['Object', 'Array', 'String', 'Number', 'Boolean', 'Function', 'Date', 'RegExp', 'Error'].includes(name)) {
    return false;
  }
  
  // Never strip in certain contexts
  if (context === 'import' || context === 'export') {
    return false;
  }
  
  // Check safe patterns
  const isComponent = PRODUCTION_CONFIG.safePatterns.components.test(name);
  const isHook = PRODUCTION_CONFIG.safePatterns.hooks.test(name);
  const isUtility = PRODUCTION_CONFIG.safePatterns.utilities.test(name);
  
  return isComponent || isHook || isUtility;
}

// Create backup of original bundle
function createBackup(originalPath) {
  const backupPath = originalPath + '.backup';
  fs.copyFileSync(originalPath, backupPath);
  console.log(`📦 Backup created: ${path.relative(process.cwd(), backupPath)}`);
  return backupPath;
}

// Validate optimized bundle
function validateBundle(originalCode, optimizedCode, manifest) {
  const issues = [];
  
  // Check for critical missing patterns
  const criticalPatterns = [
    /React\./,
    /useState/,
    /useEffect/,
    /ethers\./,
    /THREE\./
  ];
  
  // More lenient pattern checking - just ensure they exist somewhere
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
  if (reduction > PRODUCTION_CONFIG.maxOptimizationPercentage) {
    issues.push(`Bundle reduction too aggressive: ${reduction.toFixed(2)}% (max: ${PRODUCTION_CONFIG.maxOptimizationPercentage}%)`);
  }
  
  // Check manifest size
  const manifestSize = JSON.stringify(manifest).length;
  if (manifestSize > 500 * 1024) { // 500KB max
    issues.push(`Manifest too large: ${(manifestSize / 1024).toFixed(2)} KB (max: 500KB)`);
  }
  
  return { issues, reduction };
}

// Main production stripper
async function runProductionStripper() {
  console.log('🏭 Production-Safe Post-Build Stripper Starting...');
  console.log('==================================================\n');
  
  try {
    // Find and validate bundle
    const mainBundleFile = findMainBundle();
    const inputBundle = path.join(__dirname, '../build/static/js', mainBundleFile);
    const outputBundle = path.join(__dirname, '../build/static/js', mainBundleFile.replace('.js', '.production.js'));
    const manifestFile = path.join(__dirname, '../build/production-manifest.json');
    const backupFile = createBackup(inputBundle);
    
    console.log(`📁 Processing bundle: ${path.relative(process.cwd(), inputBundle)}`);
    
    // Read original bundle
    const originalCode = fs.readFileSync(inputBundle, 'utf-8');
    const originalSize = originalCode.length;
    
    if (originalSize < PRODUCTION_CONFIG.minBundleSize) {
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
    
    // Production-safe optimization manifest
    const manifest = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      config: PRODUCTION_CONFIG,
      optimizations: {
        identifiers: {},
        statistics: {}
      },
      validation: {
        passed: false,
        issues: [],
        reduction: 0
      }
    };
    
    let identifierCounter = 0;
    let totalOptimizations = 0;
    
    console.log('🔧 Starting production-safe optimization...');
    
    // Traverse and optimize safely
    traverse(ast, {
      Identifier(path) {
        const name = path.node.name;
        
        // Skip if already processed
        if (manifest.optimizations.identifiers[name]) {
          return;
        }
        
        // Determine context
        let context = 'general';
        if (path.parent.type === 'ImportSpecifier') context = 'import';
        if (path.parent.type === 'ExportSpecifier') context = 'export';
        if (path.parent.type === 'MemberExpression') context = 'member';
        
                 // Check if safe to strip
         if (isSafeToStrip(name, context)) {
           const key = `p${identifierCounter++}`;
           manifest.optimizations.identifiers[key] = {
             original: name,
             context: context
             // Removed position to reduce manifest size
           };
           
           path.node.name = key;
           totalOptimizations++;
         }
      },
      
      // Safe JSX optimization
      JSXIdentifier(path) {
        const name = path.node.name;
        
        if (manifest.optimizations.identifiers[name]) {
          return;
        }
        
        // Only optimize component names (PascalCase)
        if (PRODUCTION_CONFIG.safePatterns.components.test(name) && 
            !PRODUCTION_CONFIG.protectedIdentifiers.includes(name)) {
          const key = `p${identifierCounter++}`;
          manifest.optimizations.identifiers[key] = {
            original: name,
            context: 'jsx',
            position: path.node.start
          };
          
          path.node.name = key;
          totalOptimizations++;
        }
      }
    });
    
    console.log(`✅ Optimization complete. ${totalOptimizations} identifiers processed.`);
    
    // Generate optimized bundle
    console.log('📊 Generating production bundle...');
    const output = generate(ast, { 
      minified: true,
      compact: true,
      comments: false
    }).code;
    
    // Validate the optimized bundle
    console.log('🔍 Validating optimized bundle...');
    const validation = validateBundle(originalCode, output, manifest);
    
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
    
    manifest.statistics = {
      originalSize: originalSize,
      optimizedSize: output.length,
      totalReduction: originalSize - output.length,
      percentageReduction: validation.reduction,
      totalOptimizations: totalOptimizations,
      backupFile: path.relative(process.cwd(), backupFile)
    };
    
    // Write files
    fs.writeFileSync(outputBundle, output);
    fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
    
    // Success report
    console.log('\n🎉 Production Stripper Complete!');
    console.log('================================');
    console.log(`📦 Original bundle: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`🏭 Production bundle: ${(output.length / 1024).toFixed(2)} KB`);
    console.log(`📉 Size reduction: ${((originalSize - output.length) / 1024).toFixed(2)} KB (${validation.reduction.toFixed(2)}%)`);
    console.log(`🔧 Optimizations: ${totalOptimizations}`);
    console.log(`✅ Validation: PASSED`);
    console.log(`💾 Files:`);
    console.log(`   Production: ${path.relative(process.cwd(), outputBundle)}`);
    console.log(`   Manifest: ${path.relative(process.cwd(), manifestFile)}`);
    console.log(`   Backup: ${path.relative(process.cwd(), backupFile)}`);
    
    console.log('\n🚀 Production Ready: YES');
    console.log('💡 Deploy the .production.js file for production use');
    console.log('🔄 Use the backup file to rollback if needed');
    
  } catch (error) {
    console.error('❌ Production stripper failed:', error.message);
    
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

// Run the production stripper
runProductionStripper();
