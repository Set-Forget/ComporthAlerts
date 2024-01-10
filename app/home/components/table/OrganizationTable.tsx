"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useSWR from "swr";
import { DataTable } from "@/components/DataTable";
import { useOrganizationQuery } from "../use-organization-query";
import { EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAccountEmail } from "../../incidents/utils/dbUtils";
import LoadingSpinner from "@/components/LoadingSpinner";

export const OrganizationTable = () => {
  const [userData, setUserData] = useState(null);
  const [orgData, setOrgData] = useState([]);
  const [orgToShow, setOrgToShow] = useState([])
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  const query = useOrganizationQuery();
  const [userRole, setUserRole] = useState(null);
  const showEyebutton = userRole !== "client" && userRole !== "user";

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const email = await fetchAccountEmail();

      if (!email) {
        console.error("No email found.");
        setIsLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from("account")
          .select("*")
          .eq("email", email)
          .single();

        if (error) throw error;

        setUserData(data);
        setUserRole(data.role);
        if (["client", "client_admin", "user"].includes(data.role)) {
          const { data: orgData, error: orgError } = await supabase
            .from("account_organization")
            .select("organization_id")
            .eq("account_id", data.id);

          if (orgError) throw orgError;

          const orgIds = orgData.map((org) => org.organization_id);
          setOrgData(orgIds);
          if (orgIds.length > 0) {
            const { data: orgData, error: orgError } = await supabase
              .from("organization")
              .select("*")
              .in("id", orgIds);

            if (orgError) throw orgError;
            setOrgToShow(orgData);

            }
          } else {
            const { data: orgData, error: orgError } = await supabase
              .from("organization")
              .select("*")

            if (orgError) throw orgError;
            setOrgToShow(orgData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);


  return isLoading ? (
    <LoadingSpinner />
  ) : (
    <DataTable
    rowIcon={(data) => {
      return showEyebutton ? (
        <EyeIcon
          className="cursor-pointer"
          onClick={() => query.onSet((s) => ({ type: "READ", data }))}
        />
      ) : null;
    }}
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
      data={orgToShow}
    />
  );
};
