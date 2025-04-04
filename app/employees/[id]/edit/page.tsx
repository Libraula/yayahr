"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft } from "lucide-react"
import { fetchEmployee } from "@/lib/supabase" // fetchEmployee is in supabase.ts
import { updateEmployeeCore, updateEmployeeContact } from "@/lib/supabase-functions" // Import new update functions
import { toast } from "@/components/ui/use-toast"

export default function EditEmployee({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("personal")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const [formData, setFormData] = useState({
    // Personal Information
    full_name: "",
    date_of_birth: "",
    gender: "",
    nationality: "",
    marital_status: "",
    residential_address: "",
    contact_number: "",
    email: "",
    emergency_contact_name: "",
    emergency_contact_relationship: "",
    emergency_contact_number: "",

    // Identification & Legal Documents
    national_id: "",
    passport_number: "",
    nssf_number: "",
    tin_number: "",
    work_permit_number: "",

    // Employment Details
    employee_id: "",
    job_title: "",
    department: "",
    employment_type: "",
    date_of_employment: "",
    probation_period: "",
    reporting_manager: "",
    job_grade: "",

    // Payroll & Compensation
    bank_name: "",
    bank_account_number: "",
    salary_structure: "",
    paye_tax_bracket: "",
    overtime_rate: "",
    bonuses_commissions: "",
    deductions: "",

    // Attendance & Leave
    working_hours: "",
    annual_leave_balance: "",
    sick_leave_balance: "",
    maternity_paternity_leave_balance: "",
    last_leave_taken: "",

    // Performance & Training
    kpis: "",
    last_appraisal_date: "",
    training_certifications: "",
    promotions_disciplinary: "",

    // Status
    status: "",
  })

  useEffect(() => {
    async function loadEmployee() {
      try {
        const employee = await fetchEmployee(params.id)
        if (employee) {
          // Map fetched data (using new field names from fetchEmployee) to formData state
          // Ensure all fields expected by the form state are populated here
          setFormData({
            full_name: employee.full_name || "",
            date_of_birth: employee.date_of_birth ? employee.date_of_birth.split("T")[0] : "", // Assuming date_of_birth is fetched if needed
            gender: employee.gender || "", // Assuming gender is fetched if needed
            nationality: employee.nationality || "", // Fetched from permit
            marital_status: employee.marital_status || "", // Assuming marital_status is fetched if needed
            residential_address: employee.residential_address || "", // Assuming address is fetched if needed
            contact_number: employee.phone_number || "", // Use phone_number
            email: employee.email || "",
            emergency_contact_name: employee.emergency_contact_name || "",
            emergency_contact_relationship: employee.emergency_contact_relationship || "",
            emergency_contact_number: employee.emergency_contact_number || "",

            national_id: employee.national_id || "",
            passport_number: employee.passport_number || "", // Assuming passport_number is fetched if needed
            nssf_number: employee.nssf_number || "",
            tin_number: employee.tin_number || "",
            work_permit_number: employee.work_permit_number || "", // Fetched from permit

            employee_id: employee.employee_id || "",
            job_title: employee.job_title || "", // Assuming job_title is fetched if needed
            department: employee.department_name || "", // Use department_name
            employment_type: employee.employment_type || "",
            date_of_employment: employee.date_of_employment ? employee.date_of_employment.split("T")[0] : "", // Assuming date_of_employment is fetched
            probation_period: employee.probation_period !== null ? String(employee.probation_period) : "", // Assuming probation_period is fetched
            reporting_manager: employee.reporting_manager_id || "", // Store manager ID for now, need name lookup for display
            job_grade: employee.job_grade_name || "", // Use job_grade_name

            bank_name: employee.bank_name || "",
            bank_account_number: employee.bank_account_number || "",
            salary_structure: employee.salary_structure || "", // Assuming salary_structure is fetched
            paye_tax_bracket: employee.paye_tax_bracket || "", // Assuming paye_tax_bracket is fetched
            overtime_rate: employee.overtime_rate || "", // Assuming overtime_rate is fetched
            bonuses_commissions: employee.bonuses_commissions || "", // Assuming bonuses_commissions is fetched
            deductions: employee.deductions || "", // Assuming deductions is fetched

            working_hours: employee.working_hours || "", // Assuming working_hours is fetched
            // Leave balances need separate fetch
            annual_leave_balance: "",
            sick_leave_balance: "",
            maternity_paternity_leave_balance: "",
            last_leave_taken: "",

            // Performance fields need separate fetch
            kpis: "",
            last_appraisal_date: "",
            training_certifications: "",
            promotions_disciplinary: "",

            status: employee.employment_status || "", // Use employment_status
          });
        } else {
          toast({
            title: "Error",
            description: "Employee not found",
            variant: "destructive",
          })
          router.push("/employees")
        }
      } catch (error) {
        console.error("Error loading employee:", error)
        toast({
          title: "Error",
          description: "Failed to load employee data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    loadEmployee()
  }, [params.id, router])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Separate data for core employee table and contact table
      const coreUpdates = {
        // department_id: formData.department_id, // Requires fetching/managing IDs
        // job_grade_id: formData.job_grade_id, // Requires fetching/managing IDs
        national_id: formData.national_id,
        tin_number: formData.tin_number,
        nssf_number: formData.nssf_number,
        employee_id: formData.employee_id, // The textual ID
        employment_type: formData.employment_type,
        // employment_status: formData.status, // Status handled separately
        // reporting_manager_id: formData.reporting_manager_id, // Requires fetching/managing IDs
        // Add other core fields from form
        probation_period: formData.probation_period ? Number.parseInt(formData.probation_period) : null,
        // Add other numeric/date conversions for core fields
      };

      const contactUpdates = {
        full_name: formData.full_name,
        email: formData.email,
        phone_number: formData.contact_number, // Map form field to DB column
        // Add other contact fields from form like relationship, address if they belong in contacts
        // emergency_contact_name, emergency_contact_relationship, emergency_contact_number
        // might belong in a separate 'emergency_contacts' update or handled differently
      };

      // --- Perform Updates Sequentially (Consider transaction for atomicity if needed) ---

      // Update Core Employee Info
      const coreResult = await updateEmployeeCore(params.id, coreUpdates);
      // Optional: Check coreResult if needed, though errors should throw

      // Update Personal Contact Info (assuming we update the 'personal' contact)
      // Note: updateEmployeeContact handles finding/creating the contact record
      const contactResult = await updateEmployeeContact(params.id, contactUpdates, 'personal');
      // Optional: Check contactResult if needed

      // --- Success ---
      toast({
        title: "Employee Updated",
        description: `${formData.full_name || 'Employee'} has been updated successfully.`,
      });
      // Redirect back to the employee detail page (or list page)
      router.push(`/employees`); // Redirect to list page after edit for simplicity
      // router.push(`/employees/${params.id}`); // Or back to detail page

    } catch (error: any) {
      console.error("Error updating employee:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update employee. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 flex justify-center items-center">
        <p>Loading employee data...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <Link href={`/employees/${params.id}`} className="flex items-center text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Employee Details
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Edit Employee</CardTitle>
          <CardDescription>Update employee information</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="employment">Employment</TabsTrigger>
                <TabsTrigger value="statutory">Statutory</TabsTrigger>
                <TabsTrigger value="additional">Additional</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="full_name">Full Name</Label>
                    <Input
                      id="full_name"
                      name="full_name"
                      value={formData.full_name}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={formData.date_of_birth}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender || ""}
                      onValueChange={(value) => handleSelectChange("gender", value)}
                    >
                      <SelectTrigger id="gender">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Male">Male</SelectItem>
                        <SelectItem value="Female">Female</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input
                      id="nationality"
                      name="nationality"
                      value={formData.nationality || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="marital_status">Marital Status</Label>
                    <Select
                      value={formData.marital_status || ""}
                      onValueChange={(value) => handleSelectChange("marital_status", value)}
                    >
                      <SelectTrigger id="marital_status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Single">Single</SelectItem>
                        <SelectItem value="Married">Married</SelectItem>
                        <SelectItem value="Divorced">Divorced</SelectItem>
                        <SelectItem value="Widowed">Widowed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" name="email" type="email" value={formData.email || ""} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contact_number">Contact Number</Label>
                    <Input
                      id="contact_number"
                      name="contact_number"
                      value={formData.contact_number || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="residential_address">Residential Address</Label>
                    <Textarea
                      id="residential_address"
                      name="residential_address"
                      value={formData.residential_address || ""}
                      onChange={handleChange}
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_name">Emergency Contact Name</Label>
                    <Input
                      id="emergency_contact_name"
                      name="emergency_contact_name"
                      value={formData.emergency_contact_name || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_relationship">Emergency Contact Relationship</Label>
                    <Input
                      id="emergency_contact_relationship"
                      name="emergency_contact_relationship"
                      value={formData.emergency_contact_relationship || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="emergency_contact_number">Emergency Contact Number</Label>
                    <Input
                      id="emergency_contact_number"
                      name="emergency_contact_number"
                      value={formData.emergency_contact_number || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <Button type="button" onClick={() => setActiveTab("employment")}>
                    Next: Employment Details
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="employment" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee_id">Employee ID</Label>
                    <Input
                      id="employee_id"
                      name="employee_id"
                      value={formData.employee_id || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job_title">Job Title</Label>
                    <Input
                      id="job_title"
                      name="job_title"
                      value={formData.job_title || ""}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      value={formData.department || ""}
                      onValueChange={(value) => handleSelectChange("department", value)}
                    >
                      <SelectTrigger id="department">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Engineering">Engineering</SelectItem>
                        <SelectItem value="Product">Product</SelectItem>
                        <SelectItem value="Design">Design</SelectItem>
                        <SelectItem value="Marketing">Marketing</SelectItem>
                        <SelectItem value="Sales">Sales</SelectItem>
                        <SelectItem value="Human Resources">Human Resources</SelectItem>
                        <SelectItem value="Finance">Finance</SelectItem>
                        <SelectItem value="IT">IT</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employment_type">Employment Type</Label>
                    <Select
                      value={formData.employment_type || ""}
                      onValueChange={(value) => handleSelectChange("employment_type", value)}
                    >
                      <SelectTrigger id="employment_type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Permanent">Permanent</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Temporary">Temporary</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="date_of_employment">Date of Employment</Label>
                    <Input
                      id="date_of_employment"
                      name="date_of_employment"
                      type="date"
                      value={formData.date_of_employment || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="probation_period">Probation Period (months)</Label>
                    <Input
                      id="probation_period"
                      name="probation_period"
                      type="number"
                      value={formData.probation_period || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="reporting_manager">Reporting Manager</Label>
                    <Input
                      id="reporting_manager"
                      name="reporting_manager"
                      value={formData.reporting_manager || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job_grade">Job Grade/Level</Label>
                    <Input id="job_grade" name="job_grade" value={formData.job_grade || ""} onChange={handleChange} />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("personal")}>
                    Previous: Personal Info
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("statutory")}>
                    Next: Statutory Information
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="statutory" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="national_id">National ID Number (NIN)</Label>
                    <Input
                      id="national_id"
                      name="national_id"
                      value={formData.national_id || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="passport_number">Passport Number (if applicable)</Label>
                    <Input
                      id="passport_number"
                      name="passport_number"
                      value={formData.passport_number || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nssf_number">NSSF Number</Label>
                    <Input
                      id="nssf_number"
                      name="nssf_number"
                      value={formData.nssf_number || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tin_number">URA TIN (Tax Identification Number)</Label>
                    <Input
                      id="tin_number"
                      name="tin_number"
                      value={formData.tin_number || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="work_permit_number">Work Permit Number (for non-citizens)</Label>
                    <Input
                      id="work_permit_number"
                      name="work_permit_number"
                      value={formData.work_permit_number || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank_name">Bank Name</Label>
                    <Input id="bank_name" name="bank_name" value={formData.bank_name || ""} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bank_account_number">Bank Account Number</Label>
                    <Input
                      id="bank_account_number"
                      name="bank_account_number"
                      value={formData.bank_account_number || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="salary_structure">Salary Structure</Label>
                    <Input
                      id="salary_structure"
                      name="salary_structure"
                      value={formData.salary_structure || ""}
                      onChange={handleChange}
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("employment")}>
                    Previous: Employment Details
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("additional")}>
                    Next: Additional Information
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="additional" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="working_hours">Working Hours & Shift</Label>
                    <Input
                      id="working_hours"
                      name="working_hours"
                      value={formData.working_hours || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="annual_leave_balance">Annual Leave Balance (days)</Label>
                    <Input
                      id="annual_leave_balance"
                      name="annual_leave_balance"
                      type="number"
                      value={formData.annual_leave_balance || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="sick_leave_balance">Sick Leave Balance (days)</Label>
                    <Input
                      id="sick_leave_balance"
                      name="sick_leave_balance"
                      type="number"
                      value={formData.sick_leave_balance || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maternity_paternity_leave_balance">Maternity/Paternity Leave Balance (days)</Label>
                    <Input
                      id="maternity_paternity_leave_balance"
                      name="maternity_paternity_leave_balance"
                      type="number"
                      value={formData.maternity_paternity_leave_balance || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="kpis">Key Performance Indicators (KPIs)</Label>
                    <Textarea id="kpis" name="kpis" value={formData.kpis || ""} onChange={handleChange} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="training_certifications">Training & Certifications</Label>
                    <Textarea
                      id="training_certifications"
                      name="training_certifications"
                      value={formData.training_certifications || ""}
                      onChange={handleChange}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="status">Status</Label>
                    <Select
                      value={formData.status || ""}
                      onValueChange={(value) => handleSelectChange("status", value)}
                    >
                      <SelectTrigger id="status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="On Leave">On Leave</SelectItem>
                        <SelectItem value="Terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("statutory")}>
                    Previous: Statutory Information
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push(`/employees/${params.id}`)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

