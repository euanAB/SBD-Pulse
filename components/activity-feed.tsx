"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

type Item = {
  id: string
  title: string
  subtitle: string
  time: string
  variant?: "success" | "warning" | "info"
}

const data: Item[] = [
  {
    id: "1",
    title: "New Enrollment",
    subtitle: "Jane Doe enrolled in First Aid L1",
    time: "2m ago",
    variant: "success",
  },
  { id: "2", title: "Payment Received", subtitle: "£120 from John Smith", time: "14m ago", variant: "success" },
  { id: "3", title: "Proposal Accepted", subtitle: "CPR Course by A. Taylor", time: "1h ago", variant: "info" },
  { id: "4", title: "Invoice Submitted", subtitle: "Educator #E21 for Class C-039", time: "2h ago", variant: "info" },
  { id: "5", title: "Document Pending", subtitle: "ID Back missing for M. Khan", time: "5h ago", variant: "warning" },
]

export function ActivityFeed() {
  return (
    <ScrollArea className="h-[360px]">
      <ul className="divide-y">
        {data.map((item) => (
          <li key={item.id} className="px-4 py-3">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="text-sm font-medium">{item.title}</div>
                <div className="text-sm text-muted-foreground">{item.subtitle}</div>
              </div>
              <div
                className={cn(
                  "text-xs font-medium rounded px-2 py-0.5",
                  item.variant === "success" &&
                    "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300",
                  item.variant === "warning" && "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300",
                  item.variant === "info" && "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
                )}
              >
                {item.time}
              </div>
            </div>
          </li>
        ))}
      </ul>
    </ScrollArea>
  )
}
