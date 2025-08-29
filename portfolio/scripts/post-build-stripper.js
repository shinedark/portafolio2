// scripts/post-build-stripper.js
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
const outputBundle = path.join(jsDir, mainBundleFile.replace('.js', '.stripped.js'));
const manifestFile = path.join(__dirname, '../build/bundle-manifest.json');
const manifest = {};
let counter = 0;

// Target specific identifiers (e.g., React components, hooks) for stripping
const targetIdentifiers = [
  'Component', // Generic React components
  'use', // Hooks (e.g., useState, useEffect)
  'Query', // @tanstack/react-query
  'Router', // react-router-dom
  'ethers', // ethers.js
  'THREE', // three.js
  'Web3', // Web3 related
  'Provider', // Context providers
  'Context', // React contexts
  'Hook', // Custom hooks
  'Manager', // Manager components
  'Form', // Form components
  'List', // List components
  'Grid', // Grid components
  'Calculator', // Calculator components
  'Navigation', // Navigation components
  'Route', // Route components
  'Admin', // Admin components
  'Auth', // Authentication components
  'Protected', // Protected route components
];

try {
  console.log('Reading bundle file...');
  const code = fs.readFileSync(inputBundle, 'utf-8');
  console.log(`Bundle size: ${(code.length / 1024).toFixed(2)} KB`);
  
  console.log('Parsing AST...');
  const ast = parser.parse(code, { 
    sourceType: 'module', 
    plugins: ['jsx'],
    allowImportExportEverywhere: true,
    allowReturnOutsideFunction: true
  });

  console.log('Traversing AST and stripping identifiers...');
  traverse(ast, {
    Identifier(path) {
      const name = path.node.name;
      
      // Skip if already processed or if it's a very short name
      if (name.length <= 2 || manifest[name]) {
        return;
      }
      
      // Replace identifiers that match target patterns or are likely component/hook names
      if (
        path.parent.type === 'MemberExpression' ||
        path.parent.type === 'FunctionDeclaration' ||
        path.parent.type === 'VariableDeclarator' ||
        path.parent.type === 'FunctionExpression' ||
        path.parent.type === 'ArrowFunctionExpression' ||
        path.parent.type === 'ClassDeclaration' ||
        path.parent.type === 'ClassExpression'
      ) {
        const shouldStrip = targetIdentifiers.some((prefix) =>
          name.startsWith(prefix) || 
          /^[A-Z][a-zA-Z0-9]+$/.test(name) || // PascalCase for components
          /^use[A-Z][a-zA-Z0-9]*$/.test(name) // use* pattern for hooks
        );
        
        if (shouldStrip && !manifest[`a${counter}`]) {
          manifest[`a${counter}`] = name;
          path.node.name = `a${counter++}`;
        }
      }
    },
    
    // Also handle JSX identifiers
    JSXIdentifier(path) {
      const name = path.node.name;
      
      if (name.length <= 2 || manifest[name]) {
        return;
      }
      
      // Check if it's a component name (PascalCase)
      if (/^[A-Z][a-zA-Z0-9]+$/.test(name) && !manifest[`a${counter}`]) {
        manifest[`a${counter}`] = name;
        path.node.name = `a${counter++}`;
      }
    }
  });

  console.log('Generating stripped bundle...');
  const output = generate(ast, { 
    minified: true,
    compact: true,
    comments: false
  }).code;
  
  // Ensure output directory exists
  const outputDir = path.dirname(outputBundle);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  fs.writeFileSync(outputBundle, output);
  fs.writeFileSync(manifestFile, JSON.stringify(manifest, null, 2));
  
  console.log('Post-build semantic stripping complete!');
  console.log(`Original bundle: ${(code.length / 1024).toFixed(2)} KB`);
  console.log(`Stripped bundle: ${(output.length / 1024).toFixed(2)} KB`);
  console.log(`Size reduction: ${(((code.length - output.length) / code.length) * 100).toFixed(2)}%`);
  console.log(`Identifiers stripped: ${Object.keys(manifest).length}`);
  console.log(`Manifest saved to: ${manifestFile}`);
  console.log(`Stripped bundle saved to: ${outputBundle}`);
  
} catch (error) {
  console.error('Error during stripping:', error);
  process.exit(1);
}
