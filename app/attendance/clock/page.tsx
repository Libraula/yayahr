"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckCircle, AlertCircle } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import Link from "next/link"

export default function ClockPage() {
  const { toast } = useToast()
  const [currentTime, setCurrentTime] = useState(new Date())
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [clockedIn, setClockedIn] = useState(false)
  const [clockInTime, setClockInTime] = useState<Date | null>(null)

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const handleClockIn = () => {
    setStatus("idle")

    try {
      // Here you would call your API to record the clock in
      const now = new Date()
      setClockInTime(now)
      setClockedIn(true)

      toast({
        title: "Clocked In",
        description: `You have successfully clocked in at ${now.toLocaleTimeString()}`,
      })

      setStatus("success")
    } catch (error) {
      console.error("Clock in error:", error)
      setStatus("error")
      toast({
        variant: "destructive",
        title: "Clock In Failed",
        description: "There was an error recording your clock in. Please try again.",
      })
    }
  }

  const handleClockOut = () => {
    setStatus("idle")

    try {
      // Here you would call your API to record the clock out
      const now = new Date()
      setClockedIn(false)

      let duration = "N/A"
      if (clockInTime) {
        const diff = now.getTime() - clockInTime.getTime()
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        duration = `${hours}h ${minutes}m`
      }

      toast({
        title: "Clocked Out",
        description: `You have successfully clocked out at ${now.toLocaleTimeString()}. Duration: ${duration}`,
      })

      setStatus("success")
    } catch (error) {
      console.error("Clock out error:", error)
      setStatus("error")
      toast({
        variant: "destructive",
        title: "Clock Out Failed",
        description: "There was an error recording your clock out. Please try again.",
      })
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { weekday: "long", year: "numeric", month: "long", day: "numeric" })
  }

  return (
    <div className="container mx-auto py-10">
      <Link href="/attendance" className="text-primary hover:underline mb-6 inline-block">
        &larr; Back to Attendance
      </Link>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Clock className="mr-2" /> Time Clock
          </CardTitle>
          <CardDescription>Record your work hours</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-center">
            <div className="text-4xl font-bold tabular-nums">{formatTime(currentTime)}</div>
            <div className="text-muted-foreground">{formatDate(currentTime)}</div>
          </div>

          {status === "success" && (
            <div className="bg-green-50 p-3 rounded-md flex items-center text-green-700">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>{clockedIn ? "Clock in" : "Clock out"} recorded successfully</span>
            </div>
          )}

          {status === "error" && (
            <div className="bg-red-50 p-3 rounded-md flex items-center text-red-700">
              <AlertCircle className="h-5 w-5 mr-2" />
              <span>An error occurred. Please try again.</span>
            </div>
          )}

          {clockedIn && clockInTime && (
            <div className="text-center">
              <div className="text-sm text-muted-foreground">Clocked in at</div>
              <div className="font-medium">{clockInTime.toLocaleTimeString()}</div>
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            onClick={clockedIn ? handleClockOut : handleClockIn}
            className="w-full"
            variant={clockedIn ? "outline" : "default"}
          >
            {clockedIn ? "Clock Out" : "Clock In"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

