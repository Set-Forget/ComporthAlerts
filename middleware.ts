// middleware.ts

import { NextResponse, NextRequest } from "next/server";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(request: NextRequest) {
  try {
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
    const supabase = createMiddlewareClient({
      req: request,
      res: response,
    });

    // Obtenemos la sesión del usuario
    const { data: session } = await supabase.auth.getSession();

    // Si no hay sesión, redirigir a la página de inicio
    if (!session) {
      return NextResponse.redirect(new URL("/", request.url));
    }

    // Obtener datos del usuario si es necesario
    // const { data: user } = await supabase.from("account").select().single();

    // Guardar datos del usuario en sessionStorage si es necesario
    // window.sessionStorage.setItem('userEmail', user.email);

    return response;
  } catch (e) {
    // Manejar cualquier error aquí
    console.error(e);
    return NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
  }
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)"],
};
