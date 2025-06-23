const { notarize } = require('@electron/notarize');
const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

exports.default = async function afterSign(context) {
  const { electronPlatformName, appOutDir } = context;
  
  if (electronPlatformName !== 'darwin') {
    return;
  }

  const appName = context.packager.appInfo.productFilename;
  const appPath = path.join(appOutDir, `${appName}.app`);
  
  console.log('🔐 Starting deep code signing...');
  
  // Find all binaries and frameworks that need signing
  const pathsToSign = [
    // Helper apps
    `${appPath}/Contents/Frameworks/*.app`,
    `${appPath}/Contents/Frameworks/*.app/Contents/MacOS/*`,
    
    // Electron Framework
    `${appPath}/Contents/Frameworks/Electron Framework.framework/Versions/A/Electron Framework`,
    `${appPath}/Contents/Frameworks/Electron Framework.framework/Versions/A/Libraries/*.dylib`,
    `${appPath}/Contents/Frameworks/Electron Framework.framework/Versions/A/Helpers/*`,
    
    // Other frameworks
    `${appPath}/Contents/Frameworks/*.framework/Versions/A/*`,
    `${appPath}/Contents/Frameworks/*.framework/Versions/A/Resources/*`,
    
    // Main executable (last)
    `${appPath}/Contents/MacOS/${appName}`
  ];

  const identity = process.env.CSC_NAME || 'Developer ID Application: Thomas Entner (RG7FE682S2)';
  const entitlements = path.join(__dirname, '..', 'electron', 'entitlements.mac.plist');

  for (const pattern of pathsToSign) {
    try {
      console.log(`Signing: ${pattern}`);
      
      // Use shell expansion for patterns
      const command = `codesign --force --verify --verbose --sign "${identity}" --entitlements "${entitlements}" --options runtime ${pattern}`;
      
      execSync(command, { 
        stdio: 'inherit',
        shell: '/bin/bash'
      });
    } catch (error) {
      console.log(`Skipping ${pattern} (not found or already signed)`);
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