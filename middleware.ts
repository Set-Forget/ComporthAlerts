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
    const { data } = await supabase.auth.getSession();

    if (!data.session) {
      if (request.nextUrl.pathname !== "/") {
        return NextResponse.redirect(new URL("/", request.url));
      }
    }

    return response;
  } catch (e) {
    // If you are here, a Supabase client could not be created!
    // This is likely because you have not set up environment variables.
    // Check out http://localhost:3000 for Next Steps.
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
