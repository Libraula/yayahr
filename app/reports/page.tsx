import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Employee, Department, LeaveRequest } from "@/lib/supabase"
import { Download, FileText, Filter } from "lucide-react"
import {
  DepartmentDistributionChart,
  EmploymentTypeChart,
  SalaryDistributionChart,
  EmployeeTurnoverChart,
  LeaveByTypeChart,
  LeaveStatusChart,
  PayrollTrendChart,
} from "./report-charts"
import { fetchEmployees, fetchDepartments, fetchLeaveRequests, fetchPayrollRecords } from "@/lib/supabase"

export default async function ReportsPage() {
  // Fetch data from Supabase
  const employees = await fetchEmployees()
  const departments = await fetchDepartments()
  const leaveRequests = await fetchLeaveRequests()
  const payrollRecords = await fetchPayrollRecords()

  // Process data for charts
  const departmentData = processDepartmentData(employees, departments)
  const employmentTypeData = processEmploymentTypeData(employees)
  const leaveData = processLeaveData(leaveRequests)
  const salaryRangeData = processSalaryData(employees)
  const employeeTurnoverData = generateEmployeeTurnoverData() // Sample data for now

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">HR Reports</h1>
          <p className="text-muted-foreground">Comprehensive reports and analytics for HR management</p>
        </div>
        <div className="flex items-center gap-2">
          <Button>
            <FileText className="mr-2 h-4 w-4" />
            Generate Report
          </Button>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <Tabs defaultValue="workforce" className="w-full">
          <TabsList>
            <TabsTrigger value="workforce">Workforce</TabsTrigger>
            <TabsTrigger value="attendance">Attendance & Leave</TabsTrigger>
            <TabsTrigger value="payroll">Payroll</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex gap-2">
          <Select defaultValue="thisMonth">
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select period" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="thisMonth">This Month</SelectItem>
              <SelectItem value="lastMonth">Last Month</SelectItem>
              <SelectItem value="thisQuarter">This Quarter</SelectItem>
              <SelectItem value="thisYear">This Year</SelectItem>
              <SelectItem value="custom">Custom Range</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <Tabs defaultValue="workforce">
        <TabsContent value="workforce" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <DepartmentDistributionChart data={departmentData} />


            <EmploymentTypeChart data={employmentTypeData} />

            <SalaryDistributionChart data={salaryRangeData} />
          </div>

          <EmployeeTurnoverChart data={employeeTurnoverData} />
        </TabsContent>

        <TabsContent value="attendance" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LeaveByTypeChart data={leaveData} />

            <LeaveStatusChart data={[
              { name: "Approved", value: leaveRequests.filter((r) => r.status === "approved").length },
              { name: "Pending", value: leaveRequests.filter((r) => r.status === "pending").length },
              { name: "Rejected", value: leaveRequests.filter((r) => r.status === "rejected").length },
            ]} />
          </div>
        </TabsContent>

        <TabsContent value="payroll" className="space-y-4">
          <PayrollTrendChart data={payrollRecords.map((record) => ({
            period: record.period,
            amount: record.total_amount,
          }))} />
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Ratings</CardTitle>
              <CardDescription>Distribution of employee performance ratings</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80 flex items-center justify-center">
                <p className="text-muted-foreground">Performance data will be available once reviews are completed</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>HR Reports</CardTitle>
          <CardDescription>Generate and download HR reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <ReportCard
              title="Employee Directory"
              description="Complete list of all employees with contact details"
              count={employees.length}
            />
            <ReportCard
              title="Department Summary"
              description="Employee count and details by department"
              count={departments.length}
            />
            <ReportCard
              title="Leave Balance"
              description="Employee leave balances and usage report"
              count={employees.length}
            />
            <ReportCard
              title="Payroll Summary"
              description="Monthly payroll summary with deductions and allowances"
              count={payrollRecords.length}
            />
            <ReportCard
              title="New Hires Report"
              description="List of employees hired in the last 30 days"
              count={getNewHiresCount(employees)}
            />
            <ReportCard
              title="Compliance Status"
              description="Statutory compliance and document status report"
              count={employees.length}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ReportCard({ title, description, count }: { title: string; description: string; count: number }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="bg-muted p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-background p-2">
                <FileText className="h-5 w-5" />
              </div>
              <h3 className="font-medium">{title}</h3>
            </div>
            <div className="bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">{count} records</div>
          </div>
          <div className="p-4 flex flex-col gap-4">
            <p className="text-sm text-muted-foreground">{description}</p>
            <div className="flex items-center justify-between">
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button variant="ghost" size="sm">
                Generate
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Helper functions for data processing

function processDepartmentData(employees: Employee[], departments: Department[]) {
  const departmentCounts: { [key: string]: number } = {}

  // Initialize with all departments
  departments.forEach((dept: Department) => {
    departmentCounts[dept.name] = 0
  })

  // Count employees in each department
  employees.forEach((emp: Employee) => {
    if (emp.department) {
      if (emp.department?.name) { // Ensure department and name exist
        departmentCounts[emp.department.name] = (departmentCounts[emp.department.name] || 0) + 1
      }
    }
  })

  // Convert to array format for chart
  return Object.entries(departmentCounts).map(([name, value]) => ({
    name,
    value,
  }))
}

function processEmploymentTypeData(employees: Employee[]) {
  const typeCounts = {
    Permanent: 0,
    Contract: 0,
    Temporary: 0,
  }

  employees.forEach((emp: Employee) => {
    if (emp.employment_type) {
    const empType = emp.employment_type as keyof typeof typeCounts; // Add type assertion
    if (empType && typeCounts.hasOwnProperty(empType)) {
        typeCounts[empType] = (typeCounts[empType] || 0) + 1
    }
    }
  })

  return Object.entries(typeCounts).map(([name, value]) => ({
    name,
    value,
  }))
}

function processLeaveData(leaveRequests: LeaveRequest[]) {
  const leaveCounts: { [key: string]: number } = {}

  leaveRequests.forEach((leave: LeaveRequest) => {
    if (leave.leave_type) {
    if (leave.leave_type) {
        leaveCounts[leave.leave_type] = (leaveCounts[leave.leave_type] || 0) + 1
    }
    }
  })

  return Object.entries(leaveCounts).map(([name, value]) => ({
    name,
    value,
  }))
}

function processSalaryData(employees: Employee[]) {
  // This is a placeholder since we don't have actual salary data
  // In a real implementation, you would extract salary data from employees
  return [
    { range: "Below 500K", count: 2 },
    { range: "500K-1M", count: 5 },
    { range: "1M-2M", count: 8 },
    { range: "2M-3M", count: 6 },
    { range: "3M-5M", count: 3 },
    { range: "Above 5M", count: 1 },
  ]
}

function generateEmployeeTurnoverData() {
  // Sample data for employee turnover
  return [
    { month: "Jan", hires: 3, exits: 1, turnoverRate: 2.5 },
    { month: "Feb", hires: 2, exits: 1, turnoverRate: 2.4 },
    { month: "Mar", hires: 4, exits: 2, turnoverRate: 4.8 },
    { month: "Apr", hires: 3, exits: 0, turnoverRate: 0 },
    { month: "May", hires: 2, exits: 1, turnoverRate: 2.3 },
    { month: "Jun", hires: 5, exits: 2, turnoverRate: 4.5 },
  ]
}

function getNewHiresCount(employees: Employee[]) {
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  return employees.filter((emp: Employee) => {
    const createdDate = new Date(emp.created_at)
    return createdDate >= thirtyDaysAgo
  }).length
}

