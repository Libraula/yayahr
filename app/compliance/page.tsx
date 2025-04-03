import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileText, Download, Filter, Search, CheckCircle, ArrowRight, FileCheck, FileClock } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"

export default function CompliancePage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Compliance & Reports</h1>
          <p className="text-muted-foreground">Manage statutory compliance and generate reports</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/compliance/report/new">
            <Button>
              <FileText className="mr-2 h-4 w-4" />
              Generate Report
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
            <CardTitle className="text-sm font-medium">Compliance Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-2xl font-bold">96%</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Overall compliance rate</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pending Submissions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileClock className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">3</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Reports due this month</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Completed Reports</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <FileCheck className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">24</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">This year</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Statutory Reports</CardTitle>
              <CardDescription>Track and manage statutory compliance reports</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search reports..." className="pl-8 w-full sm:w-[250px]" />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All Reports</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="submitted">Submitted</TabsTrigger>
              <TabsTrigger value="overdue">Overdue</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <StatutoryReportsTable />
            </TabsContent>
            <TabsContent value="pending">
              <StatutoryReportsTable status="Pending" />
            </TabsContent>
            <TabsContent value="submitted">
              <StatutoryReportsTable status="Submitted" />
            </TabsContent>
            <TabsContent value="overdue">
              <StatutoryReportsTable status="Overdue" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Document Compliance</CardTitle>
          <CardDescription>Employee document compliance status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Employment Contracts</span>
                </div>
                <span className="text-sm">100% (24/24)</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">NSSF Registration</span>
                </div>
                <span className="text-sm">96% (23/24)</span>
              </div>
              <Progress value={96} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Tax Identification Number (TIN)</span>
                </div>
                <span className="text-sm">92% (22/24)</span>
              </div>
              <Progress value={92} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">National ID</span>
                </div>
                <span className="text-sm">100% (24/24)</span>
              </div>
              <Progress value={100} className="h-2" />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">Academic Certificates</span>
                </div>
                <span className="text-sm">88% (21/24)</span>
              </div>
              <Progress value={88} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function StatutoryReportsTable({ status }: { status?: string }) {
  // This would typically fetch from an API or database
  const allReports = [
    {
      id: 1,
      reportName: "NSSF Monthly Remittance",
      authority: "NSSF Uganda",
      dueDate: "2023-04-15",
      submissionDate: "2023-04-10",
      amount: "2,450,000",
      status: "Submitted",
    },
    {
      id: 2,
      reportName: "PAYE Monthly Return",
      authority: "Uganda Revenue Authority",
      dueDate: "2023-04-15",
      submissionDate: "2023-04-12",
      amount: "8,750,000",
      status: "Submitted",
    },
    {
      id: 3,
      reportName: "Local Service Tax",
      authority: "Kampala Capital City Authority",
      dueDate: "2023-04-30",
      submissionDate: "",
      amount: "350,000",
      status: "Pending",
    },
    {
      id: 4,
      reportName: "Annual NSSF Return",
      authority: "NSSF Uganda",
      dueDate: "2023-03-31",
      submissionDate: "",
      amount: "28,500,000",
      status: "Overdue",
    },
    {
      id: 5,
      reportName: "Quarterly VAT Return",
      authority: "Uganda Revenue Authority",
      dueDate: "2023-04-15",
      submissionDate: "",
      amount: "4,250,000",
      status: "Pending",
    },
  ]

  const reports = status ? allReports.filter((report) => report.status === status) : allReports

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Report Name</TableHead>
            <TableHead>Authority</TableHead>
            <TableHead>Due Date</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead>Amount (UGX)</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reports.map((report) => (
            <TableRow key={report.id}>
              <TableCell className="font-medium">{report.reportName}</TableCell>
              <TableCell>{report.authority}</TableCell>
              <TableCell>{new Date(report.dueDate).toLocaleDateString()}</TableCell>
              <TableCell>
                {report.submissionDate ? new Date(report.submissionDate).toLocaleDateString() : "-"}
              </TableCell>
              <TableCell>{report.amount}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    report.status === "Submitted" ? "default" : report.status === "Pending" ? "outline" : "destructive"
                  }
                >
                  {report.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  {report.status === "Pending" && (
                    <Button variant="outline" size="sm">
                      Submit
                    </Button>
                  )}
                  <Button variant="ghost" size="sm">
                    View
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

