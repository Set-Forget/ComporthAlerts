import React, { useState } from "react";
import { Column, Table } from "@tanstack/react-table";
import "react-datepicker/dist/react-datepicker.css";
import { Input } from "../ui/input";
import {  format } from "date-fns"
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

  const [date, setDate] = React.useState<DateRange | undefined>({
    from: undefined,
    to:   undefined,
  })

  const handleDateChange = (date: any | undefined) => {
    setDate(date)
    console.log(date);
    
    if (date?.from && date?.to) {
      const formattedStartDate = format(date.from, "MM/dd/yyyy");
      const formattedEndDate = format(date.to, "MM/dd/yyyy");
      const newFilterValue = [formattedStartDate, formattedEndDate];
      column.setFilterValue(newFilterValue);
    }
  }
  

  if (column.id === "investigationcompleted") {
    return (
      
      <Popover >
        <PopoverTrigger asChild>
          <Button
            id="date"
            
            variant={"outline"}
            className={cn(
              "w-auto justify-start text-left font-normal h-8",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "MM/dd/yyyy")} {" "}
                  {format(date.to, "MM/dd/yyyy")}
                </>
              ) : (
                format(date.from, "MM/dd/yyyy")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
              
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={handleDateChange}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
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