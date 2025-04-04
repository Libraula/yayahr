import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Download, Filter, Search, PlusCircle, BookOpen, ArrowRight, Calendar, Users, Award } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function TrainingPage() {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">Training & Development</h1>
          <p className="text-muted-foreground">Manage employee training programs and skill development</p>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/training/program/new">
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Training
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
            <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <BookOpen className="h-4 w-4 text-blue-500 mr-2" />
              <span className="text-2xl font-bold">5</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Ongoing training programs</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Calendar className="h-4 w-4 text-amber-500 mr-2" />
              <span className="text-2xl font-bold">8</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Scheduled in next 30 days</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Certifications</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <Award className="h-4 w-4 text-green-500 mr-2" />
              <span className="text-2xl font-bold">42</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">Earned this year</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle>Training Programs</CardTitle>
              <CardDescription>Manage and track employee training programs</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input type="search" placeholder="Search programs..." className="pl-8 w-full sm:w-[250px]" />
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
              <TabsTrigger value="all">All Programs</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
              <TabsTrigger value="completed">Completed</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <TrainingProgramsTable />
            </TabsContent>
            <TabsContent value="active">
              <TrainingProgramsTable status="Active" />
            </TabsContent>
            <TabsContent value="upcoming">
              <TrainingProgramsTable status="Upcoming" />
            </TabsContent>
            <TabsContent value="completed">
              <TrainingProgramsTable status="Completed" />
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employee Skills & Certifications</CardTitle>
          <CardDescription>Track employee skills and professional certifications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Employee</TableHead>
                  <TableHead>Department</TableHead>
                  <TableHead>Skills</TableHead>
                  <TableHead>Certifications</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {employeeSkillsData.map((employee) => (
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
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{employee.department}</TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {employee.skills.map((skill, index) => (
                          <Badge key={index} variant="outline" className="bg-muted">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {employee.certifications.map((cert, index) => (
                          <Badge key={index} variant="secondary">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="sm">
                        View Profile
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
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

function TrainingProgramsTable({ status }: { status?: string }) {
  // This would typically fetch from an API or database
  const allPrograms = [
    {
      id: 1,
      title: "Leadership Development",
      type: "Internal",
      startDate: "2023-03-15",
      endDate: "2023-05-15",
      participants: 12,
      trainer: "Emily Chen",
      status: "Active",
    },
    {
      id: 2,
      title: "Project Management Fundamentals",
      type: "External",
      startDate: "2023-04-10",
      endDate: "2023-04-14",
      participants: 8,
      trainer: "PM Institute",
      status: "Active",
    },
    {
      id: 3,
      title: "Software Development Best Practices",
      type: "Internal",
      startDate: "2023-05-01",
      endDate: "2023-05-05",
      participants: 15,
      trainer: "Alex Johnson",
      status: "Upcoming",
    },
    {
      id: 4,
      title: "Customer Service Excellence",
      type: "External",
      startDate: "2023-05-15",
      endDate: "2023-05-16",
      participants: 10,
      trainer: "Service Pro Consultants",
      status: "Upcoming",
    },
    {
      id: 5,
      title: "Financial Management",
      type: "Internal",
      startDate: "2023-02-10",
      endDate: "2023-02-28",
      participants: 6,
      trainer: "David Wilson",
      status: "Completed",
    },
  ]

  const programs = status ? allPrograms.filter((program) => program.status === status) : allPrograms

  return (
    <div className="border rounded-md">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Program Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Duration</TableHead>
            <TableHead>Participants</TableHead>
            <TableHead>Trainer</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {programs.map((program) => (
            <TableRow key={program.id}>
              <TableCell className="font-medium">{program.title}</TableCell>
              <TableCell>{program.type}</TableCell>
              <TableCell>
                <div className="flex flex-col">
                  <span>
                    {new Date(program.startDate).toLocaleDateString()} -{" "}
                    {new Date(program.endDate).toLocaleDateString()}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4 text-muted-foreground" />
                  <span>{program.participants}</span>
                </div>
              </TableCell>
              <TableCell>{program.trainer}</TableCell>
              <TableCell>
                <Badge
                  variant={
                    program.status === "Active" ? "default" : program.status === "Upcoming" ? "outline" : "secondary"
                  }
                >
                  {program.status}
                </Badge>
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

// Sample data for employee skills
const employeeSkillsData = [
  {
    id: 1,
    name: "Alex Johnson",
    department: "Engineering",
    skills: ["JavaScript", "React", "Node.js", "TypeScript"],
    certifications: ["AWS Certified Developer", "Scrum Master"],
  },
  {
    id: 2,
    name: "Sarah Williams",
    department: "Product",
    skills: ["Product Management", "Agile", "User Research", "Roadmapping"],
    certifications: ["Certified Product Manager", "PRINCE2"],
  },
  {
    id: 3,
    name: "Michael Brown",
    department: "Design",
    skills: ["UI/UX", "Figma", "Adobe XD", "User Testing"],
    certifications: ["UX Certification"],
  },
  {
    id: 4,
    name: "Emily Davis",
    department: "Marketing",
    skills: ["Digital Marketing", "SEO", "Content Strategy", "Analytics"],
    certifications: ["Google Analytics", "HubSpot Marketing"],
  },
  {
    id: 5,
    name: "David Wilson",
    department: "Human Resources",
    skills: ["Recruitment", "Employee Relations", "Training", "Compliance"],
    certifications: ["PHR", "SHRM-CP"],
  },
]

