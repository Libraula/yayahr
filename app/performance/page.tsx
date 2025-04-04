import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Filter, Search, PlusCircle, Star, ArrowRight, Target, Award } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"

export default function PerformancePage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Performance Management</h1>
          <p className="text-muted-foreground">Track and manage employee performance</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/performance/review/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Review
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
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Target className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">8</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Reviews to be completed</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Average Rating</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Star className="h-4 w-4 text-yellow-500 mr-2" />
              <span className="text-2xl font-bold">4.2</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Out of 5.0</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Top Performers</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-2xl font-bold">5</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Employees with 4.5+ rating</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Performance Reviews</CardTitle>
              <CardDescription>Recent and upcoming employee reviews</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search reviews..." className="pl-8 w-full sm:w-[250px]" />
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
              <TabsTrigger value="all">All Reviews</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <PerformanceReviewTable />
            </TabsContent>
            <TabsContent value="pending">
              <PerformanceReviewTable status="Pending" />
            </TabsContent>
            <TabsContent value="completed">
              <PerformanceReviewTable status="Completed" />
            </TabsContent>
            <TabsContent value="upcoming">
              <PerformanceReviewTable status="Upcoming" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>KPI Tracking</CardTitle>
          <CardDescription>Employee key performance indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>KPI</TableHead>
                  <TableHead>Target</TableHead>
                  <TableHead>Current</TableHead>
                  <TableHead>Progress</TableHead>
                  <TableHead className="text-right">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {kpiData.map((kpi) => (
                  <TableRow key={`${kpi.employee}-${kpi.kpiName}`}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={`/placeholder.svg?height=40&width=40&text=${kpi.employee.charAt(0)}`}
                            alt={kpi.employee}
                          />
                          <AvatarFallback>{kpi.employee.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{kpi.employee}</p>
                          <p className="text-xs text-muted-foreground">{kpi.department}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{kpi.kpiName}</TableCell>
                    <TableCell>{kpi.target}</TableCell>
                    <TableCell>{kpi.current}</TableCell>
                    <TableCell>
                      <div className="w-full">
                        <Progress value={kpi.progressPercentage} className="h-2" />
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge
                        variant={
                          kpi.progressPercentage >= 100
                            ? "default"
                            : kpi.progressPercentage >= 75
                              ? "outline"
                              : kpi.progressPercentage >= 50
                                ? "secondary"
                                : "destructive"
                        }
                      >
                        {kpi.progressPercentage >= 100
                          ? "Achieved"
                          : kpi.progressPercentage >= 75
                            ? "On Track"
                            : kpi.progressPercentage >= 50
                              ? "Needs Improvement"
                              : "At Risk"}
                      </Badge>
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

function PerformanceReviewTable({ status }: { status?: string }) {
  // This would typically fetch from an API or database
  const allReviews = [
    {
      id: 1,
      employee: "Alex Johnson",
      department: "Engineering",
      reviewType: "Annual Review",
      reviewDate: "2023-03-15",
      reviewer: "Emily Chen",
      rating: 4.5,
      status: "Completed",
    },
    {
      id: 2,
      employee: "Sarah Williams",
      department: "Product",
      reviewType: "Quarterly Review",
      reviewDate: "2023-04-10",
      reviewer: "James Wilson",
      rating: 4.2,
      status: "Pending",
    },
    {
      id: 3,
      employee: "Michael Brown",
      department: "Design",
      reviewType: "Annual Review",
      reviewDate: "2023-04-25",
      reviewer: "Emily Chen",
      rating: 0,
      status: "Upcoming",
    },
    {
      id: 4,
      employee: "Emily Davis",
      department: "Marketing",
      reviewType: "Quarterly Review",
      reviewDate: "2023-03-20",
      reviewer: "David Wilson",
      rating: 3.8,
      status: "Completed",
    },
    {
      id: 5,
      employee: "David Wilson",
      department: "Human Resources",
      reviewType: "Annual Review",
      reviewDate: "2023-04-15",
      reviewer: "James Wilson",
      rating: 0,
      status: "Pending",
    },
  ]

  const reviews = status ? allReviews.filter((review) => review.status === status) : allReviews

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Employee</TableHead>
            <TableHead>Review Type</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Reviewer</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={`/placeholder.svg?height=40&width=40&text=${review.employee.charAt(0)}`}
                      alt={review.employee}
                    />
                    <AvatarFallback>{review.employee.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{review.employee}</p>
                    <p className="text-xs text-muted-foreground">{review.department}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{review.reviewType}</TableCell>
              <TableCell>{new Date(review.reviewDate).toLocaleDateString()}</TableCell>
              <TableCell>{review.reviewer}</TableCell>
              <TableCell>
                {review.rating > 0 ? (
                  <div className="flex items-center">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                    <span className="ml-1">{review.rating.toFixed(1)}</span>
                  </div>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )}
              </TableCell>
              <TableCell>
                <Badge
                  variant={
                    review.status === "Completed" ? "default" : review.status === "Pending" ? "outline" : "secondary"
                  }
                >
                  {review.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <Button variant="ghost" size="sm">
                  View
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

// Sample data for KPI tracking
const kpiData = [
  {
    employee: "Alex Johnson",
    department: "Engineering",
    kpiName: "Code Quality Score",
    target: "90%",
    current: "85%",
    progressPercentage: 94,
  },
  {
    employee: "Sarah Williams",
    department: "Product",
    kpiName: "Product Delivery",
    target: "10 features",
    current: "8 features",
    progressPercentage: 80,
  },
  {
    employee: "Michael Brown",
    department: "Design",
    kpiName: "Design Projects",
    target: "15 projects",
    current: "12 projects",
    progressPercentage: 80,
  },
  {
    employee: "Emily Davis",
    department: "Marketing",
    kpiName: "Lead Generation",
    target: "500 leads",
    current: "350 leads",
    progressPercentage: 70,
  },
  {
    employee: "David Wilson",
    department: "Human Resources",
    kpiName: "Recruitment Time",
    target: "15 days",
    current: "18 days",
    progressPercentage: 83,
  },
]

