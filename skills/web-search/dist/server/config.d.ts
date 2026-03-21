/**
 * Web Search Skill Configuration
 */
export interface BrowserConfig {
    /** Chrome executable path (auto-detected if not provided) */
    chromePath?: string;
    /** CDP debugging port */
    cdpPort: number;
    /** User data directory for browser isolation */
    userDataDir?: string;
    /** Whether to run browser headless */
    headless: boolean;
    /** Additional Chrome flags */
    chromeFlags?: string[];
}
export interface ServerConfig {
    /** Bridge server port */
    port: number;
    /** Bridge server host */
    host: string;
}
export interface SearchConfig {
    /** Default search engine */
    defaultEngine: 'auto' | 'bing' | 'google';
    /** Engine fallback order when defaultEngine is auto */
    fallbackOrder: Array<'google' | 'bing'>;
    /** Default max results per search */
    defaultMaxResults: number;
    /** Search timeout in milliseconds */
    searchTimeout: number;
    /** Navigation timeout in milliseconds */
    navigationTimeout: number;
}
export interface Config {
    browser: BrowserConfig;
    server: ServerConfig;
    search: SearchConfig;
}
/**
 * Default configuration
 */
export declare const defaultConfig: Config;
/**
 * Merge user config with defaults
 */
export declare function mergeConfig(userConfig?: Partial<Config>): Config;
//# sourceMappingURL=config.d.ts.map