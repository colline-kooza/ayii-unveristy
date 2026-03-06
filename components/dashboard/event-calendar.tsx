"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function EventCalendar() {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const numDays = daysInMonth(year, month);
  const firstDay = firstDayOfMonth(year, month);

  const days = [];
  for (let i = 0; i < firstDay; i++) {
    days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
  }

  for (let i = 1; i <= numDays; i++) {
    const isToday = 
      i === new Date().getDate() && 
      month === new Date().getMonth() && 
      year === new Date().getFullYear();

    days.push(
      <div
        key={i}
        className={cn(
          "h-8 w-8 flex items-center justify-center rounded-full text-xs transition-colors cursor-pointer",
          isToday ? "bg-primary text-primary-foreground font-bold" : "hover:bg-primary/10"
        )}
      >
        {i}
      </div>
    );
  }

  const events = [
    { id: 1, title: "Staff Meeting", time: "09:00 AM", color: "bg-red-500" },
    { id: 2, title: "Parents Day", time: "02:00 PM", color: "bg-orange-500" },
    { id: 3, title: "Exam Prep", time: "10:30 AM", color: "bg-green-500" },
  ];

  return (
    <Card className="shadow-sm border-none bg-white">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-bold flex items-center gap-2">
          <CalendarIcon className="h-4 w-4 text-primary" />
          Event Calendar
        </CardTitle>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={prevMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={nextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-center mb-4">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
            {monthNames[month]} {year}
          </span>
        </div>
        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {["S", "M", "T", "W", "T", "F", "S"].map((d) => (
            <span key={d} className="text-[10px] font-bold text-muted-foreground uppercase">
              {d}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1 h-fit">
          {days}
        </div>

        <div className="mt-6 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Upcoming Events</h4>
          {events.map((event) => (
            <div key={event.id} className="flex items-center gap-3 p-2 rounded-lg bg-gray-50 border border-gray-100 hover:border-primary/20 transition-colors">
              <div className={cn("w-1 h-8 rounded-full", event.color)} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">{event.title}</p>
                <p className="text-[10px] text-muted-foreground">{event.time}</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
