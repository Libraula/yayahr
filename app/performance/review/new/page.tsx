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
import { submitPerformanceReview } from "@/lib/supabase-functions" // Import the function

interface ReviewFormData {
  employee_id: string | null
  review_period: string
  review_date: string
  reviewer_id: string | null
  achievements: string
  areas_improvement: string
  goals: string
  training_needs: string
  overall_comments: string
}

export default function NewPerformanceReviewPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [formData, setFormData] = useState<ReviewFormData>({
    employee_id: null,
    review_period: "",
    review_date: "",
    reviewer_id: null,
    achievements: "",
    areas_improvement: "",
    goals: "",
    training_needs: "",
    overall_comments: "",
  })

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

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }))
  }

  const handleSelectChange = (name: keyof ReviewFormData) => (value: string) => {
    setFormData((prevData) => ({
      ...prevData,
      [name]: value, // Assuming value is the ID for employee/reviewer
    }))
  }

  const handleRatingChange = (category: keyof typeof ratings, value: number[]) => {
    setRatings((prev) => ({
      ...prev,
      [category]: value[0],
    }))
  }
  // TODO: Fetch actual employees and reviewers for Select dropdowns

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setStatus("loading")

    console.log("Submitting Performance Review:", { ...formData, ratings })

    try {
      // Calculate overall rating (simple average)
      const ratingValues = Object.values(ratings)
      const overallRating = ratingValues.reduce((sum, val) => sum + val, 0) / ratingValues.length

      // Prepare payload for Supabase
      const payload = {
        employee_id: formData.employee_id,
        reviewer_id: formData.reviewer_id,
        review_date: formData.review_date,
        review_period: formData.review_period, // Assuming schema has this, otherwise add to kpis
        kpis: { // Store ratings and comments in JSONB
          ratings: ratings,
          achievements: formData.achievements,
          areas_for_improvement: formData.areas_improvement,
          goals_for_next_period: formData.goals,
          overall_comments: formData.overall_comments,
        },
        rating: parseFloat(overallRating.toFixed(1)), // Store calculated overall rating
        training_recommendations: formData.training_needs ? formData.training_needs.split('\n') : [], // Split training needs into array
        // promotion_eligibility: false, // Add if needed
      }

      // Validate required fields
      if (!payload.employee_id || !payload.reviewer_id || !payload.review_date || !payload.review_period) {
         throw new Error("Please fill in all required fields (Employee, Reviewer, Date, Period).")
      }


      const result = await submitPerformanceReview(payload)

      if (result) {
        setStatus("success")
        toast({
          title: "Performance review submitted",
          description: "The performance review has been submitted successfully.",
        })
        router.push("/performance")
      } else {
        throw new Error("Failed to submit performance review to Supabase.")
      }
    } catch (error) {
      console.error("Error submitting performance review:", error)
      setStatus("error")
      toast({
        title: "Error",
        description: `There was an error submitting the review: ${error instanceof Error ? error.message : "Unknown error"}`,
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
                <Select required name="employee_id" value={formData.employee_id || ""} onValueChange={handleSelectChange("employee_id")}>
                  <SelectTrigger id="employee">
                    <SelectValue placeholder="Select employee" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* TODO: Replace with dynamic employee list */}
                    <SelectItem value="uuid-john-doe">John Doe</SelectItem>
                    <SelectItem value="uuid-jane-smith">Jane Smith</SelectItem>
                    <SelectItem value="uuid-robert-johnson">Robert Johnson</SelectItem>
                    <SelectItem value="uuid-emily-davis">Emily Davis</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="review-period">Review Period</Label>
                <Select required name="review_period" value={formData.review_period} onValueChange={handleSelectChange("review_period")}>
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
                <Input id="review_date" name="review_date" type="date" required value={formData.review_date} onChange={handleInputChange} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reviewer">Reviewer</Label>
                <Select required name="reviewer_id" value={formData.reviewer_id || ""} onValueChange={handleSelectChange("reviewer_id")}>
                  <SelectTrigger id="reviewer">
                    <SelectValue placeholder="Select reviewer" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* TODO: Replace with dynamic reviewer list */}
                    <SelectItem value="uuid-michael-wilson">Michael Wilson (Manager)</SelectItem>
                    <SelectItem value="uuid-sarah-thompson">Sarah Thompson (Director)</SelectItem>
                    <SelectItem value="uuid-david-brown">David Brown (Team Lead)</SelectItem>
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
                name="achievements"
                placeholder="List major accomplishments during this review period"
                className="min-h-[100px]"
                required
                value={formData.achievements}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="areas-improvement">Areas for Improvement</Label>
              <Textarea
                id="areas_improvement"
                name="areas_improvement"
                placeholder="Identify areas where the employee could improve"
                className="min-h-[100px]"
                required
                value={formData.areas_improvement}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="goals">Goals for Next Period</Label>
              <Textarea
                id="goals"
                name="goals"
                placeholder="Set specific, measurable goals for the next review period"
                className="min-h-[100px]"
                required
                value={formData.goals}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="training-needs">Training & Development Needs</Label>
              <Textarea
                id="training_needs"
                name="training_needs"
                placeholder="Recommend training or development opportunities (one per line)"
                className="min-h-[100px]"
                value={formData.training_needs}
                onChange={handleInputChange}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="overall-comments">Overall Comments</Label>
              <Textarea
                id="overall_comments"
                name="overall_comments"
                placeholder="Provide a summary of the employee's overall performance"
                className="min-h-[100px]"
                required
                value={formData.overall_comments}
                onChange={handleInputChange}
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

