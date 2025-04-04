"use client" // Make the parent page a client component to manage state easily, or pass handlers down

import Link from "next/link"
import { useState, useEffect, useTransition } from "react" // Import hooks for state and transitions
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search, Filter, Download, UserPlus, Mail, Phone, Building, Calendar, Loader2, MoreHorizontal } from "lucide-react" // Added Loader2 and MoreHorizontal
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuSub,        // Import Submenu components
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuRadioGroup, // Import Radio Group for status selection
  DropdownMenuRadioItem,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { fetchEmployees } from "@/lib/supabase" // fetchEmployees is in supabase.ts now
import { updateEmployeeStatus } from "@/lib/supabase-functions" // Import the new function
import { toast } from "@/components/ui/use-toast" // Import toast for feedback

// Define the type for the employee data structure returned by fetchEmployees
// (Should ideally match the return type processing in lib/supabase.ts)
type EmployeeDisplayData = {
  id: string;
  employee_id: string | null;
  full_name: string;
  email: string | null;
  phone_number: string | null;
  department: string;
  job_grade: string;
  status: string;
  created_at: string;
};

export default function EmployeesPage() {
  const [employees, setEmployees] = useState<EmployeeDisplayData[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch employees on the client side
  useEffect(() => {
    async function loadEmployees() {
      setIsLoading(true)
      setError(null)
      try {
        const data = await fetchEmployees()
        setEmployees(data)
      } catch (err) {
        console.error("Error fetching employees:", err)
        setError("Failed to load employees. Please try again.")
        setEmployees([]) // Clear employees on error
      } finally {
        setIsLoading(false)
      }
    }
    loadEmployees()
  }, [])

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
              <EmployeeTable employees={employees} isLoading={isLoading} error={error} refreshData={() => { /* Implement refresh logic */ setIsLoading(true); fetchEmployees().then(setEmployees).catch(err => setError("Refresh failed")).finally(() => setIsLoading(false)); }} />
            </TabsContent>
            <TabsContent value="active">
              {/* Adjust filter logic based on the actual status values */}
              <EmployeeTable employees={employees.filter((emp) => emp.status === "active")} isLoading={isLoading} error={error} refreshData={() => { setIsLoading(true); fetchEmployees().then(setEmployees).catch(err => setError("Refresh failed")).finally(() => setIsLoading(false)); }} />
            </TabsContent>
            <TabsContent value="onleave">
              {/* Add filter for 'probation' or other relevant statuses if needed */}
              <EmployeeTable employees={employees.filter((emp) => emp.status === "probation" || emp.status === "suspended")} isLoading={isLoading} error={error} refreshData={() => { setIsLoading(true); fetchEmployees().then(setEmployees).catch(err => setError("Refresh failed")).finally(() => setIsLoading(false)); }} />
            </TabsContent>
            <TabsContent value="terminated">
              <EmployeeTable employees={employees.filter((emp) => emp.status === "terminated" || emp.status === "retired")} isLoading={isLoading} error={error} refreshData={() => { setIsLoading(true); fetchEmployees().then(setEmployees).catch(err => setError("Refresh failed")).finally(() => setIsLoading(false)); }} />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

// Update the EmployeeTable component to handle the new schema
// Make EmployeeTable a client component to handle state and actions
// Pass down a function to refresh data after status update
function EmployeeTable({ employees, isLoading, error, refreshData }: { employees: EmployeeDisplayData[], isLoading: boolean, error: string | null, refreshData: () => void }) {
  const [isUpdating, startTransition] = useTransition(); // For pending UI state on status change

  const handleStatusChange = async (employeeId: string, newStatus: string) => {
    startTransition(async () => {
      try {
        await updateEmployeeStatus(employeeId, newStatus);
        toast({
          title: "Status Updated",
          description: `Employee status changed to ${newStatus}.`,
        });
        refreshData(); // Refresh the employee list
      } catch (err: any) {
        console.error("Failed to update status:", err);
        toast({
          title: "Update Failed",
          description: err.message || "Could not update employee status.",
          variant: "destructive",
        });
      }
    });
  };

  // Define possible statuses for the dropdown
  const possibleStatuses = ['probation', 'active', 'suspended', 'terminated', 'retired'];
  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead className="hidden md:table-cell">Department</TableHead>
            <TableHead className="hidden lg:table-cell">Job Grade</TableHead> {/* Added Job Grade */}
            <TableHead className="hidden lg:table-cell">Contact</TableHead>
            {/* <TableHead className="hidden lg:table-cell">Join Date</TableHead> Removed Join Date for now */}
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
             <TableRow>
               <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                 <Loader2 className="mx-auto h-6 w-6 animate-spin" />
               </TableCell>
             </TableRow>
           ) : error ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-6 text-red-600">
                  {error}
                </TableCell>
              </TableRow>
           ) : employees.length > 0 ? (
            employees.map((employee) => (
              <TableRow key={employee.id}>
                {/* Employee Cell */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarImage
                        src={`/placeholder-user.jpg`} // Use a consistent placeholder
                        alt={employee.full_name || "Employee"}
                      />
                      <AvatarFallback>{employee.full_name?.charAt(0)?.toUpperCase() || "E"}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{employee.full_name}</p>
                      <p className="text-xs text-muted-foreground">{employee.employee_id || "No ID"}</p>
                    </div>
                  </div>
                </TableCell>
                {/* Department Cell */}
                <TableCell className="hidden md:table-cell">{employee.department}</TableCell>
                {/* Job Grade Cell */}
                <TableCell className="hidden lg:table-cell">{employee.job_grade}</TableCell>
                {/* Contact Cell */}
                <TableCell className="hidden lg:table-cell">
                  <div className="space-y-1">
                    {employee.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{employee.email}</span>
                      </div>
                    )}
                    {employee.phone_number && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 text-muted-foreground" />
                        <span className="text-xs">{employee.phone_number}</span>
                      </div>
                    )}
                  </div>
                </TableCell>
                {/* Status Cell */}
                <TableCell>
                   <Badge
                     variant={
                       employee.status === "active" ? "default"
                       : employee.status === "probation" ? "secondary"
                       : employee.status === "suspended" ? "outline"
                       : "destructive" // terminated, retired
                     }
                     className="capitalize" // Capitalize status text
                   >
                     {employee.status}
                   </Badge>
                </TableCell>
                {/* Actions Cell */}
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" disabled={isUpdating}>
                         {isUpdating ? <Loader2 className="h-4 w-4 animate-spin" /> : <MoreHorizontal className="h-4 w-4" />} {/* Use MoreHorizontal icon */}
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem asChild>
                        <Link href={`/employees/${employee.id}`}>View Profile</Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                         <Link href={`/employees/${employee.id}/edit`}>Edit</Link>
                      </DropdownMenuItem>
                      {/* Add other relevant actions */}
                      <DropdownMenuSeparator />
                      <DropdownMenuSub>
                        <DropdownMenuSubTrigger>Change Status</DropdownMenuSubTrigger>
                        <DropdownMenuSubContent>
                          <DropdownMenuRadioGroup
                             value={employee.status}
                             onValueChange={(newStatus) => {
                               if (newStatus !== employee.status) {
                                 handleStatusChange(employee.id, newStatus);
                               }
                             }}
                          >
                            {possibleStatuses.map((statusOption) => (
                              <DropdownMenuRadioItem key={statusOption} value={statusOption} className="capitalize">
                                {statusOption}
                              </DropdownMenuRadioItem>
                            ))}
                          </DropdownMenuRadioGroup>
                        </DropdownMenuSubContent>
                      </DropdownMenuSub>
                      {/* Example: Terminate action (could be separate or part of status change) */}
                      {/* <DropdownMenuItem className="text-red-600" onClick={() => handleStatusChange(employee.id, 'terminated')}>
                        Terminate
                      </DropdownMenuItem> */}
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

