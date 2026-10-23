const fs = require('fs');
const path = require('path');
const versionInfo = require('./version.json');

// Helper to load key-value pairs into process.env
function loadEnvFile(fileName) {
  const filePath = path.resolve(__dirname, fileName);
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf-8');
  content.split(/\r?\n/).forEach((line) => {
    const trimmedLine = line.trim();
    if (!trimmedLine || trimmedLine.startsWith('#')) return;

    const match = trimmedLine.match(/^([\w.-]+)\s*=\s*(.*)?\s*$/);
    if (match) {
      const key = match[1];
      let value = match[2] || '';

      if (value.startsWith('"') && value.endsWith('"')) value = value.slice(1, -1);
      if (value.startsWith("'") && value.endsWith("'")) value = value.slice(1, -1);

      process.env[key] = value.trim();
    }
  });
}

// 1. Resolve environment target (defaults to development, detects EAS profile)
const easProfile = process.env.EAS_BUILD_PROFILE || 'development';
const appEnv = process.env.APP_ENV || (easProfile === 'production' ? 'production' : 'development');
console.log(`[app.config.js] Bootstrapping environment: "${appEnv}" (EAS Profile: "${easProfile}")`);

// 2. Load the targeted env file (.env.development or .env.production)
loadEnvFile(`.env.${appEnv}`);

// 3. Load machine-local secrets (.env.local) if present
loadEnvFile('.env.local');

module.exports = {
  expo: {
    name: process.env.APP_NAME || "Habit Tracker",
    slug: "habit-tracker",
    version: versionInfo.version,
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "dark",
    scheme: "habittracker",
    ios: {
      supportsTablet: true,
      bundleIdentifier: process.env.APP_PACKAGE || "com.habittracker.app"
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#0B0F19"
      },
      package: process.env.APP_PACKAGE || "com.habittracker.app",
      versionCode: versionInfo.versionCode,
      predictiveBackGestureEnabled: false
    },
    plugins: [
      "expo-router",
      "expo-sqlite",
      "expo-font",
      "expo-notifications",
      "./plugins/withAndroidSigning"
    ]
  }
};
