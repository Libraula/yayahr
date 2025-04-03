import type React from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowLeft, Mail, Phone, Building, Calendar, DollarSign, Edit } from "lucide-react"
import { fetchEmployee } from "@/lib/supabase"
import { notFound } from "next/navigation"

export default async function EmployeeDetails({ params }: { params: { id: string } }) {
  const employee = await fetchEmployee(params.id)

  if (!employee) {
    return notFound()
  }

  return (
    <div className="container mx-auto py-10">
      <Link href="/employees" className="flex items-center text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Employees
      </Link>

      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Employee Profile</h1>
        <Link href={`/employees/${employee.id}/edit`}>
          <Button>
            <Edit className="mr-2 h-4 w-4" />
            Edit Employee
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Basic details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <InfoItem label="Full Name" value={employee.full_name} />
              <InfoItem icon={<Mail className="h-4 w-4" />} label="Email" value={employee.email || "-"} />
              <InfoItem icon={<Phone className="h-4 w-4" />} label="Phone" value={employee.contact_number || "-"} />
              <InfoItem
                label="Date of Birth"
                value={employee.date_of_birth ? new Date(employee.date_of_birth).toLocaleDateString() : "-"}
              />
              <InfoItem label="Gender" value={employee.gender || "-"} />
              <InfoItem label="Nationality" value={employee.nationality || "-"} />
              <InfoItem label="Marital Status" value={employee.marital_status || "-"} />
              <InfoItem label="Address" value={employee.residential_address || "-"} />
              <InfoItem
                label="Emergency Contact"
                value={
                  employee.emergency_contact_name
                    ? `${employee.emergency_contact_name} (${employee.emergency_contact_relationship}) - ${employee.emergency_contact_number}`
                    : "-"
                }
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center justify-center py-4">
              <div
                className={`inline-flex items-center justify-center rounded-full p-8 ${
                  employee.status === "Active"
                    ? "bg-green-100"
                    : employee.status === "On Leave"
                      ? "bg-yellow-100"
                      : "bg-red-100"
                }`}
              >
                <span
                  className={`text-lg font-semibold ${
                    employee.status === "Active"
                      ? "text-green-800"
                      : employee.status === "On Leave"
                        ? "text-yellow-800"
                        : "text-red-800"
                  }`}
                >
                  {employee.status || "Unknown"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Employment Details</CardTitle>
            <CardDescription>Work-related information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoItem icon={<Building className="h-4 w-4" />} label="Position" value={employee.job_title || "-"} />
              <InfoItem icon={<Building className="h-4 w-4" />} label="Department" value={employee.department || "-"} />
              <InfoItem label="Employee ID" value={employee.employee_id || "-"} />
              <InfoItem label="Employment Type" value={employee.employment_type || "-"} />
              <InfoItem label="Manager" value={employee.reporting_manager || "-"} />
              <InfoItem
                icon={<Calendar className="h-4 w-4" />}
                label="Start Date"
                value={employee.date_of_employment ? new Date(employee.date_of_employment).toLocaleDateString() : "-"}
              />
              <InfoItem label="Job Grade" value={employee.job_grade || "-"} />
              <InfoItem
                label="Probation Period"
                value={employee.probation_period ? `${employee.probation_period} months` : "-"}
              />
              <InfoItem label="Working Hours" value={employee.working_hours || "-"} />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Statutory Information</CardTitle>
            <CardDescription>Legal and compliance details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoItem label="National ID" value={employee.national_id || "-"} />
              <InfoItem label="NSSF Number" value={employee.nssf_number || "-"} />
              <InfoItem label="TIN Number" value={employee.tin_number || "-"} />
              <InfoItem label="Bank Name" value={employee.bank_name || "-"} />
              <InfoItem label="Bank Account" value={employee.bank_account_number || "-"} />
              <InfoItem
                icon={<DollarSign className="h-4 w-4" />}
                label="Salary Structure"
                value={employee.salary_structure || "-"}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="md:col-span-3">
          <CardHeader>
            <CardTitle>Leave & Performance</CardTitle>
            <CardDescription>Leave balances and performance information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <InfoItem
                label="Annual Leave Balance"
                value={employee.annual_leave_balance !== null ? `${employee.annual_leave_balance} days` : "-"}
              />
              <InfoItem
                label="Sick Leave Balance"
                value={employee.sick_leave_balance !== null ? `${employee.sick_leave_balance} days` : "-"}
              />
              <InfoItem
                label="Maternity/Paternity Leave"
                value={
                  employee.maternity_paternity_leave_balance !== null
                    ? `${employee.maternity_paternity_leave_balance} days`
                    : "-"
                }
              />
              <InfoItem
                label="Last Leave Taken"
                value={employee.last_leave_taken ? new Date(employee.last_leave_taken).toLocaleDateString() : "-"}
              />
              <InfoItem
                label="Last Appraisal Date"
                value={employee.last_appraisal_date ? new Date(employee.last_appraisal_date).toLocaleDateString() : "-"}
              />
              <InfoItem label="KPIs" value={employee.kpis || "-"} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center text-sm text-muted-foreground">
        {icon && <span className="mr-1">{icon}</span>}
        {label}
      </div>
      <p className="font-medium">{value}</p>
    </div>
  )
}

