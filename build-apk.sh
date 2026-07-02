#!/bin/bash

# Quick APK Build Script for AI Assistant Pro
# This script rebuilds the web assets and syncs them to Android

set -e

echo "🔨 Building AI Assistant Pro APK..."
echo ""

# Step 1: Build the web assets
echo "📦 Step 1: Building web assets..."
pnpm exec vite build
echo "✅ Web assets built"
echo ""

# Step 2: Copy to dist
echo "📁 Step 2: Preparing dist folder..."
rm -rf dist
mkdir -p dist
cp -r client/dist/* dist/
echo "✅ Web assets ready"
echo ""

# Step 3: Sync to Android
echo "🔄 Step 3: Syncing to Android..."
npx cap sync android
echo "✅ Android assets synced"
echo ""

# Step 4: Build APK (requires Android SDK)
echo "🚀 Step 4: Building APK..."
echo ""
echo "To build the APK, you need Android Studio installed locally."
echo "Run this command on your local machine:"
echo ""
echo "  cd android"
echo "  ./gradlew assembleRelease"
echo ""
echo "The APK will be at: android/app/build/outputs/apk/release/app-release.apk"
echo ""
echo "For detailed instructions, see: ANDROID_BUILD_GUIDE.md"
