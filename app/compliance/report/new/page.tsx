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

export default function NewComplianceReportPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")

    // Simulate API call
    setTimeout(() => {
      setStatus("success")
      toast({
        title: "Compliance report submitted",
        description: "Your compliance report has been submitted successfully.",
      })
      router.push("/compliance")
    }, 1500)
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
                <Select required>
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
                <Input id="report-date" type="date" required />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="report-title">Report Title</Label>
                <Input id="report-title" placeholder="Brief title describing the issue" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of the incident or compliance issue"
                className="min-h-[150px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Severity Level</Label>
              <RadioGroup defaultValue="medium">
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
              <Input id="location" placeholder="Where did this incident occur?" required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="people-involved">People Involved</Label>
              <Textarea
                id="people-involved"
                placeholder="List names and roles of people involved or witnesses"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="action-taken">Action Already Taken</Label>
              <Textarea
                id="action-taken"
                placeholder="Describe any actions already taken to address this issue"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label>Anonymous Report</Label>
              <RadioGroup defaultValue="no">
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

