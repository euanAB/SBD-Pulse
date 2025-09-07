"use client"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Calendar, Clock, Users, FileText, PoundSterling, AlertTriangle, CheckCircle } from "lucide-react"
import Link from "next/link"

export default function EducatorDashboardPage() {
  const upcomingSessions = [
    {
      id: "C-079-S1",
      classTitle: "First Aid Level 2",
      date: "2025-01-15",
      time: "09:00 - 16:00",
      location: "Training Room A",
      students: 12,
      capacity: 15,
    },
    {
      id: "C-087-S1",
      classTitle: "Safeguarding Basics",
      date: "2025-01-18",
      time: "10:00 - 15:00",
      location: "Training Room B",
      students: 8,
      capacity: 12,
    },
  ]

  const pendingProposals = [
    {
      id: "PROP-2025-001",
      title: "First Aid Level 1 - Corporate Training",
      expiresIn: 3,
      rate: 650,
      sessions: 1,
    },
    {
      id: "PROP-2025-002",
      title: "CPR Essentials Weekend Course",
      expiresIn: 7,
      rate: 450,
      sessions: 2,
    },
  ]

  const recentInvoices = [
    {
      id: "INV-2025-001",
      classTitle: "First Aid Level 2",
      amount: 450,
      status: "paid",
      date: "2025-01-05",
    },
    {
      id: "INV-2025-002",
      classTitle: "Safeguarding Basics",
      amount: 390,
      status: "processing",
      date: "2025-01-08",
    },
  ]

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Welcome back, Sarah</h1>
        <p className="text-muted-foreground">Here's what's happening with your classes and proposals</p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Active Classes</p>
                <p className="text-2xl font-bold">3</p>
              </div>
              <Users className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Pending Proposals</p>
                <p className="text-2xl font-bold">2</p>
              </div>
              <FileText className="h-8 w-8 text-orange-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">This Month</p>
                <p className="text-2xl font-bold">£1,240</p>
              </div>
              <PoundSterling className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Students</p>
                <p className="text-2xl font-bold">47</p>
              </div>
              <Users className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Upcoming Sessions */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Upcoming Sessions
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/educator/classes">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {upcomingSessions.map((session) => (
              <div key={session.id} className="rounded border p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">{session.classTitle}</div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(session.date).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {session.time}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">{session.location}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium">
                      {session.students}/{session.capacity} students
                    </div>
                    <Progress value={(session.students / session.capacity) * 100} className="mt-1 w-20" />
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" variant="outline" asChild>
                    <Link href={`/educator/classes/${session.id.split("-")[0]}-${session.id.split("-")[1]}`}>
                      View Class
                    </Link>
                  </Button>
                  <Button size="sm" variant="outline">
                    Mark Attendance
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Pending Proposals */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Pending Proposals
              {pendingProposals.length > 0 && <Badge variant="secondary">{pendingProposals.length}</Badge>}
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/educator/proposals">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {pendingProposals.map((proposal) => (
              <div key={proposal.id} className="rounded border p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <div className="font-medium">{proposal.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {proposal.sessions} session{proposal.sessions !== 1 ? "s" : ""} • £{proposal.rate}
                    </div>
                    <div className="flex items-center gap-1 text-sm">
                      <AlertTriangle className="h-3 w-3 text-orange-500" />
                      <span className="text-orange-600">
                        Expires in {proposal.expiresIn} day{proposal.expiresIn !== 1 ? "s" : ""}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 flex gap-2">
                  <Button size="sm" asChild>
                    <Link href={`/educator/proposals/${proposal.id}`}>Review Proposal</Link>
                  </Button>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Recent Invoices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <PoundSterling className="h-5 w-5" />
              Recent Invoices
            </CardTitle>
            <Button variant="outline" size="sm" asChild>
              <Link href="/educator/invoices">View All</Link>
            </Button>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentInvoices.map((invoice) => (
              <div key={invoice.id} className="flex items-center justify-between rounded border p-4">
                <div className="space-y-1">
                  <div className="font-medium">{invoice.classTitle}</div>
                  <div className="text-sm text-muted-foreground">
                    {invoice.id} • {new Date(invoice.date).toLocaleDateString("en-GB")}
                  </div>
                </div>
                <div className="text-right">
                  <div className="font-medium">£{invoice.amount}</div>
                  <div className="flex items-center gap-1">
                    {invoice.status === "paid" ? (
                      <CheckCircle className="h-3 w-3 text-green-500" />
                    ) : (
                      <Clock className="h-3 w-3 text-orange-500" />
                    )}
                    <span className={`text-sm ${invoice.status === "paid" ? "text-green-600" : "text-orange-600"}`}>
                      {invoice.status === "paid" ? "Paid" : "Processing"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/educator/invoices">
                <PoundSterling className="mr-2 h-4 w-4" />
                Submit New Invoice
              </Link>
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/educator/classes">
                <Users className="mr-2 h-4 w-4" />
                View My Students
              </Link>
            </Button>
            <Button className="w-full justify-start bg-transparent" variant="outline" asChild>
              <Link href="/educator/proposals">
                <FileText className="mr-2 h-4 w-4" />
                Review Proposals
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
