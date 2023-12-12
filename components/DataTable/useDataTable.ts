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
  getPaginationRowModel,
} from "@tanstack/react-table";
import { useRef, useState } from "react";
import { Props } from "./DataTable";
import { fuzzyFilter, dateFilter } from "./utils";


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
    getPaginationRowModel: getPaginationRowModel(),
  });

  const tableEntries = table.getRowModel();

  const applyFilter = (columnId: string, filterValue: string | [Date, Date]) => {
    return tableEntries.rows.filter((row) => {
      if (filterValue instanceof Array) {
        // Handle date filter
        return dateFilter(row, columnId, filterValue);
      } else {
        // Handle other filters
        const cellValue = row.original[columnId]?.toString() || '';
        console.log('Filter:', filterValue);
        console.log('CellValue:', cellValue);
        return filterValue ? cellValue.includes(filterValue) : true;
      }
    });
  };


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
    applyFilter,
  };
};
