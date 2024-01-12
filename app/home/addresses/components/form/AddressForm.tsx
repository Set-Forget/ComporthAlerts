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
    street: init?.street || "",
    unit: init?.unit || "",
    zip: init?.zip || "",
    deleted: !!init?.deleted,
  };
};

export const AddressForm = (props: Props) => {
  const { toast } = useToast();
  const form = useForm<{
    street: string;
    unit: string;
    zip: string;
    deleted: boolean;
  }>({
    defaultValues: initialize(props.init),
  });

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);
  const [organizations, setOrganizations] = useState<{ name: any }[]>([]);

  const organizationId = async (organizationName: string) => {
    const supabase = createClientComponentClient();

    const res = await supabase
      .from("organization")
      .select("id")
      .eq("name", organizationName)
      .single();
    if (res.error) {
      return toast({
        variant: "destructive",
        title: res.error?.code,
        description: res.error?.message,
      });
    }
    return res.data.id; // Devuelve un objeto con la propiedad 'id'
  };

  const onSubmit = form.handleSubmit(async (draft) => {
    const supabase = createClientComponentClient();

    if (!props.init) {
      const res = await supabase
        .from("address")
        .insert([{ street: draft.street, unit: draft.unit, zip: draft.zip }])
        .select();

      const resAddress = res.data?.[0]?.id;

      const resUserOrganization = await supabase
        .from("organization_address")
        .insert([
          {
            address_id: resAddress,
          },
        ])
        .select();

      if (res.error || resUserOrganization.error) {
        return toast({
          title: res.error?.code || resUserOrganization.error?.code,
          variant: "destructive",
          description: res.error?.message || resUserOrganization.error?.message,
        });
      }

      props.onSubmit?.(res.data[0]);
      toast({ title: "Successful" });
    } else if (props.init) {
      const { data, error } = await supabase
        .from("address")
        .update({
          street: draft.street,
          unit: draft.unit,
          zip: draft.zip,
          deleted: draft.deleted,
        })
        .eq("id", props.init.id);

      if (error) {
        console.log("errors:", error);

        return toast({
          title: "Error",
          variant: "destructive",
          description:
            "There was an error editing the user, please try again. If the problem persists, please contact support.",
        });
      } else {
        toast({ title: "Successful" });
      }
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 p-2">
        <FormField
          control={form.control}
          name="street"
          render={RHFSlot({
            label: "Street",
            rhf: "Input",
          })}
        />

        <FormField
          control={form.control}
          name="unit"
          render={RHFSlot({
            label: "Unit #",
            rhf: "Input",
          })}
        />

        <FormField
          control={form.control}
          name="zip"
          render={RHFSlot({
            label: "Zip Code",
            rhf: "Input",
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
