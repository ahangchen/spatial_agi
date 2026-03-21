"use strict";
/**
 * Playwright Manager - Manages browser connections and page sessions using Playwright
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PlaywrightManager = void 0;
const playwright_core_1 = require("playwright-core");
const uuid_1 = require("uuid");
class PlaywrightManager {
    constructor() {
        this.connections = new Map();
    }
    isConnectionAlive(conn) {
        try {
            if (!conn.browser.isConnected()) {
                return false;
            }
            // Accessing pages throws when context is already closed.
            conn.context.pages();
            return true;
        }
        catch {
            return false;
        }
    }
    pruneDeadConnections() {
        for (const [connectionId, conn] of this.connections.entries()) {
            if (!this.isConnectionAlive(conn)) {
                console.warn(`[Playwright] Removing stale connection: ${connectionId}`);
                this.connections.delete(connectionId);
            }
        }
    }
    /**
     * Get CDP WebSocket debugger URL
     */
    async getCDPWebSocketUrl(port) {
        const response = await fetch(`http://127.0.0.1:${port}/json/version`);
        const data = await response.json();
        return data.webSocketDebuggerUrl;
    }
    /**
     * Connect to Chrome via CDP using Playwright
     */
    async connectToCDP(port = 9222) {
        try {
            console.log(`[Playwright] Connecting to CDP on port ${port}`);
            const wsUrl = await this.getCDPWebSocketUrl(port);
            console.log(`[Playwright] CDP WebSocket URL: ${wsUrl}`);
            const browser = await playwright_core_1.chromium.connectOverCDP(wsUrl);
            console.log(`[Playwright] Connected to browser`);
            // Get or create browser context
            const contexts = browser.contexts();
            let context;
            if (contexts.length === 0) {
                console.log(`[Playwright] No existing context, creating new one`);
                context = await browser.newContext();
            }
            else {
                console.log(`[Playwright] Using existing context`);
                context = contexts[0];
            }
            const connectionId = (0, uuid_1.v4)();
            const connection = {
                id: connectionId,
                browser,
                context,
                pages: new Map(),
                connectedAt: Date.now()
            };
            this.connections.set(connectionId, connection);
            console.log(`[Playwright] Connection established: ${connectionId}`);
            return connectionId;
        }
        catch (error) {
            console.error(`[Playwright] Failed to connect to CDP:`, error);
            throw new Error(`Failed to connect to CDP: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get or create a page for the connection
     */
    async getPage(connectionId) {
        this.pruneDeadConnections();
        const conn = this.connections.get(connectionId);
        if (!conn) {
            throw new Error(`Connection not found: ${connectionId}`);
        }
        if (!this.isConnectionAlive(conn)) {
            this.connections.delete(connectionId);
            throw new Error(`Connection not active: ${connectionId}`);
        }
        // Check for existing pages in the context
        const contextPages = conn.context.pages().filter(page => !page.isClosed());
        if (contextPages.length === 0) {
            console.log(`[Playwright] No existing pages, creating new page`);
            try {
                const page = await conn.context.newPage();
                conn.pages.set(page.url(), page);
                return page;
            }
            catch (error) {
                this.connections.delete(connectionId);
                throw new Error(`Connection became invalid: ${error instanceof Error ? error.message : String(error)}`);
            }
        }
        // Return the first page (main page)
        const page = contextPages[0];
        console.log(`[Playwright] Using existing page: ${page.url()}`);
        return page;
    }
    /**
     * Create a new page in the connection
     */
    async createPage(connectionId) {
        this.pruneDeadConnections();
        const conn = this.connections.get(connectionId);
        if (!conn) {
            throw new Error(`Connection not found: ${connectionId}`);
        }
        if (!this.isConnectionAlive(conn)) {
            this.connections.delete(connectionId);
            throw new Error(`Connection not active: ${connectionId}`);
        }
        console.log(`[Playwright] Creating new page for connection ${connectionId}`);
        try {
            const page = await conn.context.newPage();
            conn.pages.set(page.url(), page);
            return page;
        }
        catch (error) {
            this.connections.delete(connectionId);
            throw new Error(`Connection became invalid: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Close a specific page
     */
    async closePage(connectionId, page) {
        const conn = this.connections.get(connectionId);
        if (!conn) {
            throw new Error(`Connection not found: ${connectionId}`);
        }
        console.log(`[Playwright] Closing page: ${page.url()}`);
        await page.close();
        conn.pages.delete(page.url());
    }
    /**
     * Get connection info
     */
    getConnection(connectionId) {
        this.pruneDeadConnections();
        return this.connections.get(connectionId);
    }
    /**
     * List all active connections
     */
    listConnections() {
        this.pruneDeadConnections();
        return Array.from(this.connections.values()).map(conn => ({
            id: conn.id,
            connectedAt: conn.connectedAt,
            pageCount: conn.context.pages().filter(page => !page.isClosed()).length
        }));
    }
    /**
     * Disconnect from browser
     */
    async disconnect(connectionId) {
        const conn = this.connections.get(connectionId);
        if (!conn) {
            console.warn(`[Playwright] Connection not found: ${connectionId}`);
            return;
        }
        console.log(`[Playwright] Disconnecting connection: ${connectionId}`);
        try {
            // Close all pages
            const pages = conn.context.pages();
            for (const page of pages) {
                try {
                    await page.close();
                }
                catch (error) {
                    console.warn(`[Playwright] Failed to close page:`, error);
                }
            }
            // Close context (if we created it)
            try {
                await conn.context.close();
            }
            catch (error) {
                console.warn(`[Playwright] Failed to close context:`, error);
            }
            // Close browser connection
            await conn.browser.close();
            console.log(`[Playwright] Browser connection closed: ${connectionId}`);
        }
        catch (error) {
            console.error(`[Playwright] Error during disconnect:`, error);
        }
        finally {
            this.connections.delete(connectionId);
        }
    }
    /**
     * Disconnect all connections
     */
    async disconnectAll() {
        console.log(`[Playwright] Disconnecting all connections (${this.connections.size})`);
        const connectionIds = Array.from(this.connections.keys());
        for (const connectionId of connectionIds) {
            await this.disconnect(connectionId);
        }
    }
    /**
     * Check if connection exists and is valid
     */
    isConnected(connectionId) {
        this.pruneDeadConnections();
        const conn = this.connections.get(connectionId);
        if (!conn) {
            return false;
        }
        return this.isConnectionAlive(conn);
    }
    /**
     * Get connection count
     */
    getConnectionCount() {
        this.pruneDeadConnections();
        return this.connections.size;
    }
}
exports.PlaywrightManager = PlaywrightManager;
//# sourceMappingURL=manager.js.map