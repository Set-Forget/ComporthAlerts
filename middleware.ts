import { NextResponse, NextRequest } from "next/server";
import { createClient } from "@/utils/supabase/middleware";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";

export async function middleware(request: NextRequest) {
  try {
    // This `try/catch` block is only here for the interactive tutorial.
    // Feel free to remove once you have Supabase connected.
    // const { supabase, response } = createClient(request);
    // Refresh session if expired - required for Server Components
    // https://supabase.com/docs/guides/auth/auth-helpers/nextjs#managing-session-with-middleware
    // const { data } = await supabase.auth.getSession();
    // const data = await supabase.auth.refreshSession();
    const response = NextResponse.next({
      request: {
        headers: request.headers,
      },
    });
    const supabase = createMiddlewareClient({
      req: request,
      res: response,
    });
    // const user = await supabase.auth.getUser();
    const { data: session } = await supabase.auth.getSession();
    const { data: user } = await supabase.from("account").select().single();

    if (session && user) {
      return NextResponse.redirect(new URL("/home", request.url));
    }

    if (!session) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    window.sessionStorage.setItem('userEmail', user.email);
    return response;
  } catch (e) {
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
