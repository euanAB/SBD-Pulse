"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BookOpen,
  Calendar,
  Clock,
  MapPin,
  User,
  CheckCircle,
  AlertCircle,
  Download,
  ExternalLink,
  Phone,
  Mail,
  Star,
  Award,
  FileText,
  Video,
  Users,
  Target,
  TrendingUp,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

interface ClassSession {
  id: string
  title: string
  date: string
  time: string
  duration: string
  status: "completed" | "upcoming" | "in-progress"
  attendance?: "present" | "absent"
  location: string
}

interface Assessment {
  id: string
  title: string
  type: "practical" | "theory" | "assignment"
  weight: number
  grade?: number
  maxGrade: number
  status: "completed" | "pending" | "not-started"
  feedback?: string
  dueDate?: string
}

interface ClassData {
  id: string
  title: string
  code: string
  description: string
  instructor: {
    name: string
    email: string
    phone: string
    bio: string
    qualifications: string[]
  }
  schedule: {
    startDate: string
    endDate: string
    totalSessions: number
    completedSessions: number
  }
  location: {
    name: string
    address: string
    facilities: string[]
  }
  progress: {
    overall: number
    attendance: number
    assignments: number
  }
  sessions: ClassSession[]
  assessments: Assessment[]
  resources: Array<{
    id: string
    title: string
    type: "pdf" | "video" | "link"
    url: string
    description: string
  }>
  status: "not-started" | "in-progress" | "completed" | "overdue"
  grade?: string
  certificate?: {
    available: boolean
    url?: string
    issueDate?: string
  }
}

export default function StudentClassDetailPage({ params }: { params: { id: string } }) {
  // Mock data - would be fetched based on params.id
  const classData: ClassData = {
    id: params.id,
    title: "First Aid Level 2",
    code: "FA-L2-2025",
    description:
      "Comprehensive first aid training covering emergency response, CPR, and workplace safety protocols. This course builds on Level 1 skills with advanced techniques and scenario-based learning.",
    instructor: {
      name: "Sarah Johnson",
      email: "sarah.johnson@pulseacademy.com",
      phone: "+44 7123 456 789",
      bio: "Sarah is a qualified paramedic with over 15 years of experience in emergency medical services. She specializes in first aid training and has trained over 2,000 students.",
      qualifications: ["Paramedic Certification", "First Aid Instructor", "CPR Instructor", "AED Trainer"],
    },
    schedule: {
      startDate: "2025-01-15",
      endDate: "2025-02-05",
      totalSessions: 4,
      completedSessions: 2,
    },
    location: {
      name: "Manchester Training Centre",
      address: "123 Training Street, Manchester, M1 2AB",
      facilities: ["Practical Training Room", "AV Equipment", "First Aid Mannequins", "Parking Available"],
    },
    progress: {
      overall: 65,
      attendance: 100,
      assignments: 50,
    },
    sessions: [
      {
        id: "S1",
        title: "Basic Life Support & CPR",
        date: "2025-01-15",
        time: "09:00 - 12:00",
        duration: "3 hours",
        status: "completed",
        attendance: "present",
        location: "Training Room A",
      },
      {
        id: "S2",
        title: "Emergency Response & Assessment",
        date: "2025-01-22",
        time: "09:00 - 12:00",
        duration: "3 hours",
        status: "completed",
        attendance: "present",
        location: "Training Room A",
      },
      {
        id: "S3",
        title: "Trauma Care & Wound Management",
        date: "2025-01-29",
        time: "09:00 - 12:00",
        duration: "3 hours",
        status: "upcoming",
        location: "Training Room A",
      },
      {
        id: "S4",
        title: "Practical Assessment & Certification",
        date: "2025-02-05",
        time: "09:00 - 15:00",
        duration: "6 hours",
        status: "upcoming",
        location: "Training Room A",
      },
    ],
    assessments: [
      {
        id: "A1",
        title: "CPR Practical Assessment",
        type: "practical",
        weight: 40,
        grade: 85,
        maxGrade: 100,
        status: "completed",
        feedback: "Excellent technique demonstrated. Good compression depth and rate maintained throughout.",
      },
      {
        id: "A2",
        title: "Theory Knowledge Test",
        type: "theory",
        weight: 30,
        status: "pending",
        maxGrade: 100,
        dueDate: "2025-01-28",
      },
      {
        id: "A3",
        title: "Final Practical Exam",
        type: "practical",
        weight: 30,
        status: "not-started",
        maxGrade: 100,
        dueDate: "2025-02-05",
      },
    ],
    resources: [
      {
        id: "R1",
        title: "First Aid Manual 2025",
        type: "pdf",
        url: "/resources/first-aid-manual-2025.pdf",
        description: "Complete reference guide covering all course topics",
      },
      {
        id: "R2",
        title: "CPR Technique Video",
        type: "video",
        url: "/resources/cpr-technique-video.mp4",
        description: "Step-by-step CPR demonstration video",
      },
      {
        id: "R3",
        title: "Emergency Response Checklist",
        type: "pdf",
        url: "/resources/emergency-checklist.pdf",
        description: "Quick reference checklist for emergency situations",
      },
      {
        id: "R4",
        title: "Online Practice Tests",
        type: "link",
        url: "https://practice.pulseacademy.com/first-aid",
        description: "Interactive practice questions and scenarios",
      },
    ],
    status: "in-progress",
    certificate: {
      available: false,
    },
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    })
  }

  const getSessionStatusIcon = (status: string, attendance?: string) => {
    if (status === "completed") {
      return attendance === "present" ? (
        <CheckCircle className="h-4 w-4 text-green-600" />
      ) : (
        <AlertCircle className="h-4 w-4 text-red-600" />
      )
    }
    if (status === "in-progress") return <Clock className="h-4 w-4 text-blue-600" />
    return <Calendar className="h-4 w-4 text-gray-400" />
  }

  const getAssessmentStatusBadge = (assessment: Assessment) => {
    switch (assessment.status) {
      case "completed":
        return <Badge className="bg-green-100 text-green-700 border-green-200">Completed</Badge>
      case "pending":
        return <Badge className="bg-orange-100 text-orange-700 border-orange-200">Pending</Badge>
      default:
        return <Badge variant="outline">Not Started</Badge>
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <FileText className="h-4 w-4 text-red-600" />
      case "video":
        return <Video className="h-4 w-4 text-blue-600" />
      case "link":
        return <ExternalLink className="h-4 w-4 text-green-600" />
      default:
        return <FileText className="h-4 w-4 text-gray-600" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 p-6">
      <div className="mx-auto max-w-6xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 text-blue-700 rounded-full text-sm font-medium">
            <BookOpen className="h-4 w-4" />
            Class Details
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">{classData.title}</h1>
            <p className="text-xl text-gray-600">{classData.code}</p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-3">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Overall Progress</p>
                  <p className="text-3xl font-bold text-blue-900">{classData.progress.overall}%</p>
                  <p className="text-xs text-blue-600 mt-1">Course completion</p>
                </div>
                <div className="p-3 bg-blue-600 rounded-full">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Attendance</p>
                  <p className="text-3xl font-bold text-green-900">{classData.progress.attendance}%</p>
                  <p className="text-xs text-green-600 mt-1">
                    {classData.schedule.completedSessions}/{classData.schedule.totalSessions} sessions
                  </p>
                </div>
                <div className="p-3 bg-green-600 rounded-full">
                  <Users className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Assessments</p>
                  <p className="text-3xl font-bold text-purple-900">{classData.progress.assignments}%</p>
                  <p className="text-xs text-purple-600 mt-1">Average grade</p>
                </div>
                <div className="p-3 bg-purple-600 rounded-full">
                  <Target className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 bg-white/80 backdrop-blur-sm">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="schedule">Schedule</TabsTrigger>
            <TabsTrigger value="grades">Grades</TabsTrigger>
            <TabsTrigger value="resources">Resources</TabsTrigger>
            <TabsTrigger value="instructor">Instructor</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid gap-6 lg:grid-cols-2">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                    Course Description
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-700 leading-relaxed">{classData.description}</p>

                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">
                        {formatShortDate(classData.schedule.startDate)} - {formatShortDate(classData.schedule.endDate)}
                      </span>
                    </div>
                    <div className="flex items-center gap-3">
                      <MapPin className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{classData.location.name}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <User className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">Instructor: {classData.instructor.name}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Location & Facilities
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900">{classData.location.name}</h4>
                    <p className="text-sm text-gray-600">{classData.location.address}</p>
                  </div>

                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">Available Facilities:</h5>
                    <div className="grid grid-cols-2 gap-2">
                      {classData.location.facilities.map((facility, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          {facility}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button variant="outline" className="w-full bg-transparent" asChild>
                    <Link
                      href={`https://maps.google.com/?q=${encodeURIComponent(classData.location.address)}`}
                      target="_blank"
                    >
                      <MapPin className="mr-2 h-4 w-4" />
                      View on Map
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Progress Overview */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Learning Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Overall Course Progress</span>
                      <span className="font-bold">{classData.progress.overall}%</span>
                    </div>
                    <Progress value={classData.progress.overall} className="h-3" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Session Attendance</span>
                      <span className="font-bold">{classData.progress.attendance}%</span>
                    </div>
                    <Progress value={classData.progress.attendance} className="h-3" />
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="font-medium">Assessment Average</span>
                      <span className="font-bold">{classData.progress.assignments}%</span>
                    </div>
                    <Progress value={classData.progress.assignments} className="h-3" />
                  </div>
                </div>

                {classData.certificate?.available && (
                  <Alert className="bg-green-50 border-green-200">
                    <Award className="h-4 w-4 text-green-600" />
                    <AlertDescription className="text-green-800">
                      <div className="flex items-center justify-between">
                        <span>
                          <strong>Certificate Available!</strong> You have successfully completed this course.
                        </span>
                        <Button size="sm" className="bg-green-600 hover:bg-green-700" asChild>
                          <Link href={classData.certificate.url!} target="_blank">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </Link>
                        </Button>
                      </div>
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="schedule" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  Class Schedule
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {classData.sessions.map((session, index) => (
                    <div
                      key={session.id}
                      className={`rounded-lg border p-4 ${
                        session.status === "completed"
                          ? "bg-green-50 border-green-200"
                          : session.status === "in-progress"
                            ? "bg-blue-50 border-blue-200"
                            : "bg-gray-50 border-gray-200"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            {getSessionStatusIcon(session.status, session.attendance)}
                            <h4 className="font-semibold text-gray-900">
                              Session {index + 1}: {session.title}
                            </h4>
                          </div>
                          <div className="flex items-center gap-6 text-sm text-gray-600">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(session.date)}
                            </span>
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {session.time}
                            </span>
                            <span className="flex items-center gap-1">
                              <MapPin className="h-3 w-3" />
                              {session.location}
                            </span>
                          </div>
                          {session.attendance && (
                            <div className="text-sm">
                              <Badge
                                className={
                                  session.attendance === "present"
                                    ? "bg-green-100 text-green-700 border-green-200"
                                    : "bg-red-100 text-red-700 border-red-200"
                                }
                              >
                                {session.attendance === "present" ? "Present" : "Absent"}
                              </Badge>
                            </div>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium text-gray-900">{session.duration}</div>
                          <Badge
                            variant={
                              session.status === "completed"
                                ? "secondary"
                                : session.status === "in-progress"
                                  ? "default"
                                  : "outline"
                            }
                          >
                            {session.status === "completed"
                              ? "Completed"
                              : session.status === "in-progress"
                                ? "In Progress"
                                : "Upcoming"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="grades" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Assessment Results
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {classData.assessments.map((assessment) => (
                    <div key={assessment.id} className="rounded-lg border border-gray-200 p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="space-y-1">
                          <h4 className="font-semibold text-gray-900">{assessment.title}</h4>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {assessment.type.charAt(0).toUpperCase() + assessment.type.slice(1)}
                            </Badge>
                            <span className="text-sm text-gray-600">Weight: {assessment.weight}%</span>
                          </div>
                        </div>
                        <div className="text-right">
                          {getAssessmentStatusBadge(assessment)}
                          {assessment.dueDate && assessment.status !== "completed" && (
                            <div className="text-xs text-gray-500 mt-1">Due: {formatShortDate(assessment.dueDate)}</div>
                          )}
                        </div>
                      </div>

                      {assessment.status === "completed" && assessment.grade !== undefined && (
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">Grade:</span>
                            <span className="text-lg font-bold text-green-600">
                              {assessment.grade}/{assessment.maxGrade}
                            </span>
                          </div>
                          <Progress value={(assessment.grade / assessment.maxGrade) * 100} className="h-2" />
                          {assessment.feedback && (
                            <div className="bg-blue-50 rounded p-3">
                              <p className="text-sm text-blue-800">
                                <strong>Feedback:</strong> {assessment.feedback}
                              </p>
                            </div>
                          )}
                        </div>
                      )}

                      {assessment.status === "pending" && (
                        <Alert>
                          <Clock className="h-4 w-4" />
                          <AlertDescription>
                            This assessment is currently being graded. Results will be available soon.
                          </AlertDescription>
                        </Alert>
                      )}

                      {assessment.status === "not-started" && (
                        <Alert>
                          <AlertCircle className="h-4 w-4" />
                          <AlertDescription>
                            This assessment has not been completed yet.
                            {assessment.dueDate && <span> Due date: {formatDate(assessment.dueDate)}</span>}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="resources" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-600" />
                  Course Resources
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  {classData.resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-gray-100 rounded">{getResourceIcon(resource.type)}</div>
                        <div className="flex-1 space-y-2">
                          <h4 className="font-semibold text-gray-900">{resource.title}</h4>
                          <p className="text-sm text-gray-600">{resource.description}</p>
                          <Button size="sm" variant="outline" className="w-full bg-transparent" asChild>
                            <Link href={resource.url} target={resource.type === "link" ? "_blank" : "_self"}>
                              {resource.type === "link" ? (
                                <>
                                  <ExternalLink className="mr-2 h-4 w-4" />
                                  Open Link
                                </>
                              ) : (
                                <>
                                  <Download className="mr-2 h-4 w-4" />
                                  Download
                                </>
                              )}
                            </Link>
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="instructor" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-green-600" />
                  Your Instructor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start gap-6">
                  <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
                    <User className="h-12 w-12 text-blue-600" />
                  </div>
                  <div className="flex-1 space-y-3">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">{classData.instructor.name}</h3>
                      <p className="text-gray-600">Course Instructor</p>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{classData.instructor.bio}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Qualifications & Certifications</h4>
                    <div className="grid grid-cols-2 gap-2">
                      {classData.instructor.qualifications.map((qual, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                          <Award className="h-3 w-3 text-yellow-500" />
                          {qual}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <Button variant="outline" className="flex-1 bg-transparent" asChild>
                      <Link href={`mailto:${classData.instructor.email}`}>
                        <Mail className="mr-2 h-4 w-4" />
                        Email Instructor
                      </Link>
                    </Button>
                    <Button variant="outline" className="flex-1 bg-transparent" asChild>
                      <Link href={`tel:${classData.instructor.phone}`}>
                        <Phone className="mr-2 h-4 w-4" />
                        Call Instructor
                      </Link>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-0 text-white shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Sparkles className="h-6 w-6 text-yellow-300" />
                  <h3 className="text-2xl font-bold">Keep Learning!</h3>
                </div>
                <p className="text-indigo-100 text-lg">
                  Explore more courses to advance your skills and career opportunities
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100" asChild>
                  <Link href="https://sbd.school/courses" target="_blank" rel="noopener noreferrer">
                    Browse Courses
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
      </div>
    </div>
  )
}
