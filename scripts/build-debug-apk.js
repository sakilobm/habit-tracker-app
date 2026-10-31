/**
 * @file build-debug-apk.js
 * @description Automated Android Debug APK build script for Habit Tracker (Dev).
 * 
 * Flow:
 * 1. Sets development environment (APP_ENV=development).
 * 2. Runs pre-flight TypeScript typecheck (tsc --noEmit).
 * 3. Runs Expo prebuild with development config (appId: com.habittracker.app.dev).
 * 4. Compiles debug APK via Gradle (assembleDebug).
 * 5. Validates and reports the generated APK artifact path.
 */

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const colors = {
  reset: "\x1b[0m",
  green: "\x1b[32m",
  cyan: "\x1b[36m",
  yellow: "\x1b[33m",
  red: "\x1b[31m",
  bold: "\x1b[1m",
  magenta: "\x1b[35m"
};

function log(msg, color = colors.reset) {
  console.log(`${color}${msg}${colors.reset}`);
}

const args = process.argv.slice(2);

log(`\n======================================================`, colors.bold + colors.cyan);
log(`🛠️  Habit Tracker Android Debug APK Builder`, colors.bold + colors.magenta);
log(`======================================================\n`, colors.bold + colors.cyan);

// ─── 1. Prepare Development Environment ────────────────────────────────────────
const devEnv = {
  ...process.env,
  APP_ENV: 'development',
  EAS_BUILD_PROFILE: 'development',
  NODE_ENV: 'development',
  EXPO_IMAGE_UTILS_NO_SHARP: '1'
};

log(`🌍 Environment Configured:`, colors.bold + colors.cyan);
log(`   APP_ENV:            development`, colors.cyan);
log(`   EAS_BUILD_PROFILE:  development`, colors.cyan);
log(`   Target Package:     com.habittracker.app.dev`, colors.cyan);

// ─── 2. Pre-flight TypeScript Typecheck ────────────────────────────────────────
if (!args.includes('--no-tsc')) {
  log(`\n🔍 Validating TypeScript Compilation...`, colors.bold + colors.cyan);
  const tscRes = spawnSync('npx', ['tsc', '--noEmit'], {
    shell: true,
    stdio: 'inherit',
    env: devEnv
  });
  if (tscRes.status !== 0) {
    log(`\n❌ TypeScript compilation check failed! Fix errors before building.`, colors.bold + colors.red);
    process.exit(1);
  }
  log(`✅ TypeScript compilation clean!`, colors.bold + colors.green);
}

// ─── 3. Expo Prebuild with Development Variables ───────────────────────────────
log(`\n⚙️  Running Expo Prebuild (Development Target)...`, colors.bold + colors.cyan);
const prebuildRes = spawnSync('npx', ['expo', 'prebuild', '--platform', 'android', '--no-install'], {
  shell: true,
  stdio: 'inherit',
  env: devEnv
});

if (prebuildRes.status !== 0) {
  log(`\n❌ Expo prebuild failed with code ${prebuildRes.status}`, colors.bold + colors.red);
  process.exit(prebuildRes.status || 1);
}
log(`✅ Expo prebuild updated android/ native directory for development.`, colors.bold + colors.green);

// Ensure reasonable networkTimeout for Gradle wrapper
const wrapperPropPath = path.resolve(__dirname, '../android/gradle/wrapper/gradle-wrapper.properties');
if (fs.existsSync(wrapperPropPath)) {
  let wrapperProps = fs.readFileSync(wrapperPropPath, 'utf8');
  if (wrapperProps.includes('networkTimeout=10000')) {
    wrapperProps = wrapperProps.replace('networkTimeout=10000', 'networkTimeout=120000');
    fs.writeFileSync(wrapperPropPath, wrapperProps, 'utf8');
    log(`🔧 Adjusted Gradle wrapper networkTimeout to 120000ms.`, colors.cyan);
  }
}

// Ensure JS bundle is embedded offline into Debug APK (standalone mode)
const buildGradlePath = path.resolve(__dirname, '../android/app/build.gradle');
if (fs.existsSync(buildGradlePath)) {
  let buildGradle = fs.readFileSync(buildGradlePath, 'utf8');
  if (buildGradle.includes('react {') && !buildGradle.includes('debuggableVariants = []')) {
    buildGradle = buildGradle.replace('react {', 'react {\n    debuggableVariants = []');
    fs.writeFileSync(buildGradlePath, buildGradle, 'utf8');
    log(`📦 Configured debuggableVariants = [] (Standalone offline JS bundle mode enabled).`, colors.cyan);
  }
}

// ─── 4. Gradle assembleDebug ───────────────────────────────────────────────────
log(`\n🔨 Compiling Debug APK with Gradle (assembleDebug)...`, colors.bold + colors.cyan);
const isWindows = process.platform === 'win32';
const gradlewCmd = isWindows ? 'gradlew.bat' : './gradlew';

const gradleRes = spawnSync(gradlewCmd, ['assembleDebug'], {
  cwd: path.resolve(__dirname, '../android'),
  shell: true,
  stdio: 'inherit',
  env: devEnv
});

if (gradleRes.status !== 0) {
  log(`\n❌ Gradle assembleDebug failed with code ${gradleRes.status}`, colors.bold + colors.red);
  process.exit(gradleRes.status || 1);
}

// ─── 5. Output Artifact Verification ──────────────────────────────────────────
const apkPath = path.resolve(__dirname, '../android/app/build/outputs/apk/debug/app-debug.apk');

if (fs.existsSync(apkPath)) {
  const stats = fs.statSync(apkPath);
  const sizeMb = (stats.size / (1024 * 1024)).toFixed(2);

  log(`\n======================================================`, colors.bold + colors.green);
  log(`🎉 Debug APK Build Successful!`, colors.bold + colors.green);
  log(`======================================================`, colors.bold + colors.green);
  log(`📁 Artifact: ${apkPath}`, colors.cyan);
  log(`⚖️  Size:     ${sizeMb} MB`, colors.cyan);
  log(`📱 App Name: Habit Tracker (Dev)`, colors.cyan);
  log(`📦 Package:  com.habittracker.app.dev`, colors.cyan);
  log(`\nTo install on a connected device / emulator:`, colors.bold + colors.yellow);
  log(`   adb install -r "${apkPath}"\n`, colors.yellow);
} else {
  log(`\n⚠️  Build completed, but artifact was not found at: ${apkPath}`, colors.bold + colors.yellow);
  process.exit(1);
}

