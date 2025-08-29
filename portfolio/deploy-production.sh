#!/bin/bash

# 🚀 Production Deployment Script for Portfolio
# This script builds, optimizes, and prepares the bundle for production

set -e  # Exit on any error

echo "🚀 Portfolio Production Deployment Starting..."
echo "=============================================="

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found. Please run this script from the portfolio directory."
    exit 1
fi

# Install dependencies if needed
echo "📦 Checking dependencies..."
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Clean previous builds
echo "🧹 Cleaning previous builds..."
rm -rf build/

# Build the project
echo "🔨 Building project..."
npm run build

# Run maximum aggression optimization
echo "🔥 Running maximum aggression optimization..."
npm run max-aggression

# Check if optimization was successful
OPTIMIZED_BUNDLE=$(find build/static/js -name "main.*.max-aggression.js" | head -1)
if [ -z "$OPTIMIZED_BUNDLE" ]; then
    echo "❌ Error: Optimized bundle not found. Optimization failed."
    exit 1
fi

# Get the actual filename (since it's hashed)
OPTIMIZED_BUNDLE=$(find build/static/js -name "main.*.max-aggression.js" | head -1)
ORIGINAL_BUNDLE=$(find build/static/js -name "main.*.js" | grep -v "max-aggression\|stripped\|enhanced\|production\|aggressive\|selective\|ultra-deep" | head -1)

if [ -z "$OPTIMIZED_BUNDLE" ] || [ -z "$ORIGINAL_BUNDLE" ]; then
    echo "❌ Error: Could not find bundle files."
    exit 1
fi

echo "📊 Bundle files found:"
echo "   Original: $ORIGINAL_BUNDLE"
echo "   Optimized: $OPTIMIZED_BUNDLE"

# Calculate size reduction
ORIGINAL_SIZE=$(stat -f%z "$ORIGINAL_BUNDLE")
OPTIMIZED_SIZE=$(stat -f%z "$OPTIMIZED_BUNDLE")
REDUCTION_BYTES=$((ORIGINAL_SIZE - OPTIMIZED_SIZE))
REDUCTION_PERCENT=$(echo "scale=2; $REDUCTION_BYTES * 100 / $ORIGINAL_SIZE" | bc)

echo "📉 Size reduction: $REDUCTION_BYTES bytes ($REDUCTION_PERCENT%)"

# Create production deployment package
echo "📦 Creating production deployment package..."
PROD_DIR="production-deploy-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$PROD_DIR"

# Copy optimized bundle
cp "$OPTIMIZED_BUNDLE" "$PROD_DIR/"
echo "✅ Copied optimized bundle to $PROD_DIR/"

# Copy manifest
cp build/max-aggression-manifest.json "$PROD_DIR/"
echo "✅ Copied optimization manifest to $PROD_DIR/"

# Copy other build assets
cp -r build/static/css "$PROD_DIR/"
cp -r build/static/js/453.*.chunk.js "$PROD_DIR/" 2>/dev/null || echo "⚠️  No chunk files found"
cp -r build/static/media "$PROD_DIR/" 2>/dev/null || echo "⚠️  No media files found"
cp build/manifest.json "$PROD_DIR/" 2>/dev/null || echo "⚠️  No manifest.json found"
cp build/robots.txt "$PROD_DIR/" 2>/dev/null || echo "⚠️  No robots.txt found"

# Create deployment instructions
cat > "$PROD_DIR/DEPLOYMENT_INSTRUCTIONS.md" << EOF
# 🚀 Production Deployment Instructions

## 📁 Files to Deploy

1. **Main Bundle**: $(basename "$OPTIMIZED_BUNDLE") (optimized JavaScript)
2. **CSS**: static/css/ (stylesheets)
3. **Manifest**: max-aggression-manifest.json (optimization mapping)
4. **Other Assets**: static/media/, manifest.json, robots.txt

## 🔄 Deployment Steps

1. **Upload Files**: Upload all files to your production server
2. **Replace Bundle**: Ensure the optimized bundle is served as the main JavaScript file
3. **Verify Functionality**: Test all features work correctly
4. **Monitor Performance**: Watch for any runtime issues

## 🚨 Rollback Plan

If issues arise, restore the original bundle:
\`\`\`bash
# Restore from backup
cp build/static/js/main.*.max-aggression.backup build/static/js/main.*.js
\`\`\`

## 📊 Optimization Results

- **Original Size**: $(($ORIGINAL_SIZE / 1024)) KB
- **Optimized Size**: $(($OPTIMIZED_SIZE / 1024)) KB
- **Reduction**: $REDUCTION_BYTES bytes ($REDUCTION_PERCENT%)
- **Manifest Size**: $(stat -f%z build/max-aggression-manifest.json) bytes

## 🔍 Error Translation

For production debugging, use the manifest file to translate optimized identifiers:
\`\`\`bash
npm run production-dev-server
# POST /translate-error with stack trace
\`\`\`

---
Generated: $(date)
Optimization: Maximum Aggression Stripper
Status: ✅ PRODUCTION READY
EOF

echo "✅ Created deployment instructions in $PROD_DIR/DEPLOYMENT_INSTRUCTIONS.md"

# Create a simple deployment script
cat > "$PROD_DIR/deploy.sh" << 'EOF'
#!/bin/bash
# Simple deployment script for production

echo "🚀 Deploying optimized portfolio to production..."

# Add your deployment commands here
# Examples:
# rsync -avz ./ user@server:/path/to/production/
# aws s3 sync ./ s3://your-bucket/
# git push production main

echo "✅ Deployment complete!"
EOF

chmod +x "$PROD_DIR/deploy.sh"

# Final summary
echo ""
echo "🎉 Production Deployment Package Ready!"
echo "======================================"
echo "📁 Directory: $PROD_DIR"
echo "📦 Contents:"
echo "   - Optimized bundle: $(basename "$OPTIMIZED_BUNDLE")"
echo "   - CSS files: static/css/"
echo "   - Optimization manifest: max-aggression-manifest.json"
echo "   - Deployment instructions: DEPLOYMENT_INSTRUCTIONS.md"
echo "   - Deployment script: deploy.sh"
echo ""
echo "🚀 Next Steps:"
echo "   1. Review the deployment package in $PROD_DIR/"
echo "   2. Customize deploy.sh with your deployment commands"
echo "   3. Deploy to production"
echo "   4. Monitor performance and functionality"
echo ""
echo "✅ Production deployment package created successfully!"
