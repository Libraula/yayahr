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

export default function NewJobPostingPage() {
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
        title: "Job posting created",
        description: "The job posting has been created successfully.",
      })
      router.push("/recruitment")
    }, 1500)
  }

  return (
    <div className="container mx-auto py-6">
      <Link href="/recruitment" className="flex items-center text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Recruitment
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create Job Posting</CardTitle>
          <CardDescription>Create a new job posting to advertise an open position.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="job-title">Job Title</Label>
                <Input id="job-title" placeholder="e.g. Senior Software Engineer" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select required>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="engineering">Engineering</SelectItem>
                    <SelectItem value="marketing">Marketing</SelectItem>
                    <SelectItem value="sales">Sales</SelectItem>
                    <SelectItem value="finance">Finance</SelectItem>
                    <SelectItem value="hr">Human Resources</SelectItem>
                    <SelectItem value="operations">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment-type">Employment Type</Label>
                <Select required>
                  <SelectTrigger id="employment-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="temporary">Temporary</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Select required>
                  <SelectTrigger id="location">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kampala">Kampala</SelectItem>
                    <SelectItem value="entebbe">Entebbe</SelectItem>
                    <SelectItem value="jinja">Jinja</SelectItem>
                    <SelectItem value="mbarara">Mbarara</SelectItem>
                    <SelectItem value="gulu">Gulu</SelectItem>
                    <SelectItem value="remote">Remote</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary-min">Minimum Salary (UGX)</Label>
                <Input id="salary-min" type="number" placeholder="e.g. 2000000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary-max">Maximum Salary (UGX)</Label>
                <Input id="salary-max" type="number" placeholder="e.g. 3500000" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="opening-date">Opening Date</Label>
                <Input id="opening-date" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="closing-date">Closing Date</Label>
                <Input id="closing-date" type="date" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job-description"
                placeholder="Describe the role, responsibilities, and expectations"
                className="min-h-[150px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                placeholder="List qualifications, skills, and experience required"
                className="min-h-[150px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits</Label>
              <Textarea
                id="benefits"
                placeholder="Describe the benefits and perks offered with this position"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="hide-salary" />
              <Label htmlFor="hide-salary">Hide salary range in job posting</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remote-option" />
              <Label htmlFor="remote-option">Remote work option available</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/recruitment")}>
              Cancel
            </Button>
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Job Posting"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

