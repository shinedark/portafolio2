const express = require('express');
const cors = require('cors');
const chalk = require('chalk');
const fs = require('fs');
const path = require('path');

/**
 * Optimization Development Tool
 * 
 * This server provides error translation services for semantic minification,
 * allowing developers to debug optimized code by translating mangled identifiers
 * back to their original names.
 */
class OptimizationDevTool {
  constructor(options = {}) {
    this.options = {
      port: process.env.PORT || 3001,
      manifestPath: './optimization-manifest.json',
      autoReload: true,
      verbose: true,
      cors: true,
      ...options
    };
    
    this.app = express();
    this.manifest = null;
    this.lastManifestCheck = 0;
    this.manifestCheckInterval = 5000; // 5 seconds
    
    this.setupMiddleware();
    this.setupRoutes();
    this.loadManifest();
  }

  /**
   * Setup Express middleware
   */
  setupMiddleware() {
    // CORS support
    if (this.options.cors) {
      this.app.use(cors());
    }
    
    // JSON parsing
    this.app.use(express.json({ limit: '10mb' }));
    
    // Request logging
    if (this.options.verbose) {
      this.app.use((req, res, next) => {
        console.log(`${chalk.blue('[' + new Date().toISOString() + ']')} ${chalk.green(req.method)} ${req.url}`);
        next();
      });
    }
  }

  /**
   * Setup API routes
   */
  setupRoutes() {
    // Health check endpoint
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        service: 'optimization-devtool',
        version: '1.0.0',
        timestamp: new Date().toISOString(),
        manifest: {
          loaded: !!this.manifest,
          lastCheck: this.lastManifestCheck,
          path: this.options.manifestPath
        }
      });
    });

    // Main error translation endpoint
    this.app.post('/translate-error', (req, res) => {
      try {
        const { stack, error, message, filename } = req.body;
        
        if (!stack && !error && !message) {
          return res.status(400).json({
            error: 'Missing required fields: stack, error, or message'
          });
        }

        const translationResult = this.translateError({
          stack,
          error,
          message,
          filename
        });

        res.json({
          success: true,
          original: { stack, error, message, filename },
          translated: translationResult,
          manifest: {
            loaded: !!this.manifest,
            timestamp: this.lastManifestCheck
          }
        });

      } catch (error) {
        res.status(500).json({
          error: 'Translation failed',
          message: error.message,
          stack: error.stack
        });
      }
    });

    // Get manifest information
    this.app.get('/manifest', (req, res) => {
      if (!this.manifest) {
        return res.status(404).json({
          error: 'Manifest not loaded',
          path: this.options.manifestPath
        });
      }

      res.json({
        manifest: this.manifest,
        metadata: {
          loaded: true,
          lastCheck: this.lastManifestCheck,
          path: this.options.manifestPath
        }
      });
    });

    // Reload manifest manually
    this.app.post('/reload-manifest', (req, res) => {
      try {
        this.loadManifest();
        res.json({
          success: true,
          message: 'Manifest reloaded successfully',
          timestamp: this.lastManifestCheck
        });
      } catch (error) {
        res.status(500).json({
          error: 'Failed to reload manifest',
          message: error.message
        });
      }
    });

    // Get optimization statistics
    this.app.get('/stats', (req, res) => {
      if (!this.manifest) {
        return res.status(404).json({
          error: 'Manifest not loaded'
        });
      }

      const stats = this.calculateStats();
      res.json({
        stats,
        manifest: {
          loaded: true,
          lastCheck: this.lastManifestCheck
        }
      });
    });

    // Search for specific identifiers
    this.app.get('/search/:identifier', (req, res) => {
      const { identifier } = req.params;
      
      if (!this.manifest) {
        return res.status(404).json({
          error: 'Manifest not loaded'
        });
      }

      const results = this.searchIdentifier(identifier);
      res.json({
        search: identifier,
        results,
        total: results.length
      });
    });

    // Error handling middleware
    this.app.use((error, req, res, next) => {
      console.error(chalk.red('Error:'), error);
      res.status(500).json({
        error: 'Internal server error',
        message: error.message
      });
    });

    // 404 handler
    this.app.use('*', (req, res) => {
      res.status(404).json({
        error: 'Endpoint not found',
        available: [
          'GET /health',
          'POST /translate-error',
          'GET /manifest',
          'POST /reload-manifest',
          'GET /stats',
          'GET /search/:identifier'
        ]
      });
    });
  }

  /**
   * Load the optimization manifest
   */
  loadManifest() {
    try {
      const manifestPath = path.resolve(this.options.manifestPath);
      
      if (!fs.existsSync(manifestPath)) {
        if (this.options.verbose) {
          console.log(chalk.yellow(`Manifest not found at: ${manifestPath}`));
        }
        this.manifest = null;
        return false;
      }

      const content = fs.readFileSync(manifestPath, 'utf-8');
      this.manifest = JSON.parse(content);
      this.lastManifestCheck = Date.now();

      if (this.options.verbose) {
        console.log(chalk.green(`✓ Manifest loaded successfully from: ${manifestPath}`));
        console.log(chalk.blue(`  - Version: ${this.manifest.version || 'unknown'}`));
        console.log(chalk.blue(`  - Total files: ${this.manifest.metadata?.totalFiles || 0}`));
        console.log(chalk.blue(`  - Total optimizations: ${this.manifest.metadata?.totalOptimizations || 0}`));
      }

      return true;
    } catch (error) {
      console.error(chalk.red('Failed to load manifest:'), error.message);
      this.manifest = null;
      return false;
    }
  }

  /**
   * Auto-reload manifest if enabled
   */
  autoReloadManifest() {
    if (!this.options.autoReload) return;

    const now = Date.now();
    if (now - this.lastManifestCheck > this.manifestCheckInterval) {
      this.loadManifest();
    }
  }

  /**
   * Translate error stack traces and messages
   */
  translateError(errorData) {
    this.autoReloadManifest();

    if (!this.manifest) {
      throw new Error('No optimization manifest loaded');
    }

    const result = {
      stack: errorData.stack,
      error: errorData.error,
      message: errorData.message,
      filename: errorData.filename,
      translations: {
        identifiers: 0,
        strings: 0,
        numbers: 0
      }
    };

    // Translate identifiers
    if (this.manifest.optimizations?.identifiers) {
      for (const [optimized, original] of Object.entries(this.manifest.optimizations.identifiers)) {
        const regex = new RegExp(`\\b${optimized}\\b`, 'g');
        
        if (result.stack) {
          const matches = (result.stack.match(regex) || []).length;
          if (matches > 0) {
            result.stack = result.stack.replace(regex, original);
            result.translations.identifiers += matches;
          }
        }
        
        if (result.error) {
          const matches = (result.error.match(regex) || []).length;
          if (matches > 0) {
            result.error = result.error.replace(regex, original);
            result.translations.identifiers += matches;
          }
        }
        
        if (result.message) {
          const matches = (result.message.match(regex) || []).length;
          if (matches > 0) {
            result.message = result.message.replace(regex, original);
            result.translations.identifiers += matches;
          }
        }
      }
    }

    // Translate strings
    if (this.manifest.optimizations?.strings) {
      for (const [optimized, original] of Object.entries(this.manifest.optimizations.strings)) {
        const regex = new RegExp(`\\b${optimized}\\b`, 'g');
        
        if (result.stack) {
          const matches = (result.stack.match(regex) || []).length;
          if (matches > 0) {
            result.stack = result.stack.replace(regex, `"${original}"`);
            result.translations.strings += matches;
          }
        }
      }
    }

    // Translate numbers
    if (this.manifest.optimizations?.numbers) {
      for (const [optimized, original] of Object.entries(this.manifest.optimizations.numbers)) {
        const regex = new RegExp(`\\b${optimized}\\b`, 'g');
        
        if (result.stack) {
          const matches = (result.stack.match(regex) || []).length;
          if (matches > 0) {
            result.stack = result.stack.replace(regex, original.toString());
            result.translations.numbers += matches;
          }
        }
      }
    }

    return result;
  }

  /**
   * Calculate optimization statistics
   */
  calculateStats() {
    if (!this.manifest) return null;

    const stats = {
      totalFiles: this.manifest.metadata?.totalFiles || 0,
      totalOptimizations: this.manifest.metadata?.totalOptimizations || 0,
      breakdown: {
        identifiers: Object.keys(this.manifest.optimizations?.identifiers || {}).length,
        strings: Object.keys(this.manifest.optimizations?.strings || {}).length,
        numbers: Object.keys(this.manifest.optimizations?.numbers || {}).length
      },
      timestamp: this.manifest.timestamp || new Date().toISOString(),
      version: this.manifest.version || 'unknown'
    };

    return stats;
  }

  /**
   * Search for specific identifiers in the manifest
   */
  searchIdentifier(searchTerm) {
    if (!this.manifest) return [];

    const results = [];
    const searchLower = searchTerm.toLowerCase();

    // Search in identifiers
    if (this.manifest.optimizations?.identifiers) {
      for (const [optimized, original] of Object.entries(this.manifest.optimizations.identifiers)) {
        if (optimized.toLowerCase().includes(searchLower) || 
            original.toLowerCase().includes(searchLower)) {
          results.push({
            type: 'identifier',
            optimized,
            original,
            category: 'identifier'
          });
        }
      }
    }

    // Search in strings
    if (this.manifest.optimizations?.strings) {
      for (const [optimized, original] of Object.entries(this.manifest.optimizations.strings)) {
        if (optimized.toLowerCase().includes(searchLower) || 
            original.toLowerCase().includes(searchLower)) {
          results.push({
            type: 'string',
            optimized,
            original,
            category: 'string'
          });
        }
      }
    }

    // Search in numbers
    if (this.manifest.optimizations?.numbers) {
      for (const [optimized, original] of Object.entries(this.manifest.optimizations.numbers)) {
        if (optimized.toLowerCase().includes(searchLower) || 
            original.toString().includes(searchTerm)) {
          results.push({
            type: 'number',
            optimized,
            original,
            category: 'number'
          });
        }
      }
    }

    return results;
  }

  /**
   * Start the development server
   */
  start() {
    return new Promise((resolve, reject) => {
      try {
        const server = this.app.listen(this.options.port, () => {
          console.log(chalk.green('\n🚀 Optimization Development Tool Started!'));
          console.log(chalk.blue(`📍 Server running at: http://localhost:${this.options.port}`));
          console.log(chalk.blue(`📊 Health check: http://localhost:${this.options.port}/health`));
          console.log(chalk.blue(`📋 Manifest info: http://localhost:${this.options.port}/manifest`));
          console.log(chalk.blue(`🔍 Error translation: POST http://localhost:${this.options.port}/translate-error`));
          console.log(chalk.blue(`📈 Statistics: http://localhost:${this.options.port}/stats`));
          console.log(chalk.yellow('\n💡 Run this concurrently with your development server:'));
          console.log(chalk.yellow('   expo start  # or next dev, npm start, etc.'));
          console.log(chalk.yellow('   node optimization-devtool  # in another terminal\n'));
          
          resolve(server);
        });

        server.on('error', (error) => {
          reject(error);
        });

      } catch (error) {
        reject(error);
      }
    });
  }
}

// Export the class and a factory function
module.exports = OptimizationDevTool;

// Factory function for easy instantiation
module.exports.createServer = (options) => {
  return new OptimizationDevTool(options);
};

// If this file is run directly, start the server
if (require.main === module) {
  const devTool = new OptimizationDevTool({
    verbose: true,
    autoReload: true
  });

  devTool.start().catch((error) => {
    console.error(chalk.red('Failed to start server:'), error);
    process.exit(1);
  });
}
