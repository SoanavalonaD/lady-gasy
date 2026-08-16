"use client";

import React, { useMemo } from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend
} from "recharts";

interface AdminDashboardChartsProps {
  orders: any[];
  products: any[];
}

export default function AdminDashboardCharts({
  orders,
  products
}: AdminDashboardChartsProps) {
  // 1. Monthly Revenue Data (Grouped by Month)
  const revenueData = useMemo(() => {
    const monthsMap: { [key: string]: number } = {};

    // Generate last 6 months keys (e.g., "Jan", "Fév", "Mar", ...)
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const label = d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
      monthsMap[label] = 0;
    }

    orders.forEach((order) => {
      if (order.date_commande) {
        const d = new Date(order.date_commande);
        const label = d.toLocaleDateString("fr-FR", { month: "short", year: "2-digit" });
        if (monthsMap[label] !== undefined) {
          monthsMap[label] += Number(order.montant_total || 0);
        }
      }
    });

    return Object.keys(monthsMap).map((key) => ({
      month: key,
      ventes: monthsMap[key],
    }));
  }, [orders]);

  // 2. Category Distribution Data (PieChart)
  const categoryData = useMemo(() => {
    const categoryTotals: { [key: string]: number } = {
      CHEVEUX: 0,
      ONGLES: 0,
      ACCESSOIRES: 0,
      CILS: 0,
      LEVRES: 0,
    };

    orders.forEach((order) => {
      (order.items || []).forEach((item: any) => {
        const prodMatch = products.find((p) => p.id === item.id_produit);
        const cat = (prodMatch?.rawCategory || prodMatch?.categories?.[0] || "CHEVEUX").toUpperCase();
        const totalLine = Number(item.quantite || 1) * Number(item.prix_unitaire_applique || 0);

        if (categoryTotals[cat] !== undefined) {
          categoryTotals[cat] += totalLine;
        } else {
          categoryTotals["CHEVEUX"] += totalLine;
        }
      });
    });

    const colors = ["#436418", "#E69C24", "#7E57C2", "#26A69A", "#EC407A"];

    return Object.keys(categoryTotals)
      .map((cat, idx) => ({
        name: cat,
        value: categoryTotals[cat],
        color: colors[idx % colors.length],
      }))
      .filter((item) => item.value >= 0);
  }, [orders, products]);

  // 3. Status Breakdown Data (BarChart)
  const statusData = useMemo(() => {
    const statuses = [
      { key: "EN_ATTENTE", name: "En attente", fill: "#f59e0b" },
      { key: "CONFIRMEE", name: "En prépa.", fill: "#3b82f6" },
      { key: "EXPEDIEE", name: "En route", fill: "#8b5cf6" },
      { key: "LIVREE", name: "Livrée", fill: "#10b981" },
      { key: "ANNULEE", name: "Annulée", fill: "#f43f5e" },
    ];

    return statuses.map((st) => ({
      name: st.name,
      nombre: orders.filter((o) => o.statut === st.key).length,
      fill: st.fill,
    }));
  }, [orders]);

  const formatTooltipAriary = (value: any) => {
    return [`${Number(value).toLocaleString()} Ar`, "Chiffre d'affaires"];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-md">
      {/* Revenue Trend Area Chart */}
      <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-md shadow-xs flex flex-col justify-between">
        <div className="mb-sm flex justify-between items-center">
          <div>
            <h3 className="font-label-md text-base font-semibold text-on-surface">
              Évolution du Chiffre d&apos;Affaires (Ariary)
            </h3>
            <p className="font-caption text-xs text-on-surface-variant">
              Revenus mensuels générés par les commandes.
            </p>
          </div>
          <span className="font-label-md text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-medium">
            6 derniers mois
          </span>
        </div>

        <div className="w-full h-[260px] pt-xs">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#436418" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#436418" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} />
              <YAxis
                tick={{ fontSize: 11, fill: "#6b7280" }}
                axisLine={false}
                tickFormatter={(val) => `${(val / 1000).toFixed(0)}k`}
              />
              <Tooltip formatter={formatTooltipAriary} contentStyle={{ borderRadius: "8px", border: "1px solid #e5e7eb" }} />
              <Area type="monotone" dataKey="ventes" stroke="#436418" strokeWidth={3} fillOpacity={1} fill="url(#colorSales)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Sales Distribution Donut Chart */}
      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-md shadow-xs flex flex-col justify-between">
        <div>
          <h3 className="font-label-md text-base font-semibold text-on-surface mb-1">
            Ventes par Catégorie
          </h3>
          <p className="font-caption text-xs text-on-surface-variant mb-xs">
            Répartition des produits vendus.
          </p>
        </div>

        <div className="w-full h-[200px] relative flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={categoryData}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={80}
                paddingAngle={4}
                dataKey="value"
              >
                {categoryData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip formatter={(val: any) => [`${Number(val).toLocaleString()} Ar`, "Ventes"]} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap gap-xs justify-center pt-xs border-t border-outline-variant/30">
          {categoryData.map((item) => (
            <div key={item.name} className="flex items-center gap-1 text-[11px] font-medium text-on-surface-variant">
              <span className="w-2.5 h-2.5 rounded-full inline-block" style={{ backgroundColor: item.color }} />
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Breakdown Bar Chart */}
      <div className="lg:col-span-3 bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-md shadow-xs">
        <div className="mb-xs flex justify-between items-center">
          <div>
            <h3 className="font-label-md text-base font-semibold text-on-surface">
              Répartition des Commandes par Statut
            </h3>
            <p className="font-caption text-xs text-on-surface-variant">
              Volume de traitement des commandes dans le pipeline.
            </p>
          </div>
        </div>

        <div className="w-full h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={statusData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#6b7280" }} axisLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#6b7280" }} axisLine={false} allowDecimals={false} />
              <Tooltip formatter={(val: any) => [`${val} commande(s)`, "Volume"]} />
              <Bar dataKey="nombre" radius={[6, 6, 0, 0]}>
                {statusData.map((entry, index) => (
                  <Cell key={`bar-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
