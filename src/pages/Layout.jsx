

import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Home, 
  Upload, 
  BarChart3, 
  BookOpen, 
  User,
  GraduationCap,
  Lightbulb,
  LogOut,
  Settings,
  Briefcase // Added icon for tutors
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User as UserEntity } from "@/api/entities";
import { Assignment } from "@/api/entities";

const navigationItems = [
  {
    title: "Dashboard",
    url: createPageUrl("Dashboard"),
    icon: Home,
  },
  {
    title: "Upload Assignment",
    url: createPageUrl("Upload"),
    icon: Upload,
  },
  {
    title: "Practice Questions",
    url: createPageUrl("Practice"),
    icon: Lightbulb,
  },
  {
    title: "Progress",
    url: createPageUrl("Progress"),
    icon: BarChart3,
  },
  {
    title: "Children",
    url: createPageUrl("Children"),
    icon: User,
  },
  {
    title: "Find a Tutor",
    url: createPageUrl("FindTutor"),
    icon: Briefcase,
  },
];

export default function Layout({ children, currentPageName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [weeklyAssignmentCount, setWeeklyAssignmentCount] = useState(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await UserEntity.me();
        setUser(currentUser);

        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
        
        const allAssignments = await Assignment.list();
        const recentAssignments = allAssignments.filter(a => new Date(a.created_date) >= sevenDaysAgo);
        setWeeklyAssignmentCount(recentAssignments.length);
      } catch (e) {
        console.error("Failed to fetch layout data:", e);
      }
    };
    fetchData();
  }, [location.pathname]);

  const handleLogout = async () => {
    await UserEntity.logout();
    navigate(createPageUrl("Dashboard"));
    window.location.reload();
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gradient-to-br from-blue-50 via-white to-green-50">
        <style>
          {`
            :root {
              --sidebar-background: rgba(255, 255, 255, 0.95);
              --sidebar-foreground: #1f2937;
              --sidebar-primary: #3b82f6;
              --sidebar-primary-foreground: white;
              --sidebar-accent: #f1f5f9;
              --sidebar-accent-foreground: #334155;
              --sidebar-border: rgba(148, 163, 184, 0.2);
              --sidebar-ring: #3b82f6;
            }
            
            .sidebar-gradient {
              background: linear-gradient(135deg, 
                rgba(59, 130, 246, 0.05) 0%, 
                rgba(16, 185, 129, 0.05) 100%);
              backdrop-filter: blur(10px);
              border-right: 1px solid rgba(148, 163, 184, 0.2);
            }
          `}
        </style>
        
        <Sidebar className="sidebar-gradient">
          <SidebarHeader className="border-b border-gray-200/50 p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-xl flex items-center justify-center shadow-lg">
                <GraduationCap className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="font-bold text-gray-900 text-lg">Smart Homework</h2>
                <p className="text-xs text-gray-500">AI-Powered Learning Assistant</p>
              </div>
            </div>
          </SidebarHeader>
          
          <SidebarContent className="p-4">
            <SidebarGroup>
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Navigation
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu className="space-y-1">
                  {navigationItems.map((item) => (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        className={`rounded-xl px-4 py-3 transition-all duration-200 hover:bg-white/80 hover:shadow-sm ${
                          location.pathname === item.url 
                            ? 'bg-gradient-to-r from-blue-500 to-green-500 text-white shadow-md hover:from-blue-600 hover:to-green-600' 
                            : 'text-gray-700 hover:text-gray-900'
                        }`}
                      >
                        <Link to={item.url} className="flex items-center gap-3">
                          <item.icon className="w-5 h-5" />
                          <span className="font-medium">{item.title}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarGroup className="mt-8">
              <SidebarGroupLabel className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-3 py-2">
                Quick Actions
              </SidebarGroupLabel>
              <SidebarGroupContent>
                <div className="px-3 py-2 space-y-3">
                  <Link to={createPageUrl("Progress")}>
                    <div className="p-3 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg border border-blue-100 hover:shadow-md transition-shadow cursor-pointer">
                      <div className="flex items-center gap-2 text-sm font-medium text-blue-800 mb-1">
                        <BookOpen className="w-4 h-4" />
                        Weekly Progress
                      </div>
                      <div className="text-xs text-blue-600">
                        {weeklyAssignmentCount} assignment{weeklyAssignmentCount !== 1 ? 's' : ''} graded this week
                      </div>
                    </div>
                  </Link>
                </div>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>

          <SidebarFooter className="border-t border-gray-200/50 p-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-blue-50 rounded-xl cursor-pointer hover:bg-gray-100/80 transition-colors">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {user ? user.full_name.charAt(0).toUpperCase() : 'P'}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-gray-900 text-sm truncate">{user ? user.full_name : 'Parent Dashboard'}</p>
                    <p className="text-xs text-gray-500 truncate">{user ? user.email : 'Helping your child succeed'}</p>
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuItem onClick={() => navigate(createPageUrl('Profile'))}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate(createPageUrl('Settings'))}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarFooter>
        </Sidebar>

        <main className="flex-1 flex flex-col">
          {/* Mobile header */}
          <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4 md:hidden">
            <div className="flex items-center gap-4">
              <SidebarTrigger className="hover:bg-gray-100 p-2 rounded-lg transition-colors duration-200" />
              <div className="flex items-center gap-2">
                <GraduationCap className="w-6 h-6 text-blue-500" />
                <h1 className="text-xl font-bold text-gray-900">Smart Homework</h1>
              </div>
            </div>
          </header>

          {/* Main content area */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}

