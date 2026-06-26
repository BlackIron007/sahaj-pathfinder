import React, { useState } from "react";
import { Edit3, Check } from "lucide-react";
import { OfferDraft } from "@/lib/api/offers";

interface OutreachPreviewProps {
  draft: OfferDraft;
  onUpdateDraft?: (updated: OfferDraft) => void;
}

export function OutreachPreview({ draft, onUpdateDraft }: OutreachPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [subject, setSubject] = useState(draft.subject);
  const [greeting, setGreeting] = useState(draft.greeting);
  const [body, setBody] = useState(draft.body);
  const [signature, setSignature] = useState(draft.signature);

  const handleSave = () => {
    setIsEditing(false);
    if (onUpdateDraft) {
      onUpdateDraft({ subject, greeting, body, signature });
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <div className="border-b border-border pb-3 flex justify-between items-center">
        <h3 className="text-xs uppercase font-bold text-secondary tracking-widest">
          PathFinder Generated Outreach
        </h3>
        
        {isEditing ? (
          <button 
            onClick={handleSave}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded bg-primary text-card hover:bg-primary-dim transition-colors"
          >
            <Check className="h-3.5 w-3.5" /> Save Changes
          </button>
        ) : (
          <button 
            onClick={() => setIsEditing(true)}
            className="flex items-center gap-1 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded border border-border bg-card text-foreground hover:bg-soft transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" /> Edit Draft
          </button>
        )}
      </div>

      <div className="border border-border/60 bg-soft/20 rounded p-5 space-y-3 font-mono text-[11px] text-foreground leading-relaxed">
        {isEditing ? (
          <div className="space-y-3">
            <div>
              <label className="text-[9px] uppercase font-bold text-secondary block mb-1">Subject Line</label>
              <input 
                type="text" 
                value={subject} 
                onChange={(e) => setSubject(e.target.value)} 
                className="w-full px-2 py-1 text-xs border border-border rounded bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-[9px] uppercase font-bold text-secondary block mb-1">Greeting</label>
              <input 
                type="text" 
                value={greeting} 
                onChange={(e) => setGreeting(e.target.value)} 
                className="w-full px-2 py-1 text-xs border border-border rounded bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-[9px] uppercase font-bold text-secondary block mb-1">Message Body</label>
              <textarea 
                rows={5} 
                value={body} 
                onChange={(e) => setBody(e.target.value)} 
                className="w-full px-2 py-1 text-xs border border-border rounded bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
            <div>
              <label className="text-[9px] uppercase font-bold text-secondary block mb-1">Signature</label>
              <textarea 
                rows={2} 
                value={signature} 
                onChange={(e) => setSignature(e.target.value)} 
                className="w-full px-2 py-1 text-xs border border-border rounded bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>
        ) : (
          <>
            <div>
              <span className="text-secondary font-semibold">Subject:</span> {subject}
            </div>
            <div className="border-t border-border/30 my-2 pt-2">
              <p className="font-semibold">{greeting}</p>
              <p className="mt-2 whitespace-pre-line">{body}</p>
              <p className="mt-4 whitespace-pre-line font-semibold">{signature}</p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
