const { SemanticMinifier } = require('semantic-minifier-core');
const path = require('path');
const fs = require('fs');

/**
 * Metro Plugin for Semantic Minification
 * 
 * This plugin hooks into Metro's transformer phase to apply semantic minification
 * to source files before they are bundled, ensuring semantic correctness.
 */
class MetroSemanticMinificationPlugin {
  constructor(options = {}) {
    this.options = {
      // File extensions to process
      extensions: ['.js', '.jsx', '.ts', '.tsx'],
      
      // Exclude patterns
      exclude: [
        /node_modules/,
        /\.test\./,
        /\.spec\./,
        /\.stories\./
      ],
      
      // Output manifest path
      manifestPath: './optimization-manifest.json',
      
      // Minifier options
      minifierOptions: {
        identifierOptimization: {
          enabled: true,
          maxLength: 3,
          preserveExports: true,
          preserveImports: true,
          preserveReactComponents: true,
          preserveHookNames: true
        },
        stringOptimization: {
          enabled: true,
          minLength: 10,
          hoistThreshold: 3
        },
        numberOptimization: {
          enabled: true,
          minValue: 1000,
          hoistThreshold: 2
        },
        safety: {
          maxOptimizationPercentage: 25,
          preserveCriticalPatterns: [
            'constructor',
            'prototype',
            'super',
            'this',
            'render',
            'componentDidMount',
            'componentDidUpdate',
            'componentWillUnmount'
          ]
        }
      },
      
      // Debug options
      debug: false,
      verbose: false,
      
      ...options
    };
    
    this.minifier = new SemanticMinifier(this.options.minifierOptions);
    this.stats = {
      totalFiles: 0,
      processedFiles: 0,
      skippedFiles: 0,
      totalOptimizations: 0,
      totalSizeReduction: 0
    };
  }

  /**
   * Metro plugin factory function
   */
  static createPlugin(options) {
    return new MetroSemanticMinificationPlugin(options);
  }

  /**
   * Apply the plugin to Metro configuration
   */
  apply(metroConfig) {
    if (!metroConfig.transformer) {
      metroConfig.transformer = {};
    }

    // Store original transformer
    const originalTransformer = metroConfig.transformer.transform;
    
    // Override the transformer
    metroConfig.transformer.transform = async (input, context) => {
      try {
        // First, apply original transformation
        let result = originalTransformer 
          ? await originalTransformer(input, context)
          : { code: input.code, map: null };
        
        // Check if we should process this file
        if (this.shouldProcessFile(input.filename, context)) {
          result = await this.processFile(input, result, context);
        }
        
        return result;
      } catch (error) {
        console.error(`Semantic minification failed for ${input.filename}:`, error);
        
        // Fallback to original result
        return originalTransformer 
          ? await originalTransformer(input, context)
          : { code: input.code, map: null };
      }
    };

    // Add cleanup on process exit
    process.on('exit', () => this.cleanup());
    process.on('SIGINT', () => this.cleanup());
    process.on('SIGTERM', () => this.cleanup());

    return metroConfig;
  }

  /**
   * Determine if a file should be processed
   */
  shouldProcessFile(filename, context) {
    // Check file extension
    const ext = path.extname(filename);
    if (!this.options.extensions.includes(ext)) {
      return false;
    }

    // Check exclude patterns
    for (const pattern of this.options.exclude) {
      if (pattern.test(filename)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Process a single file with semantic minification
   */
  async processFile(input, result, context) {
    const { filename, code } = input;
    const { code: transformedCode, map } = result;
    
    try {
      this.stats.totalFiles++;
      
      if (this.options.verbose) {
        console.log(`Processing ${filename} for semantic minification...`);
      }

      // Create context for the minifier
      const minifierContext = {
        filename,
        isModule: true,
        hasJSX: filename.endsWith('.jsx') || filename.endsWith('.tsx'),
        hasTypeScript: filename.endsWith('.ts') || filename.endsWith('.tsx')
      };

      // Apply semantic minification
      const minificationResult = this.minifier.minifySource(
        transformedCode,
        filename,
        minifierContext
      );

      // Update statistics
      this.stats.processedFiles++;
      this.stats.totalOptimizations += minificationResult.stats.optimizations;
      this.stats.totalSizeReduction += minificationResult.stats.reduction;

      if (this.options.debug) {
        console.log(`Optimized ${filename}:`, {
          originalSize: minificationResult.stats.originalSize,
          optimizedSize: minificationResult.stats.optimizedSize,
          reduction: `${minificationResult.stats.reduction.toFixed(2)}%`,
          optimizations: minificationResult.stats.optimizations
        });
      }

      // Return optimized result
      return {
        code: minificationResult.optimizedCode,
        map: map, // Preserve source map
        metadata: {
          semanticMinification: {
            applied: true,
            stats: minificationResult.stats,
            validation: minificationResult.validation
          }
        }
      };

    } catch (error) {
      this.stats.skippedFiles++;
      
      if (this.options.verbose) {
        console.warn(`Skipped semantic minification for ${filename}:`, error.message);
      }

      // Return original result if minification fails
      return result;
    }
  }

  /**
   * Get optimization statistics
   */
  getStats() {
    return {
      ...this.stats,
      averageReduction: this.stats.processedFiles > 0 
        ? (this.stats.totalSizeReduction / this.stats.processedFiles).toFixed(2)
        : 0
    };
  }

  /**
   * Get the complete optimization manifest
   */
  getManifest() {
    return this.minifier.getManifest();
  }

  /**
   * Save the optimization manifest to file
   */
  saveManifest(outputPath = null) {
    const manifestPath = outputPath || this.options.manifestPath;
    const manifest = this.getManifest();
    
    try {
      const dir = path.dirname(manifestPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));
      
      if (this.options.verbose) {
        console.log(`Optimization manifest saved to: ${manifestPath}`);
      }
      
      return true;
    } catch (error) {
      console.error('Failed to save optimization manifest:', error);
      return false;
    }
  }

  /**
   * Reset the minifier and statistics
   */
  reset() {
    this.minifier.resetManifest();
    this.stats = {
      totalFiles: 0,
      processedFiles: 0,
      skippedFiles: 0,
      totalOptimizations: 0,
      totalSizeReduction: 0
    };
  }

  /**
   * Cleanup resources
   */
  cleanup() {
    try {
      // Save final manifest
      this.saveManifest();
      
      // Log final statistics
      if (this.options.verbose) {
        const stats = this.getStats();
        console.log('\n=== Semantic Minification Summary ===');
        console.log(`Total files: ${stats.totalFiles}`);
        console.log(`Processed: ${stats.processedFiles}`);
        console.log(`Skipped: ${stats.skippedFiles}`);
        console.log(`Total optimizations: ${stats.totalOptimizations}`);
        console.log(`Average reduction: ${stats.averageReduction}%`);
        console.log('=====================================\n');
      }
    } catch (error) {
      console.error('Cleanup failed:', error);
    }
  }
}

// Export the plugin factory function
module.exports = MetroSemanticMinificationPlugin.createPlugin;

// Also export the class for advanced usage
module.exports.Plugin = MetroSemanticMinificationPlugin;
