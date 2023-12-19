"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRequireAuth } from "@/utils/hooks/auth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import useSWR, { mutate } from "swr";
import { AddressForm } from "./components";
import { useUserQuery } from "../components/use-user-query";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { UserForm } from "../users/components";

export default () => {
  useRequireAuth();
  // const [isCreatingAddress, setIsCreatingAddress] = useState(false);

  const query = useUserQuery();

  const onSubmit = () => {
    setTimeout(() => {
      mutate("user");
      query.onSet((s) => ({ data: null, type: "" }));
    }, 500);
  };

  const userSWR = useSWR("address", (key: string) => {
    const supabase = createClientComponentClient();
    return supabase.from(key).select();
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
            <SheetTitle>Address</SheetTitle>
          </SheetHeader>
          {query.state.type === "CREATE" && <AddressForm onSubmit={onSubmit} />}
        </SheetContent>
      </Sheet>

      <DataTable
        headers={[
          {
            accessorKey: "street",
            header: "Street",
          },
          {
            accessorKey: "unit",
            header: "Unit",
          },
          {
            accessorKey: "zip",
            header: "Zip",
          },
        ]}
        data={(userSWR.data as any)?.data || []}
      />
    </div>
  );
};
