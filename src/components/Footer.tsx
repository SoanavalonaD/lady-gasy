import React from "react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="w-full mt-xl bg-tertiary-fixed border-t border-outline-variant">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-lg px-lg py-xl max-w-[1280px] mx-auto w-full">
        {/* Brand Info */}
        <div className="flex flex-col space-y-sm">
          <h2 className="font-headline-md text-headline-md text-primary mb-2">Lady Gasy</h2>
          <p className="font-body-md text-body-md text-on-tertiary-fixed">
            Expertise botanique pour cheveux naturels.
          </p>
          <p className="font-caption text-caption text-on-tertiary-fixed-variant mt-auto pt-sm">
            © {new Date().getFullYear()} Lady Gasy. Tous droits réservés.
          </p>
        </div>

        {/* Links Column 1 */}
        <div className="flex flex-col space-y-sm">
          <h3 className="font-label-md text-label-md text-primary uppercase tracking-wider mb-2">
            Informations
          </h3>
          <Link
            href="#"
            className="font-body-md text-body-md text-on-tertiary-fixed-variant hover:text-primary transition-colors"
          >
            Mentions Légales
          </Link>
          <Link
            href="#"
            className="font-body-md text-body-md text-on-tertiary-fixed-variant hover:text-primary transition-colors"
          >
            CGV
          </Link>
          <Link
            href="#"
            className="font-body-md text-body-md text-on-tertiary-fixed-variant hover:text-primary transition-colors"
          >
            Politique de Confidentialité
          </Link>
        </div>

        {/* Links Column 2 */}
        <div className="flex flex-col space-y-sm">
          <h3 className="font-label-md text-label-md text-primary uppercase tracking-wider mb-2">
            Aide
          </h3>
          <Link
            href="#"
            className="font-body-md text-body-md text-on-tertiary-fixed-variant hover:text-primary transition-colors"
          >
            Contactez-nous
          </Link>
          <Link
            href="#"
            className="font-body-md text-body-md text-on-tertiary-fixed-variant hover:text-primary transition-colors"
          >
            FAQ
          </Link>
          <Link
            href="#"
            className="font-body-md text-body-md text-on-tertiary-fixed-variant hover:text-primary transition-colors"
          >
            Livraison & Retours
          </Link>
        </div>

        {/* Brand Core Philosophy */}
        <div className="flex flex-col space-y-sm">
          <h3 className="font-label-md text-label-md text-primary uppercase tracking-wider mb-2">
            Notre Mission
          </h3>
          <p className="font-body-md text-body-md text-on-tertiary-fixed-variant">
            Sublimer votre couronne naturelle grâce à des soins formulés à base de plantes et d&apos;ingrédients bio issus de la biodiversité malgache.
          </p>
        </div>
      </div>
    </footer>
  );
}
