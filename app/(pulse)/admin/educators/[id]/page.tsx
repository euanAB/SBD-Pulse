"use client"

import * as React from "react"
import Link from "next/link"
import { format, formatDistanceToNowStrict } from "date-fns"
import {
  ArrowLeft,
  BadgeCheck,
  Banknote,
  Bell,
  BookOpen,
  Building2,
  CheckCircle2,
  FileText,
  FileWarning,
  GraduationCap,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Timer,
  User,
  Users,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { AddQualification } from "@/components/add-qualification"

type Status = "Active" | "Inactive" | "On Leave"
type ContractType = "Freelance" | "Part-time" | "Full-time"
type RightToWorkStatus = "Verified" | "Pending" | "Expired"
type DocumentType = "Contract" | "Qualification" | "ID" | "Right to Work" | "Insurance" | "Other"

type Address = {
  street: string
  city: string
  postcode: string
  country: string
}

type EmergencyContact = {
  name: string
  relationship: string
  phone: string
}

type Banking = {
  accountName: string
  sortCode: string // e.g. "20-12-34"
  accountNumber: string // e.g. "12345678"
  bankName: string
}

type Employment = {
  contractType: ContractType
  startDate: string // ISO
  contractSigned: boolean
  contractSignedDate?: string // ISO
  hourlyRate?: string
  annualSalary?: string
  companyName?: string // if ltd/umbrella
  tradingName?: string
  status: Status
}

type RightToWork = {
  status: RightToWorkStatus
  documentType: string
  verifiedBy?: string
  verifiedDate?: string // ISO
  expiryDate?: string // ISO
}

type Dbs = {
  level: "Basic" | "Standard" | "Enhanced" | "N/A"
  status: "Valid" | "Expired" | "Pending" | "N/A"
  certificateNo?: string
  issueDate?: string // ISO
  expiryDate?: string // ISO
}

type Insurance = {
  publicLiabilityAmount?: string // e.g., "£5m"
  publicLiabilityExpiry?: string
  professionalIndemnityAmount?: string // e.g., "£1m"
  professionalIndemnityExpiry?: string
}

type Qualification = {
  id: string
  name: string
  institution: string
  dateObtained: string // ISO
  expiryDate?: string // ISO
}

type HRDocument = {
  id: string
  name: string
  type: DocumentType
  uploadDate: string // ISO
  expiryDate?: string // ISO
  status?: "ok" | "expiring" | "expired" | "pending"
  url?: string
}

type NoteTag = "general" | "payroll" | "compliance" | "performance"
type Note = {
  id: string
  at: string
  author: string
  message: string
  tags: NoteTag[]
}

type StudentRef = {
  id: string
  name: string
  email: string
  phone: string
  status: "Active" | "On Hold" | "Completed" | "Dropped"
}

type EducatorClass = {
  id: string
  title: string
  location: string
  schedule: string // e.g. "Tue 18:00-20:00"
  startDate: string
  endDate?: string
  nextSession?: string
  status: "Scheduled" | "In Progress" | "Completed"
  students: StudentRef[]
}

type EducatorProfile = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  photoUrl?: string
  baseLocation: string
  availableLocations: string[]
  skills: string[]
  address: Address
  emergencyContact: EmergencyContact
  banking: Banking
  employment: Employment
  tax: {
    utr?: string
    vatRegistered?: boolean
    vatNumber?: string
    niNumber?: string
  }
  rightToWork: RightToWork
  dbs: Dbs
  insurance: Insurance
  qualifications: Qualification[]
  documents: HRDocument[]
  notes: Note[]
  classes: EducatorClass[]
  lastReview?: string
  nextReview?: string
}

/* Mock seed by ID for demo */
function mockEducator(id: string): EducatorProfile {
  const idx = Number.parseInt(id.replace(/\D/g, "")) || 1
  const firsts = ["Euan", "Sophie", "Marcus", "Amira", "Daniel", "Hannah", "Priya"]
  const lasts = ["MacLeod", "Chen", "Johnson", "Khan", "Evans", "Baker", "Patel"]
  const firstName = firsts[(idx - 1) % firsts.length]
  const lastName = lasts[(idx - 1) % lasts.length]
  const baseLocation = ["Sheffield", "Leeds", "Manchester", "Birmingham"][(idx - 1) % 4]
  const skillsMatrix = [
    ["Nail Gels", "Manicure", "Pedicure", "Client Care"],
    ["Beauty Therapy", "Facials", "Waxing", "Brow Shaping"],
    ["Advanced Nail Art", "3D Design", "Creative Workshops"],
  ]
  const skills = skillsMatrix[(idx - 1) % skillsMatrix.length]
  const now = new Date()
  const in90 = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 90).toISOString()
  const in30 = new Date(now.getTime() + 1000 * 60 * 60 * 24 * 30).toISOString()

  // Seed some students
  const seedStudents = (classIdx: number): StudentRef[] => {
    const base = [
      { id: "STU-101", name: "Alice Morgan", email: "alice.morgan@example.com", phone: "+44 7700 900121" },
      { id: "STU-102", name: "Ben Wright", email: "ben.wright@example.com", phone: "+44 7700 900122" },
      { id: "STU-103", name: "Chloe Singh", email: "chloe.singh@example.com", phone: "+44 7700 900123" },
      { id: "STU-104", name: "Dylan O'Neil", email: "dylan.oneil@example.com", phone: "+44 7700 900124" },
      { id: "STU-105", name: "Ella James", email: "ella.james@example.com", phone: "+44 7700 900125" },
    ]
    return base.slice(0, 3 + (classIdx % 3)).map((s, i) => ({
      ...s,
      id: `${s.id}-${classIdx}-${i}`,
      status: (["Active", "Active", "On Hold", "Completed"] as StudentRef["status"][])[(i + classIdx) % 4],
    }))
  }

  const classes: EducatorClass[] = [
    {
      id: "CLS-2001",
      title: "Nail Beauty Therapy — Level 2",
      location: baseLocation,
      schedule: "Tue 18:00–20:00",
      startDate: "2025-07-01",
      endDate: "2025-09-30",
      nextSession: new Date(Date.now() + 1000 * 60 * 60 * 24 * 2).toISOString(),
      status: "In Progress",
      students: seedStudents(1),
    },
    {
      id: "CLS-2002",
      title: "Advanced Nail Art Workshop",
      location: ["Leeds", "Manchester", baseLocation][(idx + 1) % 3],
      schedule: "Sat 10:00–16:00",
      startDate: "2025-08-10",
      endDate: "2025-09-10",
      nextSession: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7).toISOString(),
      status: "Scheduled",
      students: seedStudents(2),
    },
    {
      id: "CLS-2003",
      title: "First Aid for Practitioners",
      location: ["Manchester", baseLocation, "Sheffield"][(idx + 2) % 3],
      schedule: "Thu 09:00–12:00",
      startDate: "2025-05-01",
      endDate: "2025-06-01",
      nextSession: undefined,
      status: "Completed",
      students: seedStudents(3),
    },
  ]

  return {
    id: `EDU-${String(idx).padStart(3, "0")}`,
    firstName,
    lastName,
    email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@pulse.ac.uk`,
    phone: "+44 7700 900" + String(100 + ((idx * 7) % 899)).padStart(3, "0"),
    photoUrl: "/placeholder.svg?height=80&width=80",
    baseLocation,
    availableLocations: [baseLocation, "Leeds", "Manchester"].slice(0, 2 + (idx % 2)),
    skills,
    address: {
      street: "12 Victoria Street",
      city: baseLocation,
      postcode: ["LS1 6AD", "S11 8PR", "M1 5NH", "B1 1AA"][(idx - 1) % 4],
      country: "United Kingdom",
    },
    emergencyContact: {
      name: "Emergency Contact",
      relationship: "Spouse",
      phone: "+44 7700 900111",
    },
    banking: {
      accountName: `${firstName} ${lastName}`,
      sortCode: "20-12-34",
      accountNumber: "12345678",
      bankName: "Barclays Bank",
    },
    employment: {
      contractType: idx % 3 === 0 ? "Part-time" : "Freelance",
      startDate: "2023-09-01",
      contractSigned: idx % 2 === 0,
      contractSignedDate: idx % 2 === 0 ? "2023-08-15" : undefined,
      hourlyRate: idx % 3 === 0 ? "£38/hour" : "£45/hour",
      status: idx % 5 === 0 ? "On Leave" : "Active",
    },
    tax: {
      utr: "12345 67890 1234",
      vatRegistered: idx % 4 === 0,
      vatNumber: idx % 4 === 0 ? "GB123456789" : undefined,
      niNumber: "QQ 12 34 56 C",
    },
    rightToWork: {
      status: idx % 5 === 1 ? "Pending" : "Verified",
      documentType: idx % 2 === 0 ? "UK Passport" : "BRP Card",
      verifiedBy: idx % 5 === 1 ? undefined : "HR • Alice",
      verifiedDate: idx % 5 === 1 ? undefined : "2024-02-10",
      expiryDate: idx % 3 === 0 ? in90 : undefined,
    },
    dbs: {
      level: "Enhanced",
      status: idx % 6 === 0 ? "Expired" : "Valid",
      certificateNo: "E-" + (100000 + idx),
      issueDate: "2024-01-12",
      expiryDate: in30,
    },
    insurance: {
      publicLiabilityAmount: "£5m",
      publicLiabilityExpiry: in90,
      professionalIndemnityAmount: "£1m",
      professionalIndemnityExpiry: in90,
    },
    qualifications: [
      {
        id: "QUAL-" + (1000 + idx),
        name: "Level 3 Diploma in Nail Technology",
        institution: "Beauty Academy UK",
        dateObtained: "2022-06-15",
      },
      {
        id: "QUAL-" + (2000 + idx),
        name: "First Aid at Work",
        institution: "St John Ambulance",
        dateObtained: "2024-03-10",
        expiryDate: "2027-03-10",
      },
    ],
    documents: [
      {
        id: "DOC-" + (3000 + idx),
        name: "Employment Contract.pdf",
        type: "Contract",
        uploadDate: "2023-08-15",
        status: "ok",
        url: "/contract-document.png",
      },
      {
        id: "DOC-" + (3100 + idx),
        name: "Right to Work Proof.pdf",
        type: "Right to Work",
        uploadDate: "2024-02-10",
        status: "ok",
        url: "/right-to-work-document.png",
      },
      {
        id: "DOC-" + (3200 + idx),
        name: "Public Indemnity Insurance.pdf",
        type: "Insurance",
        uploadDate: "2024-01-15",
        expiryDate: in90,
        status: "ok",
        url: "/placeholder.svg?height=40&width=40",
      },
    ],
    notes: [
      {
        id: "N-1",
        at: "2025-07-12T10:00:00Z",
        author: "HR • Sophie",
        message: "Great student feedback from recent workshop. Extend contract by 6 months.",
        tags: ["performance"],
      },
      {
        id: "N-2",
        at: "2025-08-01T09:30:00Z",
        author: "Payroll • James",
        message: "Updated hourly rate to £45/hour starting Aug.",
        tags: ["payroll"],
      },
    ],
    classes: classes,
    lastReview: "2024-12-01",
    nextReview: "2025-06-01",
  }
}

/* Helpers */
function maskSortCode(sc: string, show = false) {
  if (show) return sc
  const parts = sc.split("-")
  if (parts.length !== 3) return "••-••-••"
  return ["••", "••", parts[2]].join("-")
}
function maskAccountNumber(num: string, show = false) {
  if (show) return num
  if (!num) return "••••••••"
  const last2 = num.slice(-2)
  return "••••••" + last2
}
function daysUntil(date?: string) {
  if (!date) return undefined
  const diff = new Date(date).getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}
function expiryBadgeVariant(days?: number) {
  if (days == null) return { variant: "secondary" as const, label: "No expiry" }
  if (days < 0) return { variant: "outline" as const, label: "Expired" }
  if (days <= 30) return { variant: "outline" as const, label: `${days} days` }
  return { variant: "secondary" as const, label: `${days} days` }
}

const NOTE_TAGS: { value: NoteTag; label: string; color: string }[] = [
  { value: "general", label: "General", color: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300" },
  {
    value: "payroll",
    label: "Payroll",
    color: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
  },
  {
    value: "compliance",
    label: "Compliance",
    color: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
  },
  {
    value: "performance",
    label: "Performance",
    color: "bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300",
  },
]

export default function EducatorDetailPage({ params }: { params: { id: string } }) {
  const { toast } = useToast()
  const [profile, setProfile] = React.useState<EducatorProfile>(() => mockEducator(params.id))
  const fullName = `${profile.firstName} ${profile.lastName}`

  // Sensitive data visibility
  const [showSensitive, setShowSensitive] = React.useState(false)

  // Documents upload (additional)
  const [extraDocs, setExtraDocs] = React.useState<HRDocument[]>([])
  function handleExtraUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? [])
    if (!files.length) return
    const mapped: HRDocument[] = files.map((f, idx) => ({
      id: `UP-${Date.now()}-${idx}`,
      name: f.name,
      type: "Other",
      uploadDate: new Date().toISOString(),
      status: "pending",
      url: f.type.startsWith("image/") ? URL.createObjectURL(f) : undefined,
    }))
    setExtraDocs((prev) => [...mapped, ...prev])
    toast({ title: "Documents added", description: `${files.length} file(s) staged` })
  }
  React.useEffect(() => {
    return () => {
      extraDocs.forEach((d) => d.url && URL.revokeObjectURL(d.url))
    }
  }, []) // cleanup

  function removeExtraDoc(id: string) {
    setExtraDocs((prev) => prev.filter((d) => d.id !== id))
  }

  // Notes & comms
  const [notes, setNotes] = React.useState<Note[]>(profile.notes)
  const [noteText, setNoteText] = React.useState("")
  const [noteAuthor, setNoteAuthor] = React.useState("HR • Your Name")
  const [selectedTags, setSelectedTags] = React.useState<Set<NoteTag>>(new Set())

  const addNote = () => {
    if (!noteText.trim()) return
    setNotes((prev) => [
      {
        id: `N-${Date.now()}`,
        at: new Date().toISOString(),
        author: noteAuthor || "HR • Unknown",
        message: noteText.trim(),
        tags: Array.from(selectedTags),
      },
      ...prev,
    ])
    setNoteText("")
    setSelectedTags(new Set())
    toast({ title: "Note added" })
  }

  // Email & SMS modals
  const [emailOpen, setEmailOpen] = React.useState(false)
  const [smsOpen, setSmsOpen] = React.useState(false)
  const [emailSubject, setEmailSubject] = React.useState("")
  const [emailBody, setEmailBody] = React.useState("")
  const [emailSender, setEmailSender] = React.useState("hr@pulse.ac.uk")
  function sendEmail() {
    setEmailOpen(false)
    setNotes((prev) => [
      {
        id: `N-${Date.now()}`,
        at: new Date().toISOString(),
        author: noteAuthor || "HR • Unknown",
        message: `Email to ${profile.email} from ${emailSender}\nSubject: ${emailSubject || "(no subject)"}\n\n${emailBody}`,
        tags: ["general"],
      },
      ...prev,
    ])
    setEmailSubject("")
    setEmailBody("")
    toast({ title: "Email logged" })
  }
  const [smsText, setSmsText] = React.useState("")
  const SMS_LIMIT = 600
  function sendSMS() {
    setSmsOpen(false)
    setNotes((prev) => [
      {
        id: `N-${Date.now()}`,
        at: new Date().toISOString(),
        author: noteAuthor || "HR • Unknown",
        message: `SMS to ${profile.phone} (${smsText.length} chars)\n\n${smsText}`,
        tags: ["general"],
      },
      ...prev,
    ])
    setSmsText("")
    toast({ title: "SMS logged" })
  }

  // Actions: mark contract signed, verify RTW
  function markContractSigned() {
    setProfile((p) => ({
      ...p,
      employment: { ...p.employment, contractSigned: true, contractSignedDate: new Date().toISOString() },
      documents: [
        {
          id: `DOC-${Date.now()}`,
          name: "Employment Contract (signed).pdf",
          type: "Contract",
          uploadDate: new Date().toISOString(),
          status: "ok",
          url: "/placeholder.svg?height=40&width=40",
        },
        ...p.documents,
      ],
    }))
    toast({ title: "Contract marked signed" })
  }
  function verifyRightToWork() {
    setProfile((p) => ({
      ...p,
      rightToWork: {
        ...p.rightToWork,
        status: "Verified",
        verifiedBy: "HR • You",
        verifiedDate: new Date().toISOString(),
      },
    }))
    toast({ title: "Right to work verified" })
  }

  // Editable inline fields (basic)
  const [editMode, setEditMode] = React.useState(false)
  const [form, setForm] = React.useState({
    email: profile.email,
    phone: profile.phone,
    baseLocation: profile.baseLocation,
    street: profile.address.street,
    city: profile.address.city,
    postcode: profile.address.postcode,
  })
  function saveProfile() {
    setProfile((p) => ({
      ...p,
      email: form.email,
      phone: form.phone,
      baseLocation: form.baseLocation,
      address: { ...p.address, street: form.street, city: form.city, postcode: form.postcode },
    }))
    setEditMode(false)
    toast({ title: "Educator updated" })
  }

  const daysRTW = daysUntil(profile.rightToWork.expiryDate)
  const daysDBS = daysUntil(profile.dbs.expiryDate)
  const daysPLI = daysUntil(profile.insurance.publicLiabilityExpiry)
  const daysPII = daysUntil(profile.insurance.professionalIndemnityExpiry)

  // Aggregate current students with class info
  const currentStudents = React.useMemo(() => {
    const rows: (StudentRef & { classId: string; classTitle: string })[] = []
    for (const c of profile.classes) {
      for (const s of c.students) {
        if (s.status === "Active" || s.status === "On Hold") {
          rows.push({ ...s, classId: c.id, classTitle: c.title })
        }
      }
    }
    return rows
  }, [profile.classes])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm">
            <Link href="/admin/educators">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Link>
          </Button>
          <div className="h-10 w-10 overflow-hidden rounded-full bg-muted">
            <img
              src={profile.photoUrl || "/placeholder.svg?height=40&width=40&query=educator-avatar"}
              alt={`${fullName}`}
              className="h-full w-full object-cover"
            />
          </div>
          <h1 className="text-xl font-semibold">{fullName}</h1>
          <Badge
            variant={
              profile.employment.status === "Active"
                ? "default"
                : profile.employment.status === "On Leave"
                  ? "secondary"
                  : "outline"
            }
          >
            {profile.employment.status}
          </Badge>
          {profile.employment.contractSigned && (
            <Badge variant="secondary" className="inline-flex items-center gap-1">
              <BadgeCheck className="h-3.5 w-3.5" />
              Contract Signed
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
          <Button variant="outline" size="sm" onClick={() => setEmailOpen(true)}>
            <Mail className="mr-2 h-4 w-4" />
            Email
          </Button>
          <Button variant="outline" size="sm" onClick={() => setSmsOpen(true)}>
            <Bell className="mr-2 h-4 w-4" />
            SMS
          </Button>
          <Button size="sm" onClick={markContractSigned} disabled={profile.employment.contractSigned}>
            <FileText className="mr-2 h-4 w-4" />
            {profile.employment.contractSigned ? "Signed" : "Mark Contract Signed"}
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-3">
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
              <a className="text-muted-foreground underline-offset-2 hover:underline" href={`mailto:${profile.email}`}>
                {profile.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <a className="text-muted-foreground underline-offset-2 hover:underline" href={`tel:${profile.phone}`}>
                {profile.phone}
              </a>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Locations & Skills</CardTitle>
            <CardDescription>Capabilities</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <span>Base: {profile.baseLocation}</span>
            </div>
            <div className="text-muted-foreground">
              Also at: {profile.availableLocations.filter((l) => l !== profile.baseLocation).join(", ") || "—"}
            </div>
            <Separator />
            <div className="flex flex-wrap gap-1">
              {profile.skills.map((s) => (
                <Badge key={s} variant="outline" className="text-xs">
                  {s}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Compliance</CardTitle>
            <CardDescription>Status</CardDescription>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-2 text-sm">
            <div className="rounded border p-3">
              <div className="text-muted-foreground flex items-center gap-1">
                <Shield className="h-4 w-4" /> Right to Work
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant={
                    profile.rightToWork.status === "Verified"
                      ? "default"
                      : profile.rightToWork.status === "Pending"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {profile.rightToWork.status}
                </Badge>
                {profile.rightToWork.expiryDate && (
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNowStrict(new Date(profile.rightToWork.expiryDate), { addSuffix: true })}
                  </span>
                )}
              </div>
            </div>
            <div className="rounded border p-3">
              <div className="text-muted-foreground flex items-center gap-1">
                <ShieldCheck className="h-4 w-4" /> DBS
              </div>
              <div className="mt-1 flex items-center gap-2">
                <Badge
                  variant={
                    profile.dbs.status === "Valid"
                      ? "default"
                      : profile.dbs.status === "Pending"
                        ? "secondary"
                        : "outline"
                  }
                >
                  {profile.dbs.status}
                </Badge>
                {profile.dbs.expiryDate && (
                  <span className="text-xs text-muted-foreground">
                    {formatDistanceToNowStrict(new Date(profile.dbs.expiryDate), { addSuffix: true })}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="teaching" className="w-full">
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="teaching" className="gap-1">
            <BookOpen className="h-4 w-4" />
            Teaching
          </TabsTrigger>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="compliance">Compliance</TabsTrigger>
          <TabsTrigger value="pay">Contracts & Pay</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="qualifications">Qualifications</TabsTrigger>
          <TabsTrigger value="notes">Notes & Comms</TabsTrigger>
        </TabsList>

        {/* Teaching */}
        <TabsContent value="teaching" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="h-5 w-5" />
                  Classes Teaching
                </CardTitle>
                <CardDescription>Classes assigned to this educator.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Class</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Schedule</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Next</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profile.classes.map((c) => (
                      <TableRow key={c.id} className="hover:bg-muted/40">
                        <TableCell className="font-medium">{c.title}</TableCell>
                        <TableCell className="text-muted-foreground">{c.location}</TableCell>
                        <TableCell className="text-muted-foreground">{c.schedule}</TableCell>
                        <TableCell>{c.students.length}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {c.nextSession ? format(new Date(c.nextSession), "PPp") : "—"}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              c.status === "In Progress"
                                ? "default"
                                : c.status === "Scheduled"
                                  ? "secondary"
                                  : "outline"
                            }
                          >
                            {c.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/admin/classes/${c.id}`}>Open</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {profile.classes.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-muted-foreground">
                          No classes assigned.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Current Students
                </CardTitle>
                <CardDescription>Active or on-hold students taught by this educator.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Class</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {currentStudents.map((s) => (
                      <TableRow key={`${s.id}-${s.classId}`}>
                        <TableCell className="font-medium">{s.name}</TableCell>
                        <TableCell className="text-muted-foreground">{s.classTitle}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              s.status === "Active" ? "default" : s.status === "On Hold" ? "secondary" : "outline"
                            }
                          >
                            {s.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          <div className="flex flex-col">
                            <a className="underline-offset-2 hover:underline" href={`mailto:${s.email}`}>
                              {s.email}
                            </a>
                            <a className="underline-offset-2 hover:underline" href={`tel:${s.phone}`}>
                              {s.phone}
                            </a>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button asChild size="sm" variant="outline">
                            <Link href={`/admin/students/${s.id}`}>Open</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {currentStudents.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground">
                          No active students.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Personal Details</CardTitle>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <ReadOnlyField label="Educator ID" value={profile.id} />
                <ReadOnlyField label="Name" value={fullName} />
                {editMode ? (
                  <>
                    <EditableField
                      label="Email"
                      value={form.email}
                      onChange={(v) => setForm((f) => ({ ...f, email: v }))}
                    />
                    <EditableField
                      label="Phone"
                      value={form.phone}
                      onChange={(v) => setForm((f) => ({ ...f, phone: v }))}
                    />
                    <EditableField
                      label="Base Location"
                      value={form.baseLocation}
                      onChange={(v) => setForm((f) => ({ ...f, baseLocation: v }))}
                    />
                    <div className="sm:col-span-2 grid gap-4 sm:grid-cols-3">
                      <EditableField
                        label="Street"
                        value={form.street}
                        onChange={(v) => setForm((f) => ({ ...f, street: v }))}
                      />
                      <EditableField
                        label="City"
                        value={form.city}
                        onChange={(v) => setForm((f) => ({ ...f, city: v }))}
                      />
                      <EditableField
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
                    <ReadOnlyField label="Email" value={profile.email} />
                    <ReadOnlyField label="Phone" value={profile.phone} />
                    <ReadOnlyField label="Base Location" value={profile.baseLocation} />
                    <div className="sm:col-span-2">
                      <Label className="text-sm">Address</Label>
                      <div className="mt-1 rounded border p-3 text-sm">
                        <div>{profile.address.street}</div>
                        <div className="text-muted-foreground">
                          {profile.address.city}, {profile.address.postcode}, {profile.address.country}
                        </div>
                      </div>
                    </div>
                    <div className="sm:col-span-2 space-y-1.5">
                      <Label className="text-sm">Emergency Contact</Label>
                      <div className="rounded border p-3 text-sm">
                        <div className="font-medium">{profile.emergencyContact.name}</div>
                        <div className="text-muted-foreground">{profile.emergencyContact.relationship}</div>
                        <div className="text-muted-foreground">{profile.emergencyContact.phone}</div>
                      </div>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Account & Identity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-600" />
                  <span className="text-sm">Right to Work: {profile.rightToWork.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">NI Number: {maskText(profile.tax.niNumber || "—", showSensitive)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building2 className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">UTR: {maskText(profile.tax.utr || "—", showSensitive)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Banknote className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    VAT:{" "}
                    {profile.tax.vatRegistered
                      ? `Registered (${maskText(profile.tax.vatNumber || "", showSensitive)})`
                      : "Not registered"}
                  </span>
                </div>
                <Separator />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowSensitive((s) => !s)}>
                    {showSensitive ? "Hide sensitive" : "Reveal sensitive"}
                  </Button>
                  {!profile.employment.contractSigned && (
                    <Button size="sm" onClick={markContractSigned}>
                      Mark Contract Signed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Compliance */}
        <TabsContent value="compliance" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Right to Work</CardTitle>
                <CardDescription>Verify and track expiry.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <KV label="Status" value={profile.rightToWork.status} />
                <KV label="Document Type" value={profile.rightToWork.documentType || "—"} />
                <KV label="Verified By" value={profile.rightToWork.verifiedBy || "—"} />
                <KV
                  label="Verified Date"
                  value={
                    profile.rightToWork.verifiedDate ? format(new Date(profile.rightToWork.verifiedDate), "PPp") : "—"
                  }
                />
                <div className="space-y-1.5">
                  <Label className="text-sm">Expiry</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {profile.rightToWork.expiryDate ? format(new Date(profile.rightToWork.expiryDate), "PP") : "—"}
                    </span>
                    <Badge {...expiryBadgeVariant(daysRTW)} />
                  </div>
                </div>
                <div className="sm:col-span-2 flex gap-2">
                  <Button size="sm" onClick={verifyRightToWork} disabled={profile.rightToWork.status === "Verified"}>
                    {profile.rightToWork.status === "Verified" ? "Verified" : "Mark Verified"}
                  </Button>
                  <Button size="sm" variant="outline">
                    Upload RTW Proof
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>DBS Check</CardTitle>
                <CardDescription>Safeguarding requirement.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3">
                <KV label="Level" value={profile.dbs.level} />
                <div className="space-y-1.5">
                  <Label className="text-sm">Status</Label>
                  <div className="flex items-center gap-2">
                    {profile.dbs.status === "Valid" ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    ) : profile.dbs.status === "Pending" ? (
                      <Timer className="h-4 w-4 text-amber-600" />
                    ) : profile.dbs.status === "Expired" ? (
                      <ShieldAlert className="h-4 w-4 text-red-600" />
                    ) : (
                      <FileWarning className="h-4 w-4 text-muted-foreground" />
                    )}
                    <Badge
                      variant={
                        profile.dbs.status === "Valid"
                          ? "default"
                          : profile.dbs.status === "Pending"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {profile.dbs.status}
                    </Badge>
                  </div>
                </div>
                <KV label="Certificate No." value={profile.dbs.certificateNo || "—"} />
                <KV
                  label="Issue Date"
                  value={profile.dbs.issueDate ? format(new Date(profile.dbs.issueDate), "PP") : "—"}
                />
                <div className="space-y-1.5">
                  <Label className="text-sm">Expiry</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm">
                      {profile.dbs.expiryDate ? format(new Date(profile.dbs.expiryDate), "PP") : "—"}
                    </span>
                    <Badge {...expiryBadgeVariant(daysDBS)} />
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Upload DBS
                </Button>
              </CardContent>
            </Card>

            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle>Insurance</CardTitle>
                <CardDescription>Contractor liability cover.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <InsuranceCard
                  title="Public Liability"
                  amount={profile.insurance.publicLiabilityAmount}
                  expiry={profile.insurance.publicLiabilityExpiry}
                />
                <InsuranceCard
                  title="Professional Indemnity"
                  amount={profile.insurance.professionalIndemnityAmount}
                  expiry={profile.insurance.professionalIndemnityExpiry}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Contracts & Pay */}
        <TabsContent value="pay" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Employment Terms</CardTitle>
                <CardDescription>Contract and rates.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 sm:grid-cols-2">
                <KV label="Contract Type" value={profile.employment.contractType} />
                <KV label="Start Date" value={format(new Date(profile.employment.startDate), "PP")} />
                <KV label="Contract Status" value={profile.employment.contractSigned ? "Signed" : "Pending"} />
                <KV
                  label="Signed Date"
                  value={
                    profile.employment.contractSignedDate
                      ? format(new Date(profile.employment.contractSignedDate), "PP")
                      : "—"
                  }
                />
                <KV label="Hourly Rate" value={profile.employment.hourlyRate || "—"} />
                <KV label="Annual Salary" value={profile.employment.annualSalary || "—"} />
                <KV label="Trading Name" value={profile.employment.tradingName || "—"} />
                <KV label="Company Name" value={profile.employment.companyName || "—"} />
                <div className="sm:col-span-2 flex gap-2">
                  <Button size="sm" onClick={markContractSigned} disabled={profile.employment.contractSigned}>
                    {profile.employment.contractSigned ? "Contract Signed" : "Mark Contract Signed"}
                  </Button>
                  <Button size="sm" variant="outline">
                    Send to Sign
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Banking (Payout)</CardTitle>
                <CardDescription>For paying invoices/fees.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <KV label="Account Name" value={profile.banking.accountName} />
                <KV label="Bank Name" value={profile.banking.bankName} />
                <KV label="Sort Code" value={maskSortCode(profile.banking.sortCode, showSensitive)} />
                <KV label="Account Number" value={maskAccountNumber(profile.banking.accountNumber, showSensitive)} />
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setShowSensitive((s) => !s)}>
                    {showSensitive ? "Hide" : "Reveal"}
                  </Button>
                  <Button size="sm" variant="outline">
                    Update
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Documents */}
        <TabsContent value="documents" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>HR Documents</CardTitle>
                <CardDescription>Contracts, ID, insurance, etc.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Document</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Uploaded</TableHead>
                      <TableHead>Expiry</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[...profile.documents, ...extraDocs].map((d) => {
                      const dDays = daysUntil(d.expiryDate)
                      const badge = expiryBadgeVariant(dDays)
                      return (
                        <TableRow key={d.id}>
                          <TableCell className="font-medium">{d.name}</TableCell>
                          <TableCell>{d.type}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(d.uploadDate), "PP")}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {d.expiryDate ? (
                              <div className="flex items-center gap-2">
                                <span>{format(new Date(d.expiryDate), "PP")}</span>
                                <Badge variant={badge.variant as any}>{badge.label}</Badge>
                              </div>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                          <TableCell>
                            <Badge
                              variant={d.status === "ok" ? "default" : d.status === "pending" ? "secondary" : "outline"}
                            >
                              {d.status || "ok"}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right space-x-2">
                            {d.url ? (
                              <a
                                href={d.url}
                                target="_blank"
                                rel="noreferrer"
                                className="text-sm underline underline-offset-2"
                              >
                                View
                              </a>
                            ) : (
                              <span className="text-xs text-muted-foreground">—</span>
                            )}
                            <Button variant="outline" size="sm">
                              Download
                            </Button>
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upload Documents</CardTitle>
                <CardDescription>Add PDFs or images.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="uploadDocs">Upload</Label>
                  <Input id="uploadDocs" type="file" multiple onChange={handleExtraUpload} />
                  <div className="text-xs text-muted-foreground">Image thumbnails when possible.</div>
                </div>
                <div className="space-y-2">
                  {extraDocs.length === 0 && <div className="text-sm text-muted-foreground">No staged documents.</div>}
                  {extraDocs.map((d) => (
                    <div key={d.id} className="flex items-center justify-between rounded border p-2">
                      <div className="flex items-center gap-2">
                        <div className="h-8 w-8 overflow-hidden rounded bg-muted">
                          <img
                            src={d.url || "/placeholder.svg?height=32&width=32&query=document"}
                            alt={d.name}
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <div className="text-sm">
                          <div className="font-medium">{d.name}</div>
                          <div className="text-xs text-muted-foreground">{d.type}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" onClick={() => removeExtraDoc(d.id)}>
                          Remove
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Qualifications */}
        <TabsContent value="qualifications" className="mt-4">
          <div className="grid gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Qualifications</CardTitle>
                <CardDescription>Teaching credentials and certificates.</CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Qualification</TableHead>
                      <TableHead>Institution</TableHead>
                      <TableHead>Obtained</TableHead>
                      <TableHead>Expiry</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {profile.qualifications.map((q) => {
                      const qDays = daysUntil(q.expiryDate)
                      const badge = expiryBadgeVariant(qDays)
                      return (
                        <TableRow key={q.id}>
                          <TableCell className="font-medium">{q.name}</TableCell>
                          <TableCell className="text-muted-foreground">{q.institution}</TableCell>
                          <TableCell className="text-muted-foreground">
                            {format(new Date(q.dateObtained), "PP")}
                          </TableCell>
                          <TableCell className="text-muted-foreground">
                            {q.expiryDate ? (
                              <div className="flex items-center gap-2">
                                <span>{format(new Date(q.expiryDate), "PP")}</span>
                                <Badge variant={badge.variant as any}>{badge.label}</Badge>
                              </div>
                            ) : (
                              "—"
                            )}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Add Qualification</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <AddQualification
                  onAdd={(q) => {
                    setProfile((p) => ({ ...p, qualifications: [q, ...p.qualifications] }))
                    toast({ title: "Qualification added", description: q.name })
                  }}
                />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Notes & Comms */}
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
                    placeholder="e.g., HR • Sophie"
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
                            const next = new Set(prev)
                            next.has(tag.value) ? next.delete(tag.value) : next.add(tag.value)
                            return next
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
                  placeholder="Add an HR note or log a communication..."
                  value={noteText}
                  onChange={(e) => setNoteText(e.target.value)}
                  rows={6}
                />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={addNote}>
                    <MessageSquare className="mr-2 h-4 w-4" />
                    Add Note
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setEmailOpen(true)}>
                    <Mail className="mr-2 h-4 w-4" />
                    Email
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => setSmsOpen(true)}>
                    <Phone className="mr-2 h-4 w-4" />
                    SMS
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>HR Log</CardTitle>
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
                              const c = NOTE_TAGS.find((t) => t.value === tag)
                              return (
                                <span
                                  key={tag}
                                  className={`px-1.5 py-0.5 rounded text-xs font-medium ${c?.color || "bg-muted text-muted-foreground"}`}
                                >
                                  {c?.label || tag}
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

      {/* Email Modal */}
      <Dialog open={emailOpen} onOpenChange={setEmailOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Email Educator</DialogTitle>
            <DialogDescription>Compose an email to the educator.</DialogDescription>
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
                <option value="hr@pulse.ac.uk">hr@pulse.ac.uk</option>
                <option value="payroll@pulse.ac.uk">payroll@pulse.ac.uk</option>
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
            <DialogTitle>SMS Educator</DialogTitle>
            <DialogDescription>Max 600 characters.</DialogDescription>
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
            <div className="text-xs text-muted-foreground text-right">{SMS_LIMIT - smsText.length} remaining</div>
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
    </div>
  )
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      <Input value={value} readOnly className="bg-muted/30" aria-readonly />
    </div>
  )
}
function EditableField({
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

function KV({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1.5">
      <Label className="text-sm">{label}</Label>
      <div className="rounded border p-2 text-sm">{value}</div>
    </div>
  )
}

function InsuranceCard({ title, amount, expiry }: { title: string; amount?: string; expiry?: string }) {
  const d = daysUntil(expiry)
  const badge = expiryBadgeVariant(d)
  return (
    <div className="rounded border p-3">
      <div className="text-sm font-medium">{title}</div>
      <div className="mt-1 text-sm text-muted-foreground">Cover: {amount || "—"}</div>
      <div className="mt-1 flex items-center gap-2">
        <span className="text-sm">{expiry ? format(new Date(expiry), "PP") : "No expiry"}</span>
        <Badge variant={badge.variant as any}>{badge.label}</Badge>
      </div>
      <div className="mt-2">
        <Button size="sm" variant="outline">
          Upload Policy
        </Button>
      </div>
    </div>
  )
}

function maskText(text: string, reveal: boolean) {
  if (reveal) return text
  if (!text) return "—"
  return "••••••"
}
