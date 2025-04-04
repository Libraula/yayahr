import { supabase } from "./supabase"

// Type definition for Department
export type Department = {
  id: string;
  name: string;
  cost_center_code: string;
  parent_department_id: string | null;
  created_at: string;
};

// Attendance functions
export async function clockInEmployee(employeeId: string, date: string, time: string, notes?: string) {
  try {
    const { data, error } = await supabase
      .from("attendance_records")
      .insert([
        {
          employee_id: employeeId,
          date,
          clock_in: time,
          notes,
          status: "Present",
        },
      ])
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in clockInEmployee:", error)
    throw error
  }
}

export async function clockOutEmployee(recordId: string, time: string, workHours: string, notes?: string) {
  try {
    const { data, error } = await supabase
      .from("attendance_records")
      .update({
        clock_out: time,
        work_hours: workHours,
        notes,
      })
      .eq("id", recordId)
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in clockOutEmployee:", error)
    throw error
  }
}

// Leave management functions
export async function submitLeaveRequest(leaveData: any) {
  try {
    const { data, error } = await supabase.from("leave_requests").insert([leaveData]).select()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in submitLeaveRequest:", error)
    throw error
  }
}

export async function approveLeaveRequest(requestId: string, approverId: string) {
  try {
    const { data, error } = await supabase
      .from("leave_requests")
      .update({
        status: "Approved",
        approved_by: approverId,
        approved_date: new Date().toISOString(),
      })
      .eq("id", requestId)
      .select()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in approveLeaveRequest:", error)
    throw error
  }
}

// Performance management functions
export async function submitPerformanceReview(reviewData: any) {
  try {
    const { data, error } = await supabase.from("performance_reviews").insert([reviewData]).select()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in submitPerformanceReview:", error)
    throw error
  }
}

// Recruitment functions
export async function postJob(jobData: any) {
  try {
    const { data, error } = await supabase.from("job_postings").insert([jobData]).select()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in postJob:", error)
    throw error
  }
}

// Compliance functions
export async function submitStatutoryReport(reportData: any) {
  try {
    const { data, error } = await supabase.from("statutory_reports").insert([reportData]).select()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in submitStatutoryReport:", error)
    throw error
  }
}

// Training functions
export async function createTrainingProgram(programData: any, participants: string[]) {
  try {
    // First create the training program
    // Rename destructured variable to avoid conflict with function parameter
    const { data: createdProgramResult, error: programError } = await supabase
      .from("training_programs")
      .insert([
        {
          ...programData, // Use the function input parameter here
          participants: participants.length, // Assuming you want to store the count
        },
      ])
      .select()
      .single(); // Use single() if you expect one record back

    if (programError) throw programError
    // Check the renamed variable
    if (!createdProgramResult) throw new Error("Failed to create training program or return value was null")

    // Get ID from the renamed variable
    const programId = createdProgramResult.id

    // Then create the participants
    const participantsToInsert = participants.map((employeeId) => ({
      training_program_id: programId,
      employee_id: employeeId,
      status: "Enrolled",
    }))

    const { error: participantsError } = await supabase.from("training_participants").insert(participantsToInsert)

    if (participantsError) throw participantsError

    // Return the renamed variable
    return createdProgramResult
  } catch (error) {
    console.error("Error in createTrainingProgram:", error)
    throw error
  }
}

// Benefits functions
export async function addBenefitPlan(benefitData: any, employees: string[]) {
  try {
    // First create the benefit plan
    const { data: planData, error: planError } = await supabase
      .from("benefit_plans")
      .insert([
        {
          ...benefitData,
          enrolled_count: employees.length,
        },
      ])
      .select()

    if (planError) throw planError
    if (!planData || planData.length === 0) throw new Error("Failed to create benefit plan")

    const planId = planData[0].id

    // Then enroll employees
    const enrollmentsToInsert = employees.map((employeeId) => ({
      benefit_plan_id: planId,
      employee_id: employeeId,
      enrollment_date: benefitData.start_date,
      status: "Active",
    }))

    const { error: enrollmentError } = await supabase.from("employee_benefits").insert(enrollmentsToInsert)

    if (enrollmentError) throw enrollmentError

    return planData[0]
  } catch (error) {
    console.error("Error in addBenefitPlan:", error)
    throw error
  }
}

// Reports functions
export async function generateReport(reportData: any) {
  try {
    const { data, error } = await supabase.from("generated_reports").insert([reportData]).select()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error in generateReport:", error)
    throw error
  }
}
// Function to fetch departments
export async function fetchDepartments(): Promise<Department[]> {
  try {
    const { data, error } = await supabase
      .from("departments")
      .select("*")
      .order("name", { ascending: true });

    if (error) {
      console.error("Error fetching departments:", error);
      throw error; // Re-throw the error to be caught by the caller
    }

    // Supabase types might infer this correctly, but casting can be safer
    return data as Department[];
  } catch (error) {
    console.error("Error in fetchDepartments:", error);
    // Depending on how you want to handle errors in the UI, you might re-throw
    // or return an empty array. Returning empty array for simplicity here.
    return [];
  }
}

// Function to create the CORE employee record
export async function createEmployeeCore(employeeData: any): Promise<{ id: string } | null> { // Return only the ID needed for linking
  try {
    // Only include fields that exist in the 'employees' table schema
    const employeeCorePayload = {
      // user_id: employeeData.user_id, // Get from auth if needed
      department_id: employeeData.department_id,
      job_grade_id: employeeData.job_grade_id || null, // Add if available in form
      national_id: employeeData.national_id,
      tin_number: employeeData.tin_number,
      nssf_number: employeeData.nssf_number,
      employee_id: employeeData.employee_id, // The unique textual ID like EMP-001
      employment_type: employeeData.employment_type,
      employment_status: employeeData.employment_status || 'probation',
      // reporting_manager_id: employeeData.reporting_manager_id || null, // Add if available
      // DO NOT INCLUDE: full_name, email, contact_number, date_of_birth, gender, job_title etc. here
    };

    // Validate required fields for the core table
    if (!employeeCorePayload.national_id || !employeeCorePayload.tin_number || !employeeCorePayload.nssf_number || !employeeCorePayload.employee_id || !employeeCorePayload.employment_type) {
        throw new Error("Missing required core employee fields (National ID, TIN, NSSF, Employee ID, Employment Type).");
    }

    // Remove null/undefined properties before insert
    Object.keys(employeeCorePayload).forEach(key => (employeeCorePayload as any)[key] === undefined && delete (employeeCorePayload as any)[key]);


    const { data, error } = await supabase
      .from("employees")
      .insert([employeeCorePayload]) // Correct variable name used here
      .select()
      .single(); // Assuming insert returns the created record

    if (error) {
      console.error("Database error creating core employee record:", error);
      // Provide more specific feedback if possible (e.g., unique constraint violation)
      if (error.message.includes("duplicate key value violates unique constraint")) {
         if (error.message.includes("employees_national_id_key")) throw new Error(`Employee with National ID ${employeeCorePayload.national_id} already exists.`);
         if (error.message.includes("employees_tin_number_key")) throw new Error(`Employee with TIN ${employeeCorePayload.tin_number} already exists.`);
         if (error.message.includes("employees_nssf_number_key")) throw new Error(`Employee with NSSF ${employeeCorePayload.nssf_number} already exists.`);
         if (error.message.includes("employees_employee_id_key")) throw new Error(`Employee with Employee ID ${employeeCorePayload.employee_id} already exists.`);
      }
      throw error; // Re-throw original error if not handled specifically
    }

    if (!data) {
        throw new Error("Core employee record created, but no data returned.");
    }

    // Return only the ID of the newly created employee record
    return { id: data.id };

  } catch (error) {
    console.error("Error in createEmployeeCore function:", error);
    throw error; // Re-throw
  }
}

// Function to create employee contact details
export async function createEmployeeContact(contactData: {
    employee_id: string; // Link to the created employee
    contact_type: string; // e.g., 'personal'
    full_name: string;
    phone_number: string;
    email?: string | null;
    // Add relationship etc. if needed
}): Promise<any> {
    try {
        if (!contactData.employee_id || !contactData.full_name || !contactData.phone_number) {
            throw new Error("Missing required fields for employee contact (employee_id, full_name, phone_number).");
        }

        const { data, error } = await supabase
            .from("employee_contacts")
            .insert([
                {
                    employee_id: contactData.employee_id,
                    contact_type: contactData.contact_type || 'personal', // Default type
                    full_name: contactData.full_name,
                    phone_number: contactData.phone_number,
                    email: contactData.email || null,
                }
            ])
            .select()
            .single();

        if (error) {
            console.error("Database error creating employee contact:", error);
            throw error;
        }
        return data;

    } catch(error) {
        console.error("Error in createEmployeeContact function:", error);
        throw error;
    }
}

