"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useSWR from "swr";

import { DataTable } from "@/components/DataTable";
import { useOrganizationQuery } from "../use-organization-query";
import { EyeIcon } from "lucide-react";

export const OrganizationTable = () => {
  const orgSWR = useSWR("organization", (key: string) => {
    const supabase = createClientComponentClient();
    //no mostrar los que tengan  el campo delted en true
    return supabase.from(key).select("*").eq("deleted", false);
  });
  const query = useOrganizationQuery();

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
          accessorKey: "name",
          header: "Name",
        },
        {
          accessorKey: "email",
          header: "Email",
        },
        {
          accessorKey: "phone",
          header: "Phone",
        },
      ]}
      //@ts-ignore
      data={orgSWR.data?.data || []}
    />
  );
};
