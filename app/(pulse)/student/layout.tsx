"use client"

import type * as React from "react"
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { StudentSidebar } from "@/components/student-sidebar"
import { Topbar } from "@/components/topbar"

export default function StudentLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider defaultOpen={false}>
      <StudentSidebar />
      <SidebarInset>
        <Topbar />
        <main className="p-4 md:p-6">{children}</main>
      </SidebarInset>
    </SidebarProvider>
  )
}
