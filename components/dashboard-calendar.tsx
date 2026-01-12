"use client";

import { useRouter } from "next/navigation";
import { CalendarSelector } from "./calendar-selector";

interface DashboardCalendarProps {
  selectedDate: Date;
}

export function DashboardCalendar({ selectedDate }: DashboardCalendarProps) {
  const router = useRouter();

  const handleDateChange = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    router.push(`/dashboard?date=${dateString}`);
    router.refresh();
  };

  return (
    <CalendarSelector
      selectedDate={selectedDate}
      onDateChange={handleDateChange}
    />
  );
}