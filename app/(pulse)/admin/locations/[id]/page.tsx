"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Building2,
  CalendarClock,
  MapPin,
  Phone,
  Mail,
  DoorOpen,
  ShieldCheck,
  FileText,
  User,
  Edit,
  Download,
  Upload,
  ArrowLeft,
  AlertTriangle,
  CheckCircle,
  Clock,
} from "lucide-react"

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
  healthSafetyDocs: { id: string; name: string; uploadDate: string; expiryDate?: string }[]
  emergencyContacts: { name: string; role?: string; phone: string; email?: string }[]
  status: "Active" | "Inactive" | "Under Review"
  notes?: string
  lastInspection?: string
  nextInspection?: string
  maintenanceHistory: { date: string; description: string; cost?: string; contractor?: string }[]
}

// Mock data - in real app this would come from database
const mockLocation: Location = {
  id: "LOC-SHF-001",
  name: "Sheffield Training Centre",
  city: "Sheffield",
  address: "12 Industry Way, Sheffield S1 2AB",
  what3words: "focus.rings.train",
  amenities: [
    "Classroom A",
    "Practice Stations",
    "Accessible WC",
    "Refreshments",
    "PPE Store",
    "Parking",
    "WiFi",
    "Air Conditioning",
  ],
  managingAgent: {
    name: "Acme Estates",
    email: "sheffield@acmeestates.co.uk",
    phone: "+44 114 555 2000",
  },
  security: {
    provider: "SecureCo",
    notes: "Evening patrol at 20:00. CCTV monitoring 24/7. Alarm system connected to monitoring station.",
  },
  accessArrangement:
    "Key safe code 4391. Alarm panel at reception. Disable alarm within 30 seconds of entry. Staff must sign in/out logbook.",
  parking: "On-street after 18:00. Parkhouse next door offers 20% discount for staff. 3 disabled spaces available.",
  lease: {
    start: "2024-01-01",
    end: "2027-12-31",
    rent: "£2,400/mo",
    notes:
      "Upward-only rent review scheduled for January 2026. Break clause available after 2 years with 6 months notice.",
  },
  healthSafetyDocs: [
    { id: "HSD-1", name: "Risk Assessment 2025.pdf", uploadDate: "2025-01-15", expiryDate: "2026-01-15" },
    { id: "HSD-2", name: "Fire Safety Certificate.pdf", uploadDate: "2024-12-01", expiryDate: "2025-12-01" },
    { id: "HSD-3", name: "PAT Testing Report.pdf", uploadDate: "2024-11-20", expiryDate: "2025-11-20" },
    { id: "HSD-4", name: "Gas Safety Certificate.pdf", uploadDate: "2024-10-15", expiryDate: "2025-10-15" },
    { id: "HSD-5", name: "Electrical Installation Certificate.pdf", uploadDate: "2024-09-30" },
  ],
  emergencyContacts: [
    { name: "Jane Doe", role: "Site Manager", phone: "+44 7700 900001", email: "jane.doe@pulse.ac.uk" },
    { name: "24/7 Security Monitoring", phone: "+44 800 111 222" },
    { name: "Building Emergency", phone: "+44 114 555 2001", email: "emergency@acmeestates.co.uk" },
    {
      name: "Facilities Maintenance",
      role: "Maintenance Team",
      phone: "+44 7700 900010",
      email: "maintenance@pulse.ac.uk",
    },
  ],
  status: "Active",
  notes: "Recently refurbished training rooms. New HVAC system installed December 2024. Excellent transport links.",
  lastInspection: "2024-12-15",
  nextInspection: "2025-03-15",
  maintenanceHistory: [
    {
      date: "2024-12-10",
      description: "HVAC system installation and commissioning",
      cost: "£8,500",
      contractor: "Climate Solutions Ltd",
    },
    {
      date: "2024-11-22",
      description: "Fire alarm system annual service",
      cost: "£450",
      contractor: "Fire Safety Pro",
    },
    {
      date: "2024-10-30",
      description: "Carpet cleaning and sanitization",
      cost: "£280",
      contractor: "Clean Team Services",
    },
    {
      date: "2024-09-15",
      description: "Window cleaning and minor repairs",
      cost: "£150",
      contractor: "Sheffield Window Services",
    },
    {
      date: "2024-08-20",
      description: "Plumbing repairs - staff toilet",
      cost: "£320",
      contractor: "Quick Fix Plumbing",
    },
  ],
}

export default function LocationDetailPage() {
  const params = useParams()
  const locationId = params.id as string

  // In real app, fetch location data based on ID
  const location = mockLocation
  const [notes, setNotes] = React.useState(location.notes || "")
  const [editingNotes, setEditingNotes] = React.useState(false)

  function daysUntilLeaseEnd(dateStr: string) {
    const end = new Date(dateStr).getTime()
    const now = Date.now()
    const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24))
    return diff
  }

  function getDocumentStatus(doc: { expiryDate?: string }) {
    if (!doc.expiryDate) return "valid"
    const expiry = new Date(doc.expiryDate).getTime()
    const now = Date.now()
    const daysUntilExpiry = Math.ceil((expiry - now) / (1000 * 60 * 60 * 24))

    if (daysUntilExpiry < 0) return "expired"
    if (daysUntilExpiry <= 30) return "expiring"
    return "valid"
  }

  function getStatusIcon(status: string) {
    switch (status) {
      case "expired":
        return <AlertTriangle className="h-4 w-4 text-destructive" />
      case "expiring":
        return <Clock className="h-4 w-4 text-yellow-500" />
      default:
        return <CheckCircle className="h-4 w-4 text-green-500" />
    }
  }

  const daysLeft = daysUntilLeaseEnd(location.lease.end)
  const leaseUrgency = daysLeft <= 60 ? "destructive" : daysLeft <= 180 ? "secondary" : "outline"

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/locations">
          <Button variant="outline" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Locations
          </Button>
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{location.name}</h1>
            <Badge
              variant={
                location.status === "Active" ? "default" : location.status === "Inactive" ? "secondary" : "outline"
              }
            >
              {location.status}
            </Badge>
          </div>
          <p className="text-muted-foreground">{location.address}</p>
        </div>
        <Button>
          <Edit className="mr-2 h-4 w-4" />
          Edit Location
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <CalendarClock className="h-4 w-4" />
              Lease Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Badge variant={leaseUrgency as any} className="w-full justify-center">
                {daysLeft > 0 ? `${daysLeft} days remaining` : "Lease expired"}
              </Badge>
              <div className="text-sm text-muted-foreground">
                <div>Start: {new Date(location.lease.start).toLocaleDateString()}</div>
                <div>End: {new Date(location.lease.end).toLocaleDateString()}</div>
                {location.lease.rent && <div>Rent: {location.lease.rent}</div>}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="text-2xl font-bold">{location.healthSafetyDocs.length}</div>
              <div className="text-sm text-muted-foreground">
                {location.healthSafetyDocs.filter((doc) => getDocumentStatus(doc) === "expired").length} expired,{" "}
                {location.healthSafetyDocs.filter((doc) => getDocumentStatus(doc) === "expiring").length} expiring soon
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Inspections
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {location.lastInspection && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Last: </span>
                  {new Date(location.lastInspection).toLocaleDateString()}
                </div>
              )}
              {location.nextInspection && (
                <div className="text-sm">
                  <span className="text-muted-foreground">Next: </span>
                  {new Date(location.nextInspection).toLocaleDateString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
          <TabsTrigger value="notes">Notes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  Location Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Address</Label>
                  <p className="text-sm text-muted-foreground">{location.address}</p>
                </div>
                {location.what3words && (
                  <div>
                    <Label className="text-sm font-medium">What3Words</Label>
                    <p className="text-sm text-muted-foreground">{location.what3words}</p>
                  </div>
                )}
                <div>
                  <Label className="text-sm font-medium">Amenities</Label>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {location.amenities.map((amenity) => (
                      <Badge key={amenity} variant="outline" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="h-4 w-4" />
                  Managing Agent
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Company</Label>
                  <p className="text-sm text-muted-foreground">{location.managingAgent.name}</p>
                </div>
                <div className="flex items-center gap-4">
                  <a
                    href={`mailto:${location.managingAgent.email}`}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Mail className="h-3 w-3" />
                    {location.managingAgent.email}
                  </a>
                  <a
                    href={`tel:${location.managingAgent.phone}`}
                    className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                  >
                    <Phone className="h-3 w-3" />
                    {location.managingAgent.phone}
                  </a>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4" />
                  Security
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label className="text-sm font-medium">Provider</Label>
                  <p className="text-sm text-muted-foreground">{location.security.provider}</p>
                </div>
                {location.security.notes && (
                  <div>
                    <Label className="text-sm font-medium">Notes</Label>
                    <p className="text-sm text-muted-foreground">{location.security.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DoorOpen className="h-4 w-4" />
                  Access & Parking
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {location.accessArrangement && (
                  <div>
                    <Label className="text-sm font-medium">Access Arrangement</Label>
                    <p className="text-sm text-muted-foreground">{location.accessArrangement}</p>
                  </div>
                )}
                {location.parking && (
                  <div>
                    <Label className="text-sm font-medium">Parking</Label>
                    <p className="text-sm text-muted-foreground">{location.parking}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Lease Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-3">
                <div>
                  <Label className="text-sm font-medium">Start Date</Label>
                  <p className="text-sm text-muted-foreground">{new Date(location.lease.start).toLocaleDateString()}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">End Date</Label>
                  <p className="text-sm text-muted-foreground">{new Date(location.lease.end).toLocaleDateString()}</p>
                </div>
                {location.lease.rent && (
                  <div>
                    <Label className="text-sm font-medium">Monthly Rent</Label>
                    <p className="text-sm text-muted-foreground">{location.lease.rent}</p>
                  </div>
                )}
              </div>
              {location.lease.notes && (
                <div>
                  <Label className="text-sm font-medium">Lease Notes</Label>
                  <p className="text-sm text-muted-foreground">{location.lease.notes}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Health & Safety Documents</h3>
            <Dialog>
              <DialogTrigger asChild>
                <Button>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Document
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Upload Document</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label>Document Name</Label>
                    <Input placeholder="e.g., Fire Safety Certificate" />
                  </div>
                  <div className="space-y-2">
                    <Label>Expiry Date (optional)</Label>
                    <Input type="date" />
                  </div>
                  <div className="space-y-2">
                    <Label>File</Label>
                    <Input type="file" accept=".pdf,.doc,.docx" />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline">Cancel</Button>
                    <Button>Upload</Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="grid gap-4">
            {location.healthSafetyDocs.map((doc) => {
              const status = getDocumentStatus(doc)
              return (
                <Card key={doc.id}>
                  <CardContent className="flex items-center justify-between p-4">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(status)}
                      <div>
                        <div className="font-medium">{doc.name}</div>
                        <div className="text-sm text-muted-foreground">
                          Uploaded: {new Date(doc.uploadDate).toLocaleDateString()}
                          {doc.expiryDate && (
                            <span className="ml-2">• Expires: {new Date(doc.expiryDate).toLocaleDateString()}</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge
                        variant={status === "expired" ? "destructive" : status === "expiring" ? "secondary" : "outline"}
                      >
                        {status === "expired" ? "Expired" : status === "expiring" ? "Expiring Soon" : "Valid"}
                      </Badge>
                      <Button variant="outline" size="sm">
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Emergency Contacts</h3>
            <Button>
              <User className="mr-2 h-4 w-4" />
              Add Contact
            </Button>
          </div>

          <div className="grid gap-4">
            {location.emergencyContacts.map((contact, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <div className="font-medium">{contact.name}</div>
                        {contact.role && <Badge variant="secondary">{contact.role}</Badge>}
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <a
                          href={`tel:${contact.phone}`}
                          className="inline-flex items-center gap-1 text-primary hover:underline"
                        >
                          <Phone className="h-3 w-3" />
                          {contact.phone}
                        </a>
                        {contact.email && (
                          <a
                            href={`mailto:${contact.email}`}
                            className="inline-flex items-center gap-1 text-primary hover:underline"
                          >
                            <Mail className="h-3 w-3" />
                            {contact.email}
                          </a>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="maintenance" className="space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold">Maintenance History</h3>
            <Button>Add Maintenance Record</Button>
          </div>

          <div className="space-y-4">
            {location.maintenanceHistory.map((record, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="font-medium">{record.description}</div>
                      <div className="text-sm text-muted-foreground">
                        {new Date(record.date).toLocaleDateString()}
                        {record.contractor && <span className="ml-2">• {record.contractor}</span>}
                      </div>
                    </div>
                    {record.cost && <Badge variant="outline">{record.cost}</Badge>}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="notes" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Location Notes
                <Button variant="outline" size="sm" onClick={() => setEditingNotes(!editingNotes)}>
                  <Edit className="mr-2 h-4 w-4" />
                  {editingNotes ? "Save" : "Edit"}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {editingNotes ? (
                <Textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add notes about this location..."
                  rows={6}
                />
              ) : (
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">{notes || "No notes added yet."}</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
