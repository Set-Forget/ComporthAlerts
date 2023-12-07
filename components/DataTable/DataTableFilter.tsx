"use client";
import { Column, Table } from "@tanstack/react-table";
import { useMemo, useState } from "react";
import { parse, isValid } from "date-fns";
import { Input } from "../ui/input";
import { DateRangePicker, FocusedInputShape } from "react-dates";
import React from "react";



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

  const [focusedInput, setFocusedInput] = useState<FocusedInputShape | null>(null);

  const handleDatesChange = ({ startDate, endDate }: { startDate: any; endDate: any }) => {
    column.setFilterValue(() => [startDate, endDate]);
  };

  const sortedUniqueValues = useMemo(
    () =>
      typeof firstValue === "number"
        ? []
        : Array.from(column.getFacetedUniqueValues().keys()).sort(),
    [column.getFacetedUniqueValues()]
  );
   
    
  if (false) {
    const [from, to] = (columnFilterValue as [any, any]) || [undefined, undefined];

    return (
      <div className="flex gap-2">
        <DateRangePicker
          startDate={from}
          endDate={to}
          onDatesChange={handleDatesChange}
          focusedInput={focusedInput}
          onFocusChange={(focusedInput) => setFocusedInput(focusedInput)}
          showClearDates
          small
          withPortal
          displayFormat="MM/DD/YYYY"
          startDateId={`startDate-${column.id}`}
          endDateId={`endDate-${column.id}`}
        />
      </div>
    );
  }


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
