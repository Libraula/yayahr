"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Loader2, Plus, X } from "lucide-react"
import { createEmployee, fetchDepartments, fetchJobGrades } from "@/lib/supabase"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

export default function AddEmployee() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("personal")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formError, setFormError] = useState("")
  const [departments, setDepartments] = useState([])
  const [jobGrades, setJobGrades] = useState([])

  // Fetch departments and job grades
  useEffect(() => {
    async function fetchData() {
      const depts = await fetchDepartments()
      const grades = await fetchJobGrades()
      setDepartments(depts)
      setJobGrades(grades)
    }
    fetchData()
  }, [])

  const [formData, setFormData] = useState({
    // Required fields
    national_id: "",
    tin_number: "",
    nssf_number: "",
    employee_id: "",
    employment_type: "",

    // Optional fields
    department_id: "",
    job_grade_id: "",
    reporting_manager_id: "",
    employment_status: "probation",

    // Contacts
    contacts: [
      {
        contact_type: "personal",
        full_name: "",
        relationship: "",
        phone_number: "",
        email: "",
      },
    ],

    // Payroll
    payroll_profile: {
      bank_name: "",
      account_number: "",
      mobile_money_provider: "",
      mobile_money_number: "",
      payment_method: "bank_transfer",
      base_salary: "",
      effective_date: new Date().toISOString().split("T")[0],
    },
  })

  const handleChange = (e) => {
    const { name, value } = e.target

    // Handle nested fields
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleContactChange = (index, field, value) => {
    setFormData((prev) => {
      const newContacts = [...prev.contacts]
      newContacts[index] = {
        ...newContacts[index],
        [field]: value,
      }
      return {
        ...prev,
        contacts: newContacts,
      }
    })
  }

  const addContact = () => {
    setFormData((prev) => ({
      ...prev,
      contacts: [
        ...prev.contacts,
        {
          contact_type: "emergency",
          full_name: "",
          relationship: "",
          phone_number: "",
          email: "",
        },
      ],
    }))
  }

  const removeContact = (index) => {
    if (formData.contacts.length <= 1) return

    setFormData((prev) => {
      const newContacts = [...prev.contacts]
      newContacts.splice(index, 1)
      return {
        ...prev,
        contacts: newContacts,
      }
    })
  }

  const handleSelectChange = (name, value) => {
    // Handle nested fields
    if (name.includes(".")) {
      const [parent, child] = name.split(".")
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }))
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const validateForm = () => {
    // Basic validation
    if (!formData.national_id) {
      setFormError("National ID is required")
      return false
    }
    if (!formData.tin_number) {
      setFormError("TIN Number is required")
      return false
    }
    if (!formData.nssf_number) {
      setFormError("NSSF Number is required")
      return false
    }
    if (!formData.employee_id) {
      setFormError("Employee ID is required")
      return false
    }
    if (!formData.employment_type) {
      setFormError("Employment Type is required")
      return false
    }

    // Validate contacts
    for (const contact of formData.contacts) {
      if (!contact.full_name || !contact.phone_number) {
        setFormError("Contact name and phone number are required")
        return false
      }
    }

    // Validate payroll if provided
    if (formData.payroll_profile.payment_method) {
      if (!formData.payroll_profile.base_salary) {
        setFormError("Base salary is required")
        return false
      }

      if (
        formData.payroll_profile.payment_method === "bank_transfer" &&
        (!formData.payroll_profile.bank_name || !formData.payroll_profile.account_number)
      ) {
        setFormError("Bank name and account number are required for bank transfers")
        return false
      }

      if (
        formData.payroll_profile.payment_method === "mobile_money" &&
        (!formData.payroll_profile.mobile_money_provider || !formData.payroll_profile.mobile_money_number)
      ) {
        setFormError("Mobile money provider and number are required for mobile money payments")
        return false
      }
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
      // Prepare payroll data
      const payrollProfile = formData.payroll_profile.payment_method
        ? {
            ...formData.payroll_profile,
            base_salary: Number.parseFloat(formData.payroll_profile.base_salary),
          }
        : null

      // Create employee in Supabase
      const result = await createEmployee({
        national_id: formData.national_id,
        tin_number: formData.tin_number,
        nssf_number: formData.nssf_number,
        employee_id: formData.employee_id,
        employment_type: formData.employment_type,
        department_id: formData.department_id || undefined,
        job_grade_id: formData.job_grade_id || undefined,
        reporting_manager_id: formData.reporting_manager_id || undefined,
        employment_status: formData.employment_status,
        contacts: formData.contacts,
        payroll_profile: payrollProfile,
      })

      if (result) {
        toast({
          title: "Employee Added Successfully",
          description: `${formData.employee_id} has been added to the system.`,
        })
        router.push("/employees")
      } else {
        throw new Error("Failed to add employee")
      }
    } catch (error) {
      console.error("Error adding employee:", error)
      setFormError("Failed to add employee. Please try again.")
      toast({
        title: "Error",
        description: "Failed to add employee. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Link href="/employees" className="flex items-center text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Employees
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Add New Employee</CardTitle>
          <CardDescription>Enter the details of the new employee to add them to the system.</CardDescription>
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
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 mb-8">
                <TabsTrigger value="personal">Personal Info</TabsTrigger>
                <TabsTrigger value="employment">Employment</TabsTrigger>
                <TabsTrigger value="contacts">Contacts</TabsTrigger>
                <TabsTrigger value="payroll">Payroll</TabsTrigger>
              </TabsList>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee_id">
                      Employee ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="employee_id"
                      name="employee_id"
                      value={formData.employee_id}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="national_id">
                      National ID <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="national_id"
                      name="national_id"
                      value={formData.national_id}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="tin_number">
                      TIN Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="tin_number"
                      name="tin_number"
                      value={formData.tin_number}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="nssf_number">
                      NSSF Number <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="nssf_number"
                      name="nssf_number"
                      value={formData.nssf_number}
                      onChange={handleChange}
                      required
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
                    <Label htmlFor="employment_type">
                      Employment Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.employment_type}
                      onValueChange={(value) => handleSelectChange("employment_type", value)}
                      required
                    >
                      <SelectTrigger id="employment_type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Full-time">Full-time</SelectItem>
                        <SelectItem value="Part-time">Part-time</SelectItem>
                        <SelectItem value="Contract">Contract</SelectItem>
                        <SelectItem value="Temporary">Temporary</SelectItem>
                        <SelectItem value="Intern">Intern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employment_status">Employment Status</Label>
                    <Select
                      value={formData.employment_status}
                      onValueChange={(value) => handleSelectChange("employment_status", value)}
                    >
                      <SelectTrigger id="employment_status">
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="probation">Probation</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                        <SelectItem value="retired">Retired</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department_id">Department</Label>
                    <Select
                      value={formData.department_id}
                      onValueChange={(value) => handleSelectChange("department_id", value)}
                    >
                      <SelectTrigger id="department_id">
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {departments.map((dept) => (
                          <SelectItem key={dept.id} value={dept.id}>
                            {dept.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="job_grade_id">Job Grade</Label>
                    <Select
                      value={formData.job_grade_id}
                      onValueChange={(value) => handleSelectChange("job_grade_id", value)}
                    >
                      <SelectTrigger id="job_grade_id">
                        <SelectValue placeholder="Select job grade" />
                      </SelectTrigger>
                      <SelectContent>
                        {jobGrades.map((grade) => (
                          <SelectItem key={grade.id} value={grade.id}>
                            {grade.grade_name} ({grade.min_salary.toLocaleString()} -{" "}
                            {grade.max_salary.toLocaleString()})
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("personal")}>
                    Previous: Personal Info
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("contacts")}>
                    Next: Contacts
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="contacts" className="space-y-4">
                {formData.contacts.map((contact, index) => (
                  <div key={index} className="border p-4 rounded-md space-y-4">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">Contact {index + 1}</h3>
                      {formData.contacts.length > 1 && (
                        <Button type="button" variant="ghost" size="sm" onClick={() => removeContact(index)}>
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor={`contact-type-${index}`}>
                          Contact Type <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={contact.contact_type}
                          onValueChange={(value) => handleContactChange(index, "contact_type", value)}
                        >
                          <SelectTrigger id={`contact-type-${index}`}>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="personal">Personal</SelectItem>
                            <SelectItem value="emergency">Emergency</SelectItem>
                            <SelectItem value="next_of_kin">Next of Kin</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`contact-name-${index}`}>
                          Full Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`contact-name-${index}`}
                          value={contact.full_name}
                          onChange={(e) => handleContactChange(index, "full_name", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`contact-relationship-${index}`}>Relationship</Label>
                        <Input
                          id={`contact-relationship-${index}`}
                          value={contact.relationship}
                          onChange={(e) => handleContactChange(index, "relationship", e.target.value)}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor={`contact-phone-${index}`}>
                          Phone Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id={`contact-phone-${index}`}
                          value={contact.phone_number}
                          onChange={(e) => handleContactChange(index, "phone_number", e.target.value)}
                          required
                        />
                      </div>

                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor={`contact-email-${index}`}>Email</Label>
                        <Input
                          id={`contact-email-${index}`}
                          type="email"
                          value={contact.email}
                          onChange={(e) => handleContactChange(index, "email", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                ))}

                <Button type="button" variant="outline" onClick={addContact} className="w-full">
                  <Plus className="h-4 w-4 mr-2" /> Add Another Contact
                </Button>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("employment")}>
                    Previous: Employment
                  </Button>
                  <Button type="button" onClick={() => setActiveTab("payroll")}>
                    Next: Payroll
                  </Button>
                </div>
              </TabsContent>

              <TabsContent value="payroll" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="payroll_profile.payment_method">
                      Payment Method <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.payroll_profile.payment_method}
                      onValueChange={(value) => handleSelectChange("payroll_profile.payment_method", value)}
                    >
                      <SelectTrigger id="payroll_profile.payment_method">
                        <SelectValue placeholder="Select method" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                        <SelectItem value="mobile_money">Mobile Money</SelectItem>
                        <SelectItem value="cash">Cash</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="payroll_profile.base_salary">
                      Base Salary (UGX) <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="payroll_profile.base_salary"
                      name="payroll_profile.base_salary"
                      type="number"
                      value={formData.payroll_profile.base_salary}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  {formData.payroll_profile.payment_method === "bank_transfer" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="payroll_profile.bank_name">
                          Bank Name <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="payroll_profile.bank_name"
                          name="payroll_profile.bank_name"
                          value={formData.payroll_profile.bank_name}
                          onChange={handleChange}
                          required
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="payroll_profile.account_number">
                          Account Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="payroll_profile.account_number"
                          name="payroll_profile.account_number"
                          value={formData.payroll_profile.account_number}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </>
                  )}

                  {formData.payroll_profile.payment_method === "mobile_money" && (
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="payroll_profile.mobile_money_provider">
                          Mobile Money Provider <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={formData.payroll_profile.mobile_money_provider}
                          onValueChange={(value) => handleSelectChange("payroll_profile.mobile_money_provider", value)}
                        >
                          <SelectTrigger id="payroll_profile.mobile_money_provider">
                            <SelectValue placeholder="Select provider" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="MTN">MTN</SelectItem>
                            <SelectItem value="Airtel">Airtel</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="payroll_profile.mobile_money_number">
                          Mobile Money Number <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="payroll_profile.mobile_money_number"
                          name="payroll_profile.mobile_money_number"
                          value={formData.payroll_profile.mobile_money_number}
                          onChange={handleChange}
                          required
                        />
                      </div>
                    </>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="payroll_profile.effective_date">
                      Effective Date <span className="text-red-500">*</span>
                    </Label>
                    <Input
                      id="payroll_profile.effective_date"
                      name="payroll_profile.effective_date"
                      type="date"
                      value={formData.payroll_profile.effective_date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button type="button" variant="outline" onClick={() => setActiveTab("contacts")}>
                    Previous: Contacts
                  </Button>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/employees")}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Employee"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

