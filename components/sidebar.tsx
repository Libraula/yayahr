"use client"

import { useState, useEffect, createContext, useContext } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  Users,
  CreditCard,
  Clock,
  Calendar,
  BarChart,
  UserPlus,
  FileText,
  GraduationCap,
  Heart,
  PieChart,
  Home,
  Menu,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"

// Define the context type
interface SidebarContextType {
  isOpen: boolean
  isCollapsed: boolean
  toggleSidebar: () => void
  toggleCollapse: () => void
}

// Create a context with a default value
const SidebarContext = createContext<SidebarContextType>({
  isOpen: true,
  isCollapsed: false,
  toggleSidebar: () => {},
  toggleCollapse: () => {},
})

// Custom hook to use sidebar context
export const useSidebar = () => useContext(SidebarContext)

export default function Sidebar() {
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  // Check for saved state in localStorage and handle responsive behavior
  useEffect(() => {
    // Check if we're on mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
      if (window.innerWidth >= 1024) {
        setIsOpen(true)
      } else {
        setIsOpen(false)
      }
    }

    // Initial check
    checkMobile()

    // Add resize listener
    window.addEventListener("resize", checkMobile)

    // Get saved collapsed state
    const savedCollapsed = localStorage.getItem("sidebar-collapsed")
    if (savedCollapsed) {
      setIsCollapsed(savedCollapsed === "true")
    }

    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  // Save collapsed state to localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebar-collapsed", String(newState))
    }
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const routes = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Employee Management", path: "/employees", icon: Users },
    { name: "Payroll Management", path: "/payroll", icon: CreditCard },
    {
      name: "Time & Attendance",
      path: "/attendance",
      icon: Clock,
      subRoutes: [{ name: "Clock In/Out", path: "/attendance/clock" }],
    },
    {
      name: "Leave Management",
      path: "/leave",
      icon: Calendar,
      subRoutes: [{ name: "Request Leave", path: "/leave/request" }],
    },
    {
      name: "Performance",
      path: "/performance",
      icon: BarChart,
      subRoutes: [{ name: "New Review", path: "/performance/review/new" }],
    },
    {
      name: "Recruitment",
      path: "/recruitment",
      icon: UserPlus,
      subRoutes: [{ name: "Post New Job", path: "/recruitment/job/new" }],
    },
    {
      name: "Compliance & Reports",
      path: "/compliance",
      icon: FileText,
      subRoutes: [{ name: "Generate Report", path: "/compliance/report/new" }],
    },
    {
      name: "Training & Development",
      path: "/training",
      icon: GraduationCap,
      subRoutes: [{ name: "New Training", path: "/training/program/new" }],
    },
    {
      name: "Benefits & Compensation",
      path: "/benefits",
      icon: Heart,
      subRoutes: [{ name: "Add Benefit", path: "/benefits/add" }],
    },
    {
      name: "Reports & Analytics",
      path: "/analytics",
      icon: PieChart,
      subRoutes: [{ name: "Generate Report", path: "/analytics/reports/new" }],
    },
  ]

  return (
    <SidebarContext.Provider value={{ isOpen, isCollapsed, toggleSidebar, toggleCollapse }}>
      {isMobile && (
        <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 lg:hidden" onClick={toggleSidebar}>
          {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      )}

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-40 bg-background border-r transform transition-all duration-200 ease-in-out lg:static lg:inset-auto lg:flex lg:flex-col",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "lg:w-20" : "lg:w-64",
          "w-64",
        )}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between h-16 border-b px-4">
            <Link href="/" className="flex items-center space-x-2" onClick={() => isMobile && setIsOpen(false)}>
              {/* Replace text with logo image */}
              <img
                src="https://www.yayainnovations.com/static/img/logo/yaya-logo-1.png"
                alt="YAYA Innovations Logo"
                className={cn(
                  "object-contain transition-all duration-200 ease-in-out",
                  isCollapsed ? "h-6" : "h-8" // Adjust height based on collapsed state
                )}
              />
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleCollapse} className="hidden lg:flex">
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {routes.map((route) => {
                const Icon = route.icon
                const isActive = pathname === route.path || pathname.startsWith(`${route.path}/`)

                return (
                  <div key={route.path} className="space-y-1">
                    <Link
                      href={route.path}
                      onClick={() => isMobile && setIsOpen(false)}
                      className={cn(
                        "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-muted-foreground hover:bg-muted hover:text-foreground",
                      )}
                    >
                      <Icon className={cn("h-5 w-5 flex-shrink-0", isCollapsed ? "mx-auto" : "mr-3")} />
                      {(!isCollapsed || isMobile) && <span className="truncate">{route.name}</span>}
                    </Link>

                    {/* Sub-routes */}
                    {(!isCollapsed || isMobile) && route.subRoutes && route.subRoutes.length > 0 && (
                      <div className="pl-10 space-y-1">
                        {route.subRoutes.map((subRoute) => (
                          <Link
                            key={subRoute.path}
                            href={subRoute.path}
                            onClick={() => isMobile && setIsOpen(false)}
                            className={cn(
                              "flex items-center px-3 py-1 text-sm rounded-md transition-colors",
                              pathname === subRoute.path
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-muted-foreground hover:bg-muted hover:text-foreground",
                            )}
                          >
                            <span className="truncate">{subRoute.name}</span>
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
            </nav>
          </div>
          {isMobile && (
            <div className="border-t p-4 flex justify-center">
              <Button variant="outline" size="sm" onClick={toggleCollapse} className="w-full">
                {isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
              </Button>
            </div>
          )}
        </div>
      </div>
    </SidebarContext.Provider>
  )
}

