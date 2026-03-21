"use strict";
/**
 * Web Search Skill Configuration
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.defaultConfig = void 0;
exports.mergeConfig = mergeConfig;
/**
 * Default configuration
 */
exports.defaultConfig = {
    browser: {
        cdpPort: 9222,
        headless: false, // Always visible for transparency
        chromeFlags: [
            '--no-first-run',
            '--no-default-browser-check',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding'
        ]
    },
    server: {
        port: 8923,
        host: '127.0.0.1' // Localhost only for security
    },
    search: {
        defaultEngine: 'auto',
        fallbackOrder: ['google', 'bing'],
        defaultMaxResults: 10,
        searchTimeout: 30000, // 30 seconds
        navigationTimeout: 15000 // 15 seconds
    }
};
/**
 * Merge user config with defaults
 */
function mergeConfig(userConfig) {
    if (!userConfig) {
        return exports.defaultConfig;
    }
    return {
        browser: { ...exports.defaultConfig.browser, ...userConfig.browser },
        server: { ...exports.defaultConfig.server, ...userConfig.server },
        search: { ...exports.defaultConfig.search, ...userConfig.search }
    };
}
//# sourceMappingURL=config.js.map