import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Select from "react-select/async";
import useSWR from "swr";
import LZ from "lz-string";

import { useEffect, useState, useRef } from "react";

export function useDebounce<A extends any[]>(
  callback: (...args: A) => void,
  wait: number
) {
  // track args & timeout handle between calls
  const argsRef = useRef<A>();
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  function cleanup() {
    if (!timeout.current) return;
    clearTimeout(timeout.current);
  }

  // make sure our timeout gets cleared if
  useEffect(() => cleanup, []);

  return function debouncedCallback(...args: A) {
    // capture latest args
    argsRef.current = args;

    // clear debounce timer
    cleanup();

    // start waiting again
    timeout.current = setTimeout(() => {
      if (!argsRef.current) return;
      callback(...argsRef.current);
    }, wait);
  };
}

export const AddressSelect = (props: any) => {
  const onLoadOptions = useDebounce(async (input, callback) => {
    console.log(input);
    const query = LZ.compressToEncodedURIComponent(
      `SELECT address,addressobjectid,zip,unit_num
      FROM comporth.comporth_ds.aux_incidents
      WHERE SEARCH((address, zip), '${input}', analyzer=>'PATTERN_ANALYZER')
      GROUP BY address,addressobjectid,zip,unit_num`
    );
    const data = await (await fetch(`/api/google/bigquery?q=${query}`)).json();
    callback(
      data.map((s: any) => ({
        label: s.address,
        value: s.addressobjectid,
        ...s,
      }))
    );
  }, 500);

  return <Select {...props} loadOptions={onLoadOptions} />;
};
