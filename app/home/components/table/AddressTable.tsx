import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import useSWR from "swr";
import { DataTable } from "@/components/DataTable";
import { useAddressQuery } from "../use-address-query";
import { EyeIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { fetchAccountEmail } from "../../incidents/utils/dbUtils";
import LoadingSpinner from "@/components/LoadingSpinner";

export const AddressTable = () => {
  const [userData, setUserData] = useState(null);
  const [orgData, setOrgData] = useState<Array<number | string>>([]);
  const [address, setAddress] = useState<Array<number | string>>([]);
  const [addressToShow, setAddressToShow] = useState<Array<number | string>>(
    []
  );
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  const query = useAddressQuery();
  const [userRole, setUserRole] = useState(null);
  const showEyebutton = userRole !== "client" && userRole !== "user";
  console.log(showEyebutton);

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
            const { data: addrData, error: addrError } = await supabase
              .from("organization_address")
              .select("address_id")
              .in("organization_id", orgIds);

            if (addrError) throw addrError;

            if (addrData.length > 0) {
              const addIds = addrData.map((acc) => acc.address_id);
              setAddress(addIds);

              const { data: addToShow, error: addError } = await supabase
                .from("address")
                .select("*")
                .in("id", addIds);

              if (addError) throw addError;
              console.log(addToShow);
              setAddressToShow(addToShow);
            }
          }
        } else {
          const { data: addToShow, error: addError } = await supabase
            .from("address")
            .select("*");

          if (addError) throw addError;
          console.log(addToShow);

          setAddressToShow(addToShow);
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
        if (showEyebutton) {
          return (
            <EyeIcon
              className="cursor-pointer"
              onClick={() => query.onSet((s) => ({ type: "READ", data }))}
            />
          );
        } else {
          return <></>;
        }
      }}
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
          header: "Zip",
        },
      ]}
      //@ts-ignore
      data={addressToShow}
    />
  );
};
