# GitHub Actions Setup for Auto-Building APK

Your project now has a GitHub Actions workflow that automatically builds the Android APK whenever you push code.

## Quick Start

### 1. Create a GitHub Repository
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial commit with Capacitor Android setup"

# Create a new repository on GitHub.com
# Then push your code:
git remote add origin https://github.com/YOUR_USERNAME/ai-assistant-pro.git
git branch -M main
git push -u origin main
```

### 2. GitHub Actions Will Auto-Run
- Every time you push to `main` or `master`, the workflow triggers
- You can also manually trigger it from the Actions tab

### 3. Download Your APK
1. Go to your GitHub repo
2. Click **Actions** tab
3. Click the latest workflow run
4. Scroll down to **Artifacts**
5. Download `app-debug.apk`

## What the Workflow Does

✅ Installs Node.js and pnpm  
✅ Installs dependencies  
✅ Builds web assets with Vite  
✅ Syncs assets to Android  
✅ Sets up Java 17 and Android SDK  
✅ Builds the APK with Gradle  
✅ Uploads APK as downloadable artifact  

## Manual Trigger (No Push Required)

1. Go to **Actions** tab
2. Click **Build Android APK** workflow
3. Click **Run workflow** button
4. Select branch and click **Run workflow**

## Next Steps

### Testing the APK
```bash
# Install on Android device or emulator
adb install app-debug.apk

# Or use Android Studio to install
```

### Building Release APK (For Play Store)

The current workflow builds a **debug APK**. For Play Store, you need a **release APK** with signing.

To build release APK, you'll need to:

1. **Generate a signing keystore** (one-time):
```bash
keytool -genkey -v -keystore ai-assistant-pro.keystore \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias ai-assistant-pro-key
```

2. **Add secrets to GitHub**:
   - Go to **Settings → Secrets and variables → Actions**
   - Click **New repository secret**
   - Add these secrets:
     - `KEYSTORE_FILE`: (base64 encoded keystore file)
     - `KEYSTORE_PASSWORD`: (your keystore password)
     - `KEY_ALIAS`: (your key alias)
     - `KEY_PASSWORD`: (your key password)

3. **Update the workflow** to use release build:
   - Change `assembleDebug` to `assembleRelease`
   - Add signing configuration

### Troubleshooting

**Build fails with "SDK not found"**
- The workflow uses `android-actions/setup-android@v3` which installs the SDK automatically
- If it still fails, check the workflow logs for details

**APK is too large**
- Current bundle is ~1.6MB (large due to web assets)
- Consider code-splitting in Vite or removing unused dependencies

**Artifact not found**
- Check the build logs in the Actions tab
- Make sure the APK was actually built

## Security Note

⚠️ **Never commit your keystore file or passwords to GitHub**

Always use GitHub Secrets for sensitive data:
- Keystore files (base64 encoded)
- Passwords
- API keys
- Tokens

## Need Help?

- GitHub Actions docs: https://docs.github.com/en/actions
- Android build docs: https://developer.android.com/build
- Capacitor docs: https://capacitorjs.com/docs
