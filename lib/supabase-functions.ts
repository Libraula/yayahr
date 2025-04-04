import { supabase } from "./supabase"

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
    const { data: programData, error: programError } = await supabase
      .from("training_programs")
      .insert([
        {
          ...programData,
          participants: participants.length,
        },
      ])
      .select()

    if (programError) throw programError
    if (!programData || programData.length === 0) throw new Error("Failed to create training program")

    const programId = programData[0].id

    // Then create the participants
    const participantsToInsert = participants.map((employeeId) => ({
      training_program_id: programId,
      employee_id: employeeId,
      status: "Enrolled",
    }))

    const { error: participantsError } = await supabase.from("training_participants").insert(participantsToInsert)

    if (participantsError) throw participantsError

    return programData[0]
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

