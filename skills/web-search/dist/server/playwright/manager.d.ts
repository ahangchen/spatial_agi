/**
 * Playwright Manager - Manages browser connections and page sessions using Playwright
 */
import { Browser, Page, BrowserContext } from 'playwright-core';
export interface Connection {
    id: string;
    browser: Browser;
    context: BrowserContext;
    pages: Map<string, Page>;
    connectedAt: number;
}
export declare class PlaywrightManager {
    private connections;
    private isConnectionAlive;
    private pruneDeadConnections;
    /**
     * Get CDP WebSocket debugger URL
     */
    private getCDPWebSocketUrl;
    /**
     * Connect to Chrome via CDP using Playwright
     */
    connectToCDP(port?: number): Promise<string>;
    /**
     * Get or create a page for the connection
     */
    getPage(connectionId: string): Promise<Page>;
    /**
     * Create a new page in the connection
     */
    createPage(connectionId: string): Promise<Page>;
    /**
     * Close a specific page
     */
    closePage(connectionId: string, page: Page): Promise<void>;
    /**
     * Get connection info
     */
    getConnection(connectionId: string): Connection | undefined;
    /**
     * List all active connections
     */
    listConnections(): Array<{
        id: string;
        connectedAt: number;
        pageCount: number;
    }>;
    /**
     * Disconnect from browser
     */
    disconnect(connectionId: string): Promise<void>;
    /**
     * Disconnect all connections
     */
    disconnectAll(): Promise<void>;
    /**
     * Check if connection exists and is valid
     */
    isConnected(connectionId: string): boolean;
    /**
     * Get connection count
     */
    getConnectionCount(): number;
}
//# sourceMappingURL=manager.d.ts.map