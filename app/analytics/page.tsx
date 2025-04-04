import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  PieChart,
  Download,
  FileText,
  ArrowRight,
  BarChart,
  LineChart,
  Users,
  TrendingUp,
  TrendingDown,
} from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Reports & Analytics</h1>
          <p className="text-muted-foreground">Generate reports and analyze HR metrics</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/analytics/reports/new">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
        <Tabs defaultValue="overview" className="w-full">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="workforce">Workforce</TabsTrigger>
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
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard title="Total Employees" value="124" change="+4%" trend="up" icon={<Users className="h-4 w-4" />} />
        <MetricCard
          title="Average Salary"
          value="UGX 2.4M"
          change="+2.5%"
          trend="up"
          icon={<BarChart className="h-4 w-4" />}
        />
        <MetricCard
          title="Turnover Rate"
          value="3.2%"
          change="-0.8%"
          trend="down"
          icon={<LineChart className="h-4 w-4" />}
        />
        <MetricCard
          title="Avg. Time to Hire"
          value="24 days"
          change="-2 days"
          trend="down"
          icon={<PieChart className="h-4 w-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Department Distribution</CardTitle>
            <CardDescription>Employee count by department</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-muted/30 rounded-md">
              <p className="text-muted-foreground">Department Distribution Chart</p>
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-1">
          <CardHeader>
            <CardTitle>Salary Distribution</CardTitle>
            <CardDescription>Employee count by salary range</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-muted/30 rounded-md">
              <p className="text-muted-foreground">Salary Distribution Chart</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Employee Turnover Trend</CardTitle>
            <CardDescription>Monthly employee turnover rate</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80 flex items-center justify-center bg-muted/30 rounded-md">
              <p className="text-muted-foreground">Employee Turnover Chart</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Available Reports</CardTitle>
          <CardDescription>Generate and download HR reports</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <ReportCard
              title="Employee Directory"
              description="Complete list of all employees with contact details"
              icon={<Users className="h-5 w-5" />}
            />
            <ReportCard
              title="Payroll Summary"
              description="Monthly payroll summary with deductions and allowances"
              icon={<BarChart className="h-5 w-5" />}
            />
            <ReportCard
              title="Leave Balance"
              description="Employee leave balances and usage report"
              icon={<LineChart className="h-5 w-5" />}
            />
            <ReportCard
              title="Attendance Summary"
              description="Monthly attendance and time tracking report"
              icon={<PieChart className="h-5 w-5" />}
            />
            <ReportCard
              title="Performance Review"
              description="Employee performance ratings and feedback summary"
              icon={<BarChart className="h-5 w-5" />}
            />
            <ReportCard
              title="Compliance Status"
              description="Statutory compliance and document status report"
              icon={<FileText className="h-5 w-5" />}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function MetricCard({
  title,
  value,
  change,
  trend,
  icon,
}: {
  title: string
  value: string
  change: string
  trend: "up" | "down"
  icon: React.ReactNode
}) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            <span className="text-2xl font-bold">{value}</span>
          </div>
          <div className="rounded-full bg-muted p-3">{icon}</div>
        </div>
        <div className="flex items-center mt-4 text-xs">
          {trend === "up" ? (
            <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
          ) : (
            <TrendingDown className="mr-1 h-3 w-3 text-red-600" />
          )}
          <span className={trend === "up" ? "text-green-600" : "text-red-600"}>{change}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function ReportCard({
  title,
  description,
  icon,
}: {
  title: string
  description: string
  icon: React.ReactNode
}) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-0">
        <div className="flex flex-col">
          <div className="bg-muted p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="rounded-full bg-background p-2">{icon}</div>
              <h3 className="font-medium">{title}</h3>
            </div>
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
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

