import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { DataTable } from "@/components/DataTable";
import { Button } from "@/components/ui/button";
import { PlusCircle, MinusCircle } from "lucide-react";
import { useUserQuery } from "../use-user-query";

interface FormState {
  type: "EDIT" | "CREATE" | "";
  data: any | null;
}

interface Organization {
  id: number;
  name: string;
}

interface UserOrganizationTableProps {
  userId: number | null;
}

export const UserOrganizationTable = ({
  userId,
}: UserOrganizationTableProps) => {
  const query = useUserQuery();
  const [form, setForm] = useState<FormState>({ type: "", data: null });

  const fetchOrganizations = async (
    userId: number
  ): Promise<Organization[]> => {
    const supabase = createClientComponentClient();
    let { data, error } = await supabase
      .from("account_organization")
      .select("organization_id, organization:organization_id (id, name)")
      .eq("account_id", userId);

    if (error) {
      throw new Error(error.message);
    }

    if (!data) {
      return [];
    }

    return data.map((item) => ({
      id: (item as any).organization.id as number,
      name: (item as any).organization.name as string,
    }));
  };

  const {
    data: organizationsData,
    error,
    isLoading,
  } = useSWR<Organization[]>(
    query.state.data?.id
      ? `organizations_for_user_${query.state.data.id}`
      : null,
    () => fetchOrganizations(query.state.data.id)
  );

  const removeUserFromOrganization = async (organizationId: number) => {
    const supabase = createClientComponentClient();
    await supabase
      .from("account_organization")
      .delete()
      .eq("account_id", query.state.data.id)
      .eq("organization_id", organizationId)
      .then(() => {
        setTimeout(() => {
          mutate(`organizations_for_user_${query.state.data.id}`);
        }, 500);
      });
  };

  if (isLoading) return <div>...LOADING</div>;
  if (error) return <div>Error loading data</div>;

  const organizationData = organizationsData?.reduce(
    (acc: any[], item: any) => {
      if (item) {
        acc.push({
          id: item.id,
          name: item.name,
        });
      }
      return acc;
    },
    []
  );

  return (
    <div className="relative py-2">
      <DataTable
        rowIcon={(data) => (
          <MinusCircle
            className="cursor-pointer text-red-300"
            onClick={() => removeUserFromOrganization(Number(data.id))}
          />
        )}
        headers={[
          {
            accessorKey: "name",
            header: "Organization Name",
          },
        ]}
        data={organizationData || []}
      />
    </div>
  );
};
