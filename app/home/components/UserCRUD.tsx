"use client";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useUserQuery } from "./use-user-query";

import { Button } from "@/components/ui/button";
import useSWR, { mutate } from "swr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from "react";
import { PlusCircleIcon } from "lucide-react";
import { UserForm } from "../users/components";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { fetchAccountEmail } from "../incidents/utils/dbUtils";

export const UserCRUD = () => {
  let query = useUserQuery();
  const [currentTab, setTab] = useState<"edit" >(
    "edit"
  );
  const [userRole, setUserRole] = useState(null); 
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchUserData = async () => {
      const email = await fetchAccountEmail();

      if (!email) {
        console.error("No email found.");
        return;
      }

      try {
        const { data, error } = await supabase
          .from("account")
          .select("*")
          .eq("email", email)
          .single();

        if (error) throw error;

        if (data) {
          setUserRole(data.role);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      } finally {
        console.log(userRole)
      }
    };

    fetchUserData();
  }, []);



  const onSubmit = () => {
    setTimeout(() => {
      mutate("account");
      query.onSet((s) => ({ data: null, type: "" }));
    }, 500);
  };

  const showCreateButton = userRole !== 'client' && userRole !== 'user';


  return (
    <Sheet
      open={!!query.state.type}
      onOpenChange={(bool) => {
        if (bool) return;
        query.onSet((_) => ({ data: null, type: "" }));
      }}
    >
     {showCreateButton && (
        <SheetTrigger asChild className="flex justify-between gap-1">
          <Button 
            onClick={() => {
              query.onSet(() => ({ type: "CREATE" }));
            }}
          >
            <p className="">Create</p> 
            <PlusCircleIcon />
          </Button>
        </SheetTrigger>
      )}
      <SheetClose />
      <SheetContent className="min-w-[700px]">
        <SheetHeader>
          <SheetTitle>User</SheetTitle>
        </SheetHeader>
        {query.state.type === "CREATE" && (
          <UserForm onSubmit={onSubmit}  />
        )}
        {query.state.type === "READ" && (
          <Tabs
            onValueChange={(val: any) => setTab(val)}
            value={currentTab}
            defaultValue={currentTab}
            className="mt-4"
          >
            <TabsList>
              <TabsTrigger value="edit">Edit</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <UserForm init={query.state.data} onSubmit={onSubmit} />
            </TabsContent>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  );
};
