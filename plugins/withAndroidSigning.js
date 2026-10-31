const path = require('path');
const { withAppBuildGradle } = require('@expo/config-plugins');

module.exports = function withAndroidSigning(config) {
  return withAppBuildGradle(config, (config) => {
    if (config.modResults.language === 'groovy') {
      config.modResults.contents = addSigningConfig(config.modResults.contents);
    }
    return config;
  });
};

function addSigningConfig(buildGradle) {
  // Only inject release signing config in production builds
  if (process.env.APP_ENV !== 'production') {
    console.log(`[withAndroidSigning] Non-production environment ("${process.env.APP_ENV || 'development'}"). Skipping release signing config.`);
    return buildGradle;
  }

  const keystorePath = process.env.RELEASE_KEYSTORE_PATH;
  const keystorePassword = process.env.RELEASE_KEYSTORE_PASSWORD;
  const keyAlias = process.env.RELEASE_KEY_ALIAS;
  const keyPassword = process.env.RELEASE_KEY_PASSWORD;

  if (!keystorePath || !keystorePassword || !keyAlias || !keyPassword) {
    console.warn('[withAndroidSigning] Missing release signing env variables in .env.local. Skipping signing config.');
    return buildGradle;
  }

  // Resolve keystore path relative to android/app/
  let gradleKeystorePath = keystorePath;
  if (!path.isAbsolute(keystorePath) && !keystorePath.startsWith('..')) {
    gradleKeystorePath = `../../${keystorePath}`;
  }

  const releaseSigningBlock = `
        release {
            storeFile file("${gradleKeystorePath.replace(/\\/g, '/')}")
            storePassword "${keystorePassword}"
            keyAlias "${keyAlias}"
            keyPassword "${keyPassword}"
        }`;

  // 1. Inject release signing configuration inside signingConfigs block accurately
  const signingConfigsMatch = buildGradle.match(/signingConfigs\s*\{([\s\S]*?)\n\s{4}\}/);
  const hasReleaseSigning = signingConfigsMatch && /release\s*\{/.test(signingConfigsMatch[1]);

  if (buildGradle.includes('signingConfigs {') && !hasReleaseSigning) {
    buildGradle = buildGradle.replace(
      /signingConfigs\s*\{/,
      `signingConfigs {${releaseSigningBlock}`
    );
    console.log('[withAndroidSigning] Injected signingConfigs.release');
  }

  // 2. Point release build type to the release signingConfig
  const releaseBuildTypeRegex = /(buildTypes\s*\{[\s\S]*?release\s*\{[\s\S]*?signingConfig\s+signingConfigs\.)debug/;
  if (releaseBuildTypeRegex.test(buildGradle)) {
    buildGradle = buildGradle.replace(releaseBuildTypeRegex, '$1release');
    console.log('[withAndroidSigning] Updated buildTypes.release -> signingConfigs.release');
  } else if (buildGradle.includes('release {') && !buildGradle.includes('signingConfig signingConfigs.release')) {
    buildGradle = buildGradle.replace(
      /release\s*\{/,
      `release {\n            signingConfig signingConfigs.release`
    );
    console.log('[withAndroidSigning] Injected signingConfig into buildTypes.release');
  }

  return buildGradle;
}
