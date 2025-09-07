"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BookOpen,
  Calendar,
  User,
  MapPin,
  AlertCircle,
  ExternalLink,
  Download,
  Eye,
  Phone,
  Star,
  Clock,
  Award,
  TrendingUp,
  Target,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

type CourseStatus = "not-started" | "in-progress" | "completed" | "overdue"

type Course = {
  id: string
  title: string
  code: string
  instructor: string
  startDate: string
  endDate?: string
  completedDate?: string
  nextSession?: string
  location: string
  progress: number
  status: CourseStatus
  grade?: string
  certificateUrl?: string
  totalSessions: number
  attendedSessions: number
  assignments: {
    total: number
    completed: number
  }
  description: string
}

const mockCourses: Course[] = [
  {
    id: "CRS-001",
    title: "First Aid Level 1",
    code: "FA-L1-2024",
    instructor: "Sarah Johnson",
    startDate: "2024-11-15",
    completedDate: "2024-12-15",
    location: "Training Room A",
    progress: 100,
    status: "completed",
    grade: "Pass",
    certificateUrl: "/certificates/fa-l1-cert.pdf",
    totalSessions: 4,
    attendedSessions: 4,
    assignments: { total: 2, completed: 2 },
    description: "Basic first aid skills for workplace and home emergencies.",
  },
  {
    id: "CRS-002",
    title: "Manual Handling",
    code: "MH-2025",
    instructor: "Mike Thompson",
    startDate: "2025-01-10",
    nextSession: "2025-01-20",
    location: "Workshop Area",
    progress: 40,
    status: "in-progress",
    totalSessions: 3,
    attendedSessions: 1,
    assignments: { total: 1, completed: 0 },
    description: "Safe lifting techniques and workplace ergonomics to prevent injury.",
  },
  {
    id: "CRS-003",
    title: "Safeguarding Basics",
    code: "SG-2025",
    instructor: "Emma Wilson",
    startDate: "2025-01-25",
    location: "Training Room B",
    progress: 0,
    status: "not-started",
    totalSessions: 2,
    attendedSessions: 0,
    assignments: { total: 1, completed: 0 },
    description: "Essential safeguarding principles for working with vulnerable groups.",
  },
  {
    id: "CRS-004",
    title: "Food Safety Level 2",
    code: "FS-L2-2024",
    instructor: "David Brown",
    startDate: "2024-10-01",
    endDate: "2024-11-30",
    location: "Training Room C",
    progress: 75,
    status: "overdue",
    totalSessions: 3,
    attendedSessions: 2,
    assignments: { total: 2, completed: 1 },
    description: "Comprehensive food safety training for food handlers and supervisors.",
  },
]

const statusConfig: Record<
  CourseStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }
> = {
  "not-started": { label: "Not Started", variant: "outline", color: "text-gray-600" },
  "in-progress": { label: "In Progress", variant: "default", color: "text-blue-600" },
  completed: { label: "Completed", variant: "secondary", color: "text-green-600" },
  overdue: { label: "Overdue", variant: "destructive", color: "text-red-600" },
}

export default function StudentCoursesPage() {
  const [courses, setCourses] = React.useState(mockCourses)
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState("")

  // Filter courses
  const filteredCourses = React.useMemo(() => {
    return courses.filter((course) => {
      const matchesStatus = statusFilter === "all" || course.status === statusFilter
      const matchesSearch =
        searchQuery === "" ||
        course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.code.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesStatus && matchesSearch
    })
  }, [courses, statusFilter, searchQuery])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getNextAction = (course: Course) => {
    switch (course.status) {
      case "completed":
        return course.certificateUrl ? "Download Certificate" : "View Results"
      case "in-progress":
        return course.nextSession ? `Next: ${formatDate(course.nextSession)}` : "Continue Learning"
      case "not-started":
        return `Starts: ${formatDate(course.startDate)}`
      case "overdue":
        return "Complete Overdue Work"
      default:
        return "View Course"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-medium">
            <BookOpen className="h-4 w-4" />
            My Learning Journey
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">Continue Your Learning</h1>
            <p className="text-xl text-gray-600">Track your progress and unlock new opportunities</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Active Courses</p>
                  <p className="text-3xl font-bold text-blue-900">
                    {courses.filter((c) => c.status === "in-progress").length}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">In progress</p>
                </div>
                <div className="p-3 bg-blue-600 rounded-full">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Completed</p>
                  <p className="text-3xl font-bold text-green-900">
                    {courses.filter((c) => c.status === "completed").length}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Certificates earned</p>
                </div>
                <div className="p-3 bg-green-600 rounded-full">
                  <Award className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Needs Attention</p>
                  <p className="text-3xl font-bold text-orange-900">
                    {courses.filter((c) => c.status === "overdue").length}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">Overdue items</p>
                </div>
                <div className="p-3 bg-orange-600 rounded-full">
                  <AlertCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Overall Progress</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {Math.round(courses.reduce((sum, c) => sum + c.progress, 0) / courses.length)}%
                  </p>
                  <p className="text-xs text-purple-600 mt-1">Average completion</p>
                </div>
                <div className="p-3 bg-purple-600 rounded-full">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Input
                    placeholder="Search courses, instructors, or codes..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 pl-4 pr-4 bg-white/80"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px] h-11 bg-white/80">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Courses ({courses.length})</SelectItem>
                    <SelectItem value="in-progress">
                      In Progress ({courses.filter((c) => c.status === "in-progress").length})
                    </SelectItem>
                    <SelectItem value="completed">
                      Completed ({courses.filter((c) => c.status === "completed").length})
                    </SelectItem>
                    <SelectItem value="not-started">
                      Not Started ({courses.filter((c) => c.status === "not-started").length})
                    </SelectItem>
                    <SelectItem value="overdue">
                      Overdue ({courses.filter((c) => c.status === "overdue").length})
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-gray-600">
                Showing {filteredCourses.length} of {courses.length} courses
              </div>
            </div>
          </CardHeader>
        </Card>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <Card
              key={course.id}
              className="flex flex-col bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader className="pb-4">
                <div className="flex items-start justify-between mb-3">
                  <div className="space-y-2">
                    <CardTitle className="text-xl text-gray-900">{course.title}</CardTitle>
                    <div className="text-sm text-gray-500 font-mono">{course.code}</div>
                  </div>
                  <Badge
                    variant={statusConfig[course.status].variant}
                    className={`${
                      course.status === "completed"
                        ? "bg-green-100 text-green-700 border-green-200"
                        : course.status === "in-progress"
                          ? "bg-blue-100 text-blue-700 border-blue-200"
                          : course.status === "overdue"
                            ? "bg-red-100 text-red-700 border-red-200"
                            : "bg-gray-100 text-gray-700 border-gray-200"
                    }`}
                  >
                    {statusConfig[course.status].label}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 leading-relaxed">{course.description}</p>
              </CardHeader>

              <CardContent className="flex-1 space-y-5">
                {/* Progress Section */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="font-medium text-gray-700">Course Progress</span>
                    <span className="font-bold text-gray-900">{course.progress}%</span>
                  </div>
                  <Progress value={course.progress} className="h-3" />
                  {course.progress > 0 && course.progress < 100 && (
                    <div className="text-xs text-gray-500">{100 - course.progress}% remaining to complete</div>
                  )}
                </div>

                {/* Course Details */}
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-blue-100 rounded">
                      <User className="h-3 w-3 text-blue-600" />
                    </div>
                    <span className="text-gray-700">Instructor: {course.instructor}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-green-100 rounded">
                      <MapPin className="h-3 w-3 text-green-600" />
                    </div>
                    <span className="text-gray-700">{course.location}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="p-1 bg-purple-100 rounded">
                      <Calendar className="h-3 w-3 text-purple-600" />
                    </div>
                    <span className="text-gray-700">
                      {course.status === "completed" && course.completedDate
                        ? `Completed ${formatDate(course.completedDate)}`
                        : course.status === "in-progress" && course.nextSession
                          ? `Next session: ${formatDate(course.nextSession)}`
                          : `Starts: ${formatDate(course.startDate)}`}
                    </span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {course.attendedSessions}/{course.totalSessions}
                    </div>
                    <div className="text-xs text-gray-600">Sessions</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-gray-900">
                      {course.assignments.completed}/{course.assignments.total}
                    </div>
                    <div className="text-xs text-gray-600">Assignments</div>
                  </div>
                </div>

                {/* Grade Display */}
                {course.grade && (
                  <div className="rounded-lg bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 p-4">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-green-600" />
                      <span className="font-semibold text-green-900">Final Grade: {course.grade}</span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  {course.status === "completed" && course.certificateUrl ? (
                    <Button size="sm" className="flex-1 bg-green-600 hover:bg-green-700" asChild>
                      <Link href={course.certificateUrl} target="_blank">
                        <Download className="mr-2 h-4 w-4" />
                        Certificate
                      </Link>
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      asChild
                    >
                      <Link href={`/student/classes/${course.id}`}>
                        <Eye className="mr-2 h-4 w-4" />
                        {course.status === "not-started" ? "View Course" : "Continue"}
                      </Link>
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="bg-white/80">
                    Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <BookOpen className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">No courses found</h3>
                  <p className="text-gray-600 mt-1">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "You haven't enrolled in any courses yet"}
                  </p>
                </div>
                {!searchQuery && statusFilter === "all" && (
                  <Button className="mt-4" asChild>
                    <Link href="https://sbd.school/courses" target="_blank" rel="noopener noreferrer">
                      Browse Available Courses
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-0 text-white shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
              <div className="space-y-4 text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Sparkles className="h-6 w-6 text-yellow-300" />
                  <h3 className="text-2xl font-bold">Expand Your Skills</h3>
                </div>
                <p className="text-indigo-100 text-lg max-w-2xl">
                  Discover hundreds of additional training courses to advance your career and unlock new opportunities
                </p>
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-indigo-100 justify-center lg:justify-start">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4" />
                    <span>Personalized course recommendations</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    <span>Flexible scheduling options</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    <span>Industry-recognized certifications</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100" asChild>
                  <Link href="https://sbd.school/courses" target="_blank" rel="noopener noreferrer">
                    Browse All Courses
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                  asChild
                >
                  <Link href="tel:03308050624">
                    <Phone className="mr-2 h-4 w-4" />
                    Get Advice
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Alert className="bg-blue-50 border-blue-200">
          <Phone className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>Need help choosing the right course?</strong> Call our expert advisors at{" "}
            <a href="tel:03308050624" className="font-semibold underline">
              0330 8050 4624
            </a>{" "}
            for personalized recommendations based on your career goals and experience level.
          </AlertDescription>
        </Alert>
      </div>
    </div>
  )
}
