import { useLzQuery } from "@/utils/hooks";

export const useOrganizationQuery = () => {
  return useLzQuery<{
    data: any;
    type: "CREATE" | "READ" | "";
  }>({
    key: "crud",
    initValue: {
      type: "",
      data: null,
    },
  });
};
