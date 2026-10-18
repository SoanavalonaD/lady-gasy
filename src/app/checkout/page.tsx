"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/context/CartContext";
import { ShoppingBag, ArrowRight, Lock, LogIn, CheckCircle2 } from "lucide-react";
import { createOrderReservation } from "@/data/queries";

interface Neighborhood {
  name: string;
  zone: number;
  fee: number;
}

const neighborhoods: Neighborhood[] = [
  // Zone 1 (4,000 Ar)
  ...[
    "Belair", "Behoririka", "Besarety", "Betongolo", "Faravohitra", "Fasankarana",
    "Fiadanana", "Fort Voyron", "Fort Duchesne", "Gamo", "Ilanivato", "Ivandry Mahatony",
    "Ivandry Ambodivoanjo", "Isoraka", "Isotry", "Ivandry", "Mahamasina", "Mahavoky",
    "Mahazoarivo", "Manakambahiny", "Manjakaray", "Marohoho", "Mausolée", "Mahatony",
    "Manjakamiadana", "Mandroseza", "Namontana", "Nanisana", "Rasalama", "Ravitoto",
    "Soavinandriana Hopital", "Soanierana", "Soavimbahoaka", "Tsarahonenana", "Tsarasaotra",
    "Tsiazotafo", "Tsimbazaza", "Tsaramasay", "Tsaralalana", "Tsiadana", "67Ha"
  ].map(name => ({ name, zone: 1, fee: 4000 })),

  // Zone 2 (5,000 Ar)
  ...[
    "Ambatobe", "Ambohidroa", "Ambohidahy Mahazo", "Ambatomaro police", "Ambatomaro EPP",
    "Ambohibao Morondava", "Ambohibao Ambatolampy", "Ambohibao Pharmacie", "Ambodihady",
    "Ambohimahitsy", "Ampitatafika Commune", "Analamahitsy", "Andafiavaratra", "Andoharanofotsy",
    "Ankadindramamy", "Antsonjobe", "Androhibe", "Ankaraobato commune", "Antehiroka",
    "Alasora terminus 163", "Ankadievo", "Ampasika", "Andraisoro", "Andranomena",
    "Antanimenakely", "Beravina", "By pass Shell", "Itaosy Arrêt Hopital", "Itaosy Cité terminus 133",
    "Ivanja", "IMRA", "Ivato", "Imerinafovoany", "Mahazo", "Soamanandrariny fokontany",
    "Soavimasoandro FJKM", "Talatamaty Galana", "Talatamaty Amboropotsy", "Tanjombato"
  ].map(name => ({ name, zone: 2, fee: 5000 })),

  // Zone 3 (6,000 Ar)
  ...[
    "Ambatomaro Akanjo", "Ambodifasina Ambatolampy", "Ambohijanahary Terminus 114",
    "Ambohitrarahaba school vert", "Ambohimamory", "Ankadikely Ilafy", "Antsobolo",
    "Ambohinambo", "Analamahitsy carrière", "Andrononobe", "Andranoro", "Ankadindravola",
    "Fiadanamanga", "Iavoloha Jovana", "Itaosy Ambohijanamasoandro", "Itaosy terminus 133 hopitaly",
    "Ivato Aéroport", "Ivato Andraondrikely", "Ivato Ambodirano", "Ivato Horizon",
    "Mandrimena", "Manjaka Ilafy", "Masinadriana Ilafy", "Masinandriana Ambatobe",
    "Soavina", "Sabotsy Namehana commune", "Talatamaty Bel Air"
  ].map(name => ({ name, zone: 3, fee: 6000 })),

  // Zone 4 (8,000 Ar)
  ...[
    "Ambodiafontsy", "Ambodifasina", "Ambohimangakely Jovana", "Ambohimangidy Ampitatafika",
    "Ambohitrimanjaka pharmacie", "Ambatofotsy", "Ampitatafika", "Ampitatafika TSARARAY",
    "Ambohitrapeto Itaosy", "Andranotapahana Talatamaty", "Antalamohitra", "Antanandrano",
    "Antanetibe", "Antsambilo Ivato", "Antsahatsiresy", "Alasora Commune", "Alasora Amboaroy",
    "Alasora Ambodivondava", "Amoronakona", "Iavoloha Galana/tanàna", "Iavoloha Palais",
    "Ilafy Terminus 192", "Itaosy Andohatanjona", "Itaosy Antsahamasina", "Itaosy Vinany(Ambavahady Tokana)",
    "Ivato Anjomakely", "Namehana", "Route Ambohimanambola", "Talatamaty Soa Village",
    "Tsarafara Sabotsy Namehana", "Tsararay Ampitatafika", "Sabotsy Namehana Ambatofotsy",
    "Sabotsy Namehana Ambohidrano"
  ].map(name => ({ name, zone: 4, fee: 8000 })),

  // Zone 5 (10,000 Ar)
  ...[
    "Ambohidratrimo", "Ambohijanaka", "Ambohimanambola", "Ambohimanala", "Ambohimalaza Ambohimangakely",
    "Ambohitrimanjaka commune", "Ampitatafika Ambohimiadana", "Andalanomby", "Anosy Avaratra",
    "Bevalala", "CrokFarm", "Imerimanjaka", "Behitsy", "Fenoarivo Total", "Iavoloha Ambohibao BONGATSARA",
    "Itaosy Ambohidava", "Itaosy Marobiby", "Manandriana", "Manjakandriana", "Namehana",
    "Soavinimerina Sabotsy Namehana"
  ].map(name => ({ name, zone: 5, fee: 10000 })),

  // Province
  { name: "Province", zone: 6, fee: 0 }
];

export default function CheckoutPage() {
  const router = useRouter();
  const { cartItems, subtotalAr, clearCart } = useCart();

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [ville, setVille] = useState("");
  const [deliveryLocation, setDeliveryLocation] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  
  // Combobox State
  const [searchQuartier, setSearchQuartier] = useState("");
  const [selectedQuartier, setSelectedQuartier] = useState<Neighborhood | null>(null);
  const [showQuartierDropdown, setShowQuartierDropdown] = useState(false);

  // Options
  const [isExpress, setIsExpress] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "mobile_money">("cash");

  // Check login & auto-fill user data in background on load
  useEffect(() => {
    const loggedIn = sessionStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(loggedIn);

    if (loggedIn) {
      const storedName = sessionStorage.getItem("userName") || "";
      const storedPhone = sessionStorage.getItem("userPhone") || "";

      if (storedName) setFullName(storedName);
      if (storedPhone) setPhone(storedPhone);
    }
  }, []);

  // Filter neighborhoods based on search query
  const filteredNeighborhoods = useMemo(() => {
    if (!searchQuartier.trim()) {
      return neighborhoods;
    }
    const query = searchQuartier.toLowerCase();
    return neighborhoods.filter(n => n.name.toLowerCase().includes(query));
  }, [searchQuartier]);

  // Calculate delivery fee
  const deliveryFee = useMemo(() => {
    if (!selectedQuartier) return 0;
    return selectedQuartier.fee * (isExpress ? 2 : 1);
  }, [selectedQuartier, isExpress]);

  const totalAr = subtotalAr + deliveryFee;

  // Form validation for submit button activation
  const isFormValid = useMemo(() => {
    return (
      ville.trim() !== "" &&
      deliveryLocation.trim() !== "" &&
      timeSlot !== "" &&
      selectedQuartier !== null
    );
  }, [ville, deliveryLocation, timeSlot, selectedQuartier]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isFormValid || !selectedQuartier) return;

    const userId = sessionStorage.getItem("userId");

    // Use background loaded fullName & phone, or fallback to sessionStorage
    const finalFullName = fullName || sessionStorage.getItem("userName") || "Client";
    const finalPhone = phone || sessionStorage.getItem("userPhone") || "";

    // Build address description
    const addressDetails = `${deliveryLocation}, ${selectedQuartier.name}, ${ville} (${
      selectedQuartier.zone === 6 ? "Province" : `Zone ${selectedQuartier.zone}`
    }) ${isExpress ? "[LIVRAISON EXPRESS]" : ""}`;

    // Create reservation in DB (Supabase + localStorage fallback)
    await createOrderReservation({
      userId,
      items: cartItems,
      fullName: finalFullName,
      phone: finalPhone,
      ville,
      quartier: selectedQuartier,
      deliveryLocation,
      timeSlot,
      isExpress,
      paymentMethod,
      subtotal: subtotalAr,
      deliveryFee,
      total: totalAr
    });

    const orderDetails = {
      name: finalFullName,
      email: sessionStorage.getItem("userEmail") || "client@ladygasy.com",
      phone: finalPhone,
      address: addressDetails,
      total: totalAr,
      paymentMethod,
    };

    // Store in session storage to display on success page
    sessionStorage.setItem("lastOrder", JSON.stringify(orderDetails));
    clearCart();
    router.push("/checkout/success");
  };

  // 1. Loading State
  if (isLoggedIn === null) {
    return (
      <div className="bg-surface text-on-surface min-h-screen flex items-center justify-center font-body-md">
        <p className="animate-pulse text-primary font-medium text-lg">Chargement...</p>
      </div>
    );
  }

  // 2. Authentication Guard Screen
  if (!isLoggedIn) {
    return (
      <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col pt-[88px]">
        <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant shadow-sm py-md px-lg flex justify-center items-center">
          <Link href="/" className="font-display-lg text-display-lg text-primary italic hover:text-secondary transition-colors">
            Lady Gasy
          </Link>
        </header>

        <main className="flex-grow w-full max-w-[600px] mx-auto px-lg py-xl flex flex-col items-center justify-center text-center">
          <div className="bg-surface-container-lowest border border-outline-variant rounded-2xl p-lg shadow-md w-full relative overflow-hidden">
            <LogIn className="text-primary mb-sm mx-auto animate-bounce" size={48} />
            <h1 className="font-display-lg text-headline-lg text-primary mb-sm">
              Connexion Requise
            </h1>
            <p className="font-body-md text-on-surface-variant mb-lg leading-relaxed">
              Pour finaliser votre réservation et organiser la livraison de vos soins capillaires, veuillez vous connecter ou créer un compte.
            </p>

            <div className="space-y-sm">
              <Link
                href="/connexion"
                className="w-full bg-primary hover:bg-surface-tint text-on-primary py-md rounded-md font-label-md text-label-md transition-all duration-300 flex items-center justify-center gap-sm cursor-pointer shadow-sm hover:shadow-md"
              >
                Se connecter ou s&apos;inscrire
                <ArrowRight size={18} />
              </Link>
              <Link
                href="/panier"
                className="w-full text-primary hover:text-secondary font-label-md py-sm block transition-all"
              >
                Retourner au panier
              </Link>
            </div>
          </div>
        </main>
      </div>
    );
  }

  // 3. Checkout Form Screen
  return (
    <div className="bg-surface text-on-surface font-body-md antialiased min-h-screen flex flex-col pt-[88px] relative">
      {/* Background click listener to close Combobox */}
      {showQuartierDropdown && (
        <div
          className="fixed inset-0 z-0 cursor-default"
          onClick={() => setShowQuartierDropdown(false)}
        />
      )}

      {/* Simplified checkout header */}
      <header className="fixed top-0 w-full z-50 bg-surface border-b border-outline-variant shadow-sm py-md px-lg flex justify-center items-center">
        <Link href="/" className="font-display-lg text-display-lg text-primary italic hover:text-secondary transition-colors">
          Lady Gasy
        </Link>
      </header>

      <main className="flex-grow w-full max-w-[1280px] mx-auto px-lg py-xl relative z-10">
        <h1 className="font-headline-lg text-headline-lg text-primary mb-xl text-center">
          Validation de Commande
        </h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-xl mx-auto bg-surface-container rounded-xl border border-outline-variant flex flex-col items-center">
            <ShoppingBag className="text-primary mb-sm" size={36} />
            <p className="font-body-lg text-on-surface mb-md">Votre panier est vide.</p>
            <Link href="/catalogue" className="bg-primary text-on-primary font-label-md px-lg py-sm rounded hover:bg-surface-tint transition-all">
              Retourner au catalogue
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-xl">
            {/* Main Form Fields */}
            <div className="lg:col-span-7 space-y-xl">
              {/* Section 2: Delivery Area Selector */}
              <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm space-y-md relative z-20">
                <h2 className="font-headline-md text-headline-md text-primary mb-md flex items-center gap-sm">
                  1. Informations de livraison
                </h2>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="ville">
                    Ville *
                  </label>
                  <input
                    id="ville"
                    type="text"
                    placeholder="Saisissez votre ville (ex: Antananarivo, Majunga...)"
                    value={ville}
                    onChange={(e) => setVille(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-md px-sm py-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-on-surface"
                    required
                  />
                </div>

                <div className="relative">
                  
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="quartier">
                    Rechercher votre quartier *
                  </label>
                  <input
                    id="quartier"
                    type="text"
                    placeholder="Saisissez votre quartier (ex: Belair, Ambatobe, Alasora...)"
                    value={searchQuartier}
                    onChange={(e) => {
                      setSearchQuartier(e.target.value);
                      setShowQuartierDropdown(true);
                      setSelectedQuartier(null);
                    }}
                    onFocus={() => setShowQuartierDropdown(true)}
                    className="w-full bg-surface border border-outline-variant rounded-md px-sm py-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-on-surface"
                    autoComplete="off"
                  />
                  
                  {/* Combobox Dropdown Results */}
                  {showQuartierDropdown && (
                    <div className="absolute z-30 w-full mt-1 bg-surface-container-lowest border border-outline-variant rounded-md shadow-lg max-h-60 overflow-y-auto">
                      {filteredNeighborhoods.length > 0 ? (
                        filteredNeighborhoods.map((n, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setSelectedQuartier(n);
                              setSearchQuartier(n.name);
                              setShowQuartierDropdown(false);
                            }}
                            className="w-full text-left px-sm py-sm hover:bg-surface-variant/30 text-on-surface transition-colors cursor-pointer text-sm flex justify-between items-center border-b border-surface-variant/10"
                          >
                            <span className="font-medium">{n.name}</span>
                            <span className="text-xs text-on-surface-variant bg-surface-variant/20 px-xs py-0.5 rounded">
                              {n.zone === 6 ? "Province" : `Zone ${n.zone} (${n.fee.toLocaleString()} Ar)`}
                            </span>
                          </button>
                        ))
                      ) : (
                        <div className="px-sm py-sm text-sm text-on-surface-variant italic">
                          Aucun quartier trouvé.
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="deliveryLocation">
                    Lieu de livraison avec repère *
                  </label>
                  <textarea
                    id="deliveryLocation"
                    rows={3}
                    placeholder="Indiquez des repères exacts (ex: en face de la pharmacie, portail rouge...)"
                    value={deliveryLocation}
                    onChange={(e) => setDeliveryLocation(e.target.value)}
                    className="w-full bg-surface border border-outline-variant rounded-md px-sm py-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-on-surface resize-none"
                    required
                  />
                </div>

                <div>
                    <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="timeSlot">
                      Fourchette d&apos;horaire (2h minimum) *
                    </label>
                    <select
                      id="timeSlot"
                      value={timeSlot}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="w-full bg-surface border border-outline-variant rounded-md px-sm py-sm focus:ring-1 focus:ring-primary focus:border-primary transition-colors text-on-surface"
                      required
                    >
                      <option value="">Sélectionnez un créneau</option>
                      <option value="08:00 - 10:00">08h00 - 10h00</option>
                      <option value="10:00 - 12:00">10h00 - 12h00</option>
                      <option value="12:00 - 14:00">12h00 - 14h00</option>
                      <option value="14:00 - 16:00">14h00 - 16h00</option>
                      <option value="16:00 - 18:00">16h00 - 18h00</option>
                    </select>
                  </div>

                {/* Province disclaimer */}
                {selectedQuartier?.zone === 6 && (
                  <div className="bg-[#fff8f5] border border-secondary/20 p-md rounded-md">
                    <p className="text-sm text-secondary font-medium leading-relaxed">
                      ⚠️ Frais de retrait et de déplacement à votre charge. Expédition après réception du paiement.
                    </p>
                  </div>
                )}

                {/* Express delivery option */}
                {selectedQuartier && selectedQuartier.zone !== 6 && (
                  <div className="bg-surface-container p-md rounded-md border border-outline-variant/60 flex items-center justify-between mt-md">
                    <div>
                      <p className="font-label-md text-label-md text-on-surface font-semibold">Livraison Express (Heure fixe)</p>
                      <p className="font-caption text-caption text-on-surface-variant mt-xs">
                        Les frais de livraison de la zone sélectionnée seront doublés.
                      </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={isExpress}
                        onChange={(e) => setIsExpress(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-surface-variant rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                    </label>
                  </div>
                )}
              </section>

              {/* Section 3: Payment Options */}
              <section className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm space-y-md">
                <h2 className="font-headline-md text-headline-md text-primary mb-md flex items-center gap-sm">
                  2. Mode de paiement
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-md">
                  <label
                    className={`border rounded-xl p-md flex flex-col justify-between cursor-pointer transition-all duration-300 ${
                      paymentMethod === "cash"
                        ? "border-primary bg-primary-container/10 shadow-sm"
                        : "border-outline-variant bg-surface hover:bg-surface-variant/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-sm">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">Paiement à la livraison</span>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={paymentMethod === "cash"}
                        onChange={() => setPaymentMethod("cash")}
                        className="text-primary focus:ring-primary h-4 w-4"
                      />
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant">
                      Réglez en espèces directement lors de la réception de votre commande.
                    </p>
                  </label>
                  
                  <label
                    className={`border rounded-xl p-md flex flex-col justify-between cursor-pointer transition-all duration-300 ${
                      paymentMethod === "mobile_money"
                        ? "border-primary bg-primary-container/10 shadow-sm"
                        : "border-outline-variant bg-surface hover:bg-surface-variant/10"
                    }`}
                  >
                    <div className="flex items-center justify-between mb-sm">
                      <span className="font-label-md text-label-md text-on-surface font-semibold">Mobile Money</span>
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="mobile_money"
                        checked={paymentMethod === "mobile_money"}
                        onChange={() => setPaymentMethod("mobile_money")}
                        className="text-primary focus:ring-primary h-4 w-4"
                      />
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant">
                      Réglez par MVola, Orange Money ou Airtel Money. Expédition après réception.
                    </p>
                  </label>
                </div>
              </section>
            </div>

            {/* Sidebar Order Review */}
            <div className="lg:col-span-5 relative z-10">
              <div className="bg-surface-container-lowest border border-outline-variant rounded-xl p-lg shadow-sm sticky top-[120px]">
                <h3 className="font-headline-md text-headline-md text-primary mb-lg border-b border-outline-variant pb-sm">
                  Résumé de la commande
                </h3>

                {/* Items list */}
                <div className="space-y-md mb-lg max-h-[300px] overflow-y-auto pr-xs">
                  {cartItems.map((item) => (
                    <div key={item.product.id} className="flex gap-md border-b border-surface-variant/30 pb-xs">
                      <div className="w-20 h-20 bg-surface-variant rounded-sm flex-shrink-0 overflow-hidden flex items-center justify-center p-xs">
                        <img className="w-full h-full object-contain" src={item.product.image} alt={item.product.name} />
                      </div>
                      <div className="flex-grow flex flex-col justify-between">
                        <div>
                          <h4 className="font-label-md text-label-md text-on-surface line-clamp-1">
                            {item.product.name}
                          </h4>
                          <p className="font-caption text-caption text-on-surface-variant">
                            {item.product.description}
                          </p>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="font-caption text-caption text-on-surface-variant">
                            Qté: {item.quantity}
                          </span>
                          <span className="font-label-md text-label-md text-on-surface">
                            {(item.product.priceAr * item.quantity).toLocaleString()} Ar
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="border-t border-outline-variant pt-md space-y-sm mb-lg">
                  <div className="flex justify-between text-on-surface-variant">
                    <span>Sous-total</span>
                    <span className="font-medium text-on-surface">{subtotalAr.toLocaleString()} Ar</span>
                  </div>
                  <div className="flex justify-between text-on-surface-variant">
                    <span>
                      Livraison
                      {isExpress ? " (Express)" : ""}
                    </span>
                    <span className="font-medium text-on-surface">
                      {selectedQuartier
                        ? selectedQuartier.zone === 6
                          ? "Gratuit / Retrait"
                          : `${deliveryFee.toLocaleString()} Ar`
                        : "Sélectionnez votre quartier"}
                    </span>
                  </div>
                </div>

                <div className="border-t border-primary pt-md mb-lg">
                  <div className="flex justify-between items-center">
                    <span className="font-headline-md text-headline-md text-primary font-bold">Total</span>
                    <span className="font-headline-md text-headline-md text-primary font-bold">
                      {totalAr.toLocaleString()} Ar
                    </span>
                  </div>
                  <p className="font-caption text-caption text-on-surface-variant text-right mt-xs">TVA incluse</p>
                </div>

                <button
                  type="submit"
                  disabled={!isFormValid}
                  className={`w-full py-md px-lg rounded-md font-label-md text-label-md transition-all duration-300 flex items-center justify-center gap-sm shadow-sm hover:shadow-md ${
                    isFormValid
                      ? "bg-primary text-on-primary hover:bg-surface-tint cursor-pointer"
                      : "bg-surface-variant text-on-surface-variant/40 cursor-not-allowed"
                  }`}
                >
                  Valider la commande
                  <ArrowRight size={18} />
                </button>

                {!isFormValid && (
                  <p className="font-caption text-xs text-secondary text-center mt-xs font-medium">
                    ⚠️ Veuillez remplir tous les champs obligatoires (*) :
                    {!ville.trim() && " Ville,"}
                    {!selectedQuartier && " Quartier de livraison,"}
                    {!deliveryLocation.trim() && " Repère de livraison,"}
                    {!timeSlot && " Créneau horaire."}
                  </p>
                )}

                <p className="font-caption text-caption text-on-surface-variant text-center mt-md flex items-center justify-center gap-xs">
                  <Lock size={14} />
                  Vos données personnelles sont sécurisées.
                </p>
              </div>
            </div>
          </form>
        )}
      </main>

      {/* Simplified footer */}
      <footer className="w-full mt-xl bg-tertiary-fixed border-t border-outline-variant py-xl">
        <div className="max-w-[1280px] mx-auto px-lg flex flex-col md:flex-row justify-between items-center gap-md">
          <span className="font-headline-md text-headline-md text-primary block">Lady Gasy</span>
          <p className="font-caption text-caption text-on-tertiary-fixed-variant text-center md:text-left">
            © {new Date().getFullYear()} Lady Gasy. Tous droits réservés. Expertise botanique pour cheveux naturels.
          </p>
          <div className="flex gap-md flex-wrap justify-center">
            <a className="font-body-md text-body-md text-on-tertiary-fixed-variant hover:text-primary transition-colors text-sm" href="#">
              Mentions Légales
            </a>
            <a className="font-body-md text-body-md text-on-tertiary-fixed-variant hover:text-primary transition-colors text-sm" href="#">
              CGV
            </a>
            <a className="font-body-md text-body-md text-on-tertiary-fixed-variant hover:text-primary transition-colors text-sm" href="#">
              Politique de Confidentialité
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
