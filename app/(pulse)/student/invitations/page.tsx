"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Calendar,
  Clock,
  PoundSterling,
  MapPin,
  AlertTriangle,
  CheckCircle,
  User,
  Users,
  Gift,
  Star,
  Sparkles,
  Timer,
  Award,
  Target,
  ExternalLink,
  Phone,
  Zap,
  TrendingUp,
} from "lucide-react"
import Link from "next/link"

type InvitationStatus = "pending" | "accepted" | "declined" | "expired"
type Priority = "high" | "medium" | "low"

type Invitation = {
  id: string
  courseTitle: string
  courseId: string
  date: string
  time: string
  duration: string
  location: string
  instructor: string
  price: number
  originalPrice?: number
  discount?: number
  capacity: number
  enrolled: number
  expiryDate: string
  status: InvitationStatus
  description: string
  requirements: string[]
  priority: Priority
  benefits: string[]
  earlyBird?: boolean
  popular?: boolean
  limitedSpots?: boolean
}

const mockInvitations: Invitation[] = [
  {
    id: "INV-2025-001",
    courseTitle: "CPR Essentials",
    courseId: "CRS-002",
    date: "2025-02-01",
    time: "09:00 - 16:00",
    duration: "7 hours",
    location: "Manchester Training Centre",
    instructor: "Sarah Johnson",
    price: 120,
    originalPrice: 150,
    discount: 20,
    capacity: 15,
    enrolled: 8,
    expiryDate: "2025-01-25",
    status: "pending",
    description:
      "Master life-saving CPR techniques for adults, children, and infants. Includes hands-on AED training and emergency response protocols.",
    requirements: ["No prior experience required", "Comfortable clothing recommended", "Light refreshments provided"],
    priority: "high",
    benefits: [
      "Nationally recognized certification",
      "3-year validity",
      "Workplace compliance",
      "Emergency preparedness",
    ],
    earlyBird: true,
    popular: true,
    limitedSpots: true,
  },
  {
    id: "INV-2025-002",
    courseTitle: "Manual Handling Mastery",
    courseId: "CRS-004",
    date: "2025-02-08",
    time: "10:00 - 14:00",
    duration: "4 hours",
    location: "Liverpool Training Centre",
    instructor: "Mike Thompson",
    price: 95,
    capacity: 20,
    enrolled: 12,
    expiryDate: "2025-02-01",
    status: "pending",
    description: "Learn safe lifting techniques and workplace ergonomics to prevent injury and boost productivity.",
    requirements: ["Suitable for all fitness levels", "Safety boots required", "Practical exercises included"],
    priority: "medium",
    benefits: ["Reduce workplace injuries", "Improve productivity", "Legal compliance", "Personal safety"],
    popular: false,
    limitedSpots: false,
  },
  {
    id: "INV-2025-003",
    courseTitle: "Advanced First Aid Pro",
    courseId: "CRS-006",
    date: "2025-02-15",
    time: "09:00 - 17:00",
    duration: "8 hours",
    location: "Birmingham Training Centre",
    instructor: "Dr. Emma Wilson",
    price: 180,
    originalPrice: 220,
    discount: 18,
    capacity: 12,
    enrolled: 3,
    expiryDate: "2025-02-08",
    status: "pending",
    description:
      "Advanced first aid training for healthcare professionals and workplace first aiders. Comprehensive emergency response training.",
    requirements: ["Basic first aid knowledge preferred", "Professional development", "Certificate provided"],
    priority: "high",
    benefits: ["Advanced certification", "Career advancement", "Professional recognition", "Expert instruction"],
    earlyBird: true,
    popular: true,
    limitedSpots: true,
  },
]

const statusConfig: Record<
  InvitationStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline"; color: string }
> = {
  pending: { label: "Pending Response", variant: "outline", color: "text-orange-600" },
  accepted: { label: "Accepted", variant: "default", color: "text-green-600" },
  declined: { label: "Declined", variant: "destructive", color: "text-red-600" },
  expired: { label: "Expired", variant: "secondary", color: "text-gray-600" },
}

export default function StudentInvitationsPage() {
  const [invitations, setInvitations] = React.useState(mockInvitations)
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [searchQuery, setSearchQuery] = React.useState("")

  // Filter invitations
  const filteredInvitations = React.useMemo(() => {
    return invitations.filter((invitation) => {
      const matchesStatus = statusFilter === "all" || invitation.status === statusFilter
      const matchesSearch =
        searchQuery === "" ||
        invitation.courseTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invitation.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
        invitation.id.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesStatus && matchesSearch
    })
  }, [invitations, statusFilter, searchQuery])

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatShortDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
    })
  }

  const getExpiryInfo = (expiryDate: string, status: InvitationStatus) => {
    if (status !== "pending") return null

    const expiry = new Date(expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry <= 0) return { text: "Expired", urgent: true, color: "text-red-600" }
    if (daysUntilExpiry <= 1) return { text: "Expires today!", urgent: true, color: "text-red-600" }
    if (daysUntilExpiry <= 3) return { text: `${daysUntilExpiry} days left`, urgent: true, color: "text-orange-600" }
    if (daysUntilExpiry <= 7) return { text: `${daysUntilExpiry} days left`, urgent: false, color: "text-yellow-600" }
    return { text: `${daysUntilExpiry} days left`, urgent: false, color: "text-gray-600" }
  }

  const handleAccept = (invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === invitationId ? { ...inv, status: "accepted" as InvitationStatus } : inv)),
    )
  }

  const handleDecline = (invitationId: string) => {
    setInvitations((prev) =>
      prev.map((inv) => (inv.id === invitationId ? { ...inv, status: "declined" as InvitationStatus } : inv)),
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 p-6">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-full text-sm font-medium">
            <Gift className="h-4 w-4" />
            Course Invitations
          </div>
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">You're Invited!</h1>
            <p className="text-xl text-gray-600">Exclusive course opportunities just for you</p>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Pending</p>
                  <p className="text-3xl font-bold text-orange-900">
                    {invitations.filter((i) => i.status === "pending").length}
                  </p>
                  <p className="text-xs text-orange-600 mt-1">Awaiting response</p>
                </div>
                <div className="p-3 bg-orange-600 rounded-full">
                  <Timer className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Accepted</p>
                  <p className="text-3xl font-bold text-green-900">
                    {invitations.filter((i) => i.status === "accepted").length}
                  </p>
                  <p className="text-xs text-green-600 mt-1">Ready to learn</p>
                </div>
                <div className="p-3 bg-green-600 rounded-full">
                  <CheckCircle className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Total Savings</p>
                  <p className="text-3xl font-bold text-blue-900">
                    £{invitations.filter((i) => i.discount).reduce((sum, i) => sum + (i.originalPrice! - i.price), 0)}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">Available discounts</p>
                </div>
                <div className="p-3 bg-blue-600 rounded-full">
                  <PoundSterling className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-700">Success Rate</p>
                  <p className="text-3xl font-bold text-purple-900">
                    {invitations.length > 0
                      ? Math.round(
                          (invitations.filter((i) => i.status === "accepted").length / invitations.length) * 100,
                        )
                      : 0}
                    %
                  </p>
                  <p className="text-xs text-purple-600 mt-1">Acceptance rate</p>
                </div>
                <div className="p-3 bg-purple-600 rounded-full">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="pb-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <div className="flex flex-1 items-center gap-4">
                <div className="relative flex-1 max-w-md">
                  <Input
                    placeholder="Search invitations, courses, or instructors..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-11 pl-4 pr-4 bg-white/80"
                  />
                </div>
                <Select value={statusFilter} onValueChange={setStatusFilter}>
                  <SelectTrigger className="w-[200px] h-11 bg-white/80">
                    <SelectValue placeholder="Filter by status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Invitations ({invitations.length})</SelectItem>
                    <SelectItem value="pending">
                      Pending ({invitations.filter((i) => i.status === "pending").length})
                    </SelectItem>
                    <SelectItem value="accepted">
                      Accepted ({invitations.filter((i) => i.status === "accepted").length})
                    </SelectItem>
                    <SelectItem value="declined">
                      Declined ({invitations.filter((i) => i.status === "declined").length})
                    </SelectItem>
                    <SelectItem value="expired">
                      Expired ({invitations.filter((i) => i.status === "expired").length})
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="text-sm text-gray-600">
                Showing {filteredInvitations.length} of {invitations.length} invitations
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Invitation Cards */}
        <div className="grid gap-8 lg:grid-cols-2 xl:grid-cols-3">
          {filteredInvitations.map((invitation) => {
            const expiryInfo = getExpiryInfo(invitation.expiryDate, invitation.status)
            const spotsLeft = invitation.capacity - invitation.enrolled

            return (
              <Card
                key={invitation.id}
                className={`relative overflow-hidden bg-white/90 backdrop-blur-sm border-0 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 ${
                  invitation.priority === "high"
                    ? "ring-2 ring-orange-200"
                    : invitation.priority === "medium"
                      ? "ring-1 ring-blue-200"
                      : ""
                }`}
              >
                {/* Priority Banner */}
                {invitation.priority === "high" && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-red-500 text-white px-3 py-1 text-xs font-bold rounded-bl-lg">
                    <Zap className="h-3 w-3 inline mr-1" />
                    HIGH PRIORITY
                  </div>
                )}

                {/* Status Badges */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {invitation.popular && (
                    <Badge className="bg-blue-500 text-white border-0 text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  {invitation.earlyBird && (
                    <Badge className="bg-green-500 text-white border-0 text-xs">
                      <Timer className="h-3 w-3 mr-1" />
                      Early Bird
                    </Badge>
                  )}
                  {invitation.limitedSpots && spotsLeft <= 5 && (
                    <Badge className="bg-red-500 text-white border-0 text-xs">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {spotsLeft} spots left
                    </Badge>
                  )}
                </div>

                <CardHeader className="pt-16 pb-4">
                  <div className="space-y-3">
                    <CardTitle className="text-xl font-bold text-gray-900 leading-tight">
                      {invitation.courseTitle}
                    </CardTitle>
                    <p className="text-gray-600 text-sm leading-relaxed">{invitation.description}</p>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Pricing */}
                  <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                    <div className="flex items-center gap-3">
                      <PoundSterling className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-2xl font-bold text-green-700">£{invitation.price}</span>
                          {invitation.originalPrice && (
                            <span className="text-lg text-gray-500 line-through">£{invitation.originalPrice}</span>
                          )}
                        </div>
                        {invitation.discount && (
                          <div className="text-sm text-green-600 font-medium">
                            Save £{invitation.originalPrice! - invitation.price} ({invitation.discount}% off)
                          </div>
                        )}
                      </div>
                    </div>
                    {invitation.discount && (
                      <div className="bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold">
                        -{invitation.discount}%
                      </div>
                    )}
                  </div>

                  {/* Course Details */}
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-blue-600" />
                        <div>
                          <div className="font-medium text-gray-900">{formatShortDate(invitation.date)}</div>
                          <div className="text-gray-600">{invitation.time}</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-purple-600" />
                        <div>
                          <div className="font-medium text-gray-900">{invitation.duration}</div>
                          <div className="text-gray-600">Duration</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-green-600" />
                        <div>
                          <div className="font-medium text-gray-900">{invitation.location}</div>
                          <div className="text-gray-600">Location</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-orange-600" />
                        <div>
                          <div className="font-medium text-gray-900">{invitation.instructor}</div>
                          <div className="text-gray-600">Instructor</div>
                        </div>
                      </div>
                    </div>

                    {/* Capacity */}
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4 text-gray-600" />
                        <span className="text-sm font-medium text-gray-900">
                          {invitation.enrolled}/{invitation.capacity} enrolled
                        </span>
                      </div>
                      <div className="text-sm text-gray-600">
                        {spotsLeft > 0 ? `${spotsLeft} spots available` : "Fully booked"}
                      </div>
                    </div>

                    {/* Benefits */}
                    <div className="space-y-2">
                      <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                        <Target className="h-4 w-4 text-blue-600" />
                        What You'll Gain
                      </h4>
                      <div className="grid grid-cols-2 gap-2">
                        {invitation.benefits.slice(0, 4).map((benefit, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                            <CheckCircle className="h-3 w-3 text-green-500 flex-shrink-0" />
                            <span>{benefit}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Expiry Warning */}
                    {expiryInfo && (
                      <Alert
                        className={`${
                          expiryInfo.urgent
                            ? "bg-red-50 border-red-200"
                            : expiryInfo.color.includes("orange")
                              ? "bg-orange-50 border-orange-200"
                              : "bg-yellow-50 border-yellow-200"
                        }`}
                      >
                        <AlertTriangle
                          className={`h-4 w-4 ${
                            expiryInfo.urgent
                              ? "text-red-600"
                              : expiryInfo.color.includes("orange")
                                ? "text-orange-600"
                                : "text-yellow-600"
                          }`}
                        />
                        <AlertDescription
                          className={`font-medium ${
                            expiryInfo.urgent
                              ? "text-red-800"
                              : expiryInfo.color.includes("orange")
                                ? "text-orange-800"
                                : "text-yellow-800"
                          }`}
                        >
                          {expiryInfo.urgent ? "⚡ URGENT: " : "⏰ "}
                          {expiryInfo.text} - Respond now to secure your spot!
                        </AlertDescription>
                      </Alert>
                    )}

                    {/* Status Badge */}
                    <div className="flex justify-center">
                      <Badge
                        variant={statusConfig[invitation.status].variant}
                        className={`px-4 py-2 text-sm ${
                          invitation.status === "accepted"
                            ? "bg-green-100 text-green-700 border-green-200"
                            : invitation.status === "pending"
                              ? "bg-orange-100 text-orange-700 border-orange-200"
                              : invitation.status === "declined"
                                ? "bg-red-100 text-red-700 border-red-200"
                                : "bg-gray-100 text-gray-700 border-gray-200"
                        }`}
                      >
                        {statusConfig[invitation.status].label}
                      </Badge>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-2">
                      {invitation.status === "pending" && (
                        <>
                          <Button
                            className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                            onClick={() => handleAccept(invitation.id)}
                            disabled={spotsLeft <= 0}
                            asChild
                          >
                            <Link href={`/student/invitations/${invitation.id}`}>
                              <Gift className="mr-2 h-4 w-4" />
                              Open Details
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            className="bg-white/80 hover:bg-red-50 hover:border-red-200 hover:text-red-700"
                            onClick={() => handleDecline(invitation.id)}
                          >
                            Decline
                          </Button>
                        </>
                      )}
                      {invitation.status === "accepted" && (
                        <Button className="w-full bg-blue-600 hover:bg-blue-700" asChild>
                          <Link href={`/student/classes/${invitation.courseId}`}>
                            <Award className="mr-2 h-4 w-4" />
                            View Course Details
                          </Link>
                        </Button>
                      )}
                      {(invitation.status === "declined" || invitation.status === "expired") && (
                        <Button variant="outline" className="w-full bg-transparent" disabled>
                          {invitation.status === "declined" ? "Invitation Declined" : "Invitation Expired"}
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {filteredInvitations.length === 0 && (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <div className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center">
                  <Gift className="h-8 w-8 text-gray-400" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">No invitations found</h3>
                  <p className="text-gray-600 mt-1">
                    {searchQuery || statusFilter !== "all"
                      ? "Try adjusting your search or filter criteria"
                      : "You don't have any course invitations at the moment"}
                  </p>
                </div>
                {!searchQuery && statusFilter === "all" && (
                  <Button className="mt-4" asChild>
                    <Link href="https://sbd.school/courses" target="_blank" rel="noopener noreferrer">
                      Browse Available Courses
                      <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Call to Action */}
        <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-0 text-white shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center lg:text-left">
                <div className="flex items-center gap-2 justify-center lg:justify-start">
                  <Sparkles className="h-6 w-6 text-yellow-300" />
                  <h3 className="text-2xl font-bold">Need Help Choosing?</h3>
                </div>
                <p className="text-indigo-100 text-lg">
                  Our expert advisors can help you select the perfect courses for your career goals
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100" asChild>
                  <Link href="https://sbd.school/courses" target="_blank" rel="noopener noreferrer">
                    Browse All Courses
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent"
                  asChild
                >
                  <Link href="tel:03308050624">
                    <Phone className="mr-2 h-4 w-4" />
                    Get Expert Advice
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
