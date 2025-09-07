"use client"

import * as React from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

type Qualification = {
  id: string
  name: string
  institution: string
  dateObtained: string
  expiryDate?: string
}

export function AddQualification({ onAdd }: { onAdd: (q: Qualification) => void }) {
  const [name, setName] = React.useState("")
  const [institution, setInstitution] = React.useState("")
  const [dateObtained, setDateObtained] = React.useState("")
  const [expiryDate, setExpiryDate] = React.useState("")

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !institution.trim() || !dateObtained) return
    const q: Qualification = {
      id: `QUAL-${Date.now()}`,
      name: name.trim(),
      institution: institution.trim(),
      dateObtained,
      expiryDate: expiryDate || undefined,
    }
    onAdd(q)
    setName("")
    setInstitution("")
    setDateObtained("")
    setExpiryDate("")
  }

  return (
    <form className="grid gap-3" onSubmit={submit}>
      <div className="space-y-1.5">
        <Label htmlFor="q-name">Name</Label>
        <Input id="q-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Qualification name" />
      </div>
      <div className="space-y-1.5">
        <Label htmlFor="q-inst">Institution</Label>
        <Input
          id="q-inst"
          value={institution}
          onChange={(e) => setInstitution(e.target.value)}
          placeholder="Issuing body"
        />
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="q-obt">Date obtained</Label>
          <Input id="q-obt" type="date" value={dateObtained} onChange={(e) => setDateObtained(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="q-exp">Expiry (optional)</Label>
          <Input id="q-exp" type="date" value={expiryDate} onChange={(e) => setExpiryDate(e.target.value)} />
        </div>
      </div>
      <div className="flex justify-end">
        <Button type="submit" disabled={!name.trim() || !institution.trim() || !dateObtained}>
          Add
        </Button>
      </div>
    </form>
  )
}
