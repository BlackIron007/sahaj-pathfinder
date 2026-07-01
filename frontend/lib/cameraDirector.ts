/**
 * cameraDirector.ts
 *
 * State-driven cinematic camera director for Sahaj PathFinder Presentation Mode.
 * Removes robotic step-scrolling and implements continuous smooth easing scroll animations.
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

/** Natively animate window scroll position smoothly over time using requestAnimationFrame with cubic ease-in-out easing */
export function animateScrollTo(targetY: number, duration = 1200): Promise<void> {
  return new Promise((resolve) => {
    if (typeof window === "undefined") {
      resolve();
      return;
    }
    const startY = window.scrollY;
    const difference = targetY - startY;
    const startTime = performance.now();

    if (Math.abs(difference) < 2) {
      window.scrollTo(0, targetY);
      resolve();
      return;
    }

    function step(now: number) {
      const elapsed = now - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Cubic ease-in-out curve: acceleration -> constant motion -> deceleration
      const ease = progress < 0.5 
        ? 4 * progress * progress * progress 
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;

      window.scrollTo(0, startY + difference * ease);

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        resolve();
      }
    }
    requestAnimationFrame(step);
  });
}

/** Scroll until target selector enters the upper 35% of the viewport smoothly at consistent speed */
export async function scrollUntilVisible(selector: string): Promise<HTMLElement> {
  const el = await waitVisible(selector);
  const rect = el.getBoundingClientRect();
  
  // Align to upper 35% of screen for executive readability
  const targetScrollY = window.scrollY + rect.top - window.innerHeight * 0.35;
  const clampedTarget = Math.max(0, targetScrollY);
  
  // Determine duration proportionally based on distance to keep scroll speed consistent (approx 1.5px/ms)
  const distance = Math.abs(clampedTarget - window.scrollY);
  const duration = Math.max(800, Math.min(2500, distance / 1.5));
  
  await animateScrollTo(clampedTarget, duration);
  await observe(600); // settle
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
  if (typeof el.click === "function") {
    el.click();
  } else {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true }));
  }
}

/** Scroll the viewport to center/focus on the result container */
export async function focusResult(selector: string, dwellMs = 1500): Promise<void> {
  const el = await waitVisible(selector);
  const rect = el.getBoundingClientRect();
  const targetY = window.scrollY + rect.top - window.innerHeight * 0.25;
  const clampedTarget = Math.max(0, targetY);
  
  const distance = Math.abs(clampedTarget - window.scrollY);
  const duration = Math.max(800, Math.min(2000, distance / 1.5));
  
  await animateScrollTo(clampedTarget, duration);
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
export async function panoramicScrollToBottom(stepDelay?: number, stepPx?: number): Promise<void> {
  if (typeof window === "undefined") return;
  const targetY = document.documentElement.scrollHeight - window.innerHeight;
  const distance = Math.max(0, targetY - window.scrollY);
  const duration = Math.max(1200, Math.min(6000, distance / 1.2)); // smooth, constant speed
  await animateScrollTo(targetY, duration);
  await observe(800); // Settle pause at bottom
}

/** Center expanded content and slowly scroll through it to showcase revealed details */
export async function scrollThroughExpandedContent(selector: string): Promise<void> {
  // 1. Wait until expansion animation completes
  await observe(800);

  const el = document.querySelector(selector) as HTMLElement | null;
  if (!el) return;

  // 2. Center the beginning of the expanded content in the viewport
  const rect = el.getBoundingClientRect();
  const startY = window.scrollY + rect.top - window.innerHeight * 0.2;
  const clampedStartY = Math.max(0, startY);
  await animateScrollTo(clampedStartY, 1000);
  await observe(1500); // Pause for narration

  // 3. Slowly scroll through the revealed content until reaching its end
  const endY = clampedStartY + Math.min(rect.height * 0.75, window.innerHeight * 0.6);
  const clampedEndY = Math.min(document.documentElement.scrollHeight - window.innerHeight, endY);
  const distance = clampedEndY - clampedStartY;
  
  if (distance > 10) {
    const duration = Math.max(1200, distance / 1.0); // Constant motion
    await animateScrollTo(clampedEndY, duration);
    await observe(1500); // Pause again
  }
}

/** Verify scroll position is near the bottom, scrolling more if layout height expanded */
export async function ensureReachedPageBottom(): Promise<void> {
  if (typeof window === "undefined") return;
  
  const targetY = document.documentElement.scrollHeight - window.innerHeight;
  if (window.scrollY + 100 < targetY) {
    const distance = targetY - window.scrollY;
    const duration = Math.max(800, distance / 1.2);
    await animateScrollTo(targetY, duration);
    await observe(800); // settle
  }
}
