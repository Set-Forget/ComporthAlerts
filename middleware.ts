


import { NextResponse, NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Crea un cliente de Supabase para el middleware.
  const supabase = createMiddlewareClient({ req: request, res: response });

  try {
    const { data: session } = await supabase.auth.getSession();

    // Si no hay sesión, redirige a la página de inicio ("/")
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Si hay sesión, obtén la información del usuario
    const { data: user, error } = await supabase
      .from("account")
      .select("role")
      .eq("email", session.session?.user.email)
      .single();

    if (error || !user || user.role === "pending") {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Si el usuario no tiene el rol "pending", permite el acceso a la ruta solicitada
    return response;
  } catch (error) {
    console.error('Error fetching user data:', error);
    return NextResponse.redirect(new URL("/", request.url));
  }
}

export const config = {
  matcher: ["/home/:path*"], // Ajusta según tus rutas privadas
};
