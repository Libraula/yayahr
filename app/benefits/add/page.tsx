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

export default function AddBenefitPage() {
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
        title: "Benefit added",
        description: "The benefit has been added successfully.",
      })
      router.push("/benefits")
    }, 1500)
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
                <Input id="benefit-name" placeholder="e.g. Health Insurance" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="benefit-type">Benefit Type</Label>
                <Select required>
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
                <Input id="provider" placeholder="e.g. UAP Insurance" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cost">Monthly Cost (UGX)</Label>
                <Input id="cost" type="number" placeholder="e.g. 250000" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="effective-date">Effective Date</Label>
                <Input id="effective-date" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="expiry-date">Expiry Date (if applicable)</Label>
                <Input id="expiry-date" type="date" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Benefit Description</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of the benefit"
                className="min-h-[150px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eligibility">Eligibility Criteria</Label>
              <Textarea
                id="eligibility"
                placeholder="Describe who is eligible for this benefit"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="enrollment">Enrollment Process</Label>
              <Textarea
                id="enrollment"
                placeholder="Describe how employees can enroll in this benefit"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-4">
              <Label>Benefit Coverage</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center space-x-2">
                  <Checkbox id="employee-coverage" />
                  <Label htmlFor="employee-coverage">Employee</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="spouse-coverage" />
                  <Label htmlFor="spouse-coverage">Spouse</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="children-coverage" />
                  <Label htmlFor="children-coverage">Children</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="parents-coverage" />
                  <Label htmlFor="parents-coverage">Parents</Label>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="taxable" />
              <Label htmlFor="taxable">Taxable benefit</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="prorated" />
              <Label htmlFor="prorated">Prorated for part-time employees</Label>
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

