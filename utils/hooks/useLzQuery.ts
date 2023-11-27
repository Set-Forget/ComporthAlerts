import { Route } from "@/lib/routing";
import LZ from "lz-string";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { useMemo } from "react";

/**
 * useuseProjectTabsHash syncs a url query parameter with a given state.
 * LZ is a library which can compresses JSON into a uri string
 * and can decompresses JSON strings into state objects
 */
export const useLzQuery = <T>(props: {
  key: string;
  initValue?: T;
  baseURL?: Route;
}) => {
  const router = useRouter();

  const pathname = usePathname();
  const params = useSearchParams();
  const query = params.get(props.key) as string;

  const state: T = useMemo(() => {
    if (!query) return props.initValue;

    const decompress = LZ.decompressFromEncodedURIComponent(query);
    if (!decompress) return props.initValue;

    try {
      return JSON.parse(decompress);
    } catch (e) {
      return props.initValue;
    }
  }, [query]);

  const onSet = (
    arg: Partial<T> | ((arg: T) => Partial<T>),
    id?: number | string
  ) => {
    const val = (() => {
      if (typeof arg !== "function") return { ...state, ...arg };
      return { ...state, ...arg(state) };
    })();

    const compressedValue = LZ.compressToEncodedURIComponent(
      JSON.stringify(val)
    );

    const _params = new URLSearchParams();
    _params.set(props.key, compressedValue);

    router.push(`${props.baseURL || pathname}?${_params.toString()}`);
  };

  const onClear = () => {
    // const { [props.key]: _, ...restQuery } = query;
  };

  return { state, onSet, onClear };
};
