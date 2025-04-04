"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { submitLeaveRequest } from "@/lib/supabase-functions" // Import the function
import { differenceInBusinessDays, parseISO } from 'date-fns'; // For day calculation

interface LeaveRequestData {
  leave_type: string
  duration_type: string // To handle full/half/multiple days logic
  start_date: string
  end_date: string
  reason: string
  handover_notes: string
}

// Helper function to calculate leave days (basic version)
function calculateLeaveDays(startDateStr: string, endDateStr: string, durationType: string): number {
  if (!startDateStr || !endDateStr) return 0;

  if (durationType.startsWith('half-day')) return 0.5;
  if (durationType === 'full-day') return 1;

  try {
    const start = parseISO(startDateStr);
    const end = parseISO(endDateStr);
    // differenceInBusinessDays excludes weekends. Add 1 because it's inclusive.
    // For a more robust calculation, consider holidays.
    const days = differenceInBusinessDays(end, start) + 1;
    return days > 0 ? days : 0; // Ensure non-negative
  } catch (error) {
    console.error("Error calculating leave days:", error);
    return 0; // Return 0 if dates are invalid
  }
}


export default function LeaveRequestPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [formData, setFormData] = useState<LeaveRequestData>({
    leave_type: "",
    duration_type: "",
    start_date: "",
    end_date: "",
    reason: "",
    handover_notes: "",
  })
  // TODO: Get actual employee ID from auth context
  const employeeId = "uuid-placeholder-employee"; // Placeholder

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: keyof LeaveRequestData) => (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
      // Reset end date if duration is not multiple days
      end_date: (name === 'duration_type' && value !== 'multiple-days') ? prevData.start_date : prevData.end_date,
    }))
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")

    console.log("Submitting Leave Request:", formData)

    try {
       // Ensure end_date is same as start_date if not multiple days
       const finalEndDate = formData.duration_type !== 'multiple-days' ? formData.start_date : formData.end_date;

       if (!formData.start_date || !finalEndDate) {
         throw new Error("Start date and end date are required.");
       }

       const leaveDays = calculateLeaveDays(formData.start_date, finalEndDate, formData.duration_type);

       if (leaveDays <= 0 && formData.duration_type === 'multiple-days') {
         throw new Error("End date must be after start date for multiple day requests.");
       }
       if (leaveDays === 0 && formData.duration_type !== 'half-day-morning' && formData.duration_type !== 'half-day-afternoon') {
         throw new Error("Could not calculate leave days. Please check dates.");
       }


      // Prepare payload for Supabase
      const payload = {
        employee_id: employeeId, // Replace with actual employee ID from auth
        leave_type: formData.leave_type,
        start_date: formData.start_date,
        end_date: finalEndDate,
        days: leaveDays,
        reason: formData.reason,
        handover_notes: formData.handover_notes || null, // Optional field
        status: "Pending", // Initial status
      }

      // Validate required fields
      if (!payload.employee_id || !payload.leave_type || !payload.start_date || !payload.end_date || payload.days === undefined || !payload.reason) {
         throw new Error("Please fill in all required fields and ensure dates are valid.")
      }

      const result = await submitLeaveRequest(payload)

      if (result) {
        setStatus("success")
        toast({
          title: "Leave request submitted",
          description: "Your leave request has been submitted successfully.",
        })
        router.push("/leave")
      } else {
        throw new Error("Failed to submit leave request to Supabase.")
      }
    } catch (error) {
      console.error("Error submitting leave request:", error)
      setStatus("error")
      toast({
        title: "Error",
        description: `There was an error submitting the request: ${error instanceof Error ? error.message : "Unknown error"}`,
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
      <Link href="/leave" className="flex items-center text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Leave Management
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Request Leave</CardTitle>
          <CardDescription>Submit a new leave request for approval.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="leave-type">Leave Type</Label>
                <Select required name="leave_type" value={formData.leave_type} onValueChange={handleSelectChange("leave_type")}>
                  <SelectTrigger id="leave-type">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="annual">Annual Leave</SelectItem>
                    <SelectItem value="sick">Sick Leave</SelectItem>
                    <SelectItem value="maternity">Maternity Leave</SelectItem>
                    <SelectItem value="paternity">Paternity Leave</SelectItem>
                    <SelectItem value="compassionate">Compassionate Leave</SelectItem>
                    <SelectItem value="unpaid">Unpaid Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <Select required name="duration_type" value={formData.duration_type} onValueChange={handleSelectChange("duration_type")}>
                  <SelectTrigger id="duration">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-day">Full Day</SelectItem>
                    <SelectItem value="half-day-morning">Half Day (Morning)</SelectItem>
                    <SelectItem value="half-day-afternoon">Half Day (Afternoon)</SelectItem>
                    <SelectItem value="multiple-days">Multiple Days</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start_date" name="start_date" type="date" required value={formData.start_date} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  required={formData.duration_type === 'multiple-days'}
                  disabled={formData.duration_type !== 'multiple-days'}
                  value={formData.duration_type === 'multiple-days' ? formData.end_date : formData.start_date}
                  min={formData.start_date} // Ensure end date is not before start date
                  onChange={handleInputChange}
                 />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="reason">Reason for Leave</Label>
                <Textarea
                  id="reason"
                  name="reason"
                  placeholder="Please provide details about your leave request"
                  className="min-h-[100px]"
                  required
                  value={formData.reason}
                  onChange={handleInputChange}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="handover">Handover Notes</Label>
                <Textarea
                  id="handover_notes"
                  name="handover_notes"
                  placeholder="Any tasks or responsibilities that need to be handled during your absence"
                  className="min-h-[100px]"
                  value={formData.handover_notes}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/leave")}>
              Cancel
            </Button>
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Request"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

