"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

type Student = {
  id: string
  name: string
  email: string
  invited?: boolean
  enrolled?: boolean
}

const STUDENTS: Student[] = Array.from({ length: 50 }).map((_, i) => ({
  id: `S${1000 + i}`,
  name: ["Jane Doe", "John Smith", "Amina Khan", "Liu Zhang", "Carlos Garcia", "Maya Patel", "Noah Evans"][i % 7],
  email: `student${i}@example.com`,
}))

export default function ClassEnrollPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { toast } = useToast()
  const [q, setQ] = React.useState("")
  const [selected, setSelected] = React.useState<Set<string>>(new Set())
  const [invited, setInvited] = React.useState<Set<string>>(new Set())
  const [enrolled, setEnrolled] = React.useState<Set<string>>(new Set())

  const filtered = React.useMemo(
    () => STUDENTS.filter((s) => !q || `${s.name} ${s.email} ${s.id}`.toLowerCase().includes(q.toLowerCase())),
    [q],
  )

  function toggle(id: string) {
    setSelected((prev) => {
      const ns = new Set(prev)
      if (ns.has(id)) ns.delete(id)
      else ns.add(id)
      return ns
    })
  }

  function sendInvites() {
    if (selected.size === 0) return
    setInvited((prev) => {
      const ns = new Set(prev)
      selected.forEach((id) => ns.add(id))
      return ns
    })
    toast({ title: "Invitations sent", description: `${selected.size} student(s)` })
    setSelected(new Set())
  }

  function markEnrolled(id: string) {
    setEnrolled((prev) => {
      const ns = new Set(prev)
      ns.add(id)
      return ns
    })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-semibold">Assign Students • {params.id}</h1>
        <Badge variant="secondary">Enrollment Stage</Badge>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student Selection</CardTitle>
          <CardDescription>Filter and select students to invite or enroll.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or ID…"
              className="pl-8"
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>
          <div className="overflow-hidden rounded border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[44px]"></TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((s) => {
                  const inv = invited.has(s.id)
                  const enr = enrolled.has(s.id)
                  return (
                    <TableRow key={s.id}>
                      <TableCell>
                        <input
                          type="checkbox"
                          aria-label={`Select ${s.name}`}
                          checked={selected.has(s.id)}
                          onChange={() => toggle(s.id)}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{s.name}</TableCell>
                      <TableCell className="text-muted-foreground">{s.email}</TableCell>
                      <TableCell>
                        {enr ? (
                          <Badge variant="default">Enrolled</Badge>
                        ) : inv ? (
                          <Badge variant="secondary">Invited</Badge>
                        ) : (
                          <Badge variant="outline">Not Invited</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        {!inv && !enr && (
                          <Button size="sm" variant="outline" onClick={() => setInvited((p) => new Set(p).add(s.id))}>
                            Invite
                          </Button>
                        )}
                        {inv && !enr && (
                          <Button size="sm" variant="secondary" onClick={() => markEnrolled(s.id)}>
                            Mark Enrolled
                          </Button>
                        )}
                        {enr && <span className="text-xs text-muted-foreground">—</span>}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>

          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">{selected.size} selected</div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => setSelected(new Set())}>
                Clear selection
              </Button>
              <Button onClick={sendInvites} disabled={selected.size === 0}>
                Send Invites
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.push(`/admin/classes/${params.id}`)}>
          Back to Class
        </Button>
        <Button
          onClick={() => {
            toast({ title: "Enrollment complete", description: "Educator roster updated" })
            router.push(`/educator/classes/${params.id}`)
          }}
        >
          Continue to Educator View
        </Button>
      </div>
    </div>
  )
}
