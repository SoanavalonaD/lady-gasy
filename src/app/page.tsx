import type { Metadata } from "next";
import Home from "./home/page";

// Composant serveur : permet de déclarer l'URL canonique de la page d'accueil.
// Le composant Home reste un composant client.
export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

export default function Main() {

  return (
    <>
      <Home/>
    </>
  );
}
