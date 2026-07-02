# Android APK Build Guide for AI Assistant Pro

Your web app has been wrapped with Capacitor and is ready to be built into an Android APK for Google Play Store distribution.

## What's Been Done

✅ Capacitor initialized with app ID: `com.aiassistantpro.app`  
✅ Android platform added  
✅ Web assets synced to `android/app/src/main/assets/public`  
✅ Capacitor config created at `capacitor.config.ts`  

## Prerequisites for Building

To build the APK, you need:
- **Android Studio** (includes Android SDK, NDK, and build tools)
- **Java Development Kit (JDK) 11+**
- **Gradle** (usually included with Android Studio)

## Build Steps (Local Machine)

### 1. Install Android Studio
Download from: https://developer.android.com/studio

### 2. Clone or Transfer Your Project
```bash
# Transfer the entire project directory to your local machine
# Make sure the `android/` folder is included
```

### 3. Open in Android Studio
```bash
# Open the android/ folder as a project
cd android
# Or use Android Studio GUI: File → Open → select the android/ folder
```

### 4. Build the APK
```bash
# From the android/ directory:
./gradlew assembleRelease

# Or from the project root:
cd android && ./gradlew assembleRelease
```

The APK will be generated at:
```
android/app/build/outputs/apk/release/app-release.apk
```

### 5. Sign the APK (Required for Play Store)
```bash
# Generate a keystore (one-time):
keytool -genkey -v -keystore my-release-key.keystore -keyalg RSA -keysize 2048 -validity 10000 -alias my-key-alias

# Sign the APK:
jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 \
  -keystore my-release-key.keystore \
  app-release-unsigned.apk my-key-alias

# Optimize (optional):
zipalign -v 4 app-release-unsigned.apk app-release-signed.apk
```

## Alternative: Use GitHub Actions (CI/CD)

Create `.github/workflows/build-android.yml` in your repo:

```yaml
name: Build Android APK

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Java
        uses: actions/setup-java@v3
        with:
          java-version: '11'
          distribution: 'temurin'
      
      - name: Build APK
        run: |
          cd android
          chmod +x gradlew
          ./gradlew assembleRelease
      
      - name: Upload APK
        uses: actions/upload-artifact@v3
        with:
          name: app-release.apk
          path: android/app/build/outputs/apk/release/app-release.apk
```

Push to GitHub and the APK will be built automatically.

## Publishing to Google Play Store

1. **Create a Google Play Developer Account**: https://play.google.com/console
2. **Create a new app** in the Play Console
3. **Upload the signed APK** to the "Production" track
4. **Fill in app details**: description, screenshots, privacy policy, etc.
5. **Submit for review** (takes 24-48 hours typically)

## App Store Listing Requirements

Prepare these before submission:
- **App icon** (512x512 PNG)
- **Screenshots** (5-8 images, 1080x1920 px for phones)
- **Feature graphic** (1024x500 px)
- **Short description** (80 characters)
- **Full description** (4000 characters)
- **Privacy policy URL**
- **Content rating** (fill out questionnaire)

## Troubleshooting

### Build fails with "SDK not found"
- Install Android SDK via Android Studio: Tools → SDK Manager
- Set `ANDROID_HOME` environment variable

### APK too large
- The web app bundle is large (~1.6MB JS). Consider:
  - Code splitting in Vite
  - Lazy loading routes
  - Removing unused dependencies

### App crashes on startup
- Check `android/app/src/main/assets/public/index.html` exists
- Verify web assets were synced: `npx cap sync android`
- Check logcat: `adb logcat | grep "AI Assistant"`

## Next Steps

1. Build the APK locally or via CI/CD
2. Test on Android devices (emulator or physical)
3. Sign the APK with your release keystore
4. Upload to Google Play Store
5. Monitor crash reports and user reviews

## Support

For Capacitor issues: https://capacitorjs.com/docs  
For Android build issues: https://developer.android.com/build  
For Play Store publishing: https://support.google.com/googleplay/android-developer
