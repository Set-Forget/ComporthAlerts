"use client";

import { Form, FormField } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { RHFSlot } from "@/components/CRUD/slot";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  init?: any;
  onSubmit?: () => void;
}

const initialize = (init?: any) => {
  return {
    name: init?.name || "",
    email: init?.email || "",
    phone: init?.phone || "",
  };
};

export const OrganizationForm = (props: Props) => {
  const { toast } = useToast();
  const form = useForm<{ name: string; phone: string; email: string }>({
    defaultValues: initialize(props.init),
  });

  const onSubmit = form.handleSubmit(async (draft) => {
    const supabase = createClientComponentClient();

    if (!props.init) {
      const res = await supabase
        .from("organization")
        .insert([{ name: draft.name, phone: draft.phone, email: draft.email }]);

      if (res.error) {
        return toast({
          title: res.error.code,
          variant: "destructive",
          description: res.error.message,
        });
      }
    } else {
      const res = await supabase
        .from("organization")
        .update({ name: draft.name, phone: draft.phone, email: draft.email })
        .eq("id", Number(props.init.id));

      if (res.error) {
        return toast({
          variant: "destructive",
          title: res.error.code,
          description: res.error.message,
        });
      }
    }

    toast({ title: "Successful" });
    props.onSubmit?.();
  });

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 p-2">
        <FormField
          control={form.control}
          name="name"
          render={RHFSlot({
            label: "Name",
            rhf: "Input",
          })}
        />

        <FormField
          control={form.control}
          name="email"
          render={RHFSlot({
            label: "Email",
            placeholder: "enter email",
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
        <div className="flex gap-2 items-center mt-6">
          <Button className="flex-1" type="submit">
            Submit
          </Button>
          <Button className="flex-1" variant="outline">
            Cancel
          </Button>
          {!!props?.init?.id && (
            <Button className="flex-1" variant="destructive">
              Delete
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
