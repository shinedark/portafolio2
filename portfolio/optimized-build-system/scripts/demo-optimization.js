#!/usr/bin/env node

/**
 * Demo Script - Semantic Build Optimizer
 * 
 * This script demonstrates how to use the semantic optimizer
 * with a sample React bundle.
 */

const fs = require('fs');
const path = require('path');
const { runMaximumAggressionStripper } = require('./maximum-aggression-stripper');
const { runEnhancedMaximumAggressionStripper } = require('./enhanced-max-aggression-stripper');

// Sample React bundle code for demonstration
const SAMPLE_BUNDLE = `
(function() {
  'use strict';
  
  // React components
  function UserProfile(props) {
    const [userData, setUserData] = React.useState(null);
    const [isLoading, setIsLoading] = React.useState(false);
    
    React.useEffect(() => {
      fetchUserData(props.userId);
    }, [props.userId]);
    
    const fetchUserData = async (userId) => {
      setIsLoading(true);
      try {
        const response = await fetch(\`/api/users/\${userId}\`);
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    const handleEditProfile = () => {
      // Handle profile editing
      console.log('Editing profile for user:', props.userId);
    };
    
    const handleDeleteAccount = () => {
      // Handle account deletion
      if (confirm('Are you sure you want to delete your account?')) {
        deleteUserAccount(props.userId);
      }
    };
    
    const deleteUserAccount = async (userId) => {
      try {
        await fetch(\`/api/users/\${userId}\`, {
          method: 'DELETE',
          headers: {
            'Authorization': \`Bearer \${localStorage.getItem('token')}\`
          }
        });
        // Redirect to login page
        window.location.href = '/login';
      } catch (error) {
        console.error('Failed to delete account:', error);
      }
    };
    
    if (isLoading) {
      return React.createElement('div', { className: 'loading-spinner' }, 'Loading...');
    }
    
    if (!userData) {
      return React.createElement('div', { className: 'error-message' }, 'User not found');
    }
    
    return React.createElement('div', { className: 'user-profile-container' },
      React.createElement('h1', { className: 'user-name' }, userData.name),
      React.createElement('p', { className: 'user-email' }, userData.email),
      React.createElement('div', { className: 'user-actions' },
        React.createElement('button', { 
          onClick: handleEditProfile,
          className: 'edit-button'
        }, 'Edit Profile'),
        React.createElement('button', { 
          onClick: handleDeleteAccount,
          className: 'delete-button'
        }, 'Delete Account')
      )
    );
  }
  
  // Utility functions
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  const validateEmail = (email) => {
    const emailRegex = /^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/;
    return emailRegex.test(email);
  };
  
  const calculateAge = (birthDate) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    
    return age;
  };
  
  // Constants
  const API_BASE_URL = 'https://api.example.com';
  const MAX_FILE_SIZE = 5242880; // 5MB
  const SUPPORTED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/gif'];
  
  // Export the component
  window.UserProfile = UserProfile;
  window.formatDate = formatDate;
  window.validateEmail = validateEmail;
  window.calculateAge = calculateAge;
})();
`;

function createDemoBuild() {
  console.log('🎬 Creating demo build structure...');
  
  // Create demo build directory
  const demoBuildDir = path.join(__dirname, '../demo-build/static/js');
  fs.mkdirSync(demoBuildDir, { recursive: true });
  
  // Write sample bundle
  const bundlePath = path.join(demoBuildDir, 'main.abc123.js');
  fs.writeFileSync(bundlePath, SAMPLE_BUNDLE);
  
  console.log(`📦 Demo bundle created: ${bundlePath}`);
  console.log(`📏 Original size: ${(SAMPLE_BUNDLE.length / 1024).toFixed(2)} KB`);
  
  return demoBuildDir;
}

function cleanupDemo() {
  console.log('🧹 Cleaning up demo files...');
  
  const demoBuildDir = path.join(__dirname, '../demo-build');
  if (fs.existsSync(demoBuildDir)) {
    fs.rmSync(demoBuildDir, { recursive: true, force: true });
    console.log('✅ Demo files cleaned up');
  }
}

async function runDemo() {
  console.log('🚀 Semantic Build Optimizer Demo');
  console.log('================================\n');
  
  try {
    // Create demo build
    const buildDir = createDemoBuild();
    
    console.log('\n🔧 Running Maximum Aggression Optimization...');
    console.log('----------------------------------------------');
    
    // Run maximum aggression optimization
    const maxResult = await runMaximumAggressionStripper(buildDir);
    
    if (maxResult.success) {
      console.log('\n✅ Maximum Aggression Optimization Results:');
      console.log(`   Original size: ${(maxResult.originalSize / 1024).toFixed(2)} KB`);
      console.log(`   Optimized size: ${(maxResult.optimizedSize / 1024).toFixed(2)} KB`);
      console.log(`   Reduction: ${maxResult.reduction.toFixed(2)}%`);
      console.log(`   Total optimizations: ${maxResult.totalOptimizations}`);
      console.log(`   Manifest size: ${(maxResult.manifestSize / 1024).toFixed(2)} KB`);
    }
    
    console.log('\n🔧 Running Enhanced Maximum Aggression Optimization...');
    console.log('------------------------------------------------------');
    
    // Run enhanced optimization
    const enhancedResult = await runEnhancedMaximumAggressionStripper(buildDir);
    
    if (enhancedResult.success) {
      console.log('\n✅ Enhanced Maximum Aggression Optimization Results:');
      console.log(`   Original size: ${(enhancedResult.originalSize / 1024).toFixed(2)} KB`);
      console.log(`   Optimized size: ${(enhancedResult.optimizedSize / 1024).toFixed(2)} KB`);
      console.log(`   Reduction: ${enhancedResult.reduction.toFixed(2)}%`);
      console.log(`   Total optimizations: ${enhancedResult.totalOptimizations}`);
      console.log(`   Manifest size: ${(enhancedResult.manifestSize / 1024).toFixed(2)} KB`);
    }
    
    console.log('\n📊 Comparison Summary:');
    console.log('======================');
    console.log(`Strategy                    | Reduction | Optimizations | Manifest`);
    console.log(`----------------------------|-----------|---------------|----------`);
    console.log(`Maximum Aggression          | ${maxResult.reduction?.toFixed(2) || 'N/A'}%     | ${maxResult.totalOptimizations || 'N/A'}           | ${maxResult.manifestSize ? (maxResult.manifestSize / 1024).toFixed(2) + 'KB' : 'N/A'}`);
    console.log(`Enhanced Maximum Aggression | ${enhancedResult.reduction?.toFixed(2) || 'N/A'}%     | ${enhancedResult.totalOptimizations || 'N/A'}           | ${enhancedResult.manifestSize ? (enhancedResult.manifestSize / 1024).toFixed(2) + 'KB' : 'N/A'}`);
    
    console.log('\n🎉 Demo completed successfully!');
    console.log('\n💡 Next steps:');
    console.log('1. Try the optimizer on your own React project');
    console.log('2. Use the Maximum Aggression strategy for production');
    console.log('3. Check the optimization reports for detailed results');
    console.log('4. Use the manifests for error translation in production');
    
  } catch (error) {
    console.error('❌ Demo failed:', error.message);
  } finally {
    // Cleanup
    cleanupDemo();
  }
}

// Run demo if called directly
if (require.main === module) {
  runDemo();
}

module.exports = { runDemo };
