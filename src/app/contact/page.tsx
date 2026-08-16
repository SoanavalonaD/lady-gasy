"use client";

import React, { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { CheckCircle2, MapPin, Phone, Mail } from "lucide-react";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!name.trim()) newErrors.name = "Nom complet requis";
    if (!email.trim() || !email.includes("@")) newErrors.email = "Adresse email valide requise";
    if (!subject) newErrors.subject = "Sujet requis";
    if (!message.trim()) newErrors.message = "Message requis";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Simulate sending message
    setToastMessage("Votre message a bien été envoyé ! Notre équipe vous répondra sous 24h.");
    setName("");
    setEmail("");
    setSubject("");
    setMessage("");
    setErrors({});
    
    setTimeout(() => setToastMessage(null), 4000);
  };

  return (
    <>
      <Header />
      <main className="flex-grow flex flex-col pt-24 bg-background">
        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-lg right-lg z-50 bg-primary text-on-primary font-label-md px-lg py-md rounded-xl shadow-lg transition-all duration-300 flex items-center gap-sm animate-bounce">
            <CheckCircle2 size={24} />
            {toastMessage}
          </div>
        )}

        {/* Hero Section */}
        <section className="relative pt-xl pb-lg px-container-padding md:px-lg max-w-[1280px] mx-auto w-full text-center flex flex-col items-center justify-center">
          <h1 className="font-display-lg text-display-lg text-on-surface mb-sm">
            Contactez-nous
          </h1>
          <p className="font-body-lg text-body-lg text-on-surface-variant max-w-2xl mx-auto">
            Nous serions ravis d&apos;échanger avec vous. Que ce soit pour une question sur nos produits, un conseil capillaire ou pour prendre rendez-vous, notre équipe est à votre écoute.
          </p>
        </section>

        {/* Two-Column Grid: Contact Form & Info */}
        <section className="py-xl px-container-padding md:px-lg max-w-[1280px] mx-auto w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-xl">
            {/* Left Column: Contact Form */}
            <div className="bg-surface-container-low p-lg rounded-xl border border-surface-variant shadow-[0_4px_20px_-4px_rgba(74,93,35,0.05)]">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-md">
                Envoyez-nous un message
              </h2>
              <form onSubmit={handleSubmit} className="space-y-md">
                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="name">
                    Nom complet
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Votre nom"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={`w-full bg-surface-container border-none rounded focus:ring-1 focus:ring-primary focus:bg-surface transition-colors font-body-md text-body-md text-on-surface py-3 px-4 ${
                      errors.name ? "ring-1 ring-error" : ""
                    }`}
                  />
                  {errors.name && <span className="text-error text-xs mt-1 block">{errors.name}</span>}
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="email">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="votre.email@exemple.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-surface-container border-none rounded focus:ring-1 focus:ring-primary focus:bg-surface transition-colors font-body-md text-body-md text-on-surface py-3 px-4 ${
                      errors.email ? "ring-1 ring-error" : ""
                    }`}
                  />
                  {errors.email && <span className="text-error text-xs mt-1 block">{errors.email}</span>}
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="subject">
                    Sujet
                  </label>
                  <select
                    id="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className={`w-full bg-surface-container border-none rounded focus:ring-1 focus:ring-primary focus:bg-surface transition-colors font-body-md text-body-md text-on-surface py-3 px-4 ${
                      errors.subject ? "ring-1 ring-error" : ""
                    }`}
                  >
                    <option value="">Sélectionnez un sujet</option>
                    <option value="products">Information Produits</option>
                    <option value="appointment">Prise de Rendez-vous</option>
                    <option value="order">Suivi de Commande</option>
                    <option value="other">Autre demande</option>
                  </select>
                  {errors.subject && <span className="text-error text-xs mt-1 block">{errors.subject}</span>}
                </div>

                <div>
                  <label className="block font-label-md text-label-md text-on-surface-variant mb-xs" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Comment pouvons-nous vous aider ?"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className={`w-full bg-surface-container border-none rounded focus:ring-1 focus:ring-primary focus:bg-surface transition-colors font-body-md text-body-md text-on-surface py-3 px-4 resize-none ${
                      errors.message ? "ring-1 ring-error" : ""
                    }`}
                  />
                  {errors.message && <span className="text-error text-xs mt-1 block">{errors.message}</span>}
                </div>

                <button
                  type="submit"
                  className="w-full inline-flex justify-center items-center py-3 px-6 border border-transparent rounded bg-primary-container text-on-primary-container font-label-md text-label-md hover:bg-surface-tint hover:text-white transition-all duration-300 shadow-[0_4px_14px_0_rgba(74,93,35,0.15)] hover:shadow-[0_6px_20px_rgba(74,93,35,0.2)] cursor-pointer"
                >
                  Envoyer le message
                </button>
              </form>
            </div>

            {/* Right Column: Contact Information */}
            <div className="flex flex-col justify-center lg:pl-lg">
              <h2 className="font-headline-lg text-headline-lg text-on-surface mb-lg">
                Nos Coordonnées
              </h2>
              <div className="space-y-lg">
                {/* Address */}
                <div className="flex items-start group">
                  <div className="flex-shrink-0 mt-1 mr-sm text-secondary group-hover:text-primary transition-colors">
                    <MapPin size={24} />
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface mb-xs">
                      Le Salon Lady Gasy
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant leading-relaxed">
                      Quartier Isoraka<br />
                      101 Antananarivo<br />
                      Madagascar
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="flex items-start group">
                  <div className="flex-shrink-0 mt-1 mr-sm text-secondary group-hover:text-primary transition-colors">
                    <Phone size={24} />
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface mb-xs">
                      Téléphone
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      <a className="hover:text-primary transition-colors" href="tel:+261382451608">
                        +261 38 24 516 08
                      </a>
                    </p>
                    <p className="font-caption text-caption text-outline mt-1">
                      Lundi - Samedi : 9h00 - 18h00
                    </p>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-start group">
                  <div className="flex-shrink-0 mt-1 mr-sm text-secondary group-hover:text-primary transition-colors">
                    <Mail size={24} />
                  </div>
                  <div>
                    <h3 className="font-label-md text-label-md text-on-surface mb-xs">
                      Email
                    </h3>
                    <p className="font-body-md text-body-md text-on-surface-variant">
                      <a className="hover:text-primary transition-colors" href="mailto:ladygasy.contact@gmail.com">
                        ladygasy.contact@gmail.com
                      </a>
                    </p>
                  </div>
                </div>
              </div>

              {/* Socials */}
              <div className="mt-xl pt-lg border-t border-surface-variant">
                <h3 className="font-label-md text-label-md text-on-surface mb-sm">
                  Suivez-nous
                </h3>
                <div className="flex space-x-md">
                  <a
                    aria-label="Instagram"
                    className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-all duration-300"
                    href="https://www.instagram.com/ladyyy_lady_gasy/"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                    </svg>
                  </a>
                  <a
                    aria-label="Facebook"
                    className="w-10 h-10 rounded-full bg-surface-container flex items-center justify-center text-on-surface-variant hover:bg-primary-container hover:text-on-primary-container transition-all duration-300"
                    href="https://www.facebook.com/profile.php?id=100067951283297"
                  >
                    <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                      <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Map Section */}
        <section className="w-full h-96 relative border-t border-surface-variant overflow-hidden">
          <iframe
            src="https://maps.google.com/maps?q=Lady%20Gasy%20Salon,%204G3F%2B7GX,%20Antananarivo&t=&z=16&ie=UTF8&iwloc=&output=embed"
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
            loading="lazy"
            title="Carte de localisation Lady Gasy"
          ></iframe>
        </section>
      </main>
      <Footer />
    </>
  );
}
