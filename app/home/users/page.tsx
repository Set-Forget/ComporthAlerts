"use client";

import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { useRequireAuth } from "@/utils/hooks/auth";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { PlusCircleIcon } from "lucide-react";
import { useState } from "react";

import useSWR from "swr";
import { UserForm } from "./components";

export default () => {
  useRequireAuth();
  const [isCreatingUser, setIsCreatingUser] = useState(false);
 
  

  const userSWR = useSWR("account", (key: string) => {
    const supabase = createClientComponentClient();
    return supabase.from(key).select("*").range(0, 9);
  });

  if (userSWR.isLoading) return <>...LOADING</>;

  return (
    <div>
      {!isCreatingUser &&(
      <div className="flex justify-between gap-3">
        <Button className="gap-1" onClick={() => setIsCreatingUser(true)}>
          <p>Create</p>
          <PlusCircleIcon />
        </Button>
      </div>
      )}
      {isCreatingUser && (
        <UserForm
          onCancel={() => setIsCreatingUser(false)}
        />
      )}
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
