"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import Link from "next/link"

const COURSES = [
  { id: "CRS-001", title: "First Aid Level 1" },
  { id: "CRS-002", title: "CPR Essentials" },
  { id: "CRS-003", title: "Safeguarding Basics" },
  { id: "CRS-004", title: "Manual Handling" },
]

export default function InviteStudentPage() {
  const router = useRouter()
  const { toast } = useToast()

  const [firstName, setFirstName] = React.useState("")
  const [lastName, setLastName] = React.useState("")
  const [email, setEmail] = React.useState("")
  const [addressLine, setAddressLine] = React.useState("")
  const [city, setCity] = React.useState("")
  const [postcode, setPostcode] = React.useState("")
  const [course, setCourse] = React.useState<string>("")
  const [note, setNote] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)

  const canSubmit =
    firstName.trim() &&
    lastName.trim() &&
    email.trim() &&
    addressLine.trim() &&
    city.trim() &&
    postcode.trim() &&
    course

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    setIsSubmitting(true)

    // Simulate async invite creation
    setTimeout(() => {
      setIsSubmitting(false)
      const selected = COURSES.find((c) => c.id === course)
      toast({
        title: "Invitation sent",
        description: `Sent to ${firstName} ${lastName} (${email}) for ${selected?.title}.`,
      })
      router.push("/admin/students")
    }, 800)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <Button asChild variant="outline" size="sm">
          <Link href="/admin/students">Back</Link>
        </Button>
        <h1 className="text-xl font-semibold">Invite a Student</h1>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Invite a Student</CardTitle>
          <CardDescription>
            Fill in the student details and select an interested course to send more info.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="firstName">First name</Label>
              <Input
                id="firstName"
                placeholder="Jane"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                autoComplete="given-name"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                autoComplete="family-name"
                required
              />
            </div>
            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="student@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="addressLine">Address</Label>
              <Input
                id="addressLine"
                placeholder="Start typing address (autocomplete coming soon)…"
                value={addressLine}
                onChange={(e) => setAddressLine(e.target.value)}
                autoComplete="address-line1"
                required
              />
              <div className="grid grid-cols-2 gap-2 mt-2">
                <Input
                  placeholder="City"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  autoComplete="address-level2"
                  required
                />
                <Input
                  placeholder="Postcode"
                  value={postcode}
                  onChange={(e) => setPostcode(e.target.value)}
                  autoComplete="postal-code"
                  required
                />
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Address autocomplete and validation will be powered by GetAddress.io.
              </p>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label>Interested Course</Label>
              <Select value={course} onValueChange={setCourse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a course" />
                </SelectTrigger>
                <SelectContent>
                  {COURSES.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title} ({c.id})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="note">Message (optional)</Label>
              <Textarea
                id="note"
                placeholder="Add an optional message to include in the invitation..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={4}
              />
            </div>

            <div className="sm:col-span-2 flex items-center justify-end gap-2">
              <Button type="button" variant="outline" asChild>
                <Link href="/admin/students">Cancel</Link>
              </Button>
              <Button type="submit" disabled={!canSubmit || isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Invite"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
