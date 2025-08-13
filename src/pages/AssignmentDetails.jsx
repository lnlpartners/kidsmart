
import React, { useState, useEffect } from "react";
import { Assignment } from "@/api/entities";
import { Child } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, FileText, CheckCircle, XCircle, Star, AlertCircle, Eye } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { format } from "date-fns";

import QuestionBreakdown from "../components/assignments/QuestionBreakdown";
import AssignmentSummary from "../components/assignments/AssignmentSummary";
import PracticeGenerator from "../components/assignments/PracticeGenerator"; // Import new component

export default function AssignmentDetailsPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const assignmentId = searchParams.get('id');
  
  const [assignment, setAssignment] = useState(null);
  const [child, setChild] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (assignmentId) {
      loadAssignmentDetails();
    }
  }, [assignmentId]);

  const loadAssignmentDetails = async () => {
    setIsLoading(true);
    try {
      const assignmentData = await Assignment.filter({ id: assignmentId });
      const foundAssignment = assignmentData[0]; // Use filter to get a specific assignment
      
      if (!foundAssignment) {
        setError("Assignment not found");
        setIsLoading(false); // Stop loading if not found
        return;
      }
      
      setAssignment(foundAssignment);
      
      if (foundAssignment.child_id) {
        const childrenData = await Child.filter({ id: foundAssignment.child_id }); // Also optimize child fetching
        const foundChild = childrenData[0];
        setChild(foundChild);
      }
    } catch (error) {
      setError("Error loading assignment details");
      console.error("Error:", error);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-gray-200 rounded w-1/3"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
            <div className="h-96 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <Card className="text-center p-12">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Assignment Not Found</h2>
            <p className="text-gray-600 mb-6">{error || "The assignment you're looking for doesn't exist."}</p>
            <Button onClick={() => navigate(createPageUrl("Dashboard"))}>
              Back to Dashboard
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-50 border-green-200";
    if (score >= 70) return "text-blue-600 bg-blue-50 border-blue-200";
    return "text-orange-600 bg-orange-50 border-orange-200";
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return <Star className="w-6 h-6 text-yellow-500" />;
    if (score >= 70) return <CheckCircle className="w-6 h-6 text-green-500" />;
    return <AlertCircle className="w-6 h-6 text-orange-500" />;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Assignment Review</h1>
            <p className="text-gray-600 mt-1">Detailed analysis and feedback</p>
          </div>
          {assignment.original_file_url && (
            <Button
              variant="outline"
              onClick={() => window.open(assignment.original_file_url, '_blank')}
              className="gap-2"
            >
              <Eye className="w-4 h-4" />
              View Original
            </Button>
          )}
        </div>

        {/* Assignment Summary */}
        <AssignmentSummary 
          assignment={assignment}
          child={child}
          getScoreColor={getScoreColor}
          getScoreIcon={getScoreIcon}
        />

        {/* Question Breakdown */}
        <QuestionBreakdown assignment={assignment} />

        {/* Practice Question Generator */}
        <PracticeGenerator assignment={assignment} child={child} />
      </div>
    </div>
  );
}
