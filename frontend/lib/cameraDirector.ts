/**
 * cameraDirector.ts
 *
 * State-driven cinematic camera director for Sahaj PathFinder Presentation Mode.
 * Removes hardcoded timeline pixels/timing by doing DOM-aware and state-aware operations.
 */

/** Pause in place for visual dwell time */
export const observe = (ms: number): Promise<void> =>
  new Promise((resolve) => setTimeout(resolve, ms));

/** Check if element is in viewport */
export function isElementInViewport(el: HTMLElement): boolean {
  const rect = el.getBoundingClientRect();
  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
    rect.right <= (window.innerWidth || document.documentElement.clientWidth)
  );
}

/** Wait until target selector exists and is visible in DOM */
export async function waitVisible(selector: string, timeoutMs = 8000): Promise<HTMLElement> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    const el = document.querySelector(selector) as HTMLElement | null;
    if (el && el.offsetParent !== null) {
      return el;
    }
    await new Promise((r) => setTimeout(r, 100));
  }
  throw new Error(`Timeout waiting for element visible: ${selector}`);
}

/** Scroll until target selector enters the upper 35% of the viewport */
export async function scrollUntilVisible(selector: string, extraDelay = 700): Promise<HTMLElement> {
  const el = await waitVisible(selector);
  const rect = el.getBoundingClientRect();
  
  // Align to upper 35% of screen for executive readability
  const targetY = window.scrollY + rect.top - window.innerHeight * 0.35;
  window.scrollTo({
    top: Math.max(0, targetY),
    behavior: "smooth"
  });
  
  await new Promise((r) => setTimeout(r, extraDelay));
  return el;
}

/** Verify element is visible, inside viewport, stable, then click it */
export async function verifyAndClick(selector: string): Promise<void> {
  const el = await waitVisible(selector);
  
  // Ensure it's inside viewport comfortably
  if (!isElementInViewport(el)) {
    await scrollUntilVisible(selector);
  }
  
  await observe(500); // 500ms pause before human-like click
  el.click();
}

/** Scroll the viewport to center/focus on the result container */
export async function focusResult(selector: string, dwellMs = 1500): Promise<void> {
  const el = await waitVisible(selector);
  const rect = el.getBoundingClientRect();
  const targetY = window.scrollY + rect.top - window.innerHeight * 0.25;
  
  window.scrollTo({
    top: Math.max(0, targetY),
    behavior: "smooth"
  });
  
  await new Promise((r) => setTimeout(r, 400));
  await observe(dwellMs);
}

/** Wait for dynamic UI state / animation check function to return true */
export async function waitStateChange(checkFn: () => boolean, timeoutMs = 10000): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (checkFn()) return;
    await new Promise((r) => setTimeout(r, 100));
  }
}

/** Continuously and smoothly panoramic-scroll downward to the bottom of the page */
export async function panoramicScrollToBottom(stepDelay = 400, stepPx = 120): Promise<void> {
  let lastScrollY = window.scrollY;
  while (true) {
    window.scrollBy({ top: stepPx, behavior: "smooth" });
    await observe(stepDelay);
    
    // Check if we hit bottom
    if (window.scrollY === lastScrollY || (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 5)) {
      break;
    }
    lastScrollY = window.scrollY;
  }
  await observe(800); // Settle pause at bottom
}
