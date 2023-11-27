"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useSWR, { mutate } from "swr";
import { DataTable } from "@/components/DataTable";
import { useOrganizationQuery } from "../use-organization-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OrganizationAddressForm } from "../form";
import { MinusCircle } from "lucide-react";

export const OrganizationAddressTable = () => {
  const query = useOrganizationQuery();
  const orgId = Number(query.state.data.id);
  const [isAdd, setAdd] = useState(false);

  const addresses = useSWR(
    !!query.state.data.id ? "organization_address" : null,
    (key: string) => {
      const supabase = createClientComponentClient();
      return supabase
        .from("organization_address")
        .select(`address(id,street,zip,unit,deleted)`)
        .eq("organization_id", orgId)
        .order("created_at");
    }
  );

  if (addresses.isLoading) return <>...LOADING</>;

  const onAddressAdd = () => {
    setAdd(false);
    addresses.mutate();
  };

  const onAddressRemove = async (id: number) => {
    const supabase = createClientComponentClient();
    await supabase
      .from("organization_address")
      .delete()
      .eq("organization_id", orgId)
      .eq("address_id", id)
      .order("created_at");
    addresses.mutate();
  };

  if (isAdd) {
    return (
      <div className="w-auto">
        <OrganizationAddressForm onSubmit={onAddressAdd} orgId={orgId} />
      </div>
    );
  }

  return (
    <div className="relative py-2">
      <div className="absolute -top-12 right-0 gap-2 flex flex-row ">
        <Button onClick={() => setAdd(true)} className="">
          + Add
        </Button>
      </div>
      <DataTable
        rowIcon={(data) => (
          <MinusCircle
            className="text-red-300 cursor-pointer"
            onClick={async () => await onAddressRemove(data.id)}
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
            cell: ({ row }) => (
              <p>{!!row.original.unit ? row.original.unit : "--"}</p>
            ),
          },
          {
            accessorKey: "zip",
            header: "Zip Code",
            cell: ({ row }) => (
              <p>{!!row.original.zip ? row.original.zip : "--"}</p>
            ),
          },
        ]}
        //@ts-ignore
        data={addresses.data?.data.map((ADD) => ADD.address) || []}
      />
    </div>
  );
};
