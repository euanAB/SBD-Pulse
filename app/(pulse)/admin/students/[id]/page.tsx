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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { useToast } from "@/hooks/use-toast"
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
  BadgeCheck,
  Bell,
  CircleDollarSign,
  FileText,
  Mail,
  MessageSquare,
  Phone,
  Send,
  ShieldCheck,
  User,
  Plus,
  Trash2,
  Paperclip,
  Search,
  Timer,
} from "lucide-react"

type Enrollment = {
  classId: string
  courseTitle: string
  status: "Proposed" | "Accepted" | "Enrolled" | "Teaching" | "Completed" | "Declined"
  startDate?: string
  progress?: number
  grade?: string
}

type Payment = {
  id: string
  date: string
  description: string
  amount: number
  status: "paid" | "pending" | "failed" | "refunded"
}

type DocumentItem = {
  type: "id_front" | "id_back" | "selfie"
  url: string
  status: "pending" | "approved" | "rejected"
}

type ExtraDoc = {
  id: string
  name: string
  type: string
  size: number
  url?: string
}

type Invite = {
  id: string
  type: "course" | "class"
  targetId: string
  title: string
  offer: string
  expires: string // ISO date string
  status: "sent" | "accepted" | "declined" | "expired" | "cancelled"
}

type NoteTag = "payment" | "attendance" | "general" | "behavior" | "academic"
type ContactMethod = "email" | "sms" | "call"
type StudentStatus = "good_standing" | "teaching" | "probation" | "suspended" | "withdrawn"

type Agreement = {
  id: string
  title: string
  signedAt: string
  pdfUrl: string
  version: string
}

type Refund = {
  id: string
  date: string
  amount: number
  reason: string
  method: string
  status: "processed" | "pending" | "failed"
}

// Update the existing note type to include tags
type Note = {
  id: string
  at: string
  author: string
  message: string
  tags: NoteTag[]
}

type StudentProfile = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  dob: string
  verified: boolean
  address: { line1: string; city: string; postcode: string }
  location: string
  status: "enrolled" | "invited" | "inactive"
  studentStatus: StudentStatus
  preferredContact: ContactMethod
  emergencyContact: { name: string; phone: string; relationship: string }
  photoUrl?: string
  enrollments: Enrollment[]
  payments: Payment[]
  documents: DocumentItem[]
  notes: Note[]
  invites: Invite[]
  agreements: Agreement[]
  refunds: Refund[]
  duplicateCandidates: number
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
    address: { line1: "221B Baker Street", city: "London", postcode: "NW1 6XE" },
    location: "London",
    status: "enrolled",
    studentStatus: "good_standing",
    preferredContact: "email",
    emergencyContact: { name: "Sarah Doe", phone: "+44 7700 900456", relationship: "Mother" },
    photoUrl: "/diverse-students-studying.png",
    enrollments: [
      { classId: "C-079", courseTitle: "First Aid Level 2", status: "Teaching", startDate: "2025-08-14", progress: 80 },
      {
        classId: "C-066",
        courseTitle: "CPR Advanced",
        status: "Completed",
        startDate: "2025-07-20",
        progress: 100,
        grade: "A",
      },
      { classId: "C-082", courseTitle: "Manual Handling", status: "Enrolled", startDate: "2025-08-28", progress: 15 },
    ],
    payments: [
      { id: "PM-2401", date: "2025-08-01", description: "CPR Advanced", amount: 120, status: "paid" },
      { id: "PM-2402", date: "2025-08-05", description: "First Aid L2 (deposit)", amount: 50, status: "paid" },
      { id: "PM-2403", date: "2025-08-10", description: "First Aid L2 (balance)", amount: 70, status: "pending" },
    ],
    documents: [
      { type: "id_front", url: "/placeholder.svg?height=160&width=240", status: "approved" },
      { type: "id_back", url: "/placeholder.svg?height=160&width=240", status: "pending" },
      { type: "selfie", url: "/placeholder.svg?height=160&width=240", status: "approved" },
    ],
    notes: [
      {
        id: "N-1",
        at: "2025-08-08T10:41:00Z",
        author: "Admin • Sophie",
        message: "Requested ID back upload.",
        tags: ["general"],
      },
      {
        id: "N-2",
        at: "2025-08-09T14:10:00Z",
        author: "Admin • James",
        message: "Late payment reminder sent. Student responded they will pay by Friday.",
        tags: ["payment"],
      },
    ],
    invites: [
      {
        id: "I-1001",
        type: "course",
        targetId: "CRS-002",
        title: "CPR Essentials",
        offer: "£120",
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        status: "sent",
      },
      {
        id: "I-1002",
        type: "class",
        targetId: "C-082",
        title: "Manual Handling (Class C-082)",
        offer: "£150",
        expires: new Date(Date.now() + 1000 * 60 * 90).toISOString(),
        status: "sent",
      },
    ],
    agreements: [
      {
        id: "AGR-001",
        title: "Student Terms & Conditions",
        signedAt: "2025-07-15T09:30:00Z",
        pdfUrl: "/placeholder.pdf",
        version: "v2.1",
      },
      {
        id: "AGR-002",
        title: "Data Protection Agreement",
        signedAt: "2025-07-15T09:32:00Z",
        pdfUrl: "/placeholder.pdf",
        version: "v1.3",
      },
    ],
    refunds: [
      {
        id: "REF-001",
        date: "2025-07-20T14:20:00Z",
        amount: 45,
        reason: "Course cancellation",
        method: "Bank transfer",
        status: "processed",
      },
    ],
    duplicateCandidates: last === "Smith" ? 1 : 0,
  }
}

const NOTE_TAGS: { value: NoteTag; label: string; color: string }[] = [
  { value: "general", label: "General", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  { value: "payment", label: "Payment Issue", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300" },
  {
    value: "attendance",
    label: "Attendance Concern",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    value: "behavior",
    label: "Behavior",
    color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300",
  },
  { value: "academic", label: "Academic", color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" },
]

const STUDENT_STATUS: { value: StudentStatus; label: string; variant: "default" | "secondary" | "outline" }[] = [
  { value: "good_standing", label: "In Good Standing", variant: "default" },
  { value: "teaching", label: "Currently Teaching", variant: "secondary" },
  { value: "probation", label: "On Probation", variant: "outline" },
  { value: "suspended", label: "Suspended", variant: "outline" },
  { value: "withdrawn", label: "Withdrawn", variant: "outline" },
]

type LineItem = { id: string; item: string; price: string; qty: string }

export default function StudentProfilePage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [profile, setProfile] = React.useState<StudentProfile>(() => mockProfile(params.id))

  // Derived
  const fullName = `${profile.firstName} ${profile.lastName}`
  const paid = profile.payments.filter((p) => p.status === "paid").reduce((s, p) => s + p.amount, 0)
  const outstanding = Math.max(0, 240 - paid)
  const lastPayment = profile.payments.find((p) => p.status === "paid")

  // Docs
  const [docs, setDocs] = React.useState(profile.documents)
  const updateDoc = (type: DocumentItem["type"], status: DocumentItem["status"]) =>
    setDocs((prev) => prev.map((d) => (d.type === type ? { ...d, status } : d)))

  // Extra docs
  const [extraDocs, setExtraDocs] = React.useState<ExtraDoc[]>([])
  function handleExtraUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const mapped = files.map((f, idx) => ({
      id: `${Date.now()}-${idx}`,
      name: f.name,
      type: f.type || "application/octet-stream",
      size: f.size,
      url: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }))
    setExtraDocs((prev) => [...mapped, ...prev])
  }
  React.useEffect(() => {
    return () => {
      extraDocs.forEach((d) => d.url && URL.revokeObjectURL(d.url))
    }
  }, []) // cleanup on unmount

  function removeExtraDoc(id: string) {
    setExtraDocs((prev) => prev.filter((d) => d.id !== id))
  }

  // Notes & comms
  const [notes, setNotes] = React.useState(profile.notes)
  const [noteText, setNoteText] = React.useState("")
  const [noteAuthor, setNoteAuthor] = React.useState("Admin • Your Name")
  const [selectedTags, setSelectedTags] = React.useState<Set<NoteTag>>(new Set())

  const addNote = () => {
    if (!noteText.trim()) return
    setNotes((prev) => [
      {
        id: `N-${prev.length + 1}`,
        at: new Date().toISOString(),
        author: noteAuthor || "Admin • Unknown",
        message: noteText.trim(),
        tags: Array.from(selectedTags),
      },
      ...prev,
    ])
    setNoteText("")
    setSelectedTags(new Set())
    toast({ title: "Note added" })
  }

  // Modals
  const [invoiceOpen, setInvoiceOpen] = React.useState(false)
  const [emailOpen, setEmailOpen] = React.useState(false)
  const [smsOpen, setSmsOpen] = React.useState(false)
  const [inviteOpen, setInviteOpen] = React.useState(false) // unified invite modal
  const [assignOpen, setAssignOpen] = React.useState(false)

  // Payment detail and refund modals
  const [paymentDetailOpen, setPaymentDetailOpen] = React.useState(false)
  const [selectedPayment, setSelectedPayment] = React.useState<Payment | null>(null)
  const [refundModalOpen, setRefundModalOpen] = React.useState(false)
  const [refundAmount, setRefundAmount] = React.useState("")
  const [refundConfirmation, setRefundConfirmation] = React.useState("")

  // Email
  const [emailSender, setEmailSender] = React.useState("support@sbd.school")
  const [emailSubject, setEmailSubject] = React.useState("")
  const [emailBody, setEmailBody] = React.useState("")
  function sendEmail() {
    setEmailOpen(false)
    setNotes((prev) => [
      {
        id: `N-${prev.length + 1}`,
        at: new Date().toISOString(),
        author: noteAuthor || "Admin • Unknown",
        message: `Email sent from ${emailSender} • Subject: ${emailSubject || "(no subject)"}\n\n${emailBody}`,
        tags: [],
      },
      ...prev,
    ])
    toast({ title: "Email sent", description: `Sent from ${emailSender}` })
    setEmailSubject("")
    setEmailBody("")
  }

  // SMS
  const [smsText, setSmsText] = React.useState("")
  const SMS_LIMIT = 600
  const smsRemaining = SMS_LIMIT - smsText.length
  function sendSMS() {
    setSmsOpen(false)
    setNotes((prev) => [
      {
        id: `N-${prev.length + 1}`,
        at: new Date().toISOString(),
        author: noteAuthor || "Admin • Unknown",
        message: `SMS sent (${smsText.length} chars):\n\n${smsText}`,
        tags: [],
      },
      ...prev,
    ])
    toast({ title: "SMS sent", description: `${smsText.length} characters` })
    setSmsText("")
  }

  function openPaymentDetail(payment: Payment) {
    setSelectedPayment(payment)
    setPaymentDetailOpen(true)
  }

  function openRefundModal() {
    if (selectedPayment) {
      setRefundAmount(selectedPayment.amount.toString())
      setRefundConfirmation("")
      setRefundModalOpen(true)
    }
  }

  function processRefund() {
    if (!selectedPayment || !refundAmount.trim() || !refundConfirmation.trim()) return

    const refundAmountNum = Number.parseFloat(refundAmount)
    if (!Number.isFinite(refundAmountNum) || refundAmountNum <= 0) return

    // Add to refunds history
    const newRefund: Refund = {
      id: `REF-${Date.now()}`,
      date: new Date().toISOString(),
      amount: refundAmountNum,
      reason: `Refund for ${selectedPayment.description}`,
      method: "Payment processor",
      status: "processed",
    }

    setProfile((prev) => ({
      ...prev,
      refunds: [newRefund, ...prev.refunds],
    }))

    // Add note about the refund
    setNotes((prev) => [
      {
        id: `N-${prev.length + 1}`,
        at: new Date().toISOString(),
        author: noteAuthor || "Admin • Unknown",
        message: `Refund processed: £${refundAmountNum.toFixed(2)} for ${selectedPayment.description}\nConfirmation: ${refundConfirmation}`,
        tags: ["payment"],
      },
      ...prev,
    ])

    setRefundModalOpen(false)
    setPaymentDetailOpen(false)
    setRefundAmount("")
    setRefundConfirmation("")
    toast({ title: "Refund processed", description: `£${refundAmountNum.toFixed(2)} refunded` })
  }

  // Edit mode for profile
  const [editMode, setEditMode] = React.useState(false)
  const [form, setForm] = React.useState({
    firstName: profile.firstName,
    lastName: profile.lastName,
    email: profile.email,
    phone: profile.phone,
    dob: profile.dob,
    location: profile.location,
    line1: profile.address.line1,
    city: profile.address.city,
    postcode: profile.address.postcode,
  })
  function saveProfile() {
    setProfile((p) => ({
      ...p,
      firstName: form.firstName,
      lastName: form.lastName,
      email: form.email,
      phone: form.phone,
      dob: form.dob,
      location: form.location,
      address: { line1: form.line1, city: form.city, postcode: form.postcode },
    }))
    setEditMode(false)
    toast({ title: "Profile updated" })
  }

  // Invites local state synced from profile
  const [invites, setInvites] = React.useState<Invite[]>(profile.invites)

  // Handle expiry auto-update to "expired"
  function handleExpire(id: string) {
    setInvites((prev) => prev.map((i) => (i.id === id && i.status === "sent" ? { ...i, status: "expired" } : i)))
  }
  function cancelInvite(id: string) {
    setInvites((prev) => prev.map((i) => (i.id === id && i.status === "sent" ? { ...i, status: "cancelled" } : i)))
    toast({ title: "Invite cancelled" })
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/students">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <h1 className="text-xl font-semibold">{fullName}</h1>
          {profile.verified && (
            <Badge variant="secondary" className="inline-flex items-center gap-1">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </Badge>
          )}
          <Badge variant="outline" className="ml-1">
            {profile.id}
          </Badge>
        </div>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button variant={editMode ? "secondary" : "outline"} size="sm" onClick={() => setEditMode((v) => !v)}>
            {editMode ? "Editing…" : "Edit"}
          </Button>
          <Button variant="secondary" size="sm" onClick={() => setInviteOpen(true)}>
            <Send className="mr-2 h-4 w-4" />
            Send an Invite
          </Button>
          <Button variant="outline" size="sm" onClick={() => setEmailOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSmsOpen(true)}>
            <Bell className="mr-2 h-4 w-4" />
            SMS
          </Button>
          <Button size="sm" onClick={() => setInvoiceOpen(true)}>
            <FileText className="mr-2 h-4 w-4" />
            Generate Invoice
          </Button>
        </div>
      </div>

      {/* Possible duplicates alert */}
      {profile.duplicateCandidates > 0 && (
        <Alert>
          <AlertTitle>Potential duplicate detected</AlertTitle>
          <AlertDescription>
            Another account with same surname and DOB exists. Please review before proceeding or contact support.
          </AlertDescription>
        </Alert>
      )}

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Enrollment Status</CardTitle>
            <CardDescription>Current activity</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border p-3">
              <div className="text-muted-foreground">Active Classes</div>
              <div className="text-xl font-semibold">
                {profile.enrollments.filter((e) => ["Enrolled", "Teaching"].includes(e.status)).length}
              </div>
            </div>
            <div className="rounded border p-3">
              <div className="text-muted-foreground">Completed</div>
              <div className="text-xl font-semibold">
                {profile.enrollments.filter((e) => e.status === "Completed").length}
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Financials</CardTitle>
            <CardDescription>Summary</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-3 gap-2 text-sm">
            <div className="rounded border p-3">
              <div className="text-muted-foreground">Paid</div>
              <div className="text-xl font-semibold">£{paid}</div>
            </div>
            <div className="rounded border p-3">
              <div className="text-muted-foreground">Outstanding</div>
              <div className="text-xl font-semibold">£{outstanding}</div>
            </div>
            <div className="rounded border p-3">
              <div className="text-muted-foreground">Last Payment</div>
              <div className="text-sm font-medium">{lastPayment ? format(new Date(lastPayment.date), "PP") : "—"}</div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Contact</CardTitle>
            <CardDescription>Primary</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span>{fullName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{profile.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-muted-foreground">{profile.phone}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for deeper data */}
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="invites">Invites</TabsTrigger>
          <TabsTrigger value="finance">Finance</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="agreements">Agreements</TabsTrigger>
          <TabsTrigger value="notes">Notes & Comms</TabsTrigger>
        </TabsList>

        {/* Profile tab with edit capability */}
        <TabsContent value="profile" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <Field label="Student ID" value={profile.id} readOnly />
                {editMode ? (
                  <>
                    <FieldEditable
                      label="First Name"
                      value={form.firstName}
                      onChange={(v) => setForm((f) => ({ ...f, firstName: v }))}
                    />
                    <FieldEditable
                      label="Last Name"
                      value={form.lastName}
                      onChange={(v) => setForm((f) => ({ ...f, lastName: v }))}
                    />
                    <FieldEditable
                      label="Email"
                      value={form.email}
                      onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                    />
                    <FieldEditable
                      label="Phone"
                      value={form.phone}
                      onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                    />
                    <FieldEditable
                      label="Date of Birth"
                      value={form.dob}
                      type="date"
                      onChange={(v) => setForm((f) => ({ ...f, dob: v }))}
                    />
                    <FieldEditable
                      label="Location"
                      value={form.location}
                      onChange={(v) => setForm((f) => ({ ...f, location: v }))}
                    />
                    <div className="sm:col-span-2 grid gap-4 sm:grid-cols-3">
                      <FieldEditable
                        label="Address line 1"
                        value={form.line1}
                        onChange={(v) => setForm((f) => ({ ...f, line1: v }))}
                      />
                      <FieldEditable
                        label="City"
                        value={form.city}
                        onChange={(v) => setForm((f) => ({ ...f, city: v }))}
                      />
                      <FieldEditable
                        label="Postcode"
                        value={form.postcode}
                        onChange={(v) => setForm((f) => ({ ...f, postcode: v }))}
                      />
                    </div>
                    <div className="sm:col-span-2 flex gap-2">
                      <Button size="sm" onClick={saveProfile}>
                        Save
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => setEditMode(false)}>
                        Cancel
                      </Button>
                    </div>
                  </>
                ) : (
                  <>
                    <Field label="First Name" value={profile.firstName} />
                    <Field label="Last Name" value={profile.lastName} />
                    <Field label="Email" value={profile.email} />
                    <Field label="Phone" value={profile.phone} />
                    <Field label="Date of Birth" value={format(new Date(profile.dob), "PP")} />
                    <Field label="Location" value={profile.location} />
                    <div className="sm:col-span-2">
                      <Label className="text-sm">Address</Label>
                      <div className="mt-1 rounded border p-3 text-sm">
                        <div>{profile.address.line1}</div>
                        <div>
                          {profile.address.city}, {profile.address.postcode}
                        </div>
                      </div>
                    </div>
                    <Field label="Preferred Contact" value={profile.preferredContact} />
                    <div className="space-y-1.5">
                      <Label className="text-sm">Emergency Contact</Label>
                      <div className="rounded border p-3 text-sm">
                        <div className="font-medium">{profile.emergencyContact.name}</div>
                        <div className="text-muted-foreground">{profile.emergencyContact.phone}</div>
                        <div className="text-muted-foreground">{profile.emergencyContact.relationship}</div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <div className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Student Photo</CardTitle>
                </CardHeader>
                <CardContent className="flex items-center gap-4">
                  <div className="h-24 w-24 overflow-hidden rounded-full bg-muted">
                    <img
                      src={profile.photoUrl || "/placeholder.svg?height=96&width=96&query=student-avatar"}
                      alt={`${profile.firstName} ${profile.lastName}`}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm">
                      Upload Photo
                    </Button>
                    <p className="text-xs text-muted-foreground">Helps educators quickly identify students</p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Account Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Enrollment</div>
                    <Badge variant={profile.status === "enrolled" ? "default" : "secondary"}>{profile.status}</Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Student Status</div>
                    <Badge
                      variant={STUDENT_STATUS.find((s) => s.value === profile.studentStatus)?.variant || "outline"}
                    >
                      {STUDENT_STATUS.find((s) => s.value === profile.studentStatus)?.label || profile.studentStatus}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-muted-foreground">Verification</div>
                    <div className="flex items-center gap-2">
                      {profile.verified ? (
                        <>
                          <BadgeCheck className="h-4 w-4 text-emerald-600" />
                          <span className="text-sm">Verified</span>
                        </>
                      ) : (
                        <span className="text-sm">Pending</span>
                      )}
                    </div>
                  </div>
                  <Separator />
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="sm" onClick={() => setEditMode(true)}>
                      Edit Profile
                    </Button>
                    <Button variant="outline" size="sm">
                      Reset Password
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        {/* Classes tab with assign button */}
        <TabsContent value="classes" className="mt-4">
          <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Enrollment History</CardTitle>
                <CardDescription>All classes and current progress.</CardDescription>
              </div>
              <Button size="sm" variant="secondary" onClick={() => setAssignOpen(true)}>
                Assign New Class
              </Button>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Class</TableHead>
                    <TableHead>Course</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead className="text-right">Progress</TableHead>
                    <TableHead className="text-right">Grade</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profile.enrollments.map((e) => (
                    <TableRow key={e.classId}>
                      <TableCell className="font-medium">{e.classId}</TableCell>
                      <TableCell>{e.courseTitle}</TableCell>
                      <TableCell>
                        <Badge variant={e.status === "Completed" ? "secondary" : "outline"} className="capitalize">
                          {e.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-muted-foreground">
                        {e.startDate ? format(new Date(e.startDate), "PP") : "—"}
                      </TableCell>
                      <TableCell className="text-right">{e.progress != null ? `${e.progress}%` : "—"}</TableCell>
                      <TableCell className="text-right">{e.grade ?? "—"}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Invites tab */}
        <TabsContent value="invites" className="mt-4">
          <Card>
            <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <CardTitle>Invitations</CardTitle>
                <CardDescription>Course and class invites with offers and expiry.</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={() => setInviteOpen(true)}>
                  Send an Invite
                </Button>
              </div>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Type</TableHead>
                    <TableHead>Target</TableHead>
                    <TableHead>Offer</TableHead>
                    <TableHead>Expires</TableHead>
                    <TableHead>Expires In</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invites.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="capitalize">{inv.type}</TableCell>
                      <TableCell>{inv.title}</TableCell>
                      <TableCell>{inv.offer}</TableCell>
                      <TableCell>{format(new Date(inv.expires), "PP")}</TableCell>
                      <TableCell>
                        {inv.status === "sent" ? (
                          <ExpiryCountdown id={inv.id} expires={inv.expires} onExpire={handleExpire} />
                        ) : inv.status === "expired" ? (
                          "Expired"
                        ) : inv.status === "cancelled" ? (
                          "—"
                        ) : (
                          "—"
                        )}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            inv.status === "sent"
                              ? "secondary"
                              : inv.status === "accepted"
                                ? "default"
                                : inv.status === "cancelled"
                                  ? "outline"
                                  : "outline"
                          }
                          className="capitalize"
                        >
                          {inv.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        {inv.status === "sent" ? (
                          <Button variant="outline" size="sm" onClick={() => cancelInvite(inv.id)}>
                            Cancel
                          </Button>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                  {invites.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="py-8 text-center text-muted-foreground">
                        No invites yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Finance tab */}
        <TabsContent value="finance" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Financial Overview</CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-2 gap-2 text-sm">
                <div className="rounded border p-3">
                  <div className="text-muted-foreground">Total Paid</div>
                  <div className="flex items-center gap-2 text-xl font-semibold">
                    <CircleDollarSign className="h-5 w-5" /> £{paid}
                  </div>
                </div>
                <div className="rounded border p-3">
                  <div className="text-muted-foreground">Outstanding</div>
                  <div className="flex items-center gap-2 text-xl font-semibold">
                    <CircleDollarSign className="h-5 w-5" /> £{outstanding}
                  </div>
                </div>
                <div className="rounded border p-3 col-span-2">
                  <div className="text-muted-foreground">Next Action</div>
                  <div className="mt-1 flex flex-wrap gap-2">
                    <Button size="sm" onClick={() => setInvoiceOpen(true)}>
                      Generate Invoice
                    </Button>
                    <Button size="sm" variant="outline">
                      Record Payment
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => setEmailOpen(true)}>
                      Send Reminder
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Payment History</CardTitle>
                <CardDescription>Invoices, payments and refunds.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Amount</TableHead>
                      <TableHead className="text-right">Receipt</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profile.payments.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>{format(new Date(p.date), "PP")}</TableCell>
                        <TableCell>{p.description}</TableCell>
                        <TableCell>
                          <Badge
                            variant={p.status === "paid" ? "default" : p.status === "pending" ? "secondary" : "outline"}
                            className="capitalize"
                          >
                            {p.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">£{p.amount}</TableCell>
                        <TableCell className="text-right">
                          {p.status === "paid" ? (
                            <Button size="sm" variant="outline" onClick={() => openPaymentDetail(p)}>
                              View
                            </Button>
                          ) : (
                            "—"
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>Refund History</CardTitle>
              <CardDescription>Refunds processed for withdrawals and cancellations.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Method</TableHead>
                    <TableHead>Status</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profile.refunds.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell>{format(new Date(r.date), "PP")}</TableCell>
                      <TableCell>£{r.amount}</TableCell>
                      <TableCell>{r.reason}</TableCell>
                      <TableCell className="text-muted-foreground">{r.method}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            r.status === "processed" ? "default" : r.status === "pending" ? "secondary" : "outline"
                          }
                        >
                          {r.status}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                  {profile.refunds.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={5} className="py-6 text-center text-muted-foreground">
                        No refunds processed.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          {outstanding > 0 && (
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Outstanding Balance Aging</CardTitle>
                <CardDescription>How long payments have been overdue.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="rounded border p-3">
                    <div className="text-sm text-muted-foreground">0-30 days</div>
                    <div className="text-xl font-semibold">£{outstanding}</div>
                  </div>
                  <div className="rounded border p-3">
                    <div className="text-sm text-muted-foreground">31-60 days</div>
                    <div className="text-xl font-semibold">£0</div>
                  </div>
                  <div className="rounded border p-3">
                    <div className="text-sm text-muted-foreground">60+ days</div>
                    <div className="text-xl font-semibold">£0</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Documents tab (ID + extras) */}
        <TabsContent value="documents" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Identity Documents</CardTitle>
                <CardDescription>Approve or reject uploaded documents.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                {docs.map((d) => (
                  <div key={d.type} className="rounded border">
                    <div className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-medium capitalize">{d.type.replace("_", " ")}</div>
                        <Badge
                          variant={
                            d.status === "approved" ? "default" : d.status === "pending" ? "secondary" : "outline"
                          }
                        >
                          {d.status}
                        </Badge>
                      </div>
                    </div>
                    <div className="h-[160px] w-full bg-muted">
                      <img
                        src={d.url || "/placeholder.svg?height=160&width=240&query=document-preview"}
                        alt={`Document ${d.type}`}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex items-center gap-2 p-3">
                      <Button size="sm" variant="secondary" onClick={() => updateDoc(d.type, "approved")}>
                        Approve
                      </Button>
                      <Button size="sm" variant="outline" onClick={() => updateDoc(d.type, "rejected")}>
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Documents</CardTitle>
                <CardDescription>Upload PDFs or other files for the student record.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="extraDocs">Upload</Label>
                  <Input id="extraDocs" type="file" multiple onChange={handleExtraUpload} />
                  <div className="text-xs text-muted-foreground">
                    Supported: images, PDF, other files. Image thumbnails when possible.
                  </div>
                </div>
                <div className="space-y-2">
                  {extraDocs.length === 0 && (
                    <div className="text-sm text-muted-foreground">No additional documents.</div>
                  )}
                  {extraDocs.map((d) => (
                    <div key={d.id} className="flex items-center justify-between rounded border p-2">
                      <div className="flex items-center gap-2">
                        {d.type.startsWith("image/") ? (
                          <div className="h-8 w-8 overflow-hidden rounded bg-muted">
                            <img
                              src={d.url || "/placeholder.svg?height=32&width=32&query=doc-thumb"}
                              alt={d.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        ) : d.type === "application/pdf" ? (
                          <FileText className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <Paperclip className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div className="text-sm">
                          <div className="font-medium">{d.name}</div>
                          <div className="text-xs text-muted-foreground">
                            {d.type} • {(d.size / 1024).toFixed(1)} KB
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {d.url && (
                          <a
                            href={d.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-sm underline underline-offset-2"
                          >
                            View
                          </a>
                        )}
                        <Button variant="outline" size="icon" onClick={() => removeExtraDoc(d.id)} aria-label="Remove">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="agreements" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Student-Signed Agreements</CardTitle>
              <CardDescription>PDF contracts and terms signed by the student.</CardDescription>
            </CardHeader>
            <CardContent className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Agreement</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Signed Date</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {profile.agreements.map((a) => (
                    <TableRow key={a.id}>
                      <TableCell className="font-medium">{a.title}</TableCell>
                      <TableCell className="text-muted-foreground">{a.version}</TableCell>
                      <TableCell className="text-muted-foreground">{format(new Date(a.signedAt), "PPp")}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="outline" size="sm" asChild>
                          <a href={a.pdfUrl} target="_blank" rel="noopener noreferrer">
                            View PDF
                          </a>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  {profile.agreements.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={4} className="py-6 text-center text-muted-foreground">
                        No agreements signed yet.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notes & Comms tab */}
        <TabsContent value="notes" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card>
              <CardHeader>
                <CardTitle>Add Note / Communication</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="noteAuthor">Left by</Label>
                  <Input
                    id="noteAuthor"
                    placeholder="e.g., Admin • Sophie"
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
                <Label htmlFor="note" className="text-sm">
                  Message
                </Label>
                <Textarea
                  id="note"
                  placeholder="Add an internal note or log a communication..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={addNote}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Note
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEmailOpen(true)}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email Student
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSmsOpen(true)}>
                    <Phone className="mr-2 h-4 w-4" />
                    SMS Student
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Communication Log</CardTitle>
                <CardDescription>Chronological notes and messages.</CardDescription>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[360px]">
                  <ul className="space-y-3 pr-2">
                    {notes.map((n) => (
                      <li key={n.id} className="rounded border p-3">
                        <div className="flex items-center justify-between">
                          <div className="text-sm font-medium">{n.author}</div>
                          <div className="text-xs text-muted-foreground">{format(new Date(n.at), "PPp")}</div>
                        </div>
                        {n.tags.length > 0 && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            {n.tags.map((tag) => {
                              const tagConfig = NOTE_TAGS.find((t) => t.value === tag)
                              return (
                                <span
                                  key={tag}
                                  className={`px-1.5 py-0.5 rounded text-xs font-medium ${tagConfig?.color || "bg-muted text-muted-foreground"}`}
                                >
                                  {tagConfig?.label || tag}
                                </span>
                              )
                            })}
                          </div>
                        )}
                        <div className="mt-1 whitespace-pre-wrap text-sm text-muted-foreground">{n.message}</div>
                      </li>
                    ))}
                    {notes.length === 0 && <li className="text-sm text-muted-foreground">No notes yet.</li>}
                  </ul>
                </ScrollArea>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Invoice Modal */}
      <InvoiceDialog
        open={invoiceOpen}
        onOpenChange={setInvoiceOpen}
        onGenerated={(payload) => {
          setInvoiceOpen(false)
          setNotes((prev) => [
            {
              id: `N-${prev.length + 1}`,
              at: new Date().toISOString(),
              author: noteAuthor || "Admin • Unknown",
              message: `Invoice generated and sent.\n\nItems:\n${payload.items
                .map((i) => `- ${i.item} x${i.qty} @ £${i.price.toFixed(2)}`)
                .join("\n")}\n\nSubtotal: £${payload.subtotal.toFixed(2)}\nNote: ${payload.note || "(none)"}`,
              tags: [],
            },
            ...prev,
          ])
          toast({ title: "Invoice sent", description: `Total £${payload.subtotal.toFixed(2)}` })
        }}
      />

      {/* Email Modal */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Student</DialogTitle>
            <DialogDescription>Compose an email. Select sender address and enter message content.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="sender">Sender</Label>
              <select
                id="sender"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={emailSender}
                onChange={(e) => setEmailSender(e.target.value)}
              >
                <option value="support@sbd.school">support@sbd.school</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="subject">Subject</Label>
              <Input id="subject" value={emailSubject} onChange={(e) => setEmailSubject(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="body">Message</Label>
              <Textarea id="body" value={emailBody} onChange={(e) => setEmailBody(e.target.value)} rows={6} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setEmailOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendEmail} disabled={!emailBody.trim()}>
              Send Email
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* SMS Modal */}
      <Dialog open={smsOpen} onOpenChange={setSmsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>SMS Student</DialogTitle>
            <DialogDescription>Enter the SMS content. Max 600 characters.</DialogDescription>
          </DialogHeader>
          <div className="space-y-2">
            <Label htmlFor="sms">Message</Label>
            <Textarea
              id="sms"
              value={smsText}
              onChange={(e) => setSmsText(e.target.value.slice(0, SMS_LIMIT))}
              rows={6}
              maxLength={SMS_LIMIT}
            />
            <div className="text-xs text-muted-foreground text-right">{smsRemaining} characters remaining</div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSmsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={sendSMS} disabled={!smsText.trim()}>
              Send SMS
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unified Invite modal */}
      <InviteDialog
        open={inviteOpen}
        onOpenChange={setInviteOpen}
        onCreate={(newInvite) => {
          setInvites((prev) => [{ ...newInvite, id: `I-${1000 + prev.length}` }, ...prev])
          setInviteOpen(false)
          setNotes((prev) => [
            {
              id: `N-${prev.length + 1}`,
              at: new Date().toISOString(),
              author: noteAuthor || "Admin • Unknown",
              message: `Invite sent: ${newInvite.type} • ${newInvite.title} • Offer ${newInvite.offer} • Expires ${format(new Date(newInvite.expires), "PP")}`,
              tags: [],
            },
            ...prev,
          ])
          toast({ title: "Invite sent", description: `${newInvite.title}` })
        }}
      />

      {/* Assign class modal */}
      <AssignClassDialog
        open={assignOpen}
        onOpenChange={setAssignOpen}
        onAssign={(cl) => {
          setProfile((p) => ({
            ...p,
            enrollments: [
              { classId: cl.id, courseTitle: cl.title, status: "Enrolled", startDate: cl.start, progress: 0 },
              ...p.enrollments,
            ],
          }))
          setAssignOpen(false)
          toast({ title: "Class assigned", description: `${cl.id} • ${cl.title}` })
        }}
      />

      {/* Payment Detail Modal */}
      <Dialog open={paymentDetailOpen} onOpenChange={setPaymentDetailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Payment Details</DialogTitle>
            <DialogDescription>
              {selectedPayment
                ? `Payment ${selectedPayment.id} • ${format(new Date(selectedPayment.date), "PPP")}`
                : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedPayment && (
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Payment ID</Label>
                  <div className="font-medium">{selectedPayment.id}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Amount</Label>
                  <div className="font-medium">£{selectedPayment.amount.toFixed(2)}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Date</Label>
                  <div className="font-medium">{format(new Date(selectedPayment.date), "PPp")}</div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">Status</Label>
                  <Badge variant={selectedPayment.status === "paid" ? "default" : "secondary"} className="w-fit">
                    {selectedPayment.status}
                  </Badge>
                </div>
                <div className="space-y-1 sm:col-span-2">
                  <Label className="text-sm text-muted-foreground">Description</Label>
                  <div className="font-medium">{selectedPayment.description}</div>
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setPaymentDetailOpen(false)}>
              Close
            </Button>
            <Button variant="outline">Download Receipt</Button>
            {selectedPayment?.status === "paid" && (
              <Button variant="secondary" onClick={openRefundModal}>
                Process Refund
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Refund Modal */}
      <Dialog open={refundModalOpen} onOpenChange={setRefundModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Process Refund</DialogTitle>
            <DialogDescription>Enter the refund amount and payment processor confirmation number.</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="refundAmount">Refund Amount (£)</Label>
              <Input
                id="refundAmount"
                type="number"
                step="0.01"
                min="0"
                max={selectedPayment?.amount || 0}
                value={refundAmount}
                onChange={(e) => setRefundAmount(e.target.value)}
                placeholder="0.00"
              />
              <div className="text-xs text-muted-foreground">
                Maximum refundable: £{selectedPayment?.amount.toFixed(2) || "0.00"}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="refundConfirmation">Payment Processor Confirmation Number</Label>
              <Input
                id="refundConfirmation"
                value={refundConfirmation}
                onChange={(e) => setRefundConfirmation(e.target.value)}
                placeholder="e.g., RF_1234567890"
              />
              <div className="text-xs text-muted-foreground">
                Enter the confirmation number from your payment processor (Stripe, PayPal, etc.)
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRefundModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={processRefund}
              disabled={!refundAmount.trim() || !refundConfirmation.trim() || Number.parseFloat(refundAmount) <= 0}
            >
              Process Refund
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function Field({ label, value, readOnly }: { label: string; value: string; readOnly?: boolean }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      <Input value={value} readOnly className="bg-muted/30" aria-readonly={readOnly ?? true} />
    </div>
  )
}
function FieldEditable({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string
  value: string
  onChange: (v: string) => void
  type?: string
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} type={type} />
    </div>
  )
}

/* ---------- Invoice Dialog ---------- */
function toNumber(v: string) {
  const n = Number.parseFloat(v)
  return Number.isFinite(n) ? n : 0
}
function InvoiceDialog({
  open,
  onOpenChange,
  onGenerated,
}: {
  open: boolean
  onOpenChange: (b: boolean) => void
  onGenerated: (payload: {
    items: { item: string; price: number; qty: number }[]
    subtotal: number
    note: string
  }) => void
}) {
  const [items, setItems] = React.useState<LineItem[]>([{ id: "1", item: "", price: "", qty: "1" }])
  const [note, setNote] = React.useState("")
  React.useEffect(() => {
    if (!open) {
      setItems([{ id: "1", item: "", price: "", qty: "1" }])
      setNote("")
    }
  }, [open])

  const parsed = items
    .map((i) => ({ item: i.item.trim(), price: toNumber(i.price), qty: Math.max(1, Math.floor(toNumber(i.qty))) }))
    .filter((i) => i.item && i.price > 0 && i.qty > 0)
  const subtotal = parsed.reduce((s, i) => s + i.price * i.qty, 0)
  const canSubmit = parsed.length > 0

  function addRow() {
    setItems((prev) => [...prev, { id: `${Date.now()}`, item: "", price: "", qty: "1" }])
  }
  function removeRow(id: string) {
    setItems((prev) => (prev.length > 1 ? prev.filter((i) => i.id !== id) : prev))
  }
  function updateRow(id: string, patch: Partial<LineItem>) {
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Generate Invoice</DialogTitle>
          <DialogDescription>
            Enter line items with price and quantity, add a note, then generate and send.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="rounded border">
            <div className="grid grid-cols-12 gap-2 border-b p-2 text-xs text-muted-foreground">
              <div className="col-span-6">Item</div>
              <div className="col-span-2 text-right">Price (£)</div>
              <div className="col-span-2 text-right">Qty</div>
              <div className="col-span-2 text-right">Total (£)</div>
            </div>
            <div className="max-h-[300px] overflow-auto">
              {items.map((row) => {
                const price = toNumber(row.price)
                const qty = Math.max(1, Math.floor(toNumber(row.qty)))
                const total = price > 0 && qty > 0 ? (price * qty).toFixed(2) : "0.00"
                return (
                  <div key={row.id} className="grid grid-cols-12 items-center gap-2 border-b p-2 last:border-b-0">
                    <div className="col-span-6">
                      <Input
                        placeholder="Item description"
                        value={row.item}
                        onChange={(e) => updateRow(row.id, { item: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        inputMode="decimal"
                        placeholder="0.00"
                        className="text-right"
                        value={row.price}
                        onChange={(e) => updateRow(row.id, { price: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2">
                      <Input
                        inputMode="numeric"
                        placeholder="1"
                        className="text-right"
                        value={row.qty}
                        onChange={(e) => updateRow(row.id, { qty: e.target.value })}
                      />
                    </div>
                    <div className="col-span-2 flex items-center justify-end gap-2">
                      <div className="min-w-[64px] text-right text-sm tabular-nums">£{total}</div>
                      <Button variant="outline" size="icon" onClick={() => removeRow(row.id)} aria-label="Remove line">
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )
              })}
            </div>
            <div className="flex items-center justify-between p-2">
              <Button variant="outline" size="sm" onClick={addRow}>
                <Plus className="mr-2 h-4 w-4" />
                Add item
              </Button>
              <div className="text-sm">
                Subtotal: <span className="font-semibold">£{subtotal.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="invoice-note">Note (optional)</Label>
            <Textarea
              id="invoice-note"
              placeholder="Add a note that will appear on the invoice..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => onGenerated({ items: parsed, subtotal, note })}
            disabled={!canSubmit}
            title={!canSubmit ? "Add at least one valid line item" : undefined}
          >
            Generate & Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ---------- Unified Invite Dialog ---------- */
function InviteDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean
  onOpenChange: (b: boolean) => void
  onCreate: (invite: Omit<Invite, "id" | "status"> & { status: Invite["status"] }) => void
}) {
  const [type, setType] = React.useState<"course" | "class" | undefined>(undefined)
  const [query, setQuery] = React.useState("")
  const [targetId, setTargetId] = React.useState("")
  const [title, setTitle] = React.useState("")
  const [offer, setOffer] = React.useState("")
  const [expires, setExpires] = React.useState("")

  // Reset state when closing
  React.useEffect(() => {
    if (!open) {
      setType(undefined)
      setQuery("")
      setTargetId("")
      setTitle("")
      setOffer("")
      setExpires("")
    }
  }, [open])

  const courseOptions = [
    { id: "CRS-001", title: "First Aid Level 1" },
    { id: "CRS-002", title: "CPR Essentials" },
    { id: "CRS-003", title: "Safeguarding Basics" },
  ]
  const classOptions = [
    { id: "C-079", title: "First Aid Level 2 (Aug 14)" },
    { id: "C-082", title: "Manual Handling (Aug 28)" },
    { id: "C-087", title: "Safeguarding Basics (Aug 25)" },
  ]
  const options = type === "course" ? courseOptions : type === "class" ? classOptions : []

  const filtered = options.filter((o) => !query || o.title.toLowerCase().includes(query.toLowerCase()))
  const canCreate = type && targetId && offer.trim() && expires

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-xl">
        <DialogHeader>
          <DialogTitle>Send an Invite</DialogTitle>
          <DialogDescription>
            Select Course or Class, choose the target, then set the offer and expiry.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          {/* Step 1: Type */}
          <div className="space-y-2">
            <Label>Invite type</Label>
            <div className="flex gap-2">
              <Button variant={type === "course" ? "secondary" : "outline"} size="sm" onClick={() => setType("course")}>
                Course
              </Button>
              <Button variant={type === "class" ? "secondary" : "outline"} size="sm" onClick={() => setType("class")}>
                Class
              </Button>
            </div>
          </div>

          {/* Step 2: Search & select */}
          <div className="space-y-2">
            <Label htmlFor="target-search">
              {type ? `Search ${type === "course" ? "course" : "class"}` : "Choose an invite type first"}
            </Label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                id="target-search"
                disabled={!type}
                placeholder={type ? `Search ${type}...` : "Select a type first"}
                className="pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="rounded border max-h-48 overflow-auto">
              {type ? (
                filtered.map((o) => (
                  <button
                    key={o.id}
                    className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted ${targetId === o.id ? "bg-muted" : ""}`}
                    onClick={() => {
                      setTargetId(o.id)
                      setTitle(o.title)
                    }}
                    type="button"
                  >
                    <span>{o.title}</span>
                    <Badge variant={targetId === o.id ? "default" : "outline"}>{o.id}</Badge>
                  </button>
                ))
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">Select a type to view options.</div>
              )}
              {type && filtered.length === 0 && (
                <div className="px-3 py-2 text-sm text-muted-foreground">No results.</div>
              )}
            </div>
          </div>

          {/* Step 3: Offer and expiry */}
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="sm:col-span-1 space-y-2">
              <Label htmlFor="offer">Offer</Label>
              <Input id="offer" placeholder="e.g., £120" value={offer} onChange={(e) => setOffer(e.target.value)} />
            </div>
            <div className="sm:col-span-2 space-y-2">
              <Label htmlFor="expires">Expiry date</Label>
              <Input id="expires" type="datetime-local" value={expires} onChange={(e) => setExpires(e.target.value)} />
              <div className="text-xs text-muted-foreground">Shows a live countdown until expiry.</div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (!type) return
              onCreate({
                type,
                targetId,
                title: title || targetId,
                offer,
                expires: new Date(expires).toISOString(),
                status: "sent",
              })
            }}
            disabled={!canCreate}
            title={!canCreate ? "Select type, target, offer and expiry" : undefined}
          >
            Generate & Send
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ---------- Assign Class Dialog ---------- */
function AssignClassDialog({
  open,
  onOpenChange,
  onAssign,
}: {
  open: boolean
  onOpenChange: (b: boolean) => void
  onAssign: (cls: { id: string; title: string; start: string }) => void
}) {
  const [q, setQ] = React.useState("")
  const classes = [
    { id: "C-079", title: "First Aid Level 2", start: "2025-08-14" },
    { id: "C-082", title: "Manual Handling", start: "2025-08-28" },
    { id: "C-087", title: "Safeguarding Basics", start: "2025-08-25" },
    { id: "C-093", title: "CPR Essentials", start: "2025-08-22" },
  ]
  const filtered = classes.filter((c) => !q || `${c.id} ${c.title}`.toLowerCase().includes(q.toLowerCase()))

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Assign New Class</DialogTitle>
          <DialogDescription>Search and select a class to add this student.</DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by title or ID..."
              className="pl-8"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="rounded border max-h-60 overflow-auto">
            {filtered.map((c) => (
              <button
                key={c.id}
                className="flex w-full items-center justify-between px-3 py-2 text-left text-sm hover:bg-muted"
                onClick={() => onAssign(c)}
                type="button"
              >
                <div>
                  <div className="font-medium">{c.title}</div>
                  <div className="text-xs text-muted-foreground">
                    {c.id} • {format(new Date(c.start), "PP")}
                  </div>
                </div>
                <Plus className="h-4 w-4" />
              </button>
            ))}
            {filtered.length === 0 && <div className="px-3 py-2 text-sm text-muted-foreground">No classes found.</div>}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

/* ---------- Expiry Countdown ---------- */
function formatDuration(ms: number) {
  if (ms <= 0) return "00:00:00"
  const totalSeconds = Math.floor(ms / 1000)
  const h = Math.floor(totalSeconds / 3600)
  const m = Math.floor((totalSeconds % 3600) / 60)
  const s = totalSeconds % 60
  const pad = (n: number) => n.toString().padStart(2, "0")
  return `${pad(h)}:${pad(m)}:${pad(s)}`
}
function ExpiryCountdown({ id, expires, onExpire }: { id: string; expires: string; onExpire: (id: string) => void }) {
  const [remaining, setRemaining] = React.useState<number>(() => new Date(expires).getTime() - Date.now())

  React.useEffect(() => {
    setRemaining(new Date(expires).getTime() - Date.now())
    const t = setInterval(() => {
      setRemaining((prev) => {
        const next = prev - 1000
        if (next <= 0) {
          clearInterval(t)
          onExpire(id)
          return 0
        }
        return next
      })
    }, 1000)
    return () => clearInterval(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expires, id])

  return (
    <div className="inline-flex items-center gap-1 text-xs">
      <Timer className="h-3.5 w-3.5 text-muted-foreground" />
      <span>{formatDuration(remaining)}</span>
    </div>
  )
}
