const { notarize } = require('@electron/notarize');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');
const glob = require('glob');

exports.default = async function afterSign(context) {
  const { electronPlatformName, appOutDir } = context;
  
  if (electronPlatformName !== 'darwin') {
    console.log('⏭️  Skipping code signing (not macOS)');
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = path.join(appOutDir, `${appName}.app`);
  
  console.log('🔐 Starting deep code signing...');
  
  const identity = process.env.CSC_NAME || 'Developer ID Application: Thomas Entner (RG7FE682S2)';
  const entitlements = path.join(__dirname, '..', 'electron', 'entitlements.mac.plist');

  // Define paths to sign in correct order (most nested first)
  const pathsToSign = [
    // Helper app executables
    `${appPath}/Contents/Frameworks/*.app/Contents/MacOS/*`,
    // Helper apps themselves  
    `${appPath}/Contents/Frameworks/*.app`,
    // Framework libraries
    `${appPath}/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/*.dylib`,
    `${appPath}/Contents/Frameworks/Electron Framework.framework/Versions/A/Helpers/*`,
    // Other framework binaries
    `${appPath}/Contents/Frameworks/*.framework/Versions/A/Resources/*`,
    `${appPath}/Contents/Frameworks/*.framework/Versions/A/*`,
    // Main framework
    `${appPath}/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework`,
    // Main executable (last)
    `${appPath}/Contents/MacOS/${appName}`
  ];

  for (const pattern of pathsToSign) {
    try {
      const files = glob.sync(pattern);
      for (const file of files) {
        // Check if file is executable
        const stats = fs.statSync(file);
        if (stats.isFile() && (stats.mode & parseInt('111', 8))) {
          console.log(`Signing: ${file}`);
          
          const command = `codesign --force --verify --verbose --sign "${identity}" --entitlements "${entitlements}" --options runtime "${file}"`;
          
          execSync(command, { 
            stdio: 'inherit'
          });
        }
      }
    } catch (error) {
      console.log(`Skipping pattern ${pattern}: ${error.message}`);
    }
  }

  console.log('✅ Deep code signing completed');

  // Only notarize if we have the required environment variables
  if (process.env.APPLE_ID && process.env.APPLE_ID_PASSWORD && process.env.APPLE_TEAM_ID) {
    console.log('🍎 Starting notarization...');
    
    await notarize({
      appBundleId: 'com.quartabill.app',
      appPath: appPath,
      appleId: process.env.APPLE_ID,
      appleIdPassword: process.env.APPLE_ID_PASSWORD,
      teamId: process.env.APPLE_TEAM_ID,
    });
    
    console.log('✅ Notarization completed successfully');
  } else {
    console.log('⚠️  Skipping notarization (missing environment variables)');
  }
}; 