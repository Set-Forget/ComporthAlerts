"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/utils/hooks/auth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

import useSWR from "swr";

export default () => {
  useRequireAuth();
  const userSWR = useSWR("account", (key: string) => {
    const supabase = createClientComponentClient();
    return supabase.from(key).select("*").range(0, 9);
  });

  if (userSWR.isLoading) return <>...LOADING</>;
  console.log(userSWR.data);
  return (
    <div>
      <Button>create</Button>
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
