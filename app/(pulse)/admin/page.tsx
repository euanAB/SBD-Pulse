"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { OverviewCards } from "@/components/overview-cards"
import { ActivityFeed } from "@/components/activity-feed"
import { FinancialSummary } from "@/components/financial-summary"
import { Plus, Send, UserPlus } from "lucide-react"
import Link from "next/link"

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <h1 className="text-xl font-semibold md:text-2xl">Admin Dashboard</h1>
        <div className="ml-auto flex flex-wrap gap-2">
          <Button asChild variant="default">
            <Link href="/admin/courses/new">
              <Plus className="mr-2 h-4 w-4" />
              Create Course
            </Link>
          </Button>
          <Button variant="secondary" asChild>
            <Link href="/admin/proposals">
              <Send className="mr-2 h-4 w-4" />
              Propose Class
            </Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/admin/students/new">
              <UserPlus className="mr-2 h-4 w-4" />
              Invite Student
            </Link>
          </Button>
        </div>
      </div>

      <OverviewCards />

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <ActivityFeed />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Financial Summary (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <FinancialSummary />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
