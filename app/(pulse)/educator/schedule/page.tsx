"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, MapPin, Users, ChevronLeft, ChevronRight } from "lucide-react"

type ScheduleEvent = {
  id: string
  title: string
  type: "class" | "preparation" | "break"
  startTime: string
  endTime: string
  location?: string
  students?: number
  capacity?: number
  status: "confirmed" | "tentative" | "cancelled"
}

type DaySchedule = {
  date: string
  events: ScheduleEvent[]
}

const mockSchedule: DaySchedule[] = [
  {
    date: "2025-01-13",
    events: [
      {
        id: "E-001",
        title: "First Aid Level 2",
        type: "class",
        startTime: "09:00",
        endTime: "16:00",
        location: "Training Room A",
        students: 12,
        capacity: 15,
        status: "confirmed",
      },
    ],
  },
  {
    date: "2025-01-14",
    events: [
      {
        id: "E-002",
        title: "Course Preparation",
        type: "preparation",
        startTime: "10:00",
        endTime: "11:00",
        status: "confirmed",
      },
    ],
  },
  {
    date: "2025-01-15",
    events: [
      {
        id: "E-003",
        title: "Safeguarding Basics",
        type: "class",
        startTime: "10:00",
        endTime: "15:00",
        location: "Training Room B",
        students: 8,
        capacity: 12,
        status: "confirmed",
      },
    ],
  },
  {
    date: "2025-01-16",
    events: [],
  },
  {
    date: "2025-01-17",
    events: [
      {
        id: "E-004",
        title: "CPR Essentials",
        type: "class",
        startTime: "09:00",
        endTime: "13:00",
        location: "Training Room A",
        students: 6,
        capacity: 10,
        status: "tentative",
      },
    ],
  },
]

export default function EducatorSchedulePage() {
  const [currentWeek, setCurrentWeek] = React.useState(new Date())

  const getWeekDates = (date: Date) => {
    const week = []
    const startOfWeek = new Date(date)
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - day + (day === 0 ? -6 : 1) // Adjust for Monday start
    startOfWeek.setDate(diff)

    for (let i = 0; i < 7; i++) {
      const weekDate = new Date(startOfWeek)
      weekDate.setDate(startOfWeek.getDate() + i)
      week.push(weekDate)
    }
    return week
  }

  const weekDates = getWeekDates(currentWeek)

  const formatDate = (date: Date) => {
    return date.toISOString().split("T")[0]
  }

  const formatDisplayDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    })
  }

  const getDayName = (date: Date) => {
    return date.toLocaleDateString("en-GB", { weekday: "short" })
  }

  const getScheduleForDate = (date: Date): ScheduleEvent[] => {
    const dateStr = formatDate(date)
    const daySchedule = mockSchedule.find((d) => d.date === dateStr)
    return daySchedule?.events || []
  }

  const navigateWeek = (direction: "prev" | "next") => {
    const newWeek = new Date(currentWeek)
    newWeek.setDate(currentWeek.getDate() + (direction === "next" ? 7 : -7))
    setCurrentWeek(newWeek)
  }

  const getEventTypeColor = (type: ScheduleEvent["type"]) => {
    switch (type) {
      case "class":
        return "bg-blue-100 border-blue-200 text-blue-800"
      case "preparation":
        return "bg-green-100 border-green-200 text-green-800"
      case "break":
        return "bg-gray-100 border-gray-200 text-gray-800"
      default:
        return "bg-gray-100 border-gray-200 text-gray-800"
    }
  }

  const getStatusBadge = (status: ScheduleEvent["status"]) => {
    switch (status) {
      case "confirmed":
        return <Badge variant="secondary">Confirmed</Badge>
      case "tentative":
        return <Badge variant="outline">Tentative</Badge>
      case "cancelled":
        return <Badge variant="destructive">Cancelled</Badge>
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Schedule</h1>
          <p className="text-muted-foreground">View your weekly teaching schedule</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => navigateWeek("prev")}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <div className="text-sm font-medium px-4">
            {weekDates[0].toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
          </div>
          <Button variant="outline" size="sm" onClick={() => navigateWeek("next")}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Week Overview */}
      <div className="grid gap-4 md:grid-cols-7">
        {weekDates.map((date, index) => {
          const events = getScheduleForDate(date)
          const isToday = formatDate(date) === formatDate(new Date())

          return (
            <Card key={index} className={isToday ? "ring-2 ring-blue-500" : ""}>
              <CardHeader className="pb-2">
                <div className="text-center">
                  <div className="text-sm font-medium">{getDayName(date)}</div>
                  <div className={`text-lg font-bold ${isToday ? "text-blue-600" : ""}`}>{formatDisplayDate(date)}</div>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {events.length === 0 ? (
                  <div className="text-center text-sm text-muted-foreground py-4">No events</div>
                ) : (
                  events.map((event) => (
                    <div key={event.id} className={`rounded border p-2 text-xs ${getEventTypeColor(event.type)}`}>
                      <div className="font-medium">{event.title}</div>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="h-3 w-3" />
                        <span>
                          {event.startTime} - {event.endTime}
                        </span>
                      </div>
                      {event.location && (
                        <div className="flex items-center gap-1 mt-1">
                          <MapPin className="h-3 w-3" />
                          <span>{event.location}</span>
                        </div>
                      )}
                      {event.students && (
                        <div className="flex items-center gap-1 mt-1">
                          <Users className="h-3 w-3" />
                          <span>
                            {event.students}/{event.capacity}
                          </span>
                        </div>
                      )}
                      <div className="mt-1">{getStatusBadge(event.status)}</div>
                    </div>
                  ))
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle>Upcoming Events</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {mockSchedule
            .flatMap((day) => day.events.map((event) => ({ ...event, date: day.date })))
            .filter((event) => new Date(event.date) >= new Date())
            .slice(0, 5)
            .map((event) => (
              <div key={event.id} className="flex items-center justify-between rounded border p-4">
                <div className="space-y-1">
                  <div className="font-medium">{event.title}</div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(event.date).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                      })}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {event.startTime} - {event.endTime}
                    </span>
                    {event.location && (
                      <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {event.location}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {event.students && (
                    <div className="text-sm text-muted-foreground">
                      {event.students}/{event.capacity} students
                    </div>
                  )}
                  {getStatusBadge(event.status)}
                </div>
              </div>
            ))}
        </CardContent>
      </Card>
    </div>
  )
}
