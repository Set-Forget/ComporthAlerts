"use client";

import { Form, FormField } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { RHFSlot } from "@/components/CRUD/slot";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  init?: any;
  onSubmit?: (data?: any) => void;
  onCancel: () => void;
}

const initialize = (init?: any) => {
  return {
    full_name: init?.full_name || "",
    email: init?.email || "",
    phone: init?.phone || "",
    role: init?.role || "",
  };
};

export const UserForm = (props: Props) => {
  const { toast } = useToast();
  const form = useForm<{
    full_name: string;
    email: string;
    phone: string;
    role: string;
  }>({
    defaultValues: initialize(props.init),
  });

  const onSubmit = form.handleSubmit(async (draft) => {
    const supabase = createClientComponentClient();
    if (!props.init) {
      const res = await supabase
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
        .from("account")
        .update({
          full_name: draft.full_name,
          email: draft.email,
          phone: draft.phone,
          role: draft.role,
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

  const onDelete = async () => {
    const supabase = createClientComponentClient();
    const res = await supabase
      .from("account")
      .update({
        deleted: true,
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
    // props.onSubmit?.(res.data[0]);
    toast({ title: "Successful" });
  };

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 p-2">
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
          <Button onClick={props.onCancel} className="flex-1" variant="outline">
            Cancel
          </Button>
          {!!props?.init?.id && (
            <Button onClick={onDelete} className="flex-1" variant="destructive">
              Delete
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
};
