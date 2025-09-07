"use client"

import type * as React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { EducatorSidebar } from "@/components/educator-sidebar"
import { Topbar } from "@/components/topbar"

export default function EducatorLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen>
      <EducatorSidebar />
      <SidebarInset>
        <Topbar />
        <main className="p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
