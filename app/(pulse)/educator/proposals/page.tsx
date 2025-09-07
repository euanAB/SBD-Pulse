"use client"

import * as React from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Calendar, Clock, PoundSterling, MapPin, Eye, AlertTriangle } from "lucide-react"
import Link from "next/link"

type ProposalStatus = "pending" | "accepted" | "declined" | "expired"

type Proposal = {
  id: string
  classTitle: string
  courseId: string
  courseName: string
  proposedBy: string
  proposedDate: string
  expiryDate: string
  status: ProposalStatus
  sessions: {
    title: string
    date: string
    start: string
    end: string
    location: string
  }[]
  capacity: number
  rate: number
  rateType: "flat" | "hourly"
  paymentTerms: string
  location: string
  notes: string
}

const mockProposals: Proposal[] = [
  {
    id: "PROP-2025-001",
    classTitle: "First Aid Level 1 - Corporate Training",
    courseId: "CRS-001",
    courseName: "First Aid Level 1",
    proposedBy: "Admin",
    proposedDate: "2025-01-10",
    expiryDate: "2025-01-17",
    status: "pending",
    sessions: [
      {
        title: "Basic First Aid Principles",
        date: "2025-01-25",
        start: "09:00",
        end: "16:00",
        location: "Training Room A",
      },
    ],
    capacity: 15,
    rate: 650,
    rateType: "flat",
    paymentTerms: "Net 7 days",
    location: "Training Room A",
    notes: "Corporate client requires certification for all employees. Please bring extra certificates.",
  },
  {
    id: "PROP-2025-002",
    classTitle: "CPR Essentials Weekend Course",
    courseId: "CRS-002",
    courseName: "CPR Essentials",
    proposedBy: "Admin",
    proposedDate: "2025-01-08",
    expiryDate: "2025-01-15",
    status: "pending",
    sessions: [
      {
        title: "Adult CPR Techniques",
        date: "2025-02-01",
        start: "10:00",
        end: "13:00",
        location: "Training Room B",
      },
      {
        title: "Child CPR & AED Usage",
        date: "2025-02-01",
        start: "14:00",
        end: "17:00",
        location: "Training Room B",
      },
    ],
    capacity: 12,
    rate: 75,
    rateType: "hourly",
    paymentTerms: "Upon completion",
    location: "Training Room B",
    notes: "Weekend course for working professionals. Equipment will be provided.",
  },
  {
    id: "PROP-2025-003",
    classTitle: "Manual Handling Training",
    courseId: "CRS-004",
    courseName: "Manual Handling",
    proposedBy: "Admin",
    proposedDate: "2025-01-05",
    expiryDate: "2025-01-12",
    status: "expired",
    sessions: [
      {
        title: "Safe Lifting Techniques",
        date: "2025-01-20",
        start: "09:00",
        end: "16:00",
        location: "Workshop Area",
      },
    ],
    capacity: 20,
    rate: 520,
    rateType: "flat",
    paymentTerms: "Net 14 days",
    location: "Workshop Area",
    notes: "Warehouse staff training. Practical demonstrations required.",
  },
]

const statusConfig: Record<
  ProposalStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  pending: { label: "Pending Review", variant: "outline" },
  accepted: { label: "Accepted", variant: "default" },
  declined: { label: "Declined", variant: "destructive" },
  expired: { label: "Expired", variant: "secondary" },
}

export default function EducatorProposalsPage() {
  const [proposals, setProposals] = React.useState(mockProposals)
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState("")

  // Filter proposals
  const filteredProposals = React.useMemo(() => {
    return proposals.filter((proposal) => {
      const matchesStatus = statusFilter === "all" || proposal.status === statusFilter
      const matchesSearch =
        searchQuery === "" ||
        proposal.classTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.courseName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        proposal.id.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesStatus && matchesSearch
    })
  }, [proposals, statusFilter, searchQuery])

  // Check for expiring proposals
  const expiringProposals = proposals.filter((p) => {
    if (p.status !== "pending") return false
    const expiryDate = new Date(p.expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
    return daysUntilExpiry <= 3 && daysUntilExpiry > 0
  })

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    })
  }

  const calculateTotalHours = (sessions: Proposal["sessions"]) => {
    return sessions.reduce((total, session) => {
      const start = new Date(`2000-01-01T${session.start}`)
      const end = new Date(`2000-01-01T${session.end}`)
      return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
    }, 0)
  }

  const getExpiryWarning = (expiryDate: string, status: ProposalStatus) => {
    if (status !== "pending") return null

    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry <= 0) return "Expired"
    if (daysUntilExpiry <= 1) return "Expires today"
    if (daysUntilExpiry <= 3) return `Expires in ${daysUntilExpiry} days`
    return null
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Class Proposals</h1>
        <p className="text-muted-foreground">Review and respond to class proposals from administrators</p>
      </div>

      {/* Expiring Proposals Alert */}
      {expiringProposals.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-orange-600" />
              <div>
                <div className="font-medium text-orange-900">
                  {expiringProposals.length} proposal{expiringProposals.length !== 1 ? "s" : ""} expiring soon
                </div>
                <div className="text-sm text-orange-700">Please review and respond to avoid automatic expiry</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Overview Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Review</p>
                <p className="text-2xl font-bold">{proposals.filter((p) => p.status === "pending").length}</p>
              </div>
              <Clock className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Accepted</p>
                <p className="text-2xl font-bold">{proposals.filter((p) => p.status === "accepted").length}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">
                  £
                  {proposals
                    .filter(
                      (p) => p.status === "accepted" && new Date(p.proposedDate).getMonth() === new Date().getMonth(),
                    )
                    .reduce(
                      (sum, p) => sum + (p.rateType === "hourly" ? p.rate * calculateTotalHours(p.sessions) : p.rate),
                      0,
                    )
                    .toFixed(0)}
                </p>
              </div>
              <PoundSterling className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Response Rate</p>
                <p className="text-2xl font-bold">
                  {proposals.length > 0
                    ? Math.round(
                        ((proposals.length - proposals.filter((p) => p.status === "pending").length) /
                          proposals.length) *
                          100,
                      )
                    : 0}
                  %
                </p>
              </div>
              <Eye className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-1 items-center gap-4">
              <Input
                placeholder="Search proposals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="max-w-sm"
              />
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="pending">Pending Review</SelectItem>
                  <SelectItem value="accepted">Accepted</SelectItem>
                  <SelectItem value="declined">Declined</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Proposal</TableHead>
                <TableHead>Course</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Compensation</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Expires</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProposals.map((proposal) => {
                const totalHours = calculateTotalHours(proposal.sessions)
                const totalCompensation = proposal.rateType === "hourly" ? proposal.rate * totalHours : proposal.rate
                const expiryWarning = getExpiryWarning(proposal.expiryDate, proposal.status)

                return (
                  <TableRow key={proposal.id}>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{proposal.classTitle}</div>
                        <div className="text-sm text-muted-foreground">
                          {proposal.id} • {proposal.capacity} students
                        </div>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          {proposal.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{proposal.courseName}</div>
                        <div className="text-sm text-muted-foreground">{proposal.courseId}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">
                          {proposal.sessions.length} session{proposal.sessions.length !== 1 ? "s" : ""}
                        </div>
                        <div className="text-sm text-muted-foreground">{totalHours.toFixed(1)} hours total</div>
                        <div className="text-sm text-muted-foreground">
                          {formatDate(proposal.sessions[0]?.date)}
                          {proposal.sessions.length > 1 && " +"}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">£{totalCompensation.toFixed(2)}</div>
                        <div className="text-sm text-muted-foreground">
                          £{proposal.rate} {proposal.rateType === "hourly" ? "/hour" : "flat"}
                        </div>
                        <div className="text-sm text-muted-foreground">{proposal.paymentTerms}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[proposal.status].variant}>
                        {statusConfig[proposal.status].label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="text-sm">{formatDate(proposal.expiryDate)}</div>
                        {expiryWarning && (
                          <div
                            className={`text-xs ${
                              expiryWarning.includes("Expired")
                                ? "text-red-600"
                                : expiryWarning.includes("today")
                                  ? "text-red-600"
                                  : "text-orange-600"
                            }`}
                          >
                            {expiryWarning}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`/educator/proposals/${proposal.id}`}>
                          <Eye className="mr-2 h-4 w-4" />
                          Review
                        </Link>
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
          {filteredProposals.length === 0 && (
            <div className="p-8 text-center">
              <div className="text-muted-foreground">No proposals found matching your criteria.</div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
