"use client"

import * as React from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus } from "lucide-react"

type Proposal = {
  id: string
  courseId: string
  courseTitle: string
  educatorId: string
  educatorName: string
  firstSession: string // ISO date
  capacity: number
  status: "Pending" | "Accepted & Signed" | "Declined" | "Expired"
  classId?: string // only when accepted and created
}

const DATA: Proposal[] = [
  {
    id: "P-2001",
    courseId: "CRS-002",
    courseTitle: "CPR Essentials",
    educatorId: "E-002",
    educatorName: "R. Patel",
    firstSession: "2025-08-22T09:00:00Z",
    capacity: 12,
    status: "Pending",
  },
  {
    id: "P-2002",
    courseId: "CRS-004",
    courseTitle: "Manual Handling",
    educatorId: "E-003",
    educatorName: "M. Evans",
    firstSession: "2025-08-28T09:00:00Z",
    capacity: 14,
    status: "Accepted & Signed",
    classId: "C-082",
  },
  {
    id: "P-2003",
    courseId: "CRS-003",
    courseTitle: "Safeguarding Basics",
    educatorId: "E-001",
    educatorName: "Alex Taylor",
    firstSession: "2025-08-25T09:00:00Z",
    capacity: 16,
    status: "Declined",
  },
]

const STATUS_COLORS: Record<Proposal["status"], "default" | "secondary" | "outline"> = {
  "Accepted & Signed": "default",
  Pending: "secondary",
  Declined: "outline",
  Expired: "outline",
}

export default function ProposalsPage() {
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<Proposal["status"] | "all">("all")
  const [educator, setEducator] = React.useState<string>("all")

  const educators = React.useMemo(() => {
    const set = new Map<string, string>()
    DATA.forEach((p) => set.set(p.educatorId, p.educatorName))
    return Array.from(set.entries()).map(([id, name]) => ({ id, name }))
  }, [])

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase().trim()
    return DATA.filter((p) => {
      const matchesQ =
        !q ||
        p.id.toLowerCase().includes(q) ||
        p.courseTitle.toLowerCase().includes(q) ||
        p.educatorName.toLowerCase().includes(q) ||
        p.courseId.toLowerCase().includes(q)
      const matchesStatus = status === "all" || p.status === status
      const matchesEducator = educator === "all" || p.educatorId === educator
      return matchesQ && matchesStatus && matchesEducator
    })
  }, [query, status, educator])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <h1 className="text-xl font-semibold">Proposals</h1>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/admin/proposals/new">
              <Plus className="mr-2 h-4 w-4" />
              New Proposal
            </Link>
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Search & Filters</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 md:grid-cols-3">
          <div className="relative md:col-span-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search proposal ID, course, educator..."
              className="pl-8"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          <Select value={status} onValueChange={(v) => setStatus(v as any)}>
            <SelectTrigger>
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Accepted & Signed">Accepted & Signed</SelectItem>
              <SelectItem value="Declined">Declined</SelectItem>
              <SelectItem value="Expired">Expired</SelectItem>
            </SelectContent>
          </Select>
          <Select value={educator} onValueChange={setEducator}>
            <SelectTrigger>
              <SelectValue placeholder="Educator" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All educators</SelectItem>
              {educators.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[120px]">Proposal</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Educator</TableHead>
              <TableHead>First session</TableHead>
              <TableHead>Capacity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map((p) => (
              <TableRow key={p.id}>
                <TableCell className="font-medium">{p.id}</TableCell>
                <TableCell>
                  <div className="text-sm">{p.courseTitle}</div>
                  <div className="text-xs text-muted-foreground">{p.courseId}</div>
                </TableCell>
                <TableCell>
                  <div className="text-sm">{p.educatorName}</div>
                  <div className="text-xs text-muted-foreground">{p.educatorId}</div>
                </TableCell>
                <TableCell className="text-sm text-muted-foreground">
                  {new Date(p.firstSession).toLocaleString()}
                </TableCell>
                <TableCell className="text-sm">{p.capacity}</TableCell>
                <TableCell>
                  <Badge variant={STATUS_COLORS[p.status]}>{p.status}</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button asChild size="sm" variant="outline">
                      <Link href={`/educator/offers/${p.id}`}>View Offer</Link>
                    </Button>
                    {p.status === "Accepted & Signed" && p.classId ? (
                      <Button asChild size="sm" variant="secondary">
                        <Link href={`/admin/classes/${p.classId}/enroll`}>Enroll Students</Link>
                      </Button>
                    ) : (
                      <Button asChild size="sm" variant="outline">
                        <Link href={`/admin/proposals/new`}>Duplicate</Link>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={7} className="py-10 text-center text-muted-foreground">
                  No proposals found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
