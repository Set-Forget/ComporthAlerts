import { useLzQuery } from "@/utils/hooks";

export const useAddressQuery = () => {
  return useLzQuery<{
    data: any;
    type: "CREATE" | "READ" | "" ;
  }>({
    key: "crud",
    initValue: {
      type: "",
      data: null,
    },
  });
};
