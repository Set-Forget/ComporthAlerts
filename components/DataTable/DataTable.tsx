"use client";

import { ArrowDown, ArrowUp, EyeIcon } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { ColumnDef, flexRender, Row } from "@tanstack/react-table";
import { useDataTable } from "./useDataTable";
import { DataTableFilter } from "./DataTableFilter";

export interface Props {
  headers: ColumnDef<any>[];
  data: any[];
  rowIcon?: (data: any) => JSX.Element;
}

export const DataTable = (props: Props) => {
  const hook = useDataTable(props);

  return (
    <div ref={hook.tableContainerRef} className="z-50 sticky top-0">
      <Table className="w-[100%]">
        <TableHeader >
          {hook.table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {!!props.rowIcon && <TableHead className="w-[40px]" />}

              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    className="min-w-[100px] z-50 sticky top-0"
                    key={header.id}
                    colSpan={header.colSpan}
                  >
                    {header.isPlaceholder ? null : (
                      <div className="flex flex-col gap-1 pb-1">
                        <div
                          className="flex gap-2 items-center"
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
                );
              })}
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
  );
};
