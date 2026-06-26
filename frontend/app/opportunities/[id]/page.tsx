import { ArrowLeft, Cpu } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function OpportunityDetailPage({ params }: PageProps) {
  const resolvedParams = await params;
  const id = resolvedParams.id;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      <div>
        <Link href="/" className="inline-flex items-center gap-1.5 text-xs text-secondary hover:text-foreground font-semibold uppercase tracking-wider mb-4 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to Dashboard
        </Link>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">Acquisition Intelligence</h1>
        <p className="text-xs text-secondary mt-1">Ecosystem deep-dive for Opportunity ID: {id}</p>
      </div>

      <div className="bg-card border border-border p-12 rounded-lg text-center flex flex-col items-center justify-center space-y-4 min-h-[40vh]">
        <div className="h-10 w-10 rounded-full bg-soft flex items-center justify-center text-primary">
          <Cpu className="h-5 w-5 animate-pulse" />
        </div>
        <h3 className="text-sm font-semibold text-foreground">Intelligence Module Under Construction</h3>
        <p className="text-xs text-secondary max-w-md leading-relaxed">
          The agentic Discovery and Route Evaluation Engines are currently parsing ecosystem signals for target node <span className="font-mono text-foreground font-semibold">{id}</span>. Unstructured trade transaction context will hydrate this screen in Prompt 3.
        </p>
      </div>
    </div>
  );
}
