"use strict";
/**
 * Browser Operations - Common browser operations using Playwright Page API
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.navigate = navigate;
exports.screenshot = screenshot;
exports.getContent = getContent;
exports.getTextContent = getTextContent;
exports.evaluate = evaluate;
exports.waitForSelector = waitForSelector;
exports.click = click;
exports.type = type;
exports.getCurrentUrl = getCurrentUrl;
exports.getTitle = getTitle;
exports.goBack = goBack;
exports.goForward = goForward;
exports.reload = reload;
exports.waitForNavigation = waitForNavigation;
exports.setViewport = setViewport;
/**
 * Navigate to URL
 */
async function navigate(page, options) {
    console.log(`[Operations] Navigating to: ${options.url}`);
    await page.goto(options.url, {
        waitUntil: options.waitUntil || 'domcontentloaded',
        timeout: options.timeout || 30000
    });
    console.log(`[Operations] Navigation complete: ${page.url()}`);
}
/**
 * Take screenshot
 */
async function screenshot(page, options = {}) {
    console.log(`[Operations] Taking screenshot (format: ${options.format || 'png'})`);
    const buffer = await page.screenshot({
        type: options.format || 'png',
        fullPage: options.fullPage || false,
        quality: options.quality
    });
    console.log(`[Operations] Screenshot captured (${buffer.length} bytes)`);
    return buffer;
}
/**
 * Get page content (HTML)
 */
async function getContent(page) {
    console.log(`[Operations] Getting page content`);
    const content = await page.content();
    console.log(`[Operations] Content retrieved (${content.length} chars)`);
    return content;
}
/**
 * Get page text content
 */
async function getTextContent(page) {
    console.log(`[Operations] Getting text content`);
    const text = await page.textContent('body') || '';
    console.log(`[Operations] Text content retrieved (${text.length} chars)`);
    return text;
}
/**
 * Evaluate JavaScript expression
 */
async function evaluate(page, options) {
    console.log(`[Operations] Evaluating expression`);
    const result = await page.evaluate((args) => {
        // eslint-disable-next-line no-eval
        return eval(args.expression);
    }, { expression: options.expression, args: options.args || [] });
    console.log(`[Operations] Evaluation complete`);
    return result;
}
/**
 * Wait for selector
 */
async function waitForSelector(page, selector, timeout = 10000) {
    console.log(`[Operations] Waiting for selector: ${selector}`);
    await page.waitForSelector(selector, { timeout });
    console.log(`[Operations] Selector found: ${selector}`);
}
/**
 * Click element
 */
async function click(page, selector) {
    console.log(`[Operations] Clicking element: ${selector}`);
    await page.click(selector);
    console.log(`[Operations] Click complete: ${selector}`);
}
/**
 * Type text into input
 */
async function type(page, selector, text) {
    console.log(`[Operations] Typing into: ${selector}`);
    await page.fill(selector, text);
    console.log(`[Operations] Type complete: ${selector}`);
}
/**
 * Get current URL
 */
function getCurrentUrl(page) {
    return page.url();
}
/**
 * Get page title
 */
async function getTitle(page) {
    return await page.title();
}
/**
 * Go back in history
 */
async function goBack(page) {
    console.log(`[Operations] Going back`);
    await page.goBack();
}
/**
 * Go forward in history
 */
async function goForward(page) {
    console.log(`[Operations] Going forward`);
    await page.goForward();
}
/**
 * Reload page
 */
async function reload(page) {
    console.log(`[Operations] Reloading page`);
    await page.reload();
}
/**
 * Wait for navigation
 */
async function waitForNavigation(page, timeout = 30000) {
    console.log(`[Operations] Waiting for navigation`);
    await page.waitForNavigation({ timeout });
}
/**
 * Set viewport size
 */
async function setViewport(page, width, height) {
    console.log(`[Operations] Setting viewport: ${width}x${height}`);
    await page.setViewportSize({ width, height });
}
//# sourceMappingURL=operations.js.map