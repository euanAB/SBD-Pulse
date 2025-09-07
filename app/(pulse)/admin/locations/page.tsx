"use client"

import * as React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Building2, CalendarClock, MapPin, Search, Plus, ExternalLink } from "lucide-react"

type Location = {
  id: string
  name: string
  city: string
  address: string
  what3words?: string
  amenities: string[]
  managingAgent: { name: string; email: string; phone: string }
  security: { provider: string; notes?: string }
  accessArrangement?: string
  parking?: string
  lease: { start: string; end: string; rent?: string; notes?: string }
  healthSafetyDocs: { id: string; name: string }[]
  emergencyContacts: { name: string; role?: string; phone: string; email?: string }[]
  status: "Active" | "Inactive" | "Under Review"
}

const seededLocations: Location[] = [
  {
    id: "LOC-SHF-001",
    name: "Sheffield Training Centre",
    city: "Sheffield",
    address: "12 Industry Way, Sheffield S1 2AB",
    what3words: "focus.rings.train",
    amenities: ["Classroom A", "Practice Stations", "Accessible WC", "Refreshments", "PPE Store"],
    managingAgent: { name: "Acme Estates", email: "sheffield@acmeestates.co.uk", phone: "+44 114 555 2000" },
    security: { provider: "SecureCo", notes: "Evening patrol at 20:00" },
    accessArrangement: "Key safe code 4391. Alarm panel at reception.",
    parking: "On-street after 18:00. Parkhouse next door discounted.",
    lease: { start: "2024-01-01", end: "2027-12-31", rent: "£2,400/mo", notes: "Upward-only rent review 2026." },
    healthSafetyDocs: [
      { id: "HSD-1", name: "Risk Assessment 2025.pdf" },
      { id: "HSD-2", name: "Fire Safety Certificate.pdf" },
    ],
    emergencyContacts: [
      { name: "Jane Doe", role: "Site Manager", phone: "+44 7700 900001", email: "jane.doe@pulse.ac.uk" },
      { name: "24/7 Security", phone: "+44 800 111 222" },
    ],
    status: "Active",
  },
  {
    id: "LOC-LDS-002",
    name: "Leeds Studio",
    city: "Leeds",
    address: "8 Crown Street, Leeds LS1 3AG",
    what3words: "finely.wide.pitch",
    amenities: ["Studio 1", "Reception", "Parking Nearby", "Breakout Area"],
    managingAgent: { name: "Northern Lettings", email: "hello@nlettings.co.uk", phone: "+44 113 555 8800" },
    security: { provider: "Guardian Ltd", notes: "Keyholder: Reception. CCTV on." },
    accessArrangement: "Reception holds keys. Logbook sign-in required.",
    parking: "Multi-storey opposite. 2 spaces reserved weekends.",
    lease: { start: "2023-03-01", end: "2026-03-01", rent: "£1,950/mo" },
    healthSafetyDocs: [{ id: "HSD-3", name: "PAT Testing Certificate.pdf" }],
    emergencyContacts: [
      { name: "Tom Ray", role: "Managing Agent", phone: "+44 7700 900002", email: "tom.ray@nlettings.co.uk" },
    ],
    status: "Active",
  },
  {
    id: "LOC-MCR-003",
    name: "Manchester Hub",
    city: "Manchester",
    address: "45 Exchange Sq, Manchester M2 7DN",
    what3words: "signal.brave.lamp",
    amenities: ["Classroom B", "Lockers", "Kitchenette"],
    managingAgent: { name: "City Mgmt", email: "ops@citymgmt.com", phone: "+44 161 555 3300" },
    security: { provider: "Sentinel", notes: "Alarm auto-arm 22:00" },
    accessArrangement: "Code access 2291#. Lift to 3rd floor.",
    parking: "No on-site. Q-Park 5 min walk.",
    lease: { start: "2022-07-01", end: "2025-10-15", rent: "£2,800/mo" },
    healthSafetyDocs: [
      { id: "HSD-4", name: "Fire Safety Certificate.pdf" },
      { id: "HSD-5", name: "Electrical Safety Report.pdf" },
    ],
    emergencyContacts: [
      { name: "Priya Patel", role: "Emergency Contact", phone: "+44 7700 900003", email: "priya.patel@pulse.ac.uk" },
    ],
    status: "Under Review",
  },
  {
    id: "LOC-BRM-004",
    name: "Birmingham Academy",
    city: "Birmingham",
    address: "22 Bull Ring, Birmingham B5 4BU",
    what3words: "table.sharp.moon",
    amenities: ["Main Hall", "Computer Lab", "Staff Room", "Student Lounge"],
    managingAgent: { name: "Midlands Property", email: "birmingham@midlandsprop.co.uk", phone: "+44 121 555 4400" },
    security: { provider: "West Midlands Security", notes: "24/7 CCTV monitoring" },
    accessArrangement: "Swipe card access. Reception 8am-6pm weekdays.",
    parking: "Underground car park. 10 spaces allocated.",
    lease: { start: "2023-09-01", end: "2028-08-31", rent: "£3,200/mo" },
    healthSafetyDocs: [
      { id: "HSD-6", name: "Asbestos Survey.pdf" },
      { id: "HSD-7", name: "Gas Safety Certificate.pdf" },
    ],
    emergencyContacts: [
      { name: "Sarah Wilson", role: "Facilities Manager", phone: "+44 7700 900004", email: "sarah.wilson@pulse.ac.uk" },
      { name: "Emergency Services", phone: "999" },
    ],
    status: "Active",
  },
  {
    id: "LOC-LIV-005",
    name: "Liverpool Campus",
    city: "Liverpool",
    address: "15 Albert Dock, Liverpool L3 4AF",
    what3words: "ocean.bright.star",
    amenities: ["Lecture Theatre", "Workshop Space", "Café", "Library Corner"],
    managingAgent: { name: "Dock Properties", email: "liverpool@dockprops.co.uk", phone: "+44 151 555 5500" },
    security: { provider: "Mersey Security", notes: "Patrol every 2 hours after 10pm" },
    accessArrangement: "Digital keypad. Code changes monthly.",
    parking: "Pay & display nearby. Staff discount available.",
    lease: { start: "2024-02-01", end: "2026-01-31", rent: "£2,100/mo" },
    healthSafetyDocs: [],
    emergencyContacts: [
      { name: "Mike Johnson", role: "Site Coordinator", phone: "+44 7700 900005", email: "mike.johnson@pulse.ac.uk" },
    ],
    status: "Inactive",
  },
]

export default function LocationsPage() {
  const [locations, setLocations] = React.useState<Location[]>(seededLocations)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [open, setOpen] = React.useState(false)

  const filteredLocations = locations.filter(
    (location) =>
      location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      location.address.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  function daysUntilLeaseEnd(dateStr: string) {
    const end = new Date(dateStr).getTime()
    const now = Date.now()
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
    return diff
  }

  function getLeaseUrgency(days: number) {
    if (days <= 60) return "destructive"
    if (days <= 180) return "secondary"
    return "outline"
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "Active":
        return "default"
      case "Inactive":
        return "secondary"
      case "Under Review":
        return "outline"
      default:
        return "outline"
    }
  }

  function addLocation(loc: Omit<Location, "id">) {
    const newLocation = {
      id: `LOC-${Math.random().toString(36).slice(2, 7).toUpperCase()}-${String(locations.length + 1).padStart(3, "0")}`,
      ...loc,
    }
    setLocations((prev) => [newLocation, ...prev])
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Property Management</h1>
          <p className="text-muted-foreground">Manage all training locations and property details</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Location
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Location</DialogTitle>
            </DialogHeader>
            <AddLocationForm onSubmit={addLocation} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center space-x-2">
        <Search className="h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search locations by name, city, or address..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead>City</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Amenities</TableHead>
              <TableHead>Lease</TableHead>
              <TableHead>Managing Agent</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLocations.map((location) => {
              const daysLeft = daysUntilLeaseEnd(location.lease.end)
              const leaseUrgency = getLeaseUrgency(daysLeft)

              return (
                <TableRow key={location.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{location.name}</div>
                      <div className="text-sm text-muted-foreground">{location.id}</div>
                      <div className="text-sm text-muted-foreground">{location.address}</div>
                      {location.what3words && (
                        <Badge variant="outline" className="text-xs">
                          <MapPin className="mr-1 h-3 w-3" />
                          {location.what3words}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{location.city}</Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(location.status) as any}>{location.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {location.amenities.slice(0, 2).map((amenity) => (
                        <Badge key={amenity} variant="outline" className="text-xs">
                          {amenity}
                        </Badge>
                      ))}
                      {location.amenities.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{location.amenities.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant={leaseUrgency as any} className="text-xs">
                        <CalendarClock className="mr-1 h-3 w-3" />
                        {daysLeft > 0 ? `${daysLeft} days left` : "Expired"}
                      </Badge>
                      {location.lease.rent && (
                        <div className="text-sm text-muted-foreground">{location.lease.rent}</div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium text-sm">{location.managingAgent.name}</div>
                      <div className="text-xs text-muted-foreground">{location.managingAgent.email}</div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Link href={`/admin/locations/${location.id}`}>
                        <Button variant="outline" size="sm">
                          <Building2 className="mr-1 h-4 w-4" />
                          View Details
                        </Button>
                      </Link>
                      <Button variant="ghost" size="sm">
                        <ExternalLink className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {filteredLocations.length === 0 && (
        <div className="text-center py-8">
          <Building2 className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold">No locations found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm ? "Try adjusting your search terms." : "Get started by adding your first location."}
          </p>
        </div>
      )}
    </div>
  )
}

function AddLocationForm({
  onSubmit,
}: {
  onSubmit: (data: Omit<Location, "id">) => void
}) {
  const [formData, setFormData] = React.useState({
    name: "",
    city: "",
    address: "",
    what3words: "",
    amenities: "Classroom, Reception",
    agentName: "",
    agentEmail: "",
    agentPhone: "",
    securityProvider: "",
    securityNotes: "",
    accessArrangement: "",
    parking: "",
    leaseStart: "",
    leaseEnd: "",
    leaseRent: "",
    leaseNotes: "",
    status: "Active" as Location["status"],
  })

  const [emergencyContacts, setEmergencyContacts] = React.useState([{ name: "", role: "", phone: "", email: "" }])

  function handleSubmit() {
    if (!formData.name || !formData.city || !formData.address || !formData.leaseStart || !formData.leaseEnd) {
      return
    }

    onSubmit({
      name: formData.name,
      city: formData.city,
      address: formData.address,
      what3words: formData.what3words || undefined,
      amenities: formData.amenities
        .split(",")
        .map((a) => a.trim())
        .filter(Boolean),
      managingAgent: {
        name: formData.agentName,
        email: formData.agentEmail,
        phone: formData.agentPhone,
      },
      security: {
        provider: formData.securityProvider,
        notes: formData.securityNotes || undefined,
      },
      accessArrangement: formData.accessArrangement || undefined,
      parking: formData.parking || undefined,
      lease: {
        start: formData.leaseStart,
        end: formData.leaseEnd,
        rent: formData.leaseRent || undefined,
        notes: formData.leaseNotes || undefined,
      },
      healthSafetyDocs: [],
      emergencyContacts: emergencyContacts.filter((c) => c.name && c.phone),
      status: formData.status,
    })
  }

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">Location Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            placeholder="e.g., Sheffield Training Centre"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="city">City *</Label>
          <Input
            id="city"
            value={formData.city}
            onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
            placeholder="e.g., Sheffield"
          />
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="address">Full Address *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
            placeholder="Full street address"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="what3words">What3Words</Label>
          <Input
            id="what3words"
            value={formData.what3words}
            onChange={(e) => setFormData((prev) => ({ ...prev, what3words: e.target.value }))}
            placeholder="word.word.word"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="amenities">Amenities (comma separated)</Label>
          <Input
            id="amenities"
            value={formData.amenities}
            onChange={(e) => setFormData((prev) => ({ ...prev, amenities: e.target.value }))}
            placeholder="Classroom, Parking, Reception..."
          />
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Managing Agent</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="agentName">Agent Name</Label>
            <Input
              id="agentName"
              value={formData.agentName}
              onChange={(e) => setFormData((prev) => ({ ...prev, agentName: e.target.value }))}
              placeholder="Company or Contact"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agentEmail">Agent Email</Label>
            <Input
              id="agentEmail"
              type="email"
              value={formData.agentEmail}
              onChange={(e) => setFormData((prev) => ({ ...prev, agentEmail: e.target.value }))}
              placeholder="agent@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="agentPhone">Agent Phone</Label>
            <Input
              id="agentPhone"
              value={formData.agentPhone}
              onChange={(e) => setFormData((prev) => ({ ...prev, agentPhone: e.target.value }))}
              placeholder="+44 ..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Security & Access</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="securityProvider">Security Provider</Label>
            <Input
              id="securityProvider"
              value={formData.securityProvider}
              onChange={(e) => setFormData((prev) => ({ ...prev, securityProvider: e.target.value }))}
              placeholder="Security company"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="securityNotes">Security Notes</Label>
            <Textarea
              id="securityNotes"
              value={formData.securityNotes}
              onChange={(e) => setFormData((prev) => ({ ...prev, securityNotes: e.target.value }))}
              placeholder="Patrol times, procedures..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accessArrangement">Access Arrangement</Label>
            <Textarea
              id="accessArrangement"
              value={formData.accessArrangement}
              onChange={(e) => setFormData((prev) => ({ ...prev, accessArrangement: e.target.value }))}
              placeholder="How to access the building"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="parking">Parking Details</Label>
            <Textarea
              id="parking"
              value={formData.parking}
              onChange={(e) => setFormData((prev) => ({ ...prev, parking: e.target.value }))}
              placeholder="Parking arrangements"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Lease Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="leaseStart">Lease Start Date *</Label>
            <Input
              id="leaseStart"
              type="date"
              value={formData.leaseStart}
              onChange={(e) => setFormData((prev) => ({ ...prev, leaseStart: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leaseEnd">Lease End Date *</Label>
            <Input
              id="leaseEnd"
              type="date"
              value={formData.leaseEnd}
              onChange={(e) => setFormData((prev) => ({ ...prev, leaseEnd: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leaseRent">Monthly Rent</Label>
            <Input
              id="leaseRent"
              value={formData.leaseRent}
              onChange={(e) => setFormData((prev) => ({ ...prev, leaseRent: e.target.value }))}
              placeholder="£2,400/mo"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="leaseNotes">Lease Notes</Label>
            <Textarea
              id="leaseNotes"
              value={formData.leaseNotes}
              onChange={(e) => setFormData((prev) => ({ ...prev, leaseNotes: e.target.value }))}
              placeholder="Special clauses, reviews..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Emergency Contacts</h3>
        {emergencyContacts.map((contact, index) => (
          <div key={index} className="grid gap-4 sm:grid-cols-4 p-4 border rounded-lg">
            <div className="space-y-2">
              <Label>Name</Label>
              <Input
                value={contact.name}
                onChange={(e) => {
                  const updated = [...emergencyContacts]
                  updated[index] = { ...contact, name: e.target.value }
                  setEmergencyContacts(updated)
                }}
                placeholder="Contact name"
              />
            </div>
            <div className="space-y-2">
              <Label>Role</Label>
              <Input
                value={contact.role}
                onChange={(e) => {
                  const updated = [...emergencyContacts]
                  updated[index] = { ...contact, role: e.target.value }
                  setEmergencyContacts(updated)
                }}
                placeholder="Site Manager"
              />
            </div>
            <div className="space-y-2">
              <Label>Phone</Label>
              <Input
                value={contact.phone}
                onChange={(e) => {
                  const updated = [...emergencyContacts]
                  updated[index] = { ...contact, phone: e.target.value }
                  setEmergencyContacts(updated)
                }}
                placeholder="+44 ..."
              />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input
                value={contact.email}
                onChange={(e) => {
                  const updated = [...emergencyContacts]
                  updated[index] = { ...contact, email: e.target.value }
                  setEmergencyContacts(updated)
                }}
                placeholder="email@example.com"
              />
            </div>
          </div>
        ))}
        <Button
          type="button"
          variant="outline"
          onClick={() => setEmergencyContacts([...emergencyContacts, { name: "", role: "", phone: "", email: "" }])}
        >
          Add Emergency Contact
        </Button>
      </div>

      <div className="flex justify-end gap-2">
        <Button
          variant="outline"
          onClick={() =>
            setFormData({
              name: "",
              city: "",
              address: "",
              what3words: "",
              amenities: "Classroom, Reception",
              agentName: "",
              agentEmail: "",
              agentPhone: "",
              securityProvider: "",
              securityNotes: "",
              accessArrangement: "",
              parking: "",
              leaseStart: "",
              leaseEnd: "",
              leaseRent: "",
              leaseNotes: "",
              status: "Active",
            })
          }
        >
          Reset
        </Button>
        <Button onClick={handleSubmit}>Add Location</Button>
      </div>
    </div>
  )
}
