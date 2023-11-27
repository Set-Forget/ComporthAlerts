import { useVirtual } from "react-virtual";
import {
  getCoreRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
  ColumnFiltersState,
  getFilteredRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFacetedMinMaxValues,
} from "@tanstack/react-table";
import { useRef, useState } from "react";
import { Props } from "./DataTable";
import { fuzzyFilter } from "./utils";

export const useDataTable = (props: Props) => {
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [sorting, setSorting] = useState<SortingState>([]);
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data: props.data || [],
    columns: props.headers,
    filterFns: { fuzzy: fuzzyFilter },
    state: { sorting, columnFilters },
    globalFilterFn: fuzzyFilter,
    onColumnFiltersChange: setColumnFilters,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFacetedMinMaxValues: getFacetedMinMaxValues(),
  });

  const tableEntries = table.getRowModel();

  const virtualizer = useVirtual({
    parentRef: tableContainerRef,
    size: tableEntries.rows.length,
    overscan: 100,
  });

  return {
    table,
    rows: virtualizer.virtualItems,
    rowModel: tableEntries.rows,
    tableContainerRef,
    headers: props.headers,
  };
};
