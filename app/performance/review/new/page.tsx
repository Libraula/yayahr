"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Loader2, ArrowLeft } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function NewPerformanceReviewPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const [ratings, setRatings] = useState({
    productivity: 3,
    quality: 3,
    jobKnowledge: 3,
    reliability: 3,
    communication: 3,
    teamwork: 3,
    initiative: 3,
    adaptability: 3,
  })

  const handleRatingChange = (category: keyof typeof ratings, value: number[]) => {
    setRatings((prev) => ({
      ...prev,
      [category]: value[0],
    }))
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")

    // Simulate API call
    setTimeout(() => {
      setStatus("success")
      toast({
        title: "Performance review submitted",
        description: "The performance review has been submitted successfully.",
      })
      router.push("/performance")
    }, 1500)
  }

  return (
    <div className="container mx-auto py-6">
      <Link href="/performance" className="flex items-center text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Performance Management
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>New Performance Review</CardTitle>
          <CardDescription>Complete a performance review for an employee.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="employee">Employee</Label>
                <Select required>
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="emp1">John Doe</SelectItem>
                    <SelectItem value="emp2">Jane Smith</SelectItem>
                    <SelectItem value="emp3">Robert Johnson</SelectItem>
                    <SelectItem value="emp4">Emily Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-period">Review Period</Label>
                <Select required>
                  <SelectTrigger id="review-period">
                    <SelectValue placeholder="Select period" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="q1-2023">Q1 2023</SelectItem>
                    <SelectItem value="q2-2023">Q2 2023</SelectItem>
                    <SelectItem value="q3-2023">Q3 2023</SelectItem>
                    <SelectItem value="q4-2023">Q4 2023</SelectItem>
                    <SelectItem value="annual-2023">Annual 2023</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-date">Review Date</Label>
                <Input id="review-date" type="date" required />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewer">Reviewer</Label>
                <Select required>
                  <SelectTrigger id="reviewer">
                    <SelectValue placeholder="Select reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="mgr1">Michael Wilson (Manager)</SelectItem>
                    <SelectItem value="mgr2">Sarah Thompson (Director)</SelectItem>
                    <SelectItem value="mgr3">David Brown (Team Lead)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-medium">Performance Ratings</h3>
              <p className="text-sm text-muted-foreground">Rate the employee on a scale of 1-5 for each category.</p>

              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="productivity">Productivity</Label>
                    <span className="text-sm font-medium">{ratings.productivity}/5</span>
                  </div>
                  <Slider
                    id="productivity"
                    min={1}
                    max={5}
                    step={1}
                    value={[ratings.productivity]}
                    onValueChange={(value) => handleRatingChange("productivity", value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="quality">Quality of Work</Label>
                    <span className="text-sm font-medium">{ratings.quality}/5</span>
                  </div>
                  <Slider
                    id="quality"
                    min={1}
                    max={5}
                    step={1}
                    value={[ratings.quality]}
                    onValueChange={(value) => handleRatingChange("quality", value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="jobKnowledge">Job Knowledge</Label>
                    <span className="text-sm font-medium">{ratings.jobKnowledge}/5</span>
                  </div>
                  <Slider
                    id="jobKnowledge"
                    min={1}
                    max={5}
                    step={1}
                    value={[ratings.jobKnowledge]}
                    onValueChange={(value) => handleRatingChange("jobKnowledge", value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="reliability">Reliability & Dependability</Label>
                    <span className="text-sm font-medium">{ratings.reliability}/5</span>
                  </div>
                  <Slider
                    id="reliability"
                    min={1}
                    max={5}
                    step={1}
                    value={[ratings.reliability]}
                    onValueChange={(value) => handleRatingChange("reliability", value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="communication">Communication Skills</Label>
                    <span className="text-sm font-medium">{ratings.communication}/5</span>
                  </div>
                  <Slider
                    id="communication"
                    min={1}
                    max={5}
                    step={1}
                    value={[ratings.communication]}
                    onValueChange={(value) => handleRatingChange("communication", value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="teamwork">Teamwork & Collaboration</Label>
                    <span className="text-sm font-medium">{ratings.teamwork}/5</span>
                  </div>
                  <Slider
                    id="teamwork"
                    min={1}
                    max={5}
                    step={1}
                    value={[ratings.teamwork]}
                    onValueChange={(value) => handleRatingChange("teamwork", value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="initiative">Initiative & Proactivity</Label>
                    <span className="text-sm font-medium">{ratings.initiative}/5</span>
                  </div>
                  <Slider
                    id="initiative"
                    min={1}
                    max={5}
                    step={1}
                    value={[ratings.initiative]}
                    onValueChange={(value) => handleRatingChange("initiative", value)}
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <Label htmlFor="adaptability">Adaptability & Learning</Label>
                    <span className="text-sm font-medium">{ratings.adaptability}/5</span>
                  </div>
                  <Slider
                    id="adaptability"
                    min={1}
                    max={5}
                    step={1}
                    value={[ratings.adaptability]}
                    onValueChange={(value) => handleRatingChange("adaptability", value)}
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="achievements">Key Achievements</Label>
              <Textarea
                id="achievements"
                placeholder="List major accomplishments during this review period"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="areas-improvement">Areas for Improvement</Label>
              <Textarea
                id="areas-improvement"
                placeholder="Identify areas where the employee could improve"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals">Goals for Next Period</Label>
              <Textarea
                id="goals"
                placeholder="Set specific, measurable goals for the next review period"
                className="min-h-[100px]"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="training-needs">Training & Development Needs</Label>
              <Textarea
                id="training-needs"
                placeholder="Recommend training or development opportunities"
                className="min-h-[100px]"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="overall-comments">Overall Comments</Label>
              <Textarea
                id="overall-comments"
                placeholder="Provide a summary of the employee's overall performance"
                className="min-h-[100px]"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="outline" type="button" onClick={() => router.push("/performance")}>
              Cancel
            </Button>
            <Button type="submit" disabled={status === "loading"}>
              {status === "loading" ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit Review"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

