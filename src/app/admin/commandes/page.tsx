"use client";

import React, { useState, useEffect } from "react";
import {
  Search,
  Eye,
  X,
  Truck,
  User,
  MapPin,
  Clock,
  CheckCircle2,
  Phone,
  Mail,
  RefreshCw,
  ShoppingBag
} from "lucide-react";
import { getAllAdminOrders, updateOrderStatus } from "@/data/queries";

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("TOUS");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const loadOrders = async () => {
    setLoading(true);
    try {
      const data = await getAllAdminOrders();
      setOrders(data);

      // Check if URL has ?open=orderId
      const params = new URLSearchParams(window.location.search);
      const openId = params.get("open");
      if (openId) {
        const found = data.find((o) => o.id === openId);
        if (found) setSelectedOrder(found);
      }
    } catch (err) {
      console.error("Error loading admin orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      showToast(`Statut de la commande #${orderId.slice(0, 8)} mis à jour !`);
      // Update local state
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, statut: newStatus } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev: any) => ({ ...prev, statut: newStatus }));
      }
    } catch (err) {
      console.error("Error updating order status:", err);
      showToast("Erreur lors de la mise à jour du statut.");
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      !searchQuery.trim() ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.client?.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.client?.telephone?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === "TOUS" || o.statut === statusFilter;

    return matchesSearch && matchesStatus;
  });

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
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-primary text-on-primary px-md py-sm rounded-lg shadow-xl flex items-center gap-xs font-label-md animate-bounce">
          <CheckCircle2 size={18} />
          {toastMessage}
        </div>
      )}

      {/* Page Header */}
      <div className="flex justify-between items-end mb-md">
        <div>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Gestion des Commandes
          </h2>
          <p className="font-body-md text-on-surface-variant mt-xs">
            Supervisez et gérez les flux de livraison.
          </p>
        </div>
        <button
          onClick={loadOrders}
          disabled={loading}
          className="flex items-center gap-xs font-label-md text-xs text-primary hover:text-secondary transition-colors cursor-pointer bg-surface-container-low border border-outline-variant/30 px-3 py-1.5 rounded-lg"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Actualiser
        </button>
      </div>

      {/* Controls Bar */}
      <div className="bg-surface border border-outline-variant/40 rounded-xl p-md flex flex-wrap items-end gap-md shadow-xs">
        {/* Search */}
        <div className="flex-1 min-w-[240px]">
          <label className="font-label-md text-xs text-on-surface block mb-1 font-semibold">
            Recherche
          </label>
          <div className="relative">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant"
            />
            <input
              type="text"
              placeholder="N° Commande, Client, Téléphone..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface-bright border border-outline-variant rounded-lg pl-9 pr-sm py-2 text-xs text-on-surface focus:border-primary outline-none"
            />
          </div>
        </div>

        {/* Status Filter */}
        <div className="w-full sm:w-56">
          <label className="font-label-md text-xs text-on-surface block mb-1 font-semibold">
            Filtrer par Statut
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-surface-bright border border-outline-variant rounded-lg px-sm py-2 text-xs text-on-surface focus:border-primary outline-none cursor-pointer font-medium"
          >
            <option value="TOUS">Tous les statuts</option>
            <option value="EN_ATTENTE">En attente</option>
            <option value="CONFIRMEE">En préparation (Confirmée)</option>
            <option value="EXPEDIEE">En route (Expédiée)</option>
            <option value="LIVREE">Livrée</option>
            <option value="ANNULEE">Annulée</option>
          </select>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-surface-container-lowest border border-outline-variant/40 rounded-xl overflow-hidden shadow-xs">
        {loading ? (
          <div className="p-xl text-center text-on-surface-variant animate-pulse">
            Chargement des commandes...
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="p-xl text-center text-on-surface-variant space-y-xs">
            <ShoppingBag size={36} className="mx-auto text-on-surface-variant/50" />
            <p>Aucune commande ne correspond à vos critères.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-outline-variant/30 bg-surface-container-low/50 text-on-surface-variant font-label-md text-xs uppercase tracking-wider">
                  <th className="p-sm md:p-md font-semibold">N° Commande</th>
                  <th className="p-sm md:p-md font-semibold">Client</th>
                  <th className="p-sm md:p-md font-semibold">Date</th>
                  <th className="p-sm md:p-md font-semibold">Livraison</th>
                  <th className="p-sm md:p-md font-semibold">Total</th>
                  <th className="p-sm md:p-md font-semibold">Statut</th>
                  <th className="p-sm md:p-md font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="font-body-md text-sm divide-y divide-outline-variant/20">
                {filteredOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="hover:bg-surface-container-low/30 transition-colors"
                  >
                    <td className="p-sm md:p-md font-mono font-bold text-on-surface">
                      #{order.id.slice(0, 8)}
                    </td>

                    <td className="p-sm md:p-md">
                      <div>
                        <p className="font-semibold text-on-surface">
                          {order.client?.nom || "Client Invité"}
                        </p>
                        <p className="font-caption text-xs text-on-surface-variant">
                          {order.client?.telephone || "Téléphone non renseigné"}
                        </p>
                      </div>
                    </td>

                    <td className="p-sm md:p-md text-xs text-on-surface-variant">
                      {new Date(order.date_commande).toLocaleDateString("fr-FR", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </td>

                    <td className="p-sm md:p-md text-xs text-on-surface-variant">
                      <p className="font-medium text-on-surface">
                        {order.livraison?.zone_livraison || "Antananarivo"}
                      </p>
                      <p className="line-clamp-1">
                        {order.livraison?.adresse_detaillee || "Livraison locale"}
                      </p>
                    </td>

                    <td className="p-sm md:p-md font-bold text-primary">
                      {order.montant_total.toLocaleString()} Ar
                    </td>

                    <td className="p-sm md:p-md">
                      <select
                        value={order.statut}
                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                        className="bg-surface-bright border border-outline-variant rounded-md px-2 py-1 text-xs font-label-md text-on-surface focus:border-primary outline-none cursor-pointer"
                      >
                        <option value="EN_ATTENTE">En attente</option>
                        <option value="CONFIRMEE">En préparation</option>
                        <option value="EXPEDIEE">En route</option>
                        <option value="LIVREE">Livrée</option>
                        <option value="ANNULEE">Annulée</option>
                      </select>
                    </td>

                    <td className="p-sm md:p-md text-right">
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="inline-flex items-center gap-xs px-2.5 py-1 rounded-md text-xs font-label-md text-primary hover:bg-primary/10 transition-colors cursor-pointer"
                      >
                        <Eye size={14} />
                        Détails
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ORDER DETAILS SLIDE-OVER DRAWER */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex justify-end">
          {/* Backdrop */}
          <div
            onClick={() => setSelectedOrder(null)}
            className="absolute inset-0 bg-tertiary/20 backdrop-blur-[4px] transition-opacity cursor-pointer"
          />

          {/* Slide-over Panel */}
          <aside className="relative w-full max-w-2xl h-full bg-surface-container-lowest border-l border-outline-variant flex flex-col shadow-2xl z-10 animate-in slide-in-from-right duration-300">
            {/* Panel Header */}
            <header className="px-lg py-md border-b border-outline-variant/30 flex justify-between items-center bg-surface-container-lowest shrink-0">
              <div>
                <div className="flex items-center gap-sm">
                  <h3 className="font-headline-md text-lg font-bold text-on-surface">
                    Commande #{selectedOrder.id.slice(0, 8)}
                  </h3>
                  <span className="bg-surface-container-high text-on-surface-variant font-caption text-xs px-2.5 py-0.5 rounded-full border border-outline-variant">
                    {new Date(selectedOrder.date_commande).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "short",
                      hour: "2-digit",
                      minute: "2-digit"
                    })}
                  </span>
                </div>

                <div className="flex items-center gap-xs mt-2">
                  <span className="font-caption text-xs text-on-surface-variant">Statut actuel :</span>
                  <select
                    value={selectedOrder.statut}
                    onChange={(e) => handleStatusChange(selectedOrder.id, e.target.value)}
                    className="bg-primary/10 border border-primary/30 text-primary font-label-md text-xs rounded-full py-0.5 px-3 focus:outline-none cursor-pointer"
                  >
                    <option value="EN_ATTENTE">En attente</option>
                    <option value="CONFIRMEE">En préparation</option>
                    <option value="EXPEDIEE">En route</option>
                    <option value="LIVREE">Livrée</option>
                    <option value="ANNULEE">Annulée</option>
                  </select>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrder(null)}
                className="w-9 h-9 flex items-center justify-center rounded-full text-on-surface-variant hover:bg-surface-container hover:text-on-surface transition-colors cursor-pointer"
              >
                <X size={20} />
              </button>
            </header>

            {/* Panel Body */}
            <div className="flex-1 overflow-y-auto px-lg py-lg space-y-md bg-surface-container-lowest">
              {/* Delivery Info */}
              <div className="bg-surface border border-outline-variant/50 rounded-xl p-md space-y-xs">
                <div className="flex items-center gap-xs text-primary font-semibold text-xs uppercase tracking-wider">
                  <MapPin size={16} />
                  Détails de la livraison
                </div>
                <div className="text-sm space-y-1 pt-xs">
                  <p className="text-on-surface font-medium">
                    {selectedOrder.livraison?.adresse_detaillee || "Adresse non spécifiée"}
                  </p>
                  <p className="text-on-surface-variant text-xs">
                    Zone : {selectedOrder.livraison?.zone_livraison || "Non spécifiée"} — Ville : {selectedOrder.livraison?.ville || "Antananarivo"}
                  </p>
                  {selectedOrder.livraison?.repere && (
                    <p className="text-on-surface-variant text-xs italic">
                      Repères : &quot;{selectedOrder.livraison.repere}&quot;
                    </p>
                  )}
                </div>
              </div>

              {/* Client Info */}
              <div className="bg-surface border border-outline-variant/50 rounded-xl p-md space-y-xs">
                <div className="flex items-center gap-xs text-primary font-semibold text-xs uppercase tracking-wider">
                  <User size={16} />
                  Informations Client
                </div>
                <div className="text-sm space-y-1 pt-xs">
                  <p className="text-on-surface font-semibold">
                    {selectedOrder.client?.nom || "Client Invité"}
                  </p>
                  <p className="text-on-surface-variant text-xs flex items-center gap-xs">
                    <Phone size={14} />
                    {selectedOrder.client?.telephone || "Non renseigné"}
                  </p>
                  <p className="text-on-surface-variant text-xs flex items-center gap-xs">
                    <Mail size={14} />
                    {selectedOrder.client?.email || "Non renseigné"}
                  </p>
                </div>
              </div>

              {/* Items List */}
              <div className="bg-surface border border-outline-variant/50 rounded-xl p-md space-y-sm">
                <h4 className="font-label-md text-xs font-semibold text-primary uppercase tracking-wider">
                  Articles Commandés ({selectedOrder.items?.length || 0})
                </h4>
                <div className="divide-y divide-outline-variant/20">
                  {selectedOrder.items?.map((item: any, idx: number) => (
                    <div key={idx} className="py-sm flex items-center gap-md">
                      <img
                        src={item.image_url}
                        alt={item.nom_produit}
                        className="w-12 h-12 object-cover rounded-md border border-outline-variant/30 shrink-0"
                      />
                      <div className="flex-grow">
                        <p className="font-label-md text-sm font-semibold text-on-surface">
                          {item.nom_produit}
                        </p>
                        <p className="font-caption text-xs text-on-surface-variant">
                          Quantité : {item.quantite} x {item.prix_unitaire_applique.toLocaleString()} Ar
                        </p>
                      </div>
                      <span className="font-label-md text-sm font-bold text-primary">
                        {(item.quantite * item.prix_unitaire_applique).toLocaleString()} Ar
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Calculation */}
              <div className="bg-surface-container-low border border-outline-variant/40 rounded-xl p-md space-y-xs">
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>Sous-total :</span>
                  <span>{(selectedOrder.montant_total - (selectedOrder.livraison?.frais_livraison || 0)).toLocaleString()} Ar</span>
                </div>
                <div className="flex justify-between text-xs text-on-surface-variant">
                  <span>Frais de livraison :</span>
                  <span>{(selectedOrder.livraison?.frais_livraison || 0).toLocaleString()} Ar</span>
                </div>
                <div className="flex justify-between text-base font-bold text-primary pt-xs border-t border-outline-variant/30">
                  <span>Total de la commande :</span>
                  <span>{selectedOrder.montant_total.toLocaleString()} Ar</span>
                </div>
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
