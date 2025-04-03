import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, UserPlus, Mail, Phone, Building, Calendar } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { fetchEmployees } from "@/lib/supabase"

export default async function EmployeesPage() {
  // Fetch employees from Supabase
  const employees = await fetchEmployees()

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Employee Management</h1>
          <p className="text-muted-foreground">Manage your employee database and records</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/employees/add">
            <Button>
              <UserPlus className="mr-2 h-4 w-4" />
              Add Employee
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Employee Directory</CardTitle>
              <CardDescription>Manage and view all employees</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search employees..." className="pl-8 w-full sm:w-[250px]" />
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
              <TabsTrigger value="all">All Employees</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="onleave">On Leave</TabsTrigger>
              <TabsTrigger value="terminated">Terminated</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <EmployeeTable employees={employees} />
            </TabsContent>
            <TabsContent value="active">
              <EmployeeTable employees={employees.filter((emp) => emp.status === "Active")} />
            </TabsContent>
            <TabsContent value="onleave">
              <EmployeeTable employees={employees.filter((emp) => emp.status === "On Leave")} />
            </TabsContent>
            <TabsContent value="terminated">
              <EmployeeTable employees={employees.filter((emp) => emp.status === "Terminated")} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function EmployeeTable({ employees }: { employees: any[] }) {
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead className="hidden md:table-cell">Department</TableHead>
            <TableHead className="hidden lg:table-cell">Contact</TableHead>
            <TableHead className="hidden lg:table-cell">Join Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {employees.length > 0 ? (
            employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`/placeholder.svg?height=40&width=40&text=${employee.full_name?.charAt(0) || "U"}`}
                        alt={employee.full_name || "Unknown"}
                      />
                      <AvatarFallback>{employee.full_name?.charAt(0) || "U"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{employee.full_name || "Unknown"}</p>
                      <p className="text-xs text-muted-foreground">{employee.job_title || "No position"}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden md:table-cell">
                  <div className="flex items-center gap-2">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{employee.department || "Unassigned"}</span>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <Mail className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{employee.email || "No email"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs">{employee.contact_number || "No phone"}</span>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="hidden lg:table-cell">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>
                      {employee.date_of_employment
                        ? new Date(employee.date_of_employment).toLocaleDateString()
                        : "Not set"}
                    </span>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      employee.status === "Active"
                        ? "default"
                        : employee.status === "On Leave"
                          ? "outline"
                          : "destructive"
                    }
                  >
                    {employee.status || "Unknown"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        Actions
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem>
                        <Link href={`/employees/${employee.id}`} className="flex w-full">
                          View Profile
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/employees/${employee.id}/edit`} className="flex w-full">
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link href={`/employees/${employee.id}/documents`} className="flex w-full">
                          Documents
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-red-600">Deactivate</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                No employees found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  )
}

