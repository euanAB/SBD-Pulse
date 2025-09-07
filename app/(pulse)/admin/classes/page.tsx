"use client"

import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Plus, Search, Calendar, Users, PoundSterling, User, MapPin, Eye, MoreHorizontal } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Link from "next/link"

type ClassStatus = "proposed" | "pending" | "accepted" | "enrolling" | "teaching" | "completed" | "cancelled"

type ClassRecord = {
  id: string
  title: string
  courseId: string
  courseName: string
  educator: string
  educatorId: string
  status: ClassStatus
  startDate: string
  endDate: string
  sessions: number
  capacity: number
  enrolled: number
  location: string
  fee: number
  proposedDate: string
  lastUpdated: string
}

const statusConfig: Record<
  ClassStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  proposed: { label: "Proposed", variant: "outline" },
  pending: { label: "Pending Educator", variant: "secondary" },
  accepted: { label: "Accepted & Signed", variant: "default" },
  enrolling: { label: "Enrolling Students", variant: "default" },
  teaching: { label: "Teaching", variant: "default" },
  completed: { label: "Completed", variant: "secondary" },
  cancelled: { label: "Cancelled", variant: "destructive" },
}

const mockClasses: ClassRecord[] = [
  {
    id: "CLS-2025-001",
    title: "First Aid Level 1 - Morning Session",
    courseId: "CRS-001",
    courseName: "First Aid Level 1",
    educator: "Alex Taylor",
    educatorId: "E-001",
    status: "teaching",
    startDate: "2025-01-15",
    endDate: "2025-01-15",
    sessions: 1,
    capacity: 12,
    enrolled: 10,
    location: "Training Room A",
    fee: 850,
    proposedDate: "2024-12-20",
    lastUpdated: "2025-01-10",
  },
  {
    id: "CLS-2025-002",
    title: "CPR Essentials",
    courseId: "CRS-002",
    courseName: "CPR Essentials",
    educator: "R. Patel",
    educatorId: "E-002",
    status: "enrolling",
    startDate: "2025-01-22",
    endDate: "2025-01-22",
    sessions: 1,
    capacity: 15,
    enrolled: 8,
    location: "Training Room B",
    fee: 600,
    proposedDate: "2024-12-18",
    lastUpdated: "2025-01-08",
  },
  {
    id: "CLS-2025-003",
    title: "Safeguarding Basics - Weekend Course",
    courseId: "CRS-003",
    courseName: "Safeguarding Basics",
    educator: "M. Evans",
    educatorId: "E-003",
    status: "accepted",
    startDate: "2025-01-25",
    endDate: "2025-01-26",
    sessions: 2,
    capacity: 20,
    enrolled: 0,
    location: "Conference Room",
    fee: 780,
    proposedDate: "2024-12-15",
    lastUpdated: "2025-01-05",
  },
  {
    id: "CLS-2025-004",
    title: "Manual Handling Training",
    courseId: "CRS-004",
    courseName: "Manual Handling",
    educator: "J. Smith",
    educatorId: "E-004",
    status: "pending",
    startDate: "2025-02-01",
    endDate: "2025-02-01",
    sessions: 1,
    capacity: 16,
    enrolled: 0,
    location: "Workshop Area",
    fee: 450,
    proposedDate: "2025-01-02",
    lastUpdated: "2025-01-02",
  },
  {
    id: "CLS-2025-005",
    title: "Advanced First Aid",
    courseId: "CRS-005",
    courseName: "First Aid Level 2",
    educator: "C. Garcia",
    educatorId: "E-005",
    status: "completed",
    startDate: "2024-12-10",
    endDate: "2024-12-11",
    sessions: 2,
    capacity: 12,
    enrolled: 12,
    location: "Training Room A",
    fee: 1200,
    proposedDate: "2024-11-15",
    lastUpdated: "2024-12-11",
  },
]

export default function ClassesPage() {
  const [classes, setClasses] = React.useState(mockClasses)
  const [searchQuery, setSearchQuery] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [educatorFilter, setEducatorFilter] = React.useState<string>("all")
  const [sortBy, setSortBy] = React.useState<string>("lastUpdated")
  const [sortOrder, setSortOrder] = React.useState<"asc" | "desc">("desc")

  // Get unique educators for filter
  const educators = React.useMemo(() => {
    const unique = Array.from(new Set(classes.map((c) => c.educator)))
    return unique.sort()
  }, [classes])

  // Filter and sort classes
  const filteredClasses = React.useMemo(() => {
    const filtered = classes.filter((cls) => {
      const matchesSearch =
        searchQuery === "" ||
        cls.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.educator.toLowerCase().includes(searchQuery.toLowerCase()) ||
        cls.location.toLowerCase().includes(searchQuery.toLowerCase())

      const matchesStatus = statusFilter === "all" || cls.status === statusFilter
      const matchesEducator = educatorFilter === "all" || cls.educator === educatorFilter

      return matchesSearch && matchesStatus && matchesEducator
    })

    // Sort
    filtered.sort((a, b) => {
      let aVal: any = a[sortBy as keyof ClassRecord]
      let bVal: any = b[sortBy as keyof ClassRecord]

      if (sortBy === "fee" || sortBy === "capacity" || sortBy === "enrolled" || sortBy === "sessions") {
        aVal = Number(aVal)
        bVal = Number(bVal)
      } else if (sortBy === "startDate" || sortBy === "lastUpdated" || sortBy === "proposedDate") {
        aVal = new Date(aVal)
        bVal = new Date(bVal)
      } else {
        aVal = String(aVal).toLowerCase()
        bVal = String(bVal).toLowerCase()
      }

      if (aVal < bVal) return sortOrder === "asc" ? -1 : 1
      if (aVal > bVal) return sortOrder === "asc" ? 1 : -1
      return 0
    })

    return filtered
  }, [classes, searchQuery, statusFilter, educatorFilter, sortBy, sortOrder])

  // Status counts for overview
  const statusCounts = React.useMemo(() => {
    const counts: Record<ClassStatus, number> = {
      proposed: 0,
      pending: 0,
      accepted: 0,
      enrolling: 0,
      teaching: 0,
      completed: 0,
      cancelled: 0,
    }
    classes.forEach((cls) => {
      counts[cls.status]++
    })
    return counts
  }, [classes])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: "GBP",
      minimumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Classes</h1>
          <p className="text-muted-foreground">Manage your class lifecycle from proposal to completion</p>
        </div>
        <Button asChild size="sm" className="md:w-auto">
          <Link href="/admin/classes/propose">
            <Plus className="mr-2 h-4 w-4" />
            Propose New Class
          </Link>
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Classes</p>
                <p className="text-2xl font-bold">{statusCounts.teaching + statusCounts.enrolling}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Users className="h-4 w-4 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Approval</p>
                <p className="text-2xl font-bold">{statusCounts.pending}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center">
                <Calendar className="h-4 w-4 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Revenue</p>
                <p className="text-2xl font-bold">
                  {formatCurrency(
                    classes
                      .filter((c) => c.status === "completed")
                      .reduce((sum, c) => sum + (c.fee * c.enrolled) / c.capacity, 0),
                  )}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                <PoundSterling className="h-4 w-4 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Completed</p>
                <p className="text-2xl font-bold">{statusCounts.completed}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                <Badge className="h-4 w-4 text-gray-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Search classes, courses, educators..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {Object.entries(statusConfig).map(([status, config]) => (
                    <SelectItem key={status} value={status}>
                      {config.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={educatorFilter} onValueChange={setEducatorFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by educator" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Educators</SelectItem>
                  {educators.map((educator) => (
                    <SelectItem key={educator} value={educator}>
                      {educator}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center gap-2">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="lastUpdated">Last Updated</SelectItem>
                  <SelectItem value="startDate">Start Date</SelectItem>
                  <SelectItem value="proposedDate">Proposed Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                  <SelectItem value="educator">Educator</SelectItem>
                  <SelectItem value="fee">Fee</SelectItem>
                  <SelectItem value="enrolled">Enrollment</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" size="sm" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
                {sortOrder === "asc" ? "↑" : "↓"}
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Class</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Educator</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Enrollment</TableHead>
                  <TableHead>Location</TableHead>
                  <TableHead>Fee</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="w-[50px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredClasses.map((cls) => (
                  <TableRow key={cls.id} className="group">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{cls.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {cls.id} • {cls.courseName}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[cls.status].variant}>{statusConfig[cls.status].label}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{cls.educator}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center gap-1 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          {formatDate(cls.startDate)}
                          {cls.startDate !== cls.endDate && ` - ${formatDate(cls.endDate)}`}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {cls.sessions} session{cls.sessions !== 1 ? "s" : ""}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{cls.enrolled}</span>
                        <span className="text-muted-foreground">/ {cls.capacity}</span>
                        <div className="w-16 bg-gray-200 rounded-full h-1.5">
                          <div
                            className="bg-blue-600 h-1.5 rounded-full"
                            style={{ width: `${Math.min(100, (cls.enrolled / cls.capacity) * 100)}%` }}
                          />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1 text-sm">
                        <MapPin className="h-3 w-3 text-muted-foreground" />
                        {cls.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{formatCurrency(cls.fee)}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">{formatDate(cls.lastUpdated)}</div>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/classes/${cls.id}`}>
                              <Eye className="mr-2 h-4 w-4" />
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          {cls.status === "enrolling" && (
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/classes/${cls.id}/enroll`}>
                                <Users className="mr-2 h-4 w-4" />
                                Manage Students
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {cls.status === "proposed" && (
                            <DropdownMenuItem asChild>
                              <Link href={`/admin/classes/${cls.id}/edit`}>Edit Proposal</Link>
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {filteredClasses.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-muted-foreground">No classes found matching your criteria.</div>
              <Button asChild variant="outline" className="mt-4 bg-transparent">
                <Link href="/admin/classes/propose">
                  <Plus className="mr-2 h-4 w-4" />
                  Propose Your First Class
                </Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
