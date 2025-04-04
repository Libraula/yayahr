"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { submitStatutoryReport } from "@/lib/supabase-functions" // Import the function

interface ComplianceReportData {
  report_type: string
  report_date: string
  report_title: string
  description: string
  severity: string
  location: string
  people_involved: string
  action_taken: string
  anonymous: boolean
}

export default function NewComplianceReportPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [reportData, setReportData] = useState<ComplianceReportData>({
    report_type: "",
    report_date: "",
    report_title: "",
    description: "",
    severity: "medium", // Default severity
    location: "",
    people_involved: "",
    action_taken: "",
    anonymous: false, // Default anonymous to false
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setReportData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: keyof ComplianceReportData) => (value: string) => {
    setReportData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleRadioChange = (name: keyof ComplianceReportData) => (value: string) => {
    setReportData((prevData) => ({
      ...prevData,
      [name]: name === 'anonymous' ? value === 'yes' : value, // Convert anonymous 'yes'/'no' to boolean
    }))
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")

    console.log("Submitting Compliance Report:", reportData)

    try {
      // Prepare payload - ensure data types match expected schema if necessary
      const payload = {
        ...reportData,
        // Add user_id if needed and available from auth context
        // submitted_by: auth.user?.id, // Example
        submission_date: new Date().toISOString(), // Add submission timestamp
        status: 'submitted', // Initial status
      }

      const result = await submitStatutoryReport(payload) // Use the imported function

      if (result) {
        setStatus("success")
        toast({
          title: "Compliance report submitted",
          description: "Your compliance report has been submitted successfully.",
        })
        router.push("/compliance")
      } else {
        throw new Error("Failed to submit compliance report to Supabase.")
      }
    } catch (error) {
      console.error("Error submitting compliance report:", error)
      setStatus("error")
      toast({
        title: "Error",
        description: `There was an error submitting the report: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      if (status === "success" || status === "error") {
        setStatus("idle")
      }
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Link href="/compliance" className="flex items-center text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Compliance
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>New Compliance Report</CardTitle>
          <CardDescription>Submit a new compliance report or incident.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="report-type">Report Type</Label>
                <Select required name="report_type" value={reportData.report_type} onValueChange={handleSelectChange("report_type")}>
                  <SelectTrigger id="report-type">
                    <SelectValue placeholder="Select report type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incident">Workplace Incident</SelectItem>
                    <SelectItem value="harassment">Harassment or Discrimination</SelectItem>
                    <SelectItem value="safety">Health & Safety Concern</SelectItem>
                    <SelectItem value="ethics">Ethics Violation</SelectItem>
                    <SelectItem value="regulatory">Regulatory Compliance Issue</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="report-date">Date of Incident/Issue</Label>
                <Input id="report_date" name="report_date" type="date" required value={reportData.report_date} onChange={handleInputChange} />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="report-title">Report Title</Label>
                <Input id="report_title" name="report_title" placeholder="Brief title describing the issue" required value={reportData.report_title} onChange={handleInputChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide a detailed description of the incident or compliance issue"
                className="min-h-[150px]"
                required
                value={reportData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Severity Level</Label>
              <RadioGroup name="severity" value={reportData.severity} onValueChange={handleRadioChange("severity")}>
                <div className="flex flex-col space-y-2 sm:flex-row sm:space-y-0 sm:space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="low" id="severity-low" />
                    <Label htmlFor="severity-low">Low</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="medium" id="severity-medium" />
                    <Label htmlFor="severity-medium">Medium</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="high" id="severity-high" />
                    <Label htmlFor="severity-high">High</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="critical" id="severity-critical" />
                    <Label htmlFor="severity-critical">Critical</Label>
                  </div>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input id="location" name="location" placeholder="Where did this incident occur?" required value={reportData.location} onChange={handleInputChange} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="people-involved">People Involved</Label>
              <Textarea
                id="people_involved"
                name="people_involved"
                placeholder="List names and roles of people involved or witnesses"
                className="min-h-[100px]"
                value={reportData.people_involved}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="action-taken">Action Already Taken</Label>
              <Textarea
                id="action_taken"
                name="action_taken"
                placeholder="Describe any actions already taken to address this issue"
                className="min-h-[100px]"
                value={reportData.action_taken}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label>Anonymous Report</Label>
              <RadioGroup name="anonymous" value={reportData.anonymous ? 'yes' : 'no'} onValueChange={handleRadioChange("anonymous")}>
                <div className="flex space-x-4">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="yes" id="anonymous-yes" />
                    <Label htmlFor="anonymous-yes">Yes</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="no" id="anonymous-no" />
                    <Label htmlFor="anonymous-no">No</Label>
                  </div>
                </div>
              </RadioGroup>
              <p className="text-sm text-muted-foreground">
                Anonymous reports will not include your identity, but may limit our ability to follow up.
              </p>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/compliance")}>
              Cancel
            </Button>
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Report"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

