import { createClient } from "@/utils/supabase/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";


export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get("code");


  if (code) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const session = await supabase.auth.exchangeCodeForSession(code);
   
    
   
    const userQuery = await supabase
      .from("account")
      .select()
      .eq("email", session.data.user?.email)
      .maybeSingle();



    if (!userQuery.data) {
      console.log('User data not found, signing out');
      await supabase.auth.signOut();
      return NextResponse.redirect(requestUrl.origin);
    }
  }
  let url =
  // Set this to your site URL in production env.
  "https://comporth-alerts-set-and-forget.vercel.app/home" 
  // URL to redirect to after sign in process completes
  return NextResponse.redirect(url);
}
