import Link from "next/link";
import { headers, cookies } from "next/headers";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

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
            process?.env?.NEXT_PUBLIC_SITE_URL ?? // Set this to your site URL in production env.
            process?.env?.NEXT_PUBLIC_VERCEL_URL ?? // Automatically set by Vercel.
            "http://localhost:3000/auth/callback";
          // Make sure to include `https://` when not localhost.
          url = url.includes("http") ? url : `https://${url}`;
          // Make sure to include a trailing `/`.
          url = url.charAt(url.length - 1) === "/" ? url : `${url}/`;
          return url;
        })(),
      },
    });

    if (oauth.error) {
      return redirect("/login?message=Could not authenticate user");
    }

    return redirect(oauth.data.url);
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center items-center gap-6">
      <h4>Sign In</h4>
      <Link
        href="/"
        className="absolute left-8 top-8 py-2 px-4 rounded-md no-underline text-foreground bg-btn-background hover:bg-btn-background-hover flex items-center group text-sm"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1"
        >
          <polyline points="15 18 9 12 15 6" />
        </svg>{" "}
        Back
      </Link>

      <div className="sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-12 shadow sm:rounded-lg sm:px-12">
          <div className="flex min-h-full flex-col gap-6 justify-center items-center py-10 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
              <img
                className="mx-auto h-10 w-auto"
                src="https://comporth.com/wp-content/uploads/2023/03/Comporth-Horizontal.png"
                alt="Your Company"
              />
            </div>
            <form action={signIn} className="space-y-6">
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
          </div>
        </div>
      </div>
    </div>
  );
}
