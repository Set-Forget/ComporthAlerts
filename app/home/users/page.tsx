"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/utils/hooks/auth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PlusCircleIcon, User } from "lucide-react";


import useSWR, { mutate } from "swr";

import { useUserQuery } from "../components/use-user-query";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserForm } from "./components/form/UserForm";

export default () => {
  useRequireAuth();

  const query = useUserQuery();

  const onSubmit = () => {
    setTimeout(() => {
      mutate("user");
      query.onSet((s) => ({ data: null, type: "" }));
    }, 500);
  };

  const userSWR = useSWR("account", (key: string) => {
    const supabase = createClientComponentClient();
    return supabase.from(key).select("*").range(0, 9);
  });

  if (userSWR.isLoading) return <>...LOADING</>;

  return (
    <div>
      <Sheet
        open={!!query.state.type}
        onOpenChange={(bool) => {
          if (bool) return;
          query.onSet((_) => ({ data: null, type: "" }));
        }}
      >
        <SheetTrigger asChild className="flex justify-between gap-1">
          <Button
            onClick={() => {
              query.onSet(() => ({ type: "CREATE" }));
            }}
          >
            <p className="">Create</p>
            <PlusCircleIcon />
          </Button>
        </SheetTrigger>

        <SheetClose />
        <SheetContent className="min-w-[700px]">
          <SheetHeader>
            <SheetTitle>User</SheetTitle>
          </SheetHeader>
          {query.state.type === "CREATE" && <UserForm onSubmit={onSubmit} />}
        </SheetContent>
      </Sheet>

      <DataTable
        headers={[
          {
            accessorKey: "full_name",
            header: "Name",
          },
          {
            accessorKey: "email",
            header: "Email",
          },
          {
            accessorKey: "phone",
            header: "Contact",
          },
          {
            accessorKey: "role",
            header: "Role",
          },
        ]}
        data={(userSWR.data as any)?.data || []}
      />
    </div>
  );
};
