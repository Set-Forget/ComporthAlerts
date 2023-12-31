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
  process.env.NEXT_PUBLIC_VERCEL_WEB_URL + "/home" ??
  "http://localhost:3000/home";
return NextResponse.redirect(url);
}
