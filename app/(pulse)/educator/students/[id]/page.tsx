"use client"

import * as React from "react"
import Link from "next/link"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"
import { Progress } from "@/components/ui/progress"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  ArrowLeft,
  Bell,
  BookOpen,
  Mail,
  MessageSquare,
  Phone,
  GraduationCap,
  CheckCircle,
  AlertCircle,
  User,
  Calendar,
  Clock,
  ShieldCheck,
} from "lucide-react"

type Enrollment = {
  classId: string
  courseTitle: string
  status: "Proposed" | "Accepted" | "Enrolled" | "Teaching" | "Completed" | "Declined"
  startDate?: string
  endDate?: string
  progress?: number
  grade?: string
  attendanceRate?: number
  lastActivity?: string
  location?: string
  educator?: string
}

type NoteTag = "attendance" | "general" | "behavior" | "academic" | "progress" | "communication"
type StudentStatus = "good_standing" | "active" | "needs_attention" | "completed"

type Note = {
  id: string
  at: string
  author: string
  message: string
  tags: NoteTag[]
  isEducatorNote: boolean
}

type StudentProfile = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dob: string
  verified: boolean
  status: "enrolled" | "invited" | "inactive"
  studentStatus: StudentStatus
  emergencyContact: { name: string; phone: string; relationship: string }
  photoUrl?: string
  enrollments: Enrollment[]
  notes: Note[]
  joinDate: string
  lastLogin: string
  totalCoursesCompleted: number
  certificatesEarned: number
}

function mockProfile(id: string): StudentProfile {
  const num = Number.parseInt(id.replace(/\D/g, "")) || 0
  const first = ["Jane", "John", "Amina", "Liu", "Carlos", "Maya", "Noah"][num % 7] || "Jane"
  const last = ["Doe", "Smith", "Khan", "Zhang", "Garcia", "Patel", "Evans"][num % 7] || "Doe"

  return {
    id,
    firstName: first,
    lastName: last,
    email: `${first.toLowerCase()}.${last.toLowerCase()}@example.com`,
    phone: "+44 7700 900123",
    dob: "1998-05-10",
    verified: true,
    status: "enrolled",
    studentStatus: "active",
    emergencyContact: { name: "Sarah Doe", phone: "+44 7700 900456", relationship: "Mother" },
    photoUrl: "/diverse-students-studying.png",
    joinDate: "2024-09-01",
    lastLogin: "2025-01-12",
    totalCoursesCompleted: 2,
    certificatesEarned: 2,
    enrollments: [
      {
        classId: "CLS-2025-001",
        courseTitle: "First Aid Level 2",
        status: "Teaching",
        startDate: "2025-01-14",
        endDate: "2025-02-14",
        progress: 75,
        attendanceRate: 90,
        lastActivity: "2025-01-12",
        location: "London Training Centre",
        educator: "Sarah Johnson",
      },
      {
        classId: "CLS-2024-089",
        courseTitle: "CPR Essentials",
        status: "Completed",
        startDate: "2024-11-01",
        endDate: "2024-11-30",
        progress: 100,
        grade: "Pass",
        attendanceRate: 95,
        lastActivity: "2024-11-30",
        location: "Manchester Centre",
        educator: "Mike Wilson",
      },
      {
        classId: "CLS-2024-078",
        courseTitle: "Manual Handling",
        status: "Completed",
        startDate: "2024-10-15",
        endDate: "2024-11-15",
        progress: 100,
        grade: "Pass",
        attendanceRate: 100,
        lastActivity: "2024-11-15",
        location: "Birmingham Centre",
        educator: "Sarah Johnson",
      },
    ],
    notes: [
      {
        id: "N-1",
        at: "2025-01-12T10:41:00Z",
        author: "Educator • Sarah Johnson",
        message:
          "Student is progressing excellently in practical assessments. Shows strong understanding of emergency procedures and demonstrates confidence in CPR techniques.",
        tags: ["academic", "progress"],
        isEducatorNote: true,
      },
      {
        id: "N-2",
        at: "2025-01-10T14:10:00Z",
        author: "Educator • Sarah Johnson",
        message: "Perfect attendance so far. Student is engaged and asks thoughtful questions during sessions.",
        tags: ["attendance", "behavior"],
        isEducatorNote: true,
      },
      {
        id: "N-3",
        at: "2025-01-08T09:30:00Z",
        author: "Admin • System",
        message: "Student enrollment confirmed for First Aid Level 2 course.",
        tags: ["general"],
        isEducatorNote: false,
      },
      {
        id: "N-4",
        at: "2024-11-15T16:00:00Z",
        author: "Educator • Sarah Johnson",
        message:
          "Completed Manual Handling course with excellent practical demonstration. Recommended for advanced courses.",
        tags: ["academic", "progress"],
        isEducatorNote: true,
      },
    ],
  }
}

const NOTE_TAGS: { value: NoteTag; label: string; color: string }[] = [
  { value: "general", label: "General", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  {
    value: "attendance",
    label: "Attendance",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    value: "behavior",
    label: "Behavior",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  },
  { value: "academic", label: "Academic", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
  {
    value: "progress",
    label: "Progress",
    color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300",
  },
  {
    value: "communication",
    label: "Communication",
    color: "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300",
  },
]

const STUDENT_STATUS: {
  value: StudentStatus
  label: string
  variant: "default" | "secondary" | "outline"
  icon: React.ReactNode
}[] = [
  { value: "good_standing", label: "Good Standing", variant: "default", icon: <CheckCircle className="h-4 w-4" /> },
  { value: "active", label: "Active", variant: "secondary", icon: <BookOpen className="h-4 w-4" /> },
  { value: "needs_attention", label: "Needs Attention", variant: "outline", icon: <AlertCircle className="h-4 w-4" /> },
  { value: "completed", label: "Completed", variant: "default", icon: <GraduationCap className="h-4 w-4" /> },
]

export default function EducatorStudentProfilePage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [profile, setProfile] = React.useState<StudentProfile>(() => mockProfile(params.id))

  // Derived calculations
  const fullName = `${profile.firstName} ${profile.lastName}`
  const activeEnrollments = profile.enrollments.filter((e) => ["Enrolled", "Teaching"].includes(e.status))
  const completedEnrollments = profile.enrollments.filter((e) => e.status === "Completed")
  const averageProgress =
    profile.enrollments.length > 0
      ? Math.round(profile.enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / profile.enrollments.length)
      : 0
  const averageAttendance =
    profile.enrollments.length > 0
      ? Math.round(
          profile.enrollments.reduce((sum, e) => sum + (e.attendanceRate || 0), 0) / profile.enrollments.length,
        )
      : 0

  // Notes & communication state
  const [notes, setNotes] = React.useState(profile.notes)
  const [noteText, setNoteText] = React.useState("")
  const [noteAuthor, setNoteAuthor] = React.useState("Educator • Sarah Johnson")
  const [selectedTags, setSelectedTags] = React.useState<Set<NoteTag>>(new Set())

  const addNote = () => {
    if (!noteText.trim()) return
    const newNote: Note = {
      id: `N-${Date.now()}`,
      at: new Date().toISOString(),
      author: noteAuthor || "Educator • Unknown",
      message: noteText.trim(),
      tags: Array.from(selectedTags),
      isEducatorNote: true,
    }
    setNotes((prev) => [newNote, ...prev])
    setNoteText("")
    setSelectedTags(new Set())
    toast({ title: "Note added successfully", description: "Your note has been saved to the student's record." })
  }

  // Communication modals
  const [emailOpen, setEmailOpen] = React.useState(false)
  const [smsOpen, setSmsOpen] = React.useState(false)

  // Email state
  const [emailSender, setEmailSender] = React.useState("sarah.johnson@sbd.school")
  const [emailSubject, setEmailSubject] = React.useState("")
  const [emailBody, setEmailBody] = React.useState("")

  const sendEmail = () => {
    if (!emailBody.trim()) return
    setEmailOpen(false)
    const emailNote: Note = {
      id: `N-${Date.now()}`,
      at: new Date().toISOString(),
      author: noteAuthor || "Educator • Unknown",
      message: `Email sent from ${emailSender}\nSubject: ${emailSubject || "(no subject)"}\n\n${emailBody}`,
      tags: ["communication"],
      isEducatorNote: true,
    }
    setNotes((prev) => [emailNote, ...prev])
    toast({ title: "Email sent", description: `Email sent to ${profile.email}` })
    setEmailSubject("")
    setEmailBody("")
  }

  // SMS state
  const [smsText, setSmsText] = React.useState("")
  const SMS_LIMIT = 600
  const smsRemaining = SMS_LIMIT - smsText.length

  const sendSMS = () => {
    if (!smsText.trim()) return
    setSmsOpen(false)
    const smsNote: Note = {
      id: `N-${Date.now()}`,
      at: new Date().toISOString(),
      author: noteAuthor || "Educator • Unknown",
      message: `SMS sent (${smsText.length} characters):\n\n${smsText}`,
      tags: ["communication"],
      isEducatorNote: true,
    }
    setNotes((prev) => [smsNote, ...prev])
    toast({ title: "SMS sent", description: `Message sent to ${profile.phone}` })
    setSmsText("")
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const getStatusConfig = (status: StudentStatus) => {
    return STUDENT_STATUS.find((s) => s.value === status) || STUDENT_STATUS[0]
  }

  const getEnrollmentStatusBadge = (status: string) => {
    switch (status) {
      case "Completed":
        return <Badge variant="default">Completed</Badge>
      case "Teaching":
        return <Badge variant="secondary">In Progress</Badge>
      case "Enrolled":
        return <Badge variant="outline">Enrolled</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/educator/students">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Students
            </Link>
          </Button>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{fullName}</h1>
            {profile.verified && (
              <Badge variant="secondary" className="inline-flex items-center gap-1">
                <ShieldCheck className="h-3.5 w-3.5" />
                Verified
              </Badge>
            )}
            <Badge variant="outline">{profile.id}</Badge>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" onClick={() => setEmailOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Email Student
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSmsOpen(true)}>
            <Bell className="mr-2 h-4 w-4" />
            Send SMS
          </Button>
          <Button variant="outline" size="sm" asChild>
            <a href={`tel:${profile.phone}`}>
              <Phone className="mr-2 h-4 w-4" />
              Call
            </a>
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Overall Progress</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Progress value={averageProgress} className="flex-1" />
              <span className="text-lg font-bold">{averageProgress}%</span>
            </div>
            <p className="text-xs text-muted-foreground">
              {completedEnrollments.length} of {profile.enrollments.length} courses completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <Progress value={averageAttendance} className="flex-1" />
              <span className="text-lg font-bold">{averageAttendance}%</span>
            </div>
            <p className="text-xs text-muted-foreground">Across all courses</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <BookOpen className="h-8 w-8 text-blue-600" />
            <div>
              <div className="text-2xl font-bold">{activeEnrollments.length}</div>
              <div className="text-xs text-muted-foreground">Currently enrolled</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium">Certificates</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-3">
            <GraduationCap className="h-8 w-8 text-green-600" />
            <div>
              <div className="text-2xl font-bold">{profile.certificatesEarned}</div>
              <div className="text-xs text-muted-foreground">Earned</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile & Contact</TabsTrigger>
          <TabsTrigger value="courses">Courses & Progress</TabsTrigger>
          <TabsTrigger value="notes">Notes & Communication</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Student Information
                </CardTitle>
                <CardDescription>Basic contact and emergency information for teaching purposes</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Student ID</Label>
                  <div className="rounded border p-3 bg-muted/30 font-mono text-sm">{profile.id}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Full Name</Label>
                  <div className="rounded border p-3 bg-muted/30 text-sm font-medium">{fullName}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Email Address</Label>
                  <div className="rounded border p-3 bg-muted/30 text-sm">
                    <a href={`mailto:${profile.email}`} className="text-blue-600 hover:underline">
                      {profile.email}
                    </a>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Phone Number</Label>
                  <div className="rounded border p-3 bg-muted/30 text-sm">
                    <a href={`tel:${profile.phone}`} className="text-blue-600 hover:underline">
                      {profile.phone}
                    </a>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Date of Birth</Label>
                  <div className="rounded border p-3 bg-muted/30 text-sm">{format(new Date(profile.dob), "PPP")}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Student Since</Label>
                  <div className="rounded border p-3 bg-muted/30 text-sm">{formatDate(profile.joinDate)}</div>
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label className="text-sm font-medium text-muted-foreground">Emergency Contact</Label>
                  <div className="rounded border p-4 bg-red-50 dark:bg-red-950/20">
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{profile.emergencyContact.name}</div>
                      <div className="text-sm text-muted-foreground">{profile.emergencyContact.relationship}</div>
                      <div className="text-sm">
                        <a href={`tel:${profile.emergencyContact.phone}`} className="text-blue-600 hover:underline">
                          {profile.emergencyContact.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Student Photo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-center">
                    <div className="h-32 w-32 overflow-hidden rounded-full bg-muted">
                      <img
                        src={profile.photoUrl || "/placeholder.svg?height=128&width=128&query=student-avatar"}
                        alt={fullName}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <div className="font-medium">{fullName}</div>
                    <div className="text-sm text-muted-foreground">Student since {formatDate(profile.joinDate)}</div>
                    <div className="flex items-center justify-center gap-2">
                      {getStatusConfig(profile.studentStatus).icon}
                      <Badge variant={getStatusConfig(profile.studentStatus).variant}>
                        {getStatusConfig(profile.studentStatus).label}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setEmailOpen(true)}
                  >
                    <Mail className="mr-2 h-4 w-4" />
                    Send Email
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full justify-start bg-transparent"
                    onClick={() => setSmsOpen(true)}
                  >
                    <Bell className="mr-2 h-4 w-4" />
                    Send SMS
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" asChild>
                    <a href={`tel:${profile.phone}`}>
                      <Phone className="mr-2 h-4 w-4" />
                      Call Student
                    </a>
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start bg-transparent" asChild>
                    <a href={`tel:${profile.emergencyContact.phone}`}>
                      <AlertCircle className="mr-2 h-4 w-4" />
                      Call Emergency Contact
                    </a>
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Activity Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Last Login</span>
                    <span className="font-medium">{formatDate(profile.lastLogin)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Total Courses</span>
                    <span className="font-medium">{profile.enrollments.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Completed</span>
                    <span className="font-medium">{profile.totalCoursesCompleted}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Certificates</span>
                    <span className="font-medium">{profile.certificatesEarned}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Courses Tab */}
        <TabsContent value="courses" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Course Enrollment & Progress
              </CardTitle>
              <CardDescription>All courses this student is enrolled in or has completed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class ID</TableHead>
                      <TableHead>Course Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Duration</TableHead>
                      <TableHead>Progress</TableHead>
                      <TableHead>Attendance</TableHead>
                      <TableHead>Grade</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Last Activity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profile.enrollments.map((enrollment) => (
                      <TableRow key={enrollment.classId}>
                        <TableCell className="font-medium">
                          <Link
                            href={`/educator/classes/${enrollment.classId}`}
                            className="text-blue-600 hover:underline"
                          >
                            {enrollment.classId}
                          </Link>
                        </TableCell>
                        <TableCell className="font-medium">{enrollment.courseTitle}</TableCell>
                        <TableCell>{getEnrollmentStatusBadge(enrollment.status)}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {enrollment.startDate && (
                            <div className="space-y-1">
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {formatDate(enrollment.startDate)}
                              </div>
                              {enrollment.endDate && (
                                <div className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatDate(enrollment.endDate)}
                                </div>
                              )}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {enrollment.progress != null ? (
                            <div className="flex items-center gap-2">
                              <Progress value={enrollment.progress} className="w-20" />
                              <span className="text-sm font-medium">{enrollment.progress}%</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {enrollment.attendanceRate != null ? (
                            <div className="flex items-center gap-2">
                              <Progress value={enrollment.attendanceRate} className="w-20" />
                              <span className="text-sm font-medium">{enrollment.attendanceRate}%</span>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {enrollment.grade ? (
                            <Badge variant={enrollment.grade === "Pass" ? "default" : "secondary"}>
                              {enrollment.grade}
                            </Badge>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{enrollment.location || "—"}</TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {enrollment.lastActivity ? formatDate(enrollment.lastActivity) : "—"}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes & Communication Tab */}
        <TabsContent value="notes" className="mt-6">
          <div className="grid gap-6 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquare className="h-5 w-5" />
                  Add Note
                </CardTitle>
                <CardDescription>Record observations, communications, or important information</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="noteAuthor">Author</Label>
                  <Input
                    id="noteAuthor"
                    placeholder="e.g., Educator • Your Name"
                    value={noteAuthor}
                    onChange={(e) => setNoteAuthor(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="flex flex-wrap gap-2">
                    {NOTE_TAGS.map((tag) => (
                      <button
                        key={tag.value}
                        type="button"
                        onClick={() => {
                          setSelectedTags((prev) => {
                            const newSet = new Set(prev)
                            if (newSet.has(tag.value)) {
                              newSet.delete(tag.value)
                            } else {
                              newSet.add(tag.value)
                            }
                            return newSet
                          })
                        }}
                        className={`px-2 py-1 rounded text-xs font-medium transition-colors ${
                          selectedTags.has(tag.value) ? tag.color : "bg-muted text-muted-foreground hover:bg-muted/80"
                        }`}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="note">Note</Label>
                  <Textarea
                    id="note"
                    placeholder="Add a note about this student's progress, behavior, or any important observations..."
                    value={noteText}
                    onChange={(e) => setNoteText(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={addNote} disabled={!noteText.trim()}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Note
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEmailOpen(true)}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSmsOpen(true)}>
                    <Bell className="mr-2 h-4 w-4" />
                    SMS
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Communication History</CardTitle>
                <CardDescription>All notes, messages, and communications related to this student</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-4 pr-4">
                    {notes.map((note) => (
                      <div key={note.id} className="rounded-lg border p-4 space-y-3">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="text-sm font-medium">{note.author}</div>
                            {note.isEducatorNote && (
                              <Badge variant="outline" className="text-xs">
                                Educator
                              </Badge>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{format(new Date(note.at), "PPp")}</div>
                        </div>
                        {note.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {note.tags.map((tag) => {
                              const tagConfig = NOTE_TAGS.find((t) => t.value === tag)
                              return (
                                <span
                                  key={tag}
                                  className={`px-2 py-1 rounded text-xs font-medium ${tagConfig?.color || "bg-muted text-muted-foreground"}`}
                                >
                                  {tagConfig?.label || tag}
                                </span>
                              )
                            })}
                          </div>
                        )}
                        <div className="text-sm text-muted-foreground whitespace-pre-wrap">{note.message}</div>
                      </div>
                    ))}
                    {notes.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        No notes or communications yet. Add your first note above.
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Email Modal */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Email {fullName}</DialogTitle>
            <DialogDescription>Send an email to the student</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sender">From</Label>
              <Input
                id="sender"
                value={emailSender}
                onChange={(e) => setEmailSender(e.target.value)}
                placeholder="your.name@sbd.school"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="recipient">To</Label>
              <Input id="recipient" value={profile.email} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input
                id="subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
                placeholder="Course update, assignment feedback, etc."
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Message</Label>
              <Textarea
                id="body"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
                rows={6}
                placeholder={`Hi ${profile.firstName},\n\nI wanted to reach out regarding...`}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendEmail} disabled={!emailBody.trim()}>
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SMS Modal */}
      <Dialog open={smsOpen} onOpenChange={setSmsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>SMS {fullName}</DialogTitle>
            <DialogDescription>Send a text message to {profile.phone}</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="sms">Message</Label>
              <Textarea
                id="sms"
                value={smsText}
                onChange={(e) => setSmsText(e.target.value.slice(0, SMS_LIMIT))}
                rows={6}
                maxLength={SMS_LIMIT}
                placeholder={`Hi ${profile.firstName}, this is a quick update about your course...`}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>SMS will be sent to {profile.phone}</span>
                <span className={smsRemaining < 50 ? "text-orange-600" : smsRemaining < 20 ? "text-red-600" : ""}>
                  {smsRemaining} characters remaining
                </span>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSmsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendSMS} disabled={!smsText.trim()}>
              <Bell className="mr-2 h-4 w-4" />
              Send SMS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
