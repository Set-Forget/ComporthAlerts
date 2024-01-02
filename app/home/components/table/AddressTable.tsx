"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useSWR from "swr";
import { DataTable } from "@/components/DataTable";
import { useAddressQuery } from "../use-address-query";
import { EyeIcon } from "lucide-react";

export const AddressTable = () => {
  const orgSWR = useSWR("address", (key: string) => {
    const supabase = createClientComponentClient();
    //no mostrar los que tengan  el campo delted en true
    return supabase.from(key).select("*").eq("deleted", false);
  });
  const query = useAddressQuery();

  if (orgSWR.isLoading) return <>...LOADING</>;

  return (
    <DataTable
      rowIcon={(data) => (
        <EyeIcon
          className="cursor-pointer"
          onClick={() => query.onSet((s) => ({ type: "READ", data }))}
        />
      )}
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
      //@ts-ignore
      data={orgSWR.data?.data || []}
    />
  );
};
