"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  TrendingUp,
  Truck,
  Clock,
  AlertTriangle,
  ArrowRight,
  Eye,
  RefreshCw
} from "lucide-react";
import { getAllAdminOrders, getDbProducts } from "@/data/queries";
import { Product } from "@/data/types";
import AdminDashboardCharts from "@/components/admin/AdminDashboardCharts";

export default function AdminDashboardPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = async () => {
    setLoading(true);
    try {
      const [ordersData, productsData] = await Promise.all([
        getAllAdminOrders(),
        getDbProducts(),
      ]);
      setOrders(ordersData);
      setProducts(productsData);
    } catch (err) {
      console.error("Error loading dashboard data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Compute KPIs
  const totalSalesAr = orders.reduce((sum, o) => sum + (o.montant_total || 0), 0);
  const pendingOrdersCount = orders.filter((o) => o.statut === "EN_ATTENTE").length;
  const inPrepOrdersCount = orders.filter((o) => o.statut === "CONFIRMEE").length;
  const lowStockProductsCount = products.filter(
    (p) => (p.stock !== undefined ? p.stock : 10) <= 5
  ).length;

  const recentOrders = orders.slice(0, 5);

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case "EN_ATTENTE":
        return (
          <span className="px-2.5 py-1 text-xs rounded-full font-label-md bg-amber-100 text-amber-800 border border-amber-300">
            En attente
          </span>
        );
      case "CONFIRMEE":
        return (
          <span className="px-2.5 py-1 text-xs rounded-full font-label-md bg-blue-100 text-blue-800 border border-blue-300">
            En préparation
          </span>
        );
      case "EXPEDIEE":
        return (
          <span className="px-2.5 py-1 text-xs rounded-full font-label-md bg-purple-100 text-purple-800 border border-purple-300">
            En route
          </span>
        );
      case "LIVREE":
        return (
          <span className="px-2.5 py-1 text-xs rounded-full font-label-md bg-emerald-100 text-emerald-800 border border-emerald-300">
            Livrée
          </span>
        );
      case "ANNULEE":
        return (
          <span className="px-2.5 py-1 text-xs rounded-full font-label-md bg-rose-100 text-rose-800 border border-rose-300">
            Annulée
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 text-xs rounded-full font-label-md bg-surface-container-high text-on-surface-variant">
            {statut}
          </span>
        );
    }
  };

  return (
    <div className="space-y-lg pt-md">
      {/* Header */}
      <div className="flex justify-between items-end mb-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-primary mb-1">
            Aperçu Général
          </h2>
          <p className="font-body-md text-on-surface-variant">
            Suivi des performances et opérations du jour.
          </p>
        </div>
        <button
          onClick={loadData}
          disabled={loading}
          className="flex items-center gap-xs font-label-md text-xs text-primary hover:text-secondary transition-colors cursor-pointer bg-surface-container-low border border-outline-variant/30 px-3 py-1.5 rounded-lg"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Actualiser
        </button>
      </div>

      {/* KPI Bento Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
        {/* KPI 1: Sales */}
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-md relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-primary/10 rounded-lg text-primary">
              <TrendingUp size={22} />
            </div>
            <span className="inline-flex items-center gap-1 font-caption text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full font-medium">
              Actif
            </span>
          </div>
          <div>
            <h3 className="font-label-md text-xs text-on-surface-variant mb-1">
              Chiffre d&apos;affaires Total
            </h3>
            <p className="font-headline-md text-xl md:text-2xl font-bold text-on-surface">
              {totalSalesAr.toLocaleString()} Ar
            </p>
          </div>
        </div>

        {/* KPI 2: Pending Orders */}
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-md relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-amber-100 rounded-lg text-amber-700">
              <Truck size={22} />
            </div>
            <span className="font-label-md text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full font-medium">
              À traiter
            </span>
          </div>
          <div>
            <h3 className="font-label-md text-xs text-on-surface-variant mb-1">
              Commandes en attente
            </h3>
            <p className="font-headline-md text-xl md:text-2xl font-bold text-on-surface">
              {pendingOrdersCount}
            </p>
          </div>
        </div>

        {/* KPI 3: In Prep */}
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-md relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-blue-100 rounded-lg text-blue-700">
              <Clock size={22} />
            </div>
            <span className="inline-flex items-center gap-1 font-caption text-xs text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full font-medium">
              En cours
            </span>
          </div>
          <div>
            <h3 className="font-label-md text-xs text-on-surface-variant mb-1">
              Commandes en prépa.
            </h3>
            <p className="font-headline-md text-xl md:text-2xl font-bold text-on-surface">
              {inPrepOrdersCount}
            </p>
          </div>
        </div>

        {/* KPI 4: Low Stock Alert */}
        <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl p-md relative overflow-hidden group hover:shadow-md transition-all duration-300">
          <div className="flex justify-between items-start mb-4">
            <div className="p-2.5 bg-rose-100 rounded-lg text-rose-700">
              <AlertTriangle size={22} />
            </div>
            <span className="font-label-md text-xs text-rose-700 bg-rose-50 px-2 py-0.5 rounded-full font-medium">
              Alerte
            </span>
          </div>
          <div>
            <h3 className="font-label-md text-xs text-on-surface-variant mb-1">
              Alertes Stock Faible
            </h3>
            <p className="font-headline-md text-xl md:text-2xl font-bold text-rose-700">
              {lowStockProductsCount} Produit{lowStockProductsCount > 1 ? "s" : ""}
            </p>
          </div>
        </div>
      </div>

      {/* Sales & Statistics Charts */}
      {!loading && <AdminDashboardCharts orders={orders} products={products} />}

      {/* Recent Orders Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/50 rounded-xl overflow-hidden shadow-xs">
        <div className="px-md py-sm border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-low/50">
          <h3 className="font-label-md text-base text-on-surface font-semibold">
            Commandes Récentes
          </h3>
          <Link
            href="/admin/commandes"
            className="font-label-md text-xs text-primary hover:text-secondary transition-colors flex items-center gap-1 font-medium"
          >
            Voir tout <ArrowRight size={14} />
          </Link>
        </div>

        {loading ? (
          <div className="p-xl text-center text-on-surface-variant font-body-md animate-pulse">
            Chargement du tableau de bord...
          </div>
        ) : recentOrders.length === 0 ? (
          <div className="p-xl text-center text-on-surface-variant font-body-md">
            Aucune commande récente.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface/50 font-caption text-xs text-on-surface-variant uppercase tracking-wider">
                  <th className="px-md py-3 font-semibold">N° Commande</th>
                  <th className="px-md py-3 font-semibold">Client</th>
                  <th className="px-md py-3 font-semibold">Date</th>
                  <th className="px-md py-3 font-semibold">Total</th>
                  <th className="px-md py-3 font-semibold">Statut</th>
                  <th className="px-md py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-sm divide-y divide-outline-variant/20">
                {recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-container-low/30 transition-colors"
                  >
                    <td className="px-md py-4 text-on-surface font-semibold font-mono">
                      #{order.id.slice(0, 8)}
                    </td>
                    <td className="px-md py-4 text-on-surface-variant">
                      {order.client?.nom || "Client Invité"}
                    </td>
                    <td className="px-md py-4 text-on-surface-variant text-xs">
                      {new Date(order.date_commande).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-md py-4 text-primary font-bold">
                      {order.montant_total.toLocaleString()} Ar
                    </td>
                    <td className="px-md py-4">{getStatusBadge(order.statut)}</td>
                    <td className="px-md py-4 text-right">
                      <Link
                        href={`/admin/commandes?open=${order.id}`}
                        className="inline-flex items-center gap-xs px-2.5 py-1 rounded-md text-xs font-label-md text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Eye size={14} />
                        Détails
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
