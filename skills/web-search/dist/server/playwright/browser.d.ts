/**
 * Browser Launcher - Manages Chrome browser lifecycle
 */
import { ChildProcess } from 'child_process';
import { BrowserConfig } from '../config';
export interface BrowserInstance {
    process: ChildProcess;
    pid: number;
    cdpPort: number;
    startTime: number;
}
/**
 * Detect Chromium-based browser executable path across platforms
 */
export declare function getChromePath(): string;
/**
 * Launch Chrome browser with CDP enabled
 */
export declare function launchBrowser(config: BrowserConfig): Promise<BrowserInstance>;
/**
 * Close browser instance
 */
export declare function closeBrowser(instance: BrowserInstance): Promise<void>;
/**
 * Check if browser is running
 */
export declare function isBrowserRunning(instance: BrowserInstance | null): boolean;
//# sourceMappingURL=browser.d.ts.map