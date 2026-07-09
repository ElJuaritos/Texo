const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");

const projectRoot = __dirname;
const workspaceRoot = path.resolve(projectRoot, "../..");

/** Metro monorepo — RN/React únicos desde node_modules del workspace. */
const config = getDefaultConfig(projectRoot);

const defaultWatchFolders = config.watchFolders ?? [];
config.watchFolders = [...new Set([...defaultWatchFolders, workspaceRoot])];

config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, "node_modules"),
  path.resolve(workspaceRoot, "node_modules"),
];

const rootModules = path.resolve(workspaceRoot, "node_modules");
config.resolver.extraNodeModules = {
  "@texo/shared": path.resolve(workspaceRoot, "packages/shared/src"),
  react: path.resolve(rootModules, "react"),
  "react-native": path.resolve(rootModules, "react-native"),
};

module.exports = config;
