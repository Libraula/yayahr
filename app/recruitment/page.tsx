import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UserPlus, Download, Filter, Search, Users, ArrowRight, Briefcase, CheckCircle } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function RecruitmentPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Recruitment</h1>
          <p className="text-muted-foreground">Manage job postings and applicants</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/recruitment/job/new">
            <Button>
              <Briefcase className="mr-2 h-4 w-4" />
              Post New Job
            </Button>
          </Link>
          <Button variant="outline">
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Open Positions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Briefcase className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">8</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Active job postings</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Applicants</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Users className="h-4 w-4 text-purple-500 mr-2" />
              <span className="text-2xl font-bold">156</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Across all positions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Interviews Scheduled</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-2xl font-bold">12</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">This week</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Offers Extended</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <UserPlus className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">3</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Pending acceptance</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Job Postings</CardTitle>
              <CardDescription>Manage your active and closed job postings</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search jobs..." className="pl-8 w-full sm:w-[250px]" />
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
              <TabsTrigger value="all">All Jobs</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="closed">Closed</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <JobPostingsTable />
            </TabsContent>
            <TabsContent value="active">
              <JobPostingsTable status="Active" />
            </TabsContent>
            <TabsContent value="closed">
              <JobPostingsTable status="Closed" />
            </TabsContent>
            <TabsContent value="draft">
              <JobPostingsTable status="Draft" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recent Applicants</CardTitle>
          <CardDescription>Latest applications received</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Applied On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {applicantsData.map((applicant) => (
                  <TableRow key={applicant.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarImage
                            src={`/placeholder.svg?height=40&width=40&text=${applicant.name.charAt(0)}`}
                            alt={applicant.name}
                          />
                          <AvatarFallback>{applicant.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{applicant.name}</p>
                          <p className="text-xs text-muted-foreground">{applicant.email}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{applicant.position}</TableCell>
                    <TableCell>{new Date(applicant.appliedDate).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          applicant.status === "Shortlisted"
                            ? "default"
                            : applicant.status === "Interview"
                              ? "outline"
                              : applicant.status === "Offer"
                                ? "secondary"
                                : applicant.status === "Rejected"
                                  ? "destructive"
                                  : "default"
                        }
                      >
                        {applicant.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
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
        </CardContent>
      </Card>
    </div>
  )
}

function JobPostingsTable({ status }: { status?: string }) {
  // This would typically fetch from an API or database
  const allJobs = [
    {
      id: 1,
      title: "Software Engineer",
      department: "Engineering",
      location: "Kampala, Uganda",
      postedDate: "2023-03-15",
      closingDate: "2023-04-15",
      applicants: 45,
      status: "Active",
    },
    {
      id: 2,
      title: "Product Manager",
      department: "Product",
      location: "Kampala, Uganda",
      postedDate: "2023-03-10",
      closingDate: "2023-04-10",
      applicants: 28,
      status: "Active",
    },
    {
      id: 3,
      title: "UX Designer",
      department: "Design",
      location: "Remote",
      postedDate: "2023-03-05",
      closingDate: "2023-04-05",
      applicants: 36,
      status: "Active",
    },
    {
      id: 4,
      title: "Marketing Specialist",
      department: "Marketing",
      location: "Kampala, Uganda",
      postedDate: "2023-02-20",
      closingDate: "2023-03-20",
      applicants: 22,
      status: "Closed",
    },
    {
      id: 5,
      title: "HR Coordinator",
      department: "Human Resources",
      location: "Kampala, Uganda",
      postedDate: "2023-02-15",
      closingDate: "2023-03-15",
      applicants: 18,
      status: "Closed",
    },
    {
      id: 6,
      title: "Finance Manager",
      department: "Finance",
      location: "Kampala, Uganda",
      postedDate: "",
      closingDate: "",
      applicants: 0,
      status: "Draft",
    },
  ]

  const jobs = status ? allJobs.filter((job) => job.status === status) : allJobs

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Position</TableHead>
            <TableHead>Department</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Posted Date</TableHead>
            <TableHead>Closing Date</TableHead>
            <TableHead>Applicants</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {jobs.map((job) => (
            <TableRow key={job.id}>
              <TableCell className="font-medium">{job.title}</TableCell>
              <TableCell>{job.department}</TableCell>
              <TableCell>{job.location}</TableCell>
              <TableCell>{job.postedDate ? new Date(job.postedDate).toLocaleDateString() : "-"}</TableCell>
              <TableCell>{job.closingDate ? new Date(job.closingDate).toLocaleDateString() : "-"}</TableCell>
              <TableCell>{job.applicants}</TableCell>
              <TableCell>
                <Badge
                  variant={job.status === "Active" ? "default" : job.status === "Closed" ? "secondary" : "outline"}
                >
                  {job.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
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

// Sample data for applicants
const applicantsData = [
  {
    id: 1,
    name: "John Smith",
    email: "john.smith@example.com",
    position: "Software Engineer",
    appliedDate: "2023-04-01",
    status: "Shortlisted",
  },
  {
    id: 2,
    name: "Mary Johnson",
    email: "mary.johnson@example.com",
    position: "Product Manager",
    appliedDate: "2023-04-02",
    status: "Interview",
  },
  {
    id: 3,
    name: "Robert Davis",
    email: "robert.davis@example.com",
    position: "UX Designer",
    appliedDate: "2023-04-03",
    status: "New",
  },
  {
    id: 4,
    name: "Patricia Miller",
    email: "patricia.miller@example.com",
    position: "Software Engineer",
    appliedDate: "2023-03-28",
    status: "Offer",
  },
  {
    id: 5,
    name: "Michael Wilson",
    email: "michael.wilson@example.com",
    position: "Marketing Specialist",
    appliedDate: "2023-03-15",
    status: "Rejected",
  },
]

