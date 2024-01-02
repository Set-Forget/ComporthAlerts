"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useSWR from "swr";
import { DataTable } from "@/components/DataTable";
import { useUserQuery } from "../use-user-query";
import { EyeIcon } from "lucide-react";

export const UserTable = () => {
  const orgSWR = useSWR("account", (key: string) => {
    const supabase = createClientComponentClient();
    //no mostrar los que tengan  el campo delted en true
    return supabase.from(key).select("*").eq("deleted", false);
  });
  const query = useUserQuery();

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
      //@ts-ignore
      data={orgSWR.data?.data || []}
    />
  );
};
