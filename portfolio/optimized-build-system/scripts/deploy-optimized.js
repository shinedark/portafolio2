#!/usr/bin/env node

/**
 * Deploy Optimized Bundle Script
 * 
 * This script deploys the optimized bundle to replace the original
 * and provides rollback capabilities.
 */

const fs = require('fs');
const path = require('path');

function deployOptimizedBundle(buildDir = '../build/static/js') {
  console.log('🚀 Deploying Optimized Bundle');
  console.log('==============================\n');
  
  try {
    // Find the optimized bundle
    const files = fs.readdirSync(buildDir);
    const optimizedBundle = files.find(file => 
      file.includes('max-aggression') && file.endsWith('.js') && !file.includes('backup')
    );
    
    if (!optimizedBundle) {
      throw new Error('No optimized bundle found. Run optimization first.');
    }
    
    // Find the original bundle
    const originalBundle = files.find(file => 
      file.startsWith('main.') && file.endsWith('.js') && 
      !file.includes('max-aggression') && !file.includes('enhanced') && 
      !file.includes('backup') && !file.includes('stripped')
    );
    
    if (!originalBundle) {
      throw new Error('No original bundle found.');
    }
    
    const optimizedPath = path.join(buildDir, optimizedBundle);
    const originalPath = path.join(buildDir, originalBundle);
    const backupPath = originalPath + '.deployment-backup';
    
    // Create deployment backup
    if (fs.existsSync(originalPath)) {
      fs.copyFileSync(originalPath, backupPath);
      console.log(`📦 Deployment backup created: ${path.basename(backupPath)}`);
    }
    
    // Get file sizes
    const originalSize = fs.statSync(originalPath).size;
    const optimizedSize = fs.statSync(optimizedPath).size;
    const reduction = ((originalSize - optimizedSize) / originalSize) * 100;
    
    // Deploy optimized bundle
    fs.copyFileSync(optimizedPath, originalPath);
    
    console.log('✅ Deployment completed successfully!');
    console.log('\n📊 Deployment Summary:');
    console.log(`   Original bundle: ${(originalSize / 1024).toFixed(2)} KB`);
    console.log(`   Optimized bundle: ${(optimizedSize / 1024).toFixed(2)} KB`);
    console.log(`   Size reduction: ${reduction.toFixed(2)}%`);
    console.log(`   Savings: ${((originalSize - optimizedSize) / 1024).toFixed(2)} KB`);
    
    console.log('\n🔄 Rollback Instructions:');
    console.log(`   To rollback: cp ${path.basename(backupPath)} ${path.basename(originalPath)}`);
    
    console.log('\n🎉 Your app is now running with optimized bundles!');
    
    return {
      success: true,
      originalSize,
      optimizedSize,
      reduction,
      backupPath
    };
    
  } catch (error) {
    console.error('❌ Deployment failed:', error.message);
    return { success: false, error: error.message };
  }
}

function rollbackDeployment(buildDir = '../build/static/js') {
  console.log('🔄 Rolling Back Deployment');
  console.log('==========================\n');
  
  try {
    const files = fs.readdirSync(buildDir);
    const backupFile = files.find(file => file.includes('deployment-backup'));
    
    if (!backupFile) {
      throw new Error('No deployment backup found.');
    }
    
    const originalBundle = files.find(file => 
      file.startsWith('main.') && file.endsWith('.js') && 
      !file.includes('max-aggression') && !file.includes('enhanced') && 
      !file.includes('backup') && !file.includes('stripped')
    );
    
    if (!originalBundle) {
      throw new Error('No original bundle found.');
    }
    
    const backupPath = path.join(buildDir, backupFile);
    const originalPath = path.join(buildDir, originalBundle);
    
    // Restore from backup
    fs.copyFileSync(backupPath, originalPath);
    
    console.log('✅ Rollback completed successfully!');
    console.log(`   Restored: ${path.basename(originalBundle)}`);
    console.log(`   From backup: ${path.basename(backupFile)}`);
    
    return { success: true };
    
  } catch (error) {
    console.error('❌ Rollback failed:', error.message);
    return { success: false, error: error.message };
  }
}

// Command line interface
if (require.main === module) {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'deploy':
      deployOptimizedBundle();
      break;
      
    case 'rollback':
      rollbackDeployment();
      break;
      
    default:
      console.log(`
🚀 Deploy Optimized Bundle

Usage:
  node deploy-optimized.js deploy    # Deploy optimized bundle
  node deploy-optimized.js rollback  # Rollback to original bundle

Examples:
  node deploy-optimized.js deploy
  node deploy-optimized.js rollback
`);
  }
}

module.exports = { deployOptimizedBundle, rollbackDeployment };
