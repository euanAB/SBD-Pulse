"use client"

import * as React from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import {
  ArrowLeft, Save, Trash2, Plus, X, MapPin, Clock, ExternalLink, Users, BookOpen,
  GraduationCap, FileText, Settings, Pencil, ChevronDown, ChevronUp, Upload,
  DollarSign, CalendarDays, Building2, AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter
} from "@/components/ui/dialog"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */
type Module = { id: string; title: string; hours: number; description?: string }
type Resource = { id: string; title: string; url: string; type: string }
type Location = {
  id: string; name: string; city: string; address: string;
  what3words?: string; amenities: string[]; capacity?: number
}
type Educator = {
  id: string; name: string; baseLocationId: string;
  specialties: string[]; hourlyRate?: number
}
type Assessment = {
  id: string; title: string; type: string;
  weight: number; passRate: number; description: string
}
type Course = {
  id: string; code: string; title: string; description: string;
  durationHours: number; upcomingClasses: number; activeClasses: number;
  completedClasses: number; totalStudentsEnrolled: number;
  status: "active" | "draft" | "archived";
  modules: Module[]; examination: string; assessments: Assessment[];
  resources: Resource[]; coverImage: string; locations: string[];
  educatorAssignments: { educatorId: string; locationIds: string[] }[];
  costPerStudent: number; minStudents: number; maxStudents: number;
  createdAt: string; updatedAt: string
}

/* ------------------------------------------------------------------ */
/*  Demo data                                                          */
/* ------------------------------------------------------------------ */
const demoLocations: Location[] = [
  { id: "LOC-SHF", name: "Sheffield Training Centre", city: "Sheffield", address: "12 Industry Way, Sheffield S1 2AB", what3words: "focus.rings.train", amenities: ["Classroom A", "Practice Stations", "Accessible WC", "Refreshments", "PPE Store"], capacity: 20 },
  { id: "LOC-LDS", name: "Leeds Studio", city: "Leeds", address: "8 Crown Street, Leeds LS1 3AG", what3words: "finely.wide.pitch", amenities: ["Studio 1", "Reception", "Parking Nearby", "Breakout Area"], capacity: 15 },
  { id: "LOC-MCR", name: "Manchester Hub", city: "Manchester", address: "45 Exchange Sq, Manchester M2 7DN", what3words: "signal.brave.lamp", amenities: ["Classroom B", "Lockers", "Kitchenette"], capacity: 18 },
]

const demoEducators: Educator[] = [
  { id: "EDU-EUAN", name: "Euan Fraser", baseLocationId: "LOC-SHF", specialties: ["Nail Gels", "Hygiene", "Client Care"], hourlyRate: 35 },
  { id: "EDU-MARIA", name: "Maria Santos", baseLocationId: "LOC-LDS", specialties: ["Acrylic Overlays", "Nail Art", "Nail Gels"], hourlyRate: 38 },
  { id: "EDU-AHMED", name: "Ahmed Khan", baseLocationId: "LOC-MCR", specialties: ["Manicure", "Hygiene", "Business & Compliance"], hourlyRate: 32 },
]

const demoCourses: Record<string, Course> = {
  "CRS-NAILS-001": {
    id: "CRS-NAILS-001", code: "NAIL-101", title: "Nail Beauty Therapy Training Course",
    description: "Comprehensive Nail Beauty Therapy covering anatomy, hygiene, manicure techniques, gel application, acrylic overlays, nail art basics, client consultation, and business compliance.",
    durationHours: 40, upcomingClasses: 2, activeClasses: 3, completedClasses: 8, totalStudentsEnrolled: 47,
    status: "active",
    examination: "Practical assessment (hands-on demonstration) and short written theory test",
    assessments: [
      { id: "A1", title: "Practical Assessment", type: "Practical", weight: 40, passRate: 70, description: "Hands-on demonstration of nail therapy techniques" },
      { id: "A2", title: "Theory Assessment", type: "Written", weight: 30, passRate: 70, description: "Written test on nail anatomy, hygiene, and client care knowledge" },
      { id: "A3", title: "Final Exam", type: "Comprehensive", weight: 30, passRate: 70, description: "Comprehensive final examination covering all modules" },
    ],
    modules: [
      { id: "M1", title: "Nail Anatomy & Physiology", hours: 4, description: "Structure, growth, common conditions." },
      { id: "M2", title: "Hygiene & Infection Control", hours: 4, description: "Standards, PPE, sterilization." },
      { id: "M3", title: "Manicure Foundations", hours: 6, description: "Tools, cuticle care, shaping, polish." },
      { id: "M4", title: "Gel Application (Nail Gels)", hours: 8, description: "Prep, application, lamp curing, removal." },
      { id: "M5", title: "Acrylic Overlays & Extensions", hours: 8, description: "Tips, forms, sculpting, finishing." },
      { id: "M6", title: "Nail Art Basics", hours: 4, description: "Designs, tools, trends." },
      { id: "M7", title: "Client Consultation & Care", hours: 3, description: "Assessments, contraindications, aftercare." },
      { id: "M8", title: "Business & Compliance", hours: 3, description: "Policies, records, insurance, pricing." },
    ],
    resources: [
      { id: "R1", title: "Hygiene Standards PDF", url: "https://example.com/resources/hygiene-standards.pdf", type: "PDF" },
      { id: "R2", title: "Nail Anatomy Reference", url: "https://example.com/resources/nail-anatomy", type: "Link" },
      { id: "R3", title: "Model Client Consultation Form", url: "https://example.com/resources/consultation-form", type: "Template" },
    ],
    coverImage: "/nail-therapy-course-banner.png",
    locations: ["LOC-SHF", "LOC-LDS", "LOC-MCR"],
    educatorAssignments: [
      { educatorId: "EDU-EUAN", locationIds: ["LOC-SHF"] },
      { educatorId: "EDU-MARIA", locationIds: ["LOC-LDS"] },
      { educatorId: "EDU-AHMED", locationIds: ["LOC-MCR"] },
    ],
    costPerStudent: 450, minStudents: 4, maxStudents: 12,
    createdAt: "2024-09-15", updatedAt: "2025-01-20",
  },
  "CRS-001": {
    id: "CRS-001", code: "FA-001", title: "First Aid Level 1",
    description: "Basics of first aid and emergency response.",
    durationHours: 8, upcomingClasses: 3, activeClasses: 1, completedClasses: 12, totalStudentsEnrolled: 89,
    status: "active",
    examination: "Practical scenarios and oral questioning",
    assessments: [
      { id: "A-FA1", title: "Practical Scenarios", type: "Practical", weight: 60, passRate: 75, description: "Live scenario-based first aid demonstrations" },
      { id: "A-FA2", title: "Oral Questioning", type: "Oral", weight: 40, passRate: 70, description: "Verbal knowledge check on first aid protocols" },
    ],
    modules: [{ id: "M-FA-1", title: "Primary Survey", hours: 2, description: "DRSABCD method and primary assessment." }, { id: "M-FA-2", title: "Wounds & Bleeding", hours: 2, description: "Managing cuts, burns, and bleeding." }, { id: "M-FA-3", title: "CPR & AED", hours: 2, description: "Cardiopulmonary resuscitation and defibrillator use." }, { id: "M-FA-4", title: "Medical Emergencies", hours: 2, description: "Allergic reactions, asthma, diabetes emergencies." }],
    resources: [{ id: "R-FA-1", title: "Primary Survey Checklist", url: "https://example.com/first-aid/primary-survey", type: "PDF" }],
    coverImage: "/first-aid-banner.png",
    locations: ["LOC-SHF"],
    educatorAssignments: [{ educatorId: "EDU-AHMED", locationIds: ["LOC-SHF"] }],
    costPerStudent: 120, minStudents: 6, maxStudents: 16,
    createdAt: "2024-06-01", updatedAt: "2025-02-01",
  },
  "CRS-002": {
    id: "CRS-002", code: "CPR-101", title: "CPR Essentials",
    description: "Cardiopulmonary resuscitation techniques for workplace and community responders.",
    durationHours: 6, upcomingClasses: 2, activeClasses: 1, completedClasses: 5, totalStudentsEnrolled: 34,
    status: "active",
    examination: "Practical assessment with manikins",
    assessments: [{ id: "A-CPR1", title: "Practical Assessment", type: "Practical", weight: 100, passRate: 80, description: "Demonstrate CPR on adult, child, and infant manikins" }],
    modules: [{ id: "M-CPR-1", title: "CPR Basics", hours: 2, description: "Chain of survival and technique." }, { id: "M-CPR-2", title: "AED Operation", hours: 2, description: "Automated External Defibrillator use." }, { id: "M-CPR-3", title: "Choking Response", hours: 2, description: "Clearing airways for adults, children, and infants." }],
    resources: [{ id: "R-CPR-1", title: "CPR Steps Poster", url: "https://example.com/cpr/poster", type: "PDF" }],
    coverImage: "/cpr-essentials-banner.png",
    locations: ["LOC-LDS"],
    educatorAssignments: [{ educatorId: "EDU-MARIA", locationIds: ["LOC-LDS"] }],
    costPerStudent: 95, minStudents: 6, maxStudents: 14,
    createdAt: "2024-08-10", updatedAt: "2025-01-15",
  },
}

const demoClasses = [
  { id: "CLS-2025-001", courseId: "CRS-NAILS-001", title: "Nail Therapy - Sheffield Jan 2025", status: "Teaching", educator: "Euan Fraser", location: "Sheffield", students: 10, startDate: "2025-01-15", endDate: "2025-03-15" },
  { id: "CLS-2025-002", courseId: "CRS-NAILS-001", title: "Nail Therapy - Leeds Feb 2025", status: "Enrolling", educator: "Maria Santos", location: "Leeds", students: 6, startDate: "2025-02-10", endDate: "2025-04-10" },
  { id: "CLS-2025-003", courseId: "CRS-NAILS-001", title: "Nail Therapy - Manchester Mar 2025", status: "Proposed", educator: "Ahmed Khan", location: "Manchester", students: 0, startDate: "2025-03-01", endDate: "2025-05-01" },
  { id: "CLS-2024-012", courseId: "CRS-NAILS-001", title: "Nail Therapy - Sheffield Oct 2024", status: "Completed", educator: "Euan Fraser", location: "Sheffield", students: 12, startDate: "2024-10-01", endDate: "2024-12-15" },
  { id: "CLS-2025-010", courseId: "CRS-001", title: "First Aid L1 - Sheffield Feb 2025", status: "Teaching", educator: "Ahmed Khan", location: "Sheffield", students: 14, startDate: "2025-02-01", endDate: "2025-02-08" },
  { id: "CLS-2025-011", courseId: "CRS-002", title: "CPR Essentials - Leeds Mar 2025", status: "Enrolling", educator: "Maria Santos", location: "Leeds", students: 8, startDate: "2025-03-01", endDate: "2025-03-06" },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function uid() { return Math.random().toString(36).slice(2, 10) }

const statusColor: Record<string, string> = {
  Teaching: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  Enrolling: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
  Proposed: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  Completed: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */
export default function CourseManagePage() {
  const params = useParams()
  const router = useRouter()
  const { toast } = useToast()
  const courseId = params.id as string

  const baseCourse = demoCourses[courseId]
  const [course, setCourse] = React.useState<Course | null>(baseCourse ?? null)
  const [editing, setEditing] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [addResourceOpen, setAddResourceOpen] = React.useState(false)
  const [addAssessmentOpen, setAddAssessmentOpen] = React.useState(false)
  const [expandedModule, setExpandedModule] = React.useState<string | null>(null)

  // New resource form
  const [newRes, setNewRes] = React.useState({ title: "", url: "", type: "PDF" })
  // New assessment form
  const [newAssessment, setNewAssessment] = React.useState({ title: "", type: "Practical", weight: 0, passRate: 70, description: "" })

  if (!course) {
    return (
      <div className="flex flex-col items-center justify-center gap-4 py-20">
        <AlertTriangle className="h-12 w-12 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Course not found</h2>
        <p className="text-sm text-muted-foreground">The course ID &ldquo;{courseId}&rdquo; does not exist.</p>
        <Button variant="outline" asChild><Link href="/admin/courses">Back to Courses</Link></Button>
      </div>
    )
  }

  const courseClasses = demoClasses.filter((c) => c.courseId === courseId)
  const totalModuleHours = course.modules.reduce((s, m) => s + m.hours, 0)
  const totalAssessmentWeight = course.assessments.reduce((s, a) => s + a.weight, 0)

  function updateField<K extends keyof Course>(key: K, value: Course[K]) {
    setCourse((prev) => prev ? { ...prev, [key]: value, updatedAt: new Date().toISOString().slice(0, 10) } : prev)
  }

  function saveChanges() {
    setEditing(false)
    toast({ title: "Course updated", description: `${course.title} has been saved.` })
  }

  function addResource() {
    if (!newRes.title.trim() || !newRes.url.trim()) return
    updateField("resources", [...course.resources, { id: uid(), ...newRes }])
    setNewRes({ title: "", url: "", type: "PDF" })
    setAddResourceOpen(false)
    toast({ title: "Resource added" })
  }

  function removeResource(id: string) {
    updateField("resources", course.resources.filter((r) => r.id !== id))
  }

  function addAssessment() {
    if (!newAssessment.title.trim() || newAssessment.weight <= 0) return
    updateField("assessments", [...course.assessments, { id: uid(), ...newAssessment }])
    setNewAssessment({ title: "", type: "Practical", weight: 0, passRate: 70, description: "" })
    setAddAssessmentOpen(false)
    toast({ title: "Assessment added" })
  }

  function removeAssessment(id: string) {
    updateField("assessments", course.assessments.filter((a) => a.id !== id))
  }

  function addModule() {
    updateField("modules", [...course.modules, { id: uid(), title: `Module ${course.modules.length + 1}`, hours: 2, description: "" }])
  }

  function removeModule(id: string) {
    updateField("modules", course.modules.filter((m) => m.id !== id))
  }

  function updateModule(id: string, field: keyof Module, value: string | number) {
    updateField("modules", course.modules.map((m) => m.id === id ? { ...m, [field]: value } : m))
  }

  function toggleLocation(locId: string) {
    const current = course.locations
    updateField("locations", current.includes(locId) ? current.filter((l) => l !== locId) : [...current, locId])
  }

  function toggleEducator(educatorId: string) {
    const current = course.educatorAssignments
    const exists = current.find((a) => a.educatorId === educatorId)
    if (exists) {
      updateField("educatorAssignments", current.filter((a) => a.educatorId !== educatorId))
    } else {
      updateField("educatorAssignments", [...current, { educatorId, locationIds: [...course.locations] }])
    }
  }

  function setEducatorLocations(educatorId: string, locationIds: string[]) {
    updateField("educatorAssignments", course.educatorAssignments.map((a) => a.educatorId === educatorId ? { ...a, locationIds } : a))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4">
        <Button variant="ghost" size="sm" className="w-fit" asChild>
          <Link href="/admin/courses"><ArrowLeft className="mr-2 h-4 w-4" />Back to Courses</Link>
        </Button>

        <div className="relative overflow-hidden rounded-lg border">
          <img src={course.coverImage || "/placeholder.svg"} alt={course.title} className="h-48 w-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30">{course.code}</Badge>
              <Badge className={cn("capitalize", course.status === "active" ? "bg-emerald-500" : course.status === "draft" ? "bg-amber-500" : "bg-gray-500")}>{course.status}</Badge>
            </div>
            <h1 className="mt-2 text-xl font-bold text-balance sm:text-2xl">{course.title}</h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button variant={editing ? "default" : "outline"} size="sm" onClick={() => editing ? saveChanges() : setEditing(true)}>
            {editing ? <><Save className="mr-2 h-4 w-4" />Save Changes</> : <><Pencil className="mr-2 h-4 w-4" />Edit Course</>}
          </Button>
          {editing && <Button variant="ghost" size="sm" onClick={() => { setCourse(baseCourse); setEditing(false) }}>Cancel</Button>}
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/classes?course=${encodeURIComponent(courseId)}`}><BookOpen className="mr-2 h-4 w-4" />View Classes</Link>
          </Button>
          <Button variant="outline" size="sm" asChild>
            <Link href="/admin/classes/propose"><Plus className="mr-2 h-4 w-4" />Propose New Class</Link>
          </Button>
          <div className="ml-auto">
            <Button variant="destructive" size="sm" onClick={() => setDeleteOpen(true)}>
              <Trash2 className="mr-2 h-4 w-4" />Archive Course
            </Button>
          </div>
        </div>
      </div>

      {/* Overview stats */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">
        {[
          { label: "Teaching Time", value: `${course.durationHours}h`, icon: Clock },
          { label: "Modules", value: course.modules.length, icon: BookOpen },
          { label: "Active Classes", value: course.activeClasses, icon: GraduationCap },
          { label: "Upcoming", value: course.upcomingClasses, icon: CalendarDays },
          { label: "Total Enrolled", value: course.totalStudentsEnrolled, icon: Users },
          { label: "Cost / Student", value: `\u00A3${course.costPerStudent}`, icon: DollarSign },
        ].map((stat) => (
          <Card key={stat.label}>
            <CardContent className="flex flex-col items-center gap-1 p-3 text-center">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <div className="text-lg font-bold tabular-nums">{stat.value}</div>
              <div className="text-xs text-muted-foreground">{stat.label}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="flex w-full overflow-x-auto">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="modules">Modules</TabsTrigger>
          <TabsTrigger value="assessments">Assessments</TabsTrigger>
          <TabsTrigger value="locations">Locations</TabsTrigger>
          <TabsTrigger value="educators">Educators</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="classes">Classes</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* ---- OVERVIEW ---- */}
        <TabsContent value="overview" className="space-y-4">
          <Card>
            <CardHeader><CardTitle>Course Details</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              {editing ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Course Code</Label>
                    <Input value={course.code} onChange={(e) => updateField("code", e.target.value.toUpperCase())} />
                  </div>
                  <div className="space-y-2">
                    <Label>Teaching Time (hours)</Label>
                    <Input type="number" min={1} value={course.durationHours} onChange={(e) => updateField("durationHours", parseInt(e.target.value || "0"))} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Title</Label>
                    <Input value={course.title} onChange={(e) => updateField("title", e.target.value)} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Description</Label>
                    <Textarea rows={4} value={course.description} onChange={(e) => updateField("description", e.target.value)} />
                  </div>
                  <div className="space-y-2 sm:col-span-2">
                    <Label>Examination</Label>
                    <Input value={course.examination} onChange={(e) => updateField("examination", e.target.value)} />
                  </div>
                  <div className="space-y-2">
                    <Label>Cost per Student</Label>
                    <div className="relative">
                      <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                      <Input className="pl-7" type="number" min={0} value={course.costPerStudent} onChange={(e) => updateField("costPerStudent", parseInt(e.target.value || "0"))} />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Cover Image URL</Label>
                    <Input value={course.coverImage} onChange={(e) => updateField("coverImage", e.target.value)} />
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <DetailRow label="Course Code" value={course.code} />
                    <DetailRow label="Teaching Time" value={`${course.durationHours} hours (${totalModuleHours}h across modules)`} />
                    <DetailRow label="Cost per Student" value={`\u00A3${course.costPerStudent.toLocaleString()}`} />
                    <DetailRow label="Min / Max Students" value={`${course.minStudents} - ${course.maxStudents}`} />
                    <DetailRow label="Created" value={course.createdAt} />
                    <DetailRow label="Last Updated" value={course.updatedAt} />
                  </div>
                  <Separator />
                  <div>
                    <div className="text-sm font-medium mb-1">Description</div>
                    <p className="text-sm text-muted-foreground">{course.description}</p>
                  </div>
                  <div>
                    <div className="text-sm font-medium mb-1">Examination</div>
                    <p className="text-sm text-muted-foreground">{course.examination}</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick overview of locations and educators */}
          <div className="grid gap-4 sm:grid-cols-2">
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Locations Available</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {course.locations.map((locId) => {
                    const loc = demoLocations.find((l) => l.id === locId)
                    return <Badge key={locId} variant="secondary"><MapPin className="mr-1 h-3 w-3" />{loc?.name ?? locId}</Badge>
                  })}
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="pb-2"><CardTitle className="text-sm">Assigned Educators</CardTitle></CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {course.educatorAssignments.map((a) => {
                    const ed = demoEducators.find((e) => e.id === a.educatorId)
                    return (
                      <Badge key={a.educatorId} variant="outline">
                        <GraduationCap className="mr-1 h-3 w-3" />{ed?.name ?? a.educatorId}
                        <span className="ml-1 text-muted-foreground">({a.locationIds.map((lid) => demoLocations.find((l) => l.id === lid)?.city ?? lid).join(", ")})</span>
                      </Badge>
                    )
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* ---- MODULES ---- */}
        <TabsContent value="modules" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Modules & Curriculum</CardTitle>
                  <CardDescription>Total: {totalModuleHours} hours across {course.modules.length} modules</CardDescription>
                </div>
                {editing && <Button size="sm" onClick={addModule}><Plus className="mr-2 h-4 w-4" />Add Module</Button>}
              </div>
            </CardHeader>
            <CardContent className="space-y-2">
              {course.modules.map((m, idx) => (
                <div key={m.id} className="rounded-lg border">
                  <button
                    type="button"
                    onClick={() => setExpandedModule(expandedModule === m.id ? null : m.id)}
                    className="flex w-full items-center justify-between p-3 text-left hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <span className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">{idx + 1}</span>
                      {editing ? (
                        <Input className="max-w-xs" value={m.title} onClick={(e) => e.stopPropagation()} onChange={(e) => updateModule(m.id, "title", e.target.value)} />
                      ) : (
                        <span className="font-medium text-sm">{m.title}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline"><Clock className="mr-1 h-3 w-3" />{m.hours}h</Badge>
                      {expandedModule === m.id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                    </div>
                  </button>
                  {expandedModule === m.id && (
                    <div className="border-t p-3 space-y-3">
                      {editing ? (
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div className="space-y-2">
                            <Label>Hours</Label>
                            <Input type="number" min={1} value={m.hours} onChange={(e) => updateModule(m.id, "hours", parseInt(e.target.value || "0"))} />
                          </div>
                          <div className="space-y-2 sm:col-span-2">
                            <Label>Description</Label>
                            <Textarea rows={2} value={m.description || ""} onChange={(e) => updateModule(m.id, "description", e.target.value)} />
                          </div>
                          <Button variant="destructive" size="sm" className="w-fit" onClick={() => removeModule(m.id)}><X className="mr-2 h-4 w-4" />Remove Module</Button>
                        </div>
                      ) : (
                        <p className="text-sm text-muted-foreground">{m.description || "No description provided."}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- ASSESSMENTS ---- */}
        <TabsContent value="assessments" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Assessment Overview</CardTitle>
                  <CardDescription>Total weight: {totalAssessmentWeight}%{totalAssessmentWeight !== 100 && <span className="ml-2 text-destructive font-medium">(should be 100%)</span>}</CardDescription>
                </div>
                <Button size="sm" onClick={() => setAddAssessmentOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Assessment</Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {course.assessments.map((a) => (
                <div key={a.id} className="rounded-lg border p-4 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="font-medium">{a.title}</div>
                      <p className="text-sm text-muted-foreground">{a.description}</p>
                    </div>
                    <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeAssessment(a.id)}><X className="h-4 w-4" /></Button>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Badge variant="outline">{a.type}</Badge>
                    <Badge variant="secondary">Weight: {a.weight}%</Badge>
                    <Badge variant="secondary">Pass Rate: {a.passRate}%</Badge>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div className="h-full rounded-full bg-primary transition-all" style={{ width: `${a.weight}%` }} />
                  </div>
                </div>
              ))}
              {course.assessments.length === 0 && <p className="text-sm text-muted-foreground italic">No assessments configured yet.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- LOCATIONS ---- */}
        <TabsContent value="locations" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Assigned Locations</CardTitle>
              <CardDescription>Where this course is available to be taught</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {demoLocations.map((loc) => {
                const assigned = course.locations.includes(loc.id)
                return (
                  <div key={loc.id} className={cn("rounded-lg border p-4 transition-colors", assigned ? "border-primary/30 bg-primary/5" : "opacity-60")}>
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <Checkbox checked={assigned} onCheckedChange={() => toggleLocation(loc.id)} />
                        <div>
                          <div className="font-medium">{loc.name}</div>
                          <div className="text-sm text-muted-foreground">{loc.address}</div>
                          {loc.what3words && <div className="text-xs text-muted-foreground mt-1">w3w: ///{loc.what3words}</div>}
                          <div className="mt-2 flex flex-wrap gap-1">
                            {loc.amenities.map((a) => <Badge key={a} variant="outline" className="text-xs">{a}</Badge>)}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        {loc.capacity && <Badge variant="secondary"><Users className="mr-1 h-3 w-3" />Cap: {loc.capacity}</Badge>}
                        {assigned && (
                          <Button variant="link" size="sm" className="mt-1" asChild>
                            <Link href={`/admin/locations/${loc.id}`}>View Location</Link>
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- EDUCATORS ---- */}
        <TabsContent value="educators" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Educator Assignments</CardTitle>
              <CardDescription>Assign educators and map them to locations (1-to-many)</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {demoEducators.map((ed) => {
                const assignment = course.educatorAssignments.find((a) => a.educatorId === ed.id)
                const assigned = !!assignment
                const baseLoc = demoLocations.find((l) => l.id === ed.baseLocationId)
                return (
                  <div key={ed.id} className={cn("rounded-lg border p-4 transition-colors", assigned ? "border-primary/30 bg-primary/5" : "opacity-60")}>
                    <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                      <div className="flex items-start gap-3">
                        <Checkbox checked={assigned} onCheckedChange={() => toggleEducator(ed.id)} />
                        <div>
                          <div className="font-medium">{ed.name}</div>
                          <div className="flex flex-wrap items-center gap-2 mt-1">
                            <Badge variant="secondary"><MapPin className="mr-1 h-3 w-3" />Base: {baseLoc?.city ?? "Unknown"}</Badge>
                            {ed.hourlyRate && <Badge variant="outline">£{ed.hourlyRate}/hr</Badge>}
                          </div>
                          <div className="flex flex-wrap gap-1 mt-2">
                            {ed.specialties.map((s) => <Badge key={s} variant="outline" className="text-xs">{s}</Badge>)}
                          </div>
                        </div>
                      </div>
                      {assigned && (
                        <div className="sm:max-w-xs w-full">
                          <Label className="text-xs">Assigned Locations</Label>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {course.locations.map((locId) => {
                              const isChecked = assignment.locationIds.includes(locId)
                              const loc = demoLocations.find((l) => l.id === locId)
                              return (
                                <button
                                  key={locId}
                                  type="button"
                                  onClick={() => {
                                    const newIds = isChecked
                                      ? assignment.locationIds.filter((x) => x !== locId)
                                      : [...assignment.locationIds, locId]
                                    setEducatorLocations(ed.id, newIds)
                                  }}
                                  className={cn(
                                    "flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm transition",
                                    isChecked ? "border-primary bg-primary/10" : "hover:bg-muted"
                                  )}
                                >
                                  {loc?.city ?? locId}
                                  {isChecked && <span className="text-primary text-xs font-bold">&#10003;</span>}
                                </button>
                              )
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                    {assigned && (
                      <Button variant="link" size="sm" className="mt-2" asChild>
                        <Link href={`/admin/educators/${ed.id}`}>View Educator Profile</Link>
                      </Button>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- RESOURCES ---- */}
        <TabsContent value="resources" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Course Resources</CardTitle>
                  <CardDescription>{course.resources.length} resource{course.resources.length !== 1 ? "s" : ""} attached</CardDescription>
                </div>
                <Button size="sm" onClick={() => setAddResourceOpen(true)}><Plus className="mr-2 h-4 w-4" />Add Resource</Button>
              </div>
            </CardHeader>
            <CardContent>
              {course.resources.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">No resources attached yet.</p>
              ) : (
                <div className="space-y-2">
                  {course.resources.map((r) => (
                    <div key={r.id} className="flex items-center justify-between rounded-lg border p-3">
                      <div className="flex items-center gap-3">
                        <FileText className="h-5 w-5 text-muted-foreground" />
                        <div>
                          <div className="font-medium text-sm">{r.title}</div>
                          <a href={r.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline flex items-center gap-1">
                            <ExternalLink className="h-3 w-3" />Open
                          </a>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{r.type}</Badge>
                        <Button variant="ghost" size="sm" className="text-destructive" onClick={() => removeResource(r.id)}><X className="h-4 w-4" /></Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- CLASSES ---- */}
        <TabsContent value="classes" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Classes for this Course</CardTitle>
                  <CardDescription>{courseClasses.length} class{courseClasses.length !== 1 ? "es" : ""} found</CardDescription>
                </div>
                <Button size="sm" asChild>
                  <Link href="/admin/classes/propose"><Plus className="mr-2 h-4 w-4" />Propose New Class</Link>
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Educator</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Students</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead className="w-[80px]" />
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {courseClasses.length === 0 ? (
                      <TableRow><TableCell colSpan={8} className="h-24 text-center text-muted-foreground italic">No classes for this course yet.</TableCell></TableRow>
                    ) : courseClasses.map((cls) => (
                      <TableRow key={cls.id}>
                        <TableCell className="font-mono text-xs">{cls.id}</TableCell>
                        <TableCell className="font-medium">{cls.title}</TableCell>
                        <TableCell><span className={cn("inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium", statusColor[cls.status] || "")}>{cls.status}</span></TableCell>
                        <TableCell>{cls.educator}</TableCell>
                        <TableCell>{cls.location}</TableCell>
                        <TableCell className="tabular-nums">{cls.students}</TableCell>
                        <TableCell className="text-xs text-muted-foreground">{cls.startDate} — {cls.endDate}</TableCell>
                        <TableCell>
                          <Button variant="ghost" size="sm" asChild>
                            <Link href={`/admin/classes/${cls.id}`}>Open</Link>
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ---- SETTINGS ---- */}
        <TabsContent value="settings" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Course Settings</CardTitle>
              <CardDescription>Configuration and pricing</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={course.status} onValueChange={(v) => updateField("status", v as Course["status"])}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="archived">Archived</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Cost per Student (£)</Label>
                  <div className="relative">
                    <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">£</span>
                    <Input className="pl-7" type="number" min={0} value={course.costPerStudent} onChange={(e) => updateField("costPerStudent", parseInt(e.target.value || "0"))} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Minimum Students</Label>
                  <Input type="number" min={1} value={course.minStudents} onChange={(e) => updateField("minStudents", parseInt(e.target.value || "1"))} />
                </div>
                <div className="space-y-2">
                  <Label>Maximum Students</Label>
                  <Input type="number" min={1} value={course.maxStudents} onChange={(e) => updateField("maxStudents", parseInt(e.target.value || "1"))} />
                </div>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Publicly visible</div>
                  <div className="text-xs text-muted-foreground">Show on sbd.school for student browsing</div>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">Accept online enrolment</div>
                  <div className="text-xs text-muted-foreground">Allow students to self-enrol via invitations</div>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={() => toast({ title: "Settings saved", description: "Course settings have been updated." })}>
                <Save className="mr-2 h-4 w-4" />Save Settings
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Delete confirmation */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Archive this course?</DialogTitle>
            <DialogDescription>This will mark the course as archived. It will no longer appear in active listings but historical data will be preserved. Active classes will not be affected.</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteOpen(false)}>Cancel</Button>
            <Button variant="destructive" onClick={() => { setDeleteOpen(false); toast({ title: "Course archived" }); router.push("/admin/courses") }}>Archive Course</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add resource modal */}
      <Dialog open={addResourceOpen} onOpenChange={setAddResourceOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Resource</DialogTitle>
            <DialogDescription>Attach a document, link, or template to this course.</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={newRes.title} onChange={(e) => setNewRes((p) => ({ ...p, title: e.target.value }))} placeholder="e.g., Hygiene Standards PDF" />
            </div>
            <div className="space-y-2">
              <Label>URL</Label>
              <Input value={newRes.url} onChange={(e) => setNewRes((p) => ({ ...p, url: e.target.value }))} placeholder="https://..." />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={newRes.type} onValueChange={(v) => setNewRes((p) => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="PDF">PDF</SelectItem>
                  <SelectItem value="Link">Link</SelectItem>
                  <SelectItem value="Template">Template</SelectItem>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="Image">Image</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddResourceOpen(false)}>Cancel</Button>
            <Button onClick={addResource} disabled={!newRes.title.trim() || !newRes.url.trim()}>Add Resource</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add assessment modal */}
      <Dialog open={addAssessmentOpen} onOpenChange={setAddAssessmentOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Assessment</DialogTitle>
            <DialogDescription>Configure an assessment for this course. Current total weight: {totalAssessmentWeight}%</DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-2">
              <Label>Title</Label>
              <Input value={newAssessment.title} onChange={(e) => setNewAssessment((p) => ({ ...p, title: e.target.value }))} placeholder="e.g., Practical Assessment" />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={newAssessment.type} onValueChange={(v) => setNewAssessment((p) => ({ ...p, type: v }))}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="Practical">Practical</SelectItem>
                  <SelectItem value="Written">Written</SelectItem>
                  <SelectItem value="Oral">Oral</SelectItem>
                  <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                  <SelectItem value="Coursework">Coursework</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label>Weight (%)</Label>
                <Input type="number" min={1} max={100} value={newAssessment.weight || ""} onChange={(e) => setNewAssessment((p) => ({ ...p, weight: parseInt(e.target.value || "0") }))} />
              </div>
              <div className="space-y-2">
                <Label>Pass Rate (%)</Label>
                <Input type="number" min={1} max={100} value={newAssessment.passRate} onChange={(e) => setNewAssessment((p) => ({ ...p, passRate: parseInt(e.target.value || "0") }))} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea rows={2} value={newAssessment.description} onChange={(e) => setNewAssessment((p) => ({ ...p, description: e.target.value }))} placeholder="Describe the assessment..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddAssessmentOpen(false)}>Cancel</Button>
            <Button onClick={addAssessment} disabled={!newAssessment.title.trim() || newAssessment.weight <= 0}>Add Assessment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="text-sm">
      <div className="text-muted-foreground text-xs">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  )
}
