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
import { Loader2, ArrowLeft, Plus, X } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { createTrainingProgram } from "@/lib/supabase-functions" // Import the function

interface TrainingFormData {
  title: string
  type: string
  delivery_method: string
  duration_hours: number | null
  start_date: string
  end_date: string
  max_participants: number | null
  provider: string
  description: string
  objectives: string
  prerequisites: string
  assessment_method: string
  offers_certification: boolean
  is_mandatory: boolean
}

export default function NewTrainingProgramPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [formData, setFormData] = useState<TrainingFormData>({
    title: "",
    type: "",
    delivery_method: "",
    duration_hours: null,
    start_date: "",
    end_date: "",
    max_participants: null,
    provider: "",
    description: "",
    objectives: "",
    prerequisites: "",
    assessment_method: "",
    offers_certification: false,
    is_mandatory: false,
  })
  const [modules, setModules] = useState([{ title: "", description: "" }])

  const addModule = () => {
    setModules([...modules, { title: "", description: "" }])
  }

  const removeModule = (index: number) => {
    if (modules.length > 1) {
      const newModules = [...modules]
      newModules.splice(index, 1)
      setModules(newModules)
    }
  }

  const updateModule = (index: number, field: string, value: string) => {
    const newModules = [...modules]
    newModules[index] = { ...newModules[index], [field]: value }
    setModules(newModules)
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")
    console.log("Submitting Training Program:", { ...formData, modules })

    try {
      // Prepare programData payload
      const programData = {
        name: formData.title, // Assuming schema uses 'name'
        type: formData.type,
        delivery_method: formData.delivery_method,
        // Convert duration hours to interval string 'X hours' for Supabase
        duration: formData.duration_hours ? `${formData.duration_hours} hours` : null,
        start_date: formData.start_date,
        end_date: formData.end_date,
        max_participants: formData.max_participants,
        provider: formData.provider,
        description: formData.description,
        learning_objectives: formData.objectives, // Assuming schema name
        prerequisites: formData.prerequisites,
        modules: modules, // Store modules array as JSON
        assessment_method: formData.assessment_method,
        certification_recognized: formData.offers_certification, // Assuming schema name
        is_mandatory: formData.is_mandatory,
      }

      // Validate required fields
      if (!programData.name || !programData.type || !programData.delivery_method || !programData.duration || !programData.start_date || !programData.end_date || !programData.provider) {
         throw new Error("Please fill in all required fields.")
      }
      if (modules.some(m => !m.title || !m.description)) {
         throw new Error("Please ensure all module titles and descriptions are filled.")
      }

      // Call Supabase function (pass empty array for participants)
      const result = await createTrainingProgram(programData, [])

      if (result) {
        setStatus("success")
        toast({
          title: "Training program created",
          description: "The training program has been created successfully.",
        })
        router.push("/training")
      } else {
        throw new Error("Failed to create training program in Supabase.")
      }
    } catch (error) {
      console.error("Error creating training program:", error)
      setStatus("error")
      toast({
        title: "Error",
        description: `There was an error creating the program: ${error instanceof Error ? error.message : "Unknown error"}`,
        variant: "destructive",
      })
    } finally {
      if (status === "success" || status === "error") {
        setStatus("idle")
      }
    }
  }

   const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === 'number' ? (value === '' ? null : Number(value)) : value,
    }))
  }

  const handleSelectChange = (name: keyof TrainingFormData) => (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

   const handleCheckboxChange = (name: keyof TrainingFormData) => (checked: boolean | 'indeterminate') => {
     if (typeof checked === 'boolean') {
        setFormData((prevData) => ({
          ...prevData,
          [name]: checked,
        }))
     }
  }

  return (
    <div className="container mx-auto py-6">
      <Link href="/training" className="flex items-center text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Training
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Create Training Program</CardTitle>
          <CardDescription>Set up a new training program for employees.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="program-title">Program Title</Label>
                <Input id="title" name="title" placeholder="e.g. Leadership Development" required value={formData.title} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="program-type">Program Type</Label>
                <Select required name="type" value={formData.type} onValueChange={handleSelectChange("type")}>
                  <SelectTrigger id="program-type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="technical">Technical Skills</SelectItem>
                    <SelectItem value="soft">Soft Skills</SelectItem>
                    <SelectItem value="compliance">Compliance</SelectItem>
                    <SelectItem value="leadership">Leadership</SelectItem>
                    <SelectItem value="onboarding">Onboarding</SelectItem>
                    <SelectItem value="professional">Professional Development</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="delivery-method">Delivery Method</Label>
                <Select required name="delivery_method" value={formData.delivery_method} onValueChange={handleSelectChange("delivery_method")}>
                  <SelectTrigger id="delivery-method">
                    <SelectValue placeholder="Select method" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="in-person">In-Person</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="self-paced">Self-Paced</SelectItem>
                    <SelectItem value="workshop">Workshop</SelectItem>
                    <SelectItem value="mentoring">Mentoring</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours)</Label>
                <Input id="duration_hours" name="duration_hours" type="number" min="1" placeholder="e.g. 8" required value={formData.duration_hours ?? ""} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start_date" name="start_date" type="date" required value={formData.start_date} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end_date" name="end_date" type="date" required value={formData.end_date} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-participants">Maximum Participants</Label>
                <Input id="max_participants" name="max_participants" type="number" min="1" placeholder="e.g. 20" required value={formData.max_participants ?? ""} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Training Provider</Label>
                <Input id="provider" name="provider" placeholder="e.g. Internal HR or External Company" required value={formData.provider} onChange={handleInputChange} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Program Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Provide a detailed description of the training program"
                className="min-h-[150px]"
                required
                value={formData.description}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Learning Objectives</Label>
              <Textarea
                id="objectives"
                name="objectives"
                placeholder="List the key learning objectives and outcomes"
                className="min-h-[100px]"
                required
                value={formData.objectives}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prerequisites">Prerequisites</Label>
              <Textarea
                id="prerequisites"
                name="prerequisites"
                placeholder="List any prerequisites or requirements for participants"
                className="min-h-[100px]"
                value={formData.prerequisites}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Training Modules</Label>
                <Button type="button" variant="outline" size="sm" onClick={addModule}>
                  <Plus className="h-4 w-4 mr-1" /> Add Module
                </Button>
              </div>

              {modules.map((module, index) => (
                <div key={index} className="border p-4 rounded-md space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Module {index + 1}</h4>
                    {modules.length > 1 && (
                      <Button type="button" variant="ghost" size="sm" onClick={() => removeModule(index)}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`module-title-${index}`}>Module Title</Label>
                    <Input
                      id={`module-title-${index}`}
                      value={module.title}
                      onChange={(e) => updateModule(index, "title", e.target.value)}
                      placeholder="e.g. Introduction to Leadership Principles"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`module-description-${index}`}>Module Description</Label>
                    <Textarea
                      id={`module-description-${index}`}
                      value={module.description}
                      onChange={(e) => updateModule(index, "description", e.target.value)}
                      placeholder="Describe the content and activities in this module"
                      required
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Label htmlFor="assessment">Assessment Method</Label>
              <Textarea
                id="assessment_method"
                name="assessment_method"
                placeholder="Describe how participants will be assessed"
                className="min-h-[100px]"
                value={formData.assessment_method}
                onChange={handleInputChange}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="offers_certification" name="offers_certification" checked={formData.offers_certification} onCheckedChange={handleCheckboxChange("offers_certification")} />
              <Label htmlFor="offers_certification">Offers certification upon completion</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="is_mandatory" name="is_mandatory" checked={formData.is_mandatory} onCheckedChange={handleCheckboxChange("is_mandatory")} />
              <Label htmlFor="is_mandatory">Mandatory training for specific roles</Label>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/training")}>
              Cancel
            </Button>
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Program"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

