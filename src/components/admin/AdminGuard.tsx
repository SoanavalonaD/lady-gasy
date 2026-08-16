"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/data/supabase";
import { ShieldAlert, Loader2 } from "lucide-react";

export default function AdminGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    async function checkAdminAccess() {
      try {
        // 1. Get authenticated user from Supabase Auth
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError || !user) {
          console.warn("Unauthorized access to Admin: No authenticated session found.");
          router.push("/connexion");
          return;
        }

        // 2. Fetch role from 'utilisateurs' table in Supabase
        const { data: userData, error: userError } = await supabase
          .from("utilisateurs")
          .select("role")
          .eq("id", user.id)
          .maybeSingle();

        if (userError || !userData || userData.role !== "ADMIN") {
          console.warn("Forbidden access to Admin: User is not ADMIN.");
          setErrorMessage(
            "Accès refusé. Seuls les comptes administrateurs autorisés peuvent accéder à cet espace."
          );
          setTimeout(() => {
            router.push("/");
          }, 2500);
          return;
        }

        // Access Granted!
        setAuthorized(true);
      } catch (err: any) {
        console.error("Admin guard verification error:", err);
        router.push("/connexion");
      } finally {
        setLoading(false);
      }
    }

    checkAdminAccess();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center space-y-md p-lg">
        <Loader2 size={36} className="text-primary animate-spin" />
        <p className="font-label-md text-sm text-on-surface-variant animate-pulse">
          Vérification des autorisations d&apos;accès administrateur...
        </p>
      </div>
    );
  }

  if (errorMessage) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center p-lg text-center">
        <div className="bg-surface-container-lowest border border-error/30 rounded-2xl p-xl max-w-md shadow-xl space-y-md">
          <div className="w-12 h-12 bg-error/10 text-error rounded-full flex items-center justify-center mx-auto">
            <ShieldAlert size={28} />
          </div>
          <h2 className="font-headline-md text-lg font-bold text-on-surface">Accès Restreint</h2>
          <p className="font-body-md text-sm text-on-surface-variant">{errorMessage}</p>
          <p className="font-caption text-xs text-on-surface-variant/70 italic">
            Redirection vers l&apos;accueil en cours...
          </p>
        </div>
      </div>
    );
  }

  if (!authorized) {
    return null;
  }

  return <>{children}</>;
}
