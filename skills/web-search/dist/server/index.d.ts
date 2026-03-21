/**
 * Web Search Skill - Bridge Server
 * Provides HTTP API for browser control and search operations
 */
import { Config } from './config';
export declare class BridgeServer {
    private app;
    private playwrightManager;
    private bingSearch;
    private googleSearch;
    private browserInstance;
    private httpServer;
    private config;
    constructor(config?: Partial<Config>);
    private setupMiddleware;
    private setupRoutes;
    private isBrowserProcessAlive;
    private isCdpReachable;
    private resetBrowserState;
    private ensureBrowserReady;
    private handleHealth;
    private handleBrowserLaunch;
    private handleBrowserConnect;
    private handleBrowserDisconnect;
    private handleBrowserStatus;
    private handleSearch;
    private normalizeEnginePreference;
    private resolveSearchEngineOrder;
    private searchWithFallback;
    private handleGetContent;
    private handleNavigate;
    private handleScreenshot;
    private handlePageContent;
    private handlePageText;
    private handleListConnections;
    /**
     * Start the server
     */
    start(): Promise<void>;
    /**
     * Stop the server and cleanup
     */
    stop(): Promise<void>;
}
export default BridgeServer;
//# sourceMappingURL=index.d.ts.map