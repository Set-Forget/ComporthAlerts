import Link from "next/link";
import { headers, cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { LinkedinIcon, Facebook, Twitter } from "lucide-react";


export default function Login({
  searchParams,
}: {
  searchParams: { message: string };
}) {
  const signIn = async () => {
    "use server";
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    
    
    

    const oauth = await supabase.auth.signInWithOAuth({
      
      provider: "google",
      options: {
        redirectTo: (() => {
          let url =
         // Set this to your site URL in production env.
          "https://"+process?.env?.NEXT_PUBLIC_VERCEL_URL+"/auth/callback" // Automatically set by Vercel.
          
          // Make sure to include `https://` when not localhost.
          
          return url;
        })(),
      },
    });

    if (oauth.error) {
      return redirect("/login?message=Could not authenticate user");
    }
    
    
    console.log(oauth.data.url);
    
    return redirect(oauth.data.url);
  };

  return (
    
    <>
      <div className="md:hidden">
        {/* <Image
          src="/examples/authentication-light.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="block dark:hidden"
        />
        <Image
          src="/examples/authentication-dark.png"
          width={1280}
          height={843}
          alt="Authentication"
          className="hidden dark:block"
        /> */}
      </div>
      <div className="rounded-lg border-2 border-black-400 w-[90%] m-auto mt-[10%] overflow-hidden relative hidden h-[800px] flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white dark:border-r lg:flex">
          <div className="absolute inset-0 bg-regal-blue" />
          <div className="relative z-20 flex items-center justify-center">
            <img
              className="h-24"
              src="https://comporth.com/wp-content/uploads/2023/05/Comporth-blackwhite-with-subheader-14-14.png"
            />
          </div>
          <div className="flex gap-2 z-20 mt-auto justify-center">
            <button className="rounded-full border-2 p-2">
              <LinkedinIcon />
            </button>
            <button className="rounded-full border-2 p-2">
              <Facebook />
            </button>
            <button className="rounded-full border-2 p-2">
              <Twitter />
            </button>
            {/* <p className="text-lg">
                &ldquo;Descriptions.&rdquo;
              </p> */}
            {/* <footer className="text-sm">Sofia Davis</footer> */}
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">Sign in</h1>
              <p className="text-sm text-muted-foreground">
                Contact your admin for access
              </p>
            </div>
            <form action={signIn} className="space-y-6 m-auto">
              <button className="flex w-max items-center justify-center gap-3 rounded-md px-3 py-1.5 text-gray-600 border-[1px] border-gray-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#24292F]">
                <svg viewBox="0 0 48 48" width={24}>
                  <title>Google Logo</title>
                  <clipPath id="g">
                    <path d="M44.5 20H24v8.5h11.8C34.7 33.9 30.1 37 24 37c-7.2 0-13-5.8-13-13s5.8-13 13-13c3.1 0 5.9 1.1 8.1 2.9l6.4-6.4C34.6 4.1 29.6 2 24 2 11.8 2 2 11.8 2 24s9.8 22 22 22c11 0 21-8 21-22 0-1.3-.2-2.7-.5-4z" />
                  </clipPath>
                  <g clipPath="url(#g)">
                    <path fill="#FBBC05" d="M0 37V11l17 13z" />
                    <path fill="#EA4335" d="M0 11l17 13 7-6.1L48 14V0H0z" />
                    <path fill="#34A853" d="M0 37l30-23 7.9 1L48 0v48H0z" />
                    <path fill="#4285F4" d="M48 48L17 24l-4-3 35-10z" />
                  </g>
                </svg>
                <span className="text-sm font-semibold leading-6">
                  Sign in with Google
                </span>
              </button>
            </form>
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
