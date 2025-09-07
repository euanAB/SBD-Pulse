"use client"

import * as React from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, PoundSterling, FileText } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

export default function EducatorOfferDetailPage({ params }: { params: { id: string } }) {
  const sp = useSearchParams()
  const router = useRouter()
  const { toast } = useToast()
  const courseId = sp.get("course") || "CRS-002"
  const educatorId = sp.get("educator") || "E-001"

  const [status, setStatus] = React.useState<"pending" | "accepted" | "declined">("pending")
  const [signature, setSignature] = React.useState("")
  const [agree, setAgree] = React.useState(false)

  function accept() {
    if (!signature.trim() || !agree) return
    setStatus("accepted")
    toast({ title: "Offer accepted & signed" })
  }
  function decline() {
    setStatus("declined")
    toast({ title: "Offer declined" })
  }

  const disabled = status !== "pending"

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Offer {params.id}</h1>
        <Badge variant={status === "accepted" ? "default" : status === "pending" ? "secondary" : "outline"}>
          {status === "accepted" ? "Accepted & Signed" : status === "pending" ? "Pending" : "Declined"}
        </Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Offer Letter</CardTitle>
          <CardDescription>Review the course details and sign to accept.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="rounded border">
            <div className="grid gap-3 p-3 text-sm sm:grid-cols-2">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">{courseId === "CRS-002" ? "CPR Essentials" : "Course"}</div>
                  <div className="text-muted-foreground">{courseId}</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Aug 22, 09:00 – 16:00</div>
                  <div className="text-muted-foreground">1 session</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Training Room A</div>
                  <div className="text-muted-foreground">Capacity 12</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <PoundSterling className="h-4 w-4 text-muted-foreground" />
                <div>
                  <div className="font-medium">Rate £600</div>
                  <div className="text-muted-foreground">Inclusive of prep/materials</div>
                </div>
              </div>
            </div>
          </div>

          {status === "pending" ? (
            <>
              <div className="space-y-2">
                <Label htmlFor="comments">Comments (optional)</Label>
                <Textarea id="comments" placeholder="Ask for modifications if needed..." />
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="sig">Digital Signature (type your full name)</Label>
                  <Input
                    id="sig"
                    placeholder="Your full name"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                  />
                  <p className="text-xs text-muted-foreground">Acts as a digital signature.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="agree">Agreement</Label>
                  <div className="flex items-center gap-2 rounded border p-2">
                    <input
                      id="agree"
                      type="checkbox"
                      checked={agree}
                      onChange={(e) => setAgree(e.target.checked)}
                      aria-label="I agree to the terms and conditions"
                    />
                    <span className="text-sm">I agree to the terms and conditions of this offer.</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button onClick={accept} disabled={!signature.trim() || !agree}>
                  Accept & Sign
                </Button>
                <Button variant="outline" onClick={decline}>
                  Decline
                </Button>
              </div>
            </>
          ) : status === "accepted" ? (
            <Alert>
              <AlertTitle>Signed</AlertTitle>
              <AlertDescription>
                Thank you. The admin will enroll students and you will see the roster in your classes shortly.
              </AlertDescription>
            </Alert>
          ) : (
            <Alert>
              <AlertTitle>Declined</AlertTitle>
              <AlertDescription>We have notified the admin of your decision.</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => router.push("/educator/classes")}>
          Go to My Classes
        </Button>
      </div>
    </div>
  )
}
