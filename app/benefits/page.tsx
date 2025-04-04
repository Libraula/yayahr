import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Filter, Search, PlusCircle, ArrowRight, DollarSign, Umbrella, Gift } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function BenefitsPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Benefits & Compensation</h1>
          <p className="text-muted-foreground">Manage employee benefits, allowances, and compensation</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/benefits/add">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Benefit
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
            <CardTitle className="text-sm font-medium">Health Insurance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Umbrella className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">24</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Enrolled employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Pension Scheme</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-2xl font-bold">22</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Participating employees</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Other Benefits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Gift className="h-4 w-4 text-purple-500 mr-2" />
              <span className="text-2xl font-bold">8</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active benefit programs</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Benefit Plans</CardTitle>
              <CardDescription>Manage company benefit plans and programs</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search benefits..." className="pl-8 w-full sm:w-[250px]" />
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
              <TabsTrigger value="all">All Benefits</TabsTrigger>
              <TabsTrigger value="health">Health</TabsTrigger>
              <TabsTrigger value="financial">Financial</TabsTrigger>
              <TabsTrigger value="other">Other</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <BenefitPlansTable />
            </TabsContent>
            <TabsContent value="health">
              <BenefitPlansTable category="Health" />
            </TabsContent>
            <TabsContent value="financial">
              <BenefitPlansTable category="Financial" />
            </TabsContent>
            <TabsContent value="other">
              <BenefitPlansTable category="Other" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employee Allowances</CardTitle>
          <CardDescription>Manage employee allowances and additional compensation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Transport</TableHead>
                  <TableHead>Housing</TableHead>
                  <TableHead>Meal</TableHead>
                  <TableHead>Communication</TableHead>
                  <TableHead>Other</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeAllowancesData.map((employee) => (
                  <TableRow key={employee.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={`/placeholder.svg?height=40&width=40&text=${employee.name.charAt(0)}`}
                            alt={employee.name}
                          />
                          <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{employee.name}</p>
                          <p className="text-xs text-muted-foreground">{employee.department}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {employee.allowances.transport ? `UGX ${employee.allowances.transport.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell>
                      {employee.allowances.housing ? `UGX ${employee.allowances.housing.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell>
                      {employee.allowances.meal ? `UGX ${employee.allowances.meal.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell>
                      {employee.allowances.communication
                        ? `UGX ${employee.allowances.communication.toLocaleString()}`
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {employee.allowances.other ? `UGX ${employee.allowances.other.toLocaleString()}` : "-"}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      UGX{" "}
                      {Object.values(employee.allowances)
                        .reduce((a, b) => a + b, 0)
                        .toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function BenefitPlansTable({ category }: { category?: string }) {
  // This would typically fetch from an API or database
  const allBenefits = [
    {
      id: 1,
      name: "Health Insurance - Premium",
      provider: "Jubilee Insurance",
      category: "Health",
      coverage: "Comprehensive medical coverage for employee and dependents",
      eligibility: "All permanent employees",
      cost: "UGX 250,000 per month",
      enrolledCount: 15,
      status: "Active",
    },
    {
      id: 2,
      name: "Health Insurance - Standard",
      provider: "Jubilee Insurance",
      category: "Health",
      coverage: "Basic medical coverage for employee only",
      eligibility: "All employees",
      cost: "UGX 150,000 per month",
      enrolledCount: 9,
      status: "Active",
    },
    {
      id: 3,
      name: "Retirement Pension Scheme",
      provider: "NSSF Plus",
      category: "Financial",
      coverage: "Additional 5% employer contribution above NSSF",
      eligibility: "Employees with 2+ years of service",
      cost: "5% of salary",
      enrolledCount: 18,
      status: "Active",
    },
    {
      id: 4,
      name: "Life Insurance",
      provider: "UAP Insurance",
      category: "Financial",
      coverage: "3x annual salary coverage",
      eligibility: "All permanent employees",
      cost: "UGX 50,000 per month",
      enrolledCount: 22,
      status: "Active",
    },
    {
      id: 5,
      name: "Professional Development Fund",
      provider: "Internal",
      category: "Other",
      coverage: "Up to UGX 2,000,000 per year for courses and certifications",
      eligibility: "Employees with 1+ year of service",
      cost: "Varies",
      enrolledCount: 14,
      status: "Active",
    },
    {
      id: 6,
      name: "Gym Membership",
      provider: "Fitness Center",
      category: "Other",
      coverage: "Monthly gym membership",
      eligibility: "All employees",
      cost: "UGX 100,000 per month",
      enrolledCount: 8,
      status: "Active",
    },
  ]

  const benefits = category ? allBenefits.filter((benefit) => benefit.category === category) : allBenefits

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Benefit Name</TableHead>
            <TableHead>Provider</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Eligibility</TableHead>
            <TableHead>Enrolled</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {benefits.map((benefit) => (
            <TableRow key={benefit.id}>
              <TableCell className="font-medium">{benefit.name}</TableCell>
              <TableCell>{benefit.provider}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    benefit.category === "Health"
                      ? "default"
                      : benefit.category === "Financial"
                        ? "outline"
                        : "secondary"
                  }
                >
                  {benefit.category}
                </Badge>
              </TableCell>
              <TableCell>{benefit.eligibility}</TableCell>
              <TableCell>{benefit.enrolledCount}</TableCell>
              <TableCell>
                <Badge variant={benefit.status === "Active" ? "default" : "outline"}>{benefit.status}</Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  View Details
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

// Sample data for employee allowances
const employeeAllowancesData = [
  {
    id: 1,
    name: "Alex Johnson",
    department: "Engineering",
    allowances: {
      transport: 200000,
      housing: 500000,
      meal: 150000,
      communication: 100000,
      other: 0,
    },
  },
  {
    id: 2,
    name: "Sarah Williams",
    department: "Product",
    allowances: {
      transport: 200000,
      housing: 500000,
      meal: 150000,
      communication: 100000,
      other: 200000,
    },
  },
  {
    id: 3,
    name: "Michael Brown",
    department: "Design",
    allowances: {
      transport: 200000,
      housing: 400000,
      meal: 150000,
      communication: 100000,
      other: 0,
    },
  },
  {
    id: 4,
    name: "Emily Davis",
    department: "Marketing",
    allowances: {
      transport: 200000,
      housing: 400000,
      meal: 150000,
      communication: 100000,
      other: 0,
    },
  },
  {
    id: 5,
    name: "David Wilson",
    department: "Human Resources",
    allowances: {
      transport: 200000,
      housing: 500000,
      meal: 150000,
      communication: 100000,
      other: 150000,
    },
  },
]

