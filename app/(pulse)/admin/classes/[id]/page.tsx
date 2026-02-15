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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Calendar,
  Users,
  PoundSterling,
  MapPin,
  Mail,
  MessageSquare,
  Upload,
  Download,
  Edit,
  Trash2,
  Plus,
  Eye,
  EyeOff,
  FileText,
  Bell,
  Receipt,
  TrendingUp,
  TrendingDown,
  CheckCircle,
  XCircle,
  Clock,
  Search,
  Send,
  UserX,
  Shield,
  ExternalLink,
  Check,
  X,
  FileSignature,
  RotateCcw,
  ArrowUpDown,
  AlertTriangle,
  Pen,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type StudentStatus = "enrolled" | "pending" | "completed" | "dropped"
type PaymentStatus = "paid" | "pending" | "overdue" | "partial"
type GradeStatus = "pass" | "fail" | "pending" | "absent"
type InvoiceStatus = "pending" | "approved" | "paid" | "rejected"
type ExpenseStatus = "pending" | "approved" | "paid" | "rejected"

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
  moodleAccess: boolean
  attendance: Record<string, boolean>
  grades: Record<string, { score: number; status: GradeStatus; notes: string }>
}

type AvailableStudent = {
  id: string
  name: string
  email: string
  phone: string
  lastActive: string
  previousCourses: number
}

type ClassInvoice = {
  id: string
  educatorName: string
  amount: number
  description: string
  uploadDate: string
  status: InvoiceStatus
  filename: string
  notes?: string
  rejectedReason?: string
  reAcceptedDate?: string
}

type ClassExpense = {
  id: string
  date: string
  description: string
  amount: number
  category: string
  receipt?: string
  submittedBy: string
  status: ExpenseStatus
  approvedBy?: string
  approvedDate?: string
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
}

/* ------------------------------------------------------------------ */
/*  Mock data                                                          */
/* ------------------------------------------------------------------ */

const sessions = [
  { id: "session-1", title: "Session 1 - Introduction & Basics", date: "2025-01-15", time: "09:00 - 12:00", location: "Training Room A" },
  { id: "session-2", title: "Session 2 - CPR & Recovery", date: "2025-01-22", time: "09:00 - 12:00", location: "Training Room A" },
  { id: "session-3", title: "Session 3 - Trauma & Practical", date: "2025-01-29", time: "09:00 - 12:00", location: "Training Room A" },
  { id: "session-4", title: "Session 4 - Final Assessment", date: "2025-02-05", time: "09:00 - 13:00", location: "Training Room B" },
]

const mockStudents: Student[] = [
  {
    id: "S-001", name: "Sarah Johnson", email: "sarah.j@email.com", phone: "07123 456789",
    status: "enrolled", paymentStatus: "paid", amountPaid: 850, courseFee: 850, enrolledDate: "2025-01-05",
    moodleAccess: true,
    attendance: { "session-1": true, "session-2": true, "session-3": false, "session-4": false },
    grades: {
      practical: { score: 85, status: "pass", notes: "Excellent technique" },
      theory: { score: 92, status: "pass", notes: "Strong understanding" },
      exam: { score: 78, status: "pass", notes: "Good performance" },
    },
  },
  {
    id: "S-002", name: "Mike Chen", email: "mike.chen@company.com", phone: "07987 654321",
    status: "enrolled", paymentStatus: "partial", amountPaid: 400, courseFee: 850, enrolledDate: "2025-01-03",
    moodleAccess: true,
    attendance: { "session-1": true, "session-2": true, "session-3": true, "session-4": false },
    grades: {
      practical: { score: 78, status: "pass", notes: "Good progress" },
      theory: { score: 0, status: "pending", notes: "Not yet assessed" },
      exam: { score: 0, status: "pending", notes: "Not yet taken" },
    },
  },
  {
    id: "S-003", name: "Emma Wilson", email: "emma.w@email.com", phone: "07555 123456",
    status: "completed", paymentStatus: "paid", amountPaid: 850, courseFee: 850, enrolledDate: "2024-12-28",
    moodleAccess: false,
    attendance: { "session-1": true, "session-2": true, "session-3": true, "session-4": true },
    grades: {
      practical: { score: 95, status: "pass", notes: "Outstanding performance" },
      theory: { score: 88, status: "pass", notes: "Very good knowledge" },
      exam: { score: 91, status: "pass", notes: "Excellent result" },
    },
  },
]

const mockAvailableStudents: AvailableStudent[] = [
  { id: "AS-001", name: "James Rodriguez", email: "james.r@email.com", phone: "07111 222333", lastActive: "2025-01-10", previousCourses: 2 },
  { id: "AS-002", name: "Lisa Thompson", email: "lisa.t@email.com", phone: "07444 555666", lastActive: "2025-01-08", previousCourses: 0 },
  { id: "AS-003", name: "David Park", email: "david.p@email.com", phone: "07777 888999", lastActive: "2025-01-05", previousCourses: 1 },
]

const mockInvoices: ClassInvoice[] = [
  { id: "INV-001", educatorName: "Alex Taylor", amount: 650, description: "Teaching services - First Aid Level 1", uploadDate: "2025-01-12", status: "approved", filename: "invoice-alex-taylor-jan2025.pdf", notes: "Standard teaching fee as per contract" },
  { id: "INV-002", educatorName: "Alex Taylor", amount: 75, description: "Additional session preparation", uploadDate: "2025-01-10", status: "pending", filename: "invoice-prep-work.pdf" },
  { id: "INV-003", educatorName: "Alex Taylor", amount: 120, description: "Travel expenses reimbursement", uploadDate: "2025-01-08", status: "rejected", filename: "invoice-travel.pdf", rejectedReason: "Missing receipts - please resubmit with documentation" },
]

const mockExpenses: ClassExpense[] = [
  { id: "EXP-001", date: "2025-01-10", description: "Training materials and mannequins", amount: 120.50, category: "Equipment", receipt: "receipt-001.pdf", submittedBy: "Alex Taylor", status: "approved", approvedBy: "Admin", approvedDate: "2025-01-11" },
  { id: "EXP-002", date: "2025-01-08", description: "Venue hire additional hours", amount: 75.00, category: "Venue", submittedBy: "Alex Taylor", status: "paid", approvedBy: "Admin", approvedDate: "2025-01-09" },
  { id: "EXP-003", date: "2025-01-12", description: "Refreshments for students", amount: 45.00, category: "Catering", submittedBy: "Alex Taylor", status: "pending" },
]

const mockResources: ClassResource[] = [
  { id: "RES-001", name: "First Aid Manual 2025.pdf", type: "PDF", size: "2.4 MB", uploadedBy: "Alex Taylor", uploadedDate: "2025-01-05", visibility: "students", url: "/resources/first-aid-manual.pdf" },
  { id: "RES-002", name: "CPR Technique Video.mp4", type: "Video", size: "45.2 MB", uploadedBy: "Admin", uploadedDate: "2025-01-03", visibility: "students", url: "/resources/cpr-video.mp4" },
  { id: "RES-003", name: "Assessment Rubric.docx", type: "Document", size: "156 KB", uploadedBy: "Alex Taylor", uploadedDate: "2025-01-02", visibility: "educators", url: "/resources/assessment-rubric.docx" },
]

const mockNotices: ClassNotice[] = [
  { id: "NOT-001", title: "Session 3 Location Change", content: "Please note that Session 3 will be held in Training Room B instead of Training Room A due to maintenance.", type: "warning", createdBy: "Admin", createdDate: "2025-01-08", targetAudience: "all" },
  { id: "NOT-002", title: "Bring Photo ID for Certification", content: "All students must bring valid photo identification for the final assessment and certification process.", type: "info", createdBy: "Alex Taylor", createdDate: "2025-01-05", targetAudience: "students" },
]

const defaultAssessments: AssessmentType[] = [
  { id: "practical", name: "Practical Assessment", weight: 40, passRate: 70 },
  { id: "theory", name: "Theory Assessment", weight: 30, passRate: 70 },
  { id: "exam", name: "Final Exam", weight: 30, passRate: 60 },
]

/* ER Agreement mock data */
const erAgreement = {
  proposalId: "PROP-2025-004",
  sentDate: "2024-12-20",
  educatorName: "Alex Taylor",
  educatorEmail: "alex.taylor@educator.com",
  courseName: "First Aid Level 1",
  location: "Training Room A, Sheffield Training Centre",
  startDate: "2025-01-15",
  endDate: "2025-02-05",
  totalSessions: 4,
  totalHours: 13,
  ratePerHour: 50,
  totalCompensation: 650,
  travelAllowance: 0,
  additionalNotes: "Standard contract terms apply. Educator to provide own DBS certificate. Materials provided by academy.",
  status: "accepted" as const,
  acceptedDate: "2024-12-22",
  signedDate: "2024-12-22",
  signedName: "Alex Taylor",
  signedIP: "192.168.1.45",
  declinedReason: null as string | null,
  contractPdfUrl: "/contracts/PROP-2025-004-signed.pdf",
  timeline: [
    { date: "2024-12-20", event: "Proposal sent to educator", by: "Admin" },
    { date: "2024-12-21", event: "Proposal viewed by educator", by: "Alex Taylor" },
    { date: "2024-12-22", event: "Proposal accepted and signed", by: "Alex Taylor" },
    { date: "2024-12-22", event: "Contract generated and filed", by: "System" },
    { date: "2025-01-02", event: "Class status changed to Enrolling", by: "Admin" },
    { date: "2025-01-15", event: "Class status changed to Teaching", by: "System" },
  ],
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function ClassDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [students, setStudents] = React.useState(mockStudents)
  const [availableStudents, setAvailableStudents] = React.useState(mockAvailableStudents)
  const [invoices, setInvoices] = React.useState(mockInvoices)
  const [expenses, setExpenses] = React.useState(mockExpenses)
  const [resources, setResources] = React.useState(mockResources)
  const [notices, setNotices] = React.useState(mockNotices)
  const [assessments, setAssessments] = React.useState(defaultAssessments)
  const [selectedStudents, setSelectedStudents] = React.useState<string[]>([])
  const [bulkAction, setBulkAction] = React.useState("")
  const [expenseFilter, setExpenseFilter] = React.useState("all")
  const [invoiceFilter, setInvoiceFilter] = React.useState("all")
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedAvailableStudents, setSelectedAvailableStudents] = React.useState<string[]>([])

  // Modal states
  const [showAddStudentModal, setShowAddStudentModal] = React.useState(false)
  const [showBulkEmailModal, setShowBulkEmailModal] = React.useState(false)
  const [showBulkSMSModal, setShowBulkSMSModal] = React.useState(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = React.useState(false)
  const [showAddAssessmentModal, setShowAddAssessmentModal] = React.useState(false)
  const [showReAcceptModal, setShowReAcceptModal] = React.useState<string | null>(null)

  // Form states
  const [bulkEmailForm, setBulkEmailForm] = React.useState({ subject: "", message: "" })
  const [bulkSMSForm, setBulkSMSForm] = React.useState({ message: "" })
  const [expenseForm, setExpenseForm] = React.useState({ description: "", amount: "", category: "", date: new Date().toISOString().split("T")[0] })
  const [assessmentForm, setAssessmentForm] = React.useState({ name: "", weight: "", passRate: "" })
  const [reAcceptReason, setReAcceptReason] = React.useState("")

  const [newNotice, setNewNotice] = React.useState({ title: "", content: "", type: "info" as const, audience: "all" as const })

  const classId = params.id

  /* ---- Calculated financials ---- */
  const paidStudents = students.filter((s) => s.paymentStatus === "paid")
  const partialStudents = students.filter((s) => s.paymentStatus === "partial")
  const actualRevenue = students.reduce((sum, s) => sum + s.amountPaid, 0)
  const expectedRevenue = students.reduce((sum, s) => sum + s.courseFee, 0)
  const outstandingPayments = expectedRevenue - actualRevenue

  const approvedInvoices = invoices.filter((i) => i.status === "approved" || i.status === "paid")
  const totalApprovedInvoices = approvedInvoices.reduce((sum, i) => sum + i.amount, 0)
  const paidInvoiceTotal = invoices.filter((i) => i.status === "paid").reduce((sum, i) => sum + i.amount, 0)
  const pendingInvoiceTotal = invoices.filter((i) => i.status === "pending" || i.status === "approved").reduce((sum, i) => sum + i.amount, 0)

  const approvedExpenses = expenses.filter((e) => e.status === "approved" || e.status === "paid")
  const totalApprovedExpenses = approvedExpenses.reduce((sum, e) => sum + e.amount, 0)
  const paidExpenseTotal = expenses.filter((e) => e.status === "paid").reduce((sum, e) => sum + e.amount, 0)
  const pendingExpenseTotal = expenses.filter((e) => e.status === "pending" || e.status === "approved").reduce((sum, e) => sum + e.amount, 0)

  const totalCosts = totalApprovedExpenses + totalApprovedInvoices
  const totalPaidOut = paidInvoiceTotal + paidExpenseTotal
  const totalPendingOut = pendingInvoiceTotal + pendingExpenseTotal
  const currentProfit = actualRevenue - totalCosts
  const projectedProfit = expectedRevenue - totalCosts

  const filteredExpenses = expenses.filter((e) => expenseFilter === "all" ? true : e.status === expenseFilter)
  const filteredInvoices = invoices.filter((i) => invoiceFilter === "all" ? true : i.status === invoiceFilter)

  const filteredAvailableStudents = availableStudents.filter(
    (s) => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  /* ---- Handlers ---- */

  const toggleAttendance = (studentId: string, sessionId: string) => {
    setStudents((prev) =>
      prev.map((s) =>
        s.id === studentId
          ? { ...s, attendance: { ...s.attendance, [sessionId]: !s.attendance[sessionId] } }
          : s,
      ),
    )
    toast({ title: "Attendance updated", description: "Student attendance record has been updated" })
  }

  const handleAddStudents = () => {
    if (selectedAvailableStudents.length === 0) {
      toast({ title: "No students selected", description: "Please select students to add.", variant: "destructive" })
      return
    }
    const toAdd = availableStudents.filter((s) => selectedAvailableStudents.includes(s.id))
    const newStudents: Student[] = toAdd.map((s) => ({
      id: s.id, name: s.name, email: s.email, phone: s.phone,
      status: "enrolled", paymentStatus: "pending", amountPaid: 0, courseFee: 850,
      enrolledDate: new Date().toISOString().split("T")[0], moodleAccess: true, attendance: {}, grades: {},
    }))
    setStudents([...students, ...newStudents])
    setAvailableStudents(availableStudents.filter((s) => !selectedAvailableStudents.includes(s.id)))
    setSelectedAvailableStudents([])
    setShowAddStudentModal(false)
    toast({ title: "Students added", description: `${toAdd.length} students added to the class` })
  }

  const handleInviteStudents = () => {
    if (selectedAvailableStudents.length === 0) {
      toast({ title: "No students selected", description: "Please select students to invite.", variant: "destructive" })
      return
    }
    toast({ title: "Invitations sent", description: `Course invitations sent to ${selectedAvailableStudents.length} students` })
    setSelectedAvailableStudents([])
    setShowAddStudentModal(false)
  }

  const handleBulkAction = () => {
    if (selectedStudents.length === 0) {
      toast({ title: "No students selected", description: "Please select students first.", variant: "destructive" })
      return
    }
    switch (bulkAction) {
      case "email": setShowBulkEmailModal(true); break
      case "sms": setShowBulkSMSModal(true); break
      case "block-moodle":
        setStudents(students.map((s) => selectedStudents.includes(s.id) ? { ...s, moodleAccess: false } : s))
        toast({ title: "Moodle access blocked", description: `${selectedStudents.length} students blocked` })
        break
      case "remove":
        setStudents(students.filter((s) => !selectedStudents.includes(s.id)))
        toast({ title: "Students removed", description: `${selectedStudents.length} students removed` })
        break
    }
    setSelectedStudents([])
    setBulkAction("")
  }

  const handleSendBulkEmail = () => {
    if (!bulkEmailForm.subject || !bulkEmailForm.message) {
      toast({ title: "Incomplete form", description: "Fill in subject and message", variant: "destructive" })
      return
    }
    toast({ title: "Bulk email sent", description: `Email sent to ${selectedStudents.length} students` })
    setBulkEmailForm({ subject: "", message: "" })
    setShowBulkEmailModal(false)
    setSelectedStudents([])
  }

  const handleSendBulkSMS = () => {
    if (!bulkSMSForm.message) {
      toast({ title: "Message required", description: "Please enter a message", variant: "destructive" })
      return
    }
    toast({ title: "Bulk SMS sent", description: `SMS sent to ${selectedStudents.length} students` })
    setBulkSMSForm({ message: "" })
    setShowBulkSMSModal(false)
    setSelectedStudents([])
  }

  const handleAddExpense = () => {
    if (!expenseForm.description || !expenseForm.amount || !expenseForm.category) {
      toast({ title: "Incomplete form", description: "Fill in all required fields", variant: "destructive" })
      return
    }
    const ne: ClassExpense = {
      id: `EXP-${Date.now()}`, date: expenseForm.date, description: expenseForm.description,
      amount: Number(expenseForm.amount), category: expenseForm.category, submittedBy: "Admin", status: "pending",
    }
    setExpenses([ne, ...expenses])
    setExpenseForm({ description: "", amount: "", category: "", date: new Date().toISOString().split("T")[0] })
    setShowAddExpenseModal(false)
    toast({ title: "Expense added", description: "Expense submitted for approval" })
  }

  const handleAddAssessment = () => {
    if (!assessmentForm.name || !assessmentForm.weight || !assessmentForm.passRate) {
      toast({ title: "Incomplete form", description: "Fill in all fields", variant: "destructive" })
      return
    }
    const na: AssessmentType = {
      id: assessmentForm.name.toLowerCase().replace(/\s+/g, "-"),
      name: assessmentForm.name, weight: Number(assessmentForm.weight), passRate: Number(assessmentForm.passRate),
    }
    setAssessments([...assessments, na])
    setStudents(students.map((s) => ({ ...s, grades: { ...s.grades, [na.id]: { score: 0, status: "pending" as GradeStatus, notes: "" } } })))
    setAssessmentForm({ name: "", weight: "", passRate: "" })
    setShowAddAssessmentModal(false)
    toast({ title: "Assessment added", description: "New assessment type created" })
  }

  const updateInvoiceStatus = (invoiceId: string, status: InvoiceStatus) => {
    setInvoices(invoices.map((i) => i.id === invoiceId ? { ...i, status } : i))
    toast({ title: "Invoice updated", description: `Invoice status changed to ${status}` })
  }

  const handleReAcceptInvoice = (invoiceId: string) => {
    setInvoices(invoices.map((i) =>
      i.id === invoiceId
        ? { ...i, status: "approved" as InvoiceStatus, reAcceptedDate: new Date().toISOString().split("T")[0], notes: reAcceptReason ? `Re-accepted: ${reAcceptReason}` : i.notes }
        : i,
    ))
    setShowReAcceptModal(null)
    setReAcceptReason("")
    toast({ title: "Invoice re-accepted", description: "Previously rejected invoice has been approved" })
  }

  const updateExpenseStatus = (expenseId: string, status: ExpenseStatus) => {
    setExpenses(expenses.map((e) =>
      e.id === expenseId
        ? { ...e, status, approvedBy: status === "approved" || status === "paid" ? "Admin" : e.approvedBy, approvedDate: status === "approved" || status === "paid" ? new Date().toISOString().split("T")[0] : e.approvedDate }
        : e,
    ))
    toast({ title: "Expense updated", description: `Expense status changed to ${status}` })
  }

  const addNotice = () => {
    if (!newNotice.title || !newNotice.content) {
      toast({ title: "Incomplete notice", description: "Fill in title and content", variant: "destructive" })
      return
    }
    const n: ClassNotice = { id: `NOT-${Date.now()}`, ...newNotice, createdBy: "Admin", createdDate: new Date().toISOString().split("T")[0], targetAudience: newNotice.audience }
    setNotices([n, ...notices])
    setNewNotice({ title: "", content: "", type: "info", audience: "all" })
    toast({ title: "Notice added", description: "Class notice posted" })
  }

  /* ------------------------------------------------------------------ */
  /*  Render                                                             */
  /* ------------------------------------------------------------------ */

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">First Aid Level 1 - Morning Session</h1>
          <div className="flex flex-wrap items-center gap-4 mt-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-1"><Calendar className="h-4 w-4" />Jan 15 - Feb 05, 2025</div>
            <div className="flex items-center gap-1"><MapPin className="h-4 w-4" />Training Room A</div>
            <div className="flex items-center gap-1"><Users className="h-4 w-4" />{students.filter((s) => s.status === "enrolled").length} / 12 students</div>
            <Badge variant="default">Teaching</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Edit className="mr-2 h-4 w-4" />Edit Class</Button>
          <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Export Data</Button>
        </div>
      </div>

      {/* Financial Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Actual Revenue</p>
                <p className="text-2xl font-bold tabular-nums text-green-600">{"£"}{actualRevenue.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{paidStudents.length} paid, {partialStudents.length} partial</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Costs</p>
                <p className="text-2xl font-bold tabular-nums text-red-600">{"£"}{totalCosts.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{"£"}{totalApprovedInvoices.toFixed(2)} invoices + {"£"}{totalApprovedExpenses.toFixed(2)} expenses</p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Current Profit</p>
                <p className={`text-2xl font-bold tabular-nums ${currentProfit >= 0 ? "text-green-600" : "text-red-600"}`}>{"£"}{currentProfit.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Margin: {actualRevenue > 0 ? ((currentProfit / actualRevenue) * 100).toFixed(1) : 0}%</p>
              </div>
              <PoundSterling className={`h-8 w-8 ${currentProfit >= 0 ? "text-green-600" : "text-red-600"}`} />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Outstanding</p>
                <p className="text-2xl font-bold tabular-nums text-orange-600">{"£"}{outstandingPayments.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{students.filter((s) => s.paymentStatus !== "paid").length} students owe</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Tabs */}
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList className="flex flex-wrap h-auto gap-1">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="notices">Notices</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
          <TabsTrigger value="agreement">ER Agreement</TabsTrigger>
        </TabsList>

        {/* ============ STUDENTS TAB ============ */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                <CardTitle>Student Management</CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <Select value={bulkAction} onValueChange={setBulkAction}>
                    <SelectTrigger className="w-[180px]"><SelectValue placeholder="Bulk actions" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Send Email</SelectItem>
                      <SelectItem value="sms">Send SMS</SelectItem>
                      <SelectItem value="block-moodle">Block Moodle</SelectItem>
                      <SelectItem value="remove">Remove from Class</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleBulkAction} disabled={!bulkAction || selectedStudents.length === 0}>Apply</Button>
                  <Button size="sm" onClick={() => setShowAddStudentModal(true)}><Plus className="mr-2 h-4 w-4" />Add Student</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox checked={selectedStudents.length === students.length} onCheckedChange={(checked) => { setSelectedStudents(checked ? students.map((s) => s.id) : []) }} />
                    </TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Course Fee</TableHead>
                    <TableHead>Moodle</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Checkbox checked={selectedStudents.includes(student.id)} onCheckedChange={(checked) => { setSelectedStudents(checked ? [...selectedStudents, student.id] : selectedStudents.filter((id) => id !== student.id)) }} />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5">
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                          <div className="text-sm text-muted-foreground">{student.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell><Badge variant={student.status === "enrolled" ? "default" : student.status === "completed" ? "secondary" : student.status === "dropped" ? "destructive" : "outline"}>{student.status}</Badge></TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge variant={student.paymentStatus === "paid" ? "default" : student.paymentStatus === "partial" ? "secondary" : student.paymentStatus === "overdue" ? "destructive" : "outline"}>{student.paymentStatus}</Badge>
                          <div className="text-sm text-muted-foreground tabular-nums">{"£"}{student.amountPaid} / {"£"}{student.courseFee}</div>
                        </div>
                      </TableCell>
                      <TableCell><div className="font-medium tabular-nums">{"£"}{student.courseFee}</div></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {student.moodleAccess ? <CheckCircle className="h-4 w-4 text-green-600" /> : <XCircle className="h-4 w-4 text-red-600" />}
                          <span className="text-sm">{student.moodleAccess ? "Active" : "Blocked"}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm">{new Date(student.enrolledDate).toLocaleDateString("en-GB")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm"><Mail className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm"><MessageSquare className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm" onClick={() => { setStudents(students.map((s) => s.id === student.id ? { ...s, moodleAccess: !s.moodleAccess } : s)) }}>
                            {student.moodleAccess ? <Shield className="h-4 w-4" /> : <UserX className="h-4 w-4" />}
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

        {/* ============ ATTENDANCE TAB — admin override ============ */}
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Attendance Tracking</CardTitle>
                <p className="text-sm text-muted-foreground">Click any cell to override attendance</p>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background min-w-[140px]">Student</TableHead>
                      {sessions.map((s) => (
                        <TableHead key={s.id} className="text-center min-w-[150px]">
                          <div className="space-y-0.5">
                            <div className="font-medium text-xs">{s.title}</div>
                            <div className="text-xs text-muted-foreground">{new Date(s.date).toLocaleDateString("en-GB")} {s.time}</div>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="text-center">Rate</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => {
                      const attended = sessions.filter((s) => student.attendance[s.id]).length
                      const rate = sessions.length > 0 ? (attended / sessions.length) * 100 : 0
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="sticky left-0 bg-background font-medium">{student.name}</TableCell>
                          {sessions.map((session) => {
                            const present = student.attendance[session.id]
                            return (
                              <TableCell key={session.id} className="text-center">
                                <Button
                                  variant={present ? "default" : "outline"}
                                  size="sm"
                                  className={`w-full gap-1 ${present ? "bg-green-600 hover:bg-green-700 text-white" : "hover:bg-red-50"}`}
                                  onClick={() => toggleAttendance(student.id, session.id)}
                                >
                                  {present ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
                                  {present ? "Present" : "Absent"}
                                </Button>
                              </TableCell>
                            )
                          })}
                          <TableCell className="text-center">
                            <div className="flex items-center justify-center gap-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div className="bg-primary h-2 rounded-full transition-all" style={{ width: `${rate}%` }} />
                              </div>
                              <span className="text-sm font-medium tabular-nums">{rate.toFixed(0)}%</span>
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

        {/* ============ GRADES TAB ============ */}
        <TabsContent value="grades" className="space-y-4">
          {/* Assessment overview cards — admin-configurable */}
          <div className="grid gap-4 md:grid-cols-3">
            {assessments.map((a) => (
              <Card key={a.id}>
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="font-semibold">{a.name}</h4>
                    <Button variant="ghost" size="sm" onClick={() => {
                      const newName = prompt("Assessment name:", a.name)
                      if (!newName) return
                      const newWeight = prompt("Weight (%):", String(a.weight))
                      if (!newWeight) return
                      const newPass = prompt("Pass rate (%):", String(a.passRate))
                      if (!newPass) return
                      setAssessments(assessments.map((x) => x.id === a.id ? { ...x, name: newName, weight: Number(newWeight), passRate: Number(newPass) } : x))
                      toast({ title: "Assessment updated", description: `${newName} criteria saved` })
                    }}><Pen className="h-3 w-3" /></Button>
                  </div>
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Weight: {a.weight}%</span>
                    <span>Pass Rate: {a.passRate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div className="bg-primary h-2 rounded-full" style={{ width: `${a.weight}%` }} />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Grade Management</CardTitle>
                <Button size="sm" onClick={() => setShowAddAssessmentModal(true)}><Plus className="mr-2 h-4 w-4" />Add Assessment</Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background">Student</TableHead>
                      {assessments.map((a) => (
                        <TableHead key={a.id} className="text-center min-w-[120px]">
                          <div className="space-y-0.5">
                            <div className="font-medium">{a.name}</div>
                            <div className="text-xs text-muted-foreground">W:{a.weight}% P:{a.passRate}%</div>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="text-center">Overall</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.map((student) => {
                      const total = assessments.reduce((sum, a) => { const g = student.grades[a.id]; return sum + (g?.score || 0) * (a.weight / 100) }, 0)
                      const pass = assessments.every((a) => { const g = student.grades[a.id]; return (g?.score || 0) >= a.passRate })
                      return (
                        <TableRow key={student.id}>
                          <TableCell className="sticky left-0 bg-background font-medium">{student.name}</TableCell>
                          {assessments.map((a) => {
                            const g = student.grades[a.id] || { score: 0, status: "pending" as GradeStatus, notes: "" }
                            return (
                              <TableCell key={a.id} className="text-center">
                                <div className="flex flex-col items-center gap-1">
                                  <div className="flex items-center gap-1">
                                    <Input type="number" min="0" max="100" value={g.score}
                                      onChange={(e) => {
                                        const val = Number(e.target.value)
                                        setStudents(students.map((s) => s.id === student.id ? { ...s, grades: { ...s.grades, [a.id]: { ...g, score: val, status: val >= a.passRate ? "pass" : val === 0 ? "pending" : "fail" } } } : s))
                                      }}
                                      className="w-16 h-8 text-center tabular-nums" />
                                    <span className="text-sm">%</span>
                                  </div>
                                  <Badge variant={g.status === "pass" ? "default" : g.status === "fail" ? "destructive" : "outline"} className="text-xs">{g.status}</Badge>
                                </div>
                              </TableCell>
                            )
                          })}
                          <TableCell className="text-center">
                            <div className="space-y-1">
                              <div className="font-medium tabular-nums">{total.toFixed(1)}%</div>
                              <Badge variant={pass ? "default" : "destructive"} className="text-xs">{pass ? "pass" : "fail"}</Badge>
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

        {/* ============ NOTICES TAB ============ */}
        <TabsContent value="notices" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Class Notices</CardTitle>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm"><Plus className="mr-2 h-4 w-4" />Add Notice</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Create New Notice</DialogTitle>
                      <DialogDescription>Post a notice for students and/or educators</DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2"><Label>Title</Label><Input value={newNotice.title} onChange={(e) => setNewNotice((p) => ({ ...p, title: e.target.value }))} placeholder="Notice title..." /></div>
                      <div className="space-y-2"><Label>Content</Label><Textarea value={newNotice.content} onChange={(e) => setNewNotice((p) => ({ ...p, content: e.target.value }))} placeholder="Notice content..." rows={4} /></div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                          <Label>Type</Label>
                          <Select value={newNotice.type} onValueChange={(v) => setNewNotice((p) => ({ ...p, type: v as "info" | "warning" | "urgent" }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="info">Information</SelectItem>
                              <SelectItem value="warning">Warning</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label>Audience</Label>
                          <Select value={newNotice.audience} onValueChange={(v) => setNewNotice((p) => ({ ...p, audience: v as "all" | "students" | "educators" }))}>
                            <SelectTrigger><SelectValue /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="students">Students Only</SelectItem>
                              <SelectItem value="educators">Educators Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" onClick={() => setNewNotice({ title: "", content: "", type: "info", audience: "all" })}>Cancel</Button>
                        <Button onClick={addNotice}>Post Notice</Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {notices.map((n) => (
                <Alert key={n.id} className={n.type === "urgent" ? "border-red-200 bg-red-50" : n.type === "warning" ? "border-yellow-200 bg-yellow-50" : "border-blue-200 bg-blue-50"}>
                  <Bell className="h-4 w-4" />
                  <div className="flex items-start justify-between w-full">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{n.title}</div>
                        <Badge variant="outline" className="text-xs">{n.targetAudience}</Badge>
                        <Badge variant={n.type === "urgent" ? "destructive" : n.type === "warning" ? "secondary" : "default"} className="text-xs">{n.type}</Badge>
                      </div>
                      <AlertDescription>{n.content}</AlertDescription>
                      <div className="text-xs text-muted-foreground">By {n.createdBy} &bull; {new Date(n.createdDate).toLocaleDateString("en-GB")}</div>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                      <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                    </div>
                  </div>
                </Alert>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ RESOURCES TAB ============ */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Class Resources</CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="https://moodle.pulseacademy.com/course/view.php?id=123" target="_blank" rel="noopener noreferrer"><ExternalLink className="mr-2 h-4 w-4" />Open VLE (Moodle)</a>
                  </Button>
                  <Button size="sm"><Upload className="mr-2 h-4 w-4" />Upload Resource</Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Resource</TableHead><TableHead>Type</TableHead><TableHead>Size</TableHead>
                    <TableHead>Visibility</TableHead><TableHead>Uploaded By</TableHead><TableHead>Date</TableHead><TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {resources.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell><div className="flex items-center gap-2"><FileText className="h-4 w-4 text-muted-foreground" /><span className="font-medium">{r.name}</span></div></TableCell>
                      <TableCell><Badge variant="outline">{r.type}</Badge></TableCell>
                      <TableCell className="text-sm text-muted-foreground">{r.size}</TableCell>
                      <TableCell><div className="flex items-center gap-1">{r.visibility === "students" ? <Eye className="h-4 w-4 text-green-600" /> : <EyeOff className="h-4 w-4 text-muted-foreground" />}<span className="text-sm capitalize">{r.visibility}</span></div></TableCell>
                      <TableCell className="text-sm">{r.uploadedBy}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(r.uploadedDate).toLocaleDateString("en-GB")}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm"><Download className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm"><Edit className="h-4 w-4" /></Button>
                          <Button variant="ghost" size="sm"><Trash2 className="h-4 w-4" /></Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ============ FINANCES TAB — comprehensive income & loss ============ */}
        <TabsContent value="finances" className="space-y-4">

          {/* Income & Loss Summary */}
          <Card>
            <CardHeader><CardTitle>Income & Loss Overview</CardTitle></CardHeader>
            <CardContent>
              <div className="grid gap-6 md:grid-cols-2">
                {/* Income side */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-green-700 flex items-center gap-2"><TrendingUp className="h-4 w-4" /> Income</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span>Student fees collected</span><span className="font-medium tabular-nums text-green-600">{"£"}{actualRevenue.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span>Expected total revenue</span><span className="font-medium tabular-nums">{"£"}{expectedRevenue.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span>Outstanding fees</span><span className="font-medium tabular-nums text-orange-600">{"£"}{outstandingPayments.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span>Collection rate</span><span className="font-medium tabular-nums">{expectedRevenue > 0 ? ((actualRevenue / expectedRevenue) * 100).toFixed(1) : 0}%</span></div>
                  </div>
                  <div className="border-t pt-3 space-y-1">
                    <h5 className="text-sm font-medium text-muted-foreground">Per Student Breakdown</h5>
                    {students.map((s) => (
                      <div key={s.id} className="flex justify-between text-sm">
                        <span>{s.name}</span>
                        <div className="flex items-center gap-2">
                          <span className="tabular-nums">{"£"}{s.amountPaid} / {"£"}{s.courseFee}</span>
                          <Badge variant={s.paymentStatus === "paid" ? "default" : s.paymentStatus === "partial" ? "secondary" : "destructive"} className="text-xs">{s.paymentStatus}</Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Loss / Costs side */}
                <div className="space-y-4">
                  <h4 className="font-semibold text-red-700 flex items-center gap-2"><TrendingDown className="h-4 w-4" /> Costs & Outgoings</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm"><span>Educator invoices (approved)</span><span className="font-medium tabular-nums text-red-600">{"£"}{totalApprovedInvoices.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span>Class expenses (approved)</span><span className="font-medium tabular-nums text-red-600">{"£"}{totalApprovedExpenses.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span>Total paid out</span><span className="font-medium tabular-nums">{"£"}{totalPaidOut.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span>Pending payment</span><span className="font-medium tabular-nums text-orange-600">{"£"}{totalPendingOut.toFixed(2)}</span></div>
                  </div>
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex justify-between font-semibold"><span>Current Profit</span><span className={`tabular-nums ${currentProfit >= 0 ? "text-green-600" : "text-red-600"}`}>{"£"}{currentProfit.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span>Projected Profit (all fees collected)</span><span className="tabular-nums font-medium">{"£"}{projectedProfit.toFixed(2)}</span></div>
                    <div className="flex justify-between text-sm"><span>Profit Margin (current)</span><span className="tabular-nums font-medium">{actualRevenue > 0 ? ((currentProfit / actualRevenue) * 100).toFixed(1) : 0}%</span></div>
                    <div className="flex justify-between text-sm"><span>Profit Margin (projected)</span><span className="tabular-nums font-medium">{expectedRevenue > 0 ? ((projectedProfit / expectedRevenue) * 100).toFixed(1) : 0}%</span></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Invoices with re-accept */}
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Educator Invoices</CardTitle>
                  <Select value={invoiceFilter} onValueChange={setInvoiceFilter}>
                    <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Show All</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {filteredInvoices.map((inv) => (
                  <div key={inv.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{inv.description}</div>
                      <div className="text-sm text-muted-foreground">{inv.educatorName} &bull; {new Date(inv.uploadDate).toLocaleDateString("en-GB")}</div>
                      <div className="text-sm text-muted-foreground">{inv.filename}</div>
                      {inv.notes && <div className="text-xs text-muted-foreground">{inv.notes}</div>}
                      {inv.rejectedReason && <div className="text-xs text-red-600 flex items-center gap-1"><AlertTriangle className="h-3 w-3" />{inv.rejectedReason}</div>}
                      {inv.reAcceptedDate && <div className="text-xs text-green-600 flex items-center gap-1"><RotateCcw className="h-3 w-3" />Re-accepted on {inv.reAcceptedDate}</div>}
                    </div>
                    <div className="text-right space-y-2 shrink-0 ml-4">
                      <div className="font-medium tabular-nums">{"£"}{inv.amount.toFixed(2)}</div>
                      <Badge variant={inv.status === "paid" ? "default" : inv.status === "approved" ? "secondary" : inv.status === "rejected" ? "destructive" : "outline"}>{inv.status}</Badge>
                      {inv.status === "pending" && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => updateInvoiceStatus(inv.id, "approved")}><Check className="h-3 w-3" /></Button>
                          <Button size="sm" variant="outline" onClick={() => updateInvoiceStatus(inv.id, "rejected")}><X className="h-3 w-3" /></Button>
                        </div>
                      )}
                      {inv.status === "approved" && <Button size="sm" onClick={() => updateInvoiceStatus(inv.id, "paid")}>Mark Paid</Button>}
                      {inv.status === "rejected" && (
                        <Button size="sm" variant="outline" className="gap-1" onClick={() => setShowReAcceptModal(inv.id)}>
                          <RotateCcw className="h-3 w-3" />Re-accept
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Expenses */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Class Expenses</CardTitle>
                  <div className="flex items-center gap-2">
                    <Select value={expenseFilter} onValueChange={setExpenseFilter}>
                      <SelectTrigger className="w-[120px]"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Show All</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={() => setShowAddExpenseModal(true)}><Plus className="mr-2 h-4 w-4" />Add Expense</Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredExpenses.map((exp) => (
                  <div key={exp.id} className="flex items-start justify-between p-3 border rounded-lg">
                    <div className="space-y-1">
                      <div className="font-medium">{exp.description}</div>
                      <div className="text-sm text-muted-foreground">{exp.category} &bull; {new Date(exp.date).toLocaleDateString("en-GB")}</div>
                      <div className="text-xs text-muted-foreground">By {exp.submittedBy}</div>
                      {exp.approvedBy && <div className="text-xs text-muted-foreground">Approved by {exp.approvedBy} on {exp.approvedDate}</div>}
                    </div>
                    <div className="text-right space-y-2 shrink-0 ml-4">
                      <div className="font-medium tabular-nums">{"£"}{exp.amount.toFixed(2)}</div>
                      <Badge variant={exp.status === "paid" ? "default" : exp.status === "approved" ? "secondary" : exp.status === "rejected" ? "destructive" : "outline"}>{exp.status}</Badge>
                      {exp.status === "pending" && (
                        <div className="flex gap-1">
                          <Button size="sm" variant="outline" onClick={() => updateExpenseStatus(exp.id, "approved")}><Check className="h-3 w-3" /></Button>
                          <Button size="sm" variant="outline" onClick={() => updateExpenseStatus(exp.id, "rejected")}><X className="h-3 w-3" /></Button>
                        </div>
                      )}
                      {exp.status === "approved" && <Button size="sm" onClick={() => updateExpenseStatus(exp.id, "paid")}>Mark Paid</Button>}
                      {exp.receipt && <Button variant="ghost" size="sm" className="h-6 px-2"><Receipt className="h-3 w-3" /></Button>}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ============ ER AGREEMENT TAB ============ */}
        <TabsContent value="agreement" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2"><FileSignature className="h-5 w-5" /> Educator Agreement</CardTitle>
                <Badge variant={erAgreement.status === "accepted" ? "default" : "destructive"}>{erAgreement.status === "accepted" ? "Accepted & Signed" : "Declined"}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">

              {/* Agreement overview */}
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">Proposal Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Proposal ID</span><span className="font-medium">{erAgreement.proposalId}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Educator</span><span className="font-medium">{erAgreement.educatorName}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Email</span><span className="font-medium">{erAgreement.educatorEmail}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Course</span><span className="font-medium">{erAgreement.courseName}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Location</span><span className="font-medium">{erAgreement.location}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Dates</span><span className="font-medium">{new Date(erAgreement.startDate).toLocaleDateString("en-GB")} - {new Date(erAgreement.endDate).toLocaleDateString("en-GB")}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Sessions</span><span className="font-medium">{erAgreement.totalSessions} sessions ({erAgreement.totalHours} hours)</span></div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Compensation</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between"><span className="text-muted-foreground">Rate per hour</span><span className="font-medium tabular-nums">{"£"}{erAgreement.ratePerHour.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Total compensation</span><span className="font-semibold tabular-nums text-lg">{"£"}{erAgreement.totalCompensation.toFixed(2)}</span></div>
                    <div className="flex justify-between"><span className="text-muted-foreground">Travel allowance</span><span className="font-medium tabular-nums">{"£"}{erAgreement.travelAllowance.toFixed(2)}</span></div>
                  </div>

                  <div className="border-t pt-4 space-y-2">
                    <h4 className="font-semibold">Signature Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between"><span className="text-muted-foreground">Sent</span><span className="font-medium">{new Date(erAgreement.sentDate).toLocaleDateString("en-GB")}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Accepted</span><span className="font-medium">{erAgreement.acceptedDate ? new Date(erAgreement.acceptedDate).toLocaleDateString("en-GB") : "N/A"}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">Signed as</span><span className="font-medium italic">{erAgreement.signedName || "N/A"}</span></div>
                      <div className="flex justify-between"><span className="text-muted-foreground">IP Address</span><span className="font-mono text-xs">{erAgreement.signedIP || "N/A"}</span></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Additional notes */}
              {erAgreement.additionalNotes && (
                <div className="space-y-2">
                  <h4 className="font-semibold">Additional Notes</h4>
                  <p className="text-sm text-muted-foreground">{erAgreement.additionalNotes}</p>
                </div>
              )}

              {/* Contract download */}
              <div className="flex items-center gap-3 p-4 border rounded-lg bg-muted/30">
                <FileText className="h-8 w-8 text-muted-foreground" />
                <div className="flex-1">
                  <p className="font-medium">Signed Contract Document</p>
                  <p className="text-sm text-muted-foreground">{erAgreement.contractPdfUrl}</p>
                </div>
                <Button variant="outline" size="sm"><Download className="mr-2 h-4 w-4" />Download PDF</Button>
              </div>

              {/* Timeline */}
              <div className="space-y-2">
                <h4 className="font-semibold">Agreement Timeline</h4>
                <div className="relative space-y-0">
                  {erAgreement.timeline.map((event, i) => (
                    <div key={i} className="flex gap-4 pb-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full border-2 ${i === erAgreement.timeline.length - 1 ? "bg-primary border-primary" : "bg-background border-muted-foreground/40"}`} />
                        {i < erAgreement.timeline.length - 1 && <div className="w-px flex-1 bg-muted-foreground/20" />}
                      </div>
                      <div className="pb-2">
                        <p className="text-sm font-medium">{event.event}</p>
                        <p className="text-xs text-muted-foreground">{new Date(event.date).toLocaleDateString("en-GB")} &bull; {event.by}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* ============ MODALS ============ */}

      {/* Add Student Modal */}
      <Dialog open={showAddStudentModal} onOpenChange={setShowAddStudentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Students to Class</DialogTitle>
            <DialogDescription>Search and select students to add or invite</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search students by name or email..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9" />
            </div>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox checked={selectedAvailableStudents.length === filteredAvailableStudents.length && filteredAvailableStudents.length > 0} onCheckedChange={(checked) => { setSelectedAvailableStudents(checked ? filteredAvailableStudents.map((s) => s.id) : []) }} />
                    </TableHead>
                    <TableHead>Student</TableHead><TableHead>Last Active</TableHead><TableHead>Previous Courses</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAvailableStudents.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <Checkbox checked={selectedAvailableStudents.includes(s.id)} onCheckedChange={(checked) => { setSelectedAvailableStudents(checked ? [...selectedAvailableStudents, s.id] : selectedAvailableStudents.filter((id) => id !== s.id)) }} />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-0.5"><div className="font-medium">{s.name}</div><div className="text-sm text-muted-foreground">{s.email}</div><div className="text-sm text-muted-foreground">{s.phone}</div></div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">{new Date(s.lastActive).toLocaleDateString("en-GB")}</TableCell>
                      <TableCell className="text-sm">{s.previousCourses}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between">
              <div className="text-sm text-muted-foreground">{selectedAvailableStudents.length} students selected</div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAddStudentModal(false)}>Cancel</Button>
                <Button variant="outline" onClick={handleInviteStudents}><Send className="mr-2 h-4 w-4" />Send Invites</Button>
                <Button onClick={handleAddStudents}>Add to Class</Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk Email Modal */}
      <Dialog open={showBulkEmailModal} onOpenChange={setShowBulkEmailModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Bulk Email</DialogTitle>
            <DialogDescription>Send to {selectedStudents.length} students</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Subject</Label><Input value={bulkEmailForm.subject} onChange={(e) => setBulkEmailForm((p) => ({ ...p, subject: e.target.value }))} placeholder="Email subject..." /></div>
            <div className="space-y-2"><Label>Message</Label><Textarea value={bulkEmailForm.message} onChange={(e) => setBulkEmailForm((p) => ({ ...p, message: e.target.value }))} placeholder="Email message..." rows={6} /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBulkEmailModal(false)}>Cancel</Button>
              <Button onClick={handleSendBulkEmail}><Send className="mr-2 h-4 w-4" />Send Email</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk SMS Modal */}
      <Dialog open={showBulkSMSModal} onOpenChange={setShowBulkSMSModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Bulk SMS</DialogTitle>
            <DialogDescription>Send to {selectedStudents.length} students</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea value={bulkSMSForm.message} onChange={(e) => setBulkSMSForm((p) => ({ ...p, message: e.target.value }))} placeholder="SMS message..." rows={4} maxLength={600} />
              <div className="text-xs text-muted-foreground text-right">{bulkSMSForm.message.length}/600 characters</div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBulkSMSModal(false)}>Cancel</Button>
              <Button onClick={handleSendBulkSMS}><MessageSquare className="mr-2 h-4 w-4" />Send SMS</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Expense Modal */}
      <Dialog open={showAddExpenseModal} onOpenChange={setShowAddExpenseModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Class Expense</DialogTitle>
            <DialogDescription>Add a new expense for this class</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Description</Label><Input value={expenseForm.description} onChange={(e) => setExpenseForm((p) => ({ ...p, description: e.target.value }))} placeholder="Expense description..." /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>{"Amount (£)"}</Label><Input type="number" step="0.01" min="0" value={expenseForm.amount} onChange={(e) => setExpenseForm((p) => ({ ...p, amount: e.target.value }))} placeholder="0.00" /></div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select value={expenseForm.category} onValueChange={(v) => setExpenseForm((p) => ({ ...p, category: v }))}>
                  <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Equipment">Equipment</SelectItem>
                    <SelectItem value="Venue">Venue</SelectItem>
                    <SelectItem value="Catering">Catering</SelectItem>
                    <SelectItem value="Materials">Materials</SelectItem>
                    <SelectItem value="Transport">Transport</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2"><Label>Date</Label><Input type="date" value={expenseForm.date} onChange={(e) => setExpenseForm((p) => ({ ...p, date: e.target.value }))} /></div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddExpenseModal(false)}>Cancel</Button>
              <Button onClick={handleAddExpense}>Add Expense</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Assessment Modal */}
      <Dialog open={showAddAssessmentModal} onOpenChange={setShowAddAssessmentModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Assessment Type</DialogTitle>
            <DialogDescription>Create a new assessment type for grading</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2"><Label>Assessment Name</Label><Input value={assessmentForm.name} onChange={(e) => setAssessmentForm((p) => ({ ...p, name: e.target.value }))} placeholder="e.g. Practical Assessment, Quiz, Project" /></div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2"><Label>{"Weight (%)"}</Label><Input type="number" min="0" max="100" value={assessmentForm.weight} onChange={(e) => setAssessmentForm((p) => ({ ...p, weight: e.target.value }))} placeholder="e.g. 30" /></div>
              <div className="space-y-2"><Label>{"Pass Rate (%)"}</Label><Input type="number" min="0" max="100" value={assessmentForm.passRate} onChange={(e) => setAssessmentForm((p) => ({ ...p, passRate: e.target.value }))} placeholder="e.g. 70" /></div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddAssessmentModal(false)}>Cancel</Button>
              <Button onClick={handleAddAssessment}>Add Assessment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Re-accept rejected invoice modal */}
      <Dialog open={!!showReAcceptModal} onOpenChange={() => { setShowReAcceptModal(null); setReAcceptReason("") }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2"><RotateCcw className="h-5 w-5" /> Re-accept Rejected Invoice</DialogTitle>
            <DialogDescription>This invoice was previously rejected. You can override and re-accept it.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            {showReAcceptModal && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Previously rejected reason:</strong> {invoices.find((i) => i.id === showReAcceptModal)?.rejectedReason || "No reason given"}
                </AlertDescription>
              </Alert>
            )}
            <div className="space-y-2">
              <Label>Reason for re-accepting (optional)</Label>
              <Textarea value={reAcceptReason} onChange={(e) => setReAcceptReason(e.target.value)} placeholder="e.g. Educator resubmitted with receipts attached..." rows={3} />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => { setShowReAcceptModal(null); setReAcceptReason("") }}>Cancel</Button>
              <Button onClick={() => showReAcceptModal && handleReAcceptInvoice(showReAcceptModal)}>
                <Check className="mr-2 h-4 w-4" />Re-accept Invoice
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
