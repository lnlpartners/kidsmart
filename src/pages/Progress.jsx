
import React, { useState, useEffect } from "react";
import { Child } from "@/api/entities";
import { Assignment } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { ArrowLeft, BarChart3, TrendingUp, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

import ProgressFilters from "../components/progress/ProgressFilters";
import ScoreTrendChart from "../components/progress/ScoreTrendChart";
import SubjectPerformanceChart from "../components/progress/SubjectPerformanceChart";
import SkillsCloud from "../components/progress/SkillsCloud";
import RecentAchievements from "../components/progress/RecentAchievements";

export default function ProgressPage() {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [assignments, setAssignments] = useState([]);
  const [selectedChildId, setSelectedChildId] = useState(null);
  const [timeWindow, setTimeWindow] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
    
    // Check for child parameter in URL on initial load
    // Note: 'children' might be an empty array here on the very first render,
    // so the `children.find` will only work if children were already loaded
    // (e.g., from a previous render if component unmounted/remounted with cached data,
    // or if `children` was initialized with data directly).
    // The second useEffect below will handle this reliably once children data is fetched.
    const urlParams = new URLSearchParams(window.location.search);
    const childParam = urlParams.get('child');
    if (childParam && children.find(c => c.id === childParam)) {
      setSelectedChildId(childParam);
    }
  }, []);

  useEffect(() => {
    // This effect runs when the 'children' state changes (i.e., after data is loaded).
    // It ensures that the URL parameter is processed with the actual loaded children data.
    const urlParams = new URLSearchParams(window.location.search);
    const childParam = urlParams.get('child');
    if (childParam && children.length > 0) { // Ensure children data is available
      const foundChild = children.find(c => c.id === childParam);
      if (foundChild) {
        setSelectedChildId(childParam);
      }
    }
  }, [children]); // Dependency on 'children' ensures this runs after children data is set

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [childrenData, assignmentsData] = await Promise.all([
        Child.list(),
        Assignment.list('-created_date')
      ]);
      setChildren(childrenData);
      setAssignments(assignmentsData);
      // Set the first child as default if no child is currently selected
      // This will be potentially overridden by the URL parameter handling in the useEffects
      if (childrenData.length > 0 && selectedChildId === null) {
        setSelectedChildId(childrenData[0].id);
      }
    } catch (error) {
      console.error("Error loading progress data:", error);
    }
    setIsLoading(false);
  };

  const getFilteredAssignments = () => {
    let filtered = assignments.filter(a => a.child_id === selectedChildId);
    
    if (timeWindow !== "all") {
      const now = new Date();
      const cutoffDate = new Date();
      
      switch (timeWindow) {
        case "week":
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case "month":
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case "quarter":
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        default:
          // Should not happen with current timeWindow values
          break;
      }
      
      filtered = filtered.filter(a => new Date(a.created_date) >= cutoffDate);
    }
    
    return filtered;
  };

  const selectedChild = children.find(c => c.id === selectedChildId);
  const filteredAssignments = getFilteredAssignments();
  
  const allStrengths = filteredAssignments.flatMap(a => a.strengths || []);
  const allWeaknesses = filteredAssignments.flatMap(a => a.weaknesses || []);

  const overallAverage = filteredAssignments.length > 0
    ? Math.round(filteredAssignments.reduce((sum, a) => sum + (a.score_percentage || 0), 0) / filteredAssignments.length)
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Progress Report</h1>
            <p className="text-gray-600 mt-1">Visualize your child's academic journey</p>
          </div>
        </div>

        <ProgressFilters 
          children={children}
          selectedChildId={selectedChildId}
          onSelectChild={setSelectedChildId}
          timeWindow={timeWindow}
          onTimeWindowChange={setTimeWindow}
          isLoading={isLoading}
        />

        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-96 w-full" />
            <Skeleton className="h-64 w-full lg:col-span-2" />
          </div>
        ) : selectedChild && filteredAssignments.length > 0 ? (
          <>
            <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5 text-blue-500"/>
                        Overall Performance for {selectedChild.name}
                    </CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <p className="text-gray-600">Average Score</p>
                    <p className="text-6xl font-bold text-gray-900 my-2">{overallAverage}%</p>
                    <p className="text-sm text-gray-500">Based on {filteredAssignments.length} assignments</p>
                </CardContent>
            </Card>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ScoreTrendChart assignments={filteredAssignments} />
              <SubjectPerformanceChart assignments={filteredAssignments} />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SkillsCloud title="Strengths" skills={allStrengths} icon={CheckCircle} color="green" />
              <SkillsCloud title="Areas for Improvement" skills={allWeaknesses} icon={AlertCircle} color="orange" />
            </div>

            <RecentAchievements 
              child={selectedChild}
              assignments={filteredAssignments}
              allAssignments={assignments.filter(a => a.child_id === selectedChildId)}
            />
          </>
        ) : (
          <Card className="text-center p-12 shadow-lg">
            <CardTitle>No Data Available</CardTitle>
            <p className="mt-4 text-gray-600">
              {selectedChild ? `No assignments found for ${selectedChild.name} in the selected time period.` : 'Please select a child to view their progress.'}
            </p>
             <p className="text-gray-600">Upload an assignment to get started.</p>
          </Card>
        )}
      </div>
    </div>
  );
}
