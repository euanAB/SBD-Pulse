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
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

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
    moodleAccess: true,
    attendance: { "session-1": true, "session-2": true, "session-3": false },
    grades: {
      practical: { score: 85, status: "pass", notes: "Excellent technique" },
      theory: { score: 92, status: "pass", notes: "Strong understanding" },
      exam: { score: 78, status: "pass", notes: "Good performance" },
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
    moodleAccess: true,
    attendance: { "session-1": true, "session-2": true, "session-3": true },
    grades: {
      practical: { score: 78, status: "pass", notes: "Good progress" },
      theory: { score: 0, status: "pending", notes: "Not yet assessed" },
      exam: { score: 0, status: "pending", notes: "Not yet taken" },
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
    moodleAccess: false,
    attendance: { "session-1": true, "session-2": true, "session-3": true },
    grades: {
      practical: { score: 95, status: "pass", notes: "Outstanding performance" },
      theory: { score: 88, status: "pass", notes: "Very good knowledge" },
      exam: { score: 91, status: "pass", notes: "Excellent result" },
    },
  },
]

const mockAvailableStudents: AvailableStudent[] = [
  {
    id: "AS-001",
    name: "James Rodriguez",
    email: "james.r@email.com",
    phone: "07111 222333",
    lastActive: "2025-01-10",
    previousCourses: 2,
  },
  {
    id: "AS-002",
    name: "Lisa Thompson",
    email: "lisa.t@email.com",
    phone: "07444 555666",
    lastActive: "2025-01-08",
    previousCourses: 0,
  },
  {
    id: "AS-003",
    name: "David Park",
    email: "david.p@email.com",
    phone: "07777 888999",
    lastActive: "2025-01-05",
    previousCourses: 1,
  },
]

const mockInvoices: ClassInvoice[] = [
  {
    id: "INV-001",
    educatorName: "Alex Taylor",
    amount: 650,
    description: "Teaching services - First Aid Level 1",
    uploadDate: "2025-01-12",
    status: "approved",
    filename: "invoice-alex-taylor-jan2025.pdf",
    notes: "Standard teaching fee as per contract",
  },
  {
    id: "INV-002",
    educatorName: "Alex Taylor",
    amount: 75,
    description: "Additional session preparation",
    uploadDate: "2025-01-10",
    status: "pending",
    filename: "invoice-prep-work.pdf",
  },
]

const mockExpenses: ClassExpense[] = [
  {
    id: "EXP-001",
    date: "2025-01-10",
    description: "Training materials and mannequins",
    amount: 120.5,
    category: "Equipment",
    receipt: "receipt-001.pdf",
    submittedBy: "Alex Taylor",
    status: "approved",
    approvedBy: "Admin",
    approvedDate: "2025-01-11",
  },
  {
    id: "EXP-002",
    date: "2025-01-08",
    description: "Venue hire additional hours",
    amount: 75.0,
    category: "Venue",
    submittedBy: "Alex Taylor",
    status: "paid",
    approvedBy: "Admin",
    approvedDate: "2025-01-09",
  },
  {
    id: "EXP-003",
    date: "2025-01-12",
    description: "Refreshments for students",
    amount: 45.0,
    category: "Catering",
    submittedBy: "Alex Taylor",
    status: "pending",
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
  { id: "practical", name: "Practical Assessment", weight: 40, passRate: 70 },
  { id: "theory", name: "Theory Assessment", weight: 30, passRate: 70 },
  { id: "exam", name: "Final Exam", weight: 30, passRate: 60 },
]

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
  const [searchQuery, setSearchQuery] = React.useState("")
  const [selectedAvailableStudents, setSelectedAvailableStudents] = React.useState<string[]>([])

  // Modal states
  const [showAddStudentModal, setShowAddStudentModal] = React.useState(false)
  const [showBulkEmailModal, setShowBulkEmailModal] = React.useState(false)
  const [showBulkSMSModal, setShowBulkSMSModal] = React.useState(false)
  const [showAddExpenseModal, setShowAddExpenseModal] = React.useState(false)
  const [showAddAssessmentModal, setShowAddAssessmentModal] = React.useState(false)

  // Form states
  const [bulkEmailForm, setBulkEmailForm] = React.useState({ subject: "", message: "" })
  const [bulkSMSForm, setBulkSMSForm] = React.useState({ message: "" })
  const [expenseForm, setExpenseForm] = React.useState({
    description: "",
    amount: "",
    category: "",
    date: new Date().toISOString().split("T")[0],
  })
  const [assessmentForm, setAssessmentForm] = React.useState({
    name: "",
    weight: "",
    passRate: "",
  })

  const [newNotice, setNewNotice] = React.useState({
    title: "",
    content: "",
    type: "info" as const,
    audience: "all" as const,
  })
  const [editingGrade, setEditingGrade] = React.useState<{ studentId: string; assessment: string } | null>(null)
  const [gradeForm, setGradeForm] = React.useState({ score: "", status: "pending" as GradeStatus, notes: "" })

  const classId = params.id

  // Calculate financial summary based on actual payments
  const paidStudents = students.filter((s) => s.paymentStatus === "paid")
  const actualRevenue = paidStudents.reduce((sum, student) => sum + student.amountPaid, 0)
  const approvedExpenses = expenses.filter((e) => e.status === "approved" || e.status === "paid")
  const totalApprovedExpenses = approvedExpenses.reduce((sum, expense) => sum + expense.amount, 0)
  const approvedInvoices = invoices.filter((i) => i.status === "approved" || i.status === "paid")
  const totalApprovedInvoices = approvedInvoices.reduce((sum, invoice) => sum + invoice.amount, 0)
  const totalCosts = totalApprovedExpenses + totalApprovedInvoices
  const currentProfit = actualRevenue - totalCosts

  const totalRevenue = students.reduce((sum, student) => sum + student.amountPaid, 0)
  const expectedRevenue = students.reduce((sum, student) => sum + student.courseFee, 0)
  const outstandingPayments = expectedRevenue - totalRevenue

  const filteredExpenses = expenses.filter((expense) => {
    if (expenseFilter === "all") return true
    return expense.status === expenseFilter
  })

  const filteredAvailableStudents = availableStudents.filter(
    (student) =>
      student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const handleAddStudents = () => {
    if (selectedAvailableStudents.length === 0) {
      toast({
        title: "No students selected",
        description: "Please select students to add to the class.",
        variant: "destructive",
      })
      return
    }

    const studentsToAdd = availableStudents.filter((s) => selectedAvailableStudents.includes(s.id))
    const newStudents: Student[] = studentsToAdd.map((student) => ({
      id: student.id,
      name: student.name,
      email: student.email,
      phone: student.phone,
      status: "enrolled",
      paymentStatus: "pending",
      amountPaid: 0,
      courseFee: 850,
      enrolledDate: new Date().toISOString().split("T")[0],
      moodleAccess: true,
      attendance: {},
      grades: {},
    }))

    setStudents([...students, ...newStudents])
    setAvailableStudents(availableStudents.filter((s) => !selectedAvailableStudents.includes(s.id)))
    setSelectedAvailableStudents([])
    setShowAddStudentModal(false)

    toast({
      title: "Students added",
      description: `${studentsToAdd.length} students have been added to the class`,
    })
  }

  const handleInviteStudents = () => {
    if (selectedAvailableStudents.length === 0) {
      toast({
        title: "No students selected",
        description: "Please select students to invite.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Invitations sent",
      description: `Course invitations sent to ${selectedAvailableStudents.length} students`,
    })

    setSelectedAvailableStudents([])
    setShowAddStudentModal(false)
  }

  const handleBulkAction = () => {
    if (selectedStudents.length === 0) {
      toast({
        title: "No students selected",
        description: "Please select students to perform bulk actions.",
        variant: "destructive",
      })
      return
    }

    switch (bulkAction) {
      case "email":
        setShowBulkEmailModal(true)
        break
      case "sms":
        setShowBulkSMSModal(true)
        break
      case "block-moodle":
        const updatedStudents = students.map((student) =>
          selectedStudents.includes(student.id) ? { ...student, moodleAccess: false } : student,
        )
        setStudents(updatedStudents)
        toast({
          title: "Moodle access blocked",
          description: `${selectedStudents.length} students blocked from Moodle`,
        })
        break
      case "remove":
        const remainingStudents = students.filter((student) => !selectedStudents.includes(student.id))
        setStudents(remainingStudents)
        toast({
          title: "Students removed",
          description: `${selectedStudents.length} students removed from class`,
        })
        break
    }
    setSelectedStudents([])
    setBulkAction("")
  }

  const handleSendBulkEmail = () => {
    if (!bulkEmailForm.subject || !bulkEmailForm.message) {
      toast({
        title: "Incomplete form",
        description: "Please fill in both subject and message",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Bulk email sent",
      description: `Email sent to ${selectedStudents.length} students`,
    })

    setBulkEmailForm({ subject: "", message: "" })
    setShowBulkEmailModal(false)
    setSelectedStudents([])
  }

  const handleSendBulkSMS = () => {
    if (!bulkSMSForm.message) {
      toast({
        title: "Message required",
        description: "Please enter a message to send",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Bulk SMS sent",
      description: `SMS sent to ${selectedStudents.length} students`,
    })

    setBulkSMSForm({ message: "" })
    setShowBulkSMSModal(false)
    setSelectedStudents([])
  }

  const handleAddExpense = () => {
    if (!expenseForm.description || !expenseForm.amount || !expenseForm.category) {
      toast({
        title: "Incomplete form",
        description: "Please fill in all required fields",
        variant: "destructive",
      })
      return
    }

    const newExpense: ClassExpense = {
      id: `EXP-${Date.now()}`,
      date: expenseForm.date,
      description: expenseForm.description,
      amount: Number(expenseForm.amount),
      category: expenseForm.category,
      submittedBy: "Admin", // Would be current user
      status: "pending",
    }

    setExpenses([newExpense, ...expenses])
    setExpenseForm({
      description: "",
      amount: "",
      category: "",
      date: new Date().toISOString().split("T")[0],
    })
    setShowAddExpenseModal(false)

    toast({
      title: "Expense added",
      description: "Expense has been submitted for approval",
    })
  }

  const handleAddAssessment = () => {
    if (!assessmentForm.name || !assessmentForm.weight || !assessmentForm.passRate) {
      toast({
        title: "Incomplete form",
        description: "Please fill in all fields",
        variant: "destructive",
      })
      return
    }

    const newAssessment: AssessmentType = {
      id: assessmentForm.name.toLowerCase().replace(/\s+/g, "-"),
      name: assessmentForm.name,
      weight: Number(assessmentForm.weight),
      passRate: Number(assessmentForm.passRate),
    }

    setAssessments([...assessments, newAssessment])

    // Add this assessment to all students with default values
    const updatedStudents = students.map((student) => ({
      ...student,
      grades: {
        ...student.grades,
        [newAssessment.id]: { score: 0, status: "pending" as GradeStatus, notes: "" },
      },
    }))
    setStudents(updatedStudents)

    setAssessmentForm({ name: "", weight: "", passRate: "" })
    setShowAddAssessmentModal(false)

    toast({
      title: "Assessment added",
      description: "New assessment type has been created",
    })
  }

  const handleGradeSubmit = () => {
    if (!editingGrade) return

    const updatedStudents = students.map((student) => {
      if (student.id === editingGrade.studentId) {
        return {
          ...student,
          grades: {
            ...student.grades,
            [editingGrade.assessment]: {
              score: Number(gradeForm.score),
              status: gradeForm.status,
              notes: gradeForm.notes,
            },
          },
        }
      }
      return student
    })

    setStudents(updatedStudents)
    setEditingGrade(null)
    setGradeForm({ score: "", status: "pending", notes: "" })

    toast({
      title: "Grade updated",
      description: "Student grade has been successfully updated",
    })
  }

  const updateInvoiceStatus = (invoiceId: string, status: InvoiceStatus) => {
    const updatedInvoices = invoices.map((invoice) => (invoice.id === invoiceId ? { ...invoice, status } : invoice))
    setInvoices(updatedInvoices)

    toast({
      title: "Invoice updated",
      description: `Invoice status changed to ${status}`,
    })
  }

  const updateExpenseStatus = (expenseId: string, status: ExpenseStatus) => {
    const updatedExpenses = expenses.map((expense) =>
      expense.id === expenseId
        ? {
            ...expense,
            status,
            approvedBy: status === "approved" || status === "paid" ? "Admin" : expense.approvedBy,
            approvedDate:
              status === "approved" || status === "paid"
                ? new Date().toISOString().split("T")[0]
                : expense.approvedDate,
          }
        : expense,
    )
    setExpenses(updatedExpenses)

    toast({
      title: "Expense updated",
      description: `Expense status changed to ${status}`,
    })
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
      createdBy: "Admin", // Would be current user
      createdDate: new Date().toISOString().split("T")[0],
      targetAudience: newNotice.audience,
    }

    setNotices([notice, ...notices])
    setNewNotice({ title: "", content: "", type: "info", audience: "all" })

    toast({
      title: "Notice added",
      description: "Class notice has been posted successfully",
    })
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
              Jan 15, 2025
            </div>
            <div className="flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Training Room A
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              {students.filter((s) => s.status === "enrolled").length} / 12 students
            </div>
            <Badge variant="default">Teaching</Badge>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Edit className="mr-2 h-4 w-4" />
            Edit Class
          </Button>
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Financial Overview - Real-time P&L */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Actual Revenue</p>
                <p className="text-2xl font-bold text-green-600">£{actualRevenue.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">{paidStudents.length} students paid</p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Approved Costs</p>
                <p className="text-2xl font-bold text-red-600">£{totalCosts.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">
                  Invoices: £{totalApprovedInvoices} + Expenses: £{totalApprovedExpenses.toFixed(2)}
                </p>
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
                <p className={`text-2xl font-bold ${currentProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                  £{currentProfit.toFixed(2)}
                </p>
                <p className="text-xs text-muted-foreground">
                  Margin: {actualRevenue > 0 ? ((currentProfit / actualRevenue) * 100).toFixed(1) : 0}%
                </p>
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
                <p className="text-2xl font-bold text-orange-600">£{outstandingPayments.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">
                  {students.filter((s) => s.paymentStatus !== "paid").length} students
                </p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="students" className="space-y-4">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="attendance">Attendance</TabsTrigger>
          <TabsTrigger value="grades">Grades</TabsTrigger>
          <TabsTrigger value="notices">Notices</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="finances">Finances</TabsTrigger>
        </TabsList>

        {/* Students Tab */}
        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Student Management</CardTitle>
                <div className="flex items-center gap-2">
                  <Select value={bulkAction} onValueChange={setBulkAction}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Bulk actions" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Send Email</SelectItem>
                      <SelectItem value="sms">Send SMS</SelectItem>
                      <SelectItem value="block-moodle">Block Moodle</SelectItem>
                      <SelectItem value="remove">Remove from Class</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleBulkAction} disabled={!bulkAction || selectedStudents.length === 0}>
                    Apply
                  </Button>
                  <Button size="sm" onClick={() => setShowAddStudentModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    Add Student
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedStudents.length === students.length}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedStudents(students.map((s) => s.id))
                          } else {
                            setSelectedStudents([])
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Payment</TableHead>
                    <TableHead>Course Fee</TableHead>
                    <TableHead>Moodle Access</TableHead>
                    <TableHead>Enrolled</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedStudents.includes(student.id)}
                          onCheckedChange={(checked) => {
                            if (checked) {
                              setSelectedStudents([...selectedStudents, student.id])
                            } else {
                              setSelectedStudents(selectedStudents.filter((id) => id !== student.id))
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                          <div className="text-sm text-muted-foreground">{student.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            student.status === "enrolled"
                              ? "default"
                              : student.status === "completed"
                                ? "secondary"
                                : student.status === "dropped"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <Badge
                            variant={
                              student.paymentStatus === "paid"
                                ? "default"
                                : student.paymentStatus === "partial"
                                  ? "secondary"
                                  : student.paymentStatus === "overdue"
                                    ? "destructive"
                                    : "outline"
                            }
                          >
                            {student.paymentStatus}
                          </Badge>
                          <div className="text-sm text-muted-foreground">
                            £{student.amountPaid} / £{student.courseFee}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">£{student.courseFee}</div>
                        <div className="text-xs text-muted-foreground">Admin rate: £850</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          {student.moodleAccess ? (
                            <CheckCircle className="h-4 w-4 text-green-600" />
                          ) : (
                            <XCircle className="h-4 w-4 text-red-600" />
                          )}
                          <span className="text-sm">{student.moodleAccess ? "Active" : "Blocked"}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm">{new Date(student.enrolledDate).toLocaleDateString("en-GB")}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1">
                          <Button variant="ghost" size="sm">
                            <Mail className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <MessageSquare className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => {
                              const updatedStudents = students.map((s) =>
                                s.id === student.id ? { ...s, moodleAccess: !s.moodleAccess } : s,
                              )
                              setStudents(updatedStudents)
                            }}
                          >
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

        {/* Attendance Tab */}
        <TabsContent value="attendance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Tracking</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Student</TableHead>
                    <TableHead>Session 1</TableHead>
                    <TableHead>Session 2</TableHead>
                    <TableHead>Session 3</TableHead>
                    <TableHead>Attendance Rate</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {students.map((student) => {
                    const attendanceCount = Object.values(student.attendance).filter(Boolean).length
                    const totalSessions = Object.keys(student.attendance).length
                    const rate = totalSessions > 0 ? (attendanceCount / totalSessions) * 100 : 0

                    return (
                      <TableRow key={student.id}>
                        <TableCell className="font-medium">{student.name}</TableCell>
                        {Object.entries(student.attendance).map(([session, present]) => (
                          <TableCell key={session}>
                            <div className="flex items-center gap-2">
                              {present ? (
                                <CheckCircle className="h-4 w-4 text-green-600" />
                              ) : (
                                <XCircle className="h-4 w-4 text-red-600" />
                              )}
                              <span className="text-sm">{present ? "Present" : "Absent"}</span>
                            </div>
                          </TableCell>
                        ))}
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-gray-200 rounded-full h-2">
                              <div className="bg-blue-600 h-2 rounded-full" style={{ width: `${rate}%` }} />
                            </div>
                            <span className="text-sm font-medium">{rate.toFixed(0)}%</span>
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

        {/* Grades Tab - Excel-like interface */}
        <TabsContent value="grades" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Grade Management</CardTitle>
                <Button size="sm" onClick={() => setShowAddAssessmentModal(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Assessment
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="sticky left-0 bg-background">Student</TableHead>
                      {assessments.map((assessment) => (
                        <TableHead key={assessment.id} className="text-center min-w-[120px]">
                          <div className="space-y-1">
                            <div className="font-medium">{assessment.name}</div>
                            <div className="text-xs text-muted-foreground">
                              Weight: {assessment.weight}% | Pass: {assessment.passRate}%
                            </div>
                          </div>
                        </TableHead>
                      ))}
                      <TableHead className="text-center">Overall</TableHead>
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
                            const grade = student.grades[assessment.id] || { score: 0, status: "pending", notes: "" }
                            return (
                              <TableCell key={assessment.id} className="text-center">
                                <div className="space-y-1">
                                  <div className="flex items-center justify-center gap-1">
                                    <Input
                                      type="number"
                                      min="0"
                                      max="100"
                                      value={grade.score}
                                      onChange={(e) => {
                                        const updatedStudents = students.map((s) =>
                                          s.id === student.id
                                            ? {
                                                ...s,
                                                grades: {
                                                  ...s.grades,
                                                  [assessment.id]: {
                                                    ...grade,
                                                    score: Number(e.target.value),
                                                    status:
                                                      Number(e.target.value) >= assessment.passRate ? "pass" : "fail",
                                                  },
                                                },
                                              }
                                            : s,
                                        )
                                        setStudents(updatedStudents)
                                      }}
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
                      <DialogDescription>Post a notice for students and/or educators</DialogDescription>
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
                            onChange={(value) =>
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
                            onChange={(value) =>
                              setNewNotice((prev) => ({ ...prev, audience: value as "all" | "students" | "educators" }))
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All</SelectItem>
                              <SelectItem value="students">Students Only</SelectItem>
                              <SelectItem value="educators">Educators Only</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          onClick={() => setNewNotice({ title: "", content: "", type: "info", audience: "all" })}
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
                      <Button variant="ghost" size="sm">
                        <Trash2 className="h-4 w-4" />
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
                    <TableHead>Uploaded By</TableHead>
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
                      <TableCell className="text-sm">{resource.uploadedBy}</TableCell>
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
                          <Button variant="ghost" size="sm">
                            <Trash2 className="h-4 w-4" />
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

        {/* Finances Tab */}
        <TabsContent value="finances" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            {/* Invoices */}
            <Card>
              <CardHeader>
                <CardTitle>Educator Invoices</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {invoices.map((invoice) => (
                  <div key={invoice.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="space-y-1">
                      <div className="font-medium">{invoice.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {invoice.educatorName} • {new Date(invoice.uploadDate).toLocaleDateString("en-GB")}
                      </div>
                      <div className="text-sm text-muted-foreground">{invoice.filename}</div>
                      {invoice.notes && <div className="text-xs text-muted-foreground">{invoice.notes}</div>}
                    </div>
                    <div className="text-right space-y-2">
                      <div className="font-medium">£{invoice.amount.toFixed(2)}</div>
                      <div className="flex items-center gap-1">
                        <Badge
                          variant={
                            invoice.status === "paid"
                              ? "default"
                              : invoice.status === "approved"
                                ? "secondary"
                                : invoice.status === "rejected"
                                  ? "destructive"
                                  : "outline"
                          }
                        >
                          {invoice.status}
                        </Badge>
                      </div>
                      {invoice.status === "pending" && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateInvoiceStatus(invoice.id, "approved")}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateInvoiceStatus(invoice.id, "rejected")}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      {invoice.status === "approved" && (
                        <Button size="sm" onClick={() => updateInvoiceStatus(invoice.id, "paid")}>
                          Mark Paid
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
                    <Select value={expenseFilter} onChange={setExpenseFilter}>
                      <SelectTrigger className="w-[120px]">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Show All</SelectItem>
                        <SelectItem value="paid">Paid</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button size="sm" onClick={() => setShowAddExpenseModal(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add Expense
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {filteredExpenses.map((expense) => (
                  <div key={expense.id} className="flex items-center justify-between p-3 border rounded">
                    <div className="space-y-1">
                      <div className="font-medium">{expense.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {expense.category} • {new Date(expense.date).toLocaleDateString("en-GB")}
                      </div>
                      <div className="text-xs text-muted-foreground">By {expense.submittedBy}</div>
                      {expense.approvedBy && (
                        <div className="text-xs text-muted-foreground">
                          Approved by {expense.approvedBy} on {expense.approvedDate}
                        </div>
                      )}
                    </div>
                    <div className="text-right space-y-2">
                      <div className="font-medium">£{expense.amount.toFixed(2)}</div>
                      <Badge
                        variant={
                          expense.status === "paid"
                            ? "default"
                            : expense.status === "approved"
                              ? "secondary"
                              : expense.status === "rejected"
                                ? "destructive"
                                : "outline"
                        }
                      >
                        {expense.status}
                      </Badge>
                      {expense.status === "pending" && (
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateExpenseStatus(expense.id, "approved")}
                          >
                            <Check className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => updateExpenseStatus(expense.id, "rejected")}
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                      {expense.status === "approved" && (
                        <Button size="sm" onClick={() => updateExpenseStatus(expense.id, "paid")}>
                          Mark Paid
                        </Button>
                      )}
                      {expense.receipt && (
                        <Button variant="ghost" size="sm" className="h-6 px-2">
                          <Receipt className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Profit Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Real-time Profit & Loss</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Actual Revenue</div>
                  <div className="text-2xl font-bold text-green-600">£{actualRevenue.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">{paidStudents.length} students paid</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Approved Costs</div>
                  <div className="text-2xl font-bold text-red-600">£{totalCosts.toFixed(2)}</div>
                  <div className="text-xs text-muted-foreground">Invoices + Expenses</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Current Profit</div>
                  <div className={`text-2xl font-bold ${currentProfit >= 0 ? "text-green-600" : "text-red-600"}`}>
                    £{currentProfit.toFixed(2)}
                  </div>
                  <div className="text-xs text-muted-foreground">Based on payments received</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm text-muted-foreground">Profit Margin</div>
                  <div className="text-2xl font-bold">
                    {actualRevenue > 0 ? ((currentProfit / actualRevenue) * 100).toFixed(1) : 0}%
                  </div>
                  <div className="text-xs text-muted-foreground">Current margin</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Add Student Modal */}
      <Dialog open={showAddStudentModal} onOpenChange={setShowAddStudentModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add Students to Class</DialogTitle>
            <DialogDescription>Search and select students to add to this class</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search students by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="max-h-96 overflow-y-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[50px]">
                      <Checkbox
                        checked={selectedAvailableStudents.length === filteredAvailableStudents.length}
                        onChange={(checked) => {
                          if (checked) {
                            setSelectedAvailableStudents(filteredAvailableStudents.map((s) => s.id))
                          } else {
                            setSelectedAvailableStudents([])
                          }
                        }}
                      />
                    </TableHead>
                    <TableHead>Student</TableHead>
                    <TableHead>Last Active</TableHead>
                    <TableHead>Previous Courses</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAvailableStudents.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <Checkbox
                          checked={selectedAvailableStudents.includes(student.id)}
                          onChange={(checked) => {
                            if (checked) {
                              setSelectedAvailableStudents([...selectedAvailableStudents, student.id])
                            } else {
                              setSelectedAvailableStudents(selectedAvailableStudents.filter((id) => id !== student.id))
                            }
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{student.name}</div>
                          <div className="text-sm text-muted-foreground">{student.email}</div>
                          <div className="text-sm text-muted-foreground">{student.phone}</div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(student.lastActive).toLocaleDateString("en-GB")}
                      </TableCell>
                      <TableCell className="text-sm">{student.previousCourses}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex justify-between">
              <div className="text-sm text-muted-foreground">{selectedAvailableStudents.length} students selected</div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowAddStudentModal(false)}>
                  Cancel
                </Button>
                <Button variant="outline" onClick={handleInviteStudents}>
                  <Send className="mr-2 h-4 w-4" />
                  Send Invites
                </Button>
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
            <DialogDescription>Send an email to {selectedStudents.length} selected students</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Input
                value={bulkEmailForm.subject}
                onChange={(e) => setBulkEmailForm((prev) => ({ ...prev, subject: e.target.value }))}
                placeholder="Email subject..."
              />
            </div>
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={bulkEmailForm.message}
                onChange={(e) => setBulkEmailForm((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="Email message..."
                rows={6}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBulkEmailModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendBulkEmail}>
                <Send className="mr-2 h-4 w-4" />
                Send Email
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Bulk SMS Modal */}
      <Dialog open={showBulkSMSModal} onOpenChange={setShowBulkSMSModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Bulk SMS</DialogTitle>
            <DialogDescription>Send an SMS to {selectedStudents.length} selected students</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Message</Label>
              <Textarea
                value={bulkSMSForm.message}
                onChange={(e) => setBulkSMSForm((prev) => ({ ...prev, message: e.target.value }))}
                placeholder="SMS message..."
                rows={4}
                maxLength={160}
              />
              <div className="text-xs text-muted-foreground text-right">
                {bulkSMSForm.message.length}/160 characters
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowBulkSMSModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleSendBulkSMS}>
                <MessageSquare className="mr-2 h-4 w-4" />
                Send SMS
              </Button>
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
            <div className="space-y-2">
              <Label>Description</Label>
              <Input
                value={expenseForm.description}
                onChange={(e) => setExpenseForm((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Expense description..."
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Amount (£)</Label>
                <Input
                  type="number"
                  step="0.01"
                  min="0"
                  value={expenseForm.amount}
                  onChange={(e) => setExpenseForm((prev) => ({ ...prev, amount: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Select
                  value={expenseForm.category}
                  onChange={(value) => setExpenseForm((prev) => ({ ...prev, category: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
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
            <div className="space-y-2">
              <Label>Date</Label>
              <Input
                type="date"
                value={expenseForm.date}
                onChange={(e) => setExpenseForm((prev) => ({ ...prev, date: e.target.value }))}
              />
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddExpenseModal(false)}>
                Cancel
              </Button>
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
            <div className="space-y-2">
              <Label>Assessment Name</Label>
              <Input
                value={assessmentForm.name}
                onChange={(e) => setAssessmentForm((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., Practical Assessment, Quiz, Project"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Weight (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={assessmentForm.weight}
                  onChange={(e) => setAssessmentForm((prev) => ({ ...prev, weight: e.target.value }))}
                  placeholder="e.g., 30"
                />
              </div>
              <div className="space-y-2">
                <Label>Pass Rate (%)</Label>
                <Input
                  type="number"
                  min="0"
                  max="100"
                  value={assessmentForm.passRate}
                  onChange={(e) => setAssessmentForm((prev) => ({ ...prev, passRate: e.target.value }))}
                  placeholder="e.g., 70"
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddAssessmentModal(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddAssessment}>Add Assessment</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
