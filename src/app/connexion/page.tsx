"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, LogIn, UserPlus, CheckCircle2 } from "lucide-react";

export default function ConnexionPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [toastMessage, setToastMessage] = useState<string | null>(null);

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
    setToastMessage("Connexion réussie ! Bienvenue sur Lady Gasy.");
    setLoginEmail("");
    setLoginPassword("");
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleSignupSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setToastMessage("Inscription réussie ! Votre compte a été créé.");
    setSignupNom("");
    setSignupPrenom("");
    setSignupEmail("");
    setSignupTelephone("");
    setSignupPassword("");
    setTimeout(() => setToastMessage(null), 3000);
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
        {/* Left Side: Editorial Botanical Image (Desktop Only) */}
        <div className="hidden lg:block lg:w-1/2 relative bg-surface-container-highest">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCykC3AOeC06DpBuYBdlLh7F6dixnaYxQzbbSMzu-rxFE3nQoU_hYovGseCPPvYYgdbEy8aQGjbS4FO2k0MjHeSyjqNlJsy90fGYK58jnDdbWDYKeufU8loKOJA4g8UQ-tjGByECKs77FaMHQiaZPZueOxe-XASeJxSsoK7I_TZHaB4aGSgEW2puvf9fPtXz3GSqZW0iVmF6CgLEoEvbY2xR-4HDR-L5-BNjmOfQxbyD51kCbnt6ZtS')",
            }}
          />
          {/* Overlay to soften the image slightly */}
          <div className="absolute inset-0 bg-primary/10"></div>
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
            <div className="text-center mb-lg">
              <h1 className="font-display-lg text-display-lg text-primary italic mb-base">Lady Gasy</h1>
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
                    placeholder="+33 6 00 00 00 00"
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
