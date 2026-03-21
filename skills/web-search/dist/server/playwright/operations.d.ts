/**
 * Browser Operations - Common browser operations using Playwright Page API
 */
import { Page } from 'playwright-core';
export interface NavigateOptions {
    url: string;
    waitUntil?: 'load' | 'domcontentloaded' | 'networkidle';
    timeout?: number;
}
export interface ScreenshotOptions {
    format?: 'png' | 'jpeg';
    fullPage?: boolean;
    quality?: number;
}
export interface EvaluateOptions {
    expression: string;
    args?: any[];
}
/**
 * Navigate to URL
 */
export declare function navigate(page: Page, options: NavigateOptions): Promise<void>;
/**
 * Take screenshot
 */
export declare function screenshot(page: Page, options?: ScreenshotOptions): Promise<Buffer>;
/**
 * Get page content (HTML)
 */
export declare function getContent(page: Page): Promise<string>;
/**
 * Get page text content
 */
export declare function getTextContent(page: Page): Promise<string>;
/**
 * Evaluate JavaScript expression
 */
export declare function evaluate(page: Page, options: EvaluateOptions): Promise<any>;
/**
 * Wait for selector
 */
export declare function waitForSelector(page: Page, selector: string, timeout?: number): Promise<void>;
/**
 * Click element
 */
export declare function click(page: Page, selector: string): Promise<void>;
/**
 * Type text into input
 */
export declare function type(page: Page, selector: string, text: string): Promise<void>;
/**
 * Get current URL
 */
export declare function getCurrentUrl(page: Page): string;
/**
 * Get page title
 */
export declare function getTitle(page: Page): Promise<string>;
/**
 * Go back in history
 */
export declare function goBack(page: Page): Promise<void>;
/**
 * Go forward in history
 */
export declare function goForward(page: Page): Promise<void>;
/**
 * Reload page
 */
export declare function reload(page: Page): Promise<void>;
/**
 * Wait for navigation
 */
export declare function waitForNavigation(page: Page, timeout?: number): Promise<void>;
/**
 * Set viewport size
 */
export declare function setViewport(page: Page, width: number, height: number): Promise<void>;
//# sourceMappingURL=operations.d.ts.map