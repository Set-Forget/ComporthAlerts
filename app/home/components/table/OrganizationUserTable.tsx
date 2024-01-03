"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useSWR, { mutate } from "swr";
import { DataTable } from "@/components/DataTable";
import { useOrganizationQuery } from "../use-organization-query";
import { useState } from "react";
import { UserForm } from "../../users/components";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle } from "lucide-react";


export const OrganizationUserTable = () => {
  const query = useOrganizationQuery();
  const [form, setForm] = useState<{
    type: "EDIT" | "CREATE" | "";
    data: any | null;
  }>({
    type: "",
    data: null,
  });
  

  const onUserRemove = async (id: number) => {
    const supabase = createClientComponentClient();
    await supabase
      .from("account_organization")
      .delete()
      .eq("account_id", Number(id))
      .eq("organization_id", Number(query.state.data.id)).then(() => {
        setTimeout(() => {
          mutate(`account_organization_eq_${query.state.data.id}`);
        }, 500);
      }

      );
  };

  // muestra todos los user de la organizacion
  const {
    data: data1,
    error,
    isLoading,
  } = useSWR<any>(
    !!query.state.data.id
      ? `account_organization_eq_${query.state.data.id}`
      : null,
    (key: string) => {
      const supabase = createClientComponentClient();
      return supabase
        .from("account_organization")
        .select(`account (id, full_name, email, phone, role)`)
        .eq("organization_id", Number(query.state.data.id));
    }
  );



  //muestra todos los user disponibles para agregar a la organizacion
  const {
    data: responseUserAdd,
    error: error2,
    isLoading: isLoading2,
  } = useSWR<any>(
    !!query.state.data.id
      ? `account_organization_neq_${query.state.data.id}`
      : null,
    (key: string) => {
      const supabase = createClientComponentClient();
      return supabase
        .from("account")
        .select(
          `
          id,
          full_name,
          email, account_organization(organization_id)`
        )
        .neq(
          "account_organization.organization_id",
          Number(query.state.data.id)
        );
    }
  );

  const userData = data1?.data.map(
    (item: {
      account: { id: any; full_name: any; email: any; phone: any; role: any };
    }) => ({
      id: item.account.id,
      full_name: item.account.full_name,
      email: item.account.email,
      phone: item.account.phone,
      role: item.account.role,
    })
  );

  if (isLoading || isLoading2) return <>...LOADING</>;

  const associatedAccountIds = new Set(
    data1?.data.map((item: { account: { id: any } }) => item.account.id)
  );

  const userDataAdd = responseUserAdd?.data
    .filter((item: { id: any }) => !associatedAccountIds.has(item.id))
    .map((item: { id: any; full_name: any; email: any }) => ({
      id: item.id,
      full_name: item.full_name,
      email: item.email,
    }));

 


  if (form.type === "EDIT") {
    return (
      <UserForm
        init={form.data}
        onSubmit={() => {
          setTimeout(() => {
            mutate("account_organization");
            setForm({ type: "", data: null });
          }, 500);
        }}
      />
    );
  }

  if (form.type === "CREATE") {
    return (
      <DataTable
        rowIcon={(data) => (
          <PlusCircle
            className="cursor-pointer"
            onClick={() => {
              const supabase = createClientComponentClient();
              supabase
                .from("account_organization")
                .insert([
                  { account_id: data.id, organization_id: query.state.data.id },
                ])
                .then(() => {
                  setTimeout(() => {
                    mutate(`account_organization_eq_${query.state.data.id}`);
                    setForm({ type: "", data: null });
                  }, 500);
                });
            }}
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
        ]}
        //@ts-ignore
        data={userDataAdd || []}
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
          <MinusCircle
            className="cursor-pointer text-red-300"
            onClick={() => onUserRemove(Number(data.id))}
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
