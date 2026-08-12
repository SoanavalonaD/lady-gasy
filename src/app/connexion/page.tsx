"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, LogIn, UserPlus, CheckCircle2, ChevronLeft, ChevronRight } from "lucide-react";

export default function ConnexionPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const slideImages = [
    { url: "/background-image.jpg", size: "bg-cover", position: "bg-center" },
    { url: "/banees1.jpg", size: "bg-contain bg-no-repeat", position: "bg-center" },
    { url: "/banneer.jpg", size: "bg-contain bg-no-repeat", position: "bg-center" },
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
    }, 5000); // Cycles every 5 seconds
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

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("isLoggedIn", "true");
    setToastMessage("Connexion réussie ! Bienvenue sur Lady Gasy.");
    setLoginEmail("");
    setLoginPassword("");
    setTimeout(() => setToastMessage(null), 3000);
    setTimeout(() => {
      router.push("/checkout");
    }, 1500);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sessionStorage.setItem("isLoggedIn", "true");
    setToastMessage("Inscription réussie ! Votre compte a été créé.");
    setSignupNom("");
    setSignupPrenom("");
    setSignupEmail("");
    setSignupTelephone("");
    setSignupPassword("");
    setTimeout(() => setToastMessage(null), 3000);
    setTimeout(() => {
      router.push("/checkout");
    }, 1500);
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

        {/* Right Side: Authentication Canvas */}
        <div className="w-full lg:w-1/2 flex items-center justify-center p-container-padding lg:p-xl relative">
          {/* Floating Back Button */}
          <Link
            href="/"
            className="absolute top-md left-md lg:left-xl flex items-center gap-xs text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <ArrowLeft size={20} />
            <span className="font-label-md text-label-md">Retour</span>
          </Link>

          <div className="w-full max-w-[420px] bg-surface-container-lowest p-lg rounded-xl shadow-[0_8px_30px_rgba(51,69,13,0.04)] border border-outline-variant/30">
            {/* Brand Anchor */}
            <div className="flex flex-col items-center mb-lg">
              <img
                src="/logo2.png"
                alt="Lady Gasy"
                className="h-50 w-auto object-contain mb-base"
              />
              <p className="font-body-md text-body-md text-on-surface-variant">
                Expertise botanique pour cheveux naturels
              </p>
            </div>

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

            {/* Login Form */}
            {activeTab === "login" && (
              <form onSubmit={handleLoginSubmit} className="space-y-md animate-fade-in">
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
                  className="w-full bg-primary text-on-primary font-label-md text-label-md py-sm rounded-DEFAULT hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-xs mt-lg cursor-pointer"
                  type="submit"
                >
                  Se connecter
                  <LogIn size={18} />
                </button>
              </form>
            )}

            {/* Sign Up Form */}
            {activeTab === "signup" && (
              <form onSubmit={handleSignupSubmit} className="space-y-md animate-fade-in">
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
                  className="w-full bg-primary text-on-primary font-label-md text-label-md py-sm rounded-DEFAULT hover:bg-on-primary-fixed-variant transition-colors flex items-center justify-center gap-xs mt-md cursor-pointer"
                  type="submit"
                >
                  Créer mon compte
                  <UserPlus size={18} />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
