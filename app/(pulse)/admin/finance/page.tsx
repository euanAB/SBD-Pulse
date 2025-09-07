"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  AlertTriangle,
  CheckCircle,
  Eye,
  Calendar,
  Download,
} from "lucide-react"

type FinancialData = {
  monthlyIncome: number
  monthlyExpenses: number
  netProfit: number
  profitMargin: number
  studentsInArrears: number
  totalOwed: number
  totalPayableNext30Days: number
  pendingInvoices: number
}

type Student = {
  id: string
  name: string
  course: string
  amountOwed: number
  daysPastDue: number
  lastContact?: string
  paymentPlan?: boolean
}

type Invoice = {
  id: string
  educatorName: string
  course: string
  amount: number
  submittedDate: string
  status: "Pending" | "Approved" | "Rejected" | "Paid"
  description: string
  hoursWorked?: number
}

type CourseFinancials = {
  courseId: string
  courseName: string
  totalRevenue: number
  totalCosts: number
  profit: number
  profitMargin: number
  studentsEnrolled: number
  averageRevenuePerStudent: number
}

const mockFinancialData: FinancialData = {
  monthlyIncome: 45680,
  monthlyExpenses: 28340,
  netProfit: 17340,
  profitMargin: 37.9,
  studentsInArrears: 12,
  totalOwed: 8450,
  totalPayableNext30Days: 15200,
  pendingInvoices: 8,
}

const mockStudentsInArrears: Student[] = [
  {
    id: "STU-001",
    name: "Sarah Johnson",
    course: "Nail Beauty Therapy",
    amountOwed: 1250,
    daysPastDue: 15,
    lastContact: "2025-01-05",
    paymentPlan: false,
  },
  {
    id: "STU-002",
    name: "Michael Chen",
    course: "Advanced Nail Art",
    amountOwed: 890,
    daysPastDue: 32,
    lastContact: "2024-12-20",
    paymentPlan: true,
  },
  {
    id: "STU-003",
    name: "Emma Wilson",
    course: "Beauty Therapy Foundation",
    amountOwed: 2100,
    daysPastDue: 8,
    paymentPlan: false,
  },
  {
    id: "STU-004",
    name: "David Brown",
    course: "Nail Beauty Therapy",
    amountOwed: 750,
    daysPastDue: 45,
    lastContact: "2024-12-15",
    paymentPlan: true,
  },
  {
    id: "STU-005",
    name: "Lisa Taylor",
    course: "Advanced Nail Art",
    amountOwed: 1680,
    daysPastDue: 22,
    lastContact: "2024-12-28",
  },
]

const mockPendingInvoices: Invoice[] = [
  {
    id: "INV-001",
    educatorName: "Euan MacLeod",
    course: "Nail Beauty Therapy",
    amount: 1350,
    submittedDate: "2025-01-10",
    status: "Pending",
    description: "Teaching sessions Week 1-3, January 2025",
    hoursWorked: 30,
  },
  {
    id: "INV-002",
    educatorName: "Sophie Chen",
    course: "Beauty Therapy Foundation",
    amount: 950,
    submittedDate: "2025-01-08",
    status: "Pending",
    description: "Practical sessions and assessments",
    hoursWorked: 25,
  },
  {
    id: "INV-003",
    educatorName: "Marcus Johnson",
    course: "Advanced Nail Art",
    amount: 1680,
    submittedDate: "2025-01-12",
    status: "Approved",
    description: "Masterclass sessions and one-to-one coaching",
    hoursWorked: 40,
  },
  {
    id: "INV-004",
    educatorName: "Euan MacLeod",
    course: "Nail Gels Specialist",
    amount: 720,
    submittedDate: "2025-01-05",
    status: "Approved",
    description: "Weekend workshop delivery",
    hoursWorked: 16,
  },
  {
    id: "INV-005",
    educatorName: "Sophie Chen",
    course: "Beauty Therapy Foundation",
    amount: 1140,
    submittedDate: "2024-12-28",
    status: "Paid",
    description: "December teaching sessions",
    hoursWorked: 30,
  },
]

const mockCourseFinancials: CourseFinancials[] = [
  {
    courseId: "CRS-001",
    courseName: "Nail Beauty Therapy Training",
    totalRevenue: 18750,
    totalCosts: 8400,
    profit: 10350,
    profitMargin: 55.2,
    studentsEnrolled: 15,
    averageRevenuePerStudent: 1250,
  },
  {
    courseId: "CRS-002",
    courseName: "Advanced Nail Art Techniques",
    totalRevenue: 12600,
    totalCosts: 6720,
    profit: 5880,
    profitMargin: 46.7,
    studentsEnrolled: 9,
    averageRevenuePerStudent: 1400,
  },
  {
    courseId: "CRS-003",
    courseName: "Beauty Therapy Foundation",
    totalRevenue: 22400,
    totalCosts: 11200,
    profit: 11200,
    profitMargin: 50.0,
    studentsEnrolled: 16,
    averageRevenuePerStudent: 1400,
  },
  {
    courseId: "CRS-004",
    courseName: "Nail Gels Specialist",
    totalRevenue: 8400,
    totalCosts: 3360,
    profit: 5040,
    profitMargin: 60.0,
    studentsEnrolled: 12,
    averageRevenuePerStudent: 700,
  },
]

export default function FinancePage() {
  const [selectedInvoice, setSelectedInvoice] = React.useState<Invoice | null>(null)
  const [invoiceFilter, setInvoiceFilter] = React.useState<string>("all")
  const [arrearsFilter, setArrearsFilter] = React.useState<string>("all")

  const filteredInvoices = mockPendingInvoices.filter((invoice) => {
    if (invoiceFilter === "all") return true
    return invoice.status === invoiceFilter
  })

  const filteredArrears = mockStudentsInArrears.filter((student) => {
    if (arrearsFilter === "all") return true
    if (arrearsFilter === "critical") return student.daysPastDue > 30
    if (arrearsFilter === "payment-plan") return student.paymentPlan
    return true
  })

  function getArrearsUrgency(daysPastDue: number) {
    if (daysPastDue > 30) return "destructive"
    if (daysPastDue > 14) return "secondary"
    return "outline"
  }

  function getInvoiceStatusBadge(status: string) {
    switch (status) {
      case "Pending":
        return "secondary"
      case "Approved":
        return "default"
      case "Rejected":
        return "destructive"
      case "Paid":
        return "outline"
      default:
        return "outline"
    }
  }

  function approveInvoice(invoiceId: string) {
    // In real app, this would update the database
    console.log(`Approving invoice ${invoiceId}`)
  }

  function rejectInvoice(invoiceId: string) {
    // In real app, this would update the database
    console.log(`Rejecting invoice ${invoiceId}`)
  }

  function markAsPaid(invoiceId: string) {
    // In real app, this would update the database
    console.log(`Marking invoice ${invoiceId} as paid`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Financial Dashboard</h1>
          <p className="text-muted-foreground">Comprehensive business financial insights and management</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export Report
          </Button>
          <Button>
            <Calendar className="mr-2 h-4 w-4" />
            Generate Monthly Report
          </Button>
        </div>
      </div>

      {/* Executive Overview Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Income</CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{mockFinancialData.monthlyIncome.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+12.5% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Monthly Expenses</CardTitle>
            <TrendingDown className="h-4 w-4 text-red-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{mockFinancialData.monthlyExpenses.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">+3.2% from last month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Net Profit</CardTitle>
            <DollarSign className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">£{mockFinancialData.netProfit.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">{mockFinancialData.profitMargin}% margin</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Students in Arrears</CardTitle>
            <AlertTriangle className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockFinancialData.studentsInArrears}</div>
            <p className="text-xs text-muted-foreground">£{mockFinancialData.totalOwed.toLocaleString()} total owed</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="arrears">Arrears Management</TabsTrigger>
          <TabsTrigger value="invoices">Invoice Approvals</TabsTrigger>
          <TabsTrigger value="courses">Course Analysis</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Revenue Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {mockCourseFinancials.map((course) => (
                  <div key={course.courseId} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>{course.courseName}</span>
                      <span className="font-medium">£{course.totalRevenue.toLocaleString()}</span>
                    </div>
                    <Progress value={(course.totalRevenue / 62150) * 100} className="h-2" />
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Upcoming Payments (Next 30 Days)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-2">
                  £{mockFinancialData.totalPayableNext30Days.toLocaleString()}
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Educator Payments</span>
                    <span>£8,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Venue Costs</span>
                    <span>£4,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Equipment & Supplies</span>
                    <span>£1,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other Expenses</span>
                    <span>£800</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="arrears" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Students in Arrears</h3>
            <div className="flex items-center gap-2">
              <Select value={arrearsFilter} onValueChange={setArrearsFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Filter arrears" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Students</SelectItem>
                  <SelectItem value="critical">Critical (30+ days)</SelectItem>
                  <SelectItem value="payment-plan">Payment Plans</SelectItem>
                </SelectContent>
              </Select>
              <Button>
                <Users className="mr-2 h-4 w-4" />
                Bulk Contact
              </Button>
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount Owed</TableHead>
                  <TableHead>Days Past Due</TableHead>
                  <TableHead>Last Contact</TableHead>
                  <TableHead>Payment Plan</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredArrears.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="font-medium">{student.name}</div>
                      <div className="text-sm text-muted-foreground">{student.id}</div>
                    </TableCell>
                    <TableCell>{student.course}</TableCell>
                    <TableCell className="font-medium">£{student.amountOwed.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant={getArrearsUrgency(student.daysPastDue) as any}>{student.daysPastDue} days</Badge>
                    </TableCell>
                    <TableCell>
                      {student.lastContact ? new Date(student.lastContact).toLocaleDateString() : "Never"}
                    </TableCell>
                    <TableCell>
                      {student.paymentPlan ? (
                        <Badge variant="outline">Active</Badge>
                      ) : (
                        <span className="text-muted-foreground">None</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm">
                          Contact
                        </Button>
                        <Button variant="outline" size="sm">
                          Payment Plan
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Invoice Approvals</h3>
            <Select value={invoiceFilter} onValueChange={setInvoiceFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter invoices" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Invoices</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
                <SelectItem value="Paid">Paid</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Invoice</TableHead>
                  <TableHead>Educator</TableHead>
                  <TableHead>Course</TableHead>
                  <TableHead>Amount</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div className="font-medium">{invoice.id}</div>
                      <div className="text-sm text-muted-foreground truncate max-w-[200px]">{invoice.description}</div>
                    </TableCell>
                    <TableCell>{invoice.educatorName}</TableCell>
                    <TableCell>{invoice.course}</TableCell>
                    <TableCell className="font-medium">£{invoice.amount.toLocaleString()}</TableCell>
                    <TableCell>{invoice.hoursWorked || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant={getInvoiceStatusBadge(invoice.status) as any}>{invoice.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(invoice.submittedDate).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="sm" onClick={() => setSelectedInvoice(invoice)}>
                          <Eye className="h-4 w-4" />
                        </Button>
                        {invoice.status === "Pending" && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => approveInvoice(invoice.id)}>
                              <CheckCircle className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => rejectInvoice(invoice.id)}>
                              <AlertTriangle className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                        {invoice.status === "Approved" && (
                          <Button variant="outline" size="sm" onClick={() => markAsPaid(invoice.id)}>
                            Mark Paid
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="courses" className="space-y-4">
          <h3 className="text-lg font-semibold">Course Profitability Analysis</h3>

          <div className="grid gap-4">
            {mockCourseFinancials.map((course) => (
              <Card key={course.courseId}>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    <span>{course.courseName}</span>
                    <Badge
                      variant={
                        course.profitMargin > 50 ? "default" : course.profitMargin > 30 ? "secondary" : "destructive"
                      }
                    >
                      {course.profitMargin}% margin
                    </Badge>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4 md:grid-cols-4">
                    <div>
                      <div className="text-sm text-muted-foreground">Total Revenue</div>
                      <div className="text-2xl font-bold">£{course.totalRevenue.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Total Costs</div>
                      <div className="text-2xl font-bold">£{course.totalCosts.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Net Profit</div>
                      <div className="text-2xl font-bold text-green-600">£{course.profit.toLocaleString()}</div>
                    </div>
                    <div>
                      <div className="text-sm text-muted-foreground">Avg Revenue/Student</div>
                      <div className="text-2xl font-bold">£{course.averageRevenuePerStudent.toLocaleString()}</div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-2">
                      <span>Profit Margin</span>
                      <span>{course.profitMargin}%</span>
                    </div>
                    <Progress value={course.profitMargin} className="h-2" />
                  </div>
                  <div className="mt-4 text-sm text-muted-foreground">{course.studentsEnrolled} students enrolled</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="cashflow" className="space-y-4">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Expected Inflows (Next 30 Days)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">£12,400</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Course Payments Due</span>
                    <span>£8,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Payment Plan Installments</span>
                    <span>£2,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Late Payment Recoveries</span>
                    <span>£1,400</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Pending Outflows (Next 30 Days)</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-3xl font-bold">£15,200</div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Educator Payments</span>
                    <span>£8,400</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Venue Rental</span>
                    <span>£4,200</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Equipment & Supplies</span>
                    <span>£1,800</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other Operating Costs</span>
                    <span>£800</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cash Flow Projection</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid gap-4 md:grid-cols-3">
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Net Cash Flow</div>
                    <div className="text-2xl font-bold text-red-600">-£2,800</div>
                    <div className="text-xs text-muted-foreground">Next 30 days</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Current Balance</div>
                    <div className="text-2xl font-bold">£24,500</div>
                    <div className="text-xs text-muted-foreground">As of today</div>
                  </div>
                  <div className="text-center">
                    <div className="text-sm text-muted-foreground">Projected Balance</div>
                    <div className="text-2xl font-bold">£21,700</div>
                    <div className="text-xs text-muted-foreground">End of month</div>
                  </div>
                </div>
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <span className="text-sm font-medium">Cash Flow Alert</span>
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">
                    Negative cash flow projected. Consider accelerating receivables collection or deferring non-critical
                    expenses.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Invoice Preview Modal */}
      <Dialog open={!!selectedInvoice} onOpenChange={() => setSelectedInvoice(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Invoice Preview - {selectedInvoice?.id}</DialogTitle>
          </DialogHeader>
          {selectedInvoice && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <div className="text-sm text-muted-foreground">Educator</div>
                  <div className="font-medium">{selectedInvoice.educatorName}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Course</div>
                  <div className="font-medium">{selectedInvoice.course}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Amount</div>
                  <div className="text-2xl font-bold">£{selectedInvoice.amount.toLocaleString()}</div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Hours Worked</div>
                  <div className="font-medium">{selectedInvoice.hoursWorked || "N/A"}</div>
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Description</div>
                <div className="font-medium">{selectedInvoice.description}</div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Submitted Date</div>
                <div className="font-medium">{new Date(selectedInvoice.submittedDate).toLocaleDateString()}</div>
              </div>
              <div className="flex justify-end gap-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedInvoice(null)}>
                  Close
                </Button>
                {selectedInvoice.status === "Pending" && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        rejectInvoice(selectedInvoice.id)
                        setSelectedInvoice(null)
                      }}
                    >
                      Reject
                    </Button>
                    <Button
                      onClick={() => {
                        approveInvoice(selectedInvoice.id)
                        setSelectedInvoice(null)
                      }}
                    >
                      Approve
                    </Button>
                  </>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
