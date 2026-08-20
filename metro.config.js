// Minimal Metro config (use Expo defaults)
const { getDefaultConfig } = require('@expo/metro-config');

/** @type {import('metro-config').MetroConfig} */
module.exports = (async () => {
	const projectRoot = __dirname;
	const config = await getDefaultConfig(projectRoot);
	return config;
})();


