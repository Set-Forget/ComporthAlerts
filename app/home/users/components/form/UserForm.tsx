"use client";

import { Form, FormField } from "@/components/ui/form";

import { useForm } from "react-hook-form";
import { RHFSlot } from "@/components/CRUD/slot";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useEffect, useState } from "react";
import useSWR, { mutate } from "swr";

interface Props {
  init?: any;
  onSubmit?: (data?: any) => void;
}

const initialize = (init?: any) => {
  return {
    full_name: init?.full_name || "",
    email: init?.email || "",
    phone: init?.phone || "",
    role: init?.role || "pending",
    organization: init?.organization_id || null,
    send_email: init?.send_email ? "TRUE" : "FALSE",
    send_sms: init?.send_sms ? "TRUE" : "FALSE",
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
    send_email: string;
    send_sms: string;
  }>({
    defaultValues: initialize(props.init),
  });

  const [isClearable, setIsClearable] = useState(true);
  const [isSearchable, setIsSearchable] = useState(true);
  const [isDisabled, setIsDisabled] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isRtl, setIsRtl] = useState(false);

  const [role, setUserRole] = useState<string>("");

  const [organizations, setOrganizations] = useState<{ name: any }[]>([]);
  const [selectedOrganization, setSelectedOrganization] =
    useState<SelectOption | null>(null);

  interface SelectOption {
    label: string;
    value: string;
  }

  useEffect(() => {
    const fetchUserRole = async () => {
      const supabaseClient = createClientComponentClient();
      try {
        const userEmail = (await supabaseClient.auth.getSession()).data.session
          ?.user.email;
        if (userEmail) {
          const { data, error } = await supabaseClient
            .from("account")
            .select("role")
            .eq("email", userEmail)
            .single();

          if (error) throw error;
          setUserRole(data?.role);
        }
      } catch (error) {
        console.error("Error fetching user role:", error);
      }
    };

    fetchUserRole();
  }, []);

  const onSubmit = form.handleSubmit(async (draft) => {
    const supabase = createClientComponentClient();
    const sendEmailBoolean = draft.send_email === "TRUE";
    const sendSmsBoolean = draft.send_sms === "TRUE";
    if (!props.init) {
      const resUser = await supabase
        .from("account")
        .insert([
          {
            full_name: draft.full_name,
            email: draft.email,
            phone: draft.phone,
            role: draft.role,
            send_email: sendEmailBoolean,
            send_sms: sendSmsBoolean,
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
        mutate("account");
        toast({ title: "Successful" });
            }
    } else if (props.init) {
      const { data, error } = await supabase
        .from("account")
        .update({
          full_name: draft.full_name,
          email: draft.email,
          phone: draft.phone,
          role: draft.role,
          send_email: sendEmailBoolean,
          send_sms: sendSmsBoolean,
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
        mutate("account");
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

        {role === "admin" && (
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
                  {
                    label: "Pending",
                    value: "pending",
                  },
                ],
              },
            })}
          />
        )}

        <FormField
          control={form.control}
          name="send_email"
          render={RHFSlot({
            label: "Send Email",
            rhf: "Select",
            props: {
              options: [
                { label: "True", value: "TRUE" },
                { label: "False", value: "FALSE" },
              ],
            },
          })}
        />

        <FormField
          control={form.control}
          name="send_sms"
          render={RHFSlot({
            label: "Send SMS",
            rhf: "Select",
            props: {
              options: [
                { label: "True", value: "TRUE" },
                { label: "False", value: "FALSE" },
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
