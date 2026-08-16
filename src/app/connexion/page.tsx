"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  LogIn,
  UserPlus,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Package,
  User
} from "lucide-react";
import { supabase } from "@/data/supabase";
import { signInUser, signUpUser, getOrderHistory } from "@/data/queries";
import { ArrowRight } from "lucide-react";

export default function ConnexionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [emailConfirmationPending, setEmailConfirmationPending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [userProfile, setUserProfile] = useState({ name: "", email: "", phone: "" });
  const [orders, setOrders] = useState<any[]>([]);
  const [loadingOrders, setLoadingOrders] = useState(false);

  // Slideshow config
  const slideImages = [
    { url: "/background-image.jpg", size: "bg-cover", position: "bg-center" },
    { url: "/banees1.jpg", size: "bg-cover bg-contain bg-no-repeat", position: "bg-center" },
    { url: "/banneer.jpg", size: "bg-cover bg-contain bg-no-repeat", position: "bg-center" }
  ];
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slideImages.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slideImages.length) % slideImages.length);
  };

  // Autoplay slideshow
  useEffect(() => {
    const timer = setInterval(() => {
      nextSlide();
    }, 5000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  // Form states
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [signupNom, setSignupNom] = useState("");
  const [signupPrenom, setSignupPrenom] = useState("");
  const [signupEmail, setSignupEmail] = useState("");
  const [signupTelephone, setSignupTelephone] = useState("");
  const [signupPassword, setSignupPassword] = useState("");

  // Sync login status and load order history
  const checkLoginStatus = () => {
    const logged = sessionStorage.getItem("isLoggedIn") === "true";
    setIsLoggedIn(logged);
    
    if (logged) {
      const name = sessionStorage.getItem("userName") || "";
      const email = sessionStorage.getItem("userEmail") || "";
      const phone = sessionStorage.getItem("userPhone") || "";
      setUserProfile({ name, email, phone });

      // Fetch order history from Supabase/Local fallback
      setLoadingOrders(true);
      const userId = sessionStorage.getItem("userId");
      getOrderHistory(userId)
        .then((data) => setOrders(data))
        .catch((err) => console.error("Error loading order history:", err))
        .finally(() => setLoadingOrders(false));
    }
  };

  useEffect(() => {
    checkLoginStatus();
  }, []);

  // Form Submit Handlers
  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage("Connexion en cours...");
    
    const result = await signInUser(loginEmail, loginPassword);
    
    if (result.success) {
      setToastMessage("Connexion réussie ! Bienvenue sur Lady Gasy.");
      setLoginEmail("");
      setLoginPassword("");
      setTimeout(() => {
        setToastMessage(null);
        checkLoginStatus();
        router.push("/");
      }, 1500);
    } else {
      // Detect unconfirmed email
      const isInvalidCreds = result.error?.toLowerCase().includes("invalid login credentials");
      const friendlyError = isInvalidCreds
        ? "Email ou mot de passe incorrect. Si vous venez de créer votre compte, vérifiez d'abord votre boite mail pour confirmer votre inscription."
        : result.error;
      setToastMessage(`Échec : ${friendlyError}`);
      setTimeout(() => setToastMessage(null), 6000);
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage("Création de votre compte...");
    
    const result = await signUpUser(
      signupNom,
      signupPrenom,
      signupEmail,
      signupTelephone,
      signupPassword
    );
    
    if (result.success && result.emailConfirmationPending) {
      // Show email confirmation pending screen
      setPendingEmail(signupEmail);
      setEmailConfirmationPending(true);
      setSignupNom("");
      setSignupPrenom("");
      setSignupEmail("");
      setSignupTelephone("");
      setSignupPassword("");
      setToastMessage(null);
    } else if (result.success) {
      setToastMessage("Compte créé avec succès !");
      setTimeout(() => {
        setToastMessage(null);
        checkLoginStatus();
        router.push("/checkout");
      }, 1500);
    } else {
      setToastMessage(`Échec : ${result.error}`);
      setTimeout(() => setToastMessage(null), 4000);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    sessionStorage.removeItem("isLoggedIn");
    sessionStorage.removeItem("userId");
    sessionStorage.removeItem("userName");
    sessionStorage.removeItem("userEmail");
    sessionStorage.removeItem("userPhone");
    
    setIsLoggedIn(false);
    setUserProfile({ name: "", email: "", phone: "" });
    setOrders([]);
    setToastMessage("Déconnexion réussie.");
    setTimeout(() => setToastMessage(null), 2000);
  };

  return (
    <div className="bg-background min-h-screen text-on-background flex font-body-md antialiased w-full relative">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-lg right-lg z-50 bg-primary text-on-primary font-label-md px-lg py-md rounded-xl shadow-lg transition-all duration-300 flex items-center gap-sm animate-bounce">
          <CheckCircle2 size={24} />
          {toastMessage}
        </div>
      )}

      {/* Email Confirmation Pending Screen */}
      {emailConfirmationPending && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          {/* Background image */}
          <div
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: "url('/background-image.jpg')" }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-surface/90 via-surface/70 to-transparent" />

          {/* Content card */}
          <div>
            <div className="glass-panel p-lg rounded-xl shadow-md text-center space-y-md">

              {/* Mail icon */}
              <div className="mx-auto w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="text-primary" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="16" x="2" y="4" rx="2"/>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                </svg>
              </div>

              <div className="space-y-xs">
                <h1 className="font-headline-lg text-on-surface">Vérifiez votre boite mail</h1>
                <p className="font-body-md text-on-surface-variant">
                  Un email de confirmation a été envoyé à{" "}
                  <span className="text-primary font-semibold break-all">{pendingEmail}</span>.
                </p>
                <p className="font-body-sm text-on-surface-variant/80">
                  Cliquez sur le lien reçu pour activer votre compte et accéder à Lady Gasy.
                </p>
              </div>

              <div className="bg-surface-container-low/60 border border-outline-variant/30 rounded-xl p-md text-left space-y-xs">
                <p className="font-label-md text-on-surface">Vous ne trouvez pas l'email ?</p>
                <ul className="font-body-sm text-on-surface-variant list-disc list-inside space-y-xs">
                  <li>Vérifiez votre dossier <strong>Spam</strong> ou <strong>Promotions</strong></li>
                  <li>L'email peut prendre quelques minutes</li>
                  <li>Vérifiez la bonne adresse email utilisée</li>
                </ul>
              </div>

              <button
                onClick={() => {
                  setEmailConfirmationPending(false);
                  setActiveTab("login");
                }}
                className="w-full py-3 rounded bg-primary text-on-primary font-label-md hover:bg-surface-tint transition-colors duration-300 shadow-sm"
              >
                Retour à la connexion
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Split Screen Layout */}
      <div className="flex w-full min-h-screen">
        {/* Left Side: Editorial Botanical Image Slider (Desktop Only) */}
        <div className="hidden lg:block lg:w-1/2 relative bg-surface-container-highest overflow-hidden group/slider">
          {slideImages.map((slide, idx) => (
            <div
              key={idx}
              className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${slide.size} ${slide.position} ${
                currentSlide === idx ? "opacity-100" : "opacity-0 pointer-events-none"
              }`}
              style={{
                backgroundImage: `url('${slide.url}')`,
              }}
            />
          ))}
          {/* Overlay to soften the image slightly */}
          <div className="absolute inset-0 bg-primary/10 pointer-events-none"></div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-md top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/80 hover:bg-surface text-primary flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover/slider:opacity-100 cursor-pointer focus:outline-none"
            aria-label="Image précédente"
          >
            <ChevronLeft size={24} />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-md top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-surface/80 hover:bg-surface text-primary flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 opacity-0 group-hover/slider:opacity-100 cursor-pointer focus:outline-none"
            aria-label="Image suivante"
          >
            <ChevronRight size={24} />
          </button>

          {/* Slide Indicator Dots */}
          <div className="absolute bottom-md left-1/2 -translate-x-1/2 flex gap-sm">
            {slideImages.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer focus:outline-none ${
                  currentSlide === idx ? "bg-primary scale-125" : "bg-surface/55 hover:bg-surface/80"
                }`}
                aria-label={`Aller à l'image ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Right Side: Authentication / Dashboard Canvas */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-container-padding lg:p-xl relative">
          {/* Floating Back Button */}
          <Link
            href="/"
            className="absolute top-md left-md lg:left-xl flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span className="font-label-md text-label-md">Retour</span>
          </Link>

          <div
            className={`w-full bg-surface-container-lowest p-lg rounded-xl shadow-[0_8px_30px_rgba(51,69,13,0.04)] border border-outline-variant/30 transition-all duration-300 ${
              isLoggedIn ? "max-w-[550px]" : "max-w-[420px]"
            }`}
          >
            {/* Logo */}
            <div className="flex flex-col items-center mb-lg">
              <img src="/logo2.png" alt="Lady Gasy" className="h-40 w-auto object-contain mb-base" />
              <p className="font-body-md text-body-md text-on-surface-variant text-center">
                Expertise botanique pour cheveux naturels
              </p>
            </div>

            {/* Render Dashboard if logged in */}
            {isLoggedIn ? (
              <div className="space-y-lg">
                {/* Profile Details Block */}
                <div className="border-b border-surface-variant pb-md">
                  <h2 className="font-headline-md text-primary font-semibold flex items-center gap-sm mb-md">
                    <User size={22} /> Mon Compte
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-sm text-sm">
                    <div>
                      <p className="text-on-surface-variant font-medium">Nom :</p>
                      <p className="text-on-surface font-semibold">{userProfile.name}</p>
                    </div>
                    <div>
                      <p className="text-on-surface-variant font-medium">Téléphone :</p>
                      <p className="text-on-surface font-semibold">{userProfile.phone || "Non renseigné"}</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-on-surface-variant font-medium">Email :</p>
                      <p className="text-on-surface font-semibold">{userProfile.email}</p>
                    </div>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="mt-md text-error hover:text-error/80 transition-colors flex items-center gap-xs font-label-md text-xs border border-error/25 hover:border-error px-sm py-1.5 rounded cursor-pointer focus:outline-none"
                  >
                    <LogOut size={14} /> Déconnexion
                  </button>
                </div>

                {/* Orders History List */}
                <div>
                  <h2 className="font-headline-md text-primary font-semibold flex items-center gap-sm mb-md">
                    <Package size={22} /> Mes Réservations
                  </h2>
                  <Link
                    href="/commandes"
                    className="w-full bg-primary hover:bg-surface-tint text-on-primary py-md rounded-md font-label-md text-label-md transition-all duration-300 flex items-center justify-center gap-sm cursor-pointer shadow-sm hover:shadow-md"
                  >
                    Consulter mes commandes
                    <ArrowRight className="ml-2" size={18} />
                  </Link>
                </div>
              </div>
            ) : (
              /* Render Auth forms if not logged in */
              <>
                {/* Tab Navigation */}
                <div className="flex border-b border-surface-variant mb-md relative">
                  <button
                    onClick={() => setActiveTab("login")}
                    className={`flex-1 pb-sm font-label-md text-label-md transition-all duration-300 focus:outline-none cursor-pointer border-b-[2px] ${
                      activeTab === "login"
                        ? "text-primary border-primary"
                        : "text-on-surface-variant hover:text-primary border-transparent"
                    }`}
                  >
                    Connexion
                  </button>
                  <button
                    onClick={() => setActiveTab("signup")}
                    className={`flex-1 pb-sm font-label-md text-label-md transition-all duration-300 focus:outline-none cursor-pointer border-b-[2px] ${
                      activeTab === "signup"
                        ? "text-primary border-primary"
                        : "text-on-surface-variant hover:text-primary border-transparent"
                    }`}
                  >
                    Inscription
                  </button>
                </div>

                {/* DEV PREVIEW — remove before production */}
                {/* {process.env.NODE_ENV === "development" && (
                  <button
                    type="button"
                    onClick={() => { setPendingEmail("preview@ladygasy.mg"); setEmailConfirmationPending(true); }}
                    className="w-full mb-sm text-xs text-on-surface-variant/50 underline hover:text-primary transition-colors"
                  >
                    [DEV] Prévisualiser l'écran de confirmation email
                  </button>
                )} */}

                {/* Login Form */}
                {activeTab === "login" && (
                  <form onSubmit={handleLoginSubmit} className="space-y-md">
                    <div className="space-y-base">
                      <label className="font-label-md text-label-md text-on-surface block" htmlFor="login-email">
                        Email
                      </label>
                      <input
                        className="w-full bg-surface-container border-0 rounded-DEFAULT p-sm font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary focus:outline-none transition-shadow"
                        id="login-email"
                        type="email"
                        placeholder="votre@email.com"
                        value={loginEmail}
                        onChange={(e) => setLoginEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-base">
                      <div className="flex justify-between items-center">
                        <label className="font-label-md text-label-md text-on-surface" htmlFor="login-password">
                          Mot de passe
                        </label>
                        <a className="font-caption text-caption text-primary hover:underline" href="#">
                          Oublié ?
                        </a>
                      </div>
                      <input
                        className="w-full bg-surface-container border-0 rounded-DEFAULT p-sm font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary focus:outline-none transition-shadow"
                        id="login-password"
                        type="password"
                        placeholder="••••••••"
                        value={loginPassword}
                        onChange={(e) => setLoginPassword(e.target.value)}
                        required
                      />
                    </div>
                    <button
                      className="w-full bg-primary text-on-primary font-label-md text-label-md py-sm rounded-DEFAULT hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-xs mt-lg cursor-pointer focus:outline-none"
                      type="submit"
                    >
                      Se connecter
                      <LogIn size={18} />
                    </button>
                  </form>
                )}

                {/* Sign Up Form */}
                {activeTab === "signup" && (
                  <form onSubmit={handleSignupSubmit} className="space-y-md">
                    <div className="grid grid-cols-2 gap-md">
                      <div className="space-y-base">
                        <label className="font-label-md text-label-md text-on-surface block" htmlFor="signup-nom">
                          Nom
                        </label>
                        <input
                          className="w-full bg-surface-container border-0 rounded-DEFAULT p-sm font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary focus:outline-none transition-shadow"
                          id="signup-nom"
                          type="text"
                          placeholder="Doe"
                          value={signupNom}
                          onChange={(e) => setSignupNom(e.target.value)}
                          required
                        />
                      </div>
                      <div className="space-y-base">
                        <label className="font-label-md text-label-md text-on-surface block" htmlFor="signup-prenom">
                          Prénom
                        </label>
                        <input
                          className="w-full bg-surface-container border-0 rounded-DEFAULT p-sm font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary focus:outline-none transition-shadow"
                          id="signup-prenom"
                          type="text"
                          placeholder="Jane"
                          value={signupPrenom}
                          onChange={(e) => setSignupPrenom(e.target.value)}
                          required
                        />
                      </div>
                    </div>
                    <div className="space-y-base">
                      <label className="font-label-md text-label-md text-on-surface block" htmlFor="signup-email">
                        Email
                      </label>
                      <input
                        className="w-full bg-surface-container border-0 rounded-DEFAULT p-sm font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary focus:outline-none transition-shadow"
                        id="signup-email"
                        type="email"
                        placeholder="jane.doe@email.com"
                        value={signupEmail}
                        onChange={(e) => setSignupEmail(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-base">
                      <label className="font-label-md text-label-md text-on-surface block" htmlFor="signup-telephone">
                        Téléphone
                      </label>
                      <input
                        className="w-full bg-surface-container border-0 rounded-DEFAULT p-sm font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary focus:outline-none transition-shadow"
                        id="signup-telephone"
                        type="tel"
                        placeholder="+261 34 00 000 00"
                        value={signupTelephone}
                        onChange={(e) => setSignupTelephone(e.target.value)}
                        required
                      />
                    </div>
                    <div className="space-y-base">
                      <label className="font-label-md text-label-md text-on-surface block" htmlFor="signup-password">
                        Mot de passe
                      </label>
                      <input
                        className="w-full bg-surface-container border-0 rounded-DEFAULT p-sm font-body-md text-body-md text-on-surface placeholder:text-on-surface-variant/50 focus:ring-1 focus:ring-primary focus:outline-none transition-shadow"
                        id="signup-password"
                        type="password"
                        placeholder="Créez un mot de passe"
                        value={signupPassword}
                        onChange={(e) => setSignupPassword(e.target.value)}
                        required
                      />
                    </div>
                    <p className="font-caption text-caption text-on-surface-variant leading-relaxed pt-xs">
                      En créant un compte, vous acceptez nos{" "}
                      <a className="text-primary underline" href="#">
                        Conditions Générales
                      </a>{" "}
                      et notre{" "}
                      <a className="text-primary underline" href="#">
                        Politique de Confidentialité
                      </a>
                      .
                    </p>
                    <button
                      className="w-full bg-primary text-on-primary font-label-md text-label-md py-sm rounded-DEFAULT hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-xs mt-md cursor-pointer focus:outline-none"
                      type="submit"
                    >
                      Créer mon compte
                      <UserPlus size={18} />
                    </button>
                  </form>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
