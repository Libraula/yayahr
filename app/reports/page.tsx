"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts"
import { Download, FileText, Filter } from "lucide-react"

export default function ReportsPage() {
  const [isClient, setIsClient] = useState(false)
  const [departmentData, setDepartmentData] = useState([])
  const [genderData, setGenderData] = useState([])
  const [employmentTypeData, setEmploymentTypeData] = useState([])
  const [leaveData, setLeaveData] = useState([])
  const [salaryRangeData, setSalaryRangeData] = useState([])
  const [employeeTurnoverData, setEmployeeTurnoverData] = useState([])

  useEffect(() => {
    setIsClient(true)

    // Sample data for charts
    setDepartmentData([
      { name: "Engineering", value: 12 },
      { name: "Product", value: 8 },
      { name: "Design", value: 5 },
      { name: "Marketing", value: 4 },
      { name: "Sales", value: 6 },
      { name: "HR", value: 3 },
      { name: "Finance", value: 4 },
    ])

    setGenderData([
      { name: "Male", value: 22 },
      { name: "Female", value: 18 },
      { name: "Other", value: 2 },
    ])

    setEmploymentTypeData([
      { name: "Full-time", value: 32 },
      { name: "Part-time", value: 5 },
      { name: "Contract", value: 4 },
      { name: "Intern", value: 1 },
    ])

    setLeaveData([
      { name: "Annual Leave", value: 45 },
      { name: "Sick Leave", value: 22 },
      { name: "Maternity/Paternity", value: 5 },
      { name: "Unpaid Leave", value: 8 },
    ])

    setSalaryRangeData([
      { range: "Below 500K", count: 2 },
      { range: "500K-1M", count: 5 },
      { range: "1M-2M", count: 8 },
      { range: "2M-3M", count: 6 },
      { range: "3M-5M", count: 3 },
      { range: "Above 5M", count: 1 },
    ])

    setEmployeeTurnoverData([
      { month: "Jan", hires: 3, exits: 1, turnoverRate: 2.5 },
      { month: "Feb", hires: 2, exits: 1, turnoverRate: 2.4 },
      { month: "Mar", hires: 4, exits: 2, turnoverRate: 4.8 },
      { month: "Apr", hires: 3, exits: 0, turnoverRate: 0 },
      { month: "May", hires: 2, exits: 1, turnoverRate: 2.3 },
      { month: "Jun", hires: 5, exits: 2, turnoverRate: 4.5 },
    ])
  }, [])

  // Define colors for charts
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#8DD1E1"]
  const GENDER_COLORS = ["#0088FE", "#FF8042", "#FFBB28"]

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Employee count by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isClient ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={departmentData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {departmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} employees`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Gender Distribution</CardTitle>
            <CardDescription>Employee count by gender</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isClient ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={genderData}
                      cx="50%"
                      cy="50%"
                      labelLine={true}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {genderData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [`${value} employees`, "Count"]} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment Type</CardTitle>
            <CardDescription>Employee count by employment type</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isClient ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={employmentTypeData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#8884d8" name="Employees" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Salary Distribution</CardTitle>
            <CardDescription>Employee count by salary range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              {isClient ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={salaryRangeData}
                    margin={{
                      top: 5,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="range" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="count" fill="#82ca9d" name="Employees" />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>Loading chart...</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Employee Turnover Trend</CardTitle>
          <CardDescription>Monthly employee turnover rate</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            {isClient ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={employeeTurnoverData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="hires" stroke="#82ca9d" name="New Hires" />
                  <Line type="monotone" dataKey="exits" stroke="#ff7300" name="Exits" />
                  <Line type="monotone" dataKey="turnoverRate" stroke="#8884d8" name="Turnover Rate (%)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p>Loading chart...</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

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
              count={42}
            />
            <ReportCard title="Department Summary" description="Employee count and details by department" count={7} />
            <ReportCard title="Leave Balance" description="Employee leave balances and usage report" count={42} />
            <ReportCard
              title="Payroll Summary"
              description="Monthly payroll summary with deductions and allowances"
              count={6}
            />
            <ReportCard title="New Hires Report" description="List of employees hired in the last 30 days" count={3} />
            <ReportCard
              title="Compliance Status"
              description="Statutory compliance and document status report"
              count={42}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ReportCard({ title, description, count }) {
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

