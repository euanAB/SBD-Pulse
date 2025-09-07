"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import {
  User,
  Phone,
  FileText,
  CheckCircle,
  Upload,
  MapPin,
  Calendar,
  Mail,
  Shield,
  Camera,
  Users,
  Heart,
} from "lucide-react"

export default function StudentRegistrationPage() {
  const [step, setStep] = React.useState(1)
  const [formData, setFormData] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    emergencyName: "",
    emergencyPhone: "",
    emergencyRelation: "",
    medicalConditions: "",
    allergies: "",
    medications: "",
    employmentStatus: "",
    employer: "",
    previousEducation: "",
    learningGoals: "",
    hearAboutUs: "",
    marketingConsent: false,
    termsAccepted: false,
  })

  const progress = (step / 6) * 100

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const canProceed = () => {
    switch (step) {
      case 1:
        return formData.firstName && formData.lastName && formData.email && formData.phone && formData.dateOfBirth
      case 2:
        return formData.address
      case 3:
        return formData.emergencyName && formData.emergencyPhone && formData.emergencyRelation
      case 4:
        return true // Medical info is optional
      case 5:
        return true // Documents uploaded (would check file state in real app)
      case 6:
        return formData.termsAccepted
      default:
        return false
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/30 via-white to-indigo-50/30 p-6">
      <div className="mx-auto max-w-4xl space-y-6">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 text-blue-700 rounded-full text-sm font-medium">
            <User className="h-4 w-4" />
            Complete Your Profile
          </div>
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Pulse Academy</h1>
          <p className="text-gray-600 text-lg">Let's get you set up with a personalized learning experience</p>

          <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
            <div className="flex-1">
              <Progress value={progress} className="h-3" />
            </div>
            <div className="text-sm font-medium text-gray-600">
              Step {step} of 6 • {Math.round(progress)}% Complete
            </div>
          </div>

          {/* Step indicators */}
          <div className="flex justify-center gap-2 mt-4">
            {[1, 2, 3, 4, 5, 6].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-3 h-3 rounded-full transition-colors ${
                  stepNum < step ? "bg-green-500" : stepNum === step ? "bg-blue-500" : "bg-gray-200"
                }`}
              />
            ))}
          </div>
        </div>

        {step === 1 && <PersonalDetails formData={formData} onChange={handleInputChange} />}
        {step === 2 && <AddressVerification formData={formData} onChange={handleInputChange} />}
        {step === 3 && <EmergencyContact formData={formData} onChange={handleInputChange} />}
        {step === 4 && <MedicalInformation formData={formData} onChange={handleInputChange} />}
        {step === 5 && <DocumentUpload />}
        {step === 6 && <FinalReview formData={formData} onChange={handleInputChange} />}

        <div className="flex justify-between items-center pt-6">
          <Button
            variant="outline"
            onClick={() => setStep((s) => Math.max(1, s - 1))}
            disabled={step === 1}
            className="px-6"
          >
            Back
          </Button>

          <div className="text-sm text-gray-500">{step < 6 ? `${6 - step} steps remaining` : "Ready to submit"}</div>

          <Button
            onClick={() => {
              if (step === 6) {
                // Handle form submission
                console.log("Form submitted:", formData)
              } else {
                setStep((s) => Math.min(6, s + 1))
              }
            }}
            disabled={!canProceed()}
            className="px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
          >
            {step === 6 ? "Complete Registration" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  )
}

function PersonalDetails({ formData, onChange }: { formData: any; onChange: (field: string, value: string) => void }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
          <User className="h-6 w-6 text-blue-600" />
        </div>
        <CardTitle className="text-xl">Personal Information</CardTitle>
        <p className="text-gray-600">Tell us about yourself to personalize your learning experience</p>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="firstName" className="text-sm font-medium">
            First Name *
          </Label>
          <Input
            id="firstName"
            placeholder="Enter your first name"
            value={formData.firstName}
            onChange={(e) => onChange("firstName", e.target.value)}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName" className="text-sm font-medium">
            Last Name *
          </Label>
          <Input
            id="lastName"
            placeholder="Enter your last name"
            value={formData.lastName}
            onChange={(e) => onChange("lastName", e.target.value)}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address *
          </Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="email"
              type="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={(e) => onChange("email", e.target.value)}
              className="h-11 pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="phone" className="text-sm font-medium">
            Phone Number *
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="phone"
              placeholder="+44 7XXX XXX XXX"
              value={formData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              className="h-11 pl-10"
            />
          </div>
        </div>
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="dateOfBirth" className="text-sm font-medium">
            Date of Birth *
          </Label>
          <div className="relative">
            <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="dateOfBirth"
              type="date"
              value={formData.dateOfBirth}
              onChange={(e) => onChange("dateOfBirth", e.target.value)}
              className="h-11 pl-10"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AddressVerification({
  formData,
  onChange,
}: { formData: any; onChange: (field: string, value: string) => void }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
          <MapPin className="h-6 w-6 text-green-600" />
        </div>
        <CardTitle className="text-xl">Address Information</CardTitle>
        <p className="text-gray-600">We need your address for course location recommendations</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="address" className="text-sm font-medium">
            Full Address *
          </Label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Textarea
              id="address"
              placeholder="Start typing your address..."
              value={formData.address}
              onChange={(e) => onChange("address", e.target.value)}
              className="pl-10 min-h-[80px]"
            />
          </div>
          <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
            Address autocomplete integration will be implemented here
          </div>
        </div>

        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            Your address is used only for course location recommendations and emergency contact purposes. We never share
            your personal information with third parties.
          </AlertDescription>
        </Alert>
      </CardContent>
    </Card>
  )
}

function EmergencyContact({ formData, onChange }: { formData: any; onChange: (field: string, value: string) => void }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-3">
          <Heart className="h-6 w-6 text-red-600" />
        </div>
        <CardTitle className="text-xl">Emergency Contact</CardTitle>
        <p className="text-gray-600">Someone we can contact in case of emergency during your courses</p>
      </CardHeader>
      <CardContent className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="emergencyName" className="text-sm font-medium">
            Emergency Contact Name *
          </Label>
          <Input
            id="emergencyName"
            placeholder="Full name of emergency contact"
            value={formData.emergencyName}
            onChange={(e) => onChange("emergencyName", e.target.value)}
            className="h-11"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyPhone" className="text-sm font-medium">
            Emergency Contact Phone *
          </Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              id="emergencyPhone"
              placeholder="+44 7XXX XXX XXX"
              value={formData.emergencyPhone}
              onChange={(e) => onChange("emergencyPhone", e.target.value)}
              className="h-11 pl-10"
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="emergencyRelation" className="text-sm font-medium">
            Relationship *
          </Label>
          <Select value={formData.emergencyRelation} onValueChange={(value) => onChange("emergencyRelation", value)}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Select relationship" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="parent">Parent</SelectItem>
              <SelectItem value="spouse">Spouse/Partner</SelectItem>
              <SelectItem value="sibling">Sibling</SelectItem>
              <SelectItem value="friend">Friend</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}

function MedicalInformation({
  formData,
  onChange,
}: { formData: any; onChange: (field: string, value: string) => void }) {
  return (
    <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-3">
          <Heart className="h-6 w-6 text-purple-600" />
        </div>
        <CardTitle className="text-xl">Medical Information</CardTitle>
        <p className="text-gray-600">Help us ensure your safety during practical training sessions</p>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Shield className="h-4 w-4" />
          <AlertDescription>
            This information is optional but helps our instructors provide appropriate support during training. All
            medical information is kept strictly confidential.
          </AlertDescription>
        </Alert>

        <div className="space-y-2">
          <Label htmlFor="medicalConditions" className="text-sm font-medium">
            Medical Conditions
          </Label>
          <Textarea
            id="medicalConditions"
            placeholder="Any medical conditions we should be aware of (optional)"
            value={formData.medicalConditions}
            onChange={(e) => onChange("medicalConditions", e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="allergies" className="text-sm font-medium">
            Allergies
          </Label>
          <Textarea
            id="allergies"
            placeholder="Any allergies or dietary requirements (optional)"
            value={formData.allergies}
            onChange={(e) => onChange("allergies", e.target.value)}
            className="min-h-[80px]"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="medications" className="text-sm font-medium">
            Current Medications
          </Label>
          <Textarea
            id="medications"
            placeholder="Any medications you're currently taking (optional)"
            value={formData.medications}
            onChange={(e) => onChange("medications", e.target.value)}
            className="min-h-[80px]"
          />
        </div>
      </CardContent>
    </Card>
  )
}

function DocumentUpload() {
  const [documents, setDocuments] = React.useState({
    idFront: null as File | null,
    idBack: null as File | null,
    selfie: null as File | null,
  })

  const [otpSent, setOtpSent] = React.useState(false)
  const [otpVerified, setOtpVerified] = React.useState(false)

  return (
    <div className="space-y-6">
      {/* Phone Verification */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
            <Phone className="h-6 w-6 text-orange-600" />
          </div>
          <CardTitle className="text-xl">Phone Verification</CardTitle>
          <p className="text-gray-600">Verify your phone number to secure your account</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {!otpSent ? (
            <div className="text-center space-y-4">
              <p className="text-sm text-gray-600">We'll send a verification code to your phone number</p>
              <Button onClick={() => setOtpSent(true)} className="bg-orange-600 hover:bg-orange-700">
                Send Verification Code
              </Button>
            </div>
          ) : !otpVerified ? (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="otp" className="text-sm font-medium">
                  Enter 6-digit code
                </Label>
                <Input
                  id="otp"
                  inputMode="numeric"
                  maxLength={6}
                  placeholder="123456"
                  className="h-11 text-center text-lg tracking-widest"
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={() => setOtpVerified(true)} className="flex-1 bg-green-600 hover:bg-green-700">
                  Verify Code
                </Button>
                <Button variant="outline">Resend</Button>
              </div>
            </div>
          ) : (
            <div className="text-center space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                <CheckCircle className="h-4 w-4" />
                Phone Verified
              </div>
            </div>
          )}
          <div className="text-xs text-blue-600 bg-blue-50 p-2 rounded">
            ClickSend SMS integration will be implemented here
          </div>
        </CardContent>
      </Card>

      {/* Document Upload */}
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
            <FileText className="h-6 w-6 text-indigo-600" />
          </div>
          <CardTitle className="text-xl">Identity Verification</CardTitle>
          <p className="text-gray-600">Upload your ID documents for account verification</p>
        </CardHeader>
        <CardContent className="grid gap-6 sm:grid-cols-3">
          <DocumentField
            label="ID - Front"
            icon={<FileText className="h-5 w-5" />}
            file={documents.idFront}
            onChange={(file) => setDocuments((prev) => ({ ...prev, idFront: file }))}
          />
          <DocumentField
            label="ID - Back"
            icon={<FileText className="h-5 w-5" />}
            file={documents.idBack}
            onChange={(file) => setDocuments((prev) => ({ ...prev, idBack: file }))}
          />
          <DocumentField
            label="Selfie Photo"
            icon={<Camera className="h-5 w-5" />}
            file={documents.selfie}
            onChange={(file) => setDocuments((prev) => ({ ...prev, selfie: file }))}
          />
        </CardContent>

        <div className="px-6 pb-6">
          <Alert>
            <Shield className="h-4 w-4" />
            <AlertDescription>
              Your documents are encrypted and stored securely. They're only used for identity verification and will be
              reviewed by our admin team within 24 hours.
            </AlertDescription>
          </Alert>
        </div>
      </Card>
    </div>
  )
}

function DocumentField({
  label,
  icon,
  file,
  onChange,
}: {
  label: string
  icon: React.ReactNode
  file: File | null
  onChange: (f: File | null) => void
}) {
  return (
    <div className="space-y-3">
      <Label className="text-sm font-medium flex items-center gap-2">
        {icon}
        {label}
      </Label>
      <div className="rounded-lg border-2 border-dashed border-gray-200 p-4 text-center hover:border-gray-300 transition-colors">
        <div className="mb-3 h-32 w-full overflow-hidden rounded-lg bg-gray-50">
          {file ? (
            <div className="h-full w-full flex items-center justify-center bg-green-50">
              <div className="text-center">
                <CheckCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-green-700 font-medium">Uploaded</p>
              </div>
            </div>
          ) : (
            <div className="h-full w-full flex items-center justify-center">
              <div className="text-center">
                <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-sm text-gray-500">Click to upload</p>
              </div>
            </div>
          )}
        </div>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => onChange(e.target.files?.[0] ?? null)}
          className="cursor-pointer"
        />
      </div>
    </div>
  )
}

function FinalReview({ formData, onChange }: { formData: any; onChange: (field: string, value: boolean) => void }) {
  return (
    <div className="space-y-6">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <CheckCircle className="h-6 w-6 text-green-600" />
          </div>
          <CardTitle className="text-xl">Almost Done!</CardTitle>
          <p className="text-gray-600">Review your information and complete your registration</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Profile Summary */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-gray-900">Profile Summary</h3>
            <div className="grid gap-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Name:</span>
                <span className="font-medium">
                  {formData.firstName} {formData.lastName}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Email:</span>
                <span className="font-medium">{formData.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Phone:</span>
                <span className="font-medium">{formData.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Emergency Contact:</span>
                <span className="font-medium">{formData.emergencyName}</span>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="employmentStatus" className="text-sm font-medium">
                Employment Status
              </Label>
              <Select value={formData.employmentStatus} onValueChange={(value) => onChange("employmentStatus", value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="employed">Employed</SelectItem>
                  <SelectItem value="self-employed">Self-employed</SelectItem>
                  <SelectItem value="unemployed">Unemployed</SelectItem>
                  <SelectItem value="student">Student</SelectItem>
                  <SelectItem value="retired">Retired</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hearAboutUs" className="text-sm font-medium">
                How did you hear about us?
              </Label>
              <Select value={formData.hearAboutUs} onValueChange={(value) => onChange("hearAboutUs", value)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Select option" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="google">Google Search</SelectItem>
                  <SelectItem value="social">Social Media</SelectItem>
                  <SelectItem value="friend">Friend/Family</SelectItem>
                  <SelectItem value="employer">Employer</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="learningGoals" className="text-sm font-medium">
              Learning Goals (Optional)
            </Label>
            <Textarea
              id="learningGoals"
              placeholder="What do you hope to achieve through your training with us?"
              value={formData.learningGoals}
              onChange={(e) => onChange("learningGoals", e.target.value)}
              className="min-h-[80px]"
            />
          </div>

          {/* Consent and Terms */}
          <div className="space-y-4 border-t pt-4">
            <div className="flex items-start space-x-3">
              <Checkbox
                id="marketing"
                checked={formData.marketingConsent}
                onCheckedChange={(checked) => onChange("marketingConsent", checked as boolean)}
              />
              <Label htmlFor="marketing" className="text-sm leading-relaxed">
                I would like to receive updates about new courses, special offers, and training opportunities via email
                and SMS.
              </Label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox
                id="terms"
                checked={formData.termsAccepted}
                onCheckedChange={(checked) => onChange("termsAccepted", checked as boolean)}
              />
              <Label htmlFor="terms" className="text-sm leading-relaxed">
                I agree to the{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-blue-600 hover:underline">
                  Privacy Policy
                </a>{" "}
                *
              </Label>
            </div>
          </div>

          {/* Duplicate Check Alert */}
          <Alert>
            <Users className="h-4 w-4" />
            <AlertDescription>
              We'll check for duplicate accounts based on your name and date of birth. If a match is found, our support
              team will contact you to resolve any issues.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    </div>
  )
}
