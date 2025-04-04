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

export default function NewTrainingProgramPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
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

    // Simulate API call
    setTimeout(() => {
      setStatus("success")
      toast({
        title: "Training program created",
        description: "The training program has been created successfully.",
      })
      router.push("/training")
    }, 1500)
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
                <Input id="program-title" placeholder="e.g. Leadership Development" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="program-type">Program Type</Label>
                <Select required>
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
                <Select required>
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
                <Input id="duration" type="number" min="1" placeholder="e.g. 8" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="max-participants">Maximum Participants</Label>
                <Input id="max-participants" type="number" min="1" placeholder="e.g. 20" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Training Provider</Label>
                <Input id="provider" placeholder="e.g. Internal HR or External Company" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Program Description</Label>
              <Textarea
                id="description"
                placeholder="Provide a detailed description of the training program"
                className="min-h-[150px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="objectives">Learning Objectives</Label>
              <Textarea
                id="objectives"
                placeholder="List the key learning objectives and outcomes"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="prerequisites">Prerequisites</Label>
              <Textarea
                id="prerequisites"
                placeholder="List any prerequisites or requirements for participants"
                className="min-h-[100px]"
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
                id="assessment"
                placeholder="Describe how participants will be assessed"
                className="min-h-[100px]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="certification" />
              <Label htmlFor="certification">Offers certification upon completion</Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox id="mandatory" />
              <Label htmlFor="mandatory">Mandatory training for specific roles</Label>
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

