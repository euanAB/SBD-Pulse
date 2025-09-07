"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import Link from "next/link"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [role, setRole] = React.useState<"admin" | "educator" | "student" | "">("")

  function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!role) return
    // Dev-only: route directly to the chosen dashboard
    router.push(`/${role}`)
  }

  return (
    <div className="min-h-[calc(100svh-0px)] grid place-items-center px-4 py-10">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl">Sign in</CardTitle>
          <CardDescription>Temporary login for development. Choose a role to preview the dashboards.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Account type</Label>
              <Select value={role} onValueChange={(v) => setRole(v as any)}>
                <SelectTrigger aria-label="Select account type">
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="educator">Educator</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button type="submit" className="w-full" disabled={!role}>
              Continue
            </Button>

            <div className="text-xs text-muted-foreground text-center">
              This bypasses authentication and routes to /admin, /educator, or /student for now.
            </div>

            <div className="pt-2 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <Button type="button" variant="outline" onClick={() => router.push("/admin")}>
                Admin
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/educator")}>
                Educator
              </Button>
              <Button type="button" variant="outline" onClick={() => router.push("/student")}>
                Student
              </Button>
            </div>

            <div className="pt-3 text-center text-xs">
              Need real auth later? We’ll wire it to your identity provider and keep role-aware routing intact.
            </div>
          </form>

          <div className="mt-6 text-center text-xs">
            <Link href="/" className="underline underline-offset-2">
              Back to site
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
