import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Users,
  Clock,
  Calendar,
  FileText,
  AlertTriangle,
  TrendingUp,
  DollarSign,
  UserCheck,
  UserPlus,
} from "lucide-react"
import { getDashboardStats, getRecentActivities, fetchEmployees, fetchDepartments } from "@/lib/supabase"
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from "recharts"

export default async function Dashboard() {
  try {
    // Fetch data from Supabase with error handling
    const stats = await getDashboardStats().catch((error) => {
      console.error("Error fetching dashboard stats:", error)
      return {
        totalEmployees: 0,
        departments: 0,
        pendingLeaves: 0,
        newHires: 0,
        activeEmployees: 0,
        probationEmployees: 0,
      }
    })

    // Use a default empty array if getRecentActivities fails
    let recentActivities = []
    try {
      recentActivities = await getRecentActivities()
    } catch (error) {
      console.error("Error fetching recent activities:", error)
    }

    const employees = await fetchEmployees().catch((error) => {
      console.error("Error fetching employees:", error)
      return []
    })

    const departments = await fetchDepartments().catch((error) => {
      console.error("Error fetching departments:", error)
      return []
    })

    // Process department data for chart (with error handling)
    const departmentData = processDepartmentData(employees, departments)

    // Process gender data for chart
    const genderData = processGenderData(employees)

    return (
      <div className="flex flex-col gap-5">
        <h1 className="text-3xl font-bold">Dashboard</h1>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Employees"
            value={stats.totalEmployees.toString()}
            description="Active employees"
            icon={<Users className="h-5 w-5 text-blue-600" />}
            trend={`${stats.totalEmployees > 0 ? "+" : ""}${stats.newHires} from last month`}
            trendUp={true}
          />
          <DashboardCard
            title="Departments"
            value={stats.departments.toString()}
            description="Company departments"
            icon={<Clock className="h-5 w-5 text-green-600" />}
            trend="No change"
            trendUp={true}
          />
          <DashboardCard
            title="Pending Leaves"
            value={stats.pendingLeaves.toString()}
            description="Awaiting approval"
            icon={<Calendar className="h-5 w-5 text-amber-600" />}
            trend={`${stats.pendingLeaves > 0 ? "+" : ""}${stats.pendingLeaves} from last week`}
            trendUp={false}
          />
          <DashboardCard
            title="New Hires"
            value={stats.newHires.toString()}
            description="This month"
            icon={<FileText className="h-5 w-5 text-purple-600" />}
            trend={`${stats.newHires > 0 ? "+" : ""}${stats.newHires} from last month`}
            trendUp={true}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Employee Overview</CardTitle>
              <CardDescription>Employee distribution by department</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-80">
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
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Alerts & Notifications</CardTitle>
              <CardDescription>Important updates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Alert
                  title="Payroll Processing"
                  description="Payroll for April is due in 3 days"
                  icon={<DollarSign className="h-5 w-5 text-amber-600" />}
                />
                <Alert
                  title="Performance Reviews"
                  description="5 performance reviews pending"
                  icon={<UserCheck className="h-5 w-5 text-blue-600" />}
                />
                <Alert
                  title="Document Expiry"
                  description="3 employee contracts expiring soon"
                  icon={<AlertTriangle className="h-5 w-5 text-red-600" />}
                />
                <Alert
                  title="New Hires"
                  description={`${stats.newHires} new employees joining next week`}
                  icon={<UserPlus className="h-5 w-5 text-green-600" />}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="recent-activities">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="recent-activities">Recent Activities</TabsTrigger>
            <TabsTrigger value="upcoming-events">Upcoming Events</TabsTrigger>
            <TabsTrigger value="quick-actions">Quick Actions</TabsTrigger>
          </TabsList>
          <TabsContent value="recent-activities" className="border rounded-md p-4 mt-2">
            <h3 className="font-semibold mb-4">Recent Activities</h3>
            <div className="space-y-4">
              {recentActivities && recentActivities.length > 0 ? (
                recentActivities.map((activity) => {
                  let icon
                  switch (activity.type) {
                    case "employee_added":
                      icon = <UserPlus className="h-5 w-5 text-blue-600" />
                      break
                    case "leave_request":
                      icon = <Calendar className="h-5 w-5 text-green-600" />
                      break
                    case "performance_review":
                      icon = <FileText className="h-5 w-5 text-purple-600" />
                      break
                    default:
                      icon = <FileText className="h-5 w-5 text-gray-600" />
                  }

                  return (
                    <Activity
                      key={activity.id}
                      title={activity.title}
                      description={activity.description}
                      time={formatTimeAgo(activity.time)}
                      icon={icon}
                    />
                  )
                })
              ) : (
                <p className="text-muted-foreground">No recent activities</p>
              )}
            </div>
          </TabsContent>
          <TabsContent value="upcoming-events" className="border rounded-md p-4 mt-2">
            <h3 className="font-semibold mb-4">Upcoming Events</h3>
            <div className="space-y-4">
              <Activity
                title="Company Meeting"
                description="Quarterly company meeting in the main conference room"
                time="Tomorrow, 10:00 AM"
                icon={<Users className="h-5 w-5 text-blue-600" />}
              />
              <Activity
                title="Training Session"
                description="Leadership training for department managers"
                time="April 15, 2:00 PM"
                icon={<FileText className="h-5 w-5 text-green-600" />}
              />
              <Activity
                title="Public Holiday"
                description="Labor Day - Office Closed"
                time="May 1"
                icon={<Calendar className="h-5 w-5 text-red-600" />}
              />
            </div>
          </TabsContent>
          <TabsContent value="quick-actions" className="border rounded-md p-4 mt-2">
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <QuickAction title="Add Employee" href="/employees/add" />
              <QuickAction title="Process Payroll" href="/payroll/process" />
              <QuickAction title="Approve Leave" href="/leave" />
              <QuickAction title="Generate Reports" href="/reports" />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    )
  } catch (error) {
    console.error("Error in Dashboard component:", error)
    return (
      <div>
        <p>Error loading dashboard. Please try again later.</p>
      </div>
    )
  }
}

function DashboardCard({ title, value, description, icon, trend, trendUp }) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between space-x-4">
          <div className="flex flex-col space-y-1">
            <span className="text-sm font-medium text-muted-foreground">{title}</span>
            <span className="text-2xl font-bold">{value}</span>
            <span className="text-xs text-muted-foreground">{description}</span>
          </div>
          <div className="rounded-full bg-muted p-3">{icon}</div>
        </div>
        <div className="flex items-center mt-4 text-xs">
          {trendUp ? (
            <TrendingUp className="mr-1 h-3 w-3 text-green-600" />
          ) : (
            <TrendingUp className="mr-1 h-3 w-3 text-red-600 transform rotate-180" />
          )}
          <span className={trendUp ? "text-green-600" : "text-red-600"}>{trend}</span>
        </div>
      </CardContent>
    </Card>
  )
}

function Alert({ title, description, icon }) {
  return (
    <div className="flex items-start space-x-3 p-3 border rounded-md">
      <div className="rounded-full bg-muted p-1.5">{icon}</div>
      <div className="flex flex-col space-y-0.5">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
      </div>
    </div>
  )
}

function Activity({ title, description, time, icon }) {
  return (
    <div className="flex items-start space-x-3">
      <div className="rounded-full bg-muted p-1.5 mt-0.5">{icon}</div>
      <div className="flex flex-col space-y-0.5">
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground">{description}</span>
        <span className="text-xs text-muted-foreground">{time}</span>
      </div>
    </div>
  )
}

function QuickAction({ title, href }) {
  return (
    <Link
      href={href}
      className="flex items-center justify-center p-4 border rounded-md hover:bg-muted transition-colors"
    >
      <span className="text-sm font-medium">{title}</span>
    </Link>
  )
}

// Helper function to format time ago
function formatTimeAgo(dateString) {
  const date = new Date(dateString)
  const now = new Date()
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000)

  if (diffInSeconds < 60) {
    return "Just now"
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? "s" : ""} ago`
  }

  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} hour${diffInHours > 1 ? "s" : ""} ago`
  }

  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} day${diffInDays > 1 ? "s" : ""} ago`
  }

  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} month${diffInMonths > 1 ? "s" : ""} ago`
  }

  const diffInYears = Math.floor(diffInMonths / 12)
  return `${diffInYears} year${diffInYears > 1 ? "s" : ""} ago`
}

// Helper functions for data processing
const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658", "#8DD1E1"]

function processDepartmentData(employees, departments) {
  const departmentCounts = {}

  // Initialize with all departments
  departments.forEach((dept) => {
    departmentCounts[dept.name] = 0
  })

  // Count employees in each department
  employees.forEach((emp) => {
    if (emp.department_id) {
      // Find the department name from the department_id
      const dept = departments.find((d) => d.id === emp.department_id)
      if (dept && dept.name) {
        departmentCounts[dept.name] = (departmentCounts[dept.name] || 0) + 1
      }
    }
  })

  // Convert to array format for chart
  return Object.entries(departmentCounts).map(([name, value]) => ({
    name,
    value,
  }))
}

function processGenderData(employees) {
  const genderCounts = {
    Male: 0,
    Female: 0,
    Other: 0,
  }

  employees.forEach((emp) => {
    if (emp.gender) {
      genderCounts[emp.gender] = (genderCounts[emp.gender] || 0) + 1
    }
  })

  return Object.entries(genderCounts).map(([name, value]) => ({
    name,
    value,
  }))
}

