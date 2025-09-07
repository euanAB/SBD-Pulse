"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import {
  BadgeCheck,
  CircleDollarSign,
  FileDown,
  FileText,
  BadgeIcon as IdCard,
  Search,
  UserPlus,
  X,
} from "lucide-react"

type ActivityType = "enrollment" | "payment" | "proposal" | "invoice" | "verification" | "document"

type ActivityItem = {
  id: string
  type: ActivityType
  title: string
  description: string
  at: string // ISO date
}

const TYPES: { value: ActivityType | "all"; label: string }[] = [
  { value: "all", label: "All types" },
  { value: "enrollment", label: "Enrollment" },
  { value: "payment", label: "Payment" },
  { value: "proposal", label: "Proposal" },
  { value: "invoice", label: "Invoice" },
  { value: "verification", label: "Verification" },
  { value: "document", label: "Document" },
]

const ICONS: Record<ActivityType, React.ReactNode> = {
  enrollment: <UserPlus className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />,
  payment: <CircleDollarSign className="h-4 w-4 text-orange-600 dark:text-orange-400" />,
  proposal: <FileText className="h-4 w-4 text-slate-600 dark:text-slate-300" />,
  invoice: <FileDown className="h-4 w-4 text-violet-600 dark:text-violet-400" />,
  verification: <BadgeCheck className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />,
  document: <IdCard className="h-4 w-4 text-rose-600 dark:text-rose-400" />,
}

const BADGE_VARIANT: Record<ActivityType, "default" | "secondary" | "outline"> = {
  enrollment: "default",
  payment: "secondary",
  proposal: "outline",
  invoice: "secondary",
  verification: "default",
  document: "outline",
}

function seedActivity(count = 60): ActivityItem[] {
  const pool: Omit<ActivityItem, "id" | "at">[] = [
    { type: "enrollment", title: "New Enrollment", description: "Jane Doe enrolled in First Aid L1" },
    { type: "payment", title: "Payment Received", description: "£120 from John Smith" },
    { type: "proposal", title: "Proposal Accepted", description: "CPR Course accepted by A. Taylor" },
    { type: "invoice", title: "Invoice Submitted", description: "Educator #E21 for Class C-039" },
    { type: "verification", title: "Verification Approved", description: "ID verified for M. Khan" },
    { type: "document", title: "Document Pending", description: "ID Back missing for L. Zhang" },
  ]
  const items: ActivityItem[] = []
  const now = Date.now()
  for (let i = 0; i < count; i++) {
    const base = pool[i % pool.length]
    const t = new Date(now - i * 1000 * 60 * 37) // every ~37 minutes
    items.push({
      id: `A-${1000 + i}`,
      type: base.type as ActivityType,
      title: base.title,
      description: base.description,
      at: t.toISOString(),
    })
  }
  return items
}

export default function AdminActivityPage() {
  const [query, setQuery] = React.useState("")
  const [type, setType] = React.useState<ActivityType | "all">("all")
  const [from, setFrom] = React.useState<Date | undefined>()
  const [to, setTo] = React.useState<Date | undefined>()
  const [limit, setLimit] = React.useState(15)

  const all = React.useMemo(() => seedActivity(80), [])
  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase()
    return all.filter((item) => {
      const matchesQ =
        !q ||
        item.title.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
      const matchesType = type === "all" || item.type === type
      const d = new Date(item.at)
      const matchesFrom = !from || d >= from
      const matchesTo = !to || d <= to
      return matchesQ && matchesType && matchesFrom && matchesTo
    })
  }, [all, query, type, from, to])

  const visible = filtered.slice(0, limit)
  const canLoadMore = visible.length < filtered.length

  React.useEffect(() => {
    // Reset pagination when changing filters
    setLimit(15)
  }, [query, type, from, to])

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 md:flex-row md:items-center">
        <h1 className="text-xl font-semibold">Activity</h1>
        <div className="ml-auto text-sm text-muted-foreground">{filtered.length} events</div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Filters</CardTitle>
          <CardDescription>
            Search and narrow activity across enrollments, payments, proposals, and more.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col gap-3 md:flex-row">
            <div className="relative md:w-1/2">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search title, description, or ID…"
                className="pl-8"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                aria-label="Search activity"
              />
            </div>
            <div className="grid w-full grid-cols-2 gap-2 md:grid-cols-3">
              <div className="space-y-1.5">
                <Label className="sr-only">Type</Label>
                <Select value={type} onValueChange={(v) => setType(v as ActivityType | "all")}>
                  <SelectTrigger aria-label="Filter by type">
                    <SelectValue placeholder="Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {TYPES.map((t) => (
                      <SelectItem key={t.value} value={t.value}>
                        {t.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <DateFilter label="From" date={from} onChange={setFrom} />
              <DateFilter label="To" date={to} onChange={setTo} />
            </div>
          </div>

          {(from || to || query || type !== "all") && (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setQuery("")
                  setType("all")
                  setFrom(undefined)
                  setTo(undefined)
                }}
              >
                <X className="mr-2 h-4 w-4" />
                Clear filters
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Recent Activity</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[140px]">When</TableHead>
                  <TableHead className="min-w-[160px]">Type</TableHead>
                  <TableHead className="min-w-[240px]">Title</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="w-[96px] text-right">ID</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="text-sm text-muted-foreground">{format(new Date(item.at), "PPp")}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {ICONS[item.type]}
                        <Badge variant={BADGE_VARIANT[item.type]} className="capitalize">
                          {item.type}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">{item.title}</TableCell>
                    <TableCell className="text-muted-foreground">{item.description}</TableCell>
                    <TableCell className="text-right text-xs text-muted-foreground">{item.id}</TableCell>
                  </TableRow>
                ))}
                {visible.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      No activity matches your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          {canLoadMore && (
            <div className="border-t p-3">
              <Button variant="outline" className="w-full bg-transparent" onClick={() => setLimit((n) => n + 15)}>
                Load more
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function DateFilter({
  label,
  date,
  onChange,
}: {
  label: string
  date?: Date
  onChange: (d?: Date) => void
}) {
  const [open, setOpen] = React.useState(false)
  return (
    <div className="space-y-1.5">
      <Label className="sr-only">{label}</Label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn("justify-start text-left font-normal w-full", !date && "text-muted-foreground")}
            aria-label={label}
          >
            {date ? format(date, "LLL dd, y") : label}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(d) => {
              onChange(d)
              setOpen(false)
            }}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}
