import { useEffect, useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { DataTable } from "@/components/DataTable";
import { EyeIcon } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchAccountEmail } from "../../incidents/utils/dbUtils";
import { useUserQuery } from "../use-user-query";

export const UserTable = () => {
  const [userData, setUserData] = useState(null);
  const [orgData, setOrgData] = useState([]);
  const [accountData, setAccountData] = useState([]);
  const [accountToShow, setAccountToShow] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  const query = useUserQuery();
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
            const { data: accData, error: accError } = await supabase
              .from("account_organization")
              .select("account_id")
              .in("organization_id", orgIds);

            if (accError) throw accError;

            setAccountData(accData);

            if (accData.length > 0) {
              const accIds = accData.map((acc) => acc.account_id);
              const { data: accToShow, error: accError } = await supabase
                .from("account")
                .select("*")
                .in("id", accIds);

              if (accError) throw accError;
              console.log(accToShow);
              setAccountToShow(accToShow);
            }
          }
        } else {
          const { data: accToShow, error: accError } = await supabase
            .from("account")
            .select("*");

          if (accError) throw accError;
          console.log(accToShow);

          setAccountToShow(accToShow);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
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
        { accessorKey: "full_name", header: "Name" },
        { accessorKey: "email", header: "Email" },
        { accessorKey: "phone", header: "Contact" },
        { accessorKey: "role", header: "Role" },
      ]}
      //@ts-ignore
      data={accountToShow}
    />
  );
};
