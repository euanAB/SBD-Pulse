"use client"

import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Users, BookOpen, CheckCircle, AlertCircle, Mail } from "lucide-react"
import Link from "next/link"

type StudentStatus = "active" | "completed" | "dropped" | "overdue"

type Student = {
  id: string
  name: string
  email: string
  phone: string
  avatar?: string
  courses: {
    id: string
    title: string
    progress: number
    status: StudentStatus
    grade?: string
    lastActivity: string
  }[]
  totalCourses: number
  completedCourses: number
  overallProgress: number
  joinDate: string
  lastLogin: string
}

const mockStudents: Student[] = [
  {
    id: "STU-001",
    name: "Alex Johnson",
    email: "alex.johnson@email.com",
    phone: "+44 7123 456789",
    avatar: "/placeholder.svg?height=40&width=40",
    courses: [
      {
        id: "C-079",
        title: "First Aid Level 2",
        progress: 75,
        status: "active",
        lastActivity: "2025-01-12",
      },
      {
        id: "C-087",
        title: "Safeguarding Basics",
        progress: 100,
        status: "completed",
        grade: "Pass",
        lastActivity: "2024-12-20",
      },
    ],
    totalCourses: 2,
    completedCourses: 1,
    overallProgress: 87,
    joinDate: "2024-11-01",
    lastLogin: "2025-01-12",
  },
  {
    id: "STU-002",
    name: "Sarah Williams",
    email: "sarah.williams@email.com",
    phone: "+44 7234 567890",
    avatar: "/placeholder.svg?height=40&width=40",
    courses: [
      {
        id: "C-079",
        title: "First Aid Level 2",
        progress: 45,
        status: "active",
        lastActivity: "2025-01-10",
      },
    ],
    totalCourses: 1,
    completedCourses: 0,
    overallProgress: 45,
    joinDate: "2024-12-15",
    lastLogin: "2025-01-10",
  },
  {
    id: "STU-003",
    name: "Michael Brown",
    email: "michael.brown@email.com",
    phone: "+44 7345 678901",
    avatar: "/placeholder.svg?height=40&width=40",
    courses: [
      {
        id: "C-087",
        title: "Safeguarding Basics",
        progress: 20,
        status: "overdue",
        lastActivity: "2024-12-01",
      },
    ],
    totalCourses: 1,
    completedCourses: 0,
    overallProgress: 20,
    joinDate: "2024-11-20",
    lastLogin: "2024-12-05",
  },
  {
    id: "STU-004",
    name: "Emma Davis",
    email: "emma.davis@email.com",
    phone: "+44 7456 789012",
    avatar: "/placeholder.svg?height=40&width=40",
    courses: [
      {
        id: "C-079",
        title: "First Aid Level 2",
        progress: 100,
        status: "completed",
        grade: "Pass",
        lastActivity: "2024-12-18",
      },
      {
        id: "C-087",
        title: "Safeguarding Basics",
        progress: 100,
        status: "completed",
        grade: "Pass",
        lastActivity: "2024-11-30",
      },
    ],
    totalCourses: 2,
    completedCourses: 2,
    overallProgress: 100,
    joinDate: "2024-10-01",
    lastLogin: "2024-12-20",
  },
]

const statusConfig: Record<
  StudentStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }
> = {
  active: { label: "Active", variant: "default", color: "text-blue-600" },
  completed: { label: "Completed", variant: "secondary", color: "text-green-600" },
  dropped: { label: "Dropped", variant: "destructive", color: "text-red-600" },
  overdue: { label: "Overdue", variant: "outline", color: "text-orange-600" },
}

export default function EducatorStudentsPage() {
  const [students, setStudents] = React.useState(mockStudents)
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState("")

  // Filter students
  const filteredStudents = React.useMemo(() => {
    return students.filter((student) => {
      const matchesSearch =
        searchQuery === "" ||
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.id.toLowerCase().includes(searchQuery.toLowerCase())

      const hasStatusMatch = statusFilter === "all" || student.courses.some((course) => course.status === statusFilter)

      return matchesSearch && hasStatusMatch
    })
  }, [students, statusFilter, searchQuery])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getStudentStatus = (student: Student): StudentStatus => {
    if (student.courses.some((c) => c.status === "overdue")) return "overdue"
    if (student.courses.every((c) => c.status === "completed")) return "completed"
    if (student.courses.some((c) => c.status === "active")) return "active"
    return "dropped"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">My Students</h1>
        <p className="text-muted-foreground">Track student progress across all your classes</p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">{students.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active</p>
                <p className="text-2xl font-bold">{students.filter((s) => getStudentStatus(s) === "active").length}</p>
              </div>
              <BookOpen className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">
                  {students.filter((s) => getStudentStatus(s) === "completed").length}
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Need Attention</p>
                <p className="text-2xl font-bold">{students.filter((s) => getStudentStatus(s) === "overdue").length}</p>
              </div>
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="overdue">Need Attention</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student</TableHead>
                <TableHead>Courses</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Last Activity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredStudents.map((student) => {
                const studentStatus = getStudentStatus(student)
                const activeCourse = student.courses.find((c) => c.status === "active")
                const lastActivity = Math.max(...student.courses.map((c) => new Date(c.lastActivity).getTime()))

                return (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={student.avatar || "/placeholder.svg"} alt={student.name} />
                          <AvatarFallback>
                            {student.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.id}</div>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Mail className="h-3 w-3" />
                            <span>{student.email}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {student.totalCourses} course{student.totalCourses !== 1 ? "s" : ""}
                        </div>
                        <div className="text-sm text-muted-foreground">{student.completedCourses} completed</div>
                        {activeCourse && <div className="text-xs text-blue-600">Current: {activeCourse.title}</div>}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Progress value={student.overallProgress} className="flex-1" />
                          <span className="text-sm text-muted-foreground">{student.overallProgress}%</span>
                        </div>
                        <div className="text-xs text-muted-foreground">Overall progress</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[studentStatus].variant}>{statusConfig[studentStatus].label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{formatDate(new Date(lastActivity).toISOString().split("T")[0])}</div>
                        <div className="text-xs text-muted-foreground">Last login: {formatDate(student.lastLogin)}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" asChild>
                          <Link href={`/admin/students/${student.id}`}>View Profile</Link>
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="mr-2 h-4 w-4" />
                          Contact
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {filteredStudents.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-muted-foreground">No students found matching your criteria.</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
