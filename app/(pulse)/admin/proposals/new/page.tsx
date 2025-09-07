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
import { Calendar, Clock, MapPin, PoundSterling, User, Users, FileText, Info, Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Session = {
  id: string
  date: string
  start: string
  end: string
  location: string
}

const COURSES = [
  { id: "CRS-001", title: "First Aid Level 1", duration: "1 day" },
  { id: "CRS-002", title: "CPR Essentials", duration: "1 day" },
  { id: "CRS-003", title: "Safeguarding Basics", duration: "2 days" },
  { id: "CRS-004", title: "Manual Handling", duration: "1 day" },
]
const EDUCATORS = [
  { id: "E-001", name: "Alex Taylor" },
  { id: "E-002", name: "R. Patel" },
  { id: "E-003", name: "M. Evans" },
  { id: "E-004", name: "C. Garcia" },
]
const DIRECTORY = Array.from({ length: 60 }).map((_, i) => ({
  id: `S${1000 + i}`,
  name: ["Jane Doe", "John Smith", "Amina Khan", "Liu Zhang", "Carlos Garcia", "Maya Patel", "Noah Evans"][i % 7],
  email: `student${i}@example.com`,
  location: ["London", "Manchester", "Bristol", "Leeds"][i % 4],
}))

export default function NewProposalWizardPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [step, setStep] = React.useState(1)

  // 1) Details
  const [course, setCourse] = React.useState<string>("")
  const [title, setTitle] = React.useState("")
  const [capacity, setCapacity] = React.useState("12")
  const [baseLocation, setBaseLocation] = React.useState("")

  // 2) Sessions
  const [sessions, setSessions] = React.useState<Session[]>([
    { id: "1", date: "", start: "09:00", end: "16:00", location: "" },
  ])

  // 3) Financials
  const [educator, setEducator] = React.useState<string>("")
  const [rateType, setRateType] = React.useState<"flat" | "hourly">("flat")
  const [rate, setRate] = React.useState("600")
  const [expenses, setExpenses] = React.useState("0")
  const [paymentTerms, setPaymentTerms] = React.useState("Net 7 days")
  const [internalNotes, setInternalNotes] = React.useState("")

  // 4) Potential students
  const [q, setQ] = React.useState("")
  const [selected, setSelected] = React.useState<Set<string>>(new Set())

  // 5) Terms
  const [agree, setAgree] = React.useState(false)

  const courseObj = COURSES.find((c) => c.id === course)
  const educatorObj = EDUCATORS.find((e) => e.id === educator)
  const capacityNum = Math.max(0, Number.parseInt(capacity || "0"))

  const filteredDir = React.useMemo(() => {
    const s = q.trim().toLowerCase()
    return DIRECTORY.filter((d) => !s || `${d.name} ${d.email} ${d.location} ${d.id}`.toLowerCase().includes(s))
  }, [q])

  const firstSessionDate = sessions.find((s) => s.date)?.date

  // Validation helpers
  const validStep1 = course && capacityNum > 0
  const validStep2 =
    sessions.length > 0 && sessions.every((s) => s.date && s.start && s.end) && sessions.every((s) => s.start < s.end)
  const validStep3 = educator && Number.isFinite(Number.parseFloat(rate))
  const validStep4 = true // optional selection; we still allow submit if none selected
  const validStep5 = agree

  function addSession() {
    setSessions((prev) => [
      ...prev,
      { id: `${Date.now()}`, date: "", start: "09:00", end: "16:00", location: baseLocation },
    ])
  }
  function updateSession(id: string, patch: Partial<Session>) {
    setSessions((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)))
  }
  function removeSession(id: string) {
    setSessions((prev) => (prev.length > 1 ? prev.filter((s) => s.id !== id) : prev))
  }

  function toggleStudent(id: string) {
    setSelected((prev) => {
      const ns = new Set(prev)
      if (ns.has(id)) ns.delete(id)
      else ns.add(id)
      return ns
    })
  }

  function saveDraft() {
    toast({ title: "Draft saved", description: "You can return to this proposal later." })
  }

  function submit() {
    if (!(validStep1 && validStep2 && validStep3 && validStep4 && validStep5)) return
    // In production: persist proposal, create offer record, notify educator
    toast({
      title: "Proposal submitted",
      description: `${courseObj?.title} • ${educatorObj?.name} • ${sessions.length} session(s)`,
    })
    router.push("/admin/proposals")
  }

  const overCapacity = selected.size > capacityNum && capacityNum > 0

  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">Create Class Proposal</h1>
        <div className="ml-auto flex items-center gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <Badge key={i} variant={step === i ? "default" : "outline"} className="w-8 justify-center">
              {i}
            </Badge>
          ))}
        </div>
      </div>

      {/* Step 1: Details */}
      {step === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Course & Details</CardTitle>
            <CardDescription>Pick a course, set title, capacity and base location.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Course</Label>
              <Select value={course} onValueChange={setCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select course" />
                </SelectTrigger>
                <SelectContent>
                  {COURSES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title} ({c.duration})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">Class title (optional)</Label>
              <Input
                id="title"
                placeholder={courseObj ? `${courseObj.title} • ${courseObj.duration}` : "e.g., First Aid L1 • Morning"}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="capacity">Max students (capacity)</Label>
              <div className="relative">
                <Users className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="capacity"
                  inputMode="numeric"
                  value={capacity}
                  onChange={(e) => setCapacity(e.target.value.replace(/[^\d]/g, ""))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="baseLocation">Base location</Label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="baseLocation"
                  placeholder="Site name or address"
                  value={baseLocation}
                  onChange={(e) => setBaseLocation(e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 2: Sessions */}
      {step === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Sessions & Timetable</CardTitle>
            <CardDescription>Add one or more sessions with date, time, and location.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="overflow-hidden rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[100px]">Session</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Start</TableHead>
                    <TableHead>End</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sessions.map((s, idx) => (
                    <TableRow key={s.id}>
                      <TableCell className="font-medium">#{idx + 1}</TableCell>
                      <TableCell>
                        <div className="relative">
                          <Calendar className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="date"
                            value={s.date}
                            onChange={(e) => updateSession(s.id, { date: e.target.value })}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <Clock className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="time"
                            value={s.start}
                            onChange={(e) => updateSession(s.id, { start: e.target.value })}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <Clock className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            type="time"
                            value={s.end}
                            onChange={(e) => updateSession(s.id, { end: e.target.value })}
                          />
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="relative">
                          <MapPin className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            placeholder={baseLocation || "Room / Address"}
                            value={s.location}
                            onChange={(e) => updateSession(s.id, { location: e.target.value })}
                          />
                        </div>
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeSession(s.id)}
                          disabled={sessions.length === 1}
                        >
                          Remove
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="flex justify-between p-2">
                        <span className="text-sm text-muted-foreground">{sessions.length} session(s)</span>
                        <Button variant="outline" size="sm" onClick={addSession}>
                          Add session
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </div>
            {!validStep2 && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Ensure each session has date, start and end time (end after start).
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 3: Financial Compensation */}
      {step === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Educator Compensation</CardTitle>
            <CardDescription>Assign educator, rate, and payment terms.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Educator</Label>
              <Select value={educator} onValueChange={setEducator}>
                <SelectTrigger>
                  <SelectValue placeholder="Select educator" />
                </SelectTrigger>
                <SelectContent>
                  {EDUCATORS.map((e) => (
                    <SelectItem key={e.id} value={e.id}>
                      {e.name} ({e.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">Availability checks will be added here.</p>
            </div>

            <div className="space-y-2">
              <Label>Rate type</Label>
              <Select value={rateType} onValueChange={(v) => setRateType(v as "flat" | "hourly")}>
                <SelectTrigger>
                  <SelectValue placeholder="Rate type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flat">Flat per class</SelectItem>
                  <SelectItem value="hourly">Hourly</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rate">Rate (£)</Label>
              <div className="relative">
                <PoundSterling className="pointer-events-none absolute right-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  id="rate"
                  inputMode="decimal"
                  value={rate}
                  onChange={(e) => setRate(e.target.value.replace(/[^\d.]/g, ""))}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="expenses">Expenses budget (£)</Label>
              <Input
                id="expenses"
                inputMode="decimal"
                value={expenses}
                onChange={(e) => setExpenses(e.target.value.replace(/[^\d.]/g, ""))}
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="terms">Payment terms</Label>
              <Input id="terms" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)} />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="notes">Internal notes (optional)</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions or internal context..."
                value={internalNotes}
                onChange={(e) => setInternalNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Potential Students */}
      {step === 4 && (
        <Card>
          <CardHeader>
            <CardTitle>Potential Students</CardTitle>
            <CardDescription>Search and select students to pre-target with invites after acceptance.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, location, ID…"
                className="pl-8"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </div>
            <div className="overflow-hidden rounded border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[44px]"></TableHead>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Location</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDir.map((s) => (
                    <TableRow key={s.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          aria-label={`Select ${s.name}`}
                          checked={selected.has(s.id)}
                          onChange={() => toggleStudent(s.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-muted-foreground">{s.email}</TableCell>
                      <TableCell className="text-muted-foreground">{s.location}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            <div className="flex flex-wrap items-center justify-between">
              <div className="text-sm">
                Selected: <span className="font-medium">{selected.size}</span>{" "}
                {capacityNum > 0 && (
                  <>
                    / Capacity {capacityNum} {overCapacity && <Badge variant="outline">Over capacity</Badge>}
                  </>
                )}
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelected(new Set())}
                  disabled={selected.size === 0}
                >
                  Clear selection
                </Button>
              </div>
            </div>
            {overCapacity && (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  You selected more students than capacity. You can still submit, but invites will be limited or
                  waitlisted.
                </AlertDescription>
              </Alert>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 5: Review & Submit */}
      {step === 5 && (
        <Card>
          <CardHeader>
            <CardTitle>Preview & Submit</CardTitle>
            <CardDescription>Review everything before sending to the educator.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded border">
              <div className="grid gap-3 p-3 text-sm sm:grid-cols-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{title || courseObj?.title || "Untitled Class"}</div>
                    <div className="text-muted-foreground">
                      {course || "—"} • Capacity {capacityNum || "—"}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{educatorObj?.name || "—"}</div>
                    <div className="text-muted-foreground">{educator || "—"}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">{baseLocation || "—"}</div>
                    <div className="text-muted-foreground">{sessions.length} session(s)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <PoundSterling className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <div className="font-medium">
                      {rateType === "flat"
                        ? `Flat £${Number(rate || 0).toFixed(2)}`
                        : `£${Number(rate || 0).toFixed(2)}/hr`}
                    </div>
                    <div className="text-muted-foreground">
                      Expenses £{Number(expenses || 0).toFixed(2)} • {paymentTerms}
                    </div>
                  </div>
                </div>
              </div>
              <Separator />
              <div className="p-3">
                <div className="font-medium mb-2">Sessions</div>
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>#</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Start</TableHead>
                        <TableHead>End</TableHead>
                        <TableHead>Location</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {sessions.map((s, i) => (
                        <TableRow key={s.id}>
                          <TableCell className="font-medium">{i + 1}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{s.date || "—"}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{s.start || "—"}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">{s.end || "—"}</TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {s.location || baseLocation || "—"}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </div>
              {internalNotes && (
                <>
                  <Separator />
                  <div className="p-3">
                    <div className="font-medium mb-1">Internal notes</div>
                    <div className="text-sm text-muted-foreground whitespace-pre-wrap">{internalNotes}</div>
                  </div>
                </>
              )}
            </div>

            <div className="rounded border p-3">
              <div className="flex items-center gap-2">
                <input id="agree" type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} />
                <Label htmlFor="agree" className="text-sm">
                  I confirm the details are correct and agree to send this proposal to the educator.
                </Label>
              </div>
            </div>

            {!validStep1 || !validStep2 || !validStep3 ? (
              <Alert>
                <Info className="h-4 w-4" />
                <AlertDescription className="text-sm">
                  Complete steps 1–3 before submitting. Ensure course, sessions, and educator compensation are set.
                </AlertDescription>
              </Alert>
            ) : null}

            <div className="flex flex-wrap justify-between gap-2">
              <Button variant="outline" onClick={saveDraft}>
                Save draft
              </Button>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setStep(1)}>
                  Edit
                </Button>
                <Button onClick={submit} disabled={!(validStep1 && validStep2 && validStep3 && validStep5)}>
                  Submit Proposal
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1))} disabled={step === 1}>
          Back
        </Button>
        <Button
          onClick={() => setStep((s) => Math.min(5, s + 1))}
          disabled={
            (step === 1 && !validStep1) ||
            (step === 2 && !validStep2) ||
            (step === 3 && !validStep3) ||
            (step === 4 && !validStep4)
          }
        >
          {step === 5 ? "Finish" : "Next"}
        </Button>
      </div>
    </div>
  )
}
