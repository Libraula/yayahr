import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Download, Search, Calendar, CheckCircle, XCircle, AlertTriangle, ArrowRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"

export default function AttendancePage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Time & Attendance</h1>
          <p className="text-muted-foreground">Track employee attendance and working hours</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/attendance/clock">
            <Button>
              <Clock className="mr-2 h-4 w-4" />
              Clock In/Out
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Present Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-2xl font-bold">18</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Out of 24 employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Absent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <XCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-2xl font-bold">3</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Unplanned absences</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">On Leave</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">2</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Approved leave</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Late Arrivals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">4</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">More than 15 minutes</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Daily Attendance</CardTitle>
              <CardDescription>Today's attendance records</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search employee..." className="pl-8 w-full sm:w-[250px]" />
              </div>
              <Input
                type="date"
                defaultValue={new Date().toISOString().split("T")[0]}
                className="w-full sm:w-[150px]"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="present">Present</TabsTrigger>
              <TabsTrigger value="absent">Absent</TabsTrigger>
              <TabsTrigger value="late">Late</TabsTrigger>
              <TabsTrigger value="leave">On Leave</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <AttendanceTable />
            </TabsContent>
            <TabsContent value="present">
              <AttendanceTable status="Present" />
            </TabsContent>
            <TabsContent value="absent">
              <AttendanceTable status="Absent" />
            </TabsContent>
            <TabsContent value="late">
              <AttendanceTable status="Late" />
            </TabsContent>
            <TabsContent value="leave">
              <AttendanceTable status="On Leave" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Overview</CardTitle>
          <CardDescription>Monthly attendance statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80 flex items-center justify-center bg-muted/30 rounded-md">
            <p className="text-muted-foreground">Attendance Chart</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function AttendanceTable({ status }: { status?: string }) {
  // This would typically fetch from an API or database
  const allAttendance = [
    {
      id: 1,
      employee: "Alex Johnson",
      department: "Engineering",
      clockIn: "08:55",
      clockOut: "17:05",
      workHours: "8:10",
      status: "Present",
    },
    {
      id: 2,
      employee: "Sarah Williams",
      department: "Product",
      clockIn: "09:10",
      clockOut: "17:30",
      workHours: "8:20",
      status: "Late",
    },
    {
      id: 3,
      employee: "Michael Brown",
      department: "Design",
      clockIn: "",
      clockOut: "",
      workHours: "0:00",
      status: "Absent",
    },
    {
      id: 4,
      employee: "Emily Davis",
      department: "Marketing",
      clockIn: "08:45",
      clockOut: "17:00",
      workHours: "8:15",
      status: "Present",
    },
    {
      id: 5,
      employee: "David Wilson",
      department: "Human Resources",
      clockIn: "",
      clockOut: "",
      workHours: "0:00",
      status: "On Leave",
    },
    {
      id: 6,
      employee: "Jennifer Lee",
      department: "Finance",
      clockIn: "08:30",
      clockOut: "16:45",
      workHours: "8:15",
      status: "Present",
    },
    {
      id: 7,
      employee: "Robert Taylor",
      department: "IT",
      clockIn: "09:20",
      clockOut: "17:45",
      workHours: "8:25",
      status: "Late",
    },
  ]

  const attendance = status ? allAttendance.filter((record) => record.status === status) : allAttendance

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Clock In</TableHead>
            <TableHead>Clock Out</TableHead>
            <TableHead>Work Hours</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {attendance.map((record) => (
            <TableRow key={record.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={`/placeholder.svg?height=40&width=40&text=${record.employee.charAt(0)}`}
                      alt={record.employee}
                    />
                    <AvatarFallback>{record.employee.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{record.employee}</p>
                    <p className="text-xs text-muted-foreground">{record.department}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{record.clockIn || "-"}</TableCell>
              <TableCell>{record.clockOut || "-"}</TableCell>
              <TableCell>{record.workHours}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    record.status === "Present"
                      ? "default"
                      : record.status === "Late"
                        ? "outline"
                        : record.status === "On Leave"
                          ? "secondary"
                          : "destructive"
                  }
                >
                  {record.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

