"use client";

import { Form, FormField } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { RHFSlot } from "@/components/CRUD/slot";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

interface Props {
  init?: any;
  onSubmit?: (data?: any) => void;
  onCancel: () => void;
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

  const onSubmit = form.handleSubmit(async (draft) => {
    const supabase = createClientComponentClient();

    if (!props.init) {
      const res = await supabase
        .from("address")
        .insert([{ street: draft.street, unit: draft.unit, zip: draft.zip }])
        .select();

      if (res.error) {
        return toast({
          title: res.error.code,
          variant: "destructive",
          description: res.error.message,
        });
      }

      props.onSubmit?.(res.data[0]);
      toast({ title: "Successful" });
    } else {
      const res = await supabase
        .from("address")
        .update({
          street: draft.street,
          unit: draft.unit,
          zip: draft.zip,
          deleted: draft.deleted,
        })
        .eq("id", Number(props.init.id))
        .select();

      if (res.error) {
        return toast({
          variant: "destructive",
          title: res.error.code,
          description: res.error.message,
        });
      }

      props.onSubmit?.(res.data[0]);
      toast({ title: "Successful" });
    }
  });

  const onRemove = async () => {
    const supabase = createClientComponentClient();

    const res = await supabase
      .from("organization_address")
      .delete()
      .eq("address_id", Number(props.init.id))
      .select();

    props.onSubmit?.(res.data?.[0]);
    toast({ title: "Successful" });
  };

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
          <Button
            type="button"
            className="flex-1"
            variant="outline"
            onClick={props.onCancel}
          >
            Cancel
          </Button>
          {!!props?.init?.id && (
            <Button
              type="button"
              onClick={onRemove}
              className="flex-1"
              variant="destructive"
            >
              Remove
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
