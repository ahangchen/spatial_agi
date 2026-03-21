"use strict";
/**
 * Web Search Skill - Bridge Server
 * Provides HTTP API for browser control and search operations
 */
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BridgeServer = void 0;
const express_1 = __importDefault(require("express"));
const manager_1 = require("./playwright/manager");
const browser_1 = require("./playwright/browser");
const bing_1 = require("./search/bing");
const google_1 = require("./search/google");
const operations_1 = require("./playwright/operations");
const config_1 = require("./config");
function collectStringValues(input, out) {
    if (typeof input === 'string') {
        out.push(input);
        return;
    }
    if (Array.isArray(input)) {
        for (const item of input) {
            collectStringValues(item, out);
        }
        return;
    }
    if (input && typeof input === 'object') {
        for (const value of Object.values(input)) {
            collectStringValues(value, out);
        }
    }
}
function scoreDecodedJsonText(text) {
    let parsed;
    try {
        parsed = JSON.parse(text);
    }
    catch {
        return -10000;
    }
    const values = [];
    collectStringValues(parsed, values);
    const joined = values.join('\n');
    if (!joined)
        return 0;
    const cjkCount = (joined.match(/[\u3400-\u9FFF]/g) || []).length;
    const replacementCount = (joined.match(/\uFFFD/g) || []).length;
    const mojibakeCount = (joined.match(/[ÃÂÐÑØÙÞæçèéêëìíîïðñòóôõöøùúûüýþÿ]/g) || []).length;
    const nonAsciiCount = (joined.match(/[^\x00-\x7F]/g) || []).length;
    return cjkCount * 4 + nonAsciiCount - replacementCount * 8 - mojibakeCount * 3;
}
function decodeJsonRequestBody(raw) {
    if (raw.length === 0) {
        return '';
    }
    if (raw.length >= 3 && raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf) {
        return new TextDecoder('utf-8', { fatal: false }).decode(raw.subarray(3));
    }
    if (raw.length >= 2 && raw[0] === 0xff && raw[1] === 0xfe) {
        return new TextDecoder('utf-16le', { fatal: false }).decode(raw.subarray(2));
    }
    if (raw.length >= 2 && raw[0] === 0xfe && raw[1] === 0xff) {
        return new TextDecoder('utf-16be', { fatal: false }).decode(raw.subarray(2));
    }
    let utf8Decoded = null;
    try {
        utf8Decoded = new TextDecoder('utf-8', { fatal: true }).decode(raw);
    }
    catch {
        utf8Decoded = null;
    }
    let gbDecoded = null;
    try {
        gbDecoded = new TextDecoder('gb18030', { fatal: true }).decode(raw);
    }
    catch {
        gbDecoded = null;
    }
    if (utf8Decoded && gbDecoded) {
        const utf8Score = scoreDecodedJsonText(utf8Decoded);
        const gbScore = scoreDecodedJsonText(gbDecoded);
        if (gbScore > utf8Score) {
            console.warn(`[Bridge Server] Request body decoded using gb18030 (score ${gbScore} > utf8 ${utf8Score})`);
            return gbDecoded;
        }
        return utf8Decoded;
    }
    if (utf8Decoded) {
        return utf8Decoded;
    }
    if (gbDecoded) {
        console.warn('[Bridge Server] Request body decoded using gb18030 fallback');
        return gbDecoded;
    }
    return new TextDecoder('utf-8', { fatal: false }).decode(raw);
}
class BridgeServer {
    constructor(config) {
        this.browserInstance = null;
        this.httpServer = null;
        this.config = (0, config_1.mergeConfig)(config);
        this.app = (0, express_1.default)();
        this.playwrightManager = new manager_1.PlaywrightManager();
        this.bingSearch = new bing_1.BingSearch(this.playwrightManager);
        this.googleSearch = new google_1.GoogleSearch(this.playwrightManager);
        this.setupMiddleware();
        this.setupRoutes();
    }
    setupMiddleware() {
        this.app.use(express_1.default.raw({
            type: ['application/json', 'application/*+json'],
            limit: '2mb',
        }));
        this.app.use((req, res, next) => {
            const contentType = req.headers['content-type'];
            const isJsonRequest = Array.isArray(contentType)
                ? contentType.some((value) => value.includes('application/json') || value.includes('+json'))
                : typeof contentType === 'string'
                    ? contentType.includes('application/json') || contentType.includes('+json')
                    : false;
            if (!isJsonRequest) {
                if (!req.body || typeof req.body !== 'object' || Buffer.isBuffer(req.body)) {
                    req.body = {};
                }
                next();
                return;
            }
            const rawBody = Buffer.isBuffer(req.body) ? req.body : Buffer.alloc(0);
            if (rawBody.length === 0) {
                req.body = {};
                next();
                return;
            }
            try {
                const decoded = decodeJsonRequestBody(rawBody);
                req.body = JSON.parse(decoded);
                next();
            }
            catch (error) {
                res.status(400).json({
                    success: false,
                    error: `Invalid JSON body: ${error instanceof Error ? error.message : String(error)}`
                });
            }
        });
        // CORS for localhost only
        this.app.use((req, res, next) => {
            res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:*');
            res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE');
            res.header('Access-Control-Allow-Headers', 'Content-Type');
            next();
        });
        // Request logging
        this.app.use((req, res, next) => {
            console.log(`[API] ${req.method} ${req.path}`);
            next();
        });
    }
    setupRoutes() {
        // Health check
        this.app.get('/api/health', this.handleHealth.bind(this));
        // Browser management
        this.app.post('/api/browser/launch', this.handleBrowserLaunch.bind(this));
        this.app.post('/api/browser/connect', this.handleBrowserConnect.bind(this));
        this.app.post('/api/browser/disconnect', this.handleBrowserDisconnect.bind(this));
        this.app.get('/api/browser/status', this.handleBrowserStatus.bind(this));
        // Search operations
        this.app.post('/api/search', this.handleSearch.bind(this));
        this.app.post('/api/search/content', this.handleGetContent.bind(this));
        // Page operations
        this.app.post('/api/page/navigate', this.handleNavigate.bind(this));
        this.app.post('/api/page/screenshot', this.handleScreenshot.bind(this));
        this.app.post('/api/page/content', this.handlePageContent.bind(this));
        this.app.post('/api/page/text', this.handlePageText.bind(this));
        // Connection management
        this.app.get('/api/connections', this.handleListConnections.bind(this));
    }
    isBrowserProcessAlive(instance) {
        if (!instance) {
            return false;
        }
        if (!(0, browser_1.isBrowserRunning)(instance)) {
            return false;
        }
        try {
            process.kill(instance.pid, 0);
            return true;
        }
        catch {
            return false;
        }
    }
    async isCdpReachable(port) {
        try {
            const response = await fetch(`http://127.0.0.1:${port}/json/version`, {
                signal: AbortSignal.timeout(1500)
            });
            return response.ok;
        }
        catch {
            return false;
        }
    }
    async resetBrowserState() {
        await this.playwrightManager.disconnectAll();
        if (this.browserInstance) {
            try {
                await (0, browser_1.closeBrowser)(this.browserInstance);
            }
            catch (error) {
                console.warn(`[Bridge Server] Failed to close stale browser instance: ${error instanceof Error ? error.message : String(error)}`);
            }
            this.browserInstance = null;
        }
    }
    async ensureBrowserReady() {
        if (this.browserInstance) {
            const processAlive = this.isBrowserProcessAlive(this.browserInstance);
            const cdpReachable = processAlive ? await this.isCdpReachable(this.browserInstance.cdpPort) : false;
            if (processAlive && cdpReachable) {
                return { instance: this.browserInstance, reused: true };
            }
            console.warn('[Bridge Server] Detected stale browser instance, relaunching...');
            await this.resetBrowserState();
        }
        this.browserInstance = await (0, browser_1.launchBrowser)(this.config.browser);
        return { instance: this.browserInstance, reused: false };
    }
    // Health check endpoint
    handleHealth(req, res) {
        res.json({
            success: true,
            data: {
                status: 'healthy',
                uptime: process.uptime(),
                connections: this.playwrightManager.getConnectionCount()
            }
        });
    }
    // Launch browser
    async handleBrowserLaunch(req, res) {
        try {
            const { instance, reused } = await this.ensureBrowserReady();
            if (reused) {
                res.json({
                    success: true,
                    data: {
                        message: 'Browser already running',
                        pid: instance.pid,
                        cdpPort: instance.cdpPort
                    }
                });
                return;
            }
            res.json({
                success: true,
                data: {
                    pid: instance.pid,
                    cdpPort: instance.cdpPort,
                    startTime: instance.startTime
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
    // Connect to browser via Playwright
    async handleBrowserConnect(req, res) {
        try {
            const { cdpPort } = req.body;
            let port = cdpPort;
            // If client does not specify a port, ensure managed browser is healthy first.
            if (!port) {
                const { instance } = await this.ensureBrowserReady();
                port = instance.cdpPort;
            }
            const connectionId = await this.playwrightManager.connectToCDP(port);
            res.json({
                success: true,
                data: {
                    connectionId,
                    cdpPort: port
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
    // Disconnect from browser
    async handleBrowserDisconnect(req, res) {
        try {
            const { connectionId } = req.body;
            if (!connectionId) {
                res.status(400).json({
                    success: false,
                    error: 'connectionId is required'
                });
                return;
            }
            await this.playwrightManager.disconnect(connectionId);
            res.json({
                success: true,
                data: { message: 'Disconnected successfully' }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
    // Get browser status
    async handleBrowserStatus(req, res) {
        const processAlive = this.isBrowserProcessAlive(this.browserInstance);
        const cdpReachable = processAlive && this.browserInstance
            ? await this.isCdpReachable(this.browserInstance.cdpPort)
            : false;
        res.json({
            success: true,
            data: {
                browserRunning: processAlive && cdpReachable,
                processAlive,
                cdpReachable,
                connections: this.playwrightManager.getConnectionCount(),
                pid: this.browserInstance?.pid,
                cdpPort: this.browserInstance?.cdpPort
            }
        });
    }
    // Search operation
    async handleSearch(req, res) {
        try {
            const { connectionId, query, maxResults, engine } = req.body;
            if (!connectionId || !query) {
                res.status(400).json({
                    success: false,
                    error: 'connectionId and query are required'
                });
                return;
            }
            const preferredEngine = this.normalizeEnginePreference(engine);
            const results = await this.searchWithFallback(connectionId, query, maxResults, preferredEngine);
            res.json({
                success: true,
                data: results
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
    normalizeEnginePreference(engine) {
        if (engine === 'google' || engine === 'bing' || engine === 'auto') {
            return engine;
        }
        return this.config.search.defaultEngine;
    }
    resolveSearchEngineOrder(preferredEngine) {
        if (preferredEngine === 'google' || preferredEngine === 'bing') {
            return [preferredEngine];
        }
        const configuredOrder = this.config.search.fallbackOrder.filter((item) => item === 'google' || item === 'bing');
        const fullOrder = [...configuredOrder, 'google', 'bing'];
        return Array.from(new Set(fullOrder));
    }
    async searchWithFallback(connectionId, query, maxResults, preferredEngine) {
        const engineOrder = this.resolveSearchEngineOrder(preferredEngine);
        const errors = [];
        for (const engine of engineOrder) {
            try {
                console.log(`[Search] Trying engine: ${engine}`);
                if (engine === 'google') {
                    return await this.googleSearch.search(connectionId, query, { maxResults });
                }
                return await this.bingSearch.search(connectionId, query, { maxResults });
            }
            catch (error) {
                const message = error instanceof Error ? error.message : String(error);
                errors.push(`${engine}: ${message}`);
                console.warn(`[Search] Engine failed (${engine}): ${message}`);
            }
        }
        throw new Error(`All configured search engines failed. ${errors.join(' | ')}`);
    }
    // Get content from URL
    async handleGetContent(req, res) {
        try {
            const { connectionId, url } = req.body;
            if (!connectionId || !url) {
                res.status(400).json({
                    success: false,
                    error: 'connectionId and url are required'
                });
                return;
            }
            const content = await this.bingSearch.getResultContent(connectionId, url);
            res.json({
                success: true,
                data: { content }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
    // Navigate to URL
    async handleNavigate(req, res) {
        try {
            const { connectionId, url, waitUntil, timeout } = req.body;
            if (!connectionId || !url) {
                res.status(400).json({
                    success: false,
                    error: 'connectionId and url are required'
                });
                return;
            }
            const page = await this.playwrightManager.getPage(connectionId);
            await (0, operations_1.navigate)(page, { url, waitUntil, timeout });
            res.json({
                success: true,
                data: { url: page.url() }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
    // Take screenshot
    async handleScreenshot(req, res) {
        try {
            const { connectionId, format = 'png', fullPage = false } = req.body;
            if (!connectionId) {
                res.status(400).json({
                    success: false,
                    error: 'connectionId is required'
                });
                return;
            }
            const page = await this.playwrightManager.getPage(connectionId);
            const buffer = await (0, operations_1.screenshot)(page, { format, fullPage });
            res.json({
                success: true,
                data: {
                    screenshot: buffer.toString('base64'),
                    format,
                    size: buffer.length
                }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
    // Get page HTML content
    async handlePageContent(req, res) {
        try {
            const { connectionId } = req.body;
            if (!connectionId) {
                res.status(400).json({
                    success: false,
                    error: 'connectionId is required'
                });
                return;
            }
            const page = await this.playwrightManager.getPage(connectionId);
            const content = await (0, operations_1.getContent)(page);
            res.json({
                success: true,
                data: { content }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
    // Get page text content
    async handlePageText(req, res) {
        try {
            const { connectionId } = req.body;
            if (!connectionId) {
                res.status(400).json({
                    success: false,
                    error: 'connectionId is required'
                });
                return;
            }
            const page = await this.playwrightManager.getPage(connectionId);
            const text = await (0, operations_1.getTextContent)(page);
            res.json({
                success: true,
                data: { text }
            });
        }
        catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : String(error)
            });
        }
    }
    // List all connections
    handleListConnections(req, res) {
        const connections = this.playwrightManager.listConnections();
        res.json({
            success: true,
            data: { connections }
        });
    }
    /**
     * Start the server
     */
    async start() {
        return new Promise((resolve, reject) => {
            const server = this.app.listen(this.config.server.port, this.config.server.host);
            this.httpServer = server;
            server.once('error', (error) => {
                this.httpServer = null;
                reject(error);
            });
            server.once('listening', () => {
                console.log(`\n[Bridge Server] Started on http://${this.config.server.host}:${this.config.server.port}`);
                console.log(`[Bridge Server] Health check: http://${this.config.server.host}:${this.config.server.port}/api/health\n`);
                resolve();
            });
        });
    }
    /**
     * Stop the server and cleanup
     */
    async stop() {
        console.log('\n[Bridge Server] Shutting down...');
        // Disconnect all Playwright connections
        await this.playwrightManager.disconnectAll();
        // Close browser if running
        if (this.browserInstance) {
            await (0, browser_1.closeBrowser)(this.browserInstance);
            this.browserInstance = null;
        }
        if (this.httpServer) {
            await new Promise((resolve, reject) => {
                this.httpServer?.close((error) => {
                    if (error) {
                        reject(error);
                        return;
                    }
                    resolve();
                });
            });
            this.httpServer = null;
        }
        console.log('[Bridge Server] Shutdown complete\n');
    }
}
exports.BridgeServer = BridgeServer;
// Main entry point
if (require.main === module) {
    const server = new BridgeServer();
    // Handle graceful shutdown
    process.on('SIGINT', async () => {
        await server.stop();
        process.exit(0);
    });
    process.on('SIGTERM', async () => {
        await server.stop();
        process.exit(0);
    });
    // Start server
    server.start().catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
}
exports.default = BridgeServer;
//# sourceMappingURL=index.js.map