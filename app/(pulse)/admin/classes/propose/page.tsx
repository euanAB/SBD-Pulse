"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Calendar,
  MapPin,
  PoundSterling,
  Users,
  FileText,
  Info,
  BookOpen,
  Save,
  Send,
  X,
  Search,
  UserPlus,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

type Session = {
  id: string
  title: string
  date: string
  start: string
  end: string
  location: string
}

type InterestedStudent = {
  id: string
  name: string
  email: string
  phone: string
  enquiryDate: string
  notes: string
}

const COURSES = [
  {
    id: "CRS-001",
    title: "First Aid Level 1",
    duration: "1 day",
    description: "Basic first aid training covering essential life-saving skills",
    outline: "CPR, wound care, emergency response, choking procedures",
  },
  {
    id: "CRS-002",
    title: "CPR Essentials",
    duration: "1 day",
    description: "Cardiopulmonary resuscitation training for adults and children",
    outline: "Adult CPR, child CPR, AED usage, recovery position",
  },
  {
    id: "CRS-003",
    title: "Safeguarding Basics",
    duration: "2 days",
    description: "Child protection and safeguarding awareness training",
    outline: "Recognizing abuse, reporting procedures, legal requirements, documentation",
  },
  {
    id: "CRS-004",
    title: "Manual Handling",
    duration: "1 day",
    description: "Safe lifting and handling techniques to prevent injury",
    outline: "Risk assessment, lifting techniques, equipment usage, workplace safety",
  },
  {
    id: "CRS-005",
    title: "First Aid Level 2",
    duration: "2 days",
    description: "Advanced first aid training with practical assessments",
    outline: "Advanced CPR, trauma care, medical emergencies, practical assessments",
  },
]

const EDUCATORS = [
  { id: "E-001", name: "Alex Taylor", specialties: ["First Aid", "CPR"], rate: 650, available: true },
  { id: "E-002", name: "R. Patel", specialties: ["CPR", "Manual Handling"], rate: 600, available: true },
  { id: "E-003", name: "M. Evans", specialties: ["Safeguarding", "First Aid"], rate: 580, available: false },
  { id: "E-004", name: "J. Smith", specialties: ["Manual Handling", "Health & Safety"], rate: 520, available: true },
  { id: "E-005", name: "C. Garcia", specialties: ["First Aid", "Advanced Training"], rate: 750, available: true },
]

const MOCK_INTERESTED_STUDENTS: InterestedStudent[] = [
  {
    id: "S-001",
    name: "Sarah Johnson",
    email: "sarah.j@email.com",
    phone: "07123 456789",
    enquiryDate: "2025-01-05",
    notes: "Interested in weekend sessions, works in healthcare",
  },
  {
    id: "S-002",
    name: "Mike Chen",
    email: "mike.chen@company.com",
    phone: "07987 654321",
    enquiryDate: "2025-01-03",
    notes: "Corporate booking for team of 5, flexible on dates",
  },
  {
    id: "S-003",
    name: "Emma Wilson",
    email: "emma.w@email.com",
    phone: "07555 123456",
    enquiryDate: "2024-12-28",
    notes: "Teacher, needs certification for school requirements",
  },
  {
    id: "S-004",
    name: "David Brown",
    email: "d.brown@email.com",
    phone: "07444 987654",
    enquiryDate: "2024-12-20",
    notes: "Previous student, looking for refresher course",
  },
]

export default function ProposeClassPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = React.useState(1)
  const [isDraft, setIsDraft] = React.useState(false)

  // Step 1: Course & Basic Details
  const [courseId, setCourseId] = React.useState("")
  const [classTitle, setClassTitle] = React.useState("")
  const [capacity, setCapacity] = React.useState("12")
  const [baseLocation, setBaseLocation] = React.useState("")
  const [description, setDescription] = React.useState("")

  // Step 2: Sessions & Schedule
  const [sessions, setSessions] = React.useState<Session[]>([
    { id: "1", title: "", date: "", start: "09:00", end: "16:00", location: "" },
  ])

  // Step 3: Educator & Pricing
  const [educatorId, setEducatorId] = React.useState("")
  const [rateType, setRateType] = React.useState<"flat" | "hourly">("flat")
  const [customRate, setCustomRate] = React.useState("")
  const [expenses, setExpenses] = React.useState("0")
  const [studentFee, setStudentFee] = React.useState("")
  const [paymentTerms, setPaymentTerms] = React.useState("Net 7 days")

  // Step 4: Interested Students & Notes
  const [selectedStudents, setSelectedStudents] = React.useState<string[]>([])
  const [studentSearch, setStudentSearch] = React.useState("")
  const [internalNotes, setInternalNotes] = React.useState("")
  const [educatorNotes, setEducatorNotes] = React.useState("")

  const selectedCourse = COURSES.find((c) => c.id === courseId)
  const selectedEducator = EDUCATORS.find((e) => e.id === educatorId)
  const capacityNum = Math.max(0, Number.parseInt(capacity || "0"))

  // Filter interested students based on search
  const filteredStudents = React.useMemo(() => {
    return MOCK_INTERESTED_STUDENTS.filter(
      (student) =>
        student.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.email.toLowerCase().includes(studentSearch.toLowerCase()) ||
        student.notes.toLowerCase().includes(studentSearch.toLowerCase()),
    )
  }, [studentSearch])

  // Auto-populate rate when educator is selected
  React.useEffect(() => {
    if (selectedEducator && !customRate) {
      setCustomRate(selectedEducator.rate.toString())
    }
  }, [selectedEducator, customRate])

  // Auto-populate class title when course is selected
  React.useEffect(() => {
    if (selectedCourse && !classTitle) {
      setClassTitle(selectedCourse.title)
    }
  }, [selectedCourse, classTitle])

  // Validation
  const validStep1 = Boolean(courseId && capacityNum > 0 && baseLocation.trim())
  const validStep2 =
    sessions.length > 0 && sessions.every((s) => s.title && s.date && s.start && s.end && s.start < s.end)
  const validStep3 =
    Boolean(educatorId) &&
    Number.isFinite(Number.parseFloat(customRate)) &&
    Number.isFinite(Number.parseFloat(studentFee))
  const validStep4 = true // Notes and students are optional

  const canProceed =
    (step === 1 && validStep1) || (step === 2 && validStep2) || (step === 3 && validStep3) || step === 4

  function addSession() {
    setSessions((prev) => [
      ...prev,
      { id: `${Date.now()}`, title: "", date: "", start: "09:00", end: "16:00", location: baseLocation },
    ])
  }

  function updateSession(id: string, patch: Partial<Session>) {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }

  function removeSession(id: string) {
    setSessions((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev))
  }

  function toggleStudent(studentId: string) {
    setSelectedStudents((prev) =>
      prev.includes(studentId) ? prev.filter((id) => id !== studentId) : [...prev, studentId],
    )
  }

  function saveDraft() {
    setIsDraft(true)
    toast({
      title: "Draft saved",
      description: "Your class proposal has been saved as a draft. You can continue editing later.",
    })
    // In production: save to database with draft status
  }

  function sendProposal() {
    if (!(validStep1 && validStep2 && validStep3)) {
      toast({
        title: "Incomplete proposal",
        description: "Please complete all required fields before sending.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Proposal sent!",
      description: `${selectedCourse?.title} proposal sent to ${selectedEducator?.name}`,
    })

    // In production: create proposal record, notify educator, redirect to classes list
    router.push("/admin/classes")
  }

  const totalHours = sessions.reduce((total, session) => {
    if (session.start && session.end) {
      const start = new Date(`2000-01-01T${session.start}`)
      const end = new Date(`2000-01-01T${session.end}`)
      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    }
    return total
  }, 0)

  const estimatedEducatorCost =
    rateType === "hourly" ? totalHours * Number.parseFloat(customRate || "0") : Number.parseFloat(customRate || "0")

  const estimatedRevenue = capacityNum * Number.parseFloat(studentFee || "0")
  const estimatedProfit = estimatedRevenue - estimatedEducatorCost - Number.parseFloat(expenses || "0")

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Propose New Class</h1>
          <p className="text-muted-foreground">Create a comprehensive class proposal for educator review</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href="/admin/classes">
              <X className="mr-2 h-4 w-4" />
              Cancel
            </Link>
          </Button>
          <Button variant="outline" onClick={saveDraft}>
            <Save className="mr-2 h-4 w-4" />
            Save Draft
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-2">
        {[1, 2, 3, 4].map((i) => (
          <React.Fragment key={i}>
            <div
              className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
                step === i
                  ? "bg-primary text-primary-foreground"
                  : step > i
                    ? "bg-green-100 text-green-700"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {step > i ? "✓" : i}
            </div>
            {i < 4 && <div className={`w-12 h-0.5 ${step > i ? "bg-green-200" : "bg-muted"}`} />}
          </React.Fragment>
        ))}
      </div>

      {/* Step Content */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Course & Basic Details
            </CardTitle>
            <CardDescription>Select the course and define basic class parameters</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Course *</Label>
                <Select value={courseId} onValueChange={setCourseId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a course" />
                  </SelectTrigger>
                  <SelectContent>
                    {COURSES.map((course) => (
                      <SelectItem key={course.id} value={course.id}>
                        <div className="flex flex-col">
                          <span>{course.title}</span>
                          <span className="text-xs text-muted-foreground">
                            {course.duration} • {course.description}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="capacity">Maximum Students *</Label>
                <div className="relative">
                  <Users className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="capacity"
                    type="number"
                    min="1"
                    max="50"
                    value={capacity}
                    onChange={(e) => setCapacity(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="classTitle">Class Title</Label>
                <Input
                  id="classTitle"
                  placeholder={selectedCourse ? `${selectedCourse.title} - Custom Title` : "Enter custom class title"}
                  value={classTitle}
                  onChange={(e) => setClassTitle(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  Leave blank to use the course title, or customize for specific audiences
                </p>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="baseLocation">Primary Location *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="baseLocation"
                    placeholder="Training Room A, Conference Center, etc."
                    value={baseLocation}
                    onChange={(e) => setBaseLocation(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Class Description</Label>
                <Textarea
                  id="description"
                  placeholder="Additional details about this specific class offering..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                />
              </div>
            </div>

            {selectedCourse && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  <strong>{selectedCourse.title}</strong> - {selectedCourse.description}
                  <br />
                  <span className="text-sm">Duration: {selectedCourse.duration}</span>
                  <br />
                  <span className="text-sm">Outline: {selectedCourse.outline}</span>
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Sessions & Schedule
            </CardTitle>
            <CardDescription>Define when and where the class will take place</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-lg border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[80px]">Session</TableHead>
                    <TableHead>Session Title</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Start Time</TableHead>
                    <TableHead>End Time</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="w-[100px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((session, index) => (
                    <TableRow key={session.id}>
                      <TableCell className="font-medium">#{index + 1}</TableCell>
                      <TableCell>
                        <Input
                          placeholder={`Session ${index + 1} - Topic/Focus`}
                          value={session.title}
                          onChange={(e) => updateSession(session.id, { title: e.target.value })}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="date"
                          value={session.date}
                          onChange={(e) => updateSession(session.id, { date: e.target.value })}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="time"
                          value={session.start}
                          onChange={(e) => updateSession(session.id, { start: e.target.value })}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="time"
                          value={session.end}
                          onChange={(e) => updateSession(session.id, { end: e.target.value })}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          placeholder={baseLocation || "Specific room/area"}
                          value={session.location}
                          onChange={(e) => updateSession(session.id, { location: e.target.value })}
                          className="w-full"
                        />
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSession(session.id)}
                          disabled={sessions.length === 1}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">
                {sessions.length} session{sessions.length !== 1 ? "s" : ""} • Total: {totalHours.toFixed(1)} hours
              </div>
              <Button variant="outline" onClick={addSession}>
                Add Session
              </Button>
            </div>

            {!validStep2 && sessions.some((s) => s.date && s.start && s.end) && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription>
                  Please ensure all sessions have titles, complete date and time information, with end times after start
                  times.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PoundSterling className="h-5 w-5" />
              Educator & Pricing
            </CardTitle>
            <CardDescription>Assign educator and set financial terms</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Educator *</Label>
                <Select value={educatorId} onValueChange={setEducatorId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select educator" />
                  </SelectTrigger>
                  <SelectContent>
                    {EDUCATORS.map((educator) => (
                      <SelectItem key={educator.id} value={educator.id} disabled={!educator.available}>
                        <div className="flex items-center justify-between w-full">
                          <div className="flex flex-col">
                            <span>{educator.name}</span>
                            <span className="text-xs text-muted-foreground">
                              {educator.specialties.join(", ")} • £{educator.rate} standard rate
                            </span>
                          </div>
                          {!educator.available && (
                            <Badge variant="outline" className="ml-2">
                              Unavailable
                            </Badge>
                          )}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Rate Type</Label>
                <Select value={rateType} onValueChange={(v) => setRateType(v as "flat" | "hourly")}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="flat">Flat Rate (per class)</SelectItem>
                    <SelectItem value="hourly">Hourly Rate</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="customRate">Educator Rate (£) *</Label>
                <div className="relative">
                  <PoundSterling className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="customRate"
                    type="number"
                    min="0"
                    step="0.01"
                    value={customRate}
                    onChange={(e) => setCustomRate(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {rateType === "hourly"
                    ? `Total: £${(totalHours * Number.parseFloat(customRate || "0")).toFixed(2)} for ${totalHours.toFixed(1)} hours`
                    : "One-time payment for entire class"}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="studentFee">Student Fee (£) *</Label>
                <div className="relative">
                  <PoundSterling className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="studentFee"
                    type="number"
                    min="0"
                    step="0.01"
                    value={studentFee}
                    onChange={(e) => setStudentFee(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Max revenue: £{(capacityNum * Number.parseFloat(studentFee || "0")).toFixed(2)} ({capacityNum}{" "}
                  students)
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expenses">Additional Expenses (£)</Label>
                <div className="relative">
                  <PoundSterling className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="expenses"
                    type="number"
                    min="0"
                    step="0.01"
                    value={expenses}
                    onChange={(e) => setExpenses(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <p className="text-xs text-muted-foreground">Materials, venue, equipment costs</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="paymentTerms">Payment Terms</Label>
                <Select value={paymentTerms} onValueChange={setPaymentTerms}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Net 7 days">Net 7 days</SelectItem>
                    <SelectItem value="Net 14 days">Net 14 days</SelectItem>
                    <SelectItem value="Net 30 days">Net 30 days</SelectItem>
                    <SelectItem value="Upon completion">Upon completion</SelectItem>
                    <SelectItem value="50% upfront, 50% completion">50% upfront, 50% completion</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="rounded-lg border bg-muted/50 p-4">
              <h4 className="font-medium mb-3">Financial Summary</h4>
              <div className="grid gap-2 text-sm">
                <div className="flex justify-between">
                  <span>Educator Cost:</span>
                  <span>£{estimatedEducatorCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Additional Expenses:</span>
                  <span>£{Number.parseFloat(expenses || "0").toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Potential Revenue:</span>
                  <span>£{estimatedRevenue.toFixed(2)}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-medium">
                  <span>Estimated Profit:</span>
                  <span className={estimatedProfit >= 0 ? "text-green-600" : "text-red-600"}>
                    £{estimatedProfit.toFixed(2)}
                  </span>
                </div>
                <div className="text-xs text-muted-foreground">
                  Margin: {estimatedRevenue > 0 ? ((estimatedProfit / estimatedRevenue) * 100).toFixed(1) : 0}%
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {step === 4 && (
        <div className="space-y-6">
          {/* Interested Students */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="h-5 w-5" />
                Add Interested Students
              </CardTitle>
              <CardDescription>
                Select students who have expressed interest for internal tracking and outreach
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search students by name, email, or notes..."
                  value={studentSearch}
                  onChange={(e) => setStudentSearch(e.target.value)}
                  className="pl-10"
                />
              </div>

              <div className="grid gap-3 max-h-64 overflow-y-auto">
                {filteredStudents.map((student) => (
                  <div
                    key={student.id}
                    className="flex items-start gap-3 p-3 border rounded-lg hover:bg-muted/50 cursor-pointer"
                    onClick={() => toggleStudent(student.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault()
                        toggleStudent(student.id)
                      }
                    }}
                    aria-label={`Toggle ${student.name}`}
                  >
                    <Checkbox
                      checked={selectedStudents.includes(student.id)}
                      onCheckedChange={() => toggleStudent(student.id)}
                      onClick={(e) => e.stopPropagation()}
                      aria-label={`Select ${student.name}`}
                    />
                    <div className="flex-1 space-y-1">
                      <div className="flex items-center justify-between">
                        <div className="font-medium">{student.name}</div>
                        <div className="text-xs text-muted-foreground">
                          Enquiry: {new Date(student.enquiryDate).toLocaleDateString("en-GB")}
                        </div>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        {student.email} • {student.phone}
                      </div>
                      <div className="text-xs text-muted-foreground">{student.notes}</div>
                    </div>
                  </div>
                ))}
              </div>

              {selectedStudents.length > 0 && (
                <div className="p-3 bg-blue-50 rounded-lg">
                  <div className="text-sm font-medium text-blue-900">
                    {selectedStudents.length} student{selectedStudents.length !== 1 ? "s" : ""} selected for outreach
                  </div>
                  <div className="text-xs text-blue-700 mt-1">
                    These students will be flagged for priority contact when enrollment opens
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Notes & Review */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Notes & Review
              </CardTitle>
              <CardDescription>Add notes and review your proposal before sending</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="educatorNotes">Notes for Educator</Label>
                  <Textarea
                    id="educatorNotes"
                    placeholder="Special instructions, requirements, or context for the educator..."
                    value={educatorNotes}
                    onChange={(e) => setEducatorNotes(e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">
                    These notes will be included in the proposal sent to the educator
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="internalNotes">Internal Notes</Label>
                  <Textarea
                    id="internalNotes"
                    placeholder="Internal context, admin notes, special considerations..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                    rows={4}
                  />
                  <p className="text-xs text-muted-foreground">For internal use only - not shared with educator</p>
                </div>
              </div>

              {/* Proposal Summary */}
              <div className="rounded-lg border">
                <div className="p-4 border-b">
                  <h4 className="font-medium">Proposal Summary</h4>
                </div>
                <div className="p-4 space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Class Details</div>
                      <div className="text-sm text-muted-foreground">
                        <div>{classTitle || selectedCourse?.title}</div>
                        <div>
                          {selectedCourse?.id} • {capacityNum} students max
                        </div>
                        <div>{baseLocation}</div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Educator</div>
                      <div className="text-sm text-muted-foreground">
                        <div>{selectedEducator?.name}</div>
                        <div>
                          £{estimatedEducatorCost.toFixed(2)} ({rateType} rate)
                        </div>
                        <div>{paymentTerms}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="text-sm font-medium">Schedule ({sessions.length} sessions)</div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      {sessions.map((session, index) => (
                        <div key={session.id}>
                          <strong>{session.title || `Session ${index + 1}`}</strong>:{" "}
                          {session.date ? new Date(session.date).toLocaleDateString("en-GB") : "TBD"} • {session.start}{" "}
                          - {session.end} • {session.location || baseLocation}
                        </div>
                      ))}
                    </div>
                  </div>

                  {selectedStudents.length > 0 && (
                    <div className="space-y-2">
                      <div className="text-sm font-medium">Interested Students ({selectedStudents.length})</div>
                      <div className="text-sm text-muted-foreground">
                        {selectedStudents
                          .map((id) => MOCK_INTERESTED_STUDENTS.find((s) => s.id === id)?.name)
                          .filter(Boolean)
                          .join(", ")}
                      </div>
                    </div>
                  )}

                  <div className="grid gap-4 md:grid-cols-3">
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Student Fee</div>
                      <div className="text-lg font-bold">£{Number.parseFloat(studentFee || "0").toFixed(2)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Max Revenue</div>
                      <div className="text-lg font-bold">£{estimatedRevenue.toFixed(2)}</div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-sm font-medium">Est. Profit</div>
                      <div className={`text-lg font-bold ${estimatedProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                        £{estimatedProfit.toFixed(2)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          Previous
        </Button>

        <div className="flex items-center gap-2">
          {step < 4 ? (
            <Button onClick={() => setStep((s) => Math.min(4, s + 1))} disabled={!canProceed}>
              Next Step
            </Button>
          ) : (
            <Button
              onClick={sendProposal}
              disabled={!(validStep1 && validStep2 && validStep3)}
              className="bg-green-600 hover:bg-green-700"
            >
              <Send className="mr-2 h-4 w-4" />
              Send Proposal
            </Button>
          )}
        </div>
      </div>

      {isDraft && (
        <Alert>
          <Save className="h-4 w-4" />
          <AlertDescription>
            This proposal has been saved as a draft. You can continue editing or send it when ready.
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
