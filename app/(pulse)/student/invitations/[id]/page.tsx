"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import {
  Calendar,
  Clock,
  PoundSterling,
  MapPin,
  User,
  Users,
  CheckCircle,
  AlertTriangle,
  Star,
  Award,
  Target,
  BookOpen,
  FileText,
  Phone,
  Mail,
  ArrowLeft,
  CreditCard,
  Shield,
  Timer,
  Gift,
  Zap,
} from "lucide-react"
import Link from "next/link"

interface InvitationDetails {
  id: string
  courseTitle: string
  courseId: string
  description: string
  longDescription: string
  date: string
  time: string
  duration: string
  location: {
    name: string
    address: string
    facilities: string[]
    parking: boolean
    accessibility: boolean
  }
  instructor: {
    name: string
    email: string
    phone: string
    bio: string
    qualifications: string[]
    experience: string
  }
  pricing: {
    price: number
    originalPrice?: number
    discount?: number
    earlyBirdSaving?: number
    includes: string[]
  }
  capacity: {
    total: number
    enrolled: number
    waitlist: number
  }
  schedule: {
    sessions: Array<{
      title: string
      date: string
      time: string
      topics: string[]
    }>
  }
  requirements: string[]
  benefits: string[]
  certification: {
    name: string
    validity: string
    accreditation: string
    recognition: string[]
  }
  expiryDate: string
  status: "pending" | "accepted" | "declined" | "expired"
  priority: "high" | "medium" | "low"
  tags: string[]
}

export default function InvitationDetailPage({ params }: { params: { id: string } }) {
  const [step, setStep] = React.useState(1) // 1: Details, 2: Confirmation, 3: Payment
  const [termsAccepted, setTermsAccepted] = React.useState(false)
  const [marketingConsent, setMarketingConsent] = React.useState(false)

  // Mock data - would be fetched based on params.id
  const invitation: InvitationDetails = {
    id: params.id,
    courseTitle: "CPR Essentials",
    courseId: "CRS-002",
    description:
      "Master life-saving CPR techniques for adults, children, and infants. Includes hands-on AED training and emergency response protocols.",
    longDescription:
      "This comprehensive CPR Essentials course is designed to equip you with the critical skills needed to respond effectively in emergency situations. You'll learn proper chest compression techniques, rescue breathing methods, and how to use an Automated External Defibrillator (AED). Our expert instructors will guide you through realistic scenarios, ensuring you feel confident and prepared to act when it matters most. This course meets all current guidelines and provides certification that's recognized by employers nationwide.",
    date: "2025-02-01",
    time: "09:00 - 16:00",
    duration: "7 hours",
    location: {
      name: "Manchester Training Centre",
      address: "123 Training Street, Manchester, M1 2AB",
      facilities: ["Practical Training Room", "AV Equipment", "First Aid Mannequins", "Refreshment Area"],
      parking: true,
      accessibility: true,
    },
    instructor: {
      name: "Sarah Johnson",
      email: "sarah.johnson@pulseacademy.com",
      phone: "+44 7123 456 789",
      bio: "Sarah is a qualified paramedic with over 15 years of experience in emergency medical services. She has trained over 2,000 students and specializes in making complex medical procedures accessible to everyone.",
      qualifications: ["Paramedic Certification", "First Aid Instructor", "CPR Instructor", "AED Trainer"],
      experience: "15+ years in emergency medical services",
    },
    pricing: {
      price: 120,
      originalPrice: 150,
      discount: 20,
      earlyBirdSaving: 30,
      includes: [
        "Full day training session",
        "Course materials and manual",
        "Practical assessment",
        "Official certification",
        "Light refreshments",
        "3-year certificate validity",
      ],
    },
    capacity: {
      total: 15,
      enrolled: 8,
      waitlist: 2,
    },
    schedule: {
      sessions: [
        {
          title: "Introduction & Theory",
          date: "2025-02-01",
          time: "09:00 - 10:30",
          topics: ["Emergency response principles", "Legal considerations", "Chain of survival"],
        },
        {
          title: "Adult CPR Techniques",
          date: "2025-02-01",
          time: "10:45 - 12:00",
          topics: ["Chest compressions", "Rescue breathing", "Recovery position"],
        },
        {
          title: "Child & Infant CPR",
          date: "2025-02-01",
          time: "13:00 - 14:30",
          topics: ["Age-specific techniques", "Choking response", "Special considerations"],
        },
        {
          title: "AED Training & Assessment",
          date: "2025-02-01",
          time: "14:45 - 16:00",
          topics: ["AED operation", "Practical scenarios", "Final assessment"],
        },
      ],
    },
    requirements: [
      "No prior experience required",
      "Comfortable clothing recommended",
      "Participants must be 16+ years old",
      "Basic English comprehension required",
    ],
    benefits: [
      "Nationally recognized certification",
      "3-year validity period",
      "Workplace compliance",
      "Emergency preparedness",
      "Confidence in crisis situations",
      "Career advancement opportunities",
    ],
    certification: {
      name: "CPR Essentials Certificate",
      validity: "3 years",
      accreditation: "Resuscitation Council (UK)",
      recognition: ["NHS Trusts", "Care Homes", "Schools", "Corporate Employers"],
    },
    expiryDate: "2025-01-25",
    status: "pending",
    priority: "high",
    tags: ["Popular", "Early Bird", "Limited Spots"],
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  }

  const formatTime = (timeStr: string) => {
    return timeStr
  }

  const getExpiryInfo = () => {
    const expiry = new Date(invitation.expiryDate)
    const today = new Date()
    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry <= 0) return { text: "Expired", urgent: true, color: "text-red-600" }
    if (daysUntilExpiry <= 1) return { text: "Expires today!", urgent: true, color: "text-red-600" }
    if (daysUntilExpiry <= 3) return { text: `${daysUntilExpiry} days left`, urgent: true, color: "text-orange-600" }
    return { text: `${daysUntilExpiry} days left`, urgent: false, color: "text-yellow-600" }
  }

  const spotsLeft = invitation.capacity.total - invitation.capacity.enrolled
  const expiryInfo = getExpiryInfo()

  const handleAccept = () => {
    if (step === 1) {
      setStep(2)
    } else if (step === 2 && termsAccepted) {
      setStep(3)
    }
  }

  const handlePayment = () => {
    // Payment processing would happen here
    console.log("Processing payment...")
    // Redirect to success page or back to invitations
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 p-6">
      <div className="mx-auto max-w-4xl space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="sm" asChild>
            <Link href="/student/invitations">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Invitations
            </Link>
          </Button>
          <div className="flex-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-orange-100 to-amber-100 text-orange-700 rounded-full text-sm font-medium">
              <Gift className="h-4 w-4" />
              Course Invitation
            </div>
          </div>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center gap-4">
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 1 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              1
            </div>
            <span className={`text-sm ${step >= 1 ? "text-blue-600 font-medium" : "text-gray-500"}`}>
              Course Details
            </span>
          </div>
          <div className={`w-12 h-0.5 ${step >= 2 ? "bg-blue-600" : "bg-gray-200"}`} />
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 2 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              2
            </div>
            <span className={`text-sm ${step >= 2 ? "text-blue-600 font-medium" : "text-gray-500"}`}>Confirmation</span>
          </div>
          <div className={`w-12 h-0.5 ${step >= 3 ? "bg-blue-600" : "bg-gray-200"}`} />
          <div className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                step >= 3 ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-600"
              }`}
            >
              3
            </div>
            <span className={`text-sm ${step >= 3 ? "text-blue-600 font-medium" : "text-gray-500"}`}>Payment</span>
          </div>
        </div>

        {step === 1 && (
          <div className="space-y-8">
            {/* Course Header */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl overflow-hidden">
              <div className="relative">
                {/* Priority Banner */}
                {invitation.priority === "high" && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-orange-500 to-red-500 text-white px-4 py-2 text-sm font-bold rounded-bl-lg">
                    <Zap className="h-4 w-4 inline mr-1" />
                    HIGH PRIORITY
                  </div>
                )}

                {/* Tags */}
                <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                  {invitation.tags.includes("Popular") && (
                    <Badge className="bg-blue-500 text-white border-0">
                      <Star className="h-3 w-3 mr-1" />
                      Popular
                    </Badge>
                  )}
                  {invitation.tags.includes("Early Bird") && (
                    <Badge className="bg-green-500 text-white border-0">
                      <Timer className="h-3 w-3 mr-1" />
                      Early Bird
                    </Badge>
                  )}
                  {invitation.tags.includes("Limited Spots") && spotsLeft <= 5 && (
                    <Badge className="bg-red-500 text-white border-0">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      {spotsLeft} spots left
                    </Badge>
                  )}
                </div>

                <CardHeader className="pt-16 pb-6">
                  <CardTitle className="text-3xl font-bold text-gray-900 mb-3">{invitation.courseTitle}</CardTitle>
                  <p className="text-xl text-gray-600 leading-relaxed">{invitation.description}</p>
                </CardHeader>
              </div>
            </Card>

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
                  className={`h-5 w-5 ${
                    expiryInfo.urgent
                      ? "text-red-600"
                      : expiryInfo.color.includes("orange")
                        ? "text-orange-600"
                        : "text-yellow-600"
                  }`}
                />
                <AlertDescription
                  className={`font-semibold text-lg ${
                    expiryInfo.urgent
                      ? "text-red-800"
                      : expiryInfo.color.includes("orange")
                        ? "text-orange-800"
                        : "text-yellow-800"
                  }`}
                >
                  {expiryInfo.urgent ? "⚡ URGENT: " : "⏰ "}
                  {expiryInfo.text} - Don't miss this opportunity!
                </AlertDescription>
              </Alert>
            )}

            {/* Pricing Card */}
            <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-800">
                  <PoundSterling className="h-6 w-6" />
                  Special Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl font-bold text-green-700">£{invitation.pricing.price}</div>
                    {invitation.pricing.originalPrice && (
                      <div className="space-y-1">
                        <div className="text-2xl text-gray-500 line-through">£{invitation.pricing.originalPrice}</div>
                        <div className="text-sm text-green-600 font-medium">
                          Save £{invitation.pricing.originalPrice - invitation.pricing.price}
                        </div>
                      </div>
                    )}
                  </div>
                  {invitation.pricing.discount && (
                    <div className="bg-red-500 text-white px-4 py-2 rounded-full text-lg font-bold">
                      -{invitation.pricing.discount}% OFF
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold text-green-800">What's Included:</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {invitation.pricing.includes.map((item, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-green-700">
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Course Details Grid */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Schedule */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    Course Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <Calendar className="h-5 w-5 text-blue-600" />
                      <div>
                        <div className="font-semibold text-gray-900">{formatDate(invitation.date)}</div>
                        <div className="text-sm text-gray-600">{formatTime(invitation.time)}</div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-purple-50 rounded-lg">
                      <Clock className="h-5 w-5 text-purple-600" />
                      <div>
                        <div className="font-semibold text-gray-900">{invitation.duration}</div>
                        <div className="text-sm text-gray-600">Total duration</div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900">Session Breakdown:</h4>
                    {invitation.schedule.sessions.map((session, index) => (
                      <div key={index} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <h5 className="font-medium text-gray-900">{session.title}</h5>
                          <span className="text-sm text-gray-600">{session.time}</span>
                        </div>
                        <div className="text-sm text-gray-600">
                          {session.topics.map((topic, topicIndex) => (
                            <span key={topicIndex}>
                              {topic}
                              {topicIndex < session.topics.length - 1 && " • "}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Location & Instructor */}
              <div className="space-y-6">
                {/* Location */}
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-green-600" />
                      Training Location
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-900">{invitation.location.name}</h4>
                      <p className="text-gray-600">{invitation.location.address}</p>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900">Facilities:</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {invitation.location.facilities.map((facility, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <CheckCircle className="h-3 w-3 text-green-500" />
                            {facility}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-4 text-sm">
                      {invitation.location.parking && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Parking Available
                        </div>
                      )}
                      {invitation.location.accessibility && (
                        <div className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-4 w-4" />
                          Wheelchair Accessible
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Instructor */}
                <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="h-5 w-5 text-orange-600" />
                      Your Instructor
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 bg-gradient-to-br from-orange-100 to-red-100 rounded-full flex items-center justify-center">
                        <User className="h-8 w-8 text-orange-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{invitation.instructor.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">{invitation.instructor.experience}</p>
                        <p className="text-sm text-gray-700 leading-relaxed">{invitation.instructor.bio}</p>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <h5 className="font-medium text-gray-900">Qualifications:</h5>
                      <div className="grid grid-cols-2 gap-2">
                        {invitation.instructor.qualifications.map((qual, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm text-gray-600">
                            <Award className="h-3 w-3 text-yellow-500" />
                            {qual}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                        <Link href={`mailto:${invitation.instructor.email}`}>
                          <Mail className="mr-2 h-4 w-4" />
                          Email
                        </Link>
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                        <Link href={`tel:${invitation.instructor.phone}`}>
                          <Phone className="mr-2 h-4 w-4" />
                          Call
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Benefits & Certification */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    What You'll Achieve
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Course Benefits:</h4>
                    <div className="grid gap-2">
                      {invitation.benefits.map((benefit, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-700">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          {benefit}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Award className="h-5 w-5 text-yellow-600" />
                      Certification Details
                    </h4>
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-2">
                      <div className="font-medium text-yellow-800">{invitation.certification.name}</div>
                      <div className="text-sm text-yellow-700">
                        Valid for {invitation.certification.validity} • Accredited by{" "}
                        {invitation.certification.accreditation}
                      </div>
                      <div className="text-sm text-yellow-700">
                        <strong>Recognized by:</strong> {invitation.certification.recognition.join(", ")}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Requirements & Capacity */}
              <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Course Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-gray-900">Requirements:</h4>
                    <div className="space-y-1">
                      {invitation.requirements.map((req, index) => (
                        <div key={index} className="flex items-start gap-2 text-sm text-gray-700">
                          <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                          {req}
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <h4 className="font-semibold text-gray-900 flex items-center gap-2">
                      <Users className="h-5 w-5 text-green-600" />
                      Class Capacity
                    </h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Enrolled Students</span>
                        <span className="font-medium">
                          {invitation.capacity.enrolled}/{invitation.capacity.total}
                        </span>
                      </div>
                      <Progress
                        value={(invitation.capacity.enrolled / invitation.capacity.total) * 100}
                        className="h-2"
                      />
                      <div className="text-sm text-gray-600">
                        {spotsLeft > 0 ? (
                          <span className="text-green-600 font-medium">{spotsLeft} spots available</span>
                        ) : (
                          <span className="text-red-600 font-medium">Class is full</span>
                        )}
                        {invitation.capacity.waitlist > 0 && (
                          <span className="text-orange-600"> • {invitation.capacity.waitlist} on waitlist</span>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-6">
              <Button
                size="lg"
                className="px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-semibold"
                onClick={handleAccept}
                disabled={spotsLeft <= 0}
              >
                <Gift className="mr-2 h-5 w-5" />
                Accept Invitation
              </Button>
              <Button size="lg" variant="outline" className="px-8 bg-transparent" asChild>
                <Link href="/student/invitations">Decide Later</Link>
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-8">
            {/* Confirmation Header */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Confirm Your Enrollment</CardTitle>
                <p className="text-gray-600">Review your course details before proceeding to payment</p>
              </CardHeader>
            </Card>

            {/* Course Summary */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Course Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">{invitation.courseTitle}</h4>
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        {formatDate(invitation.date)}
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4" />
                        {invitation.time} ({invitation.duration})
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {invitation.location.name}
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        {invitation.instructor.name}
                      </div>
                    </div>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-700">£{invitation.pricing.price}</div>
                      {invitation.pricing.originalPrice && (
                        <div className="text-sm text-gray-500 line-through">£{invitation.pricing.originalPrice}</div>
                      )}
                      <div className="text-sm text-green-600 font-medium mt-1">
                        You save £{invitation.pricing.originalPrice! - invitation.pricing.price}
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-purple-600" />
                  Terms & Conditions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="terms"
                      checked={termsAccepted}
                      onCheckedChange={(checked) => setTermsAccepted(checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="terms" className="text-sm leading-relaxed text-gray-700">
                      I agree to the{" "}
                      <Link href="#" className="text-blue-600 hover:underline font-medium">
                        Terms of Service
                      </Link>
                      ,{" "}
                      <Link href="#" className="text-blue-600 hover:underline font-medium">
                        Privacy Policy
                      </Link>
                      , and{" "}
                      <Link href="#" className="text-blue-600 hover:underline font-medium">
                        Cancellation Policy
                      </Link>
                      . I understand that payment is required to secure my place in this course. *
                    </label>
                  </div>

                  <div className="flex items-start space-x-3">
                    <Checkbox
                      id="marketing"
                      checked={marketingConsent}
                      onCheckedChange={(checked) => setMarketingConsent(checked as boolean)}
                      className="mt-1"
                    />
                    <label htmlFor="marketing" className="text-sm leading-relaxed text-gray-700">
                      I would like to receive updates about new courses, special offers, and training opportunities via
                      email and SMS. You can unsubscribe at any time.
                    </label>
                  </div>
                </div>

                <Alert className="bg-blue-50 border-blue-200">
                  <Shield className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Secure Payment:</strong> Your payment information is encrypted and processed securely. We
                    never store your card details.
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-6">
              <Button size="lg" variant="outline" className="px-8 bg-transparent" onClick={() => setStep(1)}>
                Back to Details
              </Button>
              <Button
                size="lg"
                className="px-8 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                onClick={handleAccept}
                disabled={!termsAccepted}
              >
                <CreditCard className="mr-2 h-5 w-5" />
                Proceed to Payment
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-8">
            {/* Payment Header */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-xl">
              <CardHeader className="text-center">
                <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                  <CreditCard className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-2xl font-bold text-gray-900">Secure Payment</CardTitle>
                <p className="text-gray-600">Complete your enrollment with secure payment processing</p>
              </CardHeader>
            </Card>

            {/* Payment Summary */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Payment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Course Fee</span>
                    <span>£{invitation.pricing.originalPrice || invitation.pricing.price}</span>
                  </div>
                  {invitation.pricing.discount && (
                    <div className="flex justify-between text-green-600">
                      <span>Early Bird Discount ({invitation.pricing.discount}%)</span>
                      <span>-£{invitation.pricing.originalPrice! - invitation.pricing.price}</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total Amount</span>
                    <span>£{invitation.pricing.price}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Form Placeholder */}
            <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle>Payment Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="bg-blue-50 border-blue-200">
                  <CreditCard className="h-4 w-4 text-blue-600" />
                  <AlertDescription className="text-blue-800">
                    <strong>Payment Integration Placeholder</strong>
                    <br />
                    Stripe payment form would be integrated here with secure card processing, Apple Pay, Google Pay, and
                    other payment methods.
                  </AlertDescription>
                </Alert>

                <div className="text-center space-y-4">
                  <div className="text-lg font-semibold text-gray-900">Payment Amount: £{invitation.pricing.price}</div>
                  <Button
                    size="lg"
                    className="px-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    onClick={handlePayment}
                  >
                    <Shield className="mr-2 h-5 w-5" />
                    Complete Secure Payment
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Security Notice */}
            <Card className="bg-gray-50 border-gray-200">
              <CardContent className="p-4">
                <div className="flex items-center justify-center gap-4 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Shield className="h-4 w-4" />
                    <span>SSL Encrypted</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    <span>PCI Compliant</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    <span>Secure Processing</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Back Button */}
            <div className="flex justify-center">
              <Button variant="outline" onClick={() => setStep(2)}>
                Back to Confirmation
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
