import { useEffect, useState } from "react";
import {createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { DataTable } from "@/components/DataTable";
import { EyeIcon } from "lucide-react";
import LoadingSpinner from "@/components/LoadingSpinner";
import { fetchAccountEmail } from "../../incidents/utils/dbUtils";
import { useUserQuery } from "../use-user-query";
interface Account {
  id: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
  email_send : boolean;
  sms_send : boolean;
}


export const UserTable = () => {
  const [userData, setUserData] = useState(null);
  const [orgData, setOrgData] = useState<Array<number | string>>([]);
  const [accountData, setAccountData] = useState<Array<number | string>>([]);
  const [accountToShow, setAccountToShow] = useState<Array<Account>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();
  const query = useUserQuery();
  const [userRole, setUserRole] = useState(null);
  const showEyebutton = userRole !== "client" && userRole !== "user";


  useEffect(() => {
    console.log("Account charged");
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

            if (accData.length > 0) {
              const accIds = accData.map((acc) => acc.account_id);
              setAccountData(accIds);
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

      const channels = supabase.channel('custom-all-channel')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'account' },
        (payload) => {
          console.log('Change received!', payload)
          if (payload.eventType === 'INSERT' || payload.eventType === 'UPDATE') {
            setAccountToShow(prevAccounts => {
              const updatedAccounts = [...prevAccounts];
              const index = updatedAccounts.findIndex(acc => acc.id === payload.new.id);
      
              if (index !== -1) {
                updatedAccounts[index] = payload.new as Account;
              } else {
                updatedAccounts.push(payload.new as Account);
              }
      
              return updatedAccounts;
            });
          }
        }
      )
      .subscribe();
  
    return () => {
      supabase.removeChannel(channels);
    };

      
    };

    fetchData();
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
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
