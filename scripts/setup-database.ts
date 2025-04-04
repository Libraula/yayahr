"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { createClient } from "@supabase/supabase-js"

// Initialize Supabase client
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!
const supabase = createClient(supabaseUrl, supabaseKey)

export default function SetupDatabase() {
  const [isLoading, setIsLoading] = useState(false)
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (log: string) => {
    setLogs((prev) => [...prev, log])
  }

  const setupDatabase = async () => {
    setIsLoading(true)
    setStatus("idle")
    setMessage("")
    setLogs([])

    try {
      addLog("Starting database setup...")

      // Create departments table
      addLog("Creating departments table...")
      const { error: departmentsError } = await supabase.rpc("create_table_if_not_exists", {
        table_name: "departments",
        table_definition: `
          id uuid primary key default uuid_generate_v4(),
          name text not null unique,
          description text,
          created_at timestamp with time zone default now()
        `,
      })

      if (departmentsError) {
        throw new Error(`Error creating departments table: ${departmentsError.message}`)
      }
      addLog("✓ Departments table created successfully")

      // Create job_grades table
      addLog("Creating job_grades table...")
      const { error: jobGradesError } = await supabase.rpc("create_table_if_not_exists", {
        table_name: "job_grades",
        table_definition: `
          id uuid primary key default uuid_generate_v4(),
          grade_name text not null unique,
          min_salary numeric not null,
          max_salary numeric not null,
          leave_entitlements jsonb,
          created_at timestamp with time zone default now()
        `,
      })

      if (jobGradesError) {
        throw new Error(`Error creating job_grades table: ${jobGradesError.message}`)
      }
      addLog("✓ Job grades table created successfully")

      // Create employees table
      addLog("Creating employees table...")
      const { error: employeesError } = await supabase.rpc("create_table_if_not_exists", {
        table_name: "employees",
        table_definition: `
          id uuid primary key default uuid_generate_v4(),
          user_id uuid,
          employee_id text unique,
          national_id text,
          tin_number text,
          nssf_number text,
          
          full_name text,
          date_of_birth date,
          gender text,
          nationality text,
          marital_status text,
          residential_address text,
          contact_number text,
          email text,
          
          department_id uuid references departments(id),
          job_title text,
          job_grade_id uuid references job_grades(id),
          employment_type text,
          employment_status text,
          date_of_employment date,
          probation_period integer,
          reporting_manager_id uuid references employees(id),
          
          annual_leave_balance integer,
          sick_leave_balance integer,
          maternity_paternity_leave_balance integer,
          last_leave_taken date,
          
          last_appraisal_date date,
          kpis text,
          training_certifications text,
          
          exit_date date,
          exit_reason text,
          
          status text,
          created_at timestamp with time zone default now(),
          updated_at timestamp with time zone default now()
        `,
      })

      if (employeesError) {
        throw new Error(`Error creating employees table: ${employeesError.message}`)
      }
      addLog("✓ Employees table created successfully")

      // Create employee_contacts table
      addLog("Creating employee_contacts table...")
      const { error: contactsError } = await supabase.rpc("create_table_if_not_exists", {
        table_name: "employee_contacts",
        table_definition: `
          id uuid primary key default uuid_generate_v4(),
          employee_id uuid references employees(id) not null,
          contact_type text not null,
          full_name text not null,
          relationship text,
          phone_number text not null,
          email text,
          created_at timestamp with time zone default now()
        `,
      })

      if (contactsError) {
        throw new Error(`Error creating employee_contacts table: ${contactsError.message}`)
      }
      addLog("✓ Employee contacts table created successfully")

      // Create payroll_profiles table
      addLog("Creating payroll_profiles table...")
      const { error: payrollProfilesError } = await supabase.rpc("create_table_if_not_exists", {
        table_name: "payroll_profiles",
        table_definition: `
          id uuid primary key default uuid_generate_v4(),
          employee_id uuid references employees(id) not null unique,
          bank_name text,
          account_number text,
          mobile_money_provider text,
          mobile_money_number text,
          payment_method text not null,
          base_salary numeric not null,
          allowances jsonb,
          deductions jsonb,
          effective_date date not null,
          created_at timestamp with time zone default now(),
          updated_at timestamp with time zone default now()
        `,
      })

      if (payrollProfilesError) {
        throw new Error(`Error creating payroll_profiles table: ${payrollProfilesError.message}`)
      }
      addLog("✓ Payroll profiles table created successfully")

      // Create leave_requests table
      addLog("Creating leave_requests table...")
      const { error: leaveRequestsError } = await supabase.rpc("create_table_if_not_exists", {
        table_name: "leave_requests",
        table_definition: `
          id uuid primary key default uuid_generate_v4(),
          employee_id uuid references employees(id) not null,
          leave_type text not null,
          start_date date not null,
          end_date date not null,
          days integer not null,
          reason text,
          status text not null,
          approved_by uuid references employees(id),
          approved_date timestamp with time zone,
          created_at timestamp with time zone default now()
        `,
      })

      if (leaveRequestsError) {
        throw new Error(`Error creating leave_requests table: ${leaveRequestsError.message}`)
      }
      addLog("✓ Leave requests table created successfully")

      // Create attendance_records table
      addLog("Creating attendance_records table...")
      const { error: attendanceError } = await supabase.rpc("create_table_if_not_exists", {
        table_name: "attendance_records",
        table_definition: `
          id uuid primary key default uuid_generate_v4(),
          employee_id uuid references employees(id) not null,
          date date not null,
          clock_in text,
          clock_out text,
          work_hours text,
          status text not null,
          notes text,
          created_at timestamp with time zone default now()
        `,
      })

      if (attendanceError) {
        throw new Error(`Error creating attendance_records table: ${attendanceError.message}`)
      }
      addLog("✓ Attendance records table created successfully")

      // Create performance_reviews table
      addLog("Creating performance_reviews table...")
      const { error: performanceError } = await supabase.rpc("create_table_if_not_exists", {
        table_name: "performance_reviews",
        table_definition: `
          id uuid primary key default uuid_generate_v4(),
          employee_id uuid references employees(id) not null,
          reviewer_id uuid references employees(id) not null,
          review_type text not null,
          review_date date not null,
          performance_rating numeric,
          strengths text,
          areas_for_improvement text,
          goals text,
          comments text,
          status text not null,
          created_at timestamp with time zone default now()
        `,
      })

      if (performanceError) {
        throw new Error(`Error creating performance_reviews table: ${performanceError.message}`)
      }
      addLog("✓ Performance reviews table created successfully")

      // Create job_postings table
      addLog("Creating job_postings table...")
      const { error: jobPostingsError } = await supabase.rpc("create_table_if_not_exists", {
        table_name: "job_postings",
        table_definition: `
          id uuid primary key default uuid_generate_v4(),
          title text not null,
          department_id uuid references departments(id),
          location text not null,
          employment_type text not null,
          experience_level text,
          salary_range text,
          description text not null,
          requirements text,
          responsibilities text,
          benefits text,
          posting_date date,
          closing_date date,
          is_remote boolean default false,
          status text not null,
          applicants integer default 0,
          created_at timestamp with time zone default now()
        `,
      })

      if (jobPostingsError) {
        throw new Error(`Error creating job_postings table: ${jobPostingsError.message}`)
      }
      addLog("✓ Job postings table created successfully")

      // Create job_applicants table
      addLog("Creating job_applicants table...")
      const { error: jobApplicantsError } = await supabase.rpc("create_table_if_not_exists", {
        table_name: "job_applicants",
        table_definition: `
          id uuid primary key default uuid_generate_v4(),
          job_posting_id uuid references job_postings(id) not null,
          name text not null,
          email text not null,
          phone text,
          resume_url text,
          cover_letter text,
          status text not null,
          application_date date not null,
          notes text,
          created_at timestamp with time zone default now()
        `,
      })

      if (jobApplicantsError) {
        throw new Error(`Error creating job_applicants table: ${jobApplicantsError.message}`)
      }
      addLog("✓ Job applicants table created successfully")

      // Create statutory_reports table
      addLog("Creating statutory_reports table...")
      const { error: statutoryReportsError } = await supabase.rpc("create_table_if_not_exists", {
        table_name: "statutory_reports",
        table_definition: `
          id uuid primary key default uuid_generate_v4(),
          report_name text not null,
          authority text not null,
          report_type text not null,
          due_date date not null,
          period_start date,
          period_end date,
          amount numeric,
          submission_date date,
          notes text,
          status text not null,
          created_at timestamp with time zone default now()
        `,
      })

      if (statutoryReportsError) {
        throw new Error(`Error creating statutory_reports table: ${statutoryReportsError.message}`)
      }
      addLog("✓ Statutory reports table created successfully")

      // Create training_programs table
      addLog("Creating training_programs table...")
      const { error: trainingProgramsError } = await supabase.rpc("create_table_if_not_exists", {
        table_name: "training_programs",
        table_definition: `
          id uuid primary key default uuid_generate_v4(),
          title text not null,
          type text not null,
          start_date date not null,
          end_date date not null,
          location text,
          trainer text not null,
          description text,
          objectives text,
          materials text,
          cost numeric,
          department_id uuid references departments(id),
          participants integer default 0,
          status text not null,
          created_at timestamp with time zone default now()
        `,
      })

      if (trainingProgramsError) {
        throw new Error(`Error creating training_programs table: ${trainingProgramsError.message}`)
      }
      addLog("✓ Training programs table created successfully")

      // Create training_participants table
      addLog("Creating training_participants table...")
      const { error: trainingParticipantsError } = await supabase.rpc("create_table_if_not_exists", {
        table_name: "training_participants",
        table_definition: `
          id uuid primary key default uuid_generate_v4(),
          training_program_id uuid references training_programs(id) not null,
          employee_id uuid references employees(id) not null,
          status text not null,
          completion_date date,
          feedback text,
          created_at timestamp with time zone default now(),
          unique(training_program_id, employee_id)
        `,
      })

      if (trainingParticipantsError) {
        throw new Error(`Error creating training_participants table: ${trainingParticipantsError.message}`)
      }
      addLog("✓ Training participants table created successfully")

      // Create benefit_plans table
      addLog("Creating benefit_plans table...")
      const { error: benefitPlansError } = await supabase.rpc("create_table_if_not_exists", {
        table_name: "benefit_plans",
        table_definition: `
          id uuid primary key default uuid_generate_v4(),
          name text not null,
          provider text not null,
          category text not null,
          coverage text,
          eligibility text,
          cost numeric,
          start_date date not null,
          end_date date,
          description text,
          enrolled_count integer default 0,
          status text not null,
          created_at timestamp with time zone default now()
        `,
      })

      if (benefitPlansError) {
        throw new Error(`Error creating benefit_plans table: ${benefitPlansError.message}`)
      }
      addLog("✓ Benefit plans table created successfully")

      // Create employee_benefits table
      addLog("Creating employee_benefits table...")
      const { error: employeeBenefitsError } = await supabase.rpc("create_table_if_not_exists", {
        table_name: "employee_benefits",
        table_definition: `
          id uuid primary key default uuid_generate_v4(),
          benefit_plan_id uuid references benefit_plans(id) not null,
          employee_id uuid references employees(id) not null,
          enrollment_date date not null,
          status text not null,
          created_at timestamp with time zone default now(),
          unique(benefit_plan_id, employee_id)
        `,
      })

      if (employeeBenefitsError) {
        throw new Error(`Error creating employee_benefits table: ${employeeBenefitsError.message}`)
      }
      addLog("✓ Employee benefits table created successfully")

      // Create payroll_records table
      addLog("Creating payroll_records table...")
      const { error: payrollRecordsError } = await supabase.rpc("create_table_if_not_exists", {
        table_name: "payroll_records",
        table_definition: `
          id uuid primary key default uuid_generate_v4(),
          period text not null,
          process_date date not null,
          total_amount numeric not null,
          employee_count integer not null,
          status text not null,
          created_at timestamp with time zone default now()
        `,
      })

      if (payrollRecordsError) {
        throw new Error(`Error creating payroll_records table: ${payrollRecordsError.message}`)
      }
      addLog("✓ Payroll records table created successfully")

      // Create generated_reports table
      addLog("Creating generated_reports table...")
      const { error: generatedReportsError } = await supabase.rpc("create_table_if_not_exists", {
        table_name: "generated_reports",
        table_definition: `
          id uuid primary key default uuid_generate_v4(),
          report_name text not null,
          report_type text not null,
          period text not null,
          start_date date,
          end_date date,
          format text not null,
          include_charts boolean default true,
          generated_by text,
          status text not null,
          created_at timestamp with time zone default now()
        `,
      })

      if (generatedReportsError) {
        throw new Error(`Error creating generated_reports table: ${generatedReportsError.message}`)
      }
      addLog("✓ Generated reports table created successfully")

      // Insert sample departments
      addLog("Inserting sample departments...")
      const departments = [
        { name: "Engineering", description: "Software development and engineering" },
        { name: "Product", description: "Product management and design" },
        { name: "Design", description: "UI/UX design and research" },
        { name: "Marketing", description: "Marketing and communications" },
        { name: "Sales", description: "Sales and business development" },
        { name: "Human Resources", description: "HR and people operations" },
        { name: "Finance", description: "Finance and accounting" },
        { name: "IT", description: "IT support and infrastructure" },
      ]

      const { error: insertDepartmentsError } = await supabase
        .from("departments")
        .upsert(departments, { onConflict: "name" })

      if (insertDepartmentsError) {
        throw new Error(`Error inserting departments: ${insertDepartmentsError.message}`)
      }
      addLog("✓ Sample departments inserted successfully")

      // Insert sample job grades
      addLog("Inserting sample job grades...")
      const jobGrades = [
        {
          grade_name: "Entry Level",
          min_salary: 1000000,
          max_salary: 2000000,
          leave_entitlements: { annual: 21, sick: 10, maternity: 60, paternity: 10 },
        },
        {
          grade_name: "Junior",
          min_salary: 2000000,
          max_salary: 3500000,
          leave_entitlements: { annual: 21, sick: 10, maternity: 60, paternity: 10 },
        },
        {
          grade_name: "Mid-Level",
          min_salary: 3500000,
          max_salary: 5000000,
          leave_entitlements: { annual: 24, sick: 14, maternity: 60, paternity: 14 },
        },
        {
          grade_name: "Senior",
          min_salary: 5000000,
          max_salary: 8000000,
          leave_entitlements: { annual: 28, sick: 14, maternity: 90, paternity: 14 },
        },
        {
          grade_name: "Manager",
          min_salary: 8000000,
          max_salary: 12000000,
          leave_entitlements: { annual: 30, sick: 14, maternity: 90, paternity: 14 },
        },
      ]

      const { error: insertJobGradesError } = await supabase
        .from("job_grades")
        .upsert(jobGrades, { onConflict: "grade_name" })

      if (insertJobGradesError) {
        throw new Error(`Error inserting job grades: ${insertJobGradesError.message}`)
      }
      addLog("✓ Sample job grades inserted successfully")

      // Insert sample employees
      addLog("Inserting sample employees...")
      const { data: departments_data } = await supabase.from("departments").select("id, name")
      const { data: job_grades_data } = await supabase.from("job_grades").select("id, grade_name")

      if (!departments_data || !job_grades_data) {
        throw new Error("Failed to fetch departments or job grades")
      }

      const getDepartmentId = (name: string) => {
        const dept = departments_data.find((d) => d.name === name)
        return dept?.id
      }

      const getJobGradeId = (name: string) => {
        const grade = job_grades_data.find((g) => g.grade_name === name)
        return grade?.id
      }

      const employees = [
        {
          employee_id: "EMP001",
          national_id: "CM12345678",
          tin_number: "TIN12345678",
          nssf_number: "NSSF12345678",
          full_name: "John Doe",
          date_of_birth: "1985-05-15",
          gender: "Male",
          nationality: "Ugandan",
          marital_status: "Married",
          residential_address: "123 Main St, Kampala",
          contact_number: "+256700123456",
          email: "john.doe@example.com",
          department_id: getDepartmentId("Engineering"),
          job_title: "Software Engineer",
          job_grade_id: getJobGradeId("Mid-Level"),
          employment_type: "Full-time",
          employment_status: "active",
          date_of_employment: "2020-01-15",
          probation_period: 3,
          annual_leave_balance: 21,
          sick_leave_balance: 10,
          maternity_paternity_leave_balance: 0,
          status: "Active",
        },
        {
          employee_id: "EMP002",
          national_id: "CM23456789",
          tin_number: "TIN23456789",
          nssf_number: "NSSF23456789",
          full_name: "Jane Smith",
          date_of_birth: "1990-08-22",
          gender: "Female",
          nationality: "Ugandan",
          marital_status: "Single",
          residential_address: "456 Park Ave, Kampala",
          contact_number: "+256700234567",
          email: "jane.smith@example.com",
          department_id: getDepartmentId("Design"),
          job_title: "UI/UX Designer",
          job_grade_id: getJobGradeId("Mid-Level"),
          employment_type: "Full-time",
          employment_status: "active",
          date_of_employment: "2021-03-10",
          probation_period: 3,
          annual_leave_balance: 21,
          sick_leave_balance: 10,
          maternity_paternity_leave_balance: 60,
          status: "Active",
        },
        {
          employee_id: "EMP003",
          national_id: "CM34567890",
          tin_number: "TIN34567890",
          nssf_number: "NSSF34567890",
          full_name: "Robert Johnson",
          date_of_birth: "1988-11-30",
          gender: "Male",
          nationality: "Ugandan",
          marital_status: "Married",
          residential_address: "789 Oak Rd, Kampala",
          contact_number: "+256700345678",
          email: "robert.johnson@example.com",
          department_id: getDepartmentId("Marketing"),
          job_title: "Marketing Manager",
          job_grade_id: getJobGradeId("Manager"),
          employment_type: "Full-time",
          employment_status: "active",
          date_of_employment: "2019-06-05",
          probation_period: 3,
          annual_leave_balance: 28,
          sick_leave_balance: 14,
          maternity_paternity_leave_balance: 0,
          status: "Active",
        },
      ]

      const { error: insertEmployeesError } = await supabase.from("employees").upsert(employees, {
        onConflict: "employee_id",
      })

      if (insertEmployeesError) {
        throw new Error(`Error inserting employees: ${insertEmployeesError.message}`)
      }
      addLog("✓ Sample employees inserted successfully")

      // Insert sample payroll records
      addLog("Inserting sample payroll records...")
      const payrollRecords = [
        {
          period: "March 2023",
          process_date: "2023-03-28",
          total_amount: 45678000,
          employee_count: 24,
          status: "Processed",
        },
        {
          period: "February 2023",
          process_date: "2023-02-28",
          total_amount: 44890000,
          employee_count: 23,
          status: "Processed",
        },
        {
          period: "January 2023",
          process_date: "2023-01-28",
          total_amount: 43250000,
          employee_count: 22,
          status: "Processed",
        },
        {
          period: "April 2023",
          process_date: "2023-04-28",
          total_amount: 46200000,
          employee_count: 24,
          status: "Pending",
        },
      ]

      const { error: insertPayrollRecordsError } = await supabase.from("payroll_records").upsert(payrollRecords)

      if (insertPayrollRecordsError) {
        throw new Error(`Error inserting payroll records: ${insertPayrollRecordsError.message}`)
      }
      addLog("✓ Sample payroll records inserted successfully")

      // Get employee IDs for leave requests
      const { data: employeeData } = await supabase.from("employees").select("id, full_name")
      if (!employeeData) {
        throw new Error("Failed to fetch employees")
      }

      // Insert sample leave requests
      addLog("Inserting sample leave requests...")
      const leaveRequests = [
        {
          employee_id: employeeData[0].id,
          leave_type: "Annual Leave",
          start_date: "2023-04-10",
          end_date: "2023-04-14",
          days: 5,
          reason: "Vacation",
          status: "Approved",
        },
        {
          employee_id: employeeData[1].id,
          leave_type: "Sick Leave",
          start_date: "2023-04-05",
          end_date: "2023-04-06",
          days: 2,
          reason: "Medical appointment",
          status: "Approved",
        },
        {
          employee_id: employeeData[2].id,
          leave_type: "Annual Leave",
          start_date: "2023-04-24",
          end_date: "2023-04-28",
          days: 5,
          reason: "Family event",
          status: "Pending",
        },
      ]

      const { error: insertLeaveRequestsError } = await supabase.from("leave_requests").upsert(leaveRequests)

      if (insertLeaveRequestsError) {
        throw new Error(`Error inserting leave requests: ${insertLeaveRequestsError.message}`)
      }
      addLog("✓ Sample leave requests inserted successfully")

      addLog("Database setup completed successfully!")
      setStatus("success")
      setMessage("Database setup completed successfully!")
    } catch (error: any) {
      console.error("Error setting up database:", error)
      setStatus("error")
      setMessage(error.message)
      addLog(`❌ Error: ${error.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-10">
      <Card className="max-w-4xl mx-auto">
        <CardHeader>
          <CardTitle>Database Setup</CardTitle>
          <CardDescription>
            This utility will set up the necessary database tables and sample data for the HR Management System.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "success" && (
            <Alert className="mb-4 bg-green-50">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Success</AlertTitle>
              <AlertDescription className="text-green-700">{message}</AlertDescription>
            </Alert>
          )}

          {status === "error" && (
            <Alert className="mb-4 bg-red-50" variant="destructive">
              <XCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{message}</AlertDescription>
            </Alert>
          )}

          <div className="mb-4">
            <p className="text-sm text-muted-foreground mb-2">
              This script will create the following tables in your Supabase database:
            </p>
            <ul className="list-disc list-inside text-sm text-muted-foreground space-y-1 ml-4">
              <li>departments</li>
              <li>job_grades</li>
              <li>employees</li>
              <li>employee_contacts</li>
              <li>payroll_profiles</li>
              <li>leave_requests</li>
              <li>attendance_records</li>
              <li>performance_reviews</li>
              <li>job_postings</li>
              <li>job_applicants</li>
              <li>statutory_reports</li>
              <li>training_programs</li>
              <li>training_participants</li>
              <li>benefit_plans</li>
              <li>employee_benefits</li>
              <li>payroll_records</li>
              <li>generated_reports</li>
            </ul>
          </div>

          {logs.length > 0 && (
            <div className="mt-4 border rounded-md p-4 bg-black text-white font-mono text-sm overflow-auto max-h-80">
              {logs.map((log, index) => (
                <div key={index} className="whitespace-pre-wrap">
                  {log}
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button onClick={setupDatabase} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Setting up database...
              </>
            ) : (
              "Set Up Database"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

