import React, { useState } from "react";
import { Column, Table } from "@tanstack/react-table";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "../ui/input";
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"
 
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"


export function DataTableFilter({
  column,
  table,
}: {
  column: Column<any, unknown>;
  table: Table<any>;
}) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  

  const updateFilter = (start: Date | null, end: Date | null) => {
    let newFilterValue = null;
    
    if (start && end) {
      console.log("start" + start.toISOString());
      console.log("end" + end.toISOString());
      const formattedStartDate = format(start, "MM/dd/yyyy");
      const formattedEndDate = format(end, "MM/dd/yyyy");
      newFilterValue = [formattedStartDate, formattedEndDate];

      // Aplicar el filtro a la columna de la tabla
      column.setFilterValue(newFilterValue);
    }
  };

  const columnFilterValue = column.getFilterValue();

  const handleStartDateChange = (date: Date | null) => {
    setStartDate(date);
    updateFilter(date, endDate);
  };
  const handleEndDateChange = (date: Date | null) => {
    setEndDate(date);
    updateFilter(startDate, date);
  };

if (column.id === "investigationcompleted") {
  return (
    <>
    <div className=" space-y-2 flex flex-col ">
      <DatePicker
        selected={startDate}
        onChange={handleStartDateChange}
        selectsStart
        startDate={startDate}
        endDate={endDate}
        dateFormat="yyyy-MM-dd"
        className="border rounded p-2"
      />
      <DatePicker
        selected={endDate}
        onChange={handleEndDateChange}
        selectsEnd
        startDate={startDate}
        endDate={endDate}
        minDate={startDate}
        dateFormat="yyyy-MM-dd"
        className="border rounded p-2"
      />
    </div>
  </>
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