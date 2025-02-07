const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const {
  wrapWithReanimatedMetroConfig,
} = require("react-native-reanimated/metro-config");

// Get the default Expo Metro configuration
const defaultConfig = getDefaultConfig(__dirname);

// First, wrap the config with NativeWind
const nativeWindConfig = withNativeWind(defaultConfig, { input: "./global.css" });

// Then, wrap the NativeWind config with Reanimated's config
const finalConfig = wrapWithReanimatedMetroConfig(nativeWindConfig);

// Export the final configuration
module.exports = finalConfig;
