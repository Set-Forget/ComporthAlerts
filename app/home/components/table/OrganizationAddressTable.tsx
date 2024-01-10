"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useSWR, { mutate } from "swr";
import { DataTable } from "@/components/DataTable";
import { useOrganizationQuery } from "../use-organization-query";
import { useState } from "react";
import { UserForm } from "../../users/components";
import { Button } from "@/components/ui/button";
import { MinusCircle, PlusCircle } from "lucide-react";

export const OrganizationAddressTable = () => {
  const query = useOrganizationQuery();
  const [form, setForm] = useState<{
    type: "EDIT" | "CREATE" | "";
    data: any | null;
  }>({
    type: "",
    data: null,
  });



  const orgId = Number(query.state.data.id);

  //muestra todos los address de la organizacion
  const { data: addressesAccount, isLoading } = useSWR<any>(
    !!query.state.data.id ? `organization_address_eq_${query.state.data.id}` : null,
    (key: string) => {
      const supabase = createClientComponentClient();
      return supabase
        .from("organization_address")
        .select(`address (id, street, zip, unit)`)
        .eq("organization_id", Number(query.state.data.id));
    }
  );

  console.log("address", addressesAccount);

  const {
    data: responseAddressAdd,
    error: error2,
    isLoading: isLoading2,
  } = useSWR<any>(
    !!query.state.data.id
      ? `organization_address_neq_${query.state.data.id}`
      : null,
    (key: string) => {
      const supabase = createClientComponentClient();
      return supabase
        .from("address")
        .select(
          `
          id, street, zip, unit, organization_address(organization_id)`
        )
        .neq(
          "organization_address.organization_id",
          Number(query.state.data.id)
        );
    }
  );

  const addressData = addressesAccount?.data.map(
    (item: { address: { id: any; street: any; zip: any; unit: any } }) => ({
      id: item.address.id,
      street: item.address.street,
      zip: item.address.zip,
      unit: item.address.unit,
    })
  );

  const associatedAddressIds = new Set(
    addressesAccount?.data.map(
      (item: { address: { id: any } }) => item.address.id
    )
  );

  const addressDataAdd = responseAddressAdd?.data
    .filter((item: { id: any }) => !associatedAddressIds.has(item.id))
    .map((item: { id: any; street: any; zip: any; unit: any }) => ({
      id: item.id,
      street: item.street,
      zip: item.zip,
      unit: item.unit,
    }));

  if (isLoading) return <>...LOADING</>;

  if (form.type === "EDIT") {
    return (
      <UserForm
        init={form.data}
        onSubmit={() => {
          setTimeout(() => {
            mutate("organization_address");
            setForm({ type: "", data: null });
          }, 500);
        }}
      />
    );
  }
  // const onAddressRemove = async (id: number) => {
  //   const supabase = createClientComponentClient();
  //   await supabase
  //     .from("organization_address")
  //     .delete()
  //     .eq("organization_id", orgId)
  //     .eq("address_id", id);

  //   mutate(`organization_address_eq_${orgId}`);
    
  // };

  const onAddressRemove = async (id: number) => {
    const supabase = createClientComponentClient();
    await supabase
      .from("organization_address")
      .delete()
      .eq("address_id", id)
      .eq("organization_id", orgId).then(() => {
          mutate(`organization_address_eq_${orgId}`);
      }

      );
  };


  if (form.type === "CREATE") {
    return (
      <DataTable
        rowIcon={(data) => (
          <PlusCircle
            className="cursor-pointer"
            onClick={() => {
              const supabase = createClientComponentClient();
              supabase
                .from("organization_address")
                .insert([
                  { organization_id: query.state.data.id, address_id: data.id },
                ])
                .then(() => {
                  setTimeout(() => {
                    mutate(`organization_address_eq_${query.state.data.id}`);
                    setForm({ type: "", data: null });
                  }, 500);
                });
            }}
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
            header: "Zip Code",
          },
        ]}
        //@ts-ignore
        data={addressDataAdd || []}
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
            onClick={() => onAddressRemove(Number(data.id))}
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
            header: "Zip Code",
          },
        ]}
        //@ts-ignore
        data={addressData || []}
      />
    </div>
  );
};
