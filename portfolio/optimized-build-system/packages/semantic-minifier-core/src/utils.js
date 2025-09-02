const parser = require('@babel/parser');

/**
 * Enhanced validation utilities for semantic minification
 */

/**
 * Validate optimization results
 */
function validateOptimization(originalCode, optimizedCode, options) {
  const issues = [];
  const warnings = [];
  
  // Check size reduction limits
  const originalSize = originalCode.length;
  const optimizedSize = optimizedCode.length;
  const reduction = ((originalSize - optimizedSize) / originalSize) * 100;
  
  if (reduction > options.safety.maxOptimizationPercentage) {
    issues.push(`Optimization too aggressive: ${reduction.toFixed(2)}% (max: ${options.safety.maxOptimizationPercentage}%)`);
  }
  
  // Check for critical patterns
  const criticalPatterns = options.safety.preserveCriticalPatterns;
  for (const pattern of criticalPatterns) {
    const regex = new RegExp(pattern, 'g');
    if (!regex.test(optimizedCode)) {
      warnings.push(`Critical pattern may be missing: ${pattern}`);
    }
  }
  
  // Check if output is valid JavaScript
  try {
    parser.parse(optimizedCode, { 
      sourceType: 'module', 
      plugins: ['jsx'] 
    });
  } catch (parseError) {
    issues.push(`Output is not valid JavaScript: ${parseError.message}`);
  }
  
  // Check for potential issues
  if (reduction < 1) {
    warnings.push('Very low optimization achieved - check configuration');
  }
  
  if (optimizedSize > originalSize) {
    issues.push('Optimized code is larger than original - optimization failed');
  }
  
  return {
    valid: issues.length === 0,
    issues,
    warnings,
    reduction,
    originalSize,
    optimizedSize
  };
}

/**
 * Validate bundle integrity
 */
function validateBundle(originalCode, output, manifest) {
  const issues = [];
  const originalSize = originalCode.length;
  const optimizedSize = output.length;
  const reduction = ((originalSize - optimizedSize) / originalSize) * 100;
  
  // Check size reduction limits
  if (reduction > 40) { // Maximum 40% reduction
    issues.push(`Optimization too aggressive: ${reduction.toFixed(2)}% (max: 40%)`);
  }
  
  // Check manifest size
  const manifestSize = JSON.stringify(manifest).length;
  if (manifestSize > 15 * 1024 * 1024) { // 15MB limit
    issues.push(`Manifest too large: ${(manifestSize / 1024).toFixed(2)} KB (max: 15MB)`);
  }
  
  // Check for critical patterns
  const criticalPatterns = [
    /React\./,
    /useState\(/,
    /useEffect\(/,
    /useRef\(/,
    /THREE\./,
    /window\./,
    /document\./
  ];
  
  for (const pattern of criticalPatterns) {
    if (!pattern.test(output)) {
      issues.push(`Critical pattern missing: ${pattern.source}`);
    }
  }
  
  // Check if output is valid JavaScript
  try {
    parser.parse(output, { sourceType: 'module', plugins: ['jsx'] });
  } catch (parseError) {
    issues.push(`Output is not valid JavaScript: ${parseError.message}`);
  }
  
  return { issues, reduction };
}

/**
 * Calculate optimization statistics
 */
function calculateStats(originalSize, optimizedSize, totalOptimizations, processingTime) {
  const reduction = ((originalSize - optimizedSize) / originalSize) * 100;
  const savings = originalSize - optimizedSize;
  
  return {
    originalSize,
    optimizedSize,
    reduction: parseFloat(reduction.toFixed(2)),
    savings,
    savingsKB: parseFloat((savings / 1024).toFixed(2)),
    totalOptimizations,
    processingTime,
    averageOptimizationTime: totalOptimizations > 0 ? processingTime / totalOptimizations : 0
  };
}

/**
 * Format file size for display
 */
function formatFileSize(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

/**
 * Format processing time for display
 */
function formatProcessingTime(milliseconds) {
  if (milliseconds < 1000) {
    return `${milliseconds}ms`;
  } else if (milliseconds < 60000) {
    return `${(milliseconds / 1000).toFixed(2)}s`;
  } else {
    return `${(milliseconds / 60000).toFixed(2)}m`;
  }
}

/**
 * Create backup of original file
 */
function createBackup(filePath, suffix = '.backup') {
  const fs = require('fs');
  const path = require('path');
  
  const backupPath = filePath + suffix;
  fs.copyFileSync(filePath, backupPath);
  return backupPath;
}

/**
 * Restore from backup
 */
function restoreFromBackup(originalPath, backupPath) {
  const fs = require('fs');
  
  if (fs.existsSync(backupPath)) {
    fs.copyFileSync(backupPath, originalPath);
    return true;
  }
  return false;
}

/**
 * Check if file exists
 */
function fileExists(filePath) {
  const fs = require('fs');
  return fs.existsSync(filePath);
}

/**
 * Get file size
 */
function getFileSize(filePath) {
  const fs = require('fs');
  const stats = fs.statSync(filePath);
  return stats.size;
}

/**
 * Read file safely
 */
function readFile(filePath) {
  const fs = require('fs');
  try {
    return fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    throw new Error(`Failed to read file ${filePath}: ${error.message}`);
  }
}

/**
 * Write file safely
 */
function writeFile(filePath, content) {
  const fs = require('fs');
  const path = require('path');
  
  try {
    // Ensure directory exists
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(filePath, content, 'utf-8');
    return true;
  } catch (error) {
    throw new Error(`Failed to write file ${filePath}: ${error.message}`);
  }
}

/**
 * Find main bundle file in build directory
 */
function findMainBundle(buildDir) {
  const fs = require('fs');
  const path = require('path');
  
  const staticJsDir = path.join(buildDir, 'static/js');
  
  if (!fs.existsSync(staticJsDir)) {
    throw new Error(`Build directory not found: ${staticJsDir}`);
  }
  
  const files = fs.readdirSync(staticJsDir);
  const mainBundle = files.find(file => 
    file.startsWith('main.') && 
    file.endsWith('.js') && 
    !file.includes('stripped') &&
    !file.includes('enhanced') &&
    !file.includes('production') &&
    !file.includes('aggressive') &&
    !file.includes('selective') &&
    !file.includes('ultra-deep') &&
    !file.includes('max-aggression')
  );
  
  if (!mainBundle) {
    throw new Error('Main bundle file not found in build/static/js');
  }
  
  return path.join(staticJsDir, mainBundle);
}

/**
 * Generate output file path
 */
function generateOutputPath(inputPath, suffix) {
  const path = require('path');
  const ext = path.extname(inputPath);
  const base = path.basename(inputPath, ext);
  const dir = path.dirname(inputPath);
  
  return path.join(dir, `${base}${suffix}${ext}`);
}

/**
 * Generate manifest file path
 */
function generateManifestPath(buildDir, manifestName) {
  const path = require('path');
  return path.join(buildDir, `${manifestName}.json`);
}

module.exports = {
  validateOptimization,
  validateBundle,
  calculateStats,
  formatFileSize,
  formatProcessingTime,
  createBackup,
  restoreFromBackup,
  fileExists,
  getFileSize,
  readFile,
  writeFile,
  findMainBundle,
  generateOutputPath,
  generateManifestPath
};
