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
import Image from "next/image"

// Create a context for sidebar state
const SidebarContext = createContext({
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

  // Check for saved state in localStorage on component mount
  useEffect(() => {
    const savedCollapsed = localStorage.getItem("sidebar-collapsed")
    if (savedCollapsed) {
      setIsCollapsed(savedCollapsed === "true")
    }
  }, [])

  // Save collapsed state to localStorage
  const toggleCollapse = () => {
    const newState = !isCollapsed
    setIsCollapsed(newState)
    localStorage.setItem("sidebar-collapsed", String(newState))
  }

  const toggleSidebar = () => {
    setIsOpen(!isOpen)
  }

  const routes = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "Employee Management", path: "/employees", icon: Users },
    { name: "Payroll Management", path: "/payroll", icon: CreditCard },
    { name: "Time & Attendance", path: "/attendance", icon: Clock },
    { name: "Leave Management", path: "/leave", icon: Calendar },
    { name: "Performance", path: "/performance", icon: BarChart },
    { name: "Recruitment", path: "/recruitment", icon: UserPlus },
    { name: "Compliance & Reports", path: "/compliance", icon: FileText },
    { name: "Training & Development", path: "/training", icon: GraduationCap },
    { name: "Benefits & Compensation", path: "/benefits", icon: Heart },
    { name: "Reports & Analytics", path: "/analytics", icon: PieChart },
  ]

  return (
    <SidebarContext.Provider value={{ isOpen, isCollapsed, toggleSidebar, toggleCollapse }}>
      <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50 lg:hidden" onClick={toggleSidebar}>
        {isOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
      </Button>

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
            <Link href="/" className="flex items-center space-x-2" onClick={() => setIsOpen(false)}>
              <Image
                src="https://www.yayainnovations.com/static/img/logo/yaya-logo-1.png"
                alt="Yaya Innovations Logo"
                width={150}
                height={40}
                className={cn("h-10 w-auto transition-all", isCollapsed && "lg:w-10")}
              />
              {!isCollapsed && <span className="font-bold text-lg hidden lg:block">HR System</span>}
            </Link>
            <Button variant="ghost" size="icon" onClick={toggleCollapse} className="hidden lg:flex">
              {isCollapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
            </Button>
          </div>
          <div className="flex-1 overflow-y-auto py-4">
            <nav className="space-y-1 px-2">
              {routes.map((route) => {
                const Icon = route.icon
                return (
                  <Link
                    key={route.path}
                    href={route.path}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                      pathname === route.path
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
                    {!isCollapsed && <span className="truncate">{route.name}</span>}
                  </Link>
                )
              })}
            </nav>
          </div>
          <div className="border-t p-4 flex justify-center">
            <Button variant="outline" size="sm" onClick={toggleCollapse} className="lg:hidden w-full">
              {isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            </Button>
          </div>
        </div>
      </div>
    </SidebarContext.Provider>
  )
}

