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
    organization: init?.organization_id || null, // Usar el valor seleccionado
  };
};

export const AddressForm = (props: Props) => {
  const { toast } = useToast();
  const form = useForm<{
    street: string;
    unit: string;
    zip: string;
    deleted: boolean;
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

  const getOrganizations = async () => {
    const supabase = createClientComponentClient();
    const res = await supabase
      .from("organization")
      .select("name")
      .eq("deleted", false);
    if (res.error) {
      return [];
    }
    setOrganizations(res.data.map((org) => ({ name: org.name })));
  };

  const onSubmit = form.handleSubmit(async (draft) => {
    const supabase = createClientComponentClient();
    const organizationIdValue = await organizationId((draft.organization as any)?.value);

    if (!props.init) {
      const res = await supabase
        .from("address")
        .insert([{ street: draft.street, unit: draft.unit, zip: draft.zip }])
        .select();

        const resAddress = res.data?.[0]?.id


        const resUserOrganization = await supabase
          .from("organization_address")
          .insert([
            {
              organization_id: organizationIdValue, // Usa la variable organizationId
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
   
    }
  });
  
  useEffect(() => {
    getOrganizations();
  }, []);
  // const onRemove = async () => {
  //   const supabase = createClientComponentClient();

  //   const res = await supabase
  //     .from("organization_address")
  //     .delete()
  //     .eq("address_id", Number(props.init.id))
  //     .select();

  //   props.onSubmit?.(res.data?.[0]);
  //   toast({ title: "Successful" });
  // };

  

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


        
<FormField
          control={form.control}
          name="organization"
          render={({ field }) => (
            <div className="flex flex-col gap-1 py-2">
              <label className="text-sm font-medium text-gray-900">
                Organization
              </label>
              <Select
                {...field}
                className="basic-single"
                classNamePrefix="select"
                defaultValue={organizations.length > 0 ? organizations[0].name : ""}
                isDisabled={isDisabled}
                isLoading={isLoading}
                isClearable={isClearable}
                isRtl={isRtl}
                isSearchable={isSearchable}
                name="organization"
                options={organizations.map((org) => ({
                  label: org.name,
                  value: org.name,
                }))}
                theme={(theme) => ({
                  ...theme,
                  borderRadius: 5,
                  colors: {
                    ...theme.colors,
                    primary25: 'silver',
                    primary: 'silver',
                  },
                })}
              />
            </div>
          )}
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
