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
import { useState } from "react";
import { PlusCircleIcon } from "lucide-react";
import { UserForm } from "../users/components";

export const UserCRUD = () => {
  const query = useUserQuery();
  const [currentTab, setTab] = useState<"edit" >(
    "edit"
  );

  const onSubmit = () => {
    setTimeout(() => {
      mutate("account");
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
      <SheetClose />
      <SheetContent className="min-w-[700px]">
        <SheetHeader>
          <SheetTitle>User</SheetTitle>
        </SheetHeader>
        {query.state.type === "CREATE" && (
          <UserForm onSubmit={onSubmit} />
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
