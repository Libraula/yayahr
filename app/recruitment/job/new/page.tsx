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
import { postJob } from "@/lib/supabase-functions" // Import postJob

interface JobPostingData {
  job_title: string
  department_id: string | null // Store department ID
  employment_type: string
  location: string
  salary_min: number | null
  salary_max: number | null
  opening_date: string
  closing_date: string
  job_description: string
  requirements: string
  benefits: string
  hide_salary: boolean
  remote_option: boolean
}

export default function NewJobPostingPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [jobData, setJobData] = useState<JobPostingData>({
    job_title: "",
    department_id: null,
    employment_type: "",
    location: "",
    salary_min: null,
    salary_max: null,
    opening_date: "",
    closing_date: "",
    job_description: "",
    requirements: "",
    benefits: "",
    hide_salary: false,
    remote_option: false,
  })
  // TODO: Fetch actual departments from Supabase to populate the select dropdown

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target
    const isCheckbox = type === 'checkbox';
    const inputValue = isCheckbox ? (event.target as HTMLInputElement).checked : value;
    const inputName = isCheckbox ? (event.target as HTMLInputElement).id : name; // Use id for checkboxes

    setJobData((prevData) => ({
      ...prevData,
      [inputName]: type === 'number' ? (value === '' ? null : Number(value)) : inputValue,
    }))
  }

  const handleSelectChange = (name: keyof JobPostingData) => (value: string) => {
     // Assuming department select value is the department ID for now
    setJobData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")

    console.log("Submitting Job Posting Data:", jobData)

    try {
      // Prepare payload, ensuring numeric fields are numbers or null
      const payload = {
        ...jobData,
        salary_min: jobData.salary_min === null ? null : Number(jobData.salary_min),
        salary_max: jobData.salary_max === null ? null : Number(jobData.salary_max),
        // department_id should already be set by handleSelectChange
      }

      const newPosting = await postJob(payload)

      if (newPosting) {
        setStatus("success")
        toast({
          title: "Job posting created",
          description: "The job posting has been created successfully.",
        })
        router.push("/recruitment")
      } else {
        throw new Error("Failed to create job posting in Supabase.")
      }
    } catch (error) {
      console.error("Error creating job posting:", error)
      setStatus("error")
      toast({
        title: "Error",
        description: `There was an error creating the job posting: ${error instanceof Error ? error.message : "Unknown error"}`,
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
                <Input id="job_title" name="job_title" placeholder="e.g. Senior Software Engineer" required value={jobData.job_title} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="department">Department</Label>
                <Select required name="department_id" value={jobData.department_id || ""} onValueChange={handleSelectChange("department_id")}>
                  <SelectTrigger id="department">
                    <SelectValue placeholder="Select department" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* TODO: Replace with dynamic departments fetched from Supabase */}
                    <SelectItem value="temp-eng-id">Engineering</SelectItem>
                    <SelectItem value="temp-mkt-id">Marketing</SelectItem>
                    <SelectItem value="temp-sal-id">Sales</SelectItem>
                    <SelectItem value="temp-fin-id">Finance</SelectItem>
                    <SelectItem value="temp-hr-id">Human Resources</SelectItem>
                    <SelectItem value="temp-ops-id">Operations</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="employment-type">Employment Type</Label>
                <Select required name="employment_type" value={jobData.employment_type} onValueChange={handleSelectChange("employment_type")}>
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
                <Select required name="location" value={jobData.location} onValueChange={handleSelectChange("location")}>
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
                <Input id="salary_min" name="salary_min" type="number" placeholder="e.g. 2000000" value={jobData.salary_min ?? ""} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="salary-max">Maximum Salary (UGX)</Label>
                <Input id="salary_max" name="salary_max" type="number" placeholder="e.g. 3500000" value={jobData.salary_max ?? ""} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="opening-date">Opening Date</Label>
                <Input id="opening_date" name="opening_date" type="date" required value={jobData.opening_date} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="closing-date">Closing Date</Label>
                <Input id="closing_date" name="closing_date" type="date" required value={jobData.closing_date} onChange={handleInputChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="job-description">Job Description</Label>
              <Textarea
                id="job_description"
                name="job_description"
                placeholder="Describe the role, responsibilities, and expectations"
                className="min-h-[150px]"
                required
                value={jobData.job_description}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requirements">Requirements</Label>
              <Textarea
                id="requirements"
                name="requirements"
                placeholder="List qualifications, skills, and experience required"
                className="min-h-[150px]"
                required
                value={jobData.requirements}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="benefits">Benefits</Label>
              <Textarea
                id="benefits"
                name="benefits"
                placeholder="Describe the benefits and perks offered with this position"
                className="min-h-[100px]"
                value={jobData.benefits}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="hide_salary" name="hide_salary" checked={jobData.hide_salary} onCheckedChange={(checked) => handleSelectChange("hide_salary")(checked.toString())} />
              <Label htmlFor="hide_salary">Hide salary range in job posting</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="remote_option" name="remote_option" checked={jobData.remote_option} onCheckedChange={(checked) => handleSelectChange("remote_option")(checked.toString())} />
              <Label htmlFor="remote_option">Remote work option available</Label>
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

