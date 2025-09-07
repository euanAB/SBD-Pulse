"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const OFFERS = [
  { id: "P-2001", course: "CPR Essentials", when: "2025-08-22", status: "Pending" },
  { id: "P-2002", course: "Manual Handling", when: "2025-08-28", status: "Accepted & Signed" },
]

export default function EducatorOffersPage() {
  return (
    <div className="space-y-4">
      <div className="flex items-center">
        <h1 className="text-xl font-semibold">Class Offers</h1>
      </div>
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
        {OFFERS.map((o) => (
          <Card key={o.id}>
            <CardHeader>
              <CardTitle className="text-base">{o.course}</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between">
              <div className="text-sm text-muted-foreground">{o.when}</div>
              <Badge variant={o.status === "Accepted & Signed" ? "default" : "secondary"}>{o.status}</Badge>
            </CardContent>
            <div className="p-3 pt-0">
              <Button asChild variant="secondary" size="sm" className="w-full">
                <Link href={`/educator/offers/${o.id}`}>View Offer</Link>
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  )
}
