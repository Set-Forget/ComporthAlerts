"use client";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetHeader,
  SheetClose,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useOrganizationQuery } from "./use-organization-query";
import { OrganizationForm } from "./form";
import { Button } from "@/components/ui/button";
import useSWR, { mutate } from "swr";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";
import { OrganizationAddressTable, OrganizationUserTable } from "./table";
import { PlusCircleIcon } from "lucide-react";

export const OrganizationCRUD = () => {
  const query = useOrganizationQuery();
  const [currentTab, setTab] = useState<"edit" | "accounts" | "addresses">(
    "edit"
  );

  const onSubmit = () => {
    setTimeout(() => {
      mutate("organization");
      query.onSet((s) => ({ data: null, type: "" }));
    }, 500);
  };

  return (
    <Sheet
      open={!!query.state.type}
      onOpenChange={(bool) => {
        if (bool) return;
        query.onSet((_) => ({ data: null, type: "" }));
      }}
    >
      <SheetTrigger asChild className="flex justify-between gap-2">
        <Button 
          onClick={() => {
            query.onSet(() => ({ type: "CREATE" }));
          }}
        >
           <p>Create</p> 
          <PlusCircleIcon />
        </Button>
      </SheetTrigger>
      <SheetClose />
      <SheetContent className="min-w-[700px]">
        <SheetHeader>
          <SheetTitle>Organization</SheetTitle>
        </SheetHeader>
        {query.state.type === "CREATE" && (
          <OrganizationForm onSubmit={onSubmit} />
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
              <TabsTrigger value="accounts">Users</TabsTrigger>
              <TabsTrigger value="addresses">Addresses</TabsTrigger>
            </TabsList>
            <TabsContent value="edit">
              <OrganizationForm init={query.state.data} onSubmit={onSubmit} />
            </TabsContent>
            <TabsContent value="accounts">
              {currentTab === "accounts" && <OrganizationUserTable />}
            </TabsContent>
            <TabsContent value="addresses">
              {currentTab === "addresses" && <OrganizationAddressTable />}
            </TabsContent>
          </Tabs>
        )}
      </SheetContent>
    </Sheet>
  );
};
