"use client";

import { useState } from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const formatDate = (date: Date): string => {
  const day = format(date, 'do');
  const month = format(date, 'MMM');
  const year = format(date, 'yyyy');
  return `${day} ${month} ${year}`;
};

interface CalendarSelectorProps {
  selectedDate: Date;
  onDateChange?: (date: Date) => void;
}

export function CalendarSelector({ selectedDate, onDateChange }: CalendarSelectorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" className="w-[240px] justify-start text-left font-normal">
          <CalendarIcon className="mr-2 h-4 w-4" />
          {formatDate(selectedDate)}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => {
            if (date && onDateChange) {
              onDateChange(date);
            }
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}