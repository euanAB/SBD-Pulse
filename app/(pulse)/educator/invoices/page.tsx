"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Upload, Search, FileText, Clock, CheckCircle, XCircle, PoundSterlingIcon as Pound } from "lucide-react"
import { Textarea } from "@/components/ui/textarea"

export default function EducatorInvoicesPage() {
  const [file, setFile] = React.useState<File | null>(null)
  const [amount, setAmount] = React.useState("")
  const [selectedClass, setSelectedClass] = React.useState("")
  const [category, setCategory] = React.useState("")
  const [classSearch, setClassSearch] = React.useState("")
  const [description, setDescription] = React.useState("")

  // Mock data for classes
  const classes = [
    { id: "C-079", name: "First Aid Level 2", location: "Manchester Central", date: "2024-08-15" },
    { id: "C-087", name: "Safeguarding Basics", location: "Birmingham Hub", date: "2024-08-22" },
    { id: "C-092", name: "CPR Essentials", location: "London Bridge", date: "2024-08-29" },
    { id: "C-105", name: "Mental Health First Aid", location: "Leeds Training Centre", date: "2024-09-05" },
    { id: "C-118", name: "Food Safety Level 2", location: "Bristol Academy", date: "2024-09-12" },
  ]

  // Mock invoice history data
  const invoiceHistory = [
    {
      id: "INV-001",
      class: "C-079 First Aid Level 2",
      amount: "£450.00",
      category: "Teaching Fee",
      status: "approved_paid",
      submittedDate: "2024-08-01",
      processedDate: "2024-08-05",
      description: "Teaching fee for First Aid Level 2 course",
    },
    {
      id: "INV-002",
      class: "C-087 Safeguarding Basics",
      amount: "£390.00",
      category: "Teaching Fee",
      status: "approved_pending",
      submittedDate: "2024-08-08",
      processedDate: null,
      description: "Teaching fee for Safeguarding Basics course",
    },
    {
      id: "INV-003",
      class: "C-092 CPR Essentials",
      amount: "£125.50",
      category: "Materials",
      status: "pending",
      submittedDate: "2024-08-12",
      processedDate: null,
      description: "Course materials and supplies",
    },
    {
      id: "INV-004",
      class: "C-079 First Aid Level 2",
      amount: "£75.00",
      category: "Travel",
      status: "rejected",
      submittedDate: "2024-07-28",
      processedDate: "2024-07-30",
      description: "Travel expenses - insufficient documentation",
    },
  ]

  const filteredClasses = classes.filter(
    (cls) =>
      cls.name.toLowerCase().includes(classSearch.toLowerCase()) ||
      cls.id.toLowerCase().includes(classSearch.toLowerCase()),
  )

  function onDrop(e: React.DragEvent<HTMLDivElement>) {
    e.preventDefault()
    const f = e.dataTransfer.files?.[0]
    if (f && f.type === "application/pdf") {
      setFile(f)
    }
  }

  function getStatusBadge(status: string) {
    switch (status) {
      case "approved_paid":
        return (
          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
            <CheckCircle className="w-3 h-3 mr-1" />
            Paid
          </Badge>
        )
      case "approved_pending":
        return (
          <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-100">
            <Clock className="w-3 h-3 mr-1" />
            Approved - Pending Payment
          </Badge>
        )
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-100">
            <Clock className="w-3 h-3 mr-1" />
            Under Review
          </Badge>
        )
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 hover:bg-red-100">
            <XCircle className="w-3 h-3 mr-1" />
            Rejected
          </Badge>
        )
      default:
        return <Badge variant="secondary">Unknown</Badge>
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    // Handle form submission
    console.log({
      file,
      amount,
      selectedClass,
      category,
      description,
    })
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Submit New Invoice</CardTitle>
          <CardDescription>Upload your invoice PDF and provide the necessary details for processing.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* PDF Upload */}
            <div className="space-y-2">
              <Label>Invoice PDF *</Label>
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={onDrop}
                className="flex flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-muted-foreground/25 p-8 text-center transition-colors hover:border-muted-foreground/50"
              >
                <Upload className="h-8 w-8 text-muted-foreground" />
                <div className="space-y-1">
                  <div className="text-sm font-medium">{file ? file.name : "Drag & drop your invoice PDF here"}</div>
                  <div className="text-xs text-muted-foreground">or click to browse files (PDF only)</div>
                </div>
                <Input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => setFile(e.target.files?.[0] ?? null)}
                  className="hidden"
                  id="file-upload"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => document.getElementById("file-upload")?.click()}
                >
                  Browse Files
                </Button>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {/* Amount */}
              <div className="space-y-2">
                <Label htmlFor="amount">Invoice Amount *</Label>
                <div className="relative">
                  <Pound className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    id="amount"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Invoice Category *</Label>
                <Select value={category} onValueChange={setCategory} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="teaching">Teaching Fee</SelectItem>
                    <SelectItem value="materials">Course Materials</SelectItem>
                    <SelectItem value="travel">Travel Expenses</SelectItem>
                    <SelectItem value="accommodation">Accommodation</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Class Search and Selection */}
            <div className="space-y-2">
              <Label>Assign to Class *</Label>
              <div className="space-y-2">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Search classes by name or ID..."
                    value={classSearch}
                    onChange={(e) => setClassSearch(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={selectedClass} onValueChange={setSelectedClass} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a class" />
                  </SelectTrigger>
                  <SelectContent>
                    {filteredClasses.map((cls) => (
                      <SelectItem key={cls.id} value={cls.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">
                            {cls.id} - {cls.name}
                          </span>
                          <span className="text-xs text-muted-foreground">
                            {cls.location} • {cls.date}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Additional details about this invoice..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={3}
              />
            </div>

            <Button type="submit" className="w-full" disabled={!file || !amount || !selectedClass || !category}>
              Submit Invoice
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Invoice History</CardTitle>
          <CardDescription>Track all your submitted invoices and their payment status.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {invoiceHistory.map((invoice) => (
            <div key={invoice.id} className="flex items-start justify-between rounded-lg border p-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{invoice.id}</span>
                  {getStatusBadge(invoice.status)}
                </div>
                <div>
                  <div className="font-medium">{invoice.class}</div>
                  <div className="text-sm text-muted-foreground">{invoice.description}</div>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span>
                    Amount: <span className="font-medium text-foreground">{invoice.amount}</span>
                  </span>
                  <span>
                    Category: <span className="font-medium text-foreground">{invoice.category}</span>
                  </span>
                  <span>Submitted: {invoice.submittedDate}</span>
                  {invoice.processedDate && <span>Processed: {invoice.processedDate}</span>}
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  View PDF
                </Button>
                {invoice.status === "approved_paid" && (
                  <Button variant="outline" size="sm">
                    Receipt
                  </Button>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
