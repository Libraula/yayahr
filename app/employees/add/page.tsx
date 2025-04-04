"use client"

import type React from "react"
import { useState } from "react" // Remove useEffect
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { createEmployeeCore, createEmployeeContact } from "@/lib/supabase-functions" // Remove fetchDepartments and Department type

interface EmployeeData {
  first_name: string
  last_name: string
  email: string
  phone: string
  date_of_birth: string
  gender: string
  employee_id: string
  department_name: string // Store department name for hardcoded list
  job_title: string
  employment_type: string
  employment_status: string
  start_date: string
  national_id: string
  tin_number: string
  nssf_number: string
}

export default function AddEmployeePage() {
  const router = useRouter()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [employeeData, setEmployeeData] = useState<EmployeeData>({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    date_of_birth: "",
    gender: "",
    employee_id: "",
    department_name: "", // Initialize department name state
    job_title: "",
    employment_type: "",
    employment_status: "",
    start_date: "",
    national_id: "",
    tin_number: "",
    nssf_number: "",
  })
  // Removed state and useEffect for dynamic department fetching

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: keyof EmployeeData) => (value: string) => {
    setEmployeeData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")

    console.log("Submitting Employee Data:", employeeData)

    try {
      // Prepare data for Supabase, combining names and mapping fields
      // --- Step 1: Create Core Employee Record ---
      const corePayload = {
        department_id: null, // Send null as we don't have the ID for hardcoded options
        national_id: employeeData.national_id,
        tin_number: employeeData.tin_number,
        nssf_number: employeeData.nssf_number,
        employee_id: employeeData.employee_id, // The textual ID like EMP-001
        employment_type: employeeData.employment_type,
        employment_status: employeeData.employment_status || 'probation',
        // job_grade_id: employeeData.job_grade_id, // Add if job grade is added to form
      }

      const newEmployeeCore = await createEmployeeCore(corePayload)

      if (!newEmployeeCore || !newEmployeeCore.id) {
        // Error is thrown from createEmployeeCore, but double-check here
        throw new Error("Failed to create core employee record or retrieve its ID.")
      }

      const newEmployeeUUID = newEmployeeCore.id // Get the generated UUID

      // --- Step 2: Create Employee Contact Record ---
      const contactPayload = {
        employee_id: newEmployeeUUID, // Link to the core record
        contact_type: 'personal', // Default to personal contact
        full_name: `${employeeData.first_name} ${employeeData.last_name}`,
        phone_number: employeeData.phone,
        email: employeeData.email || null,
        // Add other fields like relationship if needed/collected
      }

      const newContact = await createEmployeeContact(contactPayload)

      if (!newContact) {
          // Ideally, you might want to implement logic to delete the core employee
          // record if contact creation fails (transactional behavior).
          // For now, just throw an error.
          throw new Error("Core employee created, but failed to create contact details.")
      }

      // --- Success ---
      setStatus("success")
      toast({
        title: "Employee added",
        description: "The employee and their contact details have been added successfully.",
      })
      router.push("/employees")

    } catch (error) {
      console.error("Error adding employee:", error)
      setStatus("error")
      toast({
        title: "Error",
        description: `There was an error adding the employee: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
       if (status === "success" || status === "error") {
         setStatus("idle");
       }
    }
  }

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-6">Add New Employee</h1>
      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="personal" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="personal">Personal Information</TabsTrigger>
            <TabsTrigger value="employment">Employment Details</TabsTrigger>
            <TabsTrigger value="statutory">Statutory Information</TabsTrigger>
          </TabsList>
          <TabsContent value="personal">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Enter the employee's personal details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="first_name">First Name</Label>
                    <Input
                      id="first_name"
                      name="first_name"
                      placeholder="John"
                      required
                      value={employeeData.first_name}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="last_name">Last Name</Label>
                    <Input
                      id="last_name"
                      name="last_name"
                      placeholder="Doe"
                      required
                      value={employeeData.last_name}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="john.doe@example.com"
                      required
                      value={employeeData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="+256 700 123456"
                      required
                      value={employeeData.phone}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="date_of_birth">Date of Birth</Label>
                    <Input
                      id="date_of_birth"
                      name="date_of_birth"
                      type="date"
                      value={employeeData.date_of_birth}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      name="gender"
                      value={employeeData.gender}
                      onValueChange={handleSelectChange("gender")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="employment">
            <Card>
              <CardHeader>
                <CardTitle>Employment Details</CardTitle>
                <CardDescription>Enter the employee's work-related information.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employee_id">Employee ID</Label>
                    <Input
                      id="employee_id"
                      name="employee_id"
                      placeholder="EMP-001"
                      required
                      value={employeeData.employee_id}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="department">Department</Label>
                    <Select
                      name="department_name" // Use department_name for state key
                      value={employeeData.department_name}
                      onValueChange={handleSelectChange("department_name")} // Update department_name state
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        {/* Hardcoded options */}
                        <SelectItem value="Tailoring">Tailoring</SelectItem>
                        <SelectItem value="Shopkeeping">Shopkeeping</SelectItem>
                        <SelectItem value="Distribution">Distribution</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="job_title">Job Title</Label>
                    <Input
                      id="job_title"
                      name="job_title"
                      placeholder="Software Engineer"
                      required
                      value={employeeData.job_title}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="employment_type">Employment Type</Label>
                    <Select
                      name="employment_type"
                      value={employeeData.employment_type}
                      onValueChange={handleSelectChange("employment_type")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="full_time">Full Time</SelectItem>
                        <SelectItem value="part_time">Part Time</SelectItem>
                        <SelectItem value="contract">Contract</SelectItem>
                        <SelectItem value="intern">Intern</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="employment_status">Employment Status</Label>
                    <Select
                      name="employment_status"
                      value={employeeData.employment_status}
                      onValueChange={handleSelectChange("employment_status")}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="probation">Probation</SelectItem>
                        <SelectItem value="active">Active</SelectItem>
                        <SelectItem value="suspended">Suspended</SelectItem>
                        <SelectItem value="terminated">Terminated</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="start_date">Start Date</Label>
                    <Input
                      id="start_date"
                      name="start_date"
                      type="date"
                      required
                      value={employeeData.start_date}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="statutory">
            <Card>
              <CardHeader>
                <CardTitle>Statutory Information</CardTitle>
                <CardDescription>Enter the employee's statutory and compliance details.</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="national_id">National ID Number</Label>
                    <Input
                      id="national_id"
                      name="national_id"
                      placeholder="CM12345678ABCDE"
                      required
                      value={employeeData.national_id}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tin_number">TIN Number</Label>
                    <Input
                      id="tin_number"
                      name="tin_number"
                      placeholder="1234567890"
                      required
                      value={employeeData.tin_number}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nssf_number">NSSF Number</Label>
                    <Input
                      id="nssf_number"
                      name="nssf_number"
                      placeholder="NSSF12345678"
                      required
                      value={employeeData.nssf_number}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between mt-6">
                <Button variant="outline" type="button" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" disabled={status === "loading"}>
                  {status === "loading" ? "Adding..." : "Add Employee"}
                </Button>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </form>
    </div>
  )
}
