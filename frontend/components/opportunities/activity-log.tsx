import React from "react";

interface ActivityLogProps {
  logs: Array<{ time: string; event: string }>;
}

export function ActivityLog({ logs }: ActivityLogProps) {
  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3">
        Agent Activity Log
      </h3>

      <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-border/60">
        {logs.map((log, idx) => {
          const isLatest = idx === logs.length - 1;
          const opacityVal = isLatest ? 1.0 : Math.max(0.4, 0.4 + (idx * 0.12));
          return (
            <div key={idx} className="flex gap-4 relative pl-1 transition-opacity duration-200" style={{ opacity: opacityVal }}>
              <div className={`h-4 w-4 rounded-full border z-10 flex items-center justify-center bg-card ${isLatest ? 'border-primary ring-2 ring-primary/20' : 'border-border'}`}>
                <span className={`w-1.5 h-1.5 rounded-full ${isLatest ? 'bg-primary' : 'bg-secondary/60'}`} />
              </div>
              <div>
                <span className="text-[9px] text-secondary/70 font-semibold font-mono block leading-none">{log.time}</span>
                <p className="text-xs font-semibold text-foreground mt-1">{log.event}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
