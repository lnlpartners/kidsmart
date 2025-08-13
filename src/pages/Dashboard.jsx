
import React, { useState, useEffect, useMemo } from "react";
import { Child } from "@/api/entities";
import { Assignment } from "@/api/entities";
import { PracticeQuestion } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  TrendingUp, 
  BookOpen, 
  Target, 
  Clock,
  Plus,
  Camera,
  Star,
  ChevronRight,
  Award,
  Brain,
  Users
} from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import StatsOverview from "../components/dashboard/StatsOverview";
import RecentActivity from "../components/dashboard/RecentActivity";
import ChildrenProgress from "../components/dashboard/ChildrenProgress";
import QuickActions from "../components/dashboard/QuickActions";

export default function Dashboard() {
  const [children, setChildren] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [practiceQuestions, setPracticeQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedChildId, setSelectedChildId] = useState('all');

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      console.log("🔄 Loading dashboard data...");
      
      const [childrenData, assignmentsData, practiceData] = await Promise.all([
        Child.list('-created_date'),
        Assignment.list('-created_date', 50), // Increased limit to ensure we get recent assignments
        PracticeQuestion.list('-created_date')
      ]);
      
      console.log("📊 Dashboard data loaded:");
      console.log("  - Children:", childrenData.length);
      console.log("  - Assignments:", assignmentsData.length);
      console.log("  - Practice Questions:", practiceData.length);
      
      if (assignmentsData.length > 0) {
        console.log("  - Most recent assignment:", {
          id: assignmentsData[0].id,
          title: assignmentsData[0].title,
          created_date: assignmentsData[0].created_date,
          status: assignmentsData[0].status
        });
      }
      
      setChildren(childrenData);
      setAssignments(assignmentsData);
      setPracticeQuestions(practiceData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    }
    setIsLoading(false);
  };

  const filteredData = useMemo(() => {
    const childAssignments = selectedChildId === 'all'
        ? assignments
        : assignments.filter(a => a.child_id === selectedChildId);

    const childPracticeQuestions = selectedChildId === 'all'
        ? practiceQuestions
        : practiceQuestions.filter(p => p.child_id === selectedChildId);

    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    
    const recentAssignments = childAssignments.filter(
      a => new Date(a.created_date) > weekAgo
    );
    
    const totalScore = recentAssignments.reduce(
      (sum, a) => sum + (a.score_percentage || 0), 0
    );
    
    const stats = {
      weeklyAssignments: recentAssignments.length,
      averageScore: recentAssignments.length ? Math.round(totalScore / recentAssignments.length) : 0,
      practiceQuestions: childPracticeQuestions.filter(p => !p.completed).length
    };
    
    const selectedChildName = selectedChildId === 'all' 
      ? "All Children" 
      : children.find(c => c.id === selectedChildId)?.name;

    return {
      stats,
      displayAssignments: childAssignments,
      displayPracticeQuestions: childPracticeQuestions,
      selectedChildName
    };
  }, [selectedChildId, assignments, practiceQuestions, children]);

  const { stats, displayAssignments, displayPracticeQuestions, selectedChildName } = filteredData;
  const welcomeMessage = selectedChildId === 'all' ? "Welcome Back! 👋" : `Viewing Dashboard for ${selectedChildName}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div className="flex-1">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              {welcomeMessage}
            </h1>
            <p className="text-lg text-gray-600">
              {selectedChildId === 'all' 
                ? "Let's see how your children are progressing with their homework."
                : `Here is an overview of ${selectedChildName}'s progress.`
              }
            </p>
          </div>
          
          <div className="flex gap-3 w-full md:w-auto items-center">
            <Select value={selectedChildId} onValueChange={setSelectedChildId}>
              <SelectTrigger className="w-full md:w-[180px] bg-white/80">
                <Users className="w-4 h-4 mr-2 text-gray-500" />
                <SelectValue placeholder="Select Child" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Children</SelectItem>
                {children.map(child => (
                  <SelectItem key={child.id} value={child.id}>
                    {child.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Stats Overview */}
        <StatsOverview 
          stats={stats}
          isLoading={isLoading}
        />

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Recent Activity */}
          <div className="lg:col-span-2 space-y-6">
            <RecentActivity 
              assignments={displayAssignments}
              isLoading={isLoading}
            />
            
            <QuickActions />
          </div>

          {/* Right Column - Children Progress */}
          <div className="space-y-6">
            <ChildrenProgress 
              children={selectedChildId === 'all' ? children : children.filter(c => c.id === selectedChildId)}
              assignments={assignments}
              isLoading={isLoading}
              selectedChildId={selectedChildId}
            />
            
            {/* Upcoming Practice */}
            <Card className="bg-gradient-to-br from-purple-50 to-pink-50 border-purple-200 shadow-lg">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-purple-800">
                  <Brain className="w-5 h-5" />
                  Practice Suggestions
                </CardTitle>
              </CardHeader>
              <CardContent>
                {displayPracticeQuestions.slice(0, 3).map((question, index) => (
                  <div key={question.id} className="flex items-center gap-3 p-3 bg-white/60 rounded-lg mb-2 last:mb-0">
                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-purple-600 font-medium text-sm">{index + 1}</span>
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900 text-sm">{question.skill_area}</p>
                      <p className="text-xs text-gray-500">{question.subject}</p>
                    </div>
                  </div>
                ))}
                <Link to={createPageUrl("Practice")}>
                  <Button variant="outline" className="w-full mt-3 border-purple-200 text-purple-700 hover:bg-purple-50">
                    View All Practice Questions
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
