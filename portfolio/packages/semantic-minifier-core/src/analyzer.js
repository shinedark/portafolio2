const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

/**
 * Parse source code into AST
 */
function parseCode(code, filePath) {
  const plugins = ['jsx', 'typescript'];
  
  // Add React-specific plugins for .jsx files
  if (filePath.endsWith('.jsx') || filePath.endsWith('.tsx')) {
    plugins.push('react');
  }
  
  try {
    return parser.parse(code, {
      sourceType: 'module',
      plugins,
      allowImportExportEverywhere: true,
      allowReturnOutsideFunction: true
    });
  } catch (error) {
    throw new Error(`Failed to parse ${filePath}: ${error.message}`);
  }
}

/**
 * Analyze identifiers and determine what's safe to optimize
 */
function analyzeIdentifiers(ast, options) {
  const analysis = {
    identifiers: new Map(),
    strings: new Map(),
    numbers: new Map(),
    exports: new Set(),
    imports: new Set(),
    reactComponents: new Set(),
    hooks: new Set(),
    totalOptimizations: 0
  };

  // First pass: collect exports, imports, and React components
  traverse(ast, {
    ExportNamedDeclaration(path) {
      if (path.node.declaration && path.node.declaration.declarations) {
        path.node.declaration.declarations.forEach(decl => {
          if (decl.id && decl.id.name) {
            analysis.exports.add(decl.id.name);
          }
        });
      }
      if (path.node.specifiers) {
        path.node.specifiers.forEach(spec => {
          if (spec.exported && spec.exported.name) {
            analysis.exports.add(spec.exported.name);
          }
        });
      }
    },
    
    ExportDefaultDeclaration(path) {
      if (path.node.declaration && path.node.declaration.name) {
        analysis.exports.add(path.node.declaration.name);
      }
    },
    
    ImportDeclaration(path) {
      path.node.specifiers.forEach(spec => {
        if (spec.local && spec.local.name) {
          analysis.imports.add(spec.local.name);
        }
      });
    },
    
    FunctionDeclaration(path) {
      if (path.node.id && path.node.id.name) {
        const name = path.node.id.name;
        // Check if it's a React component (PascalCase)
        if (/^[A-Z][a-zA-Z0-9]*$/.test(name) && !analysis.exports.has(name)) {
          analysis.reactComponents.add(name);
        }
      }
    },
    
    VariableDeclarator(path) {
      if (path.node.id && path.node.id.name) {
        const name = path.node.id.name;
        // Check if it's a React component (PascalCase)
        if (/^[A-Z][a-zA-Z0-9]*$/.test(name) && !analysis.exports.has(name)) {
          analysis.reactComponents.add(name);
        }
        // Check if it's a hook (starts with 'use')
        if (name.startsWith('use') && !analysis.exports.has(name)) {
          analysis.hooks.add(name);
        }
      }
    }
  });

  // Second pass: analyze identifiers for optimization
  traverse(ast, {
    Identifier(path) {
      const name = path.node.name;
      
      // Skip if it's an export, import, or critical pattern
      if (analysis.exports.has(name) || 
          analysis.imports.has(name) ||
          options.safety.preserveCriticalPatterns.includes(name)) {
        return;
      }
      
      // Check if it's safe to optimize
      if (isSafeToOptimize(path, analysis, options)) {
        const category = categorizeIdentifier(path, analysis);
        if (category) {
          analysis.identifiers.set(name, {
            category,
            path,
            safe: true,
            usage: 1
          });
        }
      }
    },
    
    StringLiteral(path) {
      if (options.stringOptimization.enabled && 
          path.node.value.length >= options.stringOptimization.minLength) {
        const value = path.node.value;
        if (!analysis.strings.has(value)) {
          analysis.strings.set(value, { count: 1, paths: [path] });
        } else {
          analysis.strings.get(value).count++;
          analysis.strings.get(value).paths.push(path);
        }
      }
    },
    
    NumericLiteral(path) {
      if (options.numberOptimization.enabled && 
          Math.abs(path.node.value) >= options.numberOptimization.minValue) {
        const value = path.node.value;
        if (!analysis.numbers.has(value)) {
          analysis.numbers.set(value, { count: 1, paths: [path] });
        } else {
          analysis.numbers.get(value).count++;
          analysis.numbers.get(value).paths.push(path);
        }
      }
    }
  });

  // Count total optimizations
  analysis.totalOptimizations = 
    analysis.identifiers.size + 
    analysis.strings.size + 
    analysis.numbers.size;

  return analysis;
}

/**
 * Check if an identifier is safe to optimize
 */
function isSafeToOptimize(path, analysis, options) {
  const name = path.node.name;
  
  // Never optimize exports or imports
  if (analysis.exports.has(name) || analysis.imports.has(name)) {
    return false;
  }
  
  // Never optimize critical patterns
  if (options.safety.preserveCriticalPatterns.includes(name)) {
    return false;
  }
  
  // Never optimize React component names if preservation is enabled
  if (options.identifierOptimization.preserveReactComponents && 
      analysis.reactComponents.has(name)) {
    return false;
  }
  
  // Never optimize hook names if preservation is enabled
  if (options.identifierOptimization.preserveHookNames && 
      analysis.hooks.has(name)) {
    return false;
  }
  
  // Check parent context for safety
  const parent = path.parent;
  
  // Don't optimize object property keys
  if (parent.type === 'ObjectProperty' && parent.key === path.node) {
    return false;
  }
  
  // Don't optimize class method names
  if (parent.type === 'ClassMethod' && parent.key === path.node) {
    return false;
  }
  
  // Don't optimize function parameter names in certain contexts
  if (parent.type === 'FunctionParameter' && 
      (path.parentPath.parent.type === 'ArrowFunctionExpression' ||
       path.parentPath.parent.type === 'FunctionExpression')) {
    return false;
  }
  
  return true;
}

/**
 * Categorize identifier for optimal naming
 */
function categorizeIdentifier(path, analysis) {
  const name = path.node.name;
  
  if (analysis.reactComponents.has(name)) {
    return 'component';
  }
  
  if (analysis.hooks.has(name)) {
    return 'hook';
  }
  
  if (path.parent.type === 'FunctionDeclaration' || 
      path.parent.type === 'FunctionExpression' ||
      path.parent.type === 'ArrowFunctionExpression') {
    return 'function';
  }
  
  if (path.parent.type === 'VariableDeclarator') {
    return 'variable';
  }
  
  if (path.parent.type === 'FunctionParameter') {
    return 'parameter';
  }
  
  return 'identifier';
}

/**
 * Perform the actual code optimization
 */
function optimizeCode(ast, analysis, options) {
  let identifierCounter = 0;
  let stringCounter = 0;
  let numberCounter = 0;
  
  // Create hoisted variables for strings and numbers
  const hoistedVariables = [];
  
  // Optimize strings
  if (options.stringOptimization.enabled) {
    for (const [value, data] of analysis.strings) {
      if (data.count >= options.stringOptimization.hoistThreshold) {
        const varName = `s${stringCounter++}`;
        hoistedVariables.push(
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(varName),
              t.stringLiteral(value)
            )
          ])
        );
        
        // Replace all occurrences
        data.paths.forEach(path => {
          path.replaceWith(t.identifier(varName));
        });
      }
    }
  }
  
  // Optimize numbers
  if (options.numberOptimization.enabled) {
    for (const [value, data] of analysis.numbers) {
      if (data.count >= options.numberOptimization.hoistThreshold) {
        const varName = `n${numberCounter++}`;
        hoistedVariables.push(
          t.variableDeclaration('const', [
            t.variableDeclarator(
              t.identifier(varName),
              t.numericLiteral(value)
            )
          ])
        );
        
        // Replace all occurrences
        data.paths.forEach(path => {
          path.replaceWith(t.identifier(varName));
        });
      }
    }
  }
  
  // Optimize identifiers
  if (options.identifierOptimization.enabled) {
    for (const [name, data] of analysis.identifiers) {
      if (data.safe) {
        const newName = generateOptimizedName(data.category, identifierCounter++);
        data.optimizedName = newName;
        
        // Replace the identifier
        data.path.replaceWith(t.identifier(newName));
      }
    }
  }
  
  // Add hoisted variables at the top of the program
  if (hoistedVariables.length > 0) {
    ast.program.body.unshift(...hoistedVariables);
  }
  
  // Generate the optimized code
  return generate(ast, {
    minified: true,
    compact: true,
    comments: false
  });
}

/**
 * Generate optimized names based on category
 */
function generateOptimizedName(category, counter) {
  const prefixes = {
    function: 'f',
    component: 'c', 
    hook: 'h',
    variable: 'v',
    parameter: 'p',
    identifier: 'a'
  };
  
  const prefix = prefixes[category] || 'a';
  return `${prefix}${counter}`;
}

/**
 * Generate manifest snippet for a file
 */
function generateManifest(analysis, filePath) {
  const manifest = {
    filePath,
    identifiers: {},
    strings: {},
    numbers: {},
    totalOptimizations: analysis.totalOptimizations
  };
  
  // Add identifier mappings
  for (const [name, data] of analysis.identifiers) {
    if (data.optimizedName) {
      manifest.identifiers[data.optimizedName] = name;
    }
  }
  
  // Add string mappings
  for (const [value, data] of analysis.strings) {
    if (data.count >= 3) { // Only include hoisted strings
      const varName = `s${Object.keys(manifest.strings).length}`;
      manifest.strings[varName] = value;
    }
  }
  
  // Add number mappings
  for (const [value, data] of analysis.numbers) {
    if (data.count >= 2) { // Only include hoisted numbers
      const varName = `n${Object.keys(manifest.numbers).length}`;
      manifest.numbers[varName] = value;
    }
  }
  
  return manifest;
}

module.exports = {
  parseCode,
  analyzeIdentifiers,
  optimizeCode,
  generateManifest
};
