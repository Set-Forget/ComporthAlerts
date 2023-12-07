"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { LinkedinIcon, Facebook, Twitter } from "lucide-react";
import { Auth } from '@supabase/auth-ui-react'
import {  useRouter } from "next/navigation";
import Link from "next/link";
import {
  // Import predefined theme
  ThemeSupa,
} from '@supabase/auth-ui-shared'
import { useEffect } from "react";

export default () => {
  const router = useRouter()
  const supabase = createClientComponentClient()

  useEffect(() => {
    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN")  {
        router.push('/home')
      } else { router.push('/') }
    })
  }, [])


  return (


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
          <div className="space-y-6 m-auto">
            <Auth supabaseClient={supabase} providers={[]} appearance={{ theme: ThemeSupa }} />
          </div>
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
              className="under  line underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
            .
          </p>
        </div>
      </div>

    </div>

  );
}
