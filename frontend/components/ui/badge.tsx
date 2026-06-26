import React from "react";

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant: "Approved" | "Blocked" | "Warning" | "Pending Review" | "Critical" | "High" | "Medium" | "Low" | "Ready For Review" | "Needs Revision" | "default";
}

export function Badge({ variant, className = "", children, ...props }: BadgeProps) {
  let colorClasses = "";

  switch (variant) {
    case "Approved":
    case "Low":
      colorClasses = "bg-status-approved-bg text-status-approved-accent border border-status-approved-accent/10";
      break;
    case "Blocked":
    case "Critical":
    case "High":
      colorClasses = "bg-status-blocked-bg text-status-blocked-accent border border-status-blocked-accent/10";
      break;
    case "Warning":
    case "Medium":
    case "Ready For Review":
      colorClasses = "bg-soft text-status-warning-accent border border-border";
      break;
    case "Pending Review":
      colorClasses = "bg-[#fef3c7] text-[#b45309] border border-[#f59e0b]/20";
      break;
    case "Needs Revision":
      colorClasses = "bg-status-blocked-bg text-status-blocked-accent border border-status-blocked-accent/10";
      break;
    default:
      colorClasses = "bg-soft text-secondary border border-border";
  }

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${colorClasses} ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
