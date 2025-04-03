// app/reports/report-charts.tsx
"use client"

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#8DD1E1"]

// Define interfaces for chart data props
interface ChartDataPoint {
  name: string
  value: number
}

interface SalaryDataPoint {
  range: string
  count: number
}

interface TurnoverDataPoint {
  month: string
  hires: number
  exits: number
  turnoverRate: number
}

interface LeaveStatusDataPoint {
    name: string;
    value: number;
}

interface DepartmentDistributionChartProps {
  data: ChartDataPoint[]
}

export function DepartmentDistributionChart({ data }: DepartmentDistributionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Department Distribution</CardTitle>
        <CardDescription>Employee count by department</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} employees`, "Count"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

interface EmploymentTypeChartProps {
  data: ChartDataPoint[]
}

export function EmploymentTypeChart({ data }: EmploymentTypeChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employment Type</CardTitle>
        <CardDescription>Employee count by employment type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
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
        </div>
      </CardContent>
    </Card>
  )
}

interface SalaryDistributionChartProps {
  data: SalaryDataPoint[]
}

export function SalaryDistributionChart({ data }: SalaryDistributionChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Salary Distribution</CardTitle>
        <CardDescription>Employee count by salary range</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
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
        </div>
      </CardContent>
    </Card>
  )
}

interface EmployeeTurnoverChartProps {
  data: TurnoverDataPoint[]
}

export function EmployeeTurnoverChart({ data }: EmployeeTurnoverChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Employee Turnover Trend</CardTitle>
        <CardDescription>Monthly employee turnover rate</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
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
        </div>
      </CardContent>
    </Card>
  )
}

interface LeaveByTypeChartProps {
  data: ChartDataPoint[]
}

export function LeaveByTypeChart({ data }: LeaveByTypeChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Requests by Type</CardTitle>
        <CardDescription>Distribution of leave requests by type</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={true}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => [`${value} requests`, "Count"]} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

interface LeaveStatusChartProps {
  data: LeaveStatusDataPoint[]
}

export function LeaveStatusChart({ data }: LeaveStatusChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Leave Status</CardTitle>
        <CardDescription>Status of leave requests</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
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
              <Bar dataKey="value" fill="#8884d8" name="Requests" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}

interface PayrollTrendChartProps {
  data: { period: string; amount: number }[]
}

export function PayrollTrendChart({ data }: PayrollTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payroll Trend</CardTitle>
        <CardDescription>Monthly payroll amounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{
                top: 5,
                right: 30,
                left: 20,
                bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="period" />
              <YAxis />
              <Tooltip formatter={(value) => [`UGX ${value.toLocaleString()}`, "Amount"]} />
              <Legend />
              <Line type="monotone" dataKey="amount" stroke="#8884d8" name="Payroll Amount" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}