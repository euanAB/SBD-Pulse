"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  Search, X, Users, GraduationCap, BookOpen, MapPin, FileText,
  Building2, Receipt, ArrowRight, Loader2, Command
} from "lucide-react"
import { Badge } from "@/components/ui/badge"

/* ------------------------------------------------------------------ */
/*  Mock data index — replace with Supabase full-text search later    */
/* ------------------------------------------------------------------ */

interface SearchResult {
  id: string
  title: string
  subtitle: string
  category: "student" | "educator" | "class" | "course" | "location" | "proposal" | "invoice"
  status?: string
  statusColor?: string
  href: string
  meta?: string
}

const SEARCH_INDEX: SearchResult[] = [
  // Students
  { id: "S1001", title: "Emma Richardson", subtitle: "emma.r@email.com  |  S10 2DN", category: "student", status: "Teaching", statusColor: "bg-emerald-500", href: "/admin/students/S1001", meta: "07700 900111" },
  { id: "S1002", title: "James Whitfield", subtitle: "j.whitfield@email.com  |  LS1 4AP", category: "student", status: "Enrolled", statusColor: "bg-blue-500", href: "/admin/students/S1002", meta: "07700 900222" },
  { id: "S1003", title: "Sofia Patel", subtitle: "sofia.p@email.com  |  M1 1AA", category: "student", status: "Invited", statusColor: "bg-amber-500", href: "/admin/students/S1003", meta: "07700 900333" },
  { id: "S1004", title: "Liam O'Brien", subtitle: "liam.ob@email.com  |  B1 1BB", category: "student", status: "Overdue", statusColor: "bg-red-500", href: "/admin/students/S1004", meta: "07700 900444" },
  { id: "S1005", title: "Amara Johnson", subtitle: "amara.j@email.com  |  NG1 5FW", category: "student", status: "Completed", statusColor: "bg-gray-400", href: "/admin/students/S1005", meta: "07700 900555" },
  { id: "S1006", title: "Oliver Chen", subtitle: "o.chen@email.com  |  S1 2BJ", category: "student", status: "Teaching", statusColor: "bg-emerald-500", href: "/admin/students/S1006", meta: "07700 900666" },
  { id: "S1007", title: "Euan McKinnon", subtitle: "euan.m@email.com  |  S11 8YA", category: "student", status: "Teaching", statusColor: "bg-emerald-500", href: "/admin/students/S1007", meta: "07700 900777" },

  // Educators
  { id: "EDU-001", title: "Sarah Mitchell", subtitle: "Nail Technology  |  Sheffield", category: "educator", status: "Active", statusColor: "bg-emerald-500", href: "/admin/educators/EDU-001", meta: "07700 800111" },
  { id: "EDU-002", title: "David Park", subtitle: "First Aid  |  Leeds", category: "educator", status: "Active", statusColor: "bg-emerald-500", href: "/admin/educators/EDU-002", meta: "07700 800222" },
  { id: "EDU-003", title: "Rachel Green", subtitle: "Beauty Therapy  |  Manchester", category: "educator", status: "On Leave", statusColor: "bg-amber-500", href: "/admin/educators/EDU-003", meta: "07700 800333" },
  { id: "EDU-004", title: "Euan Campbell", subtitle: "Gel Nails  |  Sheffield", category: "educator", status: "Active", statusColor: "bg-emerald-500", href: "/admin/educators/EDU-004", meta: "07700 800444" },

  // Classes
  { id: "CLS-2025-001", title: "First Aid Essentials — Spring 2025", subtitle: "David Park  |  Sheffield  |  12 students", category: "class", status: "Teaching", statusColor: "bg-emerald-500", href: "/admin/classes/CLS-2025-001" },
  { id: "CLS-2025-002", title: "Nail Gel Extensions — Q2", subtitle: "Sarah Mitchell  |  Leeds  |  8 students", category: "class", status: "Enrolling", statusColor: "bg-blue-500", href: "/admin/classes/CLS-2025-002" },
  { id: "CLS-2025-003", title: "CPR Essentials — Summer", subtitle: "David Park  |  Manchester  |  15 students", category: "class", status: "Proposed", statusColor: "bg-amber-500", href: "/admin/classes/CLS-2025-003" },
  { id: "CLS-2025-004", title: "Beauty Therapy Advanced", subtitle: "Rachel Green  |  Sheffield  |  6 students", category: "class", status: "Completed", statusColor: "bg-gray-400", href: "/admin/classes/CLS-2025-004" },
  { id: "CLS-2025-005", title: "Nail Art Masterclass", subtitle: "Euan Campbell  |  Sheffield  |  10 students", category: "class", status: "Teaching", statusColor: "bg-emerald-500", href: "/admin/classes/CLS-2025-005" },

  // Courses
  { id: "CRS-NT-001", title: "Nail Beauty Therapy Training", subtitle: "120 hours  |  4 modules  |  3 upcoming classes", category: "course", status: "Active", statusColor: "bg-emerald-500", href: "/admin/courses/CRS-NT-001" },
  { id: "CRS-FA-001", title: "First Aid at Work Level 3", subtitle: "40 hours  |  3 modules  |  2 upcoming classes", category: "course", status: "Active", statusColor: "bg-emerald-500", href: "/admin/courses/CRS-FA-001" },
  { id: "CRS-CPR-001", title: "CPR Essentials", subtitle: "8 hours  |  2 modules  |  1 upcoming class", category: "course", status: "Active", statusColor: "bg-emerald-500", href: "/admin/courses/CRS-CPR-001" },
  { id: "CRS-BT-001", title: "Beauty Therapy Diploma", subtitle: "200 hours  |  6 modules  |  Draft", category: "course", status: "Draft", statusColor: "bg-gray-400", href: "/admin/courses/CRS-BT-001" },

  // Locations
  { id: "LOC-SHF", title: "Sheffield Academy Centre", subtitle: "S1 2BJ  |  3 rooms  |  Capacity 45", category: "location", status: "Active", statusColor: "bg-emerald-500", href: "/admin/locations/LOC-SHF" },
  { id: "LOC-LDS", title: "Leeds Training Hub", subtitle: "LS1 4AP  |  2 rooms  |  Capacity 30", category: "location", status: "Active", statusColor: "bg-emerald-500", href: "/admin/locations/LOC-LDS" },
  { id: "LOC-MAN", title: "Manchester Learning Suite", subtitle: "M1 1AA  |  4 rooms  |  Capacity 60", category: "location", status: "Active", statusColor: "bg-emerald-500", href: "/admin/locations/LOC-MAN" },

  // Proposals
  { id: "PRP-2025-001", title: "Proposal: Nail Gels Q3 — Sarah Mitchell", subtitle: "CRS-NT-001  |  Sheffield  |  Sent 15 Jan", category: "proposal", status: "Pending", statusColor: "bg-amber-500", href: "/admin/proposals" },
  { id: "PRP-2025-002", title: "Proposal: First Aid Summer — David Park", subtitle: "CRS-FA-001  |  Leeds  |  Sent 20 Jan", category: "proposal", status: "Accepted", statusColor: "bg-emerald-500", href: "/admin/proposals" },
  { id: "PRP-2025-003", title: "Proposal: CPR Weekend — David Park", subtitle: "CRS-CPR-001  |  Manchester  |  Sent 22 Jan", category: "proposal", status: "Declined", statusColor: "bg-red-500", href: "/admin/proposals" },

  // Invoices
  { id: "INV-2025-0041", title: "Invoice: Sarah Mitchell — Teaching Fee", subtitle: "CLS-2025-002  |  \u00a31,200.00  |  Submitted 1 Feb", category: "invoice", status: "Pending", statusColor: "bg-amber-500", href: "/admin/finance" },
  { id: "INV-2025-0042", title: "Invoice: David Park — First Aid Spring", subtitle: "CLS-2025-001  |  \u00a3950.00  |  Submitted 28 Jan", category: "invoice", status: "Approved", statusColor: "bg-blue-500", href: "/admin/finance" },
  { id: "INV-2025-0043", title: "Invoice: Rachel Green — Beauty Therapy", subtitle: "CLS-2025-004  |  \u00a31,800.00  |  Paid 10 Feb", category: "invoice", status: "Paid", statusColor: "bg-emerald-500", href: "/admin/finance" },
]

/* ------------------------------------------------------------------ */
/*  Category config                                                   */
/* ------------------------------------------------------------------ */

const CATEGORY_CONFIG: Record<string, { icon: typeof Users; label: string; color: string }> = {
  student:  { icon: Users,        label: "Students",   color: "text-blue-600" },
  educator: { icon: GraduationCap, label: "Educators",  color: "text-teal-600" },
  class:    { icon: BookOpen,      label: "Classes",    color: "text-indigo-600" },
  course:   { icon: FileText,      label: "Courses",    color: "text-orange-600" },
  location: { icon: MapPin,        label: "Locations",  color: "text-emerald-600" },
  proposal: { icon: Building2,     label: "Proposals",  color: "text-purple-600" },
  invoice:  { icon: Receipt,       label: "Invoices",   color: "text-rose-600" },
}

/* ------------------------------------------------------------------ */
/*  Search function with simulated async delay                        */
/* ------------------------------------------------------------------ */

function searchAll(query: string): Promise<SearchResult[]> {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!query.trim()) return resolve([])
      const q = query.toLowerCase()
      const results = SEARCH_INDEX.filter(
        (r) =>
          r.id.toLowerCase().includes(q) ||
          r.title.toLowerCase().includes(q) ||
          r.subtitle.toLowerCase().includes(q) ||
          (r.meta && r.meta.toLowerCase().includes(q)) ||
          r.category.toLowerCase().includes(q)
      )
      resolve(results)
    }, 150) // simulate network latency
  })
}

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export function GlobalSearch() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [loading, setLoading] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const itemRefs = useRef<(HTMLButtonElement | null)[]>([])

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setOpen(true)
        setTimeout(() => inputRef.current?.focus(), 50)
      }
      if (e.key === "Escape") {
        setOpen(false)
        setQuery("")
        setResults([])
        setActiveIndex(-1)
      }
    }
    window.addEventListener("keydown", handleKey)
    return () => window.removeEventListener("keydown", handleKey)
  }, [])

  // Click outside to close
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        setOpen(false)
        setQuery("")
        setResults([])
        setActiveIndex(-1)
      }
    }
    document.addEventListener("mousedown", handleClick)
    return () => document.removeEventListener("mousedown", handleClick)
  }, [open])

  // Debounced search
  useEffect(() => {
    if (!query.trim()) {
      setResults([])
      setLoading(false)
      setActiveIndex(-1)
      return
    }
    setLoading(true)
    setActiveIndex(-1)
    const timeout = setTimeout(async () => {
      const res = await searchAll(query)
      setResults(res)
      setLoading(false)
    }, 200)
    return () => clearTimeout(timeout)
  }, [query])

  // Scroll active item into view
  useEffect(() => {
    if (activeIndex >= 0 && itemRefs.current[activeIndex]) {
      itemRefs.current[activeIndex]?.scrollIntoView({ block: "nearest" })
    }
  }, [activeIndex])

  const navigate = useCallback((href: string) => {
    setOpen(false)
    setQuery("")
    setResults([])
    setActiveIndex(-1)
    router.push(href)
  }, [router])

  // Keyboard navigation
  function handleKeyDown(e: React.KeyboardEvent) {
    const flatResults = results
    if (e.key === "ArrowDown") {
      e.preventDefault()
      setActiveIndex((prev) => (prev < flatResults.length - 1 ? prev + 1 : 0))
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : flatResults.length - 1))
    } else if (e.key === "Enter" && activeIndex >= 0 && flatResults[activeIndex]) {
      e.preventDefault()
      navigate(flatResults[activeIndex].href)
    }
  }

  // Group results by category
  const grouped = results.reduce<Record<string, SearchResult[]>>((acc, r) => {
    if (!acc[r.category]) acc[r.category] = []
    acc[r.category].push(r)
    return acc
  }, {})

  // Flat index mapping for keyboard nav
  let flatIndex = -1

  return (
    <div className="relative flex-1" ref={panelRef}>
      {/* Search trigger / input */}
      <div
        className="relative cursor-text"
        onClick={() => {
          setOpen(true)
          setTimeout(() => inputRef.current?.focus(), 50)
        }}
      >
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        {!open ? (
          <div className="flex items-center justify-between pl-8 pr-2 h-9 rounded-md border border-input bg-background text-sm text-muted-foreground hover:border-foreground/20 transition-colors">
            <span>Search everything...</span>
            <kbd className="pointer-events-none hidden h-5 select-none items-center gap-0.5 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground sm:flex">
              <Command className="h-3 w-3" />K
            </kbd>
          </div>
        ) : (
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search students, classes, postcodes, phone numbers..."
            className="w-full pl-8 pr-8 h-9 rounded-md border border-foreground/20 bg-background text-sm outline-none ring-1 ring-ring/20 placeholder:text-muted-foreground"
            aria-label="Global search"
            autoComplete="off"
          />
        )}
        {open && query && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              setQuery("")
              inputRef.current?.focus()
            }}
            className="absolute right-2 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Results dropdown */}
      {open && (query.trim() || loading) && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-popover border border-border rounded-lg shadow-xl z-50 max-h-[480px] overflow-y-auto overflow-x-hidden">
          {/* Loading state */}
          {loading && (
            <div className="flex items-center gap-2 px-4 py-3 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Searching across all departments...</span>
            </div>
          )}

          {/* No results */}
          {!loading && query.trim() && results.length === 0 && (
            <div className="px-4 py-6 text-center">
              <Search className="h-8 w-8 mx-auto text-muted-foreground/50 mb-2" />
              <p className="text-sm font-medium text-foreground">No results found</p>
              <p className="text-xs text-muted-foreground mt-1">
                {"Try searching by name, ID, postcode, phone number, or course title"}
              </p>
            </div>
          )}

          {/* Grouped results */}
          {!loading && Object.entries(grouped).map(([category, items]) => {
            const config = CATEGORY_CONFIG[category]
            if (!config) return null
            const Icon = config.icon

            return (
              <div key={category}>
                {/* Category header */}
                <div className="sticky top-0 bg-muted/80 backdrop-blur px-3 py-1.5 flex items-center gap-2 border-b border-border/50">
                  <Icon className={`h-3.5 w-3.5 ${config.color}`} />
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                    {config.label}
                  </span>
                  <Badge variant="secondary" className="ml-auto text-[10px] h-4 px-1.5 font-mono">
                    {items.length}
                  </Badge>
                </div>

                {/* Items */}
                {items.map((item) => {
                  flatIndex++
                  const idx = flatIndex
                  const isActive = activeIndex === idx

                  return (
                    <button
                      key={item.id}
                      ref={(el) => { itemRefs.current[idx] = el }}
                      onClick={() => navigate(item.href)}
                      onMouseEnter={() => setActiveIndex(idx)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 text-left transition-colors ${
                        isActive ? "bg-accent" : "hover:bg-accent/50"
                      }`}
                      role="option"
                      aria-selected={isActive}
                    >
                      {/* Left content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground truncate">
                            {item.title}
                          </span>
                          <span className="text-[10px] font-mono text-muted-foreground shrink-0">
                            {item.id}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>

                      {/* Status badge */}
                      {item.status && (
                        <div className="flex items-center gap-1.5 shrink-0">
                          <span className={`h-1.5 w-1.5 rounded-full ${item.statusColor}`} />
                          <span className="text-[11px] text-muted-foreground font-medium">
                            {item.status}
                          </span>
                        </div>
                      )}

                      {/* Arrow */}
                      <ArrowRight className={`h-3.5 w-3.5 shrink-0 transition-opacity ${
                        isActive ? "opacity-100 text-foreground" : "opacity-0"
                      }`} />
                    </button>
                  )
                })}
              </div>
            )
          })}

          {/* Footer */}
          {!loading && results.length > 0 && (
            <div className="border-t border-border px-3 py-2 flex items-center justify-between text-[11px] text-muted-foreground bg-muted/50">
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">&uarr;</kbd>
                  <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">&darr;</kbd>
                  navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">Enter</kbd>
                  open
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="rounded border bg-background px-1 py-0.5 font-mono text-[10px]">Esc</kbd>
                  close
                </span>
              </div>
              <span>{results.length} result{results.length !== 1 ? "s" : ""} found</span>
            </div>
          )}
        </div>
      )}

      {/* Full-screen backdrop when open */}
      {open && (
        <div
          className="fixed inset-0 z-[-1]"
          aria-hidden="true"
        />
      )}
    </div>
  )
}
