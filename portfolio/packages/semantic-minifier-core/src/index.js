const { parseCode, analyzeIdentifiers, optimizeCode, generateManifest } = require('./analyzer');
const { validateOptimization } = require('./utils');

/**
 * Semantic Minifier Core - Professional-grade source-level optimization
 * 
 * This library implements semantic stripping by analyzing source code at the AST level
 * before bundling, ensuring semantic correctness and optimal performance.
 */
class SemanticMinifier {
  constructor(options = {}) {
    this.options = {
      // Identifier optimization settings
      identifierOptimization: {
        enabled: true,
        maxLength: 3, // a0, a1, a2...
        preserveExports: true,
        preserveImports: true,
        preserveReactComponents: true,
        preserveHookNames: true,
        ...options.identifierOptimization
      },
      
      // String optimization settings
      stringOptimization: {
        enabled: true,
        minLength: 10, // Only optimize strings longer than 10 chars
        hoistThreshold: 3, // Hoist if used 3+ times
        ...options.stringOptimization
      },
      
      // Number optimization settings
      numberOptimization: {
        enabled: true,
        minValue: 1000, // Only optimize numbers >= 1000
        hoistThreshold: 2, // Hoist if used 2+ times
        ...options.numberOptimization
      },
      
      // Safety settings
      safety: {
        maxOptimizationPercentage: 25, // Maximum 25% size reduction
        preserveCriticalPatterns: [
          'constructor',
          'prototype',
          'super',
          'this',
          'render',
          'componentDidMount',
          'componentDidUpdate',
          'componentWillUnmount'
        ],
        ...options.safety
      }
    };
    
    this.manifest = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      optimizations: {
        identifiers: {},
        strings: {},
        numbers: {}
      },
      metadata: {
        totalFiles: 0,
        totalOptimizations: 0,
        sizeReduction: 0
      }
    };
  }

  /**
   * Main function to minify source code
   * @param {string} code - Source code to optimize
   * @param {string} filePath - Path to the source file
   * @param {Object} context - Additional context (imports, exports, etc.)
   * @returns {Object} { optimizedCode, manifestSnippet, stats }
   */
  minifySource(code, filePath, context = {}) {
    try {
      // Parse the source code into AST
      const ast = parseCode(code, filePath);
      
      // Analyze identifiers and determine what's safe to optimize
      const analysis = analyzeIdentifiers(ast, {
        ...this.options,
        context,
        filePath
      });
      
      // Perform the optimization
      const optimizationResult = optimizeCode(ast, analysis, this.options);
      
      // Generate optimized code
      const { code: optimizedCode, map } = optimizationResult;
      
      // Create manifest snippet for this file
      const manifestSnippet = generateManifest(analysis, filePath);
      
      // Update global manifest
      this.updateGlobalManifest(manifestSnippet, filePath);
      
      // Validate the optimization
      const validation = validateOptimization(code, optimizedCode, this.options);
      
      // Calculate statistics
      const stats = {
        originalSize: code.length,
        optimizedSize: optimizedCode.length,
        reduction: ((code.length - optimizedCode.length) / code.length) * 100,
        optimizations: analysis.totalOptimizations,
        filePath
      };
      
      return {
        optimizedCode,
        manifestSnippet,
        stats,
        validation
      };
      
    } catch (error) {
      throw new Error(`Semantic minification failed for ${filePath}: ${error.message}`);
    }
  }

  /**
   * Update the global manifest with file-specific optimizations
   */
  updateGlobalManifest(manifestSnippet, filePath) {
    this.manifest.metadata.totalFiles++;
    this.manifest.metadata.totalOptimizations += manifestSnippet.totalOptimizations;
    
    // Merge identifier optimizations
    Object.assign(this.manifest.optimizations.identifiers, manifestSnippet.identifiers);
    
    // Merge string optimizations
    Object.assign(this.manifest.optimizations.strings, manifestSnippet.strings);
    
    // Merge number optimizations
    Object.assign(this.manifest.optimizations.numbers, manifestSnippet.numbers);
  }

  /**
   * Get the complete optimization manifest
   * @returns {Object} Complete optimization manifest
   */
  getManifest() {
    return {
      ...this.manifest,
      metadata: {
        ...this.manifest.metadata,
        timestamp: new Date().toISOString()
      }
    };
  }

  /**
   * Reset the manifest for a new optimization session
   */
  resetManifest() {
    this.manifest = {
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      optimizations: {
        identifiers: {},
        strings: {},
        numbers: {}
      },
      metadata: {
        totalFiles: 0,
        totalOptimizations: 0,
        sizeReduction: 0
      }
    };
  }

  /**
   * Validate that the minifier is configured correctly
   * @returns {Object} Validation result
   */
  validateConfiguration() {
    const errors = [];
    const warnings = [];
    
    // Check identifier optimization settings
    if (this.options.identifierOptimization.maxLength < 2) {
      errors.push('Identifier maxLength must be at least 2');
    }
    
    if (this.options.safety.maxOptimizationPercentage > 50) {
      warnings.push('maxOptimizationPercentage > 50% may cause issues');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }
}

// Export the main function and class
module.exports = {
  SemanticMinifier,
  minifySource: (code, filePath, context, options) => {
    const minifier = new SemanticMinifier(options);
    return minifier.minifySource(code, filePath, context);
  }
};
