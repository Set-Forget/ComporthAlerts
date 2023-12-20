"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useSWR, { mutate } from "swr";
import { DataTable } from "@/components/DataTable";
import { useOrganizationQuery } from "../use-organization-query";
import { useState } from "react";
import { UserForm } from "../../users/components";
import { Button } from "@/components/ui/button";
import { EyeIcon } from "lucide-react";

export const OrganizationUserTable = () => {
  const query = useOrganizationQuery();
  const [form, setForm] = useState<{
    type: "EDIT" | "CREATE" | "";
    data: any | null;
  }>({
    type: "",
    data: null,
  });

  const { data, error, isLoading } = useSWR<any>(
    !!query.state.data.id ? "account_organization" : null,
    (key: string) => {
      const supabase = createClientComponentClient();

      return supabase
        .from(key)
        .select(`account (full_name, email, phone, role)`)
        .eq("organization_id", Number(query.state.data.id));
    }
  );

  const userData = data?.data.map(
    (item: {
      account: { full_name: any; email: any; phone: any; role: any };
    }) => ({
      full_name: item.account.full_name,
      email: item.account.email,
      phone: item.account.phone,
      role: item.account.role,
    })
  );

  if (isLoading) return <>...LOADING</>;

  if (form.type === "EDIT") {
    return (
      <UserForm
        init={form.data}
        onSubmit={() => {
          setTimeout(() => {
            mutate("organization_account");
            setForm({ type: "", data: null });
          }, 500);
        }}
      />
    );
  }

  if (form.type === "CREATE") {
    return (
      <UserForm
        onSubmit={async (data) => {
          const supabase = createClientComponentClient();
          await supabase
            .from("organization_account")
            .insert([
              { organization_id: query.state.data.id, account_id: data.id },
            ]);
          setTimeout(() => {
            mutate("organization_account");
            setForm({ type: "", data: null });
          }, 500);
        }}
      />
    );
  }

  return (
    <div className="relative py-2">
      <Button
        onClick={() => setForm({ type: "CREATE", data: null })}
        className="absolute -top-12 right-0"
      >
        + Add
      </Button>

      <DataTable
        rowIcon={(data) => (
          <EyeIcon
            className="cursor-pointer"
            onClick={() => setForm({ type: "EDIT", data })}
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
            header: "Phone",
          },
          {
            accessorKey: "role",
            header: "Role",
          },
        ]}
        //@ts-ignore
        data={userData || []}
      />
    </div>
  );
};
