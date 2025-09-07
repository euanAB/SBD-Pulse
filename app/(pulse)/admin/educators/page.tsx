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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { GraduationCap, Search, Plus, User, MapPin, CheckCircle, AlertTriangle, Clock, Phone, Mail } from "lucide-react"

type Educator = {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  homeAddress: {
    street: string
    city: string
    postcode: string
    country: string
  }
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  bankingDetails: {
    accountName: string
    sortCode: string
    accountNumber: string
    bankName: string
  }
  employment: {
    contractType: "Freelance" | "Part-time" | "Full-time"
    startDate: string
    contractSigned: boolean
    contractSignedDate?: string
    hourlyRate?: string
    annualSalary?: string
  }
  rightToWork: {
    status: "Verified" | "Pending" | "Expired"
    documentType: string
    expiryDate?: string
    verifiedDate?: string
  }
  qualifications: {
    id: string
    name: string
    institution: string
    dateObtained: string
    expiryDate?: string
  }[]
  skills: string[]
  baseLocation: string
  availableLocations: string[]
  documents: {
    id: string
    name: string
    type: "Contract" | "Qualification" | "ID" | "Right to Work" | "Insurance" | "Other"
    uploadDate: string
    expiryDate?: string
  }[]
  status: "Active" | "Inactive" | "On Leave"
  notes?: string
  lastReview?: string
  nextReview?: string
}

const seededEducators: Educator[] = [
  {
    id: "EDU-001",
    firstName: "Euan",
    lastName: "MacLeod",
    email: "euan.macleod@pulse.ac.uk",
    phone: "+44 7700 900100",
    homeAddress: {
      street: "45 Ecclesall Road",
      city: "Sheffield",
      postcode: "S11 8PR",
      country: "United Kingdom",
    },
    emergencyContact: {
      name: "Sarah MacLeod",
      relationship: "Spouse",
      phone: "+44 7700 900101",
    },
    bankingDetails: {
      accountName: "Euan MacLeod",
      sortCode: "20-12-34",
      accountNumber: "12345678",
      bankName: "Barclays Bank",
    },
    employment: {
      contractType: "Freelance",
      startDate: "2023-09-01",
      contractSigned: true,
      contractSignedDate: "2023-08-15",
      hourlyRate: "£45/hour",
    },
    rightToWork: {
      status: "Verified",
      documentType: "UK Passport",
      verifiedDate: "2023-08-10",
    },
    qualifications: [
      {
        id: "QUAL-001",
        name: "Level 3 Diploma in Nail Technology",
        institution: "Beauty Academy UK",
        dateObtained: "2022-06-15",
      },
      {
        id: "QUAL-002",
        name: "Gel Polish Specialist Certificate",
        institution: "Professional Beauty Institute",
        dateObtained: "2023-01-20",
      },
    ],
    skills: ["Nail Gels", "Manicure", "Pedicure", "Nail Art", "Client Consultation"],
    baseLocation: "Sheffield",
    availableLocations: ["Sheffield", "Leeds"],
    documents: [
      {
        id: "DOC-001",
        name: "Employment Contract 2023.pdf",
        type: "Contract",
        uploadDate: "2023-08-15",
      },
      {
        id: "DOC-002",
        name: "UK Passport Copy.pdf",
        type: "Right to Work",
        uploadDate: "2023-08-10",
      },
      {
        id: "DOC-003",
        name: "Level 3 Nail Technology Certificate.pdf",
        type: "Qualification",
        uploadDate: "2023-08-12",
      },
      {
        id: "DOC-004",
        name: "Professional Indemnity Insurance.pdf",
        type: "Insurance",
        uploadDate: "2024-01-15",
        expiryDate: "2025-01-15",
      },
    ],
    status: "Active",
    notes: "Excellent feedback from students. Specializes in advanced gel techniques. Available for weekend workshops.",
    lastReview: "2024-12-01",
    nextReview: "2025-06-01",
  },
  {
    id: "EDU-002",
    firstName: "Sophie",
    lastName: "Chen",
    email: "sophie.chen@pulse.ac.uk",
    phone: "+44 7700 900200",
    homeAddress: {
      street: "12 Victoria Street",
      city: "Leeds",
      postcode: "LS1 6AD",
      country: "United Kingdom",
    },
    emergencyContact: {
      name: "David Chen",
      relationship: "Partner",
      phone: "+44 7700 900201",
    },
    bankingDetails: {
      accountName: "Sophie Chen",
      sortCode: "40-47-84",
      accountNumber: "87654321",
      bankName: "HSBC",
    },
    employment: {
      contractType: "Part-time",
      startDate: "2024-02-01",
      contractSigned: true,
      contractSignedDate: "2024-01-20",
      hourlyRate: "£38/hour",
    },
    rightToWork: {
      status: "Verified",
      documentType: "UK Birth Certificate + Driving License",
      verifiedDate: "2024-01-15",
    },
    qualifications: [
      {
        id: "QUAL-003",
        name: "VTCT Level 2 Diploma in Beauty Therapy",
        institution: "Leeds College of Beauty",
        dateObtained: "2021-07-30",
      },
      {
        id: "QUAL-004",
        name: "First Aid at Work Certificate",
        institution: "St John Ambulance",
        dateObtained: "2024-03-10",
        expiryDate: "2027-03-10",
      },
    ],
    skills: ["Beauty Therapy", "Facial Treatments", "Waxing", "Eyebrow Shaping", "Client Care"],
    baseLocation: "Leeds",
    availableLocations: ["Leeds", "Manchester"],
    documents: [
      {
        id: "DOC-005",
        name: "Part-time Contract 2024.pdf",
        type: "Contract",
        uploadDate: "2024-01-20",
      },
      {
        id: "DOC-006",
        name: "Birth Certificate.pdf",
        type: "Right to Work",
        uploadDate: "2024-01-15",
      },
      {
        id: "DOC-007",
        name: "Driving License Copy.pdf",
        type: "ID",
        uploadDate: "2024-01-15",
      },
      {
        id: "DOC-008",
        name: "Beauty Therapy Diploma.pdf",
        type: "Qualification",
        uploadDate: "2024-01-18",
      },
    ],
    status: "Active",
    notes: "Strong background in beauty therapy. Excellent with nervous students. Prefers morning sessions.",
    lastReview: "2024-11-15",
    nextReview: "2025-05-15",
  },
  {
    id: "EDU-003",
    firstName: "Marcus",
    lastName: "Johnson",
    email: "marcus.johnson@pulse.ac.uk",
    phone: "+44 7700 900300",
    homeAddress: {
      street: "78 Oxford Road",
      city: "Manchester",
      postcode: "M1 5NH",
      country: "United Kingdom",
    },
    emergencyContact: {
      name: "Lisa Johnson",
      relationship: "Sister",
      phone: "+44 7700 900301",
    },
    bankingDetails: {
      accountName: "Marcus Johnson",
      sortCode: "11-22-33",
      accountNumber: "11223344",
      bankName: "NatWest",
    },
    employment: {
      contractType: "Freelance",
      startDate: "2023-03-15",
      contractSigned: true,
      contractSignedDate: "2023-03-01",
      hourlyRate: "£42/hour",
    },
    rightToWork: {
      status: "Pending",
      documentType: "Visa Application in Progress",
      expiryDate: "2025-03-15",
    },
    qualifications: [
      {
        id: "QUAL-005",
        name: "Advanced Nail Art Certification",
        institution: "International Beauty Academy",
        dateObtained: "2022-11-20",
      },
    ],
    skills: ["Advanced Nail Art", "3D Nail Design", "Competition Techniques", "Creative Design"],
    baseLocation: "Manchester",
    availableLocations: ["Manchester", "Birmingham"],
    documents: [
      {
        id: "DOC-009",
        name: "Freelance Contract 2023.pdf",
        type: "Contract",
        uploadDate: "2023-03-01",
      },
      {
        id: "DOC-010",
        name: "Visa Application Receipt.pdf",
        type: "Right to Work",
        uploadDate: "2023-02-28",
      },
    ],
    status: "On Leave",
    notes: "Currently on extended leave for visa renewal. Expected return March 2025.",
    lastReview: "2024-10-01",
    nextReview: "2025-04-01",
  },
]

export default function EducatorsPage() {
  const [educators, setEducators] = React.useState<Educator[]>(seededEducators)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [statusFilter, setStatusFilter] = React.useState<string>("all")
  const [open, setOpen] = React.useState(false)

  const filteredEducators = educators.filter((educator) => {
    const matchesSearch =
      educator.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      educator.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      educator.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      educator.baseLocation.toLowerCase().includes(searchTerm.toLowerCase()) ||
      educator.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))

    const matchesStatus = statusFilter === "all" || educator.status === statusFilter

    return matchesSearch && matchesStatus
  })

  function getStatusBadge(status: string) {
    switch (status) {
      case "Active":
        return "default"
      case "Inactive":
        return "secondary"
      case "On Leave":
        return "outline"
      default:
        return "outline"
    }
  }

  function getRightToWorkStatus(rightToWork: Educator["rightToWork"]) {
    switch (rightToWork.status) {
      case "Verified":
        return { icon: <CheckCircle className="h-4 w-4 text-green-500" />, variant: "default" }
      case "Pending":
        return { icon: <Clock className="h-4 w-4 text-yellow-500" />, variant: "secondary" }
      case "Expired":
        return { icon: <AlertTriangle className="h-4 w-4 text-destructive" />, variant: "destructive" }
      default:
        return { icon: <Clock className="h-4 w-4" />, variant: "outline" }
    }
  }

  function addEducator(educator: Omit<Educator, "id">) {
    const newEducator = {
      id: `EDU-${String(educators.length + 1).padStart(3, "0")}`,
      ...educator,
    }
    setEducators((prev) => [newEducator, ...prev])
    setOpen(false)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Educator HR Management</h1>
          <p className="text-muted-foreground">Manage educator profiles, contracts, and compliance</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Educator
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add New Educator</DialogTitle>
            </DialogHeader>
            <AddEducatorForm onSubmit={addEducator} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, email, location, or skills..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
            <SelectItem value="On Leave">On Leave</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Educator</TableHead>
              <TableHead>Contact</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Right to Work</TableHead>
              <TableHead>Skills</TableHead>
              <TableHead>Base Location</TableHead>
              <TableHead>Contract</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEducators.map((educator) => {
              const rightToWorkStatus = getRightToWorkStatus(educator.rightToWork)

              return (
                <TableRow key={educator.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">
                        {educator.firstName} {educator.lastName}
                      </div>
                      <div className="text-sm text-muted-foreground">{educator.id}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <div className="flex items-center gap-1 text-sm">
                        <Mail className="h-3 w-3" />
                        <a href={`mailto:${educator.email}`} className="text-primary hover:underline">
                          {educator.email}
                        </a>
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Phone className="h-3 w-3" />
                        <a href={`tel:${educator.phone}`} className="hover:underline">
                          {educator.phone}
                        </a>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadge(educator.status) as any}>{educator.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {rightToWorkStatus.icon}
                      <Badge variant={rightToWorkStatus.variant as any}>{educator.rightToWork.status}</Badge>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1">{educator.rightToWork.documentType}</div>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {educator.skills.slice(0, 2).map((skill) => (
                        <Badge key={skill} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                      {educator.skills.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{educator.skills.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      <Badge variant="secondary">{educator.baseLocation}</Badge>
                    </div>
                    {educator.availableLocations.length > 1 && (
                      <div className="text-xs text-muted-foreground mt-1">
                        +{educator.availableLocations.length - 1} other locations
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <div className="space-y-1">
                      <Badge variant="outline" className="text-xs">
                        {educator.employment.contractType}
                      </Badge>
                      <div className="text-xs text-muted-foreground">
                        {educator.employment.contractSigned ? (
                          <span className="flex items-center gap-1 text-green-600">
                            <CheckCircle className="h-3 w-3" />
                            Signed
                          </span>
                        ) : (
                          <span className="flex items-center gap-1 text-yellow-600">
                            <Clock className="h-3 w-3" />
                            Pending
                          </span>
                        )}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/admin/educators/${educator.id}`}>
                          <User className="mr-1 h-4 w-4" />
                          View Profile
                        </Link>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {filteredEducators.length === 0 && (
        <div className="text-center py-8">
          <GraduationCap className="mx-auto h-12 w-12 text-muted-foreground" />
          <h3 className="mt-2 text-sm font-semibold">No educators found</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {searchTerm || statusFilter !== "all"
              ? "Try adjusting your search or filter criteria."
              : "Get started by adding your first educator."}
          </p>
        </div>
      )}
    </div>
  )
}

function AddEducatorForm({
  onSubmit,
}: {
  onSubmit: (data: Omit<Educator, "id">) => void
}) {
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    street: "",
    city: "",
    postcode: "",
    country: "United Kingdom",
    emergencyName: "",
    emergencyRelationship: "",
    emergencyPhone: "",
    accountName: "",
    sortCode: "",
    accountNumber: "",
    bankName: "",
    contractType: "Freelance" as Educator["employment"]["contractType"],
    startDate: "",
    hourlyRate: "",
    annualSalary: "",
    rightToWorkStatus: "Pending" as Educator["rightToWork"]["status"],
    documentType: "",
    skills: "",
    baseLocation: "",
    availableLocations: "",
    status: "Active" as Educator["status"],
    notes: "",
  })

  function handleSubmit() {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone) {
      return
    }

    onSubmit({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phone: formData.phone,
      homeAddress: {
        street: formData.street,
        city: formData.city,
        postcode: formData.postcode,
        country: formData.country,
      },
      emergencyContact: {
        name: formData.emergencyName,
        relationship: formData.emergencyRelationship,
        phone: formData.emergencyPhone,
      },
      bankingDetails: {
        accountName: formData.accountName,
        sortCode: formData.sortCode,
        accountNumber: formData.accountNumber,
        bankName: formData.bankName,
      },
      employment: {
        contractType: formData.contractType,
        startDate: formData.startDate,
        contractSigned: false,
        hourlyRate: formData.hourlyRate || undefined,
        annualSalary: formData.annualSalary || undefined,
      },
      rightToWork: {
        status: formData.rightToWorkStatus,
        documentType: formData.documentType,
      },
      qualifications: [],
      skills: formData.skills
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      baseLocation: formData.baseLocation,
      availableLocations: formData.availableLocations
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      documents: [],
      status: formData.status,
      notes: formData.notes || undefined,
    })
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Personal Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName">First Name *</Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => setFormData((prev) => ({ ...prev, firstName: e.target.value }))}
              placeholder="First name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName">Last Name *</Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => setFormData((prev) => ({ ...prev, lastName: e.target.value }))}
              placeholder="Last name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
              placeholder="email@example.com"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">Phone *</Label>
            <Input
              id="phone"
              value={formData.phone}
              onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
              placeholder="+44 ..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Home Address</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              value={formData.street}
              onChange={(e) => setFormData((prev) => ({ ...prev, street: e.target.value }))}
              placeholder="Street address"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="city">City</Label>
            <Input
              id="city"
              value={formData.city}
              onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
              placeholder="City"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="postcode">Postcode</Label>
            <Input
              id="postcode"
              value={formData.postcode}
              onChange={(e) => setFormData((prev) => ({ ...prev, postcode: e.target.value }))}
              placeholder="Postcode"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Emergency Contact</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="emergencyName">Name</Label>
            <Input
              id="emergencyName"
              value={formData.emergencyName}
              onChange={(e) => setFormData((prev) => ({ ...prev, emergencyName: e.target.value }))}
              placeholder="Emergency contact name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyRelationship">Relationship</Label>
            <Input
              id="emergencyRelationship"
              value={formData.emergencyRelationship}
              onChange={(e) => setFormData((prev) => ({ ...prev, emergencyRelationship: e.target.value }))}
              placeholder="e.g., Spouse, Parent"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="emergencyPhone">Phone</Label>
            <Input
              id="emergencyPhone"
              value={formData.emergencyPhone}
              onChange={(e) => setFormData((prev) => ({ ...prev, emergencyPhone: e.target.value }))}
              placeholder="+44 ..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Banking Details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="accountName">Account Name</Label>
            <Input
              id="accountName"
              value={formData.accountName}
              onChange={(e) => setFormData((prev) => ({ ...prev, accountName: e.target.value }))}
              placeholder="Account holder name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bankName">Bank Name</Label>
            <Input
              id="bankName"
              value={formData.bankName}
              onChange={(e) => setFormData((prev) => ({ ...prev, bankName: e.target.value }))}
              placeholder="Bank name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="sortCode">Sort Code</Label>
            <Input
              id="sortCode"
              value={formData.sortCode}
              onChange={(e) => setFormData((prev) => ({ ...prev, sortCode: e.target.value }))}
              placeholder="12-34-56"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="accountNumber">Account Number</Label>
            <Input
              id="accountNumber"
              value={formData.accountNumber}
              onChange={(e) => setFormData((prev) => ({ ...prev, accountNumber: e.target.value }))}
              placeholder="12345678"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Employment</h3>
        <div className="grid gap-4 sm:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="contractType">Contract Type</Label>
            <Select
              value={formData.contractType}
              onValueChange={(value: any) => setFormData((prev) => ({ ...prev, contractType: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Freelance">Freelance</SelectItem>
                <SelectItem value="Part-time">Part-time</SelectItem>
                <SelectItem value="Full-time">Full-time</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="startDate">Start Date</Label>
            <Input
              id="startDate"
              type="date"
              value={formData.startDate}
              onChange={(e) => setFormData((prev) => ({ ...prev, startDate: e.target.value }))}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hourlyRate">Hourly Rate (if applicable)</Label>
            <Input
              id="hourlyRate"
              value={formData.hourlyRate}
              onChange={(e) => setFormData((prev) => ({ ...prev, hourlyRate: e.target.value }))}
              placeholder="£45/hour"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Right to Work</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="rightToWorkStatus">Status</Label>
            <Select
              value={formData.rightToWorkStatus}
              onValueChange={(value: any) => setFormData((prev) => ({ ...prev, rightToWorkStatus: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Verified">Verified</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Expired">Expired</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="documentType">Document Type</Label>
            <Input
              id="documentType"
              value={formData.documentType}
              onChange={(e) => setFormData((prev) => ({ ...prev, documentType: e.target.value }))}
              placeholder="e.g., UK Passport, Visa"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Skills & Locations</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="skills">Skills (comma separated)</Label>
            <Input
              id="skills"
              value={formData.skills}
              onChange={(e) => setFormData((prev) => ({ ...prev, skills: e.target.value }))}
              placeholder="Nail Gels, Manicure, Pedicure..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="baseLocation">Base Location</Label>
            <Input
              id="baseLocation"
              value={formData.baseLocation}
              onChange={(e) => setFormData((prev) => ({ ...prev, baseLocation: e.target.value }))}
              placeholder="Sheffield"
            />
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="availableLocations">Available Locations (comma separated)</Label>
            <Input
              id="availableLocations"
              value={formData.availableLocations}
              onChange={(e) => setFormData((prev) => ({ ...prev, availableLocations: e.target.value }))}
              placeholder="Sheffield, Leeds, Manchester..."
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Additional Information</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select
              value={formData.status}
              onValueChange={(value: any) => setFormData((prev) => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2 sm:col-span-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional notes about this educator..."
              rows={3}
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => window.open("", "_self")}>
          Cancel
        </Button>
        <Button onClick={handleSubmit}>Add Educator</Button>
      </div>
    </div>
  )
}
