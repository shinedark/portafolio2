// scripts/enhanced-post-build-stripper.js
// ADVANCED: Comprehensive bundle optimization with semantic stripping, string optimization, and memory efficiency
// WARNING: This is a proof-of-concept for bundle size optimization. Not for production without thorough testing.

const fs = require('fs');
const path = require('path');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

// Find the main bundle file (it has a hash in the name)
const jsDir = path.join(__dirname, '../build/static/js');
const jsFiles = fs.readdirSync(jsDir);
const mainBundleFile = jsFiles.find(file => file.startsWith('main.') && file.endsWith('.js') && !file.includes('.map'));

if (!mainBundleFile) {
  throw new Error('Could not find main bundle file in build/static/js/');
}

const inputBundle = path.join(jsDir, mainBundleFile);
const outputBundle = path.join(jsDir, mainBundleFile.replace('.js', '.enhanced.js'));
const manifestFile = path.join(__dirname, '../build/enhanced-bundle-manifest.json');

// Comprehensive optimization manifest
const manifest = {
  identifiers: {},      // Function names, variables, etc.
  strings: {},          // String literals
  numbers: {},          // Numeric literals
  properties: {},       // Object property names
  imports: {},          // Import/export names
  jsxElements: {},      // JSX element names
  comments: [],         // Stripped comments for analysis
  statistics: {}        // Optimization statistics
};

let identifierCounter = 0;
let stringCounter = 0;
let numberCounter = 0;
let propertyCounter = 0;
let importCounter = 0;
let jsxCounter = 0;

// String optimization: Replace long strings with short identifiers
function optimizeString(str) {
  if (str.length <= 3) return str; // Don't optimize very short strings
  
  const key = `s${stringCounter++}`;
  manifest.strings[key] = str;
  return key;
}

// Number optimization: Replace large numbers with smaller representations
function optimizeNumber(num) {
  if (num === 0 || num === 1 || num === -1) return num; // Keep common numbers
  
  const key = `n${numberCounter++}`;
  manifest.numbers[key] = num;
  return key;
}

// Property name optimization: Shorten object property names
function optimizeProperty(prop) {
  if (prop.length <= 2) return prop; // Don't optimize very short properties
  
  const key = `p${propertyCounter++}`;
  manifest.properties[key] = prop;
  return key;
}

// Import/export optimization: Shorten import/export names
function optimizeImport(name) {
  if (name.length <= 2) return name;
  
  const key = `i${importCounter++}`;
  manifest.imports[key] = name;
  return key;
}

try {
  console.log('🚀 Enhanced Post-Build Stripper Starting...');
  console.log('Reading bundle file...');
  
  const code = fs.readFileSync(inputBundle, 'utf-8');
  const originalSize = code.length;
  console.log(`Bundle size: ${(originalSize / 1024).toFixed(2)} KB`);
  
  console.log('Parsing AST with comprehensive plugins...');
  const ast = parser.parse(code, { 
    sourceType: 'module', 
    plugins: ['jsx', 'typescript', 'decorators-legacy'],
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true,
    allowAwaitOutsideFunction: true,
    allowSuperOutsideMethod: true
  });

  console.log('🔧 Starting comprehensive optimization...');
  
  traverse(ast, {
    // 1. IDENTIFIER OPTIMIZATION
    Identifier(path) {
      const name = path.node.name;
      
      // Skip if already processed or if it's a very short name
      if (name.length <= 2 || manifest.identifiers[name]) {
        return;
      }
      
      // Optimize identifiers that match patterns
      if (
        path.parent.type === 'MemberExpression' ||
        path.parent.type === 'FunctionDeclaration' ||
        path.parent.type === 'VariableDeclarator' ||
        path.parent.type === 'FunctionExpression' ||
        path.parent.type === 'ArrowFunctionExpression' ||
        path.parent.type === 'ClassDeclaration' ||
        path.parent.type === 'ClassExpression' ||
        path.parent.type === 'Parameter' ||
        path.parent.type === 'CatchClause'
      ) {
        // Check if it's a component, hook, or other optimizable identifier
        const shouldOptimize = 
          /^[A-Z][a-zA-Z0-9]+$/.test(name) || // PascalCase components
          /^use[A-Z][a-zA-Z0-9]*$/.test(name) || // React hooks
          /^[a-z][a-zA-Z0-9]*$/.test(name) && name.length > 4; // camelCase variables
        
        if (shouldOptimize) {
          const key = `a${identifierCounter++}`;
          manifest.identifiers[key] = name;
          path.node.name = key;
        }
      }
    },
    
    // 2. STRING LITERAL OPTIMIZATION
    StringLiteral(path) {
      const value = path.node.value;
      
      // Optimize strings longer than 3 characters
      if (value.length > 3 && !manifest.strings[value]) {
        const optimized = optimizeString(value);
        if (optimized !== value) {
          path.node.value = optimized;
        }
      }
    },
    
    // 3. NUMERIC LITERAL OPTIMIZATION
    NumericLiteral(path) {
      const value = path.node.value;
      
      // Optimize large numbers
      if (Math.abs(value) > 1000 || (value !== 0 && value !== 1 && value !== -1)) {
        const optimized = optimizeNumber(value);
        if (optimized !== value) {
          path.node.value = optimized;
        }
      }
    },
    
    // 4. OBJECT PROPERTY OPTIMIZATION
    ObjectProperty(path) {
      if (path.node.key.type === 'Identifier') {
        const propName = path.node.key.name;
        const optimized = optimizeProperty(propName);
        if (optimized !== propName) {
          path.node.key.name = optimized;
        }
      }
    },
    
    // 5. IMPORT/EXPORT OPTIMIZATION
    ImportSpecifier(path) {
      if (path.node.imported && path.node.imported.name) {
        const importName = path.node.imported.name;
        const optimized = optimizeImport(importName);
        if (optimized !== importName) {
          path.node.imported.name = optimized;
        }
      }
    },
    
    ExportSpecifier(path) {
      if (path.node.exported && path.node.exported.name) {
        const exportName = path.node.exported.name;
        const optimized = optimizeImport(exportName);
        if (optimized !== exportName) {
          path.node.exported.name = optimized;
        }
      }
    },
    
    // 6. JSX OPTIMIZATION
    JSXIdentifier(path) {
      const name = path.node.name;
      
      if (name.length <= 2 || manifest.jsxElements[name]) {
        return;
      }
      
      // Optimize JSX element names
      if (/^[A-Z][a-zA-Z0-9]+$/.test(name)) {
        const key = `j${jsxCounter++}`;
        manifest.jsxElements[key] = name;
        path.node.name = key;
      }
    },
    
    // 7. TEMPLATE LITERAL OPTIMIZATION
    TemplateLiteral(path) {
      path.node.quasis.forEach(quasi => {
        if (quasi.value.raw.length > 3) {
          const optimized = optimizeString(quasi.value.raw);
          if (optimized !== quasi.value.raw) {
            quasi.value.raw = optimized;
            quasi.value.cooked = optimized;
          }
        }
      });
    },
    
    // 8. REGEX OPTIMIZATION (convert to string if possible)
    RegExpLiteral(path) {
      const pattern = path.node.pattern;
      if (pattern.length > 5 && !pattern.includes('\\')) {
        // Convert simple regex to string if it's just a literal
        const optimized = optimizeString(pattern);
        if (optimized !== pattern) {
          // Replace with StringLiteral
          path.replaceWith({
            type: 'StringLiteral',
            value: optimized
          });
        }
      }
    }
  });

  console.log('📊 Generating optimized bundle...');
  
  const output = generate(ast, { 
    minified: true,
    compact: true,
    comments: false,
    retainLines: false,
    concise: true
  }).code;
  
  // Calculate statistics
  const optimizedSize = output.length;
  const totalReduction = originalSize - optimizedSize;
  const percentageReduction = ((totalReduction / originalSize) * 100);
  
  manifest.statistics = {
    originalSize: originalSize,
    optimizedSize: optimizedSize,
    totalReduction: totalReduction,
    percentageReduction: percentageReduction,
    identifiersOptimized: Object.keys(manifest.identifiers).length,
    stringsOptimized: Object.keys(manifest.strings).length,
    numbersOptimized: Object.keys(manifest.numbers).length,
    propertiesOptimized: Object.keys(manifest.properties).length,
    importsOptimized: Object.keys(manifest.imports).length,
    jsxElementsOptimized: Object.keys(manifest.jsxElements).length,
    totalOptimizations: Object.keys(manifest.identifiers).length + 
                       Object.keys(manifest.strings).length + 
                       Object.keys(manifest.numbers).length + 
                       Object.keys(manifest.properties).length + 
                       Object.keys(manifest.imports).length + 
                       Object.keys(manifest.jsxElements).length
  };
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputBundle);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // Write optimized bundle and manifest
  fs.writeFileSync(outputBundle, output);
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
  
  console.log('\n🎉 Enhanced Post-Build Optimization Complete!');
  console.log('=============================================');
  console.log(`📦 Original bundle: ${(originalSize / 1024).toFixed(2)} KB`);
  console.log(`🔧 Optimized bundle: ${(optimizedSize / 1024).toFixed(2)} KB`);
  console.log(`📉 Total reduction: ${(totalReduction / 1024).toFixed(2)} KB (${percentageReduction.toFixed(2)}%)`);
  console.log('\n📊 Optimization Breakdown:');
  console.log(`   🏷️  Identifiers: ${manifest.statistics.identifiersOptimized}`);
  console.log(`   📝 Strings: ${manifest.statistics.stringsOptimized}`);
  console.log(`   🔢 Numbers: ${manifest.statistics.numbersOptimized}`);
  console.log(`   🏗️  Properties: ${manifest.statistics.propertiesOptimized}`);
  console.log(`   📤 Imports/Exports: ${manifest.statistics.importsOptimized}`);
  console.log(`   ⚛️  JSX Elements: ${manifest.statistics.jsxElementsOptimized}`);
  console.log(`   📈 Total: ${manifest.statistics.totalOptimizations}`);
  console.log(`\n💾 Files saved:`);
  console.log(`   Bundle: ${path.relative(process.cwd(), outputBundle)}`);
  console.log(`   Manifest: ${path.relative(process.cwd(), manifestFile)}`);
  
} catch (error) {
  console.error('❌ Error during enhanced optimization:', error);
  process.exit(1);
}
