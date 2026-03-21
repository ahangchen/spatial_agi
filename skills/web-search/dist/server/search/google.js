"use strict";
/**
 * Google Search Engine - Uses Playwright to search and extract results
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleSearch = void 0;
class GoogleSearch {
    constructor(playwrightManager) {
        this.playwrightManager = playwrightManager;
    }
    /**
     * Perform Google search and extract results
     */
    async search(connectionId, query, options = {}) {
        const startTime = Date.now();
        const maxResults = options.maxResults || 10;
        const navigationTimeout = options.navigationTimeout || 15000;
        const waitTimeout = options.waitTimeout || 10000;
        console.log(`[Google] Searching for: "${query}" (max ${maxResults} results)`);
        const page = await this.playwrightManager.getPage(connectionId);
        try {
            const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}&hl=en`;
            console.log(`[Google] Navigating to: ${searchUrl}`);
            await page.goto(searchUrl, {
                waitUntil: 'domcontentloaded',
                timeout: navigationTimeout
            });
            console.log(`[Google] Page loaded: ${page.url()}`);
            try {
                await page.waitForSelector('div#search a h3, div#search div.g', { timeout: waitTimeout });
                console.log('[Google] Search results found');
            }
            catch (error) {
                const isBlocked = await this.isUnavailablePage(page);
                if (isBlocked) {
                    throw new Error('Google appears blocked or unavailable from this network');
                }
                throw new Error('Google search results did not load in time');
            }
            const results = await page.evaluate((max) => {
                const parseGoogleUrl = (rawUrl) => {
                    if (!rawUrl) {
                        return '';
                    }
                    try {
                        const parsed = new URL(rawUrl, window.location.origin);
                        const normalized = `${parsed.origin}${parsed.pathname}`;
                        if (normalized.endsWith('/url')) {
                            const target = parsed.searchParams.get('q') || parsed.searchParams.get('url');
                            return target || '';
                        }
                        return parsed.href;
                    }
                    catch {
                        return '';
                    }
                };
                const isSearchPageUrl = (url) => {
                    if (!url) {
                        return true;
                    }
                    try {
                        const parsed = new URL(url);
                        if (!parsed.hostname.includes('google.')) {
                            return false;
                        }
                        return parsed.pathname === '/search' || parsed.pathname === '/url';
                    }
                    catch {
                        return true;
                    }
                };
                const extractedResults = [];
                const seenUrls = new Set();
                const candidateItems = Array.from(document.querySelectorAll('div#search div.g'));
                const pickTitleAndLink = (element) => {
                    const titleNode = element.querySelector('h3');
                    const anchorNode = titleNode?.closest('a') || element.querySelector('a[href]');
                    const title = titleNode?.textContent?.trim() || anchorNode?.textContent?.trim() || '';
                    const rawUrl = anchorNode?.href || '';
                    const url = parseGoogleUrl(rawUrl);
                    return { title, url };
                };
                for (const item of candidateItems) {
                    if (extractedResults.length >= max) {
                        break;
                    }
                    const { title, url } = pickTitleAndLink(item);
                    const snippetNode = item.querySelector('.VwiC3b, .yXK7lf, span.aCOpRe, div.IsZvec');
                    const snippet = snippetNode?.textContent?.trim() || '';
                    if (!title || !url || isSearchPageUrl(url) || seenUrls.has(url)) {
                        continue;
                    }
                    seenUrls.add(url);
                    extractedResults.push({
                        title,
                        url,
                        snippet,
                        source: 'google',
                        position: extractedResults.length + 1
                    });
                }
                if (extractedResults.length === 0) {
                    const titleNodes = Array.from(document.querySelectorAll('div#search a h3'));
                    for (const titleNode of titleNodes) {
                        if (extractedResults.length >= max) {
                            break;
                        }
                        const anchorNode = titleNode.closest('a');
                        const rawUrl = anchorNode?.href || '';
                        const url = parseGoogleUrl(rawUrl);
                        const title = titleNode.textContent?.trim() || '';
                        if (!title || !url || isSearchPageUrl(url) || seenUrls.has(url)) {
                            continue;
                        }
                        seenUrls.add(url);
                        extractedResults.push({
                            title,
                            url,
                            snippet: '',
                            source: 'google',
                            position: extractedResults.length + 1
                        });
                    }
                }
                return extractedResults;
            }, maxResults);
            if (results.length === 0) {
                throw new Error('Google returned no parsable results');
            }
            const duration = Date.now() - startTime;
            console.log(`[Google] Extracted ${results.length} results in ${duration}ms`);
            return {
                query,
                engine: 'google',
                results,
                totalResults: results.length,
                timestamp: Date.now(),
                duration
            };
        }
        catch (error) {
            console.error('[Google] Search failed:', error);
            throw new Error(`Google search failed: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    /**
     * Get detailed content from a search result URL
     */
    async getResultContent(connectionId, url) {
        console.log(`[Google] Fetching content from: ${url}`);
        const page = await this.playwrightManager.getPage(connectionId);
        try {
            await page.goto(url, {
                waitUntil: 'domcontentloaded',
                timeout: 15000
            });
            const content = await page.textContent('body') || '';
            console.log(`[Google] Content retrieved (${content.length} chars)`);
            return content;
        }
        catch (error) {
            console.error('[Google] Failed to fetch content:', error);
            throw new Error(`Failed to fetch content: ${error instanceof Error ? error.message : String(error)}`);
        }
    }
    async isUnavailablePage(page) {
        const url = page.url().toLowerCase();
        if (url.includes('/sorry') || url.includes('consent.google.com')) {
            return true;
        }
        const bodyText = (await page.textContent('body'))?.toLowerCase() || '';
        return (bodyText.includes('unusual traffic') ||
            bodyText.includes('before you continue to google') ||
            bodyText.includes('this site can\'t be reached'));
    }
}
exports.GoogleSearch = GoogleSearch;
//# sourceMappingURL=google.js.map