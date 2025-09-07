"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  BookOpen,
  Calendar,
  Clock,
  PoundSterling,
  ExternalLink,
  AlertTriangle,
  CheckCircle,
  User,
  CreditCard,
  GraduationCap,
  Phone,
  MapPin,
  Star,
  Gift,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export default function StudentDashboardPage() {
  const [profileComplete, setProfileComplete] = React.useState(65)
  const studentName = "Euan" // This would come from auth/user context

  const upcomingClasses = [
    {
      id: "CLS-2025-001",
      title: "First Aid Level 2",
      date: "2025-01-15",
      time: "09:00 - 16:00",
      location: "Training Room A, Manchester",
      instructor: "Sarah Johnson",
      status: "confirmed",
      daysUntil: 3,
    },
    {
      id: "CLS-2025-002",
      title: "Safeguarding Basics",
      date: "2025-01-25",
      time: "10:00 - 15:00",
      location: "Training Room B, Liverpool",
      instructor: "Mike Thompson",
      status: "confirmed",
      daysUntil: 13,
    },
  ]

  const courseInvitations = [
    {
      id: "INV-001",
      courseTitle: "CPR Essentials",
      date: "2025-02-01",
      time: "09:00 - 16:00",
      location: "Manchester Training Centre",
      price: 120,
      originalPrice: 150,
      expiresIn: 5,
      discount: 20,
      priority: "high",
    },
    {
      id: "INV-002",
      courseTitle: "Manual Handling",
      date: "2025-02-08",
      time: "10:00 - 14:00",
      location: "Liverpool Training Centre",
      price: 95,
      expiresIn: 12,
      priority: "medium",
    },
  ]

  const myCourses = [
    {
      id: "CRS-001",
      title: "First Aid Level 1",
      progress: 100,
      grade: "Pass",
      completedDate: "2024-12-15",
      certificate: true,
    },
    {
      id: "CRS-002",
      title: "Manual Handling",
      progress: 65,
      nextSession: "2025-01-20",
      currentModule: "Lifting Techniques",
    },
    {
      id: "CRS-003",
      title: "Safeguarding Basics",
      progress: 0,
      startDate: "2025-01-25",
    },
  ]

  const recentInvoices = [
    {
      id: "INV-2025-001",
      courseTitle: "First Aid Level 2",
      amount: 150,
      status: "paid",
      date: "2025-01-10",
    },
    {
      id: "INV-2025-002",
      courseTitle: "Safeguarding Basics",
      amount: 120,
      status: "pending",
      dueDate: "2025-01-20",
      daysUntilDue: 8,
    },
  ]

  const getTimeOfDayGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return "Good morning"
    if (hour < 17) return "Good afternoon"
    return "Good evening"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30">
      <div className="space-y-6 p-6">
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative">
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-6 w-6 text-yellow-300" />
              <h1 className="text-3xl font-bold tracking-tight">
                {getTimeOfDayGreeting()}, {studentName}!
              </h1>
            </div>
            <p className="text-blue-100 text-lg">Welcome back to your learning journey</p>
            <div className="mt-4 flex items-center gap-6 text-sm text-blue-100">
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-yellow-300" />
                <span>Learning Streak: 12 days</span>
              </div>
              <div className="flex items-center gap-2">
                <GraduationCap className="h-4 w-4 text-green-300" />
                <span>1 Certificate Earned</span>
              </div>
            </div>
          </div>
        </div>

        {profileComplete < 100 && (
          <Alert className="border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
            <User className="h-4 w-4 text-orange-600" />
            <AlertDescription className="flex items-center justify-between">
              <div>
                <div className="font-semibold text-orange-800">Complete your profile to unlock all features</div>
                <div className="text-sm text-orange-600 mt-1 flex items-center gap-2">
                  <Progress value={profileComplete} className="w-32 h-2" />
                  <span>{profileComplete}% complete</span>
                </div>
                <div className="text-sm text-orange-600 mt-1">
                  Add emergency contact and upload documents to access all course features
                </div>
              </div>
              <Button size="sm" className="bg-orange-600 hover:bg-orange-700" asChild>
                <Link href="/student/register">Complete Now</Link>
              </Button>
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-700">Active Courses</p>
                  <p className="text-3xl font-bold text-blue-900">2</p>
                  <p className="text-xs text-blue-600 mt-1">In progress</p>
                </div>
                <div className="p-3 bg-blue-600 rounded-full">
                  <BookOpen className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-700">Completed</p>
                  <p className="text-3xl font-bold text-green-900">1</p>
                  <p className="text-xs text-green-600 mt-1">Certificate earned</p>
                </div>
                <div className="p-3 bg-green-600 rounded-full">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-700">Invitations</p>
                  <p className="text-3xl font-bold text-orange-900">2</p>
                  <p className="text-xs text-orange-600 mt-1">Awaiting response</p>
                </div>
                <div className="p-3 bg-orange-600 rounded-full">
                  <Gift className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-red-50 to-red-100 border-red-200 hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-700">Outstanding</p>
                  <p className="text-3xl font-bold text-red-900">£120</p>
                  <p className="text-xs text-red-600 mt-1">Due in 8 days</p>
                </div>
                <div className="p-3 bg-red-600 rounded-full">
                  <CreditCard className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                Upcoming Classes
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
                asChild
              >
                <Link href="/student/courses">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {upcomingClasses.map((class_) => (
                <div
                  key={class_.id}
                  className="rounded-xl border border-gray-200 bg-white/80 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-2">
                      <div className="font-semibold text-gray-900">{class_.title}</div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(class_.date).toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {class_.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {class_.location}
                      </div>
                      <div className="text-sm text-gray-600">Instructor: {class_.instructor}</div>
                    </div>
                    <div className="text-right">
                      <Badge variant="secondary" className="bg-green-100 text-green-700 border-green-200">
                        Confirmed
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">{class_.daysUntil} days to go</div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                      <Link href={`/student/classes/${class_.id}`}>View Details</Link>
                    </Button>
                    <Button size="sm" variant="outline">
                      Add to Calendar
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Gift className="h-5 w-5 text-orange-600" />
                Course Invitations
                {courseInvitations.length > 0 && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-700 border-orange-200">
                    {courseInvitations.length}
                  </Badge>
                )}
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="border-orange-200 text-orange-600 hover:bg-orange-50 bg-transparent"
                asChild
              >
                <Link href="/student/invitations">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {courseInvitations.map((invitation) => (
                <div
                  key={invitation.id}
                  className={`rounded-xl border p-5 hover:shadow-md transition-all ${
                    invitation.priority === "high"
                      ? "border-orange-300 bg-gradient-to-r from-orange-50 to-amber-50"
                      : "border-gray-200 bg-white/80"
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="font-semibold text-gray-900">{invitation.courseTitle}</div>
                        {invitation.discount && (
                          <Badge className="bg-red-500 text-white text-xs">{invitation.discount}% OFF</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(invitation.date).toLocaleDateString("en-GB", {
                            weekday: "short",
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {invitation.time}
                        </span>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-gray-600">
                        <MapPin className="h-3 w-3" />
                        {invitation.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1">
                          <PoundSterling className="h-4 w-4 text-green-600" />
                          <span className="font-semibold text-green-600">£{invitation.price}</span>
                        </div>
                        {invitation.originalPrice && (
                          <span className="text-sm text-gray-500 line-through">£{invitation.originalPrice}</span>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div
                        className={`flex items-center gap-1 text-sm ${
                          invitation.expiresIn <= 5 ? "text-red-600" : "text-orange-600"
                        }`}
                      >
                        <AlertTriangle className="h-3 w-3" />
                        <span>{invitation.expiresIn} days left</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      asChild
                    >
                      <Link href={`/student/invitations/${invitation.id}`}>Open Details</Link>
                    </Button>
                    <Button size="sm" variant="outline">
                      Quick Accept
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="h-5 w-5 text-green-600" />
                My Learning Progress
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="border-green-200 text-green-600 hover:bg-green-50 bg-transparent"
                asChild
              >
                <Link href="/student/courses">View All</Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {myCourses.map((course) => (
                <div
                  key={course.id}
                  className="rounded-xl border border-gray-200 bg-white/80 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="font-semibold text-gray-900">{course.title}</div>
                      {course.certificate && (
                        <Badge className="bg-green-100 text-green-700 border-green-200">
                          <Star className="h-3 w-3 mr-1" />
                          Certified
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <Progress value={course.progress} className="flex-1 h-2" />
                      <span className="text-sm font-medium text-gray-600">{course.progress}%</span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {course.progress === 100 ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="h-3 w-3" />
                          Completed {new Date(course.completedDate!).toLocaleDateString("en-GB")} • Grade:{" "}
                          {course.grade}
                        </span>
                      ) : course.progress > 0 ? (
                        <div className="space-y-1">
                          <span>Current: {course.currentModule}</span>
                          <span className="block">
                            Next session: {new Date(course.nextSession!).toLocaleDateString("en-GB")}
                          </span>
                        </div>
                      ) : (
                        <span>Starts: {new Date(course.startDate!).toLocaleDateString("en-GB")}</span>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <Button size="sm" variant="outline" className="flex-1 bg-transparent" asChild>
                      <Link href={`/student/courses/${course.id}`}>
                        {course.progress === 100 ? "View Certificate" : "Continue Learning"}
                      </Link>
                    </Button>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="bg-white/70 backdrop-blur-sm border-0 shadow-lg">
            <CardHeader className="flex flex-row items-center justify-between pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                <PoundSterling className="h-5 w-5 text-blue-600" />
                Recent Invoices
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="border-blue-200 text-blue-600 hover:bg-blue-50 bg-transparent"
              >
                View All
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentInvoices.map((invoice) => (
                <div
                  key={invoice.id}
                  className="flex items-center justify-between rounded-xl border border-gray-200 bg-white/80 p-5 hover:shadow-md transition-shadow"
                >
                  <div className="space-y-1">
                    <div className="font-semibold text-gray-900">{invoice.courseTitle}</div>
                    <div className="text-sm text-gray-600">
                      {invoice.id} • {new Date(invoice.date).toLocaleDateString("en-GB")}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-semibold text-lg">£{invoice.amount}</div>
                    <div className="flex items-center gap-1">
                      {invoice.status === "paid" ? (
                        <>
                          <CheckCircle className="h-3 w-3 text-green-500" />
                          <span className="text-sm text-green-600 font-medium">Paid</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-3 w-3 text-orange-500" />
                          <span
                            className={`text-sm font-medium ${
                              invoice.daysUntilDue && invoice.daysUntilDue <= 7 ? "text-red-600" : "text-orange-600"
                            }`}
                          >
                            Due in {invoice.daysUntilDue} days
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <Card className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 border-0 text-white shadow-xl">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="space-y-3 text-center md:text-left">
                <h3 className="text-2xl font-bold">Explore More Courses</h3>
                <p className="text-indigo-100 text-lg">
                  Discover additional training opportunities to advance your skills and career
                </p>
                <div className="flex flex-col sm:flex-row gap-4 text-sm text-indigo-100">
                  <div className="flex items-center gap-2">
                    <ExternalLink className="h-4 w-4" />
                    <span>Browse all courses online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <span>Call for personalized advice</span>
                  </div>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button size="lg" className="bg-white text-indigo-600 hover:bg-gray-100" asChild>
                  <Link href="https://sbd.school/courses" target="_blank" rel="noopener noreferrer">
                    Browse Courses
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
                    Call Now
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
