"use client";
import { Column, Table } from "@tanstack/react-table";
import { useMemo } from "react";
import { parse, isValid } from "date-fns";
import { Input } from "../ui/input";

function isValidDate(dateString: any) {
  const parsedDate = parse(dateString, "MM/dd/yyyy @ hh:mm a", new Date());
  return isValid(parsedDate);
}

export function DataTableFilter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id);

  const columnFilterValue = column.getFilterValue();

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );

  //   if (isValidDate(firstValue) && isNaN(Number(firstValue))) {
  //     const [from, to] = (columnFilterValue as [any, any]) || [
  //       undefined,
  //       undefined,
  //     ];
  //     return (
  //       <Flex gap={2} width={230} fontFamily="body">
  //         <DatePicker
  //           value={{ from, to }}
  //           inputProps={{ size: "sm", placeholder: "start date" }}
  //           mode="range"
  //           onClear={() =>
  //             column.setFilterValue(() => {
  //               return [undefined, undefined];
  //             })
  //           }
  //           onChange={(date: any) => {
  //             column.setFilterValue(() => {
  //               return [date?.from, date?.to];
  //             });
  //           }}
  //         />
  //       </Flex>
  //     );
  //   }

  if (typeof firstValue === "number") {
    return (
      <div className="flex gap-2">
        <Input
          className="h-[30px]"
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[0] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [value, old?.[1]])
          }
          placeholder={`Min ${
            column.getFacetedMinMaxValues()?.[0]
              ? `(${column.getFacetedMinMaxValues()?.[0]})`
              : ""
          }`}
        />
        <Input
          className="h-[30px]"
          type="number"
          min={Number(column.getFacetedMinMaxValues()?.[0] ?? "")}
          max={Number(column.getFacetedMinMaxValues()?.[1] ?? "")}
          value={(columnFilterValue as [number, number])?.[1] ?? ""}
          onChange={(value) =>
            column.setFilterValue((old: [number, number]) => [old?.[0], value])
          }
          placeholder={`Max ${
            column.getFacetedMinMaxValues()?.[1]
              ? `(${column.getFacetedMinMaxValues()?.[1]})`
              : ""
          }`}
        />
      </div>
    );
  }

  return (
    <>
      <datalist id={column.id + "list"}>
        {sortedUniqueValues.slice(0, 5000).map((value: string, index) => (
          <option value={value} key={`${value}-${index}`} />
        ))}
      </datalist>
      <Input
        className="h-[30px]"
        value={(columnFilterValue ?? "") as string}
        onChange={(e) => column.setFilterValue(e.target.value)}
        placeholder="search"
        list={column.id + "list"}
      />
    </>
  );
}
