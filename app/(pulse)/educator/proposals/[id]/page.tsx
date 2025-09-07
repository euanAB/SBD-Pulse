"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  FileText,
  CheckCircle,
  XCircle,
  AlertTriangle,
  FilePenLineIcon as Signature,
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type ProposalStatus = "pending" | "accepted" | "declined" | "expired"

type ProposalDetail = {
  id: string
  classTitle: string
  courseId: string
  courseName: string
  courseDescription: string
  courseOutline: string
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
  description: string
  notes: string
  requirements: string[]
}

// Mock data - in production this would come from API
const mockProposal: ProposalDetail = {
  id: "PROP-2025-001",
  classTitle: "First Aid Level 1 - Corporate Training",
  courseId: "CRS-001",
  courseName: "First Aid Level 1",
  courseDescription: "Basic first aid training covering essential life-saving skills",
  courseOutline:
    "CPR techniques, wound care, emergency response procedures, choking management, shock treatment, and basic life support",
  proposedBy: "Admin",
  proposedDate: "2025-01-10",
  expiryDate: "2025-01-17",
  status: "pending",
  sessions: [
    {
      title: "Basic First Aid Principles & CPR",
      date: "2025-01-25",
      start: "09:00",
      end: "13:00",
      location: "Training Room A",
    },
    {
      title: "Emergency Response & Practical Assessment",
      date: "2025-01-25",
      start: "14:00",
      end: "17:00",
      location: "Training Room A",
    },
  ],
  capacity: 15,
  rate: 650,
  rateType: "flat",
  paymentTerms: "Net 7 days",
  location: "Training Room A",
  description:
    "Corporate training session for office staff. All participants need certification for workplace compliance.",
  notes:
    "Corporate client requires certification for all employees. Please bring extra certificates. Lunch will be provided between sessions.",
  requirements: [
    "Valid first aid instructor certification",
    "Current DBS check",
    "Professional indemnity insurance",
    "Bring training mannequins and AED trainer",
  ],
}

export default function ProposalDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [proposal, setProposal] = React.useState(mockProposal)
  const [declineReason, setDeclineReason] = React.useState("")
  const [acceptanceTerms, setAcceptanceTerms] = React.useState(false)
  const [signatureName, setSignatureName] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const totalHours = proposal.sessions.reduce((total, session) => {
    const start = new Date(`2000-01-01T${session.start}`)
    const end = new Date(`2000-01-01T${session.end}`)
    return total + (end.getTime() - start.getTime()) / (1000 * 60 * 60)
  }, 0)

  const totalCompensation = proposal.rateType === "hourly" ? proposal.rate * totalHours : proposal.rate

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (timeStr: string) => {
    return new Date(`2000-01-01T${timeStr}`).toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getExpiryStatus = () => {
    const expiry = new Date(proposal.expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry <= 0)
      return { status: "expired", message: "This proposal has expired", variant: "destructive" as const }
    if (daysUntilExpiry <= 1) return { status: "urgent", message: "Expires today", variant: "destructive" as const }
    if (daysUntilExpiry <= 3)
      return { status: "warning", message: `Expires in ${daysUntilExpiry} days`, variant: "destructive" as const }
    return { status: "active", message: `Expires ${formatDate(proposal.expiryDate)}`, variant: "default" as const }
  }

  const handleAccept = async () => {
    if (!acceptanceTerms || !signatureName.trim()) {
      toast({
        title: "Incomplete acceptance",
        description: "Please agree to terms and provide your signature",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setProposal((prev) => ({ ...prev, status: "accepted" }))

    toast({
      title: "Proposal accepted!",
      description: "You have successfully accepted this class proposal. The admin has been notified.",
    })

    setIsSubmitting(false)

    // Redirect after a moment
    setTimeout(() => {
      router.push("/educator/proposals")
    }, 2000)
  }

  const handleDecline = async () => {
    if (!declineReason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for declining this proposal",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))

    setProposal((prev) => ({ ...prev, status: "declined" }))

    toast({
      title: "Proposal declined",
      description: "The proposal has been declined and the admin has been notified.",
    })

    setIsSubmitting(false)

    // Redirect after a moment
    setTimeout(() => {
      router.push("/educator/proposals")
    }, 2000)
  }

  const expiryInfo = getExpiryStatus()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">{proposal.classTitle}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <FileText className="h-4 w-4" />
              {proposal.id}
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4" />
              Proposed {formatDate(proposal.proposedDate)}
            </div>
            <Badge
              variant={
                proposal.status === "pending"
                  ? "outline"
                  : proposal.status === "accepted"
                    ? "default"
                    : proposal.status === "declined"
                      ? "destructive"
                      : "secondary"
              }
            >
              {proposal.status === "pending"
                ? "Pending Review"
                : proposal.status === "accepted"
                  ? "Accepted"
                  : proposal.status === "declined"
                    ? "Declined"
                    : "Expired"}
            </Badge>
          </div>
        </div>

        {proposal.status === "pending" && (
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline">
                  <XCircle className="mr-2 h-4 w-4" />
                  Decline
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Decline Proposal</DialogTitle>
                  <DialogDescription>
                    Please provide a reason for declining this proposal. This will help improve future proposals.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Reason for declining</Label>
                    <Textarea
                      value={declineReason}
                      onChange={(e) => setDeclineReason(e.target.value)}
                      placeholder="Please explain why you're declining this proposal..."
                      rows={4}
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setDeclineReason("")}>
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={handleDecline}
                      disabled={isSubmitting || !declineReason.trim()}
                    >
                      {isSubmitting ? "Declining..." : "Decline Proposal"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Accept Proposal
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>Accept Proposal</DialogTitle>
                  <DialogDescription>
                    Please review the terms and provide your digital signature to accept this proposal.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-6">
                  {/* Terms Summary */}
                  <div className="rounded-lg border p-4 space-y-3">
                    <h4 className="font-medium">Proposal Summary</h4>
                    <div className="grid gap-2 text-sm">
                      <div className="flex justify-between">
                        <span>Class:</span>
                        <span className="font-medium">{proposal.classTitle}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Sessions:</span>
                        <span className="font-medium">
                          {proposal.sessions.length} sessions ({totalHours.toFixed(1)} hours)
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span>Compensation:</span>
                        <span className="font-medium">£{totalCompensation.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Payment Terms:</span>
                        <span className="font-medium">{proposal.paymentTerms}</span>
                      </div>
                    </div>
                  </div>

                  {/* Agreement */}
                  <div className="space-y-4">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptanceTerms}
                        onCheckedChange={(checked) => setAcceptanceTerms(checked as boolean)}
                      />
                      <div className="grid gap-1.5 leading-none">
                        <label
                          htmlFor="terms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the terms and conditions
                        </label>
                        <p className="text-xs text-muted-foreground">
                          By accepting this proposal, I agree to deliver the specified training sessions according to
                          the outlined requirements and schedule.
                        </p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="signature">Digital Signature</Label>
                      <div className="relative">
                        <Signature className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <input
                          id="signature"
                          type="text"
                          placeholder="Type your full name as signature"
                          value={signatureName}
                          onChange={(e) => setSignatureName(e.target.value)}
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">Date: {new Date().toLocaleDateString("en-GB")}</p>
                    </div>
                  </div>

                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setAcceptanceTerms(false)
                        setSignatureName("")
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleAccept}
                      disabled={isSubmitting || !acceptanceTerms || !signatureName.trim()}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      {isSubmitting ? "Processing..." : "Accept & Sign"}
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      </div>

      {/* Expiry Warning */}
      {proposal.status === "pending" && expiryInfo.status !== "active" && (
        <Alert variant={expiryInfo.variant}>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <strong>Action Required:</strong> {expiryInfo.message}
          </AlertDescription>
        </Alert>
      )}

      {/* Main Content */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column - Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Course Information */}
          <Card>
            <CardHeader>
              <CardTitle>Course Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Course</div>
                  <div className="font-medium">{proposal.courseName}</div>
                  <div className="text-sm text-muted-foreground">{proposal.courseId}</div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Capacity</div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{proposal.capacity} students maximum</span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Course Description</div>
                <div className="text-sm">{proposal.courseDescription}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm font-medium text-muted-foreground">Course Outline</div>
                <div className="text-sm">{proposal.courseOutline}</div>
              </div>

              {proposal.description && (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">Class Description</div>
                  <div className="text-sm">{proposal.description}</div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Schedule */}
          <Card>
            <CardHeader>
              <CardTitle>Schedule & Location</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {proposal.sessions.map((session, index) => (
                  <div key={index} className="flex items-start gap-4 p-3 border rounded-lg">
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-medium text-sm">
                      {index + 1}
                    </div>
                    <div className="flex-1 space-y-1">
                      <div className="font-medium">{session.title}</div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {formatDate(session.date)}
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTime(session.start)} - {formatTime(session.end)}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3" />
                          {session.location}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2 border-t">
                <div className="text-sm text-muted-foreground">
                  Total duration: {totalHours.toFixed(1)} hours across {proposal.sessions.length} session
                  {proposal.sessions.length !== 1 ? "s" : ""}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          {proposal.requirements.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Requirements</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {proposal.requirements.map((requirement, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      {requirement}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Notes */}
          {proposal.notes && (
            <Card>
              <CardHeader>
                <CardTitle>Additional Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm">{proposal.notes}</div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Column - Summary */}
        <div className="space-y-6">
          {/* Financial Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Compensation</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Rate:</span>
                  <span className="font-medium">
                    £{proposal.rate.toFixed(2)} {proposal.rateType === "hourly" ? "/hour" : "flat"}
                  </span>
                </div>

                {proposal.rateType === "hourly" && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Total Hours:</span>
                    <span className="font-medium">{totalHours.toFixed(1)} hours</span>
                  </div>
                )}

                <Separator />

                <div className="flex justify-between">
                  <span className="font-medium">Total Compensation:</span>
                  <span className="text-lg font-bold text-green-600">£{totalCompensation.toFixed(2)}</span>
                </div>

                <div className="text-sm text-muted-foreground">Payment terms: {proposal.paymentTerms}</div>
              </div>
            </CardContent>
          </Card>

          {/* Proposal Details */}
          <Card>
            <CardHeader>
              <CardTitle>Proposal Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Proposed by</div>
                <div className="font-medium">{proposal.proposedBy}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Proposed on</div>
                <div className="font-medium">{formatDate(proposal.proposedDate)}</div>
              </div>

              <div className="space-y-2">
                <div className="text-sm text-muted-foreground">Response deadline</div>
                <div
                  className={`font-medium ${
                    expiryInfo.status === "expired" || expiryInfo.status === "urgent"
                      ? "text-red-600"
                      : expiryInfo.status === "warning"
                        ? "text-orange-600"
                        : ""
                  }`}
                >
                  {formatDate(proposal.expiryDate)}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          {proposal.status === "pending" && (
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" size="sm">
                  <Calendar className="mr-2 h-4 w-4" />
                  Check Availability
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  <FileText className="mr-2 h-4 w-4" />
                  Download PDF
                </Button>
                <Button variant="outline" className="w-full bg-transparent" size="sm">
                  <Users className="mr-2 h-4 w-4" />
                  Contact Admin
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Status History */}
          <Card>
            <CardHeader>
              <CardTitle>Status History</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium">Proposal Created</div>
                    <div className="text-xs text-muted-foreground">{formatDate(proposal.proposedDate)}</div>
                  </div>
                </div>

                {proposal.status === "accepted" && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-600"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Accepted</div>
                      <div className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-GB")}</div>
                    </div>
                  </div>
                )}

                {proposal.status === "declined" && (
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-600"></div>
                    <div className="flex-1">
                      <div className="text-sm font-medium">Declined</div>
                      <div className="text-xs text-muted-foreground">{new Date().toLocaleDateString("en-GB")}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
