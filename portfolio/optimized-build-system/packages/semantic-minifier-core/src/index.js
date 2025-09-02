const { parseCode, analyzeIdentifiers, optimizeCode, generateManifest } = require('./analyzer');
const { validateOptimization } = require('./utils');

/**
 * Enhanced Semantic Minifier Core - Professional-grade source-level optimization
 * 
 * This library implements semantic stripping by analyzing source code at the AST level
 * before bundling, ensuring semantic correctness and optimal performance.
 * 
 * Based on the best performing optimization strategies:
 * - Maximum Aggression: 14.37% reduction
 * - Enhanced Maximum Aggression: Up to 40% reduction
 * - Ultra-Deep: 9.63% reduction
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
        categorizeIdentifiers: true, // Use shorter prefixes (c, h, f, v, etc.)
        ...options.identifierOptimization
      },
      
      // String optimization settings
      stringOptimization: {
        enabled: true,
        minLength: 5, // Lower threshold for more aggressive optimization
        hoistThreshold: 2, // Hoist if used 2+ times
        maxReplacements: 2000, // Increased limit
        minOccurrences: 2, // Only optimize strings that appear multiple times
        ...options.stringOptimization
      },
      
      // Number optimization settings
      numberOptimization: {
        enabled: true,
        minValue: 100, // Lower threshold for more aggressive optimization
        hoistThreshold: 2, // Hoist if used 2+ times
        maxReplacements: 1000, // Increased limit
        minOccurrences: 2, // Only optimize numbers that appear multiple times
        ...options.numberOptimization
      },
      
      // Safety settings
      safety: {
        maxOptimizationPercentage: 40, // Increased from 25% to 40%
        maxManifestSize: 15 * 1024 * 1024, // 15MB manifest limit
        preserveCriticalPatterns: [
          'constructor',
          'prototype',
          'super',
          'this',
          'render',
          'componentDidMount',
          'componentDidUpdate',
          'componentWillUnmount',
          'useState',
          'useEffect',
          'useRef',
          'React',
          'THREE',
          'ethers',
          'window',
          'document'
        ],
        ...options.safety
      },
      
      // Performance settings
      performance: {
        useSets: true, // Use Sets for fast lookups
        combinedPatterns: true, // Combine regex patterns for performance
        batchProcessing: true, // Process in batches to avoid memory issues
        ...options.performance
      }
    };
    
    this.manifest = {
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      optimizations: {
        identifiers: {},
        strings: {},
        numbers: {},
        categories: {} // Categorized identifiers for shorter names
      },
      metadata: {
        totalFiles: 0,
        totalOptimizations: 0,
        sizeReduction: 0,
        processingTime: 0
      }
    };
    
    // Performance optimizations
    this.protectedSet = new Set(this.options.safety.preserveCriticalPatterns);
    this.skipContexts = new Set(['import', 'export', 'require', 'module', 'exports', 'global']);
  }

  /**
   * Main function to minify source code with enhanced optimization
   * @param {string} code - Source code to optimize
   * @param {string} filePath - Path to the source file
   * @param {Object} context - Additional context (imports, exports, etc.)
   * @returns {Object} { optimizedCode, manifestSnippet, stats }
   */
  minifySource(code, filePath, context = {}) {
    const startTime = Date.now();
    
    try {
      // Parse the source code into AST
      const ast = parseCode(code, filePath);
      
      // Analyze identifiers and determine what's safe to optimize
      const analysis = analyzeIdentifiers(ast, {
        ...this.options,
        context,
        filePath,
        protectedSet: this.protectedSet,
        skipContexts: this.skipContexts
      });
      
      // Perform the enhanced optimization
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
      const processingTime = Date.now() - startTime;
      const stats = {
        originalSize: code.length,
        optimizedSize: optimizedCode.length,
        reduction: ((code.length - optimizedCode.length) / code.length) * 100,
        optimizations: analysis.totalOptimizations,
        filePath,
        processingTime
      };
      
      return {
        optimizedCode,
        manifestSnippet,
        stats,
        validation
      };
      
    } catch (error) {
      throw new Error(`Enhanced semantic minification failed for ${filePath}: ${error.message}`);
    }
  }

  /**
   * Update the global manifest with file-specific optimizations
   */
  updateGlobalManifest(manifestSnippet, filePath) {
    this.manifest.metadata.totalFiles++;
    this.manifest.metadata.totalOptimizations += manifestSnippet.totalOptimizations;
    
    // Merge identifier optimizations by category
    if (manifestSnippet.categories) {
      for (const [category, identifiers] of Object.entries(manifestSnippet.categories)) {
        if (!this.manifest.optimizations.categories[category]) {
          this.manifest.optimizations.categories[category] = {};
        }
        Object.assign(this.manifest.optimizations.categories[category], identifiers);
      }
    }
    
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
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      optimizations: {
        identifiers: {},
        strings: {},
        numbers: {},
        categories: {}
      },
      metadata: {
        totalFiles: 0,
        totalOptimizations: 0,
        sizeReduction: 0,
        processingTime: 0
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
    
    if (this.options.safety.maxManifestSize > 20 * 1024 * 1024) {
      warnings.push('maxManifestSize > 20MB may cause performance issues');
    }
    
    return {
      valid: errors.length === 0,
      errors,
      warnings
    };
  }

  /**
   * Get optimization statistics
   * @returns {Object} Current optimization statistics
   */
  getStats() {
    const manifestSize = JSON.stringify(this.manifest).length;
    return {
      ...this.manifest.metadata,
      manifestSize,
      manifestSizeKB: (manifestSize / 1024).toFixed(2),
      averageProcessingTime: this.manifest.metadata.totalFiles > 0 
        ? this.manifest.metadata.processingTime / this.manifest.metadata.totalFiles 
        : 0
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
