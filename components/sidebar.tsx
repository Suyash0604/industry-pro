"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  BarChart3,
  Calendar,
  ChevronLeft,
  ChevronRight,
  Cog,
  Home,
  LayoutDashboard,
  ListTodo,
  PlusSquare,
  Users,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

export default function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)

  const navItems = [
    { name: "Dashboard", href: "/", icon: <LayoutDashboard className="h-5 w-5" /> },
    { name: "Projects", href: "/projects", icon: <Home className="h-5 w-5" /> },
    { name: "Create Project", href: "/projects/create", icon: <PlusSquare className="h-5 w-5" /> },
    { name: "Tasks", href: "/tasks", icon: <ListTodo className="h-5 w-5" /> },
    { name: "Timeline", href: "/timeline", icon: <Calendar className="h-5 w-5" /> },
    { name: "Resources", href: "/resources", icon: <Users className="h-5 w-5" /> },
    { name: "Analytics", href: "/analytics", icon: <BarChart3 className="h-5 w-5" /> },
    { name: "Settings", href: "/settings", icon: <Cog className="h-5 w-5" /> },
  ]

  return (
    <div
      className={cn(
        "bg-darker-blue border-r border-blue transition-all duration-300 relative",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="p-4 flex items-center justify-between">
        {!collapsed && <h1 className="text-xl font-bold gradient-text">AI Scheduler</h1>}
        <Button
          variant="ghost"
          size="icon"
          className="absolute -right-3 top-6 bg-darker-blue border border-blue rounded-full"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
        </Button>
      </div>

      <nav className="mt-6 px-2">
        <ul className="space-y-1">
          {navItems.map((item) => (
            <li key={item.href}>
              <Link href={item.href}>
                <div
                  className={cn(
                    "flex items-center py-2 px-3 rounded-md transition-colors",
                    pathname === item.href
                      ? "bg-primary/20 text-primary"
                      : "text-gray-400 hover:text-white hover:bg-primary/10",
                    collapsed ? "justify-center" : "justify-start",
                  )}
                >
                  {item.icon}
                  {!collapsed && <span className="ml-3">{item.name}</span>}
                </div>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  )
}
