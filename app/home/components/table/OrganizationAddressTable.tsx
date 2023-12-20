"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useSWR, { mutate } from "swr";
import { DataTable } from "@/components/DataTable";
import { useOrganizationQuery } from "../use-organization-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { OrganizationAddressForm } from "../form";
import { MinusCircle } from "lucide-react";
import { da } from "date-fns/locale";


export const OrganizationAddressTable = () => {
  const query = useOrganizationQuery();
  const orgId = Number(query.state.data.id);
  const [isAdd, setAdd] = useState(false);


  

  const { data, error, isLoading } = useSWR<any>(
    !!query.state.data.id ? "organization_address" : null,
    (key: string) => {
      const supabase = createClientComponentClient();
      return supabase
        .from(key)
        .select(`address (id, street, zip, unit)`)
        .eq("organization_id", orgId);
    }
  );


  const addressData = data?.data.map((item: { address: { id: any; street: any; zip: any; unit: any; }; }) => ({
    id: item.address.id,
    street: item.address.street,
    zip: item.address.zip,
    unit: item.address.unit,
  }))


  if (isLoading) return <>...LOADING</>;

  const onAddressAdd = () => {
    setAdd(false);
    // addresses?.mutate();
  };

  const onAddressRemove = async (id: number) => {
    const supabase = createClientComponentClient();
    await supabase
      .from("organization_address")
      .delete()
      .eq("organization_id", orgId)
      .eq("address_id", id)

    mutate("organization_address");
    console.log("deleted");
    
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
           
          },
          {
            accessorKey: "zip",
            header: "Zip Code",
           
          },
        ]}
        //@ts-ignore
        data={addressData}
      />
    </div>
  );
};
