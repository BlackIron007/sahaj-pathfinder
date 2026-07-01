/**
 * executiveConfig.ts
 *
 * Configurable timeline settings for the 4-minute narrated executive presentation.
 * Optimised for OBS recording, narrative dwell times, and cinematic pacing.
 */
export const executiveConfig = {
  // General animation & pause durations (in ms)
  pauseBeforeClick: 900,         // Pause when element is centered before clicking
  pauseAfterClick: 1200,         // Pause to let viewer absorb change before scrolling
  standardObservePause: 2500,    // General time allowed to look at non-interactive text/sections
  narrationDwellTime: 4000,      // Longer pauses for narrative explanation
  longAnimationSettle: 5500,     // Dwell time for reasoning simulations and learning timeline cycles
  
  // Custom camera scrolling behavior (in ms)
  scrollStepDelay: 350,          // Delay between continuous panoramic scroll steps
  scrollStepPx: 30,              // Scroll step size in pixels (smaller is smoother)
  cameraFocusDelay: 800,         // Settle time for focus actions
  
  // Title overlay timings (in ms)
  overlayDisplayHold: 2000,      // How long the transition title overlay is displayed
  overlayFadeOut: 500,           // Transition overlay opacity fade duration
  
  // Branded End Card Display Timings
  finalDashboardHold: 4500,      // Settle time on home page before starting final fade
  endCardHold: 5000,             // Settle time on branded end card showing project/hackathon info
};
