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
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRoute, setSelectedRoute] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState<SortField>("potential_value_lakh");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");

  const pageSize = 8;

  // Sorting handler
  const handleSort = (field: SortField) => {
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
        return matchesSearch && matchesRoute && matchesStatus;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === "msme_name") {
          comparison = a.msme_name.localeCompare(b.msme_name);
        } else {
          comparison = a[sortField] - b[sortField];
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [opportunities, searchTerm, selectedRoute, selectedStatus, sortField, sortOrder]);

  // Pagination Logic
  const paginatedOpps = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredOpps.slice(startIndex, startIndex + pageSize);
  }, [filteredOpps, currentPage]);

  const totalPages = Math.ceil(filteredOpps.length / pageSize) || 1;

  const routesList = ["Transaction", "Advisor", "Anchor", "Direct"];
  const statusesList = ["Approved", "Blocked", "Warning"];

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) return null;
    return sortOrder === "asc" ? <ChevronUp className="h-3 w-3 ml-1 inline" /> : <ChevronDown className="h-3 w-3 ml-1 inline" />;
  };

  if (isLoading) {
    return (
      <div className="bg-card border border-border rounded-lg p-6 space-y-4">
        <div className="h-4 w-1/3 bg-soft/50 animate-pulse rounded"></div>
        <div className="h-32 bg-soft/30 animate-pulse rounded"></div>
      </div>
    );
  }

  return (
    <div className="bg-card border border-border rounded-lg overflow-hidden">
      {/* Header controls */}
      <div className="p-6 border-b border-border space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xs uppercase font-bold text-secondary tracking-widest">Opportunity Overview</h3>
          <span className="text-[10px] font-semibold text-secondary">{filteredOpps.length} Opportunities found</span>
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
              className="px-3 py-1.5 text-xs rounded focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="all">All Routes</option>
              {routesList.map(r => <option key={r} value={r}>{r}</option>)}
            </select>

            <select
              value={selectedStatus}
              onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
              className="px-3 py-1.5 text-xs rounded focus:outline-none focus:ring-1 focus:ring-primary"
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
                  <td className="p-4 font-semibold text-foreground">{opp.msme_name}</td>
                  <td className="p-4 font-mono text-secondary">{opp.recommended_route}</td>
                  <td className="p-4 font-medium text-foreground">{opp.potential_value_lakh} Lakhs</td>
                  <td className="p-4">
                    <Badge variant={opp.status}>{opp.status}</Badge>
                  </td>
                  <td className="p-4 font-mono text-secondary">{opp.conversion_probability}%</td>
                  <td className="p-4 text-right">
                    <Link 
                      href={`/opportunities/${opp.opportunity_id}`}
                      className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded border border-primary/20 text-primary hover:bg-soft hover:border-primary/45 transition-colors"
                    >
                      View Intelligence
                      <ArrowRight className="h-3 w-3" />
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="p-8 text-center text-secondary/60">
                  No opportunities match the selected filters.
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
