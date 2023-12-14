"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRequireAuth } from "@/utils/hooks/auth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import useSWR from "swr";
import { AddressForm } from "./components";

export default () => {
  useRequireAuth();
  const [isCreatingAddress, setIsCreatingAddress] = useState(false);

  const userSWR = useSWR("address", (key: string) => {
    const supabase = createClientComponentClient();
    return supabase.from(key).select();
  });

  if (userSWR.isLoading) return <>...LOADING</>;

  return (

    <div>
      {isCreatingAddress && (
        <AddressForm
          onCancel={() => setIsCreatingAddress(false)}
        />
      )}
      {!isCreatingAddress && (
        <div className="flex justify-between gap-3">
          <Input placeholder="search" />

          <Button className="gap-1" onClick={() => setIsCreatingAddress(true)}>
            <p >Create</p>
            <PlusCircleIcon />
          </Button>
        </div>
      )}
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
