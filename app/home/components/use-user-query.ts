import { useLzQuery } from "@/utils/hooks";

export const useUserQuery = () => {
  return useLzQuery<{
    data: any;
    type: "CREATE" | "";
  }>({
    key: "crud",
    initValue: {
      type: "",
      data: null,
    },
  });
};
