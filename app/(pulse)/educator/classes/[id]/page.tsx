"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar,
  Users,
  MapPin,
  Mail,
  Upload,
  Download,
  Edit,
  Plus,
  Eye,
  EyeOff,
  FileText,
  Bell,
  Receipt,
  CheckCircle,
  XCircle,
  Clock,
  ExternalLink,
  Phone,
  Save,
  BookOpen,
  Target,
  Award,
  User,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

type StudentStatus = "enrolled" | "pending" | "completed" | "dropped"
type PaymentStatus = "paid" | "pending" | "overdue" | "partial"
type GradeStatus = "pass" | "fail" | "pending" | "absent"
type SessionStatus = "scheduled" | "completed" | "cancelled" | "in-progress"

type Student = {
  id: string
  name: string
  email: string
  phone: string
  status: StudentStatus
  paymentStatus: PaymentStatus
  amountPaid: number
  courseFee: number
  enrolledDate: string
  attendance: Record<string, boolean>
  grades: Record<string, { score: number; status: GradeStatus; notes: string; lastUpdated: string }>
}

type ClassSession = {
  id: string
  sessionNumber: number
  title: string
  date: string
  startTime: string
  endTime: string
  location: string
  status: SessionStatus
  topics: string[]
  attendanceMarked: boolean
  notes: string
}

type ClassResource = {
  id: string
  name: string
  type: string
  size: string
  uploadedBy: string
  uploadedDate: string
  visibility: "students" | "educators" | "admin"
  url: string
}

type ClassNotice = {
  id: string
  title: string
  content: string
  type: "info" | "warning" | "urgent"
  createdBy: string
  createdDate: string
  targetAudience: "all" | "students" | "educators"
}

type AssessmentType = {
  id: string
  name: string
  weight: number
  passRate: number
  description: string
}

const mockStudents: Student[] = [
  {
    id: "S-001",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "07123 456789",
    status: "enrolled",
    paymentStatus: "paid",
    amountPaid: 850,
    courseFee: 850,
    enrolledDate: "2025-01-05",
    attendance: { "session-1": true, "session-2": true, "session-3": false, "session-4": false },
    grades: {
      practical: { score: 85, status: "pass", notes: "Excellent technique", lastUpdated: "2025-01-10" },
      theory: { score: 92, status: "pass", notes: "Strong understanding", lastUpdated: "2025-01-08" },
      exam: { score: 0, status: "pending", notes: "", lastUpdated: "" },
    },
  },
  {
    id: "S-002",
    name: "Mike Chen",
    email: "mike.chen@company.com",
    phone: "07987 654321",
    status: "enrolled",
    paymentStatus: "partial",
    amountPaid: 400,
    courseFee: 850,
    enrolledDate: "2025-01-03",
    attendance: { "session-1": true, "session-2": true, "session-3": true, "session-4": false },
    grades: {
      practical: { score: 78, status: "pass", notes: "Good progress", lastUpdated: "2025-01-10" },
      theory: { score: 0, status: "pending", notes: "Not yet assessed", lastUpdated: "" },
      exam: { score: 0, status: "pending", notes: "Not yet taken", lastUpdated: "" },
    },
  },
  {
    id: "S-003",
    name: "Emma Wilson",
    email: "emma.w@email.com",
    phone: "07555 123456",
    status: "completed",
    paymentStatus: "paid",
    amountPaid: 850,
    courseFee: 850,
    enrolledDate: "2024-12-28",
    attendance: { "session-1": true, "session-2": true, "session-3": true, "session-4": true },
    grades: {
      practical: { score: 95, status: "pass", notes: "Outstanding performance", lastUpdated: "2025-01-12" },
      theory: { score: 88, status: "pass", notes: "Very good knowledge", lastUpdated: "2025-01-11" },
      exam: { score: 91, status: "pass", notes: "Excellent result", lastUpdated: "2025-01-12" },
    },
  },
]

const mockSessions: ClassSession[] = [
  {
    id: "session-1",
    sessionNumber: 1,
    title: "Introduction to First Aid & Basic Life Support",
    date: "2025-01-15",
    startTime: "09:00",
    endTime: "17:00",
    location: "Training Room A",
    status: "completed",
    topics: ["First Aid Principles", "Scene Safety", "Primary Assessment", "CPR Basics"],
    attendanceMarked: true,
    notes: "Good engagement from all students. Covered all planned topics.",
  },
  {
    id: "session-2",
    sessionNumber: 2,
    title: "Wound Care & Bleeding Control",
    date: "2025-01-16",
    startTime: "09:00",
    endTime: "17:00",
    location: "Training Room A",
    status: "completed",
    topics: ["Types of Wounds", "Bleeding Control", "Bandaging Techniques", "Shock Management"],
    attendanceMarked: true,
    notes: "Practical session went well. Students showed good technique in bandaging.",
  },
  {
    id: "session-3",
    sessionNumber: 3,
    title: "Medical Emergencies & Practical Assessment",
    date: "2025-01-17",
    startTime: "09:00",
    endTime: "17:00",
    location: "Training Room A",
    status: "in-progress",
    topics: ["Heart Attack", "Stroke", "Seizures", "Practical Assessment"],
    attendanceMarked: false,
    notes: "",
  },
  {
    id: "session-4",
    sessionNumber: 4,
    title: "Final Assessment & Certification",
    date: "2025-01-18",
    startTime: "09:00",
    endTime: "17:00",
    location: "Training Room A",
    status: "scheduled",
    topics: ["Theory Exam", "Final Practical", "Certification Process"],
    attendanceMarked: false,
    notes: "",
  },
]

const mockResources: ClassResource[] = [
  {
    id: "RES-001",
    name: "First Aid Manual 2025.pdf",
    type: "PDF",
    size: "2.4 MB",
    uploadedBy: "Alex Taylor",
    uploadedDate: "2025-01-05",
    visibility: "students",
    url: "/resources/first-aid-manual.pdf",
  },
  {
    id: "RES-002",
    name: "CPR Technique Video.mp4",
    type: "Video",
    size: "45.2 MB",
    uploadedBy: "Admin",
    uploadedDate: "2025-01-03",
    visibility: "students",
    url: "/resources/cpr-video.mp4",
  },
  {
    id: "RES-003",
    name: "Assessment Rubric.docx",
    type: "Document",
    size: "156 KB",
    uploadedBy: "Alex Taylor",
    uploadedDate: "2025-01-02",
    visibility: "educators",
    url: "/resources/assessment-rubric.docx",
  },
]

const mockNotices: ClassNotice[] = [
  {
    id: "NOT-001",
    title: "Session 3 Location Change",
    content:
      "Please note that Session 3 will be held in Training Room B instead of Training Room A due to maintenance.",
    type: "warning",
    createdBy: "Admin",
    createdDate: "2025-01-08",
    targetAudience: "all",
  },
  {
    id: "NOT-002",
    title: "Bring Photo ID for Certification",
    content: "All students must bring valid photo identification for the final assessment and certification process.",
    type: "info",
    createdBy: "Alex Taylor",
    createdDate: "2025-01-05",
    targetAudience: "students",
  },
]

const defaultAssessments: AssessmentType[] = [
  {
    id: "practical",
    name: "Practical Assessment",
    weight: 40,
    passRate: 70,
    description: "Hands-on demonstration of first aid techniques",
  },
  {
    id: "theory",
    name: "Theory Assessment",
    weight: 30,
    passRate: 70,
    description: "Written test on first aid knowledge",
  },
  { id: "exam", name: "Final Exam", weight: 30, passRate: 60, description: "Comprehensive final examination" },
]

export default function EducatorClassDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [students, setStudents] = React.useState(mockStudents)
  const [sessions, setSessions] = React.useState(mockSessions)
  const [resources, setResources] = React.useState(mockResources)
  const [notices, setNotices] = React.useState(mockNotices)
  const [assessments, setAssessments] = React.useState(defaultAssessments)
  const [selectedSession, setSelectedSession] = React.useState<string>("session-3")

  // Invoice form state
  const [showInvoiceModal, setShowInvoiceModal] = React.useState(false)
  const [invoiceForm, setInvoiceForm] = React.useState({
    amount: "",
    category: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  // Notice form state
  const [newNotice, setNewNotice] = React.useState({
    title: "",
    content: "",
    type: "info" as const,
    audience: "students" as const,
  })

  const classId = params.id
  const currentSession = sessions.find((s) => s.id === selectedSession)

  const handleSubmitInvoice = () => {
    if (!invoiceForm.amount || !invoiceForm.category || !invoiceForm.description) {
      toast({
        title: "Incomplete form",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Invoice submitted",
      description: "Your invoice has been submitted for review",
    })

    setInvoiceForm({
      amount: "",
      category: "",
      description: "",
      date: new Date().toISOString().split("T")[0],
    })
    setShowInvoiceModal(false)
  }

  const addNotice = () => {
    if (!newNotice.title || !newNotice.content) {
      toast({
        title: "Incomplete notice",
        description: "Please fill in both title and content",
        variant: "destructive",
      })
      return
    }

    const notice: ClassNotice = {
      id: `NOT-${Date.now()}`,
      ...newNotice,
      createdBy: "Alex Taylor", // Current educator
      createdDate: new Date().toISOString().split("T")[0],
      targetAudience: newNotice.audience,
    }

    setNotices([notice, ...notices])
    setNewNotice({ title: "", content: "", type: "info", audience: "students" })

    toast({
      title: "Notice added",
      description: "Class notice has been posted successfully",
    })
  }

  const saveAttendance = () => {
    if (!currentSession) return

    const updatedSessions = sessions.map((session) =>
      session.id === selectedSession ? { ...session, attendanceMarked: true } : session,
    )
    setSessions(updatedSessions)

    toast({
      title: "Attendance saved",
      description: `Attendance for ${currentSession.title} has been saved successfully`,
    })
  }

  const saveGrades = () => {
    toast({
      title: "Grades saved",
      description: "All grade changes have been saved successfully",
    })
  }

  const toggleAttendance = (studentId: string, sessionId: string) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? {
              ...student,
              attendance: {
                ...student.attendance,
                [sessionId]: !student.attendance[sessionId],
              },
            }
          : student,
      ),
    )
  }

  const updateGrade = (studentId: string, assessmentId: string, score: number) => {
    const assessment = assessments.find((a) => a.id === assessmentId)
    if (!assessment) return

    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? {
              ...student,
              grades: {
                ...student.grades,
                [assessmentId]: {
                  score,
                  status: score >= assessment.passRate ? "pass" : "fail",
                  notes: student.grades[assessmentId]?.notes || "",
                  lastUpdated: new Date().toISOString().split("T")[0],
                },
              },
            }
          : student,
      ),
    )
  }

  const updateGradeNotes = (studentId: string, assessmentId: string, notes: string) => {
    setStudents((prevStudents) =>
      prevStudents.map((student) =>
        student.id === studentId
          ? {
              ...student,
              grades: {
                ...student.grades,
                [assessmentId]: {
                  ...student.grades[assessmentId],
                  notes,
                  lastUpdated: new Date().toISOString().split("T")[0],
                },
              },
            }
          : student,
      ),
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">First Aid Level 1 - Morning Session</h1>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Jan 15-18, 2025
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Training Room A
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {students.filter((s) => s.status === "enrolled").length} / 12 students
            </div>
            <div className="flex items-center gap-1">
              <BookOpen className="h-4 w-4" />4 Sessions
            </div>
            <Badge variant="default">Teaching</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setShowInvoiceModal(true)}>
            <Receipt className="mr-2 h-4 w-4" />
            Submit Invoice
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Class Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Enrolled Students</p>
                <p className="text-2xl font-bold">{students.filter((s) => s.status === "enrolled").length}</p>
                <p className="text-xs text-muted-foreground">of 12 maximum</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Sessions Completed</p>
                <p className="text-2xl font-bold">{sessions.filter((s) => s.status === "completed").length}</p>
                <p className="text-xs text-muted-foreground">of {sessions.length} total</p>
              </div>
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Average Attendance</p>
                <p className="text-2xl font-bold">85%</p>
                <p className="text-xs text-muted-foreground">Across all sessions</p>
              </div>
              <Target className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pass Rate</p>
                <p className="text-2xl font-bold">92%</p>
                <p className="text-xs text-muted-foreground">Students passing assessments</p>
              </div>
              <Award className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sessions Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Class Schedule</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {sessions.map((session) => (
              <Card
                key={session.id}
                className={`cursor-pointer transition-colors ${
                  selectedSession === session.id ? "ring-2 ring-blue-500" : ""
                }`}
                onClick={() => setSelectedSession(session.id)}
              >
                <CardContent className="p-4">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Badge
                        variant={
                          session.status === "completed"
                            ? "default"
                            : session.status === "in-progress"
                              ? "secondary"
                              : session.status === "cancelled"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {session.status}
                      </Badge>
                      <span className="text-sm font-medium">Session {session.sessionNumber}</span>
                    </div>
                    <h4 className="font-medium text-sm">{session.title}</h4>
                    <div className="text-xs text-muted-foreground space-y-1">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(session.date).toLocaleDateString("en-GB")}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.startTime} - {session.endTime}
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {session.location}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-xs">
                      {session.attendanceMarked ? (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Attendance marked
                        </div>
                      ) : (
                        <div className="flex items-center gap-1 text-gray-500">
                          <Clock className="h-3 w-3" />
                          Attendance pending
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content Tabs */}
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="notices">Notices</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Enrolled Students ({students.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Attendance Rate</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => {
                    const attendanceRate = Object.values(student.attendance).filter(Boolean).length / sessions.length
                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        <TableCell>{student.email}</TableCell>
                        <TableCell>{student.phone}</TableCell>
                        <TableCell>
                          <Badge variant={student.status === "enrolled" ? "default" : "secondary"}>
                            {student.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div
                                className="bg-blue-600 h-2 rounded-full"
                                style={{ width: `${attendanceRate * 100}%` }}
                              />
                            </div>
                            <span className="text-sm">{Math.round(attendanceRate * 100)}%</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant="outline" asChild>
                              <a href={`mailto:${student.email}`}>
                                <Mail className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <a href={`tel:${student.phone}`}>
                                <Phone className="h-4 w-4" />
                              </a>
                            </Button>
                            <Button size="sm" variant="outline" asChild>
                              <Link href={`/educator/students/${student.id}`}>
                                <User className="h-4 w-4" />
                              </Link>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Attendance Management</h3>
              <p className="text-sm text-muted-foreground">
                {currentSession ? `Currently viewing: ${currentSession.title}` : "Select a session to mark attendance"}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={selectedSession} onValueChange={setSelectedSession}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="Select session" />
                </SelectTrigger>
                <SelectContent>
                  {sessions.map((session) => (
                    <SelectItem key={session.id} value={session.id}>
                      Session {session.sessionNumber}: {session.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={saveAttendance} disabled={!currentSession}>
                <Save className="mr-2 h-4 w-4" />
                Save Attendance
              </Button>
            </div>
          </div>

          {currentSession && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>{currentSession.title}</CardTitle>
                    <p className="text-sm text-muted-foreground mt-1">
                      {new Date(currentSession.date).toLocaleDateString("en-GB")} • {currentSession.startTime} -{" "}
                      {currentSession.endTime} • {currentSession.location}
                    </p>
                  </div>
                  <Badge
                    variant={
                      currentSession.status === "completed"
                        ? "default"
                        : currentSession.status === "in-progress"
                          ? "secondary"
                          : currentSession.status === "cancelled"
                            ? "destructive"
                            : "outline"
                    }
                  >
                    {currentSession.status}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium mb-4">Mark Attendance</h4>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Student</TableHead>
                          <TableHead>Present</TableHead>
                          <TableHead>Status</TableHead>
                          <TableHead>Notes</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {students.map((student) => (
                          <TableRow key={student.id}>
                            <TableCell className="font-medium">{student.name}</TableCell>
                            <TableCell>
                              <Checkbox
                                checked={student.attendance[selectedSession] || false}
                                onCheckedChange={() => toggleAttendance(student.id, selectedSession)}
                              />
                            </TableCell>
                            <TableCell>
                              {student.attendance[selectedSession] ? (
                                <div className="flex items-center gap-2 text-green-600">
                                  <CheckCircle className="h-4 w-4" />
                                  Present
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 text-red-600">
                                  <XCircle className="h-4 w-4" />
                                  Absent
                                </div>
                              )}
                            </TableCell>
                            <TableCell>
                              <Input placeholder="Add notes..." className="w-48" />
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>

                  <div>
                    <Label htmlFor="session-notes">Session Notes</Label>
                    <Textarea
                      id="session-notes"
                      value={currentSession.notes}
                      onChange={(e) => {
                        const updatedSessions = sessions.map((session) =>
                          session.id === selectedSession ? { ...session, notes: e.target.value } : session,
                        )
                        setSessions(updatedSessions)
                      }}
                      placeholder="Add notes about this session..."
                      rows={3}
                      className="mt-1"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Grades Tab */}
        <TabsContent value="grades" className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-medium">Grade Management</h3>
              <p className="text-sm text-muted-foreground">Enter and manage student grades for all assessments</p>
            </div>
            <Button onClick={saveGrades}>
              <Save className="mr-2 h-4 w-4" />
              Save All Grades
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Assessment Overview</CardTitle>
              <p className="text-sm text-muted-foreground">Assessment criteria configured by admin</p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                {assessments.map((assessment) => (
                  <Card key={assessment.id}>
                    <CardContent className="p-4">
                      <div className="space-y-2">
                        <h4 className="font-medium">{assessment.name}</h4>
                        <p className="text-sm text-muted-foreground">{assessment.description}</p>
                        <div className="flex items-center justify-between text-sm">
                          <span>Weight: {assessment.weight}%</span>
                          <span>Pass Rate: {assessment.passRate}%</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Student Grades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background">Student</TableHead>
                      {assessments.map((assessment) => (
                        <TableHead key={assessment.id} className="text-center min-w-[200px]">
                          <div className="space-y-1">
                            <div className="font-medium">{assessment.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Weight: {assessment.weight}% | Pass: {assessment.passRate}%
                            </div>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="text-center min-w-[120px]">Overall</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => {
                      const totalWeightedScore = assessments.reduce((sum, assessment) => {
                        const grade = student.grades[assessment.id]
                        return sum + (grade?.score || 0) * (assessment.weight / 100)
                      }, 0)

                      const overallStatus = assessments.every((assessment) => {
                        const grade = student.grades[assessment.id]
                        return grade?.score >= assessment.passRate
                      })
                        ? "pass"
                        : "fail"

                      return (
                        <TableRow key={student.id}>
                          <TableCell className="sticky left-0 bg-background font-medium">{student.name}</TableCell>
                          {assessments.map((assessment) => {
                            const grade = student.grades[assessment.id] || {
                              score: 0,
                              status: "pending",
                              notes: "",
                              lastUpdated: "",
                            }
                            return (
                              <TableCell key={assessment.id} className="text-center">
                                <div className="space-y-2">
                                  <div className="flex items-center justify-center gap-1">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={grade.score}
                                      onChange={(e) => updateGrade(student.id, assessment.id, Number(e.target.value))}
                                      className="w-16 h-8 text-center"
                                    />
                                    <span className="text-sm">%</span>
                                  </div>
                                  <Badge
                                    variant={
                                      grade.status === "pass"
                                        ? "default"
                                        : grade.status === "fail"
                                          ? "destructive"
                                          : "outline"
                                    }
                                    className="text-xs"
                                  >
                                    {grade.status}
                                  </Badge>
                                  <Textarea
                                    value={grade.notes}
                                    onChange={(e) => updateGradeNotes(student.id, assessment.id, e.target.value)}
                                    placeholder="Notes..."
                                    rows={2}
                                    className="w-full text-xs"
                                  />
                                  {grade.lastUpdated && (
                                    <div className="text-xs text-muted-foreground">
                                      Updated: {new Date(grade.lastUpdated).toLocaleDateString("en-GB")}
                                    </div>
                                  )}
                                </div>
                              </TableCell>
                            )
                          })}
                          <TableCell className="text-center">
                            <div className="space-y-1">
                              <div className="font-medium">{totalWeightedScore.toFixed(1)}%</div>
                              <Badge variant={overallStatus === "pass" ? "default" : "destructive"} className="text-xs">
                                {overallStatus}
                              </Badge>
                            </div>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notices Tab */}
        <TabsContent value="notices" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Class Notices</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Notice
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Notice</DialogTitle>
                      <DialogDescription>Post a notice for your students</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Title</Label>
                        <Input
                          value={newNotice.title}
                          onChange={(e) => setNewNotice((prev) => ({ ...prev, title: e.target.value }))}
                          placeholder="Notice title..."
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Content</Label>
                        <Textarea
                          value={newNotice.content}
                          onChange={(e) => setNewNotice((prev) => ({ ...prev, content: e.target.value }))}
                          placeholder="Notice content..."
                          rows={4}
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select
                            value={newNotice.type}
                            onValueChange={(value) =>
                              setNewNotice((prev) => ({ ...prev, type: value as "info" | "warning" | "urgent" }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="info">Information</SelectItem>
                              <SelectItem value="warning">Warning</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Audience</Label>
                          <Select
                            value={newNotice.audience}
                            onValueChange={(value) =>
                              setNewNotice((prev) => ({ ...prev, audience: value as "students" }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="students">Students</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setNewNotice({ title: "", content: "", type: "info", audience: "students" })}
                        >
                          Cancel
                        </Button>
                        <Button onClick={addNotice}>Post Notice</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {notices.map((notice) => (
                <Alert
                  key={notice.id}
                  className={
                    notice.type === "urgent"
                      ? "border-red-200 bg-red-50"
                      : notice.type === "warning"
                        ? "border-yellow-200 bg-yellow-50"
                        : "border-blue-200 bg-blue-50"
                  }
                >
                  <Bell className="h-4 w-4" />
                  <div className="flex items-start justify-between w-full">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{notice.title}</div>
                        <Badge variant="outline" className="text-xs">
                          {notice.targetAudience}
                        </Badge>
                        <Badge
                          variant={
                            notice.type === "urgent"
                              ? "destructive"
                              : notice.type === "warning"
                                ? "secondary"
                                : "default"
                          }
                          className="text-xs"
                        >
                          {notice.type}
                        </Badge>
                      </div>
                      <AlertDescription>{notice.content}</AlertDescription>
                      <div className="text-xs text-muted-foreground">
                        By {notice.createdBy} • {new Date(notice.createdDate).toLocaleDateString("en-GB")}
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Alert>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Resources Tab */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Class Resources</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a
                      href="https://moodle.pulseacademy.com/course/view.php?id=123"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <ExternalLink className="mr-2 h-4 w-4" />
                      Open VLE (Moodle)
                    </a>
                  </Button>
                  <Button size="sm">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Resource
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Visibility</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map((resource) => (
                    <TableRow key={resource.id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4 text-muted-foreground" />
                          <span className="font-medium">{resource.name}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{resource.type}</Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{resource.size}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          {resource.visibility === "students" ? (
                            <Eye className="h-4 w-4 text-green-600" />
                          ) : (
                            <EyeOff className="h-4 w-4 text-gray-600" />
                          )}
                          <span className="text-sm capitalize">{resource.visibility}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(resource.uploadedDate).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Download className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Submit Invoice Modal */}
      <Dialog open={showInvoiceModal} onOpenChange={setShowInvoiceModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Submit Invoice for Class</DialogTitle>
            <DialogDescription>Submit an invoice for this class to admin for approval</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Amount (£)</Label>
              <Input
                type="number"
                step="0.01"
                min="0"
                value={invoiceForm.amount}
                onChange={(e) => setInvoiceForm((prev) => ({ ...prev, amount: e.target.value }))}
                placeholder="0.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={invoiceForm.category}
                onValueChange={(value) => setInvoiceForm((prev) => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="teaching">Teaching Fee</SelectItem>
                  <SelectItem value="materials">Materials</SelectItem>
                  <SelectItem value="travel">Travel Expenses</SelectItem>
                  <SelectItem value="accommodation">Accommodation</SelectItem>
                  <SelectItem value="equipment">Equipment</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea
                value={invoiceForm.description}
                onChange={(e) => setInvoiceForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Invoice description..."
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={invoiceForm.date}
                onChange={(e) => setInvoiceForm((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowInvoiceModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmitInvoice}>Submit Invoice</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
