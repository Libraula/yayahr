"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { addBenefitPlan } from "@/lib/supabase-functions" // Import the function

interface BenefitFormData {
  name: string
  type: string
  provider: string
  cost: number | null
  effective_date: string
  expiry_date: string | null
  description: string
  eligibility_criteria: string
  enrollment_process: string
  coverage_employee: boolean
  coverage_spouse: boolean
  coverage_children: boolean
  coverage_parents: boolean
  is_taxable: boolean
  is_prorated: boolean
}

export default function AddBenefitPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [formData, setFormData] = useState<BenefitFormData>({
    name: "",
    type: "",
    provider: "",
    cost: null,
    effective_date: "",
    expiry_date: null,
    description: "",
    eligibility_criteria: "",
    enrollment_process: "",
    coverage_employee: false,
    coverage_spouse: false,
    coverage_children: false,
    coverage_parents: false,
    is_taxable: false,
    is_prorated: false,
  })

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'number' ? (value === '' ? null : Number(value)) : value,
    }))
  }

  const handleSelectChange = (name: keyof BenefitFormData) => (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleCheckboxChange = (name: keyof BenefitFormData) => (checked: boolean | 'indeterminate') => {
     if (typeof checked === 'boolean') {
        setFormData((prevData) => ({
          ...prevData,
          [name]: checked,
        }))
     }
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")

    console.log("Submitting Benefit Data:", formData)

    try {
      // Prepare payload for Supabase function
      const benefitData = {
        name: formData.name,
        type: formData.type,
        provider: formData.provider,
        cost_per_employee: formData.cost, // Assuming schema uses this name
        effective_date: formData.effective_date,
        expiry_date: formData.expiry_date || null,
        description: formData.description,
        eligibility_criteria: formData.eligibility_criteria,
        enrollment_process: formData.enrollment_process,
        coverage_options: { // Store coverage as JSON
          employee: formData.coverage_employee,
          spouse: formData.coverage_spouse,
          children: formData.coverage_children,
          parents: formData.coverage_parents,
        },
        is_taxable: formData.is_taxable,
        is_prorated: formData.is_prorated,
        // start_date is expected by the function, using effective_date
        start_date: formData.effective_date,
      }

      // Validate required fields
      if (!benefitData.name || !benefitData.type || !benefitData.provider || benefitData.cost_per_employee === null || !benefitData.effective_date) {
        throw new Error("Please fill in all required fields (Name, Type, Provider, Cost, Effective Date).")
      }

      // Call the Supabase function (pass empty array for employees as form doesn't select them)
      const result = await addBenefitPlan(benefitData, [])

      if (result) {
        setStatus("success")
        toast({
          title: "Benefit added",
          description: "The benefit plan has been added successfully.",
        })
        router.push("/benefits")
      } else {
        throw new Error("Failed to add benefit plan to Supabase.")
      }
    } catch (error) {
      console.error("Error adding benefit:", error)
      setStatus("error")
      toast({
        title: "Error",
        description: `There was an error adding the benefit: ${error instanceof Error ? error.message : "Unknown error"}`,
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
      <Link href="/benefits" className="flex items-center text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Benefits
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Add New Benefit</CardTitle>
          <CardDescription>Create a new employee benefit or perk.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="benefit-name">Benefit Name</Label>
                <Input id="name" name="name" placeholder="e.g. Health Insurance" required value={formData.name} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefit-type">Benefit Type</Label>
                <Select required name="type" value={formData.type} onValueChange={handleSelectChange("type")}>
                  <SelectTrigger id="benefit-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="health">Health & Wellness</SelectItem>
                    <SelectItem value="financial">Financial</SelectItem>
                    <SelectItem value="retirement">Retirement</SelectItem>
                    <SelectItem value="insurance">Insurance</SelectItem>
                    <SelectItem value="leave">Paid Time Off</SelectItem>
                    <SelectItem value="education">Education & Development</SelectItem>
                    <SelectItem value="lifestyle">Lifestyle & Perks</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Provider</Label>
                <Input id="provider" name="provider" placeholder="e.g. UAP Insurance" required value={formData.provider} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Monthly Cost (UGX)</Label>
                <Input id="cost" name="cost" type="number" placeholder="e.g. 250000" required value={formData.cost ?? ""} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="effective-date">Effective Date</Label>
                <Input id="effective_date" name="effective_date" type="date" required value={formData.effective_date} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry-date">Expiry Date (if applicable)</Label>
                <Input id="expiry_date" name="expiry_date" type="date" value={formData.expiry_date ?? ""} onChange={handleInputChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Benefit Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide a detailed description of the benefit"
                className="min-h-[150px]"
                required
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eligibility">Eligibility Criteria</Label>
              <Textarea
                id="eligibility_criteria"
                name="eligibility_criteria"
                placeholder="Describe who is eligible for this benefit"
                className="min-h-[100px]"
                required
                value={formData.eligibility_criteria}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrollment">Enrollment Process</Label>
              <Textarea
                id="enrollment_process"
                name="enrollment_process"
                placeholder="Describe how employees can enroll in this benefit"
                className="min-h-[100px]"
                value={formData.enrollment_process}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-4">
              <Label>Benefit Coverage</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="coverage_employee" name="coverage_employee" checked={formData.coverage_employee} onCheckedChange={handleCheckboxChange("coverage_employee")} />
                  <Label htmlFor="coverage_employee">Employee</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="coverage_spouse" name="coverage_spouse" checked={formData.coverage_spouse} onCheckedChange={handleCheckboxChange("coverage_spouse")} />
                  <Label htmlFor="coverage_spouse">Spouse</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="coverage_children" name="coverage_children" checked={formData.coverage_children} onCheckedChange={handleCheckboxChange("coverage_children")} />
                  <Label htmlFor="coverage_children">Children</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="coverage_parents" name="coverage_parents" checked={formData.coverage_parents} onCheckedChange={handleCheckboxChange("coverage_parents")} />
                  <Label htmlFor="coverage_parents">Parents</Label>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="is_taxable" name="is_taxable" checked={formData.is_taxable} onCheckedChange={handleCheckboxChange("is_taxable")} />
              <Label htmlFor="is_taxable">Taxable benefit</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="is_prorated" name="is_prorated" checked={formData.is_prorated} onCheckedChange={handleCheckboxChange("is_prorated")} />
              <Label htmlFor="is_prorated">Prorated for part-time employees</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/benefits")}>
              Cancel
            </Button>
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Benefit"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

