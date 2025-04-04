"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2, FileText, Download } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"

export default function GenerateReportPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [formError, setFormError] = useState("")
  const [reportGenerated, setReportGenerated] = useState(false)
  const [reportType, setReportType] = useState("employee_directory")

  const [formData, setFormData] = useState({
    report_name: "",
    period: "this_month",
    custom_start_date: "",
    custom_end_date: "",
    format: "pdf",
    include_charts: true,
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleReportTypeChange = (value: string) => {
    setReportType(value)

    // Set default report name based on report type
    const reportNames: Record<string, string> = {
      employee_directory: "Employee Directory",
      payroll_summary: "Payroll Summary",
      leave_balance: "Leave Balance Report",
      attendance_summary: "Attendance Summary",
      performance_review: "Performance Review Summary",
      turnover_analysis: "Employee Turnover Analysis",
      recruitment_metrics: "Recruitment Metrics Report",
    }

    setFormData((prev) => ({
      ...prev,
      report_name: reportNames[value] || "",
    }))
  }

  const validateForm = () => {
    if (!formData.report_name) {
      setFormError("Report name is required")
      return false
    }

    if (formData.period === "custom" && (!formData.custom_start_date || !formData.custom_end_date)) {
      setFormError("Custom date range requires both start and end dates")
      return false
    }

    if (formData.period === "custom") {
      const startDate = new Date(formData.custom_start_date)
      const endDate = new Date(formData.custom_end_date)

      if (endDate < startDate) {
        setFormError("End date cannot be before start date")
        return false
      }
    }

    setFormError("")
    return true
  }

  const handleGenerateReport = async () => {
    if (!validateForm()) {
      return
    }

    setIsGenerating(true)

    try {
      // Simulate report generation
      await new Promise((resolve) => setTimeout(resolve, 2000))

      setReportGenerated(true)

      toast({
        title: "Report Generated",
        description: `${formData.report_name} has been generated successfully.`,
      })
    } catch (error: any) {
      console.error("Error generating report:", error)
      setFormError(error.message || "Failed to generate report. Please try again.")
      toast({
        title: "Error",
        description: "Failed to generate report. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsGenerating(false)
    }
  }

  const getReportDescription = () => {
    const descriptions: Record<string, string> = {
      employee_directory: "Complete list of all employees with contact details and department information",
      payroll_summary: "Monthly payroll summary with deductions and allowances",
      leave_balance: "Employee leave balances and usage report",
      attendance_summary: "Monthly attendance and time tracking report",
      performance_review: "Employee performance ratings and feedback summary",
      turnover_analysis: "Analysis of employee turnover rates and trends",
      recruitment_metrics: "Recruitment funnel and hiring metrics report",
    }

    return descriptions[reportType] || ""
  }

  return (
    <div className="container mx-auto py-6">
      <Link href="/analytics" className="flex items-center text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Reports & Analytics
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Generate Report</CardTitle>
          <CardDescription>Create and download HR analytics reports</CardDescription>
        </CardHeader>

        {formError && (
          <div className="px-6">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          </div>
        )}

        {reportGenerated && (
          <div className="px-6 mb-4">
            <Alert>
              <FileText className="h-4 w-4" />
              <AlertTitle>Report Generated</AlertTitle>
              <AlertDescription>The report has been generated successfully. You can now download it.</AlertDescription>
            </Alert>
          </div>
        )}

        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label>Report Type</Label>
              <RadioGroup
                value={reportType}
                onValueChange={handleReportTypeChange}
                className="grid grid-cols-1 md:grid-cols-2 gap-2"
              >
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="employee_directory" id="employee_directory" />
                  <Label htmlFor="employee_directory" className="font-normal">
                    Employee Directory
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="payroll_summary" id="payroll_summary" />
                  <Label htmlFor="payroll_summary" className="font-normal">
                    Payroll Summary
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="leave_balance" id="leave_balance" />
                  <Label htmlFor="leave_balance" className="font-normal">
                    Leave Balance
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="attendance_summary" id="attendance_summary" />
                  <Label htmlFor="attendance_summary" className="font-normal">
                    Attendance Summary
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="performance_review" id="performance_review" />
                  <Label htmlFor="performance_review" className="font-normal">
                    Performance Review
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="turnover_analysis" id="turnover_analysis" />
                  <Label htmlFor="turnover_analysis" className="font-normal">
                    Turnover Analysis
                  </Label>
                </div>
                <div className="flex items-center space-x-2 border rounded-md p-3">
                  <RadioGroupItem value="recruitment_metrics" id="recruitment_metrics" />
                  <Label htmlFor="recruitment_metrics" className="font-normal">
                    Recruitment Metrics
                  </Label>
                </div>
              </RadioGroup>
              <p className="text-sm text-muted-foreground">{getReportDescription()}</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report_name">
                Report Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="report_name"
                name="report_name"
                value={formData.report_name}
                onChange={handleChange}
                placeholder="Enter a name for this report"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="period">Report Period</Label>
              <Select value={formData.period} onValueChange={(value) => handleSelectChange("period", value)}>
                <SelectTrigger id="period">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="this_month">This Month</SelectItem>
                  <SelectItem value="last_month">Last Month</SelectItem>
                  <SelectItem value="this_quarter">This Quarter</SelectItem>
                  <SelectItem value="last_quarter">Last Quarter</SelectItem>
                  <SelectItem value="this_year">This Year</SelectItem>
                  <SelectItem value="last_year">Last Year</SelectItem>
                  <SelectItem value="custom">Custom Range</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {formData.period === "custom" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="custom_start_date">
                    Start Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="custom_start_date"
                    name="custom_start_date"
                    type="date"
                    value={formData.custom_start_date}
                    onChange={handleChange}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="custom_end_date">
                    End Date <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="custom_end_date"
                    name="custom_end_date"
                    type="date"
                    value={formData.custom_end_date}
                    onChange={handleChange}
                  />
                </div>
              </>
            )}

            <div className="space-y-2">
              <Label htmlFor="format">Report Format</Label>
              <Select value={formData.format} onValueChange={(value) => handleSelectChange("format", value)}>
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pdf">PDF</SelectItem>
                  <SelectItem value="excel">Excel</SelectItem>
                  <SelectItem value="csv">CSV</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="include_charts"
                checked={formData.include_charts}
                onChange={(e) => setFormData((prev) => ({ ...prev, include_charts: e.target.checked }))}
                className="rounded border-gray-300"
              />
              <Label htmlFor="include_charts" className="text-sm font-normal">
                Include charts and visualizations
              </Label>
            </div>
          </div>

          <div className="flex justify-center pt-4">
            <Button type="button" onClick={handleGenerateReport} disabled={isGenerating} className="w-full md:w-auto">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <FileText className="mr-2 h-4 w-4" />
                  Generate Report
                </>
              )}
            </Button>
          </div>

          {reportGenerated && (
            <div className="flex justify-center">
              <Button type="button" variant="outline" className="w-full md:w-auto">
                <Download className="mr-2 h-4 w-4" />
                Download Report
              </Button>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/analytics")}>
            Cancel
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

