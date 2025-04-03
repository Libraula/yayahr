/*
This script is for reference only. You would run this once to set up your Supabase database tables.
You can execute this in a Node.js environment with the Supabase client configured.

To run:
1. Save this as a separate script
2. Install dependencies: npm install @supabase/supabase-js dotenv
3. Create a .env file with your Supabase credentials
4. Run with: npx ts-node setup-database.ts
*/

import { createClient } from "@supabase/supabase-js"
import dotenv from "dotenv"

dotenv.config()

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY! // Use service role key for admin operations

const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function setupDatabase() {
  console.log("Setting up database tables...")

  // Create employees table
  const { error: employeesError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "employees",
    table_definition: `
      id uuid primary key default uuid_generate_v4(),
      full_name text not null,
      date_of_birth date,
      gender text,
      nationality text,
      marital_status text,
      residential_address text,
      contact_number text,
      email text,
      emergency_contact_name text,
      emergency_contact_relationship text,
      emergency_contact_number text,
      
      national_id text,
      passport_number text,
      nssf_number text,
      tin_number text,
      work_permit_number text,
      
      employee_id text,
      job_title text,
      department text,
      employment_type text,
      date_of_employment date,
      probation_period integer,
      reporting_manager text,
      job_grade text,
      
      bank_name text,
      bank_account_number text,
      salary_structure text,
      paye_tax_bracket text,
      overtime_rate text,
      bonuses_commissions text,
      deductions text,
      
      working_hours text,
      annual_leave_balance integer,
      sick_leave_balance integer,
      maternity_paternity_leave_balance integer,
      last_leave_taken date,
      
      kpis text,
      last_appraisal_date date,
      training_certifications text,
      promotions_disciplinary text,
      
      exit_date date,
      exit_reason text,
      exit_notes text,
      final_settlement text,
      
      status text,
      created_at timestamp with time zone default now(),
      updated_at timestamp with time zone default now()
    `,
  })

  if (employeesError) {
    console.error("Error creating employees table:", employeesError)
    return
  }

  // Create departments table
  const { error: departmentsError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "departments",
    table_definition: `
      id uuid primary key default uuid_generate_v4(),
      name text not null,
      description text,
      created_at timestamp with time zone default now()
    `,
  })

  if (departmentsError) {
    console.error("Error creating departments table:", departmentsError)
    return
  }

  // Create leave_requests table
  const { error: leaveRequestsError } = await supabase.rpc("create_table_if_not_exists", {
    table_name: "leave_requests",
    table_definition: `
      id uuid primary key default uuid_generate_v4(),
      employee_id uuid references employees(id),
      leave_type text not null,
      start_date date not null,
      end_date date not null,
      days integer not null,
      reason text,
      status text not null,
      created_at timestamp with time zone default now()
    `,
  })

  if (leaveRequestsError) {
    console.error("Error creating leave_requests table:", leaveRequestsError)
    return
  }

  // Create payroll_records table
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
    console.error("Error creating payroll_records table:", payrollRecordsError)
    return
  }

  // Insert sample departments
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
    console.error("Error inserting departments:", insertDepartmentsError)
    return
  }

  console.log("Database setup complete!")
}

setupDatabase().catch(console.error)

