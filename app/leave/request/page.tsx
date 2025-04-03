"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Loader2 } from "lucide-react"
import { supabase } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function RequestLeavePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [employees, setEmployees] = useState([])

  const [formData, setFormData] = useState({
    employee_id: "",
    leave_type: "",
    start_date: "",
    end_date: "",
    reason: "",
  })

  // Fetch employees when component mounts
  useEffect(() => {
    async function fetchEmployees() {
      const { data, error } = await supabase
        .from("employees")
        .select("id, full_name")
        .order("full_name", { ascending: true })

      if (error) {
        console.error("Error fetching employees:", error)
        return
      }

      setEmployees(data || [])
    }

    fetchEmployees()
  }, [])

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const calculateDays = () => {
    if (!formData.start_date || !formData.end_date) return 0

    const start = new Date(formData.start_date)
    const end = new Date(formData.end_date)

    // Calculate difference in days
    const diffTime = Math.abs(end - start)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1 // Include both start and end days

    return diffDays
  }

  const validateForm = () => {
    if (!formData.employee_id) {
      setFormError("Employee is required")
      return false
    }
    if (!formData.leave_type) {
      setFormError("Leave type is required")
      return false
    }
    if (!formData.start_date) {
      setFormError("Start date is required")
      return false
    }
    if (!formData.end_date) {
      setFormError("End date is required")
      return false
    }

    // Validate date range
    const start = new Date(formData.start_date)
    const end = new Date(formData.end_date)

    if (end < start) {
      setFormError("End date cannot be before start date")
      return false
    }

    setFormError("")
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      const days = calculateDays()

      // Submit leave request to Supabase
      const { data, error } = await supabase
        .from("leave_requests")
        .insert([
          {
            employee_id: formData.employee_id,
            leave_type: formData.leave_type,
            start_date: formData.start_date,
            end_date: formData.end_date,
            days: days,
            reason: formData.reason,
            status: "Pending",
          },
        ])
        .select()

      if (error) {
        throw error
      }

      toast({
        title: "Leave Request Submitted",
        description: `Your leave request has been submitted and is pending approval.`,
      })

      router.push("/leave")
    } catch (error) {
      console.error("Error submitting leave request:", error)
      setFormError("Failed to submit leave request. Please try again.")
      toast({
        title: "Error",
        description: "Failed to submit leave request. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
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
          <CardDescription>Submit a new leave request for approval</CardDescription>
        </CardHeader>

        {formError && (
          <div className="px-6">
            <Alert variant="destructive">
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{formError}</AlertDescription>
            </Alert>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee_id">
                  Employee <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.employee_id}
                  onValueChange={(value) => handleSelectChange("employee_id", value)}
                  required
                >
                  <SelectTrigger id="employee_id">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.full_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="leave_type">
                  Leave Type <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.leave_type}
                  onValueChange={(value) => handleSelectChange("leave_type", value)}
                  required
                >
                  <SelectTrigger id="leave_type">
                    <SelectValue placeholder="Select leave type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Annual Leave">Annual Leave</SelectItem>
                    <SelectItem value="Sick Leave">Sick Leave</SelectItem>
                    <SelectItem value="Maternity Leave">Maternity Leave</SelectItem>
                    <SelectItem value="Paternity Leave">Paternity Leave</SelectItem>
                    <SelectItem value="Study Leave">Study Leave</SelectItem>
                    <SelectItem value="Compassionate Leave">Compassionate Leave</SelectItem>
                    <SelectItem value="Unpaid Leave">Unpaid Leave</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="start_date">
                  Start Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="start_date"
                  name="start_date"
                  type="date"
                  value={formData.start_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end_date">
                  End Date <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="end_date"
                  name="end_date"
                  type="date"
                  value={formData.end_date}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <div className="flex justify-between">
                  <Label htmlFor="reason">Reason for Leave</Label>
                  <span className="text-sm text-muted-foreground">
                    {calculateDays()} day{calculateDays() !== 1 ? "s" : ""}
                  </span>
                </div>
                <Textarea
                  id="reason"
                  name="reason"
                  value={formData.reason}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Please provide details about your leave request"
                />
              </div>
            </div>
          </CardContent>

          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/leave")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
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

