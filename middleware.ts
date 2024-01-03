// "use client"

// import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
// import { NextResponse } from 'next/server';
// import type { NextRequest } from 'next/server';

// export async function middleware(req: NextRequest) {
//   const res = NextResponse.next();
//   const supabase = createMiddlewareClient({ req, res });
  
//   // Obtener la sesión actual
//   const { data: session } = await supabase.auth.getSession();

//   if (session) {
//     // Si hay una sesión, obtener el rol del usuario
//     const { data: userAccount } = await supabase
//       .from('account') // Asegúrate de que 'account' es el nombre de tu tabla
//       .select('role')
//       .eq('email', session.session?.user.email)
//       .single();

//     if (userAccount?.role === 'pending') {
//       // Redirigir a usuarios con rol 'pending' a la página de inicio
//       return NextResponse.redirect(new URL("/", req.url));
//     } else {
//       // Redirigir a usuarios autenticados a la página de inicio de la aplicación
//       return NextResponse.redirect(new URL("/home", req.url));
//     }
//   }

//   console.log('No hay sesión');

//   // Si el usuario no está autenticado, redirigir a la página de inicio de sesión
//   return NextResponse.redirect(new URL("/", req.url));
// }

// export const config = {
//   matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
// };

// import { NextResponse, NextRequest } from "next/server";
// import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

// export async function middleware(request: NextRequest) {
//   try {
//     // This `try/catch` block is only here for the interactive tutorial.
//     // Feel free to remove once you have Supabase connected.
//     // const { supabase, response } = createClient(request);
//     // Refresh session if expired - required for Server Components
//     // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
//     // const { data } = await supabase.auth.getSession();
//     // const data = await supabase.auth.refreshSession();
//     const response = NextResponse.next({
//       request: {
//         headers: request.headers,
//       },
//     });
//     const supabase = createMiddlewareClient({
//       req: request,
//       res: response,
//     });
//     // const user = await supabase.auth.getUser();
//     const { data: session } = await supabase.auth.getSession();
//     const { data: user } = await supabase.from("account").select("role").eq("email", session.session?.user.email).single();
//     console.log(user);
    

//     if (session && user ) {
//       return NextResponse.redirect(new URL("/home", request.url));
//     }

//     if (!session || !user || user.role === "pending") {
//       console.log("No hay sesión");
      
//       return NextResponse.redirect(new URL("/", request.url));
//     }
//     window.sessionStorage.setItem('userEmail', user.email);
//     return response;
//   } catch (e) {
//     return NextResponse.next({
//       request: {
//         headers: request.headers,
//       },
//     });
//   }
// }

// export const config = {
//   matcher: ["/((?!api|_next/static|_next/image|favicon.ico|auth/callback).*)", "/home" ],
// };


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
