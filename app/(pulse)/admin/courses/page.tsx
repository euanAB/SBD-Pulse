"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Check, ChevronLeft, ChevronRight, X, MapPin, Clock, Search, Filter, ExternalLink } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { useToast } from "@/hooks/use-toast"
import { cn } from "@/lib/utils"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

// Types
type Module = {
  id: string
  title: string
  hours: number
  description?: string
}

type Resource = {
  id: string
  title: string
  url: string
}

type Location = {
  id: string
  name: string
  city: string
  address: string
  what3words?: string
  amenities: string[]
}

type Educator = {
  id: string
  name: string
  baseLocationId: string
  specialties: string[] // tags like "Nail Gels", "Acrylic", "Manicure"
}

type Course = {
  id: string
  code: string
  title: string
  description: string
  durationHours: number
  upcomingClasses: number
  modules: Module[]
  examination: string
  resources: Resource[]
  coverImage: string
  locations: string[]
  educatorAssignments: { educatorId: string; locationIds: string[] }[]
}

// Demo data
const demoLocations: Location[] = [
  {
    id: "LOC-SHF",
    name: "Sheffield Training Centre",
    city: "Sheffield",
    address: "12 Industry Way, Sheffield S1 2AB",
    what3words: "focus.rings.train",
    amenities: ["Classroom A", "Practice Stations", "Accessible WC", "Refreshments", "PPE Store"],
  },
  {
    id: "LOC-LDS",
    name: "Leeds Studio",
    city: "Leeds",
    address: "8 Crown Street, Leeds LS1 3AG",
    what3words: "finely.wide.pitch",
    amenities: ["Studio 1", "Reception", "Parking Nearby", "Breakout Area"],
  },
  {
    id: "LOC-MCR",
    name: "Manchester Hub",
    city: "Manchester",
    address: "45 Exchange Sq, Manchester M2 7DN",
    what3words: "signal.brave.lamp",
    amenities: ["Classroom B", "Lockers", "Kitchenette"],
  },
]

const demoEducators: Educator[] = [
  {
    id: "EDU-EUAN",
    name: "Euan Fraser",
    baseLocationId: "LOC-SHF",
    specialties: ["Nail Gels", "Hygiene", "Client Care"],
  },
  {
    id: "EDU-MARIA",
    name: "Maria Santos",
    baseLocationId: "LOC-LDS",
    specialties: ["Acrylic Overlays", "Nail Art", "Nail Gels"],
  },
  {
    id: "EDU-AHMED",
    name: "Ahmed Khan",
    baseLocationId: "LOC-MCR",
    specialties: ["Manicure", "Hygiene", "Business & Compliance"],
  },
]

// Pre-seeded courses including Nail Beauty Therapy
const initialCourses: Course[] = [
  {
    id: "CRS-NAILS-001",
    code: "NAIL-101",
    title: "Nail Beauty Therapy Training Course",
    description:
      "Comprehensive Nail Beauty Therapy covering anatomy, hygiene, manicure techniques, gel application, acrylic overlays, nail art basics, client consultation, and business compliance.",
    durationHours: 40,
    upcomingClasses: 2,
    examination: "Practical assessment and short written test",
    coverImage: "/nail-therapy-course-banner.png",
    modules: [
      { id: "M1", title: "Nail Anatomy & Physiology", hours: 4, description: "Structure, growth, common conditions." },
      { id: "M2", title: "Hygiene & Infection Control", hours: 4, description: "Standards, PPE, sterilization." },
      { id: "M3", title: "Manicure Foundations", hours: 6, description: "Tools, cuticle care, shaping, polish." },
      {
        id: "M4",
        title: "Gel Application (Nail Gels)",
        hours: 8,
        description: "Prep, application, lamp curing, removal.",
      },
      { id: "M5", title: "Acrylic Overlays & Extensions", hours: 8, description: "Tips, forms, sculpting, finishing." },
      { id: "M6", title: "Nail Art Basics", hours: 4, description: "Designs, tools, trends." },
      {
        id: "M7",
        title: "Client Consultation & Care",
        hours: 3,
        description: "Assessments, contraindications, aftercare.",
      },
      { id: "M8", title: "Business & Compliance", hours: 3, description: "Policies, records, insurance, pricing." },
    ],
    resources: [
      {
        id: "R1",
        title: "Hygiene Standards PDF",
        url: "https://example.com/resources/hygiene-standards.pdf",
      },
      {
        id: "R2",
        title: "Nail Anatomy Reference",
        url: "https://example.com/resources/nail-anatomy",
      },
      {
        id: "R3",
        title: "Model Client Consultation Form",
        url: "https://example.com/resources/consultation-form",
      },
    ],
    locations: ["LOC-SHF", "LOC-LDS", "LOC-MCR"],
    educatorAssignments: [
      { educatorId: "EDU-EUAN", locationIds: ["LOC-SHF"] },
      { educatorId: "EDU-MARIA", locationIds: ["LOC-LDS"] },
      { educatorId: "EDU-AHMED", locationIds: ["LOC-MCR"] },
    ],
  },
  {
    id: "CRS-001",
    code: "FA-001",
    title: "First Aid Level 1",
    description: "Basics of first aid and emergency response.",
    durationHours: 8,
    upcomingClasses: 3,
    examination: "Practical scenarios and oral questioning",
    coverImage: "/first-aid-banner.png",
    modules: [{ id: "M-FA-1", title: "Primary Survey", hours: 2 }],
    resources: [
      { id: "R-FA-1", title: "Primary Survey Checklist", url: "https://example.com/first-aid/primary-survey" },
    ],
    locations: ["LOC-SHF"],
    educatorAssignments: [{ educatorId: "EDU-AHMED", locationIds: ["LOC-SHF"] }],
  },
  {
    id: "CRS-002",
    code: "CPR-101",
    title: "CPR Essentials",
    description: "Cardiopulmonary resuscitation techniques.",
    durationHours: 6,
    upcomingClasses: 2,
    examination: "Practical assessment with manikins",
    coverImage: "/cpr-essentials-banner.png",
    modules: [{ id: "M-CPR-1", title: "CPR Basics", hours: 2 }],
    resources: [{ id: "R-CPR-1", title: "CPR Steps Poster", url: "https://example.com/cpr/poster" }],
    locations: ["LOC-LDS"],
    educatorAssignments: [{ educatorId: "EDU-MARIA", locationIds: ["LOC-LDS"] }],
  },
]

export default function CoursesPage() {
  const [tab, setTab] = React.useState("card-view") // Default to card view
  const [courses, setCourses] = React.useState<Course[]>(initialCourses)
  const [query, setQuery] = React.useState("")
  const { toast } = useToast()

  const filteredCourses = courses.filter((c) => {
    const q = query.toLowerCase()
    return (
      c.title.toLowerCase().includes(q) || c.code.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    )
  })

  return (
    <Tabs value={tab} onValueChange={setTab} className="w-full">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <h1 className="text-xl font-semibold">Courses</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="relative w-full sm:max-w-md">
              <Search className="pointer-events-none absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 opacity-50" />
              <Input
                placeholder="Search courses by title, code, or description..."
                className="pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <Button variant="outline" className="bg-transparent">
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <TabsList className="hidden sm:flex">
            <TabsTrigger value="card-view">Card View</TabsTrigger>
            <TabsTrigger value="list-view">List View</TabsTrigger>
            <TabsTrigger value="create">Create Course</TabsTrigger>
          </TabsList>
          <Button
            variant="default"
            className="sm:hidden"
            onClick={() => setTab(tab === "create" ? "card-view" : "create")}
          >
            {tab === "create" ? (
              <>
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </>
            ) : (
              <>
                <Plus className="mr-2 h-4 w-4" /> Create
              </>
            )}
          </Button>
        </div>

        <TabsContent value="card-view" className="space-y-4">
          <CatalogueCardView courses={filteredCourses} />
        </TabsContent>

        <TabsContent value="list-view" className="space-y-4">
          <CatalogueTableView courses={filteredCourses} />
        </TabsContent>

        <TabsContent value="create">
          <CreateCourseWizard
            locations={demoLocations}
            educators={demoEducators}
            onSubmit={(course) => {
              setCourses((prev) => [{ ...course, id: `CRS-${Date.now()}` }, ...prev])
              toast({ title: "Course created", description: "Your course has been added to the catalogue." })
              setTab("card-view") // Switch back to card view after creation
            }}
          />
        </TabsContent>

        <div className="text-xs text-muted-foreground">
          Tip: Teaching time is tracked in hours. Assign educators to locations to unlock where a course can be taught.
        </div>
      </div>
    </Tabs>
  )
}

function CatalogueCardView({ courses }: { courses: Course[] }) {
  return (
    <div className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {courses.map((c) => (
          <Card key={c.id} className="overflow-hidden">
            {/* Image header */}
            <div className="w-full">
              <img
                src={c.coverImage || "/placeholder.svg"}
                alt={`${c.title} banner image`}
                className="h-40 w-full object-cover"
                loading="lazy"
              />
            </div>

            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{c.title}</CardTitle>
                <Badge variant="outline">{c.code}</Badge>
              </div>
            </CardHeader>

            <CardContent className="space-y-3">
              <div className="text-sm text-muted-foreground line-clamp-3">{c.description}</div>

              <div className="grid gap-3 sm:grid-cols-3">
                <InfoLine
                  label="Teaching time"
                  value={
                    <div className="inline-flex items-center gap-2">
                      <Clock className="mr-1 h-3.5 w-3.5 opacity-70" />
                      <span className="tabular-nums">{c.durationHours} hours</span>
                    </div>
                  }
                />
                <InfoLine label="Exam" value={c.examination} />
                <InfoLine label="Upcoming classes" value={`${c.upcomingClasses}`} />
              </div>

              {/* Modules preview */}
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Key modules</div>
                <div className="flex flex-wrap gap-2">
                  {c.modules.slice(0, 5).map((m) => (
                    <Badge key={m.id} variant="outline">
                      {m.title}
                    </Badge>
                  ))}
                  {c.modules.length > 5 && <Badge variant="outline">+{c.modules.length - 5} more</Badge>}
                </div>
              </div>

              {/* Locations */}
              <div className="flex flex-wrap gap-2">
                {c.locations.slice(0, 4).map((locId) => {
                  const loc = demoLocations.find((l) => l.id === locId)
                  return (
                    <Badge key={locId} variant="secondary">
                      <MapPin className="mr-1 h-3 w-3" />
                      {loc ? loc.city : locId}
                    </Badge>
                  )
                })}
              </div>

              {/* Resources */}
              <div>
                <div className="text-xs font-medium text-muted-foreground mb-1">Resources</div>
                <div className="flex flex-wrap gap-2">
                  {c.resources.slice(0, 3).map((r) => (
                    <a
                      key={r.id}
                      href={r.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
                    >
                      <ExternalLink className="h-3 w-3" />
                      <span className="truncate max-w-[180px]">{r.title}</span>
                    </a>
                  ))}
                  {c.resources.length === 0 && <span className="text-xs text-muted-foreground">No resources</span>}
                </div>
              </div>
            </CardContent>

            <CardFooter className="gap-2">
              <Button variant="secondary" size="sm" asChild>
                <Link href={`/admin/courses/${encodeURIComponent(c.id)}`}>Manage Course</Link>
              </Button>
              <Button variant="outline" size="sm" asChild>
                <Link href={`/admin/classes?course=${encodeURIComponent(c.id)}`}>View Classes</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
        {courses.length === 0 && (
          <div className="text-sm text-muted-foreground italic">No courses match your search.</div>
        )}
      </div>
    </div>
  )
}

function CatalogueTableView({ courses }: { courses: Course[] }) {
  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Code</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Examination</TableHead>
            <TableHead>Upcoming Classes</TableHead>
            <TableHead>Locations</TableHead>
            <TableHead className="w-[100px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {courses.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center text-muted-foreground italic">
                No courses match your search.
              </TableCell>
            </TableRow>
          ) : (
            courses.map((c) => (
              <TableRow key={c.id}>
                <TableCell className="font-medium">{c.code}</TableCell>
                <TableCell>{c.title}</TableCell>
                <TableCell>{c.durationHours} hours</TableCell>
                <TableCell className="max-w-[200px] truncate">{c.examination}</TableCell>
                <TableCell>{c.upcomingClasses}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {c.locations.map((locId) => {
                      const loc = demoLocations.find((l) => l.id === locId)
                      return (
                        <Badge key={locId} variant="secondary" className="whitespace-nowrap">
                          {loc ? loc.city : locId}
                        </Badge>
                      )
                    })}
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Button variant="secondary" size="sm" asChild>
                      <Link href={`/admin/courses/${encodeURIComponent(c.id)}`}>Manage</Link>
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
}

function InfoLine({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="rounded-md border p-2 text-sm">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="font-medium">{value}</div>
    </div>
  )
}

function CreateCourseWizard({
  locations,
  educators,
  onSubmit,
}: {
  locations: Location[]
  educators: Educator[]
  onSubmit: (course: Omit<Course, "id">) => void
}) {
  const [step, setStep] = React.useState(1)
  const maxStep = 5

  // Course state
  const [code, setCode] = React.useState("")
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [durationHours, setDurationHours] = React.useState<number>(0)
  const [examination, setExamination] = React.useState("")
  const [coverImage, setCoverImage] = React.useState("/course-banner.png")
  const [upcomingClasses, setUpcomingClasses] = React.useState<number>(0)

  const [modules, setModules] = React.useState<Module[]>([
    { id: cryptoId(), title: "Module 1", hours: 2, description: "" },
  ])
  const [resources, setResources] = React.useState<Resource[]>([])
  const [selectedLocationIds, setSelectedLocationIds] = React.useState<string[]>([])
  const [assignments, setAssignments] = React.useState<{ educatorId: string; locationIds: string[] }[]>([])

  const canNext =
    (step === 1 &&
      code.trim().length > 0 &&
      title.trim().length > 2 &&
      description.trim().length > 10 &&
      durationHours > 0 &&
      examination.trim().length > 3) ||
    (step === 2 && modules.length > 0 && modules.every((m) => m.title.trim() && m.hours > 0)) ||
    (step === 3 /* resources optional, always pass */ && true) ||
    (step === 4 && selectedLocationIds.length > 0 && assignments.length > 0) ||
    step === 5

  function toggleLocation(id: string) {
    setSelectedLocationIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]))
  }

  function toggleEducator(educatorId: string) {
    setAssignments((prev) => {
      const exists = prev.find((a) => a.educatorId === educatorId)
      if (exists) return prev.filter((a) => a.educatorId !== educatorId)
      // default assignment to all selected locations
      return [...prev, { educatorId, locationIds: [...selectedLocationIds] }]
    })
  }

  function setEducatorLocations(educatorId: string, locationIds: string[]) {
    setAssignments((prev) => prev.map((a) => (a.educatorId === educatorId ? { ...a, locationIds: locationIds } : a)))
  }

  function addModule() {
    setModules((prev) => [...prev, { id: cryptoId(), title: `Module ${prev.length + 1}`, hours: 2 }])
  }

  function removeModule(id: string) {
    setModules((prev) => prev.filter((m) => m.id !== id))
  }

  function addResource() {
    setResources((prev) => [...prev, { id: cryptoId(), title: "", url: "" }])
  }

  function removeResource(id: string) {
    setResources((prev) => prev.filter((r) => r.id !== id))
  }

  function submit() {
    onSubmit({
      code,
      title,
      description,
      durationHours,
      upcomingClasses,
      modules,
      examination,
      resources: resources.filter((r) => r.title.trim() && r.url.trim()),
      coverImage,
      locations: selectedLocationIds,
      educatorAssignments: assignments,
    })
  }

  return (
    <div className="space-y-4">
      {/* Progress badges */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant={step === 1 ? "default" : "outline"} className="w-8 justify-center">
            1
          </Badge>
          <Badge variant={step === 2 ? "default" : "outline"} className="w-8 justify-center">
            2
          </Badge>
          <Badge variant={step === 3 ? "default" : "outline"} className="w-8 justify-center">
            3
          </Badge>
          <Badge variant={step === 4 ? "default" : "outline"} className="w-8 justify-center">
            4
          </Badge>
          <Badge variant={step === 5 ? "default" : "outline"} className="w-8 justify-center">
            5
          </Badge>
        </div>
        <div className="text-sm text-muted-foreground">Full-page multistep to capture all course info</div>
      </div>

      {/* Step 1: Core details */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="code">Course Code</Label>
              <Input
                id="code"
                value={code}
                onChange={(e) => setCode(e.target.value.toUpperCase())}
                placeholder="e.g., NAIL-101"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="hours">Teaching Time (hours)</Label>
              <Input
                id="hours"
                type="number"
                min={1}
                value={durationHours}
                onChange={(e) => setDurationHours(Number.parseInt(e.target.value || "0", 10))}
                placeholder="e.g., 40"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g., Nail Beauty Therapy Training Course"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="desc">Description</Label>
              <Textarea
                id="desc"
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe the course content, outcomes, and who it's for."
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="exam">Examination</Label>
              <Input
                id="exam"
                value={examination}
                onChange={(e) => setExamination(e.target.value)}
                placeholder="e.g., Practical assessment and written test"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="upcoming">Upcoming Classes</Label>
              <Input
                id="upcoming"
                type="number"
                min={0}
                value={upcomingClasses}
                onChange={(e) => setUpcomingClasses(Number.parseInt(e.target.value || "0", 10))}
                placeholder="0"
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="cover">Cover Image URL</Label>
              <Input
                id="cover"
                value={coverImage}
                onChange={(e) => setCoverImage(e.target.value)}
                placeholder="/course-banner.png"
              />
              <div className="mt-2 rounded-md border">
                <img
                  src={coverImage || "/placeholder.svg"}
                  alt="Cover image preview"
                  className="h-32 w-full rounded-md object-cover"
                  loading="lazy"
                />
              </div>
            </div>

            {/* Resources editor (optional) */}
            <div className="sm:col-span-2">
              <div className="flex items-center justify-between">
                <Label className="block">Resources (optional)</Label>
                <Button variant="outline" size="sm" onClick={addResource}>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Resource
                </Button>
              </div>
              <div className="mt-3 space-y-3">
                {resources.map((r) => (
                  <div key={r.id} className="grid gap-2 sm:grid-cols-12">
                    <div className="sm:col-span-5">
                      <Label className="text-xs">Title</Label>
                      <Input
                        value={r.title}
                        onChange={(e) =>
                          setResources((prev) => prev.map((x) => (x.id === r.id ? { ...x, title: e.target.value } : x)))
                        }
                        placeholder="Resource title"
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <Label className="text-xs">URL</Label>
                      <Input
                        value={r.url}
                        onChange={(e) =>
                          setResources((prev) => prev.map((x) => (x.id === r.id ? { ...x, url: e.target.value } : x)))
                        }
                        placeholder="https://..."
                      />
                    </div>
                    <div className="sm:col-span-1 flex items-end">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-600 hover:text-red-700"
                        onClick={() => removeResource(r.id)}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {resources.length === 0 && <div className="text-xs text-muted-foreground">No resources added yet.</div>}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Modules */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Modules & Hours
              <span className="ml-2 text-sm font-normal text-muted-foreground">(Add modules and teaching time)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {modules.map((m, idx) => (
              <div key={m.id} className={cn("grid gap-3 sm:grid-cols-12", idx > 0 && "border-t pt-3")}>
                <div className="sm:col-span-5 space-y-2">
                  <Label>Title</Label>
                  <Input
                    value={m.title}
                    onChange={(e) =>
                      setModules((prev) => prev.map((x) => (x.id === m.id ? { ...x, title: e.target.value } : x)))
                    }
                    placeholder="e.g., Gel Application"
                  />
                </div>
                <div className="sm:col-span-2 space-y-2">
                  <Label>Hours</Label>
                  <Input
                    type="number"
                    min={1}
                    value={m.hours}
                    onChange={(e) =>
                      setModules((prev) =>
                        prev.map((x) =>
                          x.id === m.id ? { ...x, hours: Number.parseInt(e.target.value || "0", 10) } : x,
                        ),
                      )
                    }
                    placeholder="2"
                  />
                </div>
                <div className="sm:col-span-5 space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={m.description || ""}
                    onChange={(e) =>
                      setModules((prev) => prev.map((x) => (x.id === m.id ? { ...x, description: e.target.value } : x)))
                    }
                    placeholder="Optional details..."
                  />
                </div>
                <div className="sm:col-span-12">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-600 hover:text-red-700"
                    onClick={() => removeModule(m.id)}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Remove
                  </Button>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between">
              <Button variant="outline" onClick={addModule}>
                <Plus className="mr-2 h-4 w-4" />
                Add Module
              </Button>
              <div className="text-xs text-muted-foreground">
                Total entered module hours:{" "}
                <span className="font-medium">
                  {modules.reduce((sum, m) => sum + (Number.isFinite(m.hours) ? m.hours : 0), 0)}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Locations */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Locations
              <span className="ml-2 text-sm font-normal text-muted-foreground">(Select where this course can run)</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {locations.map((loc) => (
              <label
                key={loc.id}
                className={cn(
                  "flex cursor-pointer flex-col rounded-md border p-3 transition",
                  selectedLocationIds.includes(loc.id) ? "border-primary ring-2 ring-primary/20" : "hover:bg-muted/50",
                )}
              >
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selectedLocationIds.includes(loc.id)}
                    onCheckedChange={() => toggleLocation(loc.id)}
                    id={`loc-${loc.id}`}
                  />
                  <div className="flex-1">
                    <div className="font-medium">{loc.name}</div>
                    <div className="text-xs text-muted-foreground">{loc.address}</div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      {loc.amenities.slice(0, 4).map((a) => (
                        <Badge key={a} variant="outline">
                          {a}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              </label>
            ))}
          </CardContent>
          <CardFooter className="text-xs text-muted-foreground">
            Need to add a new site? Use Admin → Locations.
          </CardFooter>
        </Card>
      )}

      {/* Step 4: Educator assignments */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>
              Educator Assignments
              <span className="ml-2 text-sm font-normal text-muted-foreground">
                Assign educators and map them to locations (1-to-many)
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {educators.map((ed) => {
              const assigned = assignments.find((a) => a.educatorId === ed.id)
              const baseLoc = demoLocations.find((l) => l.id === ed.baseLocationId)
              return (
                <div key={ed.id} className="rounded-md border p-3">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={!!assigned}
                          onCheckedChange={() => toggleEducator(ed.id)}
                          id={`ed-${ed.id}`}
                        />
                        <Label htmlFor={`ed-${ed.id}`} className="cursor-pointer font-medium">
                          {ed.name}
                        </Label>
                      </div>
                      <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
                        <Badge variant="secondary">
                          <MapPin className="mr-1 h-3 w-3" />
                          {baseLoc?.city ?? "Unknown"}
                        </Badge>
                        {ed.specialties.map((s) => (
                          <Badge key={s} variant="outline">
                            {s}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="w-full sm:max-w-md">
                      <Label className="text-xs">Locations for {ed.name}</Label>
                      <div className="mt-2 grid grid-cols-2 gap-2">
                        {selectedLocationIds.map((locId) => {
                          const isChecked = !!assigned?.locationIds.includes(locId)
                          const toggle = () => {
                            const newIds = isChecked
                              ? (assigned?.locationIds ?? []).filter((x) => x !== locId)
                              : Array.from(new Set([...(assigned?.locationIds ?? []), locId]))
                            setEducatorLocations(ed.id, newIds)
                          }
                          const loc = demoLocations.find((l) => l.id === locId)
                          return (
                            <button
                              type="button"
                              key={`${ed.id}-${locId}`}
                              onClick={toggle}
                              className={cn(
                                "flex items-center justify-between rounded-md border px-3 py-2 text-sm transition",
                                isChecked ? "border-primary bg-primary/5" : "hover:bg-muted",
                              )}
                            >
                              <span className="truncate">{loc?.city ?? locId}</span>
                              {isChecked ? (
                                <Check className="h-4 w-4 text-primary" />
                              ) : (
                                <Plus className="h-4 w-4 opacity-50" />
                              )}
                            </button>
                          )
                        })}
                        {selectedLocationIds.length === 0 && (
                          <div className="col-span-2 text-xs text-muted-foreground">
                            Select locations in Step 3 to assign educators.
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      )}

      {/* Step 5: Review */}
      {step === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>Review & Save</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <SummaryRow label="Code" value={code || "—"} />
            <SummaryRow label="Title" value={title || "—"} />
            <SummaryRow label="Description" value={description || "—"} />
            <SummaryRow label="Teaching time" value={`${durationHours} hours`} />
            <SummaryRow label="Examination" value={examination || "—"} />
            <SummaryRow label="Upcoming classes" value={upcomingClasses} />
            <div>
              <div className="text-sm font-medium">Cover image</div>
              <div className="mt-2 rounded-md border">
                <img
                  src={coverImage || "/placeholder.svg"}
                  alt="Cover preview"
                  className="h-32 w-full object-cover"
                  loading="lazy"
                />
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Modules</div>
              <div className="mt-2 grid gap-2">
                {modules.map((m) => (
                  <div key={m.id} className="flex items-center justify-between rounded border p-2 text-sm">
                    <div className="truncate">{m.title}</div>
                    <Badge variant="outline">{m.hours}h</Badge>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Resources</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {resources.length === 0 && <span className="text-xs text-muted-foreground">None</span>}
                {resources.map((r) => (
                  <a
                    key={r.id}
                    href={r.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 rounded-md border px-2 py-1 text-xs hover:bg-muted"
                  >
                    <ExternalLink className="h-3 w-3" />
                    <span className="truncate max-w-[220px]">{r.title}</span>
                  </a>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Locations</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {selectedLocationIds.map((id) => {
                  const loc = demoLocations.find((l) => l.id === id)
                  return (
                    <Badge key={id} variant="secondary">
                      <MapPin className="mr-1 h-3 w-3" />
                      {loc?.city ?? id}
                    </Badge>
                  )
                })}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Educator Assignments</div>
              <div className="mt-2 grid gap-2">
                {assignments.map((a) => {
                  const ed = demoEducators.find((e) => e.id === a.educatorId)
                  return (
                    <div key={a.educatorId} className="rounded border p-2 text-sm">
                      <div className="font-medium">{ed?.name ?? a.educatorId}</div>
                      <div className="mt-1 flex flex-wrap gap-2">
                        {a.locationIds.map((lid) => {
                          const loc = demoLocations.find((l) => l.id === lid)
                          return (
                            <Badge key={lid} variant="outline">
                              <MapPin className="mr-1 h-3 w-3" />
                              {loc?.city ?? lid}
                            </Badge>
                          )
                        })}
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </CardContent>
          <CardFooter className="justify-end">
            <Button className="min-w-[160px]" onClick={submit}>
              Save Course
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Navigation */}
      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          <ChevronLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button onClick={() => setStep((s) => Math.min(maxStep, s + 1))} disabled={!canNext}>
          {step === maxStep ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Review
            </>
          ) : (
            <>
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

function SummaryRow({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="grid grid-cols-3 items-start gap-2 text-sm">
      <div className="col-span-1 text-muted-foreground">{label}</div>
      <div className="col-span-2">{value}</div>
    </div>
  )
}

function cryptoId() {
  return Math.random().toString(36).slice(2, 10)
}
