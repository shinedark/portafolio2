const fs = require('fs');
const path = require('path');

/**
 * Validate optimization results
 */
function validateOptimization(originalCode, optimizedCode, options) {
  const validation = {
    valid: true,
    errors: [],
    warnings: [],
    stats: {
      originalSize: originalCode.length,
      optimizedSize: optimizedCode.length,
      reduction: ((originalCode.length - optimizedCode.length) / originalCode.length) * 100
    }
  };

  // Check if optimization is too aggressive
  if (validation.stats.reduction > options.safety.maxOptimizationPercentage) {
    validation.valid = false;
    validation.errors.push(
      `Optimization too aggressive: ${validation.stats.reduction.toFixed(2)}% reduction exceeds limit of ${options.safety.maxOptimizationPercentage}%`
    );
  }

  // Check if optimized code is valid JavaScript
  try {
    // Basic syntax validation
    new Function(optimizedCode);
  } catch (error) {
    validation.valid = false;
    validation.errors.push(`Invalid JavaScript generated: ${error.message}`);
  }

  // Check for critical patterns that should be preserved
  const criticalPatterns = options.safety.preserveCriticalPatterns;
  for (const pattern of criticalPatterns) {
    if (!optimizedCode.includes(pattern)) {
      validation.warnings.push(`Critical pattern '${pattern}' not found in optimized code`);
    }
  }

  // Check if optimized code is significantly smaller
  if (validation.stats.reduction < 1) {
    validation.warnings.push('Optimization achieved minimal reduction (< 1%)');
  }

  return validation;
}

/**
 * Generate a comprehensive optimization report
 */
function generateOptimizationReport(manifest, stats) {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      totalFiles: manifest.metadata.totalFiles,
      totalOptimizations: manifest.metadata.totalOptimizations,
      sizeReduction: manifest.metadata.sizeReduction,
      optimizationEfficiency: calculateEfficiency(manifest)
    },
    breakdown: {
      identifiers: Object.keys(manifest.optimizations.identifiers).length,
      strings: Object.keys(manifest.optimizations.strings).length,
      numbers: Object.keys(manifest.optimizations.numbers).length
    },
    recommendations: generateRecommendations(manifest, stats)
  };

  return report;
}

/**
 * Calculate optimization efficiency
 */
function calculateEfficiency(manifest) {
  const totalOptimizations = manifest.metadata.totalOptimizations;
  const totalFiles = manifest.metadata.totalFiles;
  
  if (totalFiles === 0) return 0;
  
  return (totalOptimizations / totalFiles).toFixed(2);
}

/**
 * Generate optimization recommendations
 */
function generateRecommendations(manifest, stats) {
  const recommendations = [];
  
  const identifierCount = Object.keys(manifest.optimizations.identifiers).length;
  const stringCount = Object.keys(manifest.optimizations.strings).length;
  const numberCount = Object.keys(manifest.optimizations.numbers).length;
  
  if (identifierCount > 1000) {
    recommendations.push('High identifier count suggests complex codebase - consider code splitting');
  }
  
  if (stringCount > 100) {
    recommendations.push('Many repeated strings - consider internationalization or string constants');
  }
  
  if (numberCount > 50) {
    recommendations.push('Many repeated numbers - consider mathematical constants or configuration');
  }
  
  if (stats.reduction < 5) {
    recommendations.push('Low optimization yield - review optimization settings or code structure');
  }
  
  if (stats.reduction > 20) {
    recommendations.push('High optimization yield - ensure code functionality is preserved');
  }
  
  return recommendations;
}

/**
 * Save optimization manifest to file
 */
function saveManifest(manifest, outputPath) {
  try {
    const dir = path.dirname(outputPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(outputPath, JSON.stringify(manifest, null, 2));
    return true;
  } catch (error) {
    console.error('Failed to save manifest:', error);
    return false;
  }
}

/**
 * Load optimization manifest from file
 */
function loadManifest(manifestPath) {
  try {
    if (!fs.existsSync(manifestPath)) {
      throw new Error(`Manifest file not found: ${manifestPath}`);
    }
    
    const content = fs.readFileSync(manifestPath, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    throw new Error(`Failed to load manifest: ${error.message}`);
  }
}

/**
 * Create a backup of original files before optimization
 */
function createBackup(filePath) {
  try {
    const backupPath = `${filePath}.backup`;
    if (fs.existsSync(filePath)) {
      fs.copyFileSync(filePath, backupPath);
      return backupPath;
    }
    return null;
  } catch (error) {
    console.error(`Failed to create backup for ${filePath}:`, error);
    return null;
  }
}

/**
 * Restore file from backup
 */
function restoreFromBackup(filePath) {
  try {
    const backupPath = `${filePath}.backup`;
    if (fs.existsSync(backupPath)) {
      fs.copyFileSync(backupPath, filePath);
      fs.unlinkSync(backupPath);
      return true;
    }
    return false;
  } catch (error) {
    console.error(`Failed to restore ${filePath} from backup:`, error);
    return false;
  }
}

/**
 * Clean up backup files
 */
function cleanupBackups(directory) {
  try {
    const files = fs.readdirSync(directory);
    for (const file of files) {
      if (file.endsWith('.backup')) {
        const backupPath = path.join(directory, file);
        fs.unlinkSync(backupPath);
      }
    }
    return true;
  } catch (error) {
    console.error('Failed to cleanup backups:', error);
    return false;
  }
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
 * Calculate compression ratio
 */
function calculateCompressionRatio(originalSize, compressedSize) {
  if (originalSize === 0) return 0;
  return ((originalSize - compressedSize) / originalSize * 100).toFixed(2);
}

module.exports = {
  validateOptimization,
  generateOptimizationReport,
  saveManifest,
  loadManifest,
  createBackup,
  restoreFromBackup,
  cleanupBackups,
  formatFileSize,
  calculateCompressionRatio
};
