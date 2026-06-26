"use client";

import React, { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { Search, ArrowRight, AlertCircle } from "lucide-react";
import { fetchOpportunities } from "@/lib/api/opportunities";
import { Badge } from "@/components/ui/badge";

type SortField = "company_name" | "priority" | "probability" | "last_updated";
type SortOrder = "asc" | "desc";

export default function OfferQueuePage() {
  const { data: opportunities, isLoading, error } = useQuery({
    queryKey: ["opportunitiesListOfferQueue"],
    queryFn: fetchOpportunities,
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState("all");
  const [selectedRM, setSelectedRM] = useState("all");
  const [sortField, setSortField] = useState<SortField>("priority");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Derive Offer Details from Opportunities
  const offersList = useMemo(() => {
    if (!opportunities) return [];
    return opportunities.map((opp) => {
      // Map statuses matching Screen 3 expectations
      let statusVal: "Ready For Review" | "Needs Revision" | "Approved" = "Ready For Review";
      if (opp.status === "Approved") statusVal = "Approved";
      else if (opp.status === "Blocked") statusVal = "Needs Revision";
      else if (opp.status === "Pending Review") statusVal = "Ready For Review";

      // Products mapping
      const recommendedProduct = opp.recommended_route === "Transaction" 
        ? "Working Capital Sandbox Loan" 
        : "SME Smart Score Card";

      // Mock Last Updated dates based on ID count to align with cron timelines
      const lastUpdated = `2026-06-2${parseInt(opp.opportunity_id.replace(/\D/g, "") || "5") % 9} 09:15`;

      return {
        id: opp.opportunity_id,
        company_name: opp.msme_name,
        product: recommendedProduct,
        route: opp.recommended_route,
        probability: opp.conversion_probability,
        status: statusVal,
        assigned_rm: "Dev Sharma",
        last_updated: lastUpdated,
        priority: opp.priority
      };
    });
  }, [opportunities]);

  // Filter and Search
  const filteredOffers = useMemo(() => {
    return offersList
      .filter((offer) => {
        const matchesSearch = offer.company_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
          offer.route.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = selectedStatus === "all" || offer.status === selectedStatus;
        const matchesProduct = selectedProduct === "all" || offer.product === selectedProduct;
        const matchesRM = selectedRM === "all" || offer.assigned_rm === selectedRM;

        return matchesSearch && matchesStatus && matchesProduct && matchesRM;
      })
      .sort((a, b) => {
        let comparison = 0;
        if (sortField === "company_name") {
          comparison = a.company_name.localeCompare(b.company_name);
        } else if (sortField === "priority") {
          const priorityWeight = { "High": 3, "Medium": 2, "Low": 1 };
          const aWeight = priorityWeight[a.priority as keyof typeof priorityWeight] || 0;
          const bWeight = priorityWeight[b.priority as keyof typeof priorityWeight] || 0;
          comparison = aWeight - bWeight;
        } else if (sortField === "probability") {
          comparison = a.probability - b.probability;
        } else if (sortField === "last_updated") {
          comparison = a.last_updated.localeCompare(b.last_updated);
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
  }, [offersList, searchTerm, selectedStatus, selectedProduct, selectedRM, sortField, sortOrder]);

  const paginatedOffers = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredOffers.slice(startIndex, startIndex + pageSize);
  }, [filteredOffers, currentPage]);

  const totalPages = Math.ceil(filteredOffers.length / pageSize) || 1;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("desc");
    }
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-4 font-sans">
        <AlertCircle className="h-10 w-10 text-status-blocked-accent" />
        <h2 className="text-base font-bold text-foreground">API Connection Offline</h2>
        <p className="text-xs text-secondary max-w-sm">
          Failed to fetch current offers pipeline from the PathFinder gateway.
        </p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-8 max-w-7xl mx-auto pb-12 animate-pulse font-sans">
        <div className="h-4 w-48 bg-soft rounded"></div>
        <div className="h-10 w-96 bg-soft rounded"></div>
        <div className="h-64 bg-soft rounded-lg"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12 font-sans">
      <div>
        <span className="text-[10px] font-bold text-secondary uppercase tracking-widest font-mono">
          SBI AI Reviews
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-foreground mt-1.5">
          Offer Queue
        </h1>
        <p className="text-xs text-secondary mt-1 max-w-xl leading-relaxed">
          Review, approve, or request revisions for AI-generated acquisition strategies and offer drafts.
        </p>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {/* Filter Toolbar */}
        <div className="p-6 border-b border-border space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs uppercase font-bold text-secondary tracking-widest">Offers Review Pipeline</h3>
            <span className="text-[10px] font-semibold text-secondary">{filteredOffers.length} Offers pending review</span>
          </div>

          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-secondary" />
              <input
                type="text"
                placeholder="Search MSME name, product, or route..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="w-full pl-9 pr-4 py-1.5 text-xs rounded border border-border focus:outline-none focus:ring-1 focus:ring-primary bg-card"
              />
            </div>

            <div className="flex flex-wrap gap-2">
              <select
                value={selectedStatus}
                onChange={(e) => { setSelectedStatus(e.target.value); setCurrentPage(1); }}
                className="px-3 py-1.5 text-xs rounded border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Statuses</option>
                <option value="Ready For Review">Ready For Review</option>
                <option value="Needs Revision">Needs Revision</option>
                <option value="Approved">Approved</option>
              </select>

              <select
                value={selectedProduct}
                onChange={(e) => { setSelectedProduct(e.target.value); setCurrentPage(1); }}
                className="px-3 py-1.5 text-xs rounded border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All Products</option>
                <option value="Working Capital Sandbox Loan">Working Capital Loan</option>
                <option value="SME Smart Score Card">Smart Score Card</option>
              </select>

              <select
                value={selectedRM}
                onChange={(e) => { setSelectedRM(e.target.value); setCurrentPage(1); }}
                className="px-3 py-1.5 text-xs rounded border border-border bg-card focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="all">All RMs</option>
                <option value="Dev Sharma">Dev Sharma</option>
              </select>
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-soft/40 border-b border-border text-secondary font-semibold uppercase tracking-wider text-[10px]">
                <th className="p-4 cursor-pointer hover:bg-soft" onClick={() => handleSort("company_name")}>
                  MSME Name {sortField === "company_name" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-4">Recommended Product</th>
                <th className="p-4">Route</th>
                <th className="p-4 cursor-pointer hover:bg-soft" onClick={() => handleSort("probability")}>
                  Probability {sortField === "probability" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-4">Status</th>
                <th className="p-4">Assigned RM</th>
                <th className="p-4 cursor-pointer hover:bg-soft" onClick={() => handleSort("last_updated")}>
                  Last Updated {sortField === "last_updated" && (sortOrder === "asc" ? "▲" : "▼")}
                </th>
                <th className="p-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {paginatedOffers.length > 0 ? (
                paginatedOffers.map((offer) => (
                  <tr key={offer.id} className="hover:bg-soft/20 transition-colors">
                    <td className="p-4 font-semibold text-foreground">{offer.company_name}</td>
                    <td className="p-4 text-secondary">{offer.product}</td>
                    <td className="p-4 font-mono text-secondary">{offer.route}</td>
                    <td className="p-4 font-mono text-secondary">{offer.probability}%</td>
                    <td className="p-4">
                      <Badge variant={offer.status}>{offer.status}</Badge>
                    </td>
                    <td className="p-4 text-secondary">{offer.assigned_rm}</td>
                    <td className="p-4 font-mono text-secondary">{offer.last_updated}</td>
                    <td className="p-4 text-right">
                      <Link 
                        href={`/offer-workspace/${offer.id}`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider rounded border border-primary/20 text-primary hover:bg-soft hover:border-primary/45 transition-colors"
                      >
                        View Offer Workspace
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-secondary/60">
                    No offers match the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-border flex justify-between items-center bg-soft/20">
          <span className="text-[10px] text-secondary font-medium">
            Showing {filteredOffers.length === 0 ? 0 : (currentPage - 1) * pageSize + 1}–{Math.min(currentPage * pageSize, filteredOffers.length)} of {filteredOffers.length} offers.
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
    </div>
  );
}
