"use client";

import React from "react";
import { useDemo } from "@/providers/demo-provider";
import { Shield, Play } from "lucide-react";

export default function ExecutiveDemoLandingPage() {
  const { startPresentation } = useDemo();

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground font-sans overflow-hidden">
      {/* Subtle clean decorative background pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e8e0d440_1px,transparent_1px),linear-gradient(to_bottom,#e8e0d440_1px,transparent_1px)] bg-[size:3rem_3rem] pointer-events-none" />
      
      {/* Decorative clean soft glow */}
      <div className="absolute -top-[15%] left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 max-w-xl text-center px-6 space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Minimalist Logo Icon */}
        <div className="inline-flex items-center justify-center p-3.5 rounded-xl bg-card border border-border/40 shadow-sm mb-1">
          <Shield className="h-8 w-8 text-primary" strokeWidth={1.5} />
        </div>

        {/* Minimal Headline */}
        <div className="space-y-3">
          <h1 className="text-3xl font-extrabold tracking-tight text-foreground uppercase font-sans">
            Sahaj PathFinder
          </h1>
          <p className="text-xs font-semibold tracking-wider text-secondary uppercase flex items-center justify-center gap-1.5">
            Executive Demo Presentation Mode
          </p>
        </div>

        <div className="h-px w-36 bg-gradient-to-r from-transparent via-border/50 to-transparent mx-auto" />

        {/* Subtitle / Description */}
        <p className="text-xs text-secondary leading-relaxed max-w-sm mx-auto">
          A dedicated 4-minute narrated walkthrough mode optimized for video production, with custom pauses, slow cinematic camera movements, and full workflow reviews.
        </p>

        {/* Start Button */}
        <div className="pt-2">
          <button
            data-demo="start-btn"
            onClick={startPresentation}
            className="group inline-flex items-center gap-2.5 px-6 py-3 rounded-lg bg-primary text-card hover:bg-primary-hover font-bold text-xs tracking-wider uppercase shadow-sm transition-all duration-200"
          >
            <Play className="h-3.5 w-3.5 fill-current" />
            <span>Start Executive Walkthrough</span>
          </button>
        </div>
      </div>
    </div>
  );
}
