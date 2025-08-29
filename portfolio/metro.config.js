const { getDefaultConfig } = require('@expo/metro-config');
const semanticMinification = require('./packages/metro-plugin-semantic-minification/dist');

const config = getDefaultConfig(__dirname);

// Apply semantic minification plugin
semanticMinification(config, {
  // Plugin options
  extensions: ['.js', '.jsx', '.ts', '.tsx'],
  exclude: [/node_modules/, /\.test\./, /\.spec\./],
  manifestPath: './semantic-optimization-manifest.json',
  
  // Minifier options
  minifierOptions: {
    identifierOptimization: {
      enabled: true,
      maxLength: 3, // a0, a1, a2...
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
  verbose: true
});

module.exports = config;
