import { createClient as createSupabaseClient, SupabaseClient } from "@supabase/supabase-js"

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// --- Client-side Supabase Client ---
let supabaseInstance: SupabaseClient;

if (!supabaseUrl) {
  console.error("FATAL ERROR: NEXT_PUBLIC_SUPABASE_URL environment variable is not set.")
  throw new Error("Supabase URL is not configured. Please check your environment variables.");
} else if (!supabaseAnonKey) {
  console.error("FATAL ERROR: NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is not set.")
   throw new Error("Supabase Anon Key is not configured. Please check your environment variables.");
} else {
  // Initialize client only if keys are present
  supabaseInstance = createSupabaseClient(supabaseUrl, supabaseAnonKey)
}

// Export the initialized client instance
export const supabase = supabaseInstance;


// --- Admin Supabase Client (Server-Side Only) ---
// Avoid accessing SUPABASE_SERVICE_ROLE_KEY directly in top-level scope
// to prevent it from being bundled/accessed client-side.
let supabaseAdminInstance: SupabaseClient | null = null;

// Function to safely get the admin client instance (call this only server-side)
export function getSupabaseAdmin(): SupabaseClient {
  if (supabaseAdminInstance) {
    return supabaseAdminInstance;
  }

  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    // This check might be redundant if the client instance check already passed, but good practice.
    throw new Error("Admin Client Error: NEXT_PUBLIC_SUPABASE_URL environment variable is not set.");
  }
  if (!supabaseServiceKey) {
     throw new Error("Admin Client Error: SUPABASE_SERVICE_ROLE_KEY environment variable is not set. This key should only be available on the server.");
  }

  // Initialize admin client only when first requested server-side
  supabaseAdminInstance = createSupabaseClient(supabaseUrl, supabaseServiceKey);
  return supabaseAdminInstance;
}

// Re-export createClient function if it's used directly elsewhere (optional)
// Removed duplicate export that was added previously

// Define types based on the new schema
export type Department = {
  id: string
  name: string
  description?: string
  cost_center_code?: string
  parent_department_id?: string | null
  created_at: string
}

export type JobGrade = {
  id: string
  grade_name: string
  min_salary: number
  max_salary: number
  leave_entitlements?: Record<string, any>
}

export type Employee = {
  id: string
  full_name: string
  date_of_birth?: string
  gender?: string
  nationality?: string
  marital_status?: string
  residential_address?: string
  contact_number?: string
  email?: string
  emergency_contact_name?: string
  emergency_contact_relationship?: string
  emergency_contact_number?: string

  national_id?: string
  passport_number?: string
  nssf_number?: string
  tin_number?: string
  work_permit_number?: string

  employee_id?: string
  job_title?: string
  department?: string
  employment_type?: string
  date_of_employment?: string
  probation_period?: number
  reporting_manager?: string
  job_grade?: string

  bank_name?: string
  bank_account_number?: string
  salary_structure?: string
  paye_tax_bracket?: string
  overtime_rate?: string
  bonuses_commissions?: string
  deductions?: string

  working_hours?: string
  annual_leave_balance?: number
  sick_leave_balance?: number
  maternity_paternity_leave_balance?: number
  last_leave_taken?: string

  kpis?: string
  last_appraisal_date?: string
  training_certifications?: string
  promotions_disciplinary?: string

  exit_date?: string
  exit_reason?: string
  exit_notes?: string
  final_settlement?: string

  status?: string
  created_at: string
  updated_at?: string

  // New schema fields
  user_id?: string | null
  department_id?: string | null
  job_grade_id?: string | null
  employment_status?: string
  reporting_manager_id?: string | null
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
  payment_method: string
  base_salary: number
  allowances: Record<string, any> | null
  deductions: Record<string, any> | null
  effective_date: string
}

export type LeaveRequest = {
  id: string
  employee_id: string
  leave_type: string
  start_date: string
  end_date: string
  days: number
  reason: string
  status: string
  created_at: string
  employee?: Employee
}

// Define the specific structure returned by the fetchEmployees query
type FetchedEmployeeData = {
  id: string;
  employee_id: string | null;
  employment_status: string | null;
  created_at: string;
  department: { name: string } | { name: string }[] | null; // Allow object or array
  job_grade: { grade_name: string } | { grade_name: string }[] | null; // Allow object or array
  contact: { full_name: string; email: string | null; phone_number: string | null }[] | null; // Contact is likely always an array join
};

// Helper functions for database operations
// Updated fetchEmployees to get more details for the directory
export async function fetchEmployees(): Promise<any[]> { // Using any[] for now, define a specific type later if needed
  try {
    const { data, error } = await supabase
      .from("employees")
      .select(`
        id,
        employee_id,
        employment_status,
        created_at,
        department:departments ( name ),
        job_grade:job_grades ( grade_name ),
        contact:employee_contacts ( full_name, email, phone_number )
      `)
      // Filter employee_contacts to get only the 'personal' type, assuming one primary contact per employee
      // Adjust filter as needed if multiple contacts should be fetched or logic is different
      .eq('contact.contact_type', 'personal')
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching employees:", error);
      throw error; // Re-throw error
    }

    // Cast the result to the specific type and process
    return (data as FetchedEmployeeData[]).map((emp) => {
      // Safely access contact info (assuming contact is always an array or null)
      const primaryContact = emp.contact?.[0] || null;

      // Safely access department name
      const departmentName = emp.department
        ? (Array.isArray(emp.department) ? emp.department[0]?.name : emp.department.name)
        : null;

      // Safely access job grade name
      const jobGradeName = emp.job_grade
        ? (Array.isArray(emp.job_grade) ? emp.job_grade[0]?.grade_name : emp.job_grade.grade_name)
        : null;

      return {
        id: emp.id,
        employee_id: emp.employee_id,
        full_name: primaryContact?.full_name || `Employee ${emp.employee_id || emp.id}`,
        email: primaryContact?.email,
        phone_number: primaryContact?.phone_number,
        department: departmentName || 'N/A',
        job_grade: jobGradeName || 'N/A',
        status: emp.employment_status || 'N/A',
        created_at: emp.created_at,
      };
    });

  } catch (error) {
    console.error("Error in fetchEmployees:", error);
    return []; // Return empty array on error
  }
}

// Define the raw structure returned by the Supabase query for fetchEmployee
type FetchedEmployeeRawData = {
  id: string;
  employee_id: string | null;
  employment_status: string | null;
  employment_type: string | null;
  national_id: string | null;
  tin_number: string | null;
  nssf_number: string | null;
  created_at: string;
  updated_at: string | null;
  // Adjust types to reflect that joins might return arrays even with .maybeSingle()
  department: { id: string; name: string }[] | null;
  job_grade: { id: string; grade_name: string }[] | null;
  manager: { id: string }[] | null;
  contacts: { id: string; full_name: string; email: string | null; phone_number: string | null; contact_type: string; relationship: string | null }[] | null;
  payroll: { bank_name: string | null; account_number: string | null; mobile_money_provider: string | null; mobile_money_number: string | null; payment_method: string; base_salary: number; effective_date: string }[] | null;
  permits: { permit_number: string; expiration_date: string; nationality: string }[] | null;
};

// Updated fetchEmployee to select more fields needed for profile/edit pages
export async function fetchEmployee(id: string): Promise<any | null> {
  try {
    const { data: rawData, error } = await supabase
      .from("employees")
      .select(`
        id, employee_id, employment_status, employment_type, national_id, tin_number, nssf_number, created_at, updated_at,
        department:departments ( id, name ),
        job_grade:job_grades ( id, grade_name ),
        manager:reporting_manager_id ( id ),
        contacts:employee_contacts ( * ),
        payroll:payroll_profiles ( * ),
        permits:work_permits ( * )
      `)
      .eq("id", id)
      .maybeSingle();

    if (error) {
      console.error(`Supabase error fetching employee ${id}:`, error);
      throw error;
    }

    if (!rawData) {
      console.warn(`Employee with ID ${id} not found.`);
      return null;
    }

    // Cast the raw data to our defined type
    const data = rawData as FetchedEmployeeRawData;

    // Process data safely
    const contactsArray = Array.isArray(data.contacts) ? data.contacts : [];
    const payrollArray = Array.isArray(data.payroll) ? data.payroll : [];
    const permitsArray = Array.isArray(data.permits) ? data.permits : [];

    // Safely access the first element if the related data is an array
    const department = Array.isArray(data.department) ? data.department[0] : data.department;
    const jobGrade = Array.isArray(data.job_grade) ? data.job_grade[0] : data.job_grade;
    const manager = Array.isArray(data.manager) ? data.manager[0] : data.manager;

    const personalContact = contactsArray.find(c => c.contact_type === 'personal') || contactsArray[0] || null;
    const emergencyContact = contactsArray.find(c => c.contact_type === 'emergency') || null;
    const currentPayroll = payrollArray.sort((a, b) => new Date(b.effective_date).getTime() - new Date(a.effective_date).getTime())[0] || null;
    const currentPermit = permitsArray.sort((a, b) => new Date(b.expiration_date).getTime() - new Date(a.expiration_date).getTime())[0] || null;

    // Construct the final object explicitly, selecting fields needed by profile/edit pages
    const processedData = {
        id: data.id,
        employee_id: data.employee_id,
        employment_status: data.employment_status,
        employment_type: data.employment_type,
        national_id: data.national_id,
        tin_number: data.tin_number,
        nssf_number: data.nssf_number,
        created_at: data.created_at,
        updated_at: data.updated_at,
        department_id: department?.id, // Use processed variable
        department_name: department?.name, // Use processed variable
        job_grade_id: jobGrade?.id, // Use processed variable
        job_grade_name: jobGrade?.grade_name, // Use processed variable
        reporting_manager_id: manager?.id, // Use processed variable
        contacts: contactsArray, // Full contacts array for edit page

        // Flattened primary contact details
        full_name: personalContact?.full_name || `Employee ${data.employee_id || data.id}`,
        email: personalContact?.email,
        phone_number: personalContact?.phone_number,

        // Flattened emergency contact details
        emergency_contact_name: emergencyContact?.full_name,
        emergency_contact_relationship: emergencyContact?.relationship,
        emergency_contact_number: emergencyContact?.phone_number,

        // Flattened payroll details
        bank_name: currentPayroll?.bank_name,
        bank_account_number: currentPayroll?.account_number,
        mobile_money_provider: currentPayroll?.mobile_money_provider,
        mobile_money_number: currentPayroll?.mobile_money_number,
        payment_method: currentPayroll?.payment_method,
        base_salary: currentPayroll?.base_salary,

        // Flattened work permit details
        work_permit_number: currentPermit?.permit_number,
        work_permit_expiry: currentPermit?.expiration_date,
        nationality: currentPermit?.nationality,

        // Add other fields needed by profile/edit pages explicitly if they exist on the fetched tables
        // date_of_birth: personalContact?.date_of_birth, // Example
        // gender: personalContact?.gender, // Example
        // marital_status: personalContact?.marital_status, // Example
        // residential_address: personalContact?.address, // Example
        // job_title: data.job_title, // If job_title exists directly on employees table
        // date_of_employment: data.date_of_employment, // If exists on employees table
        // probation_period: data.probation_period, // If exists on employees table
        // working_hours: data.working_hours, // If exists on employees table
    };

    return processedData;

  } catch (error: any) {
    console.error(`Error in fetchEmployee function for ${id}:`, error.message);
    return null;
  }
}
// Update the fetchDepartments function to match the actual database schema
export async function fetchDepartments(): Promise<Department[]> {
  try {
    const { data, error } = await supabase.from("departments").select("*").order("name", { ascending: true })

    if (error) {
      console.error("Error fetching departments:", error)
      return []
    }

    return data as Department[]
  } catch (error) {
    console.error("Error in fetchDepartments:", error)
    return []
  }
}

export async function fetchLeaveRequests(): Promise<LeaveRequest[]> {
  try {
    const { data, error } = await supabase.from("leave_requests").select("*").order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching leave requests:", error)
      return []
    }

    return data as LeaveRequest[]
  } catch (error) {
    console.error("Error in fetchLeaveRequests:", error)
    return []
  }
}

export async function fetchPayrollRecords(): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from("payroll_records")
      .select("*")
      .order("process_date", { ascending: false })

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
  } catch (error) {
    console.error("Error in fetchPayrollRecords:", error)
    return []
  }
}

// Update the getDashboardStats function to match the actual database schema
export async function getDashboardStats(): Promise<{
  totalEmployees: number
  departments: number
  pendingLeaves: number
  newHires: number
  activeEmployees: number
  probationEmployees: number
}> {
  try {
    // Default values
    let totalEmployees = 0
    let departmentsCount = 0
    let pendingLeaves = 0
    let newHiresCount = 0
    let activeEmployees = 0
    let probationEmployees = 0

    // Check if employees table exists and get count
    try {
      const { count } = await supabase.from("employees").select("*", { count: "exact", head: true })
      totalEmployees = count || 0
    } catch (error) {
      console.error("Error counting employees:", error)
    }

    // Check if departments table exists and get count
    try {
      const { data: departments } = await supabase.from("departments").select("id")
      departmentsCount = departments?.length || 0
    } catch (error) {
      console.error("Error counting departments:", error)
    }

    // Check if leave_requests table exists and count pending leaves
    try {
      const { data: leaveRequests } = await supabase.from("leave_requests").select("id, status")
      if (leaveRequests) {
        pendingLeaves = leaveRequests.filter((req) => req.status === "Pending" || req.status === "pending").length
      }
    } catch (error) {
      console.error("Error counting pending leaves:", error)
    }

    // Get new hires (employees added in the last 30 days)
    try {
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

      const { data: newHires } = await supabase
        .from("employees")
        .select("id")
        .gte("created_at", thirtyDaysAgo.toISOString())

      newHiresCount = newHires?.length || 0
    } catch (error) {
      console.error("Error counting new hires:", error)
    }

    // Get active and probation employees
    try {
      const { data: statusEmployees } = await supabase.from("employees").select("id, employment_status")

      if (statusEmployees) {
        activeEmployees = statusEmployees.filter((emp) => emp.employment_status === "active").length

        probationEmployees = statusEmployees.filter((emp) => emp.employment_status === "probation").length
      }
    } catch (error) {
      console.error("Error counting active/probation employees:", error)
    }

    return {
      totalEmployees,
      departments: departmentsCount,
      pendingLeaves,
      newHires: newHiresCount,
      activeEmployees,
      probationEmployees,
    }
  } catch (error) {
    console.error("Error in getDashboardStats:", error)
    return {
      totalEmployees: 0,
      departments: 0,
      pendingLeaves: 0,
      newHires: 0,
      activeEmployees: 0,
      probationEmployees: 0,
    }
  }
}

// Define a more specific type for the employee data fetched in getRecentActivities
// This type was already added in the previous step, ensuring it's here.
type RecentEmployeeActivity = {
  id: string;
  full_name: string | null;
  employee_id: string | null;
  job_title: string | null;
  departments: { name: string }[] | null; // Adjust type: Supabase might return an array for joins
  employment_type: string | null;
  created_at: string;
};

// Update the getRecentActivities function to match the actual database schema
export async function getRecentActivities(): Promise<any[]> {
  try {
    const activities: any[] = []

    // Try to get recent employees
    try {
      const { data: recentEmployees } = await supabase
        .from("employees")
        .select("id, full_name, employee_id, job_title, departments:department_id(name), employment_type, created_at")
        .order("created_at", { ascending: false })
        .limit(5)

      if (recentEmployees && recentEmployees.length > 0) {
        // Cast the fetched data to the specific type
        (recentEmployees as RecentEmployeeActivity[]).forEach((emp) => {
          // Safely access the first department's name if the array exists and has elements
          const departmentName = (emp.departments && emp.departments.length > 0)
            ? emp.departments[0].name
            : "the company";

          activities.push({
            type: "employee_added",
            title: "New Employee Added",
            description: `${emp.full_name || emp.employee_id || "Employee"} was added as ${emp.job_title || emp.employment_type || "employee"} in ${departmentName}`,
            time: emp.created_at,
            id: `emp_${emp.id}`,
          })
        })
      }
    } catch (error) {
      console.error("Error fetching recent employees:", error)
    }

    // Try to get recent leave requests
    try {
      const { data: recentLeaves } = await supabase
        .from("leave_requests")
        .select("id, employee_id, leave_type, status, created_at")
        .order("created_at", { ascending: false })
        .limit(5)

      if (recentLeaves && recentLeaves.length > 0) {
        for (const leave of recentLeaves) {
          let employeeName = "An employee"

          if (leave.employee_id) {
            // Try to get employee name
            try {
              const { data: empData } = await supabase
                .from("employees")
                .select("full_name, employee_id")
                .eq("id", leave.employee_id)
                .single()

              if (empData) {
                employeeName = empData.full_name || empData.employee_id || "An employee"
              }
            } catch (error) {
              console.error(`Error fetching employee for leave request:`, error)
            }
          }

          activities.push({
            type: "leave_request",
            title: `Leave Request ${leave.status}`,
            description: `${employeeName}'s ${leave.leave_type} leave request was ${leave.status}`,
            time: leave.created_at,
            id: `leave_${leave.id}`,
          })
        }
      }
    } catch (error) {
      console.error("Error fetching recent leave requests:", error)
    }

    // Sort by time, most recent first
    activities.sort((a, b) => new Date(b.time).getTime() - new Date(a.time).getTime())

    return activities.slice(0, 10) // Return top 10 most recent activities
  } catch (error) {
    console.error("Error in getRecentActivities:", error)
    return []
  }
}

// Update the createEmployee function to match the actual database schema
export async function createEmployee(employeeData: any): Promise<any> {
  try {
    // Start a transaction
    const { data: employee, error: employeeError } = await supabase
      .from("employees")
      .insert({
        national_id: employeeData.national_id,
        tin_number: employeeData.tin_number,
        nssf_number: employeeData.nssf_number,
        employee_id: employeeData.employee_id,
        employment_type: employeeData.employment_type,
        employment_status: employeeData.employment_status || "probation",
        department_id: employeeData.department_id || null,
        job_grade_id: employeeData.job_grade_id || null,
        full_name: employeeData.full_name || null,
        job_title: employeeData.job_title || null,
      })
      .select()
      .single()

    if (employeeError) {
      console.error("Error creating employee:", employeeError)
      return null
    }

    return employee
  } catch (error) {
    console.error("Error in createEmployee:", error)
    return null
  }
}

// Update the fetchJobGrades function to match the actual database schema
export async function fetchJobGrades(): Promise<JobGrade[]> {
  try {
    const { data, error } = await supabase.from("job_grades").select("*").order("grade_name", { ascending: true })

    if (error) {
      console.error("Error fetching job grades:", error)
      return []
    }

    return data as JobGrade[]
  } catch (error) {
    console.error("Error in fetchJobGrades:", error)
    return []
  }
}

// Update the updateEmployee function to match the actual database schema
export async function updateEmployee(id: string, updates: any): Promise<Employee | null> {
  try {
    // Extract fields that belong to the employees table
    const employeeFields = {
      full_name: updates.full_name,
      date_of_birth: updates.date_of_birth,
      gender: updates.gender,
      nationality: updates.nationality,
      marital_status: updates.marital_status,
      residential_address: updates.residential_address,
      contact_number: updates.contact_number,
      email: updates.email,

      national_id: updates.national_id,
      tin_number: updates.tin_number,
      nssf_number: updates.nssf_number,
      passport_number: updates.passport_number,
      work_permit_number: updates.work_permit_number,

      employee_id: updates.employee_id,
      job_title: updates.job_title,
      employment_type: updates.employment_type,
      date_of_employment: updates.date_of_employment,
      probation_period: updates.probation_period,

      employment_status: updates.status?.toLowerCase() || updates.employment_status,
    }

    // Update the employee record
    const { data, error } = await supabase.from("employees").update(employeeFields).eq("id", id).select().single()

    if (error) {
      console.error(`Error updating employee ${id}:`, error)
      return null
    }

    return data as Employee
  } catch (error) {
    console.error(`Error in updateEmployee for ${id}:`, error)
    return null
  }
}

export { createSupabaseClient as createClient }

