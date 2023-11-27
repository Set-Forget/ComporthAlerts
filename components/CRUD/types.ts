import { ReactElement } from "react";
import { RegisterOptions } from "react-hook-form";
import { InputProps } from "../ui/input";
import { TextareaProps } from "../ui/textarea";
import { RadioProps } from "@radix-ui/react-radio-group";

export type RHFSlotProps = {
  name: string;
  label?: ReactElement | string;
  labelStyling?: string;
  groupNamePrefix?: string;
  description?: ReactElement | string;
  rules?: RegisterOptions;
} & {
  [K in keyof RHFComponentMap]: {
    rhf: K;
    props?: RHFComponentMap[K];
    fields?: K extends "FieldArray"
      ? RHFSlotProps[]
      : K extends "FieldGroup"
      ? RHFSlotProps[]
      : never;
  };
}[keyof RHFComponentMap];

export type RHFOption = {
  label: string;
  value: any;
};

export type RHFComponentMap = {
  Input: InputProps & {
    label?: ReactElement | string;
    description?: ReactElement | string;
  };
  Textarea: TextareaProps;
  Switch: any;
  Select: {
    options: RHFOption[];
  };
  Radio: RadioProps & {
    options: RHFOption[];
  };
  Checkbox: {
    options: RHFOption[];
  };
};
