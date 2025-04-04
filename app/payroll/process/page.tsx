"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Checkbox } from "@/components/ui/checkbox"
import { ArrowLeft, Loader2, DollarSign } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

export default function ProcessPayrollPage() {
  const router = useRouter()
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedEmployees, setSelectedEmployees] = useState<string[]>([])
  const [selectAll, setSelectAll] = useState(false)

  // Sample employee data
  const employees = [
    {
      id: "1",
      name: "John Doe",
      position: "Software Engineer",
      department: "Engineering",
      basicSalary: 3500000,
      allowances: 500000,
      deductions: 800000,
      netSalary: 3200000,
    },
    {
      id: "2",
      name: "Jane Smith",
      position: "UI/UX Designer",
      department: "Design",
      basicSalary: 3200000,
      allowances: 450000,
      deductions: 750000,
      netSalary: 2900000,
    },
    {
      id: "3",
      name: "Robert Johnson",
      position: "Marketing Manager",
      department: "Marketing",
      basicSalary: 4500000,
      allowances: 800000,
      deductions: 1200000,
      netSalary: 4100000,
    },
    {
      id: "4",
      name: "Emily Davis",
      position: "HR Specialist",
      department: "Human Resources",
      basicSalary: 3000000,
      allowances: 400000,
      deductions: 700000,
      netSalary: 2700000,
    },
    {
      id: "5",
      name: "Michael Wilson",
      position: "Finance Analyst",
      department: "Finance",
      basicSalary: 3800000,
      allowances: 600000,
      deductions: 950000,
      netSalary: 3450000,
    },
  ]

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmployees([])
    } else {
      setSelectedEmployees(employees.map((emp) => emp.id))
    }
    setSelectAll(!selectAll)
  }

  const handleSelectEmployee = (id: string) => {
    if (selectedEmployees.includes(id)) {
      setSelectedEmployees(selectedEmployees.filter((empId) => empId !== id))
      setSelectAll(false)
    } else {
      setSelectedEmployees([...selectedEmployees, id])
      if (selectedEmployees.length + 1 === employees.length) {
        setSelectAll(true)
      }
    }
  }

  const calculateTotals = () => {
    let totalBasic = 0
    let totalAllowances = 0
    let totalDeductions = 0
    let totalNet = 0

    employees
      .filter((emp) => selectedEmployees.includes(emp.id))
      .forEach((emp) => {
        totalBasic += emp.basicSalary
        totalAllowances += emp.allowances
        totalDeductions += emp.deductions
        totalNet += emp.netSalary
      })

    return {
      totalBasic,
      totalAllowances,
      totalDeductions,
      totalNet,
    }
  }

  const { totalBasic, totalAllowances, totalDeductions, totalNet } = calculateTotals()

  const handleProcessPayroll = async () => {
    if (selectedEmployees.length === 0) {
      toast({
        title: "No employees selected",
        description: "Please select at least one employee to process payroll.",
        variant: "destructive",
      })
      return
    }

    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000))

      toast({
        title: "Payroll Processed",
        description: `Payroll has been processed successfully for ${selectedEmployees.length} employees.`,
      })

      router.push("/payroll")
    } catch (error) {
      console.error("Error processing payroll:", error)
      toast({
        title: "Error",
        description: "There was an error processing the payroll. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="container mx-auto py-6">
      <Link href="/payroll" className="flex items-center text-primary mb-6">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Payroll Management
      </Link>

      <Card>
        <CardHeader>
          <CardTitle>Process Payroll</CardTitle>
          <CardDescription>Process monthly payroll for employees</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="payroll-period">Payroll Period</Label>
              <Select defaultValue="current">
                <SelectTrigger id="payroll-period">
                  <SelectValue placeholder="Select period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="current">April 2023</SelectItem>
                  <SelectItem value="previous">March 2023</SelectItem>
                  <SelectItem value="custom">Custom Period</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-date">Payment Date</Label>
              <Input id="payment-date" type="date" defaultValue="2023-04-28" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="payment-method">Payment Method</Label>
              <Select defaultValue="bank">
                <SelectTrigger id="payment-method">
                  <SelectValue placeholder="Select method" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="bank">Bank Transfer</SelectItem>
                  <SelectItem value="mobile">Mobile Money</SelectItem>
                  <SelectItem value="cash">Cash</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Checkbox checked={selectAll} onCheckedChange={handleSelectAll} />
                  </TableHead>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead className="text-right">Basic Salary</TableHead>
                  <TableHead className="text-right">Allowances</TableHead>
                  <TableHead className="text-right">Deductions</TableHead>
                  <TableHead className="text-right">Net Salary</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employees.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <Checkbox
                        checked={selectedEmployees.includes(employee.id)}
                        onCheckedChange={() => handleSelectEmployee(employee.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{employee.name}</p>
                        <p className="text-xs text-muted-foreground">{employee.position}</p>
                      </div>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell className="text-right">UGX {employee.basicSalary.toLocaleString()}</TableCell>
                    <TableCell className="text-right">UGX {employee.allowances.toLocaleString()}</TableCell>
                    <TableCell className="text-right">UGX {employee.deductions.toLocaleString()}</TableCell>
                    <TableCell className="text-right">UGX {employee.netSalary.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableRow className="bg-muted/50">
                <TableCell colSpan={3} className="font-medium">
                  Total ({selectedEmployees.length} employees)
                </TableCell>
                <TableCell className="text-right font-medium">UGX {totalBasic.toLocaleString()}</TableCell>
                <TableCell className="text-right font-medium">UGX {totalAllowances.toLocaleString()}</TableCell>
                <TableCell className="text-right font-medium">UGX {totalDeductions.toLocaleString()}</TableCell>
                <TableCell className="text-right font-medium">UGX {totalNet.toLocaleString()}</TableCell>
              </TableRow>
            </Table>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" type="button" onClick={() => router.push("/payroll")}>
            Cancel
          </Button>
          <Button onClick={handleProcessPayroll} disabled={isProcessing || selectedEmployees.length === 0}>
            {isProcessing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <DollarSign className="mr-2 h-4 w-4" />
                Process Payroll
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}

