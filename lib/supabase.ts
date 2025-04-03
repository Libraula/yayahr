import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Define types based on the new schema
export type Department = {
  id: string
  name: string
  cost_center_code: string
  parent_department_id: string | null
  created_at: string
}

export type JobGrade = {
  id: string
  grade_name: string
  min_salary: number
  max_salary: number
  leave_entitlements: Record<string, any>
}

export type Employee = {
  id: string
  user_id: string | null
  department_id: string | null
  job_grade_id: string | null

  // Personal Info
  national_id: string
  tin_number: string
  nssf_number: string

  // Employment Details
  employee_id: string
  employment_type: string
  employment_status: "probation" | "active" | "suspended" | "terminated" | "retired"
  reporting_manager_id: string | null

  // Audit
  created_at: string
  updated_at: string

  // Joined data
  department?: Department
  job_grade?: JobGrade
  reporting_manager?: Employee
  contacts?: EmployeeContact[]
  payroll_profile?: PayrollProfile
}

export type EmployeeContact = {
  id: string
  employee_id: string
  contact_type: string
  full_name: string
  relationship: string | null
  phone_number: string
  email: string | null
}

export type PayrollProfile = {
  id: string
  employee_id: string
  bank_name: string | null
  account_number: string | null
  mobile_money_provider: string | null
  mobile_money_number: string | null
  payment_method: "mobile_money" | "bank_transfer" | "cash"
  base_salary: number
  allowances: Record<string, any> | null
  deductions: Record<string, any> | null
  effective_date: string
}

export type LeaveBalance = {
  id: string
  employee_id: string
  leave_type: "annual" | "sick" | "maternity" | "paternity" | "compassionate"
  balance: number
  fiscal_year: number
}

export type LeaveRequest = {
  id: string
  employee_id: string
  leave_type: "annual" | "sick" | "maternity" | "paternity" | "compassionate"
  start_date: string
  end_date: string
  days: number
  reason: string
  status: "pending" | "approved" | "rejected"
  created_at: string

  // Joined data
  employee?: Employee
}

export type StatutoryContribution = {
  id: string
  employee_id: string
  nssf_employer_contribution: number
  nssf_employee_contribution: number
  paye_amount: number
  local_service_tax: number | null
  contribution_month: string
  created_at: string
}

export type PerformanceReview = {
  id: string
  employee_id: string
  reviewer_id: string | null
  review_date: string
  kpis: Record<string, any>
  rating: number | null
  promotion_eligibility: boolean | null
  training_recommendations: string[] | null
}

// Helper functions for database operations
export async function fetchEmployees() {
  const { data, error } = await supabase
    .from("employees")
    .select(`
      *,
      department:department_id(id, name, cost_center_code),
      job_grade:job_grade_id(id, grade_name, min_salary, max_salary),
      reporting_manager:reporting_manager_id(id, employee_id)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching employees:", error)
    return []
  }

  return data as Employee[]
}

export async function fetchEmployee(id: string) {
  const { data, error } = await supabase
    .from("employees")
    .select(`
      *,
      department:department_id(id, name, cost_center_code),
      job_grade:job_grade_id(id, grade_name, min_salary, max_salary),
      reporting_manager:reporting_manager_id(id, employee_id),
      contacts:employee_contacts(*)
    `)
    .eq("id", id)
    .single()

  if (error) {
    console.error(`Error fetching employee ${id}:`, error)
    return null
  }

  // Fetch payroll profile
  const { data: payrollData, error: payrollError } = await supabase
    .from("payroll_profiles")
    .select("*")
    .eq("employee_id", id)
    .order("effective_date", { ascending: false })
    .limit(1)
    .single()

  if (!payrollError && payrollData) {
    data.payroll_profile = payrollData
  }

  // Fetch leave balances
  const { data: leaveData, error: leaveError } = await supabase
    .from("leave_balances")
    .select("*")
    .eq("employee_id", id)
    .eq("fiscal_year", new Date().getFullYear())

  if (!leaveError && leaveData) {
    data.leave_balances = leaveData
  }

  return data as Employee
}

export async function createEmployee(employeeData: {
  national_id: string
  tin_number: string
  nssf_number: string
  employee_id: string
  employment_type: string
  department_id?: string
  job_grade_id?: string
  reporting_manager_id?: string
  employment_status?: "probation" | "active" | "suspended" | "terminated" | "retired"
  contacts?: Omit<EmployeeContact, "id" | "employee_id">[]
  payroll_profile?: Omit<PayrollProfile, "id" | "employee_id">
}) {
  // Start a transaction
  const { data: employee, error: employeeError } = await supabase
    .from("employees")
    .insert([
      {
        national_id: employeeData.national_id,
        tin_number: employeeData.tin_number,
        nssf_number: employeeData.nssf_number,
        employee_id: employeeData.employee_id,
        employment_type: employeeData.employment_type,
        department_id: employeeData.department_id || null,
        job_grade_id: employeeData.job_grade_id || null,
        reporting_manager_id: employeeData.reporting_manager_id || null,
        employment_status: employeeData.employment_status || "probation",
      },
    ])
    .select()
    .single()

  if (employeeError) {
    console.error("Error creating employee:", employeeError)
    return null
  }

  // Add contacts if provided
  if (employeeData.contacts && employeeData.contacts.length > 0) {
    const contactsToInsert = employeeData.contacts.map((contact) => ({
      employee_id: employee.id,
      contact_type: contact.contact_type,
      full_name: contact.full_name,
      relationship: contact.relationship,
      phone_number: contact.phone_number,
      email: contact.email,
    }))

    const { error: contactsError } = await supabase.from("employee_contacts").insert(contactsToInsert)

    if (contactsError) {
      console.error("Error adding employee contacts:", contactsError)
    }
  }

  // Add payroll profile if provided
  if (employeeData.payroll_profile) {
    const { error: payrollError } = await supabase.from("payroll_profiles").insert([
      {
        employee_id: employee.id,
        bank_name: employeeData.payroll_profile.bank_name,
        account_number: employeeData.payroll_profile.account_number,
        mobile_money_provider: employeeData.payroll_profile.mobile_money_provider,
        mobile_money_number: employeeData.payroll_profile.mobile_money_number,
        payment_method: employeeData.payroll_profile.payment_method,
        base_salary: employeeData.payroll_profile.base_salary,
        allowances: employeeData.payroll_profile.allowances,
        deductions: employeeData.payroll_profile.deductions,
        effective_date: employeeData.payroll_profile.effective_date,
      },
    ])

    if (payrollError) {
      console.error("Error adding payroll profile:", payrollError)
    }
  }

  // Initialize leave balances for the current year
  const currentYear = new Date().getFullYear()
  const leaveTypes: ("annual" | "sick" | "maternity" | "paternity" | "compassionate")[] = ["annual", "sick"]

  const leaveBalancesToInsert = leaveTypes.map((leaveType) => ({
    employee_id: employee.id,
    leave_type: leaveType,
    balance: leaveType === "annual" ? 30 : 10, // Default values
    fiscal_year: currentYear,
  }))

  const { error: leaveError } = await supabase.from("leave_balances").insert(leaveBalancesToInsert)

  if (leaveError) {
    console.error("Error initializing leave balances:", leaveError)
  }

  return employee
}

export async function updateEmployee(id: string, updates: Partial<Employee>) {
  const { data, error } = await supabase
    .from("employees")
    .update({
      department_id: updates.department_id,
      job_grade_id: updates.job_grade_id,
      reporting_manager_id: updates.reporting_manager_id,
      employment_type: updates.employment_type,
      employment_status: updates.employment_status,
      // Don't update critical fields like national_id, tin_number, etc.
    })
    .eq("id", id)
    .select()

  if (error) {
    console.error(`Error updating employee ${id}:`, error)
    return null
  }

  return data[0] as Employee
}

export async function deleteEmployee(id: string) {
  const { error } = await supabase.from("employees").delete().eq("id", id)

  if (error) {
    console.error(`Error deleting employee ${id}:`, error)
    return false
  }

  return true
}

export async function fetchDepartments() {
  const { data, error } = await supabase.from("departments").select("*").order("name", { ascending: true })

  if (error) {
    console.error("Error fetching departments:", error)
    return []
  }

  return data as Department[]
}

export async function fetchJobGrades() {
  const { data, error } = await supabase.from("job_grades").select("*").order("grade_name", { ascending: true })

  if (error) {
    console.error("Error fetching job grades:", error)
    return []
  }

  return data as JobGrade[]
}

export async function fetchLeaveRequests() {
  const { data, error } = await supabase
    .from("leave_requests")
    .select(`
      *,
      employee:employee_id(id, employee_id, national_id)
    `)
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching leave requests:", error)
    return []
  }

  return data as LeaveRequest[]
}

export async function createLeaveRequest(leaveData: {
  employee_id: string
  leave_type: "annual" | "sick" | "maternity" | "paternity" | "compassionate"
  start_date: string
  end_date: string
  days: number
  reason: string
}) {
  const { data, error } = await supabase
    .from("leave_requests")
    .insert([
      {
        employee_id: leaveData.employee_id,
        leave_type: leaveData.leave_type,
        start_date: leaveData.start_date,
        end_date: leaveData.end_date,
        days: leaveData.days,
        reason: leaveData.reason,
        status: "pending",
      },
    ])
    .select()

  if (error) {
    console.error("Error creating leave request:", error)
    return null
  }

  return data[0] as LeaveRequest
}

export async function fetchStatutoryContributions(employeeId: string) {
  const { data, error } = await supabase
    .from("statutory_contributions")
    .select("*")
    .eq("employee_id", employeeId)
    .order("contribution_month", { ascending: false })

  if (error) {
    console.error(`Error fetching statutory contributions for employee ${employeeId}:`, error)
    return []
  }

  return data as StatutoryContribution[]
}

// Update the getDashboardStats function to handle the new schema and potential missing tables

// Function to get dashboard stats
export async function getDashboardStats() {
  // First check if the employees table exists and has the expected structure
  const { data: employeesCheck, error: employeesCheckError } = await supabase.from("employees").select("id").limit(1)

  if (employeesCheckError) {
    console.error("Error checking employees table:", employeesCheckError)
    // Return default values if the table doesn't exist yet
    return {
      totalEmployees: 0,
      departments: 0,
      pendingLeaves: 0,
      newHires: 0,
      activeEmployees: 0,
      probationEmployees: 0,
    }
  }

  // Fetch employees with employment status if the field exists
  const { data: employees, error: employeesError } = await supabase.from("employees").select("id, employment_status")

  // Check if departments table exists
  const { data: departments, error: departmentsError } = await supabase.from("departments").select("id").limit(10)

  // Check if leave_requests table exists
  const { data: leaveRequests, error: leaveRequestsError } = await supabase
    .from("leave_requests")
    .select("id, status")
    .eq("status", "pending")
    .limit(10)

  // Get new hires (employees added in the last 30 days)
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

  const { data: newHires, error: newHiresError } = await supabase
    .from("employees")
    .select("id")
    .gte("created_at", thirtyDaysAgo.toISOString())
    .limit(10)

  // Return stats, handling potential missing data
  return {
    totalEmployees: employees?.length || 0,
    departments: departments?.length || 0,
    pendingLeaves: leaveRequestsError ? 0 : leaveRequests?.length || 0,
    newHires: newHiresError ? 0 : newHires?.length || 0,
    activeEmployees: employees?.filter((e) => e.employment_status === "active").length || 0,
    probationEmployees: employees?.filter((e) => e.employment_status === "probation").length || 0,
  }
}

// Update the getRecentActivities function to handle missing tables and fields

// Function to get recent activities
export async function getRecentActivities() {
  const activities = []

  try {
    // Check if employees table exists before querying
    const { data: employeesCheck, error: employeesCheckError } = await supabase.from("employees").select("id").limit(1)

    if (!employeesCheckError) {
      // Get recent employees added
      const { data: recentEmployees, error: employeesError } = await supabase
        .from("employees")
        .select("id, employee_id, employment_type, department_id, created_at")
        .order("created_at", { ascending: false })
        .limit(5)

      if (!employeesError && recentEmployees) {
        // For each employee, try to get their department name
        for (const emp of recentEmployees) {
          let departmentName = "Unknown Department"

          if (emp.department_id) {
            const { data: deptData } = await supabase
              .from("departments")
              .select("name")
              .eq("id", emp.department_id)
              .single()

            if (deptData) {
              departmentName = deptData.name
            }
          }

          activities.push({
            type: "employee_added",
            title: "New Employee Added",
            description: `${emp.employee_id} was added as ${emp.employment_type} in ${departmentName}`,
            time: emp.created_at,
            id: `emp_${emp.id}`,
          })
        }
      }
    }

    // Check if leave_requests table exists before querying
    const { data: leaveCheck, error: leaveCheckError } = await supabase.from("leave_requests").select("id").limit(1)

    if (!leaveCheckError) {
      // Get recent leave requests
      const { data: recentLeaves, error: leavesError } = await supabase
        .from("leave_requests")
        .select(`
          id, 
          status, 
          created_at,
          leave_type,
          employee_id
        `)
        .order("created_at", { ascending: false })
        .limit(5)

      if (!leavesError && recentLeaves) {
        for (const leave of recentLeaves) {
          let employeeId = "Unknown"

          if (leave.employee_id) {
            const { data: empData } = await supabase
              .from("employees")
              .select("employee_id")
              .eq("id", leave.employee_id)
              .single()

            if (empData) {
              employeeId = empData.employee_id
            }
          }

          activities.push({
            type: "leave_request",
            title: `Leave Request ${leave.status}`,
            description: `${employeeId}'s ${leave.leave_type} leave request was ${leave.status}`,
            time: leave.created_at,
            id: `leave_${leave.id}`,
          })
        }
      }
    }

    // Check if performance_reviews table exists before querying
    const { data: reviewsCheck, error: reviewsCheckError } = await supabase
      .from("performance_reviews")
      .select("id")
      .limit(1)

    if (!reviewsCheckError) {
      // Get recent performance reviews
      const { data: recentReviews, error: reviewsError } = await supabase
        .from("performance_reviews")
        .select(`
          id,
          review_date,
          rating,
          employee_id
        `)
        .order("review_date", { ascending: false })
        .limit(5)

      if (!reviewsError && recentReviews) {
        for (const review of recentReviews) {
          let employeeId = "Unknown"

          if (review.employee_id) {
            const { data: empData } = await supabase
              .from("employees")
              .select("employee_id")
              .eq("id", review.employee_id)
              .single()

            if (empData) {
              employeeId = empData.employee_id
            }
          }

          activities.push({
            type: "performance_review",
            title: "Performance Review Completed",
            description: `${employeeId} received a rating of ${review.rating}/5`,
            time: review.review_date,
            id: `review_${review.id}`,
          })
        }
      }
    }

    // Sort by time, most recent first
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    return activities.slice(0, 10) // Return top 10 most recent activities
  } catch (error) {
    console.error("Error in getRecentActivities:", error)
    return [] // Return empty array on error
  }
}

export async function fetchPayrollRecords() {
  const { data, error } = await supabase.from("payroll_records").select("*").order("process_date", { ascending: false })

  if (error) {
    console.error("Error fetching payroll records:", error)
    return []
  }

  return data as {
    id: string
    period: string
    process_date: string
    total_amount: number
    employee_count: number
    status: string
    created_at: string
  }[]
}

