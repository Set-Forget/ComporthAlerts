"use client"
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

export const useRequireAuth = () => {
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    const checkSession = async () => {
      // ... lógica para verificar la sesión ...
      const { data: session } = await supabase.auth.getSession();
      console.log(session);
      
      // Si no hay sesión, redirigir a la página de inicio
      if (session) {
        router.replace("/");
      }
    };

    checkSession();
  }, []);
};
