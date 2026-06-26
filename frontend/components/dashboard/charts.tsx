"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import { RouteCount, EcosystemStats } from "@/lib/api/dashboard";

export function RouteDistributionChart({ routeData }: { routeData: RouteCount[] }) {
  const COLORS = ["#715b3e", "#6b5d4f", "#b9b29c", "#f5eddd"];

  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col h-full justify-between">
      <div>
        <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3 mb-6">Route Distribution</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart margin={{ top: 10, bottom: 10, left: 10, right: 10 }}>
              <Pie
                data={routeData}
                dataKey="count"
                nameKey="route"
                cx="50%"
                cy="45%"
                innerRadius={55}
                outerRadius={75}
                paddingAngle={4}
              >
                {routeData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "#fffbf2", borderColor: "#b9b29c", fontSize: 11, color: "#373223" }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={40} 
                iconSize={8} 
                iconType="circle"
                wrapperStyle={{ fontSize: 11, fontFamily: "Inter", paddingTop: 16 }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}

export function EcosystemGrowthChart({ ecosystemData }: { ecosystemData?: EcosystemStats }) {
  if (!ecosystemData) return null;

  const data = [
    { name: "Existing SBI", value: ecosystemData.existing },
    { name: "New Discovered", value: ecosystemData.newly_discovered },
    { name: "Post-Conv expansion", value: ecosystemData.potential_expansion }
  ];

  return (
    <div className="bg-card border border-border rounded-lg p-6 flex flex-col h-full justify-between">
      <div>
        <h3 className="text-xs uppercase font-bold text-secondary tracking-widest border-b border-border pb-3 mb-6">Ecosystem Nodes</h3>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart 
              data={data} 
              layout="vertical" 
              margin={{ left: 15, right: 35, top: 15, bottom: 15 }}
            >
              <XAxis type="number" stroke="#6b5d4f" fontSize={10} axisLine={false} tickLine={false} />
              <YAxis dataKey="name" type="category" stroke="#6b5d4f" fontSize={10} width={110} axisLine={false} tickLine={false} />
              <Tooltip 
                contentStyle={{ backgroundColor: "#fffbf2", borderColor: "#b9b29c", fontSize: 11, color: "#373223" }}
                cursor={{ fill: "#f5eddd", opacity: 0.3 }}
              />
              <Bar 
                dataKey="value" 
                fill="#715b3e" 
                radius={[0, 4, 4, 0]} 
                barSize={18}
                label={{ position: "right", fill: "#373223", fontSize: 10, fontWeight: "600", offset: 8 }}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
