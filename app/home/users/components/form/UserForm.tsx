"use client";

import { Form, FormField } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { RHFSlot } from "@/components/CRUD/slot";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import Select from "react-select";

interface Props {
  init?: any;
  onSubmit?: (data?: any) => void;
}

const initialize = (init?: any) => {
  return {
    full_name: init?.full_name || "",
    email: init?.email || "",
    phone: init?.phone || "",
    role: init?.role || "",
    organization: init?.organization_id || null, // Usar el valor seleccionado
  };
};

export const UserForm = (props: Props) => {
  const { toast } = useToast();
  const form = useForm<{
    full_name: string;
    email: string;
    phone: string;
    role: string;
    organization: string;
  }>({
    defaultValues: initialize(props.init),
  });

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  const [organizations, setOrganizations] = useState<{ name: any }[]>([]);
  const [selectedOrganization, setSelectedOrganization] =
    useState<SelectOption | null>(null);

  interface SelectOption {
    label: string;
    value: string;
  }

  const onSubmit = form.handleSubmit(async (draft) => {
    const supabase = createClientComponentClient();

    if (!props.init) {
      const resUser = await supabase
        .from("account")
        .insert([
          {
            full_name: draft.full_name,
            email: draft.email,
            phone: draft.phone,
            role: draft.role,
          },
        ])
        .select();

      if (!resUser) {
        console.log("errors:", resUser);

        return toast({
          title: resUser,
          variant: "destructive",
          description: resUser,
        });
      } else {
        toast({ title: "Successful" });
      }
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-1 p-2">
        <FormField
          control={form.control}
          name="full_name"
          render={RHFSlot({
            label: "Full Name",
            rhf: "Input",
          })}
        />

        <FormField
          control={form.control}
          name="email"
          render={RHFSlot({
            label: "Email",
            rhf: "Input",
          })}
        />

        <FormField
          control={form.control}
          name="phone"
          render={RHFSlot({
            label: "Phone",
            rhf: "Input",
          })}
        />
        <FormField
          control={form.control}
          name="role"
          render={RHFSlot({
            label: "Role",
            rhf: "Select",
            props: {
              options: [
                {
                  label: "Client Admin",
                  value: "client_admin",
                },
                {
                  label: "Client",
                  value: "client",
                },
                {
                  label: "Customer",
                  value: "customer",
                },
              ],
            },
          })}
        />

        <div className="flex gap-2 items-center mt-6">
          <Button className="flex-1" type="submit">
            Submit
          </Button>
        </div>
      </form>
    </Form>
  );
};
