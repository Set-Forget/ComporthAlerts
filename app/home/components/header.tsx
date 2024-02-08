"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import {
  CreditCard,
  LogOut,
  Mail,
  MessageSquare,
  Plus,
  PlusCircle,
  Settings,
  User,
  UserPlus,
  Users,
} from "lucide-react";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import useSWR from "swr";

export const Header = () => {
  // const supa = useSupabaseClient();
  // console.log(supa);
  const router = useRouter();
  const session = useSWR("session", () => {
    const supa = createClientComponentClient();
    return supa.auth.getSession();
  });
  if (session.isLoading) return <></>;

  const defaultAvatarUrl = "https://cdn-icons-png.flaticon.com/512/266/266033.png";

  return (
    <header className="flex justify-between w-auto">
      <img
        className="h-8"
        src="https://comporth.com/wp-content/uploads/2023/03/Comporth-Horizontal.png"
      />
      <div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="cursor-pointer">
              <AvatarImage
                src={session.data?.data.session?.user?.user_metadata.avatar_url || defaultAvatarUrl}
                alt="@shadcn"
              />
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            <DropdownMenuItem
              onClick={() => {
                const supa = createClientComponentClient();
                supa.auth.signOut();
                router.push("/");
              }}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};
