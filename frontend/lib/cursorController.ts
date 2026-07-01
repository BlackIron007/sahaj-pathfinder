/**
 * cursorController.ts
 *
 * Implements a pixel-perfect visual cursor rendered entirely in the browser.
 * Provides Bezier paths, overshoot/correction, hover states, soft click ripples,
 * and up to 3 correction passes to handle dynamic layout reflows.
 */

import { observe, animateScrollTo } from "./cameraDirector";

let cursorEl: HTMLDivElement | null = null;
let currentX = typeof window !== "undefined" ? window.innerWidth / 2 : 0;
let currentY = typeof window !== "undefined" ? window.innerHeight / 2 : 0;

/** Initialize the visible human virtual cursor element on document.body */
export function initHumanCursor() {
  if (typeof window === "undefined") return;

  // Hide the default operating system cursor inside the presentation viewport
  document.documentElement.style.cursor = "none";

  if (cursorEl || document.getElementById("demo-human-cursor")) {
    cursorEl = document.getElementById("demo-human-cursor") as HTMLDivElement;
    return;
  }

  cursorEl = document.createElement("div");
  cursorEl.id = "demo-human-cursor";
  cursorEl.style.position = "fixed";
  cursorEl.style.width = "22px";
  cursorEl.style.height = "22px";
  cursorEl.style.borderRadius = "50%";
  cursorEl.style.background = "radial-gradient(circle, rgba(113,91,62,0.95) 0%, rgba(113,91,62,0.4) 40%, rgba(113,91,62,0) 70%)";
  cursorEl.style.border = "1.5px solid #715b3e";
  cursorEl.style.pointerEvents = "none";
  cursorEl.style.zIndex = "99999999"; // Extreme z-index above all overlays
  cursorEl.style.left = `${currentX}px`;
  cursorEl.style.top = `${currentY}px`;
  cursorEl.style.transition = "transform 0.12s cubic-bezier(0.2, 0.8, 0.2, 1), background-color 0.15s ease";
  
  const pointerDot = document.createElement("div");
  pointerDot.style.width = "6px";
  pointerDot.style.height = "6px";
  pointerDot.style.borderRadius = "50%";
  pointerDot.style.backgroundColor = "#715b3e";
  pointerDot.style.position = "absolute";
  pointerDot.style.top = "50%";
  pointerDot.style.left = "50%";
  pointerDot.style.transform = "translate(-50%, -50%)";
  cursorEl.appendChild(pointerDot);

  document.body.appendChild(cursorEl);
}

/** Trigger visual soft ripple animation consistent with design system */
function triggerClickRipple(x: number, y: number) {
  if (typeof window === "undefined") return;

  const ripple = document.createElement("div");
  ripple.style.position = "fixed";
  ripple.style.left = `${x}px`;
  ripple.style.top = `${y}px`;
  ripple.style.width = "0px";
  ripple.style.height = "0px";
  ripple.style.borderRadius = "50%";
  ripple.style.border = "2px solid #715b3e";
  ripple.style.backgroundColor = "rgba(113, 91, 62, 0.2)";
  ripple.style.pointerEvents = "none";
  ripple.style.zIndex = "999999999";
  ripple.style.transform = "translate(-50%, -50%)";
  ripple.style.transition = "width 0.4s cubic-bezier(0.1, 0.8, 0.3, 1), height 0.4s cubic-bezier(0.1, 0.8, 0.3, 1), opacity 0.4s ease-out";
  ripple.style.opacity = "1";

  document.body.appendChild(ripple);

  // Force paint
  ripple.getBoundingClientRect();

  ripple.style.width = "48px";
  ripple.style.height = "48px";
  ripple.style.opacity = "0";

  setTimeout(() => ripple.remove(), 450);
}

/** Compute Bezier curve points between start and end coordinates */
function getBezierPoints(startX: number, startY: number, endX: number, endY: number, steps = 30): { x: number; y: number }[] {
  const points: { x: number; y: number }[] = [];
  
  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;
  
  const deviationX = (Math.random() - 0.5) * 80;
  const deviationY = (Math.random() - 0.5) * 80;
  
  const ctrlX = midX + deviationX;
  const ctrlY = midY + deviationY;

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = (1 - t) * (1 - t) * startX + 2 * (1 - t) * t * ctrlX + t * t * endX;
    const y = (1 - t) * (1 - t) * startY + 2 * (1 - t) * t * ctrlY + t * t * endY;
    points.push({ x, y });
  }

  return points;
}

/** Update the visible virtual cursor position */
function updateCursorPosition(x: number, y: number) {
  currentX = x;
  currentY = y;
  if (cursorEl) {
    cursorEl.style.left = `${x}px`;
    cursorEl.style.top = `${y}px`;
  }
}

/** Move the cursor to target coordinates smoothly */
export async function moveCursorTo(targetX: number, targetY: number): Promise<void> {
  initHumanCursor();
  
  const angle = Math.atan2(targetY - currentY, targetX - currentX);
  const overshootDist = 12 + Math.random() * 8;
  const overshootX = targetX + Math.cos(angle) * overshootDist;
  const overshootY = targetY + Math.sin(angle) * overshootDist;

  const p1 = getBezierPoints(currentX, currentY, overshootX, overshootY, 28);
  for (let i = 0; i < p1.length; i++) {
    const t = i / p1.length;
    const ease = t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
    const index = Math.floor(ease * (p1.length - 1));
    const pt = p1[index];
    updateCursorPosition(pt.x, pt.y);
    await observe(15 + Math.random() * 8);
  }

  await observe(80 + Math.random() * 40);

  const p2 = getBezierPoints(currentX, currentY, targetX, targetY, 10);
  for (const pt of p2) {
    updateCursorPosition(pt.x, pt.y);
    await observe(20);
  }

  // Snap exactly to target coordinate center
  updateCursorPosition(targetX, targetY);
  await observe(250);
}

/** Fire synthetic events for hover visual states */
export function triggerHoverEvents(el: HTMLElement, type: "enter" | "leave") {
  const rect = el.getBoundingClientRect();
  const clientX = rect.left + rect.width / 2;
  const clientY = rect.top + rect.height / 2;

  if (type === "enter") {
    el.dispatchEvent(new MouseEvent("mouseenter", { bubbles: true, cancelable: true, clientX, clientY }));
    el.dispatchEvent(new MouseEvent("mouseover", { bubbles: true, cancelable: true, clientX, clientY }));
    el.dispatchEvent(new PointerEvent("pointerenter", { bubbles: true, clientX, clientY }));
    el.classList.add("demo-hovered");
    
    el.style.boxShadow = "0 0 10px rgba(113, 91, 62, 0.4)";
    el.style.transform = "scale(1.02)";
    el.style.transition = "all 0.2s ease";
  } else {
    el.dispatchEvent(new MouseEvent("mouseleave", { bubbles: true, cancelable: true, clientX, clientY }));
    el.dispatchEvent(new MouseEvent("mouseout", { bubbles: true, cancelable: true, clientX, clientY }));
    el.dispatchEvent(new PointerEvent("pointerleave", { bubbles: true, clientX, clientY }));
    el.classList.remove("demo-hovered");
    el.style.boxShadow = "";
    el.style.transform = "";
  }
}

/** Scroll element into view, move cursor to it, hover, click and trigger events */
export async function hoverAndClick(selector: string): Promise<void> {
  initHumanCursor();

  let el = document.querySelector(selector) as HTMLElement | null;
  let attempts = 0;
  
  // Wait up to 5 seconds for element to appear in DOM
  while (!el && attempts < 50) {
    await observe(100);
    el = document.querySelector(selector) as HTMLElement | null;
    attempts++;
  }

  if (!el) {
    throw new Error(`Target element not found: ${selector}`);
  }

  // Phase A: Initial targeting viewport scroll centering
  let rect = el.getBoundingClientRect();
  const threshold = 100;
  const isComfortablyVisible = rect.top >= threshold && rect.bottom <= window.innerHeight - threshold;
  if (!isComfortablyVisible) {
    const targetScrollY = window.scrollY + rect.top - window.innerHeight * 0.35;
    const clampedTarget = Math.max(0, targetScrollY);
    const distance = Math.abs(clampedTarget - window.scrollY);
    const duration = Math.max(800, Math.min(2200, distance / 1.5));
    await animateScrollTo(clampedTarget, duration);
    await observe(600); // settle
    rect = el.getBoundingClientRect();
  }

  let targetX = rect.left + rect.width / 2;
  let targetY = rect.top + rect.height / 2;

  // Move visual cursor to initial computed center
  await moveCursorTo(targetX, targetY);

  // Trigger enter hover
  triggerHoverEvents(el, "enter");
  await observe(200); // hover pause

  // Phase B: Final targeting micro-adjustment passes (Max 3 correction loops)
  let pass = 0;
  let currentTargetX = targetX;
  let currentTargetY = targetY;

  while (pass < 3) {
    const newRect = el.getBoundingClientRect();
    const updatedCenterX = newRect.left + newRect.width / 2;
    const updatedCenterY = newRect.top + newRect.height / 2;

    const diffX = Math.abs(updatedCenterX - currentTargetX);
    const diffY = Math.abs(updatedCenterY - currentTargetY);

    // If offset is greater than 1px in browser client coordinates, perform correction
    if (diffX > 1 || diffY > 1) {
      currentTargetX = updatedCenterX;
      currentTargetY = updatedCenterY;
      await moveCursorTo(currentTargetX, currentTargetY);
      pass++;
    } else {
      break;
    }
  }

  // Ensure absolute final coordinates are refreshed for the click event coordinates
  const finalRect = el.getBoundingClientRect();
  const finalX = finalRect.left + finalRect.width / 2;
  const finalY = finalRect.top + finalRect.height / 2;
  updateCursorPosition(finalX, finalY);

  // Soft ripple click animation sequence
  if (cursorEl) {
    cursorEl.style.transform = "scale(0.82)"; // Pressed state
    cursorEl.style.backgroundColor = "rgba(113, 91, 62, 0.7)";
  }
  triggerClickRipple(finalX, finalY);
  await observe(180);

  // Fire synthetic click events to ensure router/state transitions trigger instantly
  el.dispatchEvent(new MouseEvent("mousedown", { bubbles: true, cancelable: true, clientX: finalX, clientY: finalY }));
  await observe(40);
  el.dispatchEvent(new MouseEvent("mouseup", { bubbles: true, cancelable: true, clientX: finalX, clientY: finalY }));
  
  if (typeof el.click === "function") {
    el.click();
  } else {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true, cancelable: true, clientX: finalX, clientY: finalY }));
  }

  if (cursorEl) {
    cursorEl.style.transform = "scale(1)"; // Release state
    cursorEl.style.backgroundColor = "";
  }

  // Trigger leave hover
  triggerHoverEvents(el, "leave");
  await observe(250);
}
