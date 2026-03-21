/**
 * Bing Search Engine - Uses Playwright to search and extract results
 */
import { PlaywrightManager } from '../playwright/manager';
import { SearchResponse } from './types';
export interface BingSearchOptions {
    /** Maximum number of results to return */
    maxResults?: number;
    /** Navigation timeout in milliseconds */
    navigationTimeout?: number;
    /** Wait for results timeout in milliseconds */
    waitTimeout?: number;
}
export declare class BingSearch {
    private playwrightManager;
    constructor(playwrightManager: PlaywrightManager);
    /**
     * Perform Bing search and extract results
     */
    search(connectionId: string, query: string, options?: BingSearchOptions): Promise<SearchResponse>;
    /**
     * Get detailed content from a search result URL
     */
    getResultContent(connectionId: string, url: string): Promise<string>;
}
//# sourceMappingURL=bing.d.ts.map