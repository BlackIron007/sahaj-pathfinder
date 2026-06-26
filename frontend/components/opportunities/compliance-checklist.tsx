import React from "react";
import { Check, AlertTriangle, XOctagon } from "lucide-react";
import { ComplianceCheck } from "@/lib/api/offers";

interface ComplianceChecklistProps {
  checks: ComplianceCheck;
}

export function ComplianceChecklist({ checks }: ComplianceChecklistProps) {
  const checkKeys: Array<{ key: keyof ComplianceCheck; label: string }> = [
    { key: "rbi_policy_alignment", label: "RBI Policy Alignment" },
    { key: "eligibility", label: "Eligibility" },
    { key: "transaction_verification", label: "Transaction Verification" },
    { key: "kyc_status", label: "KYC Status" },
    { key: "internal_policy_check", label: "Internal Policy Check" },
    { key: "aml_screening", label: "AML Screening" },
  ];

  const renderStatus = (status: "Approved" | "Warning" | "Blocked") => {
    switch (status) {
      case "Approved":
        return (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-status-approved-accent uppercase tracking-wider">
            <Check className="h-4 w-4 bg-status-approved-bg p-0.5 rounded-full" />
            <span>Compliant</span>
          </div>
        );
      case "Warning":
        return (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-status-warning-accent uppercase tracking-wider">
            <AlertTriangle className="h-4 w-4 bg-soft p-0.5 rounded-full" />
            <span>Warning</span>
          </div>
        );
      case "Blocked":
        return (
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-status-blocked-accent uppercase tracking-wider">
            <XOctagon className="h-4 w-4 bg-status-blocked-bg p-0.5 rounded-full" />
            <span>Blocked</span>
          </div>
        );
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6 space-y-4">
      <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3">
        Risk & Compliance
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {checkKeys.map(({ key, label }) => {
          const status = checks[key];
          return (
            <div key={key} className="flex flex-col justify-between gap-2 p-4 border border-border/40 bg-soft/20 rounded-md">
              <span className="text-[10px] font-bold text-secondary uppercase tracking-wider">{label}</span>
              {renderStatus(status)}
            </div>
          );
        })}
      </div>
    </div>
  );
}
