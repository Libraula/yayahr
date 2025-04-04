import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Download, Filter, Search, CheckCircle, XCircle, Clock, ArrowRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function LeavePage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Leave Management</h1>
          <p className="text-muted-foreground">Manage employee leave requests and balances</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/leave/request">
            <Button>
              <Calendar className="mr-2 h-4 w-4" />
              Request Leave
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">12</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting approval</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Approved Leaves</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-2xl font-bold">45</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">This year</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Rejected Requests</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <XCircle className="h-4 w-4 text-red-500 mr-2" />
              <span className="text-2xl font-bold">8</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">This year</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>View and manage employee leave requests</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search requests..." className="pl-8 w-full sm:w-[250px]" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Requests</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="rejected">Rejected</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <LeaveRequestTable />
            </TabsContent>
            <TabsContent value="pending">
              <LeaveRequestTable status="Pending" />
            </TabsContent>
            <TabsContent value="approved">
              <LeaveRequestTable status="Approved" />
            </TabsContent>
            <TabsContent value="rejected">
              <LeaveRequestTable status="Rejected" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Leave Balances</CardTitle>
          <CardDescription>Employee leave entitlements and usage</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Annual Leave</TableHead>
                  <TableHead>Sick Leave</TableHead>
                  <TableHead>Maternity/Paternity</TableHead>
                  <TableHead>Study Leave</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {leaveBalances.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={`/placeholder.svg?height=40&width=40&text=${employee.name.charAt(0)}`}
                            alt={employee.name}
                          />
                          <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-xs text-muted-foreground">{employee.department}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {employee.annualLeave.used} / {employee.annualLeave.total}
                          </span>
                          <span className="text-xs text-muted-foreground">days</span>
                        </div>
                        <Progress value={(employee.annualLeave.used / employee.annualLeave.total) * 100} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {employee.sickLeave.used} / {employee.sickLeave.total}
                          </span>
                          <span className="text-xs text-muted-foreground">days</span>
                        </div>
                        <Progress value={(employee.sickLeave.used / employee.sickLeave.total) * 100} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {employee.maternityLeave.used} / {employee.maternityLeave.total}
                          </span>
                          <span className="text-xs text-muted-foreground">days</span>
                        </div>
                        <Progress value={(employee.maternityLeave.used / employee.maternityLeave.total) * 100} />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center justify-between text-sm">
                          <span>
                            {employee.studyLeave.used} / {employee.studyLeave.total}
                          </span>
                          <span className="text-xs text-muted-foreground">days</span>
                        </div>
                        <Progress value={(employee.studyLeave.used / employee.studyLeave.total) * 100} />
                      </div>
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
        </CardContent>
      </Card>
    </div>
  )
}

function LeaveRequestTable({ status }: { status?: string }) {
  // This would typically fetch from an API or database
  const allLeaveRequests = [
    {
      id: 1,
      employee: "Alex Johnson",
      department: "Engineering",
      leaveType: "Annual Leave",
      startDate: "2023-04-10",
      endDate: "2023-04-14",
      days: 5,
      reason: "Vacation",
      status: "Approved",
    },
    {
      id: 2,
      employee: "Sarah Williams",
      department: "Product",
      leaveType: "Sick Leave",
      startDate: "2023-04-05",
      endDate: "2023-04-06",
      days: 2,
      reason: "Medical appointment",
      status: "Approved",
    },
    {
      id: 3,
      employee: "Michael Brown",
      department: "Design",
      leaveType: "Annual Leave",
      startDate: "2023-04-24",
      endDate: "2023-04-28",
      days: 5,
      reason: "Family event",
      status: "Pending",
    },
    {
      id: 4,
      employee: "Emily Davis",
      department: "Marketing",
      leaveType: "Maternity Leave",
      startDate: "2023-05-15",
      endDate: "2023-08-15",
      days: 60,
      reason: "Maternity",
      status: "Pending",
    },
    {
      id: 5,
      employee: "David Wilson",
      department: "Human Resources",
      leaveType: "Study Leave",
      startDate: "2023-04-17",
      endDate: "2023-04-21",
      days: 5,
      reason: "Professional certification",
      status: "Rejected",
    },
  ]

  const leaveRequests = status ? allLeaveRequests.filter((request) => request.status === status) : allLeaveRequests

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Leave Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {leaveRequests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{request.employee}</span>
                  <span className="text-xs text-muted-foreground">{request.department}</span>
                </div>
              </TableCell>
              <TableCell>{request.leaveType}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>
                    {new Date(request.startDate).toLocaleDateString()} -{" "}
                    {new Date(request.endDate).toLocaleDateString()}
                  </span>
                  <span className="text-xs text-muted-foreground">{request.days} days</span>
                </div>
              </TableCell>
              <TableCell>{request.reason}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    request.status === "Approved" ? "default" : request.status === "Pending" ? "outline" : "destructive"
                  }
                >
                  {request.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {request.status === "Pending" && (
                    <>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                      <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                        <XCircle className="h-4 w-4 text-red-500" />
                      </Button>
                    </>
                  )}
                  <Button variant="ghost" size="sm">
                    Details
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// Sample data for leave balances
const leaveBalances = [
  {
    id: 1,
    name: "Alex Johnson",
    department: "Engineering",
    annualLeave: { used: 10, total: 21 },
    sickLeave: { used: 3, total: 10 },
    maternityLeave: { used: 0, total: 60 },
    studyLeave: { used: 0, total: 10 },
  },
  {
    id: 2,
    name: "Sarah Williams",
    department: "Product",
    annualLeave: { used: 15, total: 21 },
    sickLeave: { used: 2, total: 10 },
    maternityLeave: { used: 0, total: 60 },
    studyLeave: { used: 5, total: 10 },
  },
  {
    id: 3,
    name: "Michael Brown",
    department: "Design",
    annualLeave: { used: 7, total: 21 },
    sickLeave: { used: 0, total: 10 },
    maternityLeave: { used: 0, total: 0 },
    studyLeave: { used: 2, total: 10 },
  },
  {
    id: 4,
    name: "Emily Davis",
    department: "Marketing",
    annualLeave: { used: 5, total: 21 },
    sickLeave: { used: 1, total: 10 },
    maternityLeave: { used: 45, total: 60 },
    studyLeave: { used: 0, total: 10 },
  },
  {
    id: 5,
    name: "David Wilson",
    department: "Human Resources",
    annualLeave: { used: 12, total: 21 },
    sickLeave: { used: 4, total: 10 },
    maternityLeave: { used: 0, total: 0 },
    studyLeave: { used: 3, total: 10 },
  },
]

