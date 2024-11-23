"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { searchParams } = new URL(window.location.href);
        const code = searchParams.get("code");

        if (code) {
          await supabase.auth.exchangeCodeForSession(code);
          router.push("/");
        }
      } catch (error) {
        console.error("Error en callback de autenticación:", error);
        router.push("/login?error=auth");
      }
    };

    handleAuthCallback();
  }, [router]);

  return <div>Procesando autenticación...</div>;
}
