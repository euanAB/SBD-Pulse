"use client"

import * as React from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Filter, Plus, Search, X } from "lucide-react"
import Link from "next/link"

type Student = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  status: "enrolled" | "invited" | "inactive"
  payment: "paid" | "partial" | "pending"
  verified: boolean
  location: string
  dob: string
  enrolledAt: string
  activeClass: boolean // currently on an active course
}

const mock: Student[] = Array.from({ length: 48 }).map((_, i) => ({
  id: `S${1000 + i}`,
  firstName: ["Jane", "John", "Amina", "Liu", "Carlos", "Maya", "Noah"][i % 7],
  lastName: ["Doe", "Smith", "Khan", "Zhang", "Garcia", "Patel", "Evans"][i % 7],
  email: `student${i}@example.com`,
  phone: "+44 7700 900123",
  status: (["enrolled", "invited", "inactive"] as const)[i % 3],
  payment: (["paid", "partial", "pending"] as const)[(i + 1) % 3],
  verified: i % 2 === 0,
  location: ["London", "Manchester", "Bristol", "Leeds"][i % 4],
  dob: "1998-05-10",
  enrolledAt: `2025-0${(i % 6) + 1}-15`,
  activeClass: i % 4 === 0, // 25% are currently on a class
}))

type TopTab = "invited" | "partial" | "teaching" | "non-teaching"

export default function StudentsCRMPage() {
  const [query, setQuery] = React.useState("")
  const [status, setStatus] = React.useState<string>("all")
  const [payment, setPayment] = React.useState<string>("all")
  const [location, setLocation] = React.useState<string>("all")
  const [verified, setVerified] = React.useState<string>("all")
  const [from, setFrom] = React.useState<Date | undefined>()
  const [to, setTo] = React.useState<Date | undefined>()
  const [page, setPage] = React.useState(1)
  const [tab, setTab] = React.useState<TopTab>("invited")
  const pageSize = 10

  const counts = React.useMemo(() => {
    const invited = mock.filter((s) => s.status === "invited").length
    const partial = mock.filter((s) => s.payment === "partial").length
    const teaching = mock.filter((s) => s.activeClass).length
    const nonTeaching = mock.filter((s) => !s.activeClass).length
    return { invited, partial, teaching, nonTeaching }
  }, [])

  const filtered = React.useMemo(() => {
    const q = query.toLowerCase().trim()
    return mock
      .filter((s) => {
        // Top tabs
        const matchTab =
          (tab === "invited" && s.status === "invited") ||
          (tab === "partial" && s.payment === "partial") ||
          (tab === "teaching" && s.activeClass) ||
          (tab === "non-teaching" && !s.activeClass)

        const matchesQ =
          !q ||
          s.firstName.toLowerCase().includes(q) ||
          s.lastName.toLowerCase().includes(q) ||
          s.email.toLowerCase().includes(q) ||
          s.id.toLowerCase().includes(q)
        const matchesStatus = status === "all" || s.status === status
        const matchesPayment = payment === "all" || s.payment === payment
        const matchesLoc = location === "all" || s.location === location
        const matchesVer = verified === "all" || (verified === "yes" ? s.verified : !s.verified)
        const d = new Date(s.enrolledAt)
        const matchesFrom = !from || d >= from
        const matchesTo = !to || d <= to
        return (
          matchTab &&
          matchesQ &&
          matchesStatus &&
          matchesPayment &&
          matchesLoc &&
          matchesVer &&
          matchesFrom &&
          matchesTo
        )
      })
      .sort((a, b) => a.lastName.localeCompare(b.lastName))
  }, [query, status, payment, location, verified, from, to, tab])

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize))
  const data = filtered.slice((page - 1) * pageSize, page * pageSize)

  React.useEffect(() => {
    setPage(1)
  }, [query, status, payment, location, verified, from, to, tab])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <h1 className="text-xl font-semibold">Student Directory</h1>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button asChild size="sm">
            <Link href="/admin/students/new">
              <Plus className="mr-2 h-4 w-4" />
              Invite Student
            </Link>
          </Button>
          <Button variant="outline" size="sm">
            Export CSV
          </Button>
        </div>
      </div>

      {/* Top Status Tabs */}
      <Tabs value={tab} onValueChange={(v) => setTab(v as TopTab)}>
        <TabsList className="flex flex-wrap">
          <TabsTrigger value="invited" className="gap-2">
            Invited
            <Badge variant="secondary">{counts.invited}</Badge>
          </TabsTrigger>
          <TabsTrigger value="partial" className="gap-2">
            Partially enrolled
            <Badge variant="secondary">{counts.partial}</Badge>
          </TabsTrigger>
          <TabsTrigger value="teaching" className="gap-2">
            Teaching (active)
            <Badge variant="secondary">{counts.teaching}</Badge>
          </TabsTrigger>
          <TabsTrigger value="non-teaching" className="gap-2">
            Non teaching
            <Badge variant="secondary">{counts.nonTeaching}</Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="invited" />
        <TabsContent value="partial" />
        <TabsContent value="teaching" />
        <TabsContent value="non-teaching" />
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Advanced Search & Filtering</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative md:w-1/2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search name, email, ID..."
                className="pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </div>
            <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-4">
              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Enrollment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="enrolled">Enrolled</SelectItem>
                  <SelectItem value="invited">Invited</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
              <Select value={payment} onValueChange={setPayment}>
                <SelectTrigger>
                  <SelectValue placeholder="Payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All payments</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="partial">Partial</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
              <Select value={location} onValueChange={setLocation}>
                <SelectTrigger>
                  <SelectValue placeholder="Location" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All locations</SelectItem>
                  <SelectItem value="London">London</SelectItem>
                  <SelectItem value="Manchester">Manchester</SelectItem>
                  <SelectItem value="Bristol">Bristol</SelectItem>
                  <SelectItem value="Leeds">Leeds</SelectItem>
                </SelectContent>
              </Select>
              <Select value={verified} onValueChange={setVerified}>
                <SelectTrigger>
                  <SelectValue placeholder="Verification" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="yes">Verified</SelectItem>
                  <SelectItem value="no">Unverified</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="grid grid-cols-2 gap-2">
              <DateFilter label="From" date={from} onChange={setFrom} />
              <DateFilter label="To" date={to} onChange={setTo} />
            </div>
            {(from ||
              to ||
              query ||
              status !== "all" ||
              payment !== "all" ||
              location !== "all" ||
              verified !== "all") && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFrom(undefined)
                  setTo(undefined)
                  setQuery("")
                  setStatus("all")
                  setPayment("all")
                  setLocation("all")
                  setVerified("all")
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Clear filters
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="min-w-[140px]">Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Payment</TableHead>
              <TableHead>Verified</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((s) => (
              <TableRow key={s.id}>
                <TableCell className="font-medium">
                  {s.firstName} {s.lastName}
                </TableCell>
                <TableCell className="text-muted-foreground">{s.email}</TableCell>
                <TableCell className="text-muted-foreground">{s.phone}</TableCell>
                <TableCell>
                  <Badge
                    variant={s.status === "enrolled" ? "default" : s.status === "invited" ? "secondary" : "outline"}
                  >
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={s.payment === "paid" ? "default" : s.payment === "partial" ? "secondary" : "outline"}>
                    {s.payment}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={s.verified ? "default" : "outline"}>{s.verified ? "Yes" : "No"}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={s.activeClass ? "default" : "outline"}>{s.activeClass ? "Teaching" : "No"}</Badge>
                </TableCell>
                <TableCell className="text-muted-foreground">{s.location}</TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/students/${s.id}`}>Profile</Link>
                    </Button>
                    <Button size="sm" variant="secondary">
                      Invoice
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {data.length === 0 && (
              <TableRow>
                <TableCell colSpan={9} className="text-center py-10 text-muted-foreground">
                  No students match your filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between border-t p-3 text-sm">
          <div>
            Showing {(page - 1) * pageSize + 1}-{Math.min(page * pageSize, filtered.length)} of {filtered.length}
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </Button>
            <div className="font-medium">
              {page} / {totalPages}
            </div>
            <Button
              variant="outline"
              size="sm"
              disabled={page === totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

function DateFilter({ label, date, onChange }: { label: string; date?: Date; onChange: (d?: Date) => void }) {
  const [open, setOpen] = React.useState(false)
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn("justify-start text-left font-normal", !date && "text-muted-foreground")}
        >
          <Filter className="mr-2 h-4 w-4" />
          {date ? format(date, "LLL dd, y") : label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={(d) => {
            onChange(d)
            setOpen(false)
          }}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  )
}
