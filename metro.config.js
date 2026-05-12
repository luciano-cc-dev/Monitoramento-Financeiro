const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

const { transformer, resolver } = config;

config.resolver.assetExts.push('wasm');
config.resolver.sourceExts.push('wasm'); // Às vezes necessário dependendo da versão

module.exports = config;