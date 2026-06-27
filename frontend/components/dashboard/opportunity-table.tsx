"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { OpportunityItem } from "@/lib/api/opportunities";
import { Badge } from "@/components/ui/badge";
import { Search, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

interface OpportunityTableProps {
  opportunities: OpportunityItem[];
  isLoading?: boolean;
}

type SortField = "msme_name" | "potential_value_lakh" | "conversion_probability";
type SortOrder = "asc" | "desc";

export function OpportunityTable({ opportunities, isLoading }: OpportunityTableProps) {
  const [activeQueue, setActiveQueue] = useState<"all" | "new" | "validation" | "high" | "low" | "rejected" | "review">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField | "discovery_score">("potential_value_lakh");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const pageSize = 8;

  // Queues dynamic count calculator
  const counts = useMemo(() => {
    return {
      all: opportunities.length,
      new: opportunities.filter(o => o.discovery_score >= 70 && !o.is_rejected).length,
      validation: opportunities.filter(o => o.status === "Warning").length,
      high: opportunities.filter(o => o.discovery_score >= 78 && !o.is_rejected).length,
      low: opportunities.filter(o => o.discovery_score < 78 && !o.is_rejected).length,
      rejected: opportunities.filter(o => o.is_rejected).length,
      review: opportunities.filter(o => o.status === "Pending Review").length,
    };
  }, [opportunities]);

  // Sorting handler
  const handleSort = (field: SortField | "discovery_score") => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
  };

  // Filter & Search Logic
  const filteredOpps = useMemo(() => {
    return opportunities
      .filter((opp) => {
        const matchesSearch = 
          opp.msme_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          opp.recommended_route.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRoute = selectedRoute === "all" || opp.recommended_route === selectedRoute;
        const matchesStatus = selectedStatus === "all" || opp.status === selectedStatus;
        
        let matchesQueue = true;
        if (activeQueue === "new") {
          matchesQueue = opp.discovery_score >= 70 && !opp.is_rejected;
        } else if (activeQueue === "validation") {
          matchesQueue = opp.status === "Warning";
        } else if (activeQueue === "high") {
          matchesQueue = opp.discovery_score >= 78 && !opp.is_rejected;
        } else if (activeQueue === "low") {
          matchesQueue = opp.discovery_score < 78 && !opp.is_rejected;
        } else if (activeQueue === "rejected") {
          matchesQueue = opp.is_rejected === true;
        } else if (activeQueue === "review") {
          matchesQueue = opp.status === "Pending Review";
        }
        
        return matchesSearch && matchesRoute && matchesStatus && matchesQueue;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === "msme_name") {
          comparison = a.msme_name.localeCompare(b.msme_name);
        } else {
          comparison = (a[sortField] ?? 0) - (b[sortField] ?? 0);
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [opportunities, searchTerm, selectedRoute, selectedStatus, sortField, sortOrder, activeQueue]);

  // Pagination Logic
  const paginatedOpps = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredOpps.slice(startIndex, startIndex + pageSize);
  }, [filteredOpps, currentPage]);

  const totalPages = Math.ceil(filteredOpps.length / pageSize) || 1;

  const routesList = ["Transaction", "Advisor", "Anchor", "Direct"];
  const statusesList = ["Approved", "Blocked", "Warning"];

  const renderSortIndicator = (field: SortField | "discovery_score") => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? <ChevronUp className="h-3 w-3 ml-1 inline" /> : <ChevronDown className="h-3 w-3 ml-1 inline" />;
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 space-y-4 font-sans">
        <div className="h-4 w-1/3 bg-soft/50 animate-pulse rounded"></div>
        <div className="h-32 bg-soft/30 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden font-sans">
      {/* Queues tab bar */}
      <div className="flex border-b border-border bg-soft/20 overflow-x-auto">
        {[
          { key: "all", label: "All Discovered" },
          { key: "new", label: "Newly Discovered" },
          { key: "validation", label: "Needs Validation" },
          { key: "high", label: "High Confidence" },
          { key: "low", label: "Low Confidence" },
          { key: "review", label: "Requires Review" },
          { key: "rejected", label: "Rejected" },
        ].map((tab) => {
          const isActive = activeQueue === tab.key;
          const count = counts[tab.key as keyof typeof counts] ?? 0;
          return (
            <button
              key={tab.key}
              onClick={() => { setActiveQueue(tab.key as "all" | "new" | "validation" | "high" | "low" | "rejected" | "review"); setCurrentPage(1); }}
              className={`px-4 py-3 text-[11px] font-bold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all flex items-center gap-1.5 focus:outline-none ${
                isActive
                  ? "border-primary text-primary bg-card"
                  : "border-transparent text-secondary hover:text-foreground"
              }`}
            >
              {tab.label}
              <span className={`text-[9px] px-1.5 py-0.5 rounded font-mono font-bold ${
                isActive ? "bg-primary text-card" : "bg-soft text-secondary"
              }`}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Header controls */}
      <div className="p-6 border-b border-border space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs uppercase font-bold text-secondary tracking-widest">Ecosystem Discovery Queue</h3>
          <span className="text-[10px] font-semibold text-secondary">{filteredOpps.length} Discovered targets</span>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-secondary" />
            <input
              type="text"
              placeholder="Search MSME name, industry, or recommended route..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="w-full pl-9 pr-4 py-1.5 text-xs rounded focus:outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="flex gap-2">
            <select
              value={selectedRoute}
              onChange={(e) => { setSelectedRoute(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 text-xs rounded focus:outline-none focus:ring-1 focus:ring-primary bg-card border border-border"
            >
              <option value="all">All Routes</option>
              {routesList.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 text-xs rounded focus:outline-none focus:ring-1 focus:ring-primary bg-card border border-border"
            >
              <option value="all">All Statuses</option>
              {statusesList.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Table grid */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-soft/40 border-b border-border text-secondary font-semibold uppercase tracking-wider text-[10px]">
              <th className="p-4 cursor-pointer hover:bg-soft" onClick={() => handleSort("msme_name")}>
                MSME {renderSortIndicator("msme_name")}
              </th>
              <th className="p-4 cursor-pointer hover:bg-soft" onClick={() => handleSort("discovery_score")}>
                Discovery Score {renderSortIndicator("discovery_score")}
              </th>
              <th className="p-4">Recommended Route</th>
              <th className="p-4 cursor-pointer hover:bg-soft" onClick={() => handleSort("potential_value_lakh")}>
                Potential Value {renderSortIndicator("potential_value_lakh")}
              </th>
              <th className="p-4">Status</th>
              <th className="p-4 cursor-pointer hover:bg-soft" onClick={() => handleSort("conversion_probability")}>
                Probability {renderSortIndicator("conversion_probability")}
              </th>
              <th className="p-4 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60">
            {paginatedOpps.length > 0 ? (
              paginatedOpps.map((opp) => (
                <tr key={opp.opportunity_id} className="hover:bg-soft/20 transition-colors">
                  <td className="p-4 font-semibold text-foreground">
                    <div>{opp.msme_name}</div>
                    {opp.is_rejected && opp.rejection_reasons && opp.rejection_reasons.length > 0 && (
                      <div className="text-[9.5px] text-status-blocked-accent font-medium mt-1.5 flex flex-wrap gap-1">
                        {opp.rejection_reasons.map((r, i) => (
                          <span key={i} className="bg-status-blocked-bg px-1.5 py-0.5 rounded border border-status-blocked-accent/20">
                            {r}
                          </span>
                        ))}
                      </div>
                    )}
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-foreground">{opp.discovery_score}</span>
                      <div className="w-12 bg-soft rounded-full h-1.5 overflow-hidden hidden sm:block">
                        <div className="bg-primary h-full rounded-full" style={{ width: `${opp.discovery_score}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="p-4 font-mono text-secondary">{opp.recommended_route}</td>
                  <td className="p-4 font-medium text-foreground">{opp.potential_value_lakh} Lakhs</td>
                  <td className="p-4">
                    <Badge variant={opp.status}>{opp.status}</Badge>
                  </td>
                  <td className="p-4 font-mono text-secondary">{opp.conversion_probability}%</td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/acquisition-intelligence/${opp.opportunity_id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded border border-primary/20 text-primary hover:bg-soft hover:border-primary/45 transition-colors"
                    >
                      View Intelligence
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className="p-8 text-center text-secondary/60">
                  No opportunities match the selected queue tab filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="p-4 border-t border-border flex justify-between items-center bg-soft/20">
        <span className="text-[10px] text-secondary font-medium">
          Showing {filteredOpps.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredOpps.length)} of {filteredOpps.length} opportunities.
        </span>
        
        <div className="flex gap-1.5">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-2.5 py-1 text-[10px] font-semibold border border-border rounded disabled:opacity-30 bg-card hover:bg-soft transition-colors"
          >
            Prev
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-2.5 py-1 text-[10px] font-semibold border border-border rounded disabled:opacity-30 bg-card hover:bg-soft transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
