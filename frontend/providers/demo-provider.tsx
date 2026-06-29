"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface DemoContextType {
  isDemoMode: boolean;
  isRecording: boolean;
  currentScene: number;
  isOverlayActive: boolean;
  overlayText: { title: string; subtitle: string } | null;
  startPresentation: () => void;
  triggerTransition: (path: string, nextScene: number) => Promise<void>;
  endPresentation: () => void;
  nextScene: () => void;
  showFinalFade: boolean;
  triggerFinalFade: () => void;
}

const DemoContext = createContext<DemoContextType | undefined>(undefined);

const SCENE_METADATA: Record<number, { title: string; subtitle: string }> = {
  1: { title: "Executive Dashboard",       subtitle: "Continuous Discovery Navigator" },
  2: { title: "Acquisition Intelligence",  subtitle: "Explainable Route Selection" },
  3: { title: "Architecture Playground",   subtitle: "Deterministic Route Simulations" },
  4: { title: "Offer Review Workspace",    subtitle: "Automated Underwriting Proposals" },
  5: { title: "Impact Center",            subtitle: "Continuous Learning & Governance" },
  6: { title: "Sahaj PathFinder",          subtitle: "Executive Intelligence System" },
};

export function DemoProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [isDemoMode, setIsDemoMode]     = useState(false);
  const [isRecording, setIsRecording]   = useState(false);
  const [currentScene, setCurrentScene] = useState(0);
  const [isOverlayActive, setIsOverlayActive] = useState(false);
  const [overlayText, setOverlayText]   = useState<{ title: string; subtitle: string } | null>(null);
  const [showFinalFade, setShowFinalFade] = useState(false);

  useEffect(() => {
    const rec = searchParams.get("recording");
    if (rec === "true") setIsRecording(true);

    const sceneParam = searchParams.get("scene");
    if (pathname === "/demo" || sceneParam) {
      setIsDemoMode(true);
      if (sceneParam) {
        const idx = parseInt(sceneParam);
        if (!isNaN(idx)) setCurrentScene(idx);
      }
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__currentScene = currentScene;
    }
  }, [currentScene]);

  /**
   * Show scene overlay OVER the NEW page.
   * Sequence:
   *   1. Push route immediately (page begins loading/rendering behind overlay)
   *   2. Set scene index so page's useEffect fires when it mounts
   *   3. Show overlay (fade in instantly — it was already hidden)
   *   4. Hold 1100ms
   *   5. Fade out (400ms)
   *   6. Return — page is already rendered, scroll begins
   */
  const runOverlayCycle = async (sceneIndex: number, path: string) => {
    const meta = SCENE_METADATA[sceneIndex];
    if (meta) {
      // Navigate first so the page renders behind the overlay
      router.push(path);
      setCurrentScene(sceneIndex);

      await new Promise((r) => setTimeout(r, 60)); // one tick for state flush
      setOverlayText(meta);
      setIsOverlayActive(true);

      await new Promise((r) => setTimeout(r, 1200)); // hold
      setIsOverlayActive(false);
      await new Promise((r) => setTimeout(r, 420)); // fade-out transition
    } else {
      router.push(path);
      setCurrentScene(sceneIndex);
    }
  };

  const startPresentation = async () => {
    setIsDemoMode(true);
    const sceneParam = searchParams.get("scene");
    const targetScene = sceneParam ? parseInt(sceneParam) : 1;

    let startPath = "/";
    if (targetScene === 2) startPath = `/acquisition-intelligence/OP001`;
    else if (targetScene === 3) startPath = "/architecture";
    else if (targetScene === 4) startPath = "/offer-workspace";
    else if (targetScene === 5) startPath = "/impact-center";

    await runOverlayCycle(targetScene, startPath);
  };

  const triggerTransition = async (path: string, nextSceneIndex: number) => {
    if (nextSceneIndex === currentScene) {
      router.push(path);
      setCurrentScene(nextSceneIndex);
    } else {
      await runOverlayCycle(nextSceneIndex, path);
    }
  };

  const nextScene = () => setCurrentScene((s) => s + 1);

  const endPresentation = () => {
    setIsDemoMode(false);
    setCurrentScene(0);
    router.push("/demo");
  };

  const triggerFinalFade = () => setShowFinalFade(true);

  return (
    <DemoContext.Provider
      value={{
        isDemoMode, isRecording, currentScene,
        isOverlayActive, overlayText,
        startPresentation, triggerTransition, endPresentation, nextScene,
        showFinalFade, triggerFinalFade,
      }}
    >
      {isDemoMode && (
        <style>{`
          ${currentScene > 0 ? `
            body { pointer-events: none !important; user-select: none !important; }
          ` : ""}
          *:focus { outline: none !important; box-shadow: none !important; }
          html { scroll-behavior: smooth !important; }
          ${isRecording ? `[data-demo-hint],.no-print,.debug-only { display:none!important; }` : ""}
        `}</style>
      )}

      {/* Scene title overlay — appears on top of the already-loaded new page */}
      {isDemoMode && overlayText && (
        <div
          style={{
            position: "fixed", inset: 0,
            background: "#fff9ee",
            zIndex: 99998,
            display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center",
            opacity: isOverlayActive ? 1 : 0,
            pointerEvents: "none",
            transition: "opacity 0.42s ease-in-out",
          }}
        >
          <div style={{ textAlign: "center", maxWidth: "560px", padding: "0 24px" }}>
            <h2 style={{
              fontSize: "22px", fontWeight: 800, color: "#373223",
              textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "8px",
            }}>
              {overlayText.title}
            </h2>
            <div style={{ height: "1px", width: "72px", backgroundColor: "#b9b29c", margin: "12px auto" }} />
            <p style={{
              fontSize: "11px", fontWeight: 600, color: "#6b5d4f",
              textTransform: "uppercase", letterSpacing: "0.12em",
            }}>
              {overlayText.subtitle}
            </p>
          </div>
        </div>
      )}

      {/* Final fade-to-black for end of demo */}
      <div
        style={{
          position: "fixed", inset: 0,
          background: "#fff9ee",
          zIndex: 99999,
          pointerEvents: "none",
          opacity: showFinalFade ? 1 : 0,
          transition: "opacity 1.2s ease-in-out",
        }}
      />

      {children}
    </DemoContext.Provider>
  );
}

export function useDemo() {
  const ctx = useContext(DemoContext);
  if (!ctx) throw new Error("useDemo must be used within a DemoProvider");
  return ctx;
}