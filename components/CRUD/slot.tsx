import { ControllerProps, FieldPath, FieldValues } from "react-hook-form";
import {
  FormControl,
  FormDescription,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { Checkbox } from "../ui/checkbox";
import { Switch } from "../ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";

export const RHFSlot = <
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
  rhf,
  label,
  description,
  props,
  labelStyling,
  ...rest
}: any & { control: any }): ControllerProps<TFieldValues, TName>["render"] =>
  function Slot({ field }) {
    return (
      <FormItem className="flex flex-col gap-1 py-2">
        {label && <FormLabel className={labelStyling}>{label}</FormLabel>}
        <FormControl>
          <>
            {/* ----------------------------------------------------------------------------- */}
            {rhf === "Input" &&
              (() => {
                const hops = props as any;
                return <Input {...hops} {...field} />;
              })()}

            {/* ----------------------------------------------------------------------------- */}
            {rhf === "Textarea" &&
              (() => {
                const hops = props as any;
                return <Textarea {...hops} {...field} />;
              })()}

            {/* ----------------------------------------------------------------------------- */}
            {rhf === "Switch" &&
              (() => {
                const hops = props as any;
                return <Switch {...hops} {...field} />;
              })()}

            {/* ----------------------------------------------------------------------------- */}
            {rhf === "Select" &&
              (() => {
                const hops = props as any;

                return (
                  <Select
                    {...hops}
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger {...hops}>
                      <SelectValue {...hops} />
                    </SelectTrigger>
                    <SelectContent className="overflow-auto max-h-60">
                      {hops.options.map((OPT: any) => (
                        <SelectItem key={`OPT-${OPT.value}`} value={OPT.value}>
                          {OPT.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                );
              })()}

            {/* ----------------------------------------------------------------------------- */}

            {/* ----------------------------------------------------------------------------- */}
            {rhf === "Checkbox" &&
              (() => {
                const hops = props as any;
                return (
                  <div className="flex flex-col gap-2">
                    {hops.options.map((OPT: any) => (
                      <div key={`CHECK-${OPT.value}`}>
                        <Checkbox
                          checked={field.value?.includes(OPT.value)}
                          onCheckedChange={(c) => {
                            const filtered =
                              field.value?.filter(
                                (f: unknown) => f !== OPT.value
                              ) || [];
                            if (!c) return field.onChange(filtered);
                            field.onChange([...filtered, OPT.value]);
                          }}
                        />
                      </div>
                    ))}
                  </div>
                );
              })()}

            {/* ----------------------------------------------------------------------------- */}
            {/* {rhf === "DatePicker" &&
              (() => {
                const hops = props as RHFComponentMap["DatePicker"];
                return (
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        {...hops}
                        selected={field.value}
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-ignore
                        onSelect={field.onChange}
                      />
                    </PopoverContent>
                  </Popover>
                );
              })()} */}
          </>
        </FormControl>
        {description && <FormDescription>{description}</FormDescription>}
        <FormMessage />
      </FormItem>
    );
  };
