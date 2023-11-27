"use client";
import { AddressSelect } from "@/components/DataSelect";
import { Form, FormField } from "@/components/ui/form";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

type FORM = {
  label: string;
  value: string;
  address: string;
  addressobjectid: string;
  zip: string;
  unit_num: string | null;
};

export const OrganizationAddressForm = (props: {
  orgId: number;
  onSubmit: () => void;
}) => {
  const { toast } = useToast();
  const form = useForm<{ location: FORM }>({
    defaultValues: {
      location: {
        label: "",
        value: "",
        address: "",
        addressobjectid: "",
        zip: "",
        unit_num: "",
      },
    },
  });

  const onSubmit = form.handleSubmit(async (draft) => {
    const supabase = createClientComponentClient();
    const exists = await supabase
      .from("address")
      .select("*")
      .eq("external_id", draft.location.addressobjectid)
      .maybeSingle();

    if (exists.data) {
      await supabase.from("organization_address").insert([
        {
          organization_id: props.orgId,
          address_id: exists.data.id,
        },
      ]);
      toast({ title: "Successful" });
      return props.onSubmit();
    }

    const insertAddress = await supabase
      .from("address")
      .insert([
        {
          street: draft.location.address,
          zip: draft.location.zip,
          unit: draft.location.unit_num,
          external_id: draft.location.addressobjectid,
        },
      ])
      .select()
      .single();

    if (insertAddress.error) {
      return toast({
        variant: "destructive",
        title: insertAddress.error.message,
      });
    }

    await supabase.from("organization_address").insert([
      {
        organization_id: props.orgId,
        address_id: insertAddress.data.id,
      },
    ]);

    toast({ title: "Successful" });
    props.onSubmit();
  });

  const selectedLocation = form.watch("location");

  return (
    <Form {...form}>
      <form onSubmit={onSubmit} className="flex flex-col gap-2 p-2">
        <FormField
          control={form.control}
          name="location"
          render={({ field }) => {
            const { ref: _, ...rest } = field;
            return <AddressSelect {...rest} />;
          }}
        />

        {!!selectedLocation.addressobjectid && (
          <Card>
            <CardContent className="flex p-4 flex-col gap-4">
              <div className="flex-1 space-y-1">
                <p className="font-medium leading-none">Street</p>
                <p className="text-muted-foreground">
                  {selectedLocation.address}
                </p>
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium leading-none">Unit</p>
                <p className="text-muted-foreground">
                  {selectedLocation.unit_num || "--"}
                </p>
              </div>
              <div className="flex-1 space-y-1">
                <p className="font-medium leading-none">Zip Code</p>
                <p className="text-muted-foreground">
                  {selectedLocation.zip || "--"}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        <Button
          className="flex-1 mt-[100px]"
          disabled={!selectedLocation.addressobjectid}
          type="submit"
        >
          Add Location to Organization
        </Button>
      </form>
    </Form>
  );
};
