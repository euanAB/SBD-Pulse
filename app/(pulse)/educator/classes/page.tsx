"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, MapPin, Users, Clock, Eye, FileText } from "lucide-react"
import Link from "next/link"

const CLASSES = [
  {
    id: "CLS-2025-001",
    title: "First Aid Level 1 - Morning Session",
    course: "First Aid Level 1",
    startDate: "2025-01-15",
    endDate: "2025-01-17",
    startTime: "09:00",
    endTime: "17:00",
    location: "Training Room A, London Centre",
    status: "teaching",
    studentsEnrolled: 8,
    maxStudents: 12,
    sessions: 3,
    completedSessions: 1,
    nextSession: "2025-01-16",
  },
  {
    id: "CLS-2025-002",
    title: "CPR Essentials - Evening",
    course: "CPR Essentials",
    startDate: "2025-01-20",
    endDate: "2025-01-22",
    startTime: "18:00",
    endTime: "21:00",
    location: "Training Room B, Manchester Centre",
    status: "upcoming",
    studentsEnrolled: 6,
    maxStudents: 10,
    sessions: 3,
    completedSessions: 0,
    nextSession: "2025-01-20",
  },
  {
    id: "CLS-2024-045",
    title: "First Aid Level 2 - Weekend",
    course: "First Aid Level 2",
    startDate: "2024-12-14",
    endDate: "2024-12-15",
    startTime: "09:00",
    endTime: "17:00",
    location: "Training Room A, London Centre",
    status: "completed",
    studentsEnrolled: 10,
    maxStudents: 12,
    sessions: 2,
    completedSessions: 2,
    nextSession: null,
  },
]

export default function EducatorClassesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">My Classes</h1>
          <p className="text-muted-foreground">Manage your teaching schedule and class details</p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Classes</p>
                <p className="text-2xl font-bold">
                  {CLASSES.filter((c) => c.status === "teaching" || c.status === "upcoming").length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">
                  {CLASSES.filter((c) => c.status === "teaching" || c.status === "upcoming").reduce(
                    (sum, c) => sum + c.studentsEnrolled,
                    0,
                  )}
                </p>
              </div>
              <Users className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed Classes</p>
                <p className="text-2xl font-bold">{CLASSES.filter((c) => c.status === "completed").length}</p>
              </div>
              <FileText className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Next Session</p>
                <p className="text-lg font-bold">
                  {CLASSES.find((c) => c.status === "teaching")?.nextSession
                    ? new Date(CLASSES.find((c) => c.status === "teaching")!.nextSession!).toLocaleDateString("en-GB")
                    : "None"}
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Classes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Class Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Class Details</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Location</TableHead>
                <TableHead>Students</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {CLASSES.map((classItem) => (
                <TableRow key={classItem.id}>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{classItem.title}</div>
                      <div className="text-sm text-muted-foreground">{classItem.course}</div>
                      <div className="text-xs text-muted-foreground">ID: {classItem.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Calendar className="h-3 w-3" />
                        {new Date(classItem.startDate).toLocaleDateString("en-GB")} -{" "}
                        {new Date(classItem.endDate).toLocaleDateString("en-GB")}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {classItem.startTime} - {classItem.endTime}
                      </div>
                      {classItem.nextSession && (
                        <div className="text-xs text-blue-600 font-medium">
                          Next: {new Date(classItem.nextSession).toLocaleDateString("en-GB")}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-sm">
                      <MapPin className="h-3 w-3" />
                      {classItem.location}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Users className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {classItem.studentsEnrolled}/{classItem.maxStudents}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="text-sm">
                        {classItem.completedSessions}/{classItem.sessions} sessions
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{
                            width: `${(classItem.completedSessions / classItem.sessions) * 100}%`,
                          }}
                        />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        classItem.status === "teaching"
                          ? "default"
                          : classItem.status === "upcoming"
                            ? "secondary"
                            : classItem.status === "completed"
                              ? "outline"
                              : "destructive"
                      }
                    >
                      {classItem.status === "teaching"
                        ? "Teaching"
                        : classItem.status === "upcoming"
                          ? "Upcoming"
                          : classItem.status === "completed"
                            ? "Completed"
                            : classItem.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm" asChild>
                        <Link href={`/educator/classes/${classItem.id}`}>
                          <Eye className="h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
