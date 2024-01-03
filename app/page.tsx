"use client"
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { LinkedinIcon, Facebook, Twitter } from "lucide-react";
import {  useRouter } from "next/navigation";
import { useEffect } from "react";
import LoginComponent from "@/components/LoginComponent";

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


    <div className="rounded-lg border-2 w-full m-auto max-h-screen h-screen  overflow-hidden relative hidden  flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
      <div className=" flex-col hidden h-full bg-regal-blue bg-muted p-10 text-white dark:border-r  lg:flex">
        <div className="relative z-20 flex items-center justify-center">
          <img
            className="h-24"
            src="https://comporth.com/wp-content/uploads/2023/05/Comporth-blackwhite-with-subheader-14-14.png"
          />
        </div>
        <div className="flex flex-row absolute bottom-16 self-center z-20 space-x-2 justify-center">
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
            <LoginComponent />
      </div>

  );
}
