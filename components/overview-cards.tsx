"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Layers3, Users, CircleDollarSign, ClipboardList } from "lucide-react"

export function OverviewCards() {
  const items = [
    { title: "Active Classes", value: 18, delta: "+2", icon: Layers3 },
    { title: "Pending Payments", value: 7, delta: "-3", icon: CircleDollarSign },
    { title: "Student Enrollments", value: 124, delta: "+12", icon: Users },
    { title: "Educator Proposals", value: 5, delta: "+1", icon: ClipboardList },
  ]
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {items.map((i) => (
        <Card key={i.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{i.title}</CardTitle>
            <i.icon className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{i.value}</div>
            <Badge variant={i.delta.startsWith("+") ? "default" : "secondary"} className="mt-1">
              {i.delta} this week
            </Badge>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
