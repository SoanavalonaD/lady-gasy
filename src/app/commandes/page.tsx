"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/context/CartContext";
import { getOrderHistory, updateOrderStatus } from "@/data/queries";
import {
  Package,
  Truck,
  CheckCircle2,
  XCircle,
  Clock,
  ChevronRight,
  ShoppingBag,
  ArrowRight,
  LogIn,
  RefreshCw,
  X,
  MapPin,
  Calendar,
  CreditCard
} from "lucide-react";

export default function OrderHistoryPage() {
  const router = useRouter();
  const { addToCart } = useCart();

  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"ALL" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED">("ALL");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [cancellingId, setCancellingId] = useState<string | null>(null);

  // Cancel order function
  const handleCancelOrder = async (orderId: string) => {
    if (!window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
      return;
    }
    try {
      setCancellingId(orderId);
      await updateOrderStatus(orderId, "ANNULEE");
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, statut: "ANNULEE" } : o))
      );
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder((prev: any) => (prev ? { ...prev, statut: "ANNULEE" } : null));
      }
      setToastMessage("La commande a été annulée avec succès.");
      setTimeout(() => setToastMessage(null), 3000);
    } catch (err) {
      console.error("Erreur lors de l'annulation:", err);
      alert("Erreur lors de l'annulation de la commande.");
    } finally {
      setCancellingId(null);
    }
  };

  // Check login & load order history
  useEffect(() => {
    const fetchOrders = async () => {
      const userId = sessionStorage.getItem("userId");
      const logged = sessionStorage.getItem("isLoggedIn") === "true";

      if (!userId || !logged) {
        setIsLoggedIn(false);
        setLoading(false);
        return;
      }

      setIsLoggedIn(true);

      if (userId) {
        try {
          const data = await getOrderHistory(userId);
          setOrders(data);
        } catch (err) {
          console.error("Erreur lors de la récupération des commandes:", err);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on active tab
  const filteredOrders = orders.filter((order) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "IN_PROGRESS")
      return ["EN_ATTENTE", "CONFIRMEE", "EXPEDIEE"].includes(order.statut);
    if (activeTab === "COMPLETED") return order.statut === "LIVREE";
    if (activeTab === "CANCELLED") return order.statut === "ANNULEE";
    return true;
  });

  // Re-order function
  const handleReorder = (order: any) => {
    if (!order?.items) return;
    order.items.forEach((item: any) => {
      const productId = item.id_produit;
      if (!productId) return;

      addToCart(
        {
          id: productId,
          name: item.nom_produit,
          description: "",
          priceEur: item.prix_unitaire_applique,
          priceAr: item.prix_unitaire_applique,
          image: item.image_url
        },
        item.quantite
      );
    });
    setToastMessage("Les articles ont été ajoutés à votre panier !");
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Helper for Status Badge styling
  const renderStatusBadge = (statut: string) => {
    switch (statut) {
      case "CONFIRMEE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-label-md text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
            CONFIRMÉE
          </span>
        );
      case "EXPEDIEE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-blue-800 border border-blue-200 font-label-md text-xs font-semibold">
            <Truck size={14} className="text-blue-600" />
            EXPÉDIÉE
          </span>
        );
      case "LIVREE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 font-label-md text-xs font-semibold">
            <CheckCircle2 size={14} className="text-primary" />
            LIVRÉE
          </span>
        );
      case "ANNULEE":
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200 font-label-md text-xs font-semibold">
            <XCircle size={14} className="text-rose-600" />
            ANNULÉE
          </span>
        );
      case "EN_ATTENTE":
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-900 border border-amber-200 font-label-md text-xs font-semibold">
            <Clock size={14} className="text-amber-600" />
            EN ATTENTE
          </span>
        );
    }
  };

  // 1. Loading State
  if (loading) {
    return (
      <>
        <Header />
        <main className="flex-grow pt-[120px] pb-xl max-w-[1280px] mx-auto w-full px-container-padding text-center flex items-center justify-center min-h-[50vh]">
          <div className="flex flex-col items-center gap-md">
            <RefreshCw size={36} className="text-primary animate-spin" />
            <p className="font-body-md text-on-surface-variant">Chargement de votre historique de commandes...</p>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // 2. Auth Guard State (Not logged in)
  if (!isLoggedIn) {
    return (
      <>
        <Header />
        <main className="flex-grow pt-[120px] pb-xl max-w-[600px] mx-auto w-full px-container-padding flex flex-col items-center justify-center text-center">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-xl shadow-sm w-full my-lg">
            <LogIn size={48} className="text-primary mb-md mx-auto" />
            <h1 className="font-headline-lg text-headline-lg text-primary mb-sm">
              Connexion Requise
            </h1>
            <p className="font-body-md text-on-surface-variant mb-lg leading-relaxed">
              Pour consulter votre historique de commandes et suivre vos réservations en cours, veuillez vous connecter.
            </p>
            <div className="space-y-sm">
              <Link
                href="/connexion"
                className="w-full bg-primary hover:bg-surface-tint text-on-primary py-md rounded-md font-label-md text-label-md transition-all duration-300 flex items-center justify-center gap-sm cursor-pointer shadow-sm hover:shadow-md"
              >
                Se connecter
                <ArrowRight size={18} />
              </Link>
              <Link href="/catalogue" className="w-full text-primary hover:text-secondary font-label-md py-sm block transition-all">
                Retourner au catalogue
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // 3. Main Orders Page
  return (
    <>
      <Header />
      <main className="flex-grow pt-[120px] pb-xl max-w-[1280px] mx-auto w-full px-container-padding md:px-lg">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-lg right-lg z-50 bg-primary text-on-primary font-label-md px-lg py-md rounded-xl shadow-lg transition-all duration-300 flex items-center gap-sm animate-bounce">
            <CheckCircle2 size={24} />
            {toastMessage}
          </div>
        )}

        {/* Page Title */}
        <div className="mb-lg">
          <h1 className="font-headline-lg text-headline-lg text-primary mb-xs">
            Mes Commandes
          </h1>
          <p className="font-body-md text-on-surface-variant">
            Consultez l&apos;historique et le statut de vos réservations de soins botaniques.
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-sm mb-lg border-b border-outline-variant pb-xs">
          <button
            onClick={() => setActiveTab("ALL")}
            className={`font-label-md text-label-md px-sm py-xs transition-colors duration-200 cursor-pointer ${
              activeTab === "ALL"
                ? "text-primary border-b-2 border-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Toutes ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab("IN_PROGRESS")}
            className={`font-label-md text-label-md px-sm py-xs transition-colors duration-200 cursor-pointer ${
              activeTab === "IN_PROGRESS"
                ? "text-primary border-b-2 border-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            En cours ({orders.filter((o) => ["EN_ATTENTE", "CONFIRMEE", "EXPEDIEE"].includes(o.statut)).length})
          </button>
          <button
            onClick={() => setActiveTab("COMPLETED")}
            className={`font-label-md text-label-md px-sm py-xs transition-colors duration-200 cursor-pointer ${
              activeTab === "COMPLETED"
                ? "text-primary border-b-2 border-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Terminées ({orders.filter((o) => o.statut === "LIVREE").length})
          </button>
          <button
            onClick={() => setActiveTab("CANCELLED")}
            className={`font-label-md text-label-md px-sm py-xs transition-colors duration-200 cursor-pointer ${
              activeTab === "CANCELLED"
                ? "text-primary border-b-2 border-primary font-bold"
                : "text-on-surface-variant hover:text-primary"
            }`}
          >
            Annulées ({orders.filter((o) => o.statut === "ANNULEE").length})
          </button>
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-xl px-md text-center bg-surface-container-lowest border border-[#E0D7CC] rounded-xl shadow-sm my-md">
            <div className="w-16 h-16 rounded-full bg-surface-container flex items-center justify-center mb-md text-primary">
              <Package size={32} />
            </div>
            <h3 className="font-headline-md text-headline-md text-primary mb-xs">
              Aucune commande trouvée
            </h3>
            <p className="font-body-md text-on-surface-variant mb-lg">
              {activeTab === "ALL"
                ? "Vous n'avez pas encore passé de commande. Découvrez notre sélection d'expertise botanique."
                : "Aucune commande ne correspond à ce filtre pour le moment."}
            </p>
            <Link
              href="/catalogue"
              className="bg-primary text-on-primary font-label-md px-lg py-sm rounded hover:bg-surface-tint transition-all shadow-sm cursor-pointer"
            >
              Explorer le catalogue
            </Link>
          </div>
        ) : (
          /* Orders Bento Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-lg mb-xl">
            {filteredOrders.map((order) => {
              const formattedDate = order.date_commande
                ? new Date(order.date_commande).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                  })
                : "Récemment";

              const itemCount = (order.items || []).reduce(
                (sum: number, i: any) => sum + i.quantite,
                0
              );

              return (
                <div
                  key={order.id}
                  className="bg-surface-container-lowest border border-[#E0D7CC] rounded-xl p-lg flex flex-col justify-between hover:shadow-[0_10px_30px_rgba(51,69,13,0.08)] transition-all duration-300 relative group overflow-hidden"
                >
                  <div>
                    {/* Header: ID & Badge */}
                    <div className="flex justify-between items-start mb-md">
                      <div>
                        <span className="font-caption text-xs text-on-surface-variant block uppercase tracking-wider">
                          Commande n°
                        </span>
                        <span className="font-label-md text-sm text-primary font-bold font-mono">
                          #{order.id.slice(0, 8)}
                        </span>
                      </div>
                      {renderStatusBadge(order.statut)}
                    </div>

                    {/* Date & Total */}
                    <div className="flex justify-between items-center border-t border-outline-variant/40 pt-md mb-md">
                      <div>
                        <span className="font-caption text-xs text-on-surface-variant block">Date</span>
                        <span className="font-body-md text-on-surface font-medium">{formattedDate}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-caption text-xs text-on-surface-variant block">Total</span>
                        <span className="font-headline-md text-xl text-primary font-bold">
                          {order.montant_total.toLocaleString()} Ar
                        </span>
                      </div>
                    </div>

                    {/* Preview Images */}
                    <div className="flex items-center gap-xs mb-md overflow-x-auto pb-xs">
                      {(order.items || []).slice(0, 4).map((item: any, idx: number) => (
                        <div
                          key={idx}
                          className="w-12 h-12 rounded bg-surface-container-low border border-outline-variant/30 overflow-hidden flex-shrink-0"
                          title={item.nom_produit}
                        >
                          <img
                            src={item.image_url}
                            alt={item.nom_produit}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                      {order.items?.length > 4 && (
                        <div className="w-12 h-12 rounded bg-surface-container text-on-surface-variant font-label-md text-xs flex items-center justify-center flex-shrink-0">
                          +{order.items.length - 4}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Card Footer: Article Count & Actions */}
                  <div className="pt-sm border-t border-outline-variant/40 flex justify-between items-center mt-auto gap-xs">
                    <span className="font-caption text-xs text-on-surface-variant flex items-center gap-xs">
                      <Package size={16} className="text-primary" />
                      {itemCount} {itemCount > 1 ? "articles" : "article"}
                    </span>

                    <div className="flex items-center gap-xs">
                      {order.statut !== "ANNULEE" && order.statut !== "LIVREE" && (
                        <button
                          onClick={() => handleCancelOrder(order.id)}
                          disabled={cancellingId === order.id}
                          className="font-label-md text-xs text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2.5 py-1.5 rounded transition-colors duration-200 cursor-pointer flex items-center gap-1 font-medium disabled:opacity-50"
                        >
                          <XCircle size={14} />
                          {cancellingId === order.id ? "Annulation..." : "Annuler"}
                        </button>
                      )}
                      <button
                        onClick={() => setSelectedOrder(order)}
                        className="font-label-md text-xs text-secondary border border-secondary px-md py-1.5 rounded hover:bg-secondary hover:text-on-secondary transition-colors duration-200 cursor-pointer shadow-sm font-medium"
                      >
                        Voir les détails
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Order Details Modal / Drawer */}
        {selectedOrder && (
          <div className="fixed inset-0 z-50 bg-on-surface/40 backdrop-blur-sm flex items-center justify-center p-md animate-fade-in">
            <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl overflow-y-auto shadow-2xl p-lg relative">
              {/* Close Button */}
              <button
                onClick={() => setSelectedOrder(null)}
                className="absolute top-md right-md p-2 text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
                aria-label="Fermer"
              >
                <X size={20} />
              </button>

              {/* Modal Header */}
              <div className="mb-md border-b border-outline-variant pb-md">
                <span className="font-caption text-xs text-on-surface-variant block uppercase tracking-wider">
                  Détail de la commande
                </span>
                <h2 className="font-headline-md text-xl text-primary font-bold font-mono mt-xs">
                  #{selectedOrder.id}
                </h2>
                <div className="mt-xs">{renderStatusBadge(selectedOrder.statut)}</div>
              </div>

              {/* Items List */}
              <div className="space-y-sm mb-md">
                <h3 className="font-label-md text-sm text-on-surface font-semibold uppercase tracking-wider">
                  Articles commandés
                </h3>
                <div className="space-y-xs max-h-48 overflow-y-auto pr-xs">
                  {(selectedOrder.items || []).map((item: any, idx: number) => (
                    <div
                      key={idx}
                      className="flex items-center gap-sm bg-surface-container-low p-xs rounded-lg border border-outline-variant/30"
                    >
                      <img
                        src={item.image_url}
                        alt={item.nom_produit}
                        className="w-12 h-12 object-cover rounded"
                      />
                      <div className="flex-grow">
                        <p className="font-label-md text-sm text-on-surface font-medium line-clamp-1">
                          {item.nom_produit}
                        </p>
                        <p className="font-caption text-xs text-on-surface-variant">
                          Qté : {item.quantite} × {item.prix_unitaire_applique.toLocaleString()} Ar
                        </p>
                      </div>
                      <span className="font-label-md text-sm text-primary font-semibold">
                        {(item.quantite * item.prix_unitaire_applique).toLocaleString()} Ar
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delivery Info */}
              {selectedOrder.livraison && (
                <div className="bg-surface-container-low p-md rounded-xl space-y-xs mb-md border border-outline-variant/30 text-xs font-body-md">
                  <h4 className="font-label-md text-primary font-semibold flex items-center gap-xs">
                    <MapPin size={14} />
                    Livraison :
                  </h4>
                  <p className="text-on-surface font-medium">
                    {selectedOrder.livraison.adresse_detaillee},{" "}
                    {selectedOrder.livraison.zone_livraison}, {selectedOrder.livraison.ville}
                  </p>
                </div>
              )}

              {/* Summary Totals */}
              <div className="border-t border-outline-variant pt-md mb-lg space-y-xs">
                <div className="flex justify-between text-sm text-on-surface font-bold">
                  <span>Montant Total :</span>
                  <span className="text-primary text-lg">
                    {selectedOrder.montant_total.toLocaleString()} Ar
                  </span>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="flex flex-col sm:flex-row gap-sm">
                <button
                  onClick={() => {
                    handleReorder(selectedOrder);
                    setSelectedOrder(null);
                  }}
                  className="flex-1 bg-primary text-on-primary font-label-md py-2.5 rounded-md hover:bg-surface-tint transition-colors flex items-center justify-center gap-xs cursor-pointer shadow-sm font-medium"
                >
                  <ShoppingBag size={16} />
                  Recommander
                </button>
                {selectedOrder.statut !== "ANNULEE" && selectedOrder.statut !== "LIVREE" && (
                  <button
                    onClick={() => handleCancelOrder(selectedOrder.id)}
                    disabled={cancellingId === selectedOrder.id}
                    className="px-md py-2.5 border border-red-300 text-red-700 bg-red-50 hover:bg-red-100 font-label-md rounded-md transition-colors cursor-pointer flex items-center justify-center gap-xs font-medium disabled:opacity-50"
                  >
                    <XCircle size={16} />
                    {cancellingId === selectedOrder.id ? "Annulation..." : "Annuler la commande"}
                  </button>
                )}
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="px-md py-2.5 border border-outline-variant text-on-surface-variant font-label-md rounded-md hover:bg-surface-container transition-colors cursor-pointer"
                >
                  Fermer
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
