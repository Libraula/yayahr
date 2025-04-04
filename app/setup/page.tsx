"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import { createClient } from "@/lib/supabase"

export default function SetupPage() {
  const { toast } = useToast()
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const setupDatabase = async () => {
    setStatus("loading")

    try {
      const supabase = createClient()

      // Create departments table
      await supabase.rpc("setup_database")

      setStatus("success")
      toast({
        title: "Database setup complete",
        description: "Your HR Management System database has been set up successfully.",
      })
    } catch (error) {
      console.error("Setup error:", error)
      setStatus("error")
      toast({
        variant: "destructive",
        title: "Setup failed",
        description: "There was an error setting up the database. Please try again.",
      })
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>HR Management System Setup</CardTitle>
          <CardDescription>Set up your database with the required tables and initial data.</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-4">
            This will create all necessary tables for your HR Management System including:
          </p>
          <ul className="list-disc pl-5 space-y-1 text-sm">
            <li>Employees</li>
            <li>Departments</li>
            <li>Job Grades</li>
            <li>Attendance Records</li>
            <li>Leave Management</li>
            <li>Payroll</li>
          </ul>
        </CardContent>
        <CardFooter>
          <Button onClick={setupDatabase} disabled={status === "loading" || status === "success"} className="w-full">
            {status === "loading" ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up...
              </>
            ) : status === "success" ? (
              "Setup Complete"
            ) : (
              "Set Up Database"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

