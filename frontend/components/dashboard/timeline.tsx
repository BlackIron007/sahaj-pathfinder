import { DiscoveryEvent } from "@/lib/api/dashboard";
import { Building2, PlusCircle } from "lucide-react";

interface TimelineProps {
  events: DiscoveryEvent[];
  isLoading?: boolean;
}

export function Timeline({ events, isLoading }: TimelineProps) {
  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3">Discovery Timeline</h3>
        <div className="text-xs text-secondary/60">Loading events...</div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col h-full justify-between">
      <div>
        <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3 mb-4">Discovery Timeline</h3>
        <div className="space-y-4 relative before:absolute before:left-3 before:top-2 before:bottom-2 before:w-px before:bg-border">
          {events.map((evt, idx) => {
            const isSupplier = evt.type === "supplier_discovered";
            const opacityStyle = { opacity: Math.max(0.35, 1 - idx * 0.15) };
            return (
              <div key={evt.id} className="flex gap-4 relative pl-1" style={opacityStyle}>
                <div className={`h-6 w-6 rounded-full border border-border flex items-center justify-center bg-card z-10 text-primary`}>
                  {isSupplier ? <Building2 className="h-3.5 w-3.5" /> : <PlusCircle className="h-3.5 w-3.5" />}
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-foreground">{evt.title}</h4>
                  <p className="text-[10px] text-secondary mt-0.5">{evt.description}</p>
                  <span className="text-[9px] text-secondary/60 mt-1 block font-mono">{evt.date}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
