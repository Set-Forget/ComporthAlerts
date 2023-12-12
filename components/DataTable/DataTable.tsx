"use client";

import { ArrowDown, ArrowUp } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ColumnDef, flexRender, Row, getPaginationRowModel } from "@tanstack/react-table";
import { useDataTable } from "./useDataTable";
import { DataTableFilter } from "./DataTableFilter";
import { useState } from "react";
import { Button } from "@/components/ui/button"
import { DataTablePagination } from "./DataTablePagination";

export interface Props {
  headers: ColumnDef<any>[];
  data: any[];
  rowIcon?: (data: any) => JSX.Element;
}

// const handleRefreshData = () => {
//   // Borra los datos almacenados en localStorage
//   localStorage.removeItem("incidents");
//   // Recarga la página para obtener datos actualizados
//   window.location.reload();
// };

export const DataTable = (props: Props) => {
  const hook = useDataTable(props);


  


  return (
    <div className="flex flex-col ">
      {/* <div>
        <button
          className=" bg-zinc-900 hover:bg-zinc-700 text-white font-bold py-2 px-4 rounded flex items-center space-x-2 justify-end"
          onClick={handleRefreshData}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="h-4 w-4"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M5 10l7-7m0 0l7 7m-7-7v18"
            />
          </svg>
          Refresh
        </button>
      </div> */}
      <div>
        <div ref={hook.tableContainerRef} className="">
          <Table className="w-[100%] ">
            <TableHeader className=" sticky z-50 top-0 ">
              {hook.table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {!!props.rowIcon && <TableHead className="w-[40px]" />}

                  {headerGroup.headers.map((header) => (
                    <TableHead
                      className="min-w-[100px] z-50 sticky top-0"
                      key={header.id}
                      colSpan={header.colSpan}
                    >
                      {header.isPlaceholder ? null : (
                        <div className="flex flex-col gap-1 pb-1 space-y-2  ">
                          <div
                            className="flex flex-row items-center  h-[45px]"
                            onClick={header.column.getToggleSortingHandler()}
                          >
                            {flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}

                            {{
                              asc: <ArrowUp size={16} />,
                              desc: <ArrowDown size={16} />,
                            }[header.column.getIsSorted() as string] ?? (
                                <ArrowUp className="opacity-0" />
                              )}
                          </div>
                          {header.column.getCanFilter() && (
                            <DataTableFilter
                              column={header.column}
                              table={hook.table}
                            />
                          )}
                        </div>
                      )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
            {hook.rows.map((VR, ri) => {
              const row = hook.rowModel[VR.index] as Row<any>;

              return (
                <TableRow
                  key={`${row.id}-${ri}`}
                  {...(row.original.deleted && { className: "opacity-[.5]" })}
                >
                  {!!props.rowIcon && (
                    <TableCell className="max-w-[30px]">
                      {props.rowIcon(row.original)}
                    </TableCell>
                  )}
                  {row.getVisibleCells().map((cell, ci) => {
                    return (
                      <TableCell key={`${cell.id}-${ri}-${ci}`}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
          </TableBody>
          </Table>
        </div>
        <DataTablePagination table={hook.table} />
          </div>
          </div>
           

  );
};
