import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreditCard, Download, FileText, Search, Calendar, DollarSign, ArrowRight } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function PayrollPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Payroll Management</h1>
          <p className="text-muted-foreground">Process and manage employee payroll</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/payroll/process">
            <Button>
              <CreditCard className="mr-2 h-4 w-4" />
              Process Payroll
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Payroll (This Month)</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">UGX 45,678,000</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">For 24 employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Next Payroll Date</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">April 28, 2023</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">15 days remaining</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Statutory Deductions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileText className="h-4 w-4 text-muted-foreground mr-2" />
              <span className="text-2xl font-bold">UGX 12,345,000</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">NSSF, PAYE, Local Service Tax</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Payroll History</CardTitle>
              <CardDescription>View and manage past payroll records</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search payroll..." className="pl-8 w-full sm:w-[250px]" />
              </div>
              <Select defaultValue="2023">
                <SelectTrigger className="w-full sm:w-[120px]">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2023">2023</SelectItem>
                  <SelectItem value="2022">2022</SelectItem>
                  <SelectItem value="2021">2021</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Payrolls</TabsTrigger>
              <TabsTrigger value="processed">Processed</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <PayrollTable />
            </TabsContent>
            <TabsContent value="processed">
              <PayrollTable status="Processed" />
            </TabsContent>
            <TabsContent value="pending">
              <PayrollTable status="Pending" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

function PayrollTable({ status }: { status?: string }) {
  // This would typically fetch from an API or database
  const allPayrolls = [
    {
      id: 1,
      period: "March 2023",
      processDate: "2023-03-28",
      totalAmount: "45,678,000",
      employeeCount: 24,
      status: "Processed",
    },
    {
      id: 2,
      period: "February 2023",
      processDate: "2023-02-28",
      totalAmount: "44,890,000",
      employeeCount: 23,
      status: "Processed",
    },
    {
      id: 3,
      period: "January 2023",
      processDate: "2023-01-28",
      totalAmount: "43,250,000",
      employeeCount: 22,
      status: "Processed",
    },
    {
      id: 4,
      period: "December 2022",
      processDate: "2022-12-28",
      totalAmount: "42,780,000",
      employeeCount: 22,
      status: "Processed",
    },
    {
      id: 5,
      period: "November 2022",
      processDate: "2022-11-28",
      totalAmount: "42,100,000",
      employeeCount: 21,
      status: "Processed",
    },
    {
      id: 6,
      period: "April 2023",
      processDate: "2023-04-28",
      totalAmount: "46,200,000",
      employeeCount: 24,
      status: "Pending",
    },
  ]

  const payrolls = status ? allPayrolls.filter((payroll) => payroll.status === status) : allPayrolls

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Period</TableHead>
            <TableHead>Process Date</TableHead>
            <TableHead>Total Amount</TableHead>
            <TableHead>Employees</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payrolls.map((payroll) => (
            <TableRow key={payroll.id}>
              <TableCell className="font-medium">{payroll.period}</TableCell>
              <TableCell>{new Date(payroll.processDate).toLocaleDateString()}</TableCell>
              <TableCell>UGX {payroll.totalAmount}</TableCell>
              <TableCell>{payroll.employeeCount}</TableCell>
              <TableCell>
                <Badge variant={payroll.status === "Processed" ? "default" : "outline"}>{payroll.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Link href={`/payroll/${payroll.id}`}>
                  <Button variant="ghost" size="sm">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

