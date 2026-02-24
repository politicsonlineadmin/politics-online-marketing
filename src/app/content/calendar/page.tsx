"use client";

import { useState } from "react";
import { AppShell } from "@/components/layout/app-shell";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { calendarEvents } from "@/lib/mock-data";
import type { CalendarEvent, Platform } from "@/lib/types";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Plus,
} from "lucide-react";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  addWeeks,
  subWeeks,
  getHours,
} from "date-fns";

const platformColorMap: Record<Platform, string> = {
  tiktok: "bg-tiktok text-navy-dark",
  instagram: "bg-instagram text-white",
  youtube: "bg-youtube text-white",
  brevo: "bg-brevo text-white",
};

const platformColorMuted: Record<Platform, string> = {
  tiktok: "bg-tiktok/40 text-navy-dark",
  instagram: "bg-instagram/40 text-white",
  youtube: "bg-youtube/40 text-white",
  brevo: "bg-brevo/40 text-white",
};

function getEventsForDate(date: Date): CalendarEvent[] {
  const dateStr = format(date, "yyyy-MM-dd");
  return calendarEvents.filter((event) => event.date === dateStr);
}

function EventPill({ event }: { event: CalendarEvent }) {
  const colorClass =
    event.status === "published"
      ? platformColorMuted[event.platform]
      : platformColorMap[event.platform];

  return (
    <div
      className={cn(
        "rounded-md px-1.5 py-0.5 text-[10px] font-medium leading-tight truncate cursor-default",
        colorClass
      )}
      title={`${event.title} (${event.time ?? "All day"}) - ${event.status}`}
    >
      {event.time && (
        <span className="font-semibold mr-0.5">{event.time}</span>
      )}
      {event.title.length > 22
        ? event.title.slice(0, 22) + "..."
        : event.title}
    </div>
  );
}

const HOURS = Array.from({ length: 16 }, (_, i) => i + 7); // 7am to 10pm

export default function ContentCalendarPage() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 1)); // Feb 2026
  const [view, setView] = useState<"month" | "week">("month");

  // Month view calculations
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calendarEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd,
  });

  // Week view calculations
  const weekStart = startOfWeek(currentDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(currentDate, { weekStartsOn: 1 });
  const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });

  function navigatePrev() {
    if (view === "month") {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  }

  function navigateNext() {
    if (view === "month") {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  }

  function goToToday() {
    setCurrentDate(new Date(2026, 1, 24)); // "Today" is Feb 24 2026
  }

  const headerLabel =
    view === "month"
      ? format(currentDate, "MMMM yyyy")
      : `${format(weekStart, "d MMM")} - ${format(weekEnd, "d MMM yyyy")}`;

  const dayHeaders = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return (
    <AppShell title="Content Calendar">
      <div className="space-y-4">
        {/* Toolbar */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Button variant="outline" size="sm" onClick={navigatePrev}>
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={navigateNext}>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            <h2 className="text-lg font-semibold text-navy">{headerLabel}</h2>
            <Button variant="ghost" size="sm" onClick={goToToday}>
              Today
            </Button>
          </div>

          <div className="flex items-center gap-2">
            {/* View toggle */}
            <div className="flex rounded-lg border border-border overflow-hidden">
              <button
                onClick={() => setView("month")}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium transition-colors",
                  view === "month"
                    ? "bg-navy text-white"
                    : "bg-white text-muted-foreground hover:bg-muted"
                )}
              >
                Month
              </button>
              <button
                onClick={() => setView("week")}
                className={cn(
                  "px-3 py-1.5 text-sm font-medium transition-colors",
                  view === "week"
                    ? "bg-navy text-white"
                    : "bg-white text-muted-foreground hover:bg-muted"
                )}
              >
                Week
              </button>
            </div>

            <Button size="sm" className="bg-navy hover:bg-navy-light text-white">
              <Plus className="h-4 w-4 mr-1" />
              New Post
            </Button>
          </div>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-tiktok" />
            TikTok
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-instagram" />
            Instagram
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-youtube" />
            YouTube
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-2.5 rounded-full bg-brevo" />
            Brevo
          </div>
          <div className="flex items-center gap-1.5 ml-4">
            <div className="h-2.5 w-6 rounded bg-navy/80" />
            Scheduled
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-2.5 w-6 rounded bg-navy/30" />
            Published
          </div>
        </div>

        {/* Calendar */}
        {view === "month" ? (
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-border">
            {/* Day headers */}
            <div className="grid grid-cols-7 border-b border-border">
              {dayHeaders.map((day) => (
                <div
                  key={day}
                  className="px-2 py-2.5 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wide bg-muted/30"
                >
                  {day}
                </div>
              ))}
            </div>

            {/* Calendar grid */}
            <div className="grid grid-cols-7">
              {calendarDays.map((day, idx) => {
                const events = getEventsForDate(day);
                const inCurrentMonth = isSameMonth(day, monthStart);
                const today = isToday(day) || isSameDay(day, new Date(2026, 1, 24));

                return (
                  <div
                    key={idx}
                    className={cn(
                      "min-h-[110px] border-b border-r border-border/50 p-1.5 transition-colors hover:bg-muted/20",
                      !inCurrentMonth && "bg-muted/10",
                      idx % 7 === 0 && "border-l-0"
                    )}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span
                        className={cn(
                          "text-xs font-medium",
                          !inCurrentMonth && "text-muted-foreground/40",
                          inCurrentMonth && "text-navy",
                          today &&
                            "bg-navy text-white rounded-full w-6 h-6 flex items-center justify-center text-[11px] font-bold"
                        )}
                      >
                        {format(day, "d")}
                      </span>
                    </div>

                    <div className="space-y-0.5 overflow-y-auto max-h-[80px]">
                      {events.map((event) => (
                        <EventPill key={event.id} event={event} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          /* Week view */
          <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-border">
            {/* Day headers */}
            <div className="grid grid-cols-[64px_repeat(7,1fr)] border-b border-border">
              <div className="bg-muted/30 border-r border-border" />
              {weekDays.map((day) => {
                const today = isToday(day) || isSameDay(day, new Date(2026, 1, 24));
                return (
                  <div
                    key={day.toISOString()}
                    className={cn(
                      "px-2 py-2.5 text-center border-r border-border/50 bg-muted/30",
                      today && "bg-navy/5"
                    )}
                  >
                    <div className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wide">
                      {format(day, "EEE")}
                    </div>
                    <div
                      className={cn(
                        "text-lg font-bold mt-0.5",
                        today ? "text-navy" : "text-foreground"
                      )}
                    >
                      {format(day, "d")}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Time grid */}
            <div className="grid grid-cols-[64px_repeat(7,1fr)] max-h-[600px] overflow-y-auto">
              {HOURS.map((hour) => (
                <div key={hour} className="contents">
                  {/* Time label */}
                  <div className="border-r border-b border-border/50 px-2 py-3 text-right">
                    <span className="text-[10px] text-muted-foreground font-medium">
                      {hour.toString().padStart(2, "0")}:00
                    </span>
                  </div>

                  {/* Day columns */}
                  {weekDays.map((day) => {
                    const events = getEventsForDate(day).filter((e) => {
                      if (!e.time) return hour === 9; // default to 9am
                      return parseInt(e.time.split(":")[0]) === hour;
                    });
                    const today =
                      isToday(day) || isSameDay(day, new Date(2026, 1, 24));

                    return (
                      <div
                        key={`${day.toISOString()}-${hour}`}
                        className={cn(
                          "border-r border-b border-border/50 p-1 min-h-[48px]",
                          today && "bg-navy/[0.02]"
                        )}
                      >
                        {events.map((event) => (
                          <div
                            key={event.id}
                            className={cn(
                              "rounded-md px-1.5 py-1 text-[10px] font-medium leading-tight mb-0.5",
                              event.status === "published"
                                ? platformColorMuted[event.platform]
                                : platformColorMap[event.platform]
                            )}
                            title={event.title}
                          >
                            <div className="font-semibold">
                              {event.time}
                            </div>
                            <div className="truncate">{event.title}</div>
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </AppShell>
  );
}
