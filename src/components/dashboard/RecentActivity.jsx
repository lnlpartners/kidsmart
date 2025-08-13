import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";
import { FileText, Star, AlertCircle, CheckCircle, Upload } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

const subjectColors = {
  math: "bg-blue-100 text-blue-800 border-blue-200",
  english: "bg-green-100 text-green-800 border-green-200",
  science: "bg-purple-100 text-purple-800 border-purple-200",
  history: "bg-orange-100 text-orange-800 border-orange-200",
  reading: "bg-pink-100 text-pink-800 border-pink-200",
  writing: "bg-indigo-100 text-indigo-800 border-indigo-200",
  spelling: "bg-yellow-100 text-yellow-800 border-yellow-200",
  other: "bg-gray-100 text-gray-800 border-gray-200"
};

export default function RecentActivity({ assignments, isLoading }) {
  const getScoreIcon = (score) => {
    if (score >= 90) return <Star className="w-4 h-4 text-yellow-500" />;
    if (score >= 70) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <AlertCircle className="w-4 h-4 text-orange-500" />;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-yellow-600 bg-yellow-50";
    if (score >= 70) return "text-green-600 bg-green-50";
    return "text-orange-600 bg-orange-50";
  };

  // Debug logging to help identify the issue
  React.useEffect(() => {
    console.log("🔍 RecentActivity Debug Info:");
    console.log("  - isLoading:", isLoading);
    console.log("  - assignments count:", assignments?.length || 0);
    console.log("  - assignments data:", assignments);
    
    if (assignments && assignments.length > 0) {
      console.log("  - Most recent assignment:", assignments[0]);
      console.log("  - Assignment dates:", assignments.map(a => ({
        id: a.id,
        title: a.title,
        created_date: a.created_date,
        formatted_date: format(new Date(a.created_date), "MMM d, HH:mm")
      })));
    }
  }, [assignments, isLoading]);

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Recent Assignments ({assignments?.length || 0})
          </CardTitle>
          <div className="flex gap-2">
            <Link to={createPageUrl("Upload")}>
              <Button variant="outline" size="sm">
                <Upload className="w-4 h-4 mr-1" />
                Upload
              </Button>
            </Link>
            <Link to={createPageUrl("AssignmentsList")}>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(5).fill(0).map((_, i) => (
              <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            ))}
          </div>
        ) : assignments.length === 0 ? (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments yet</h3>
            <p className="text-gray-500 mb-6">Upload your first homework assignment to get started!</p>
            <Link to={createPageUrl("Upload")}>
              <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                Upload Assignment
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {assignments.slice(0, 8).map((assignment) => (
              <Link 
                key={assignment.id} 
                to={createPageUrl(`AssignmentDetails?id=${assignment.id}`)}
                className="block"
              >
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-gray-900 truncate">
                      {assignment.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge 
                        variant="secondary" 
                        className={`${subjectColors[assignment.subject] || subjectColors.other} border text-xs`}
                      >
                        {assignment.subject}
                      </Badge>
                      <span className="text-xs text-gray-500">
                        {format(new Date(assignment.created_date), "MMM d, HH:mm")}
                      </span>
                      {assignment.status === 'processing' && (
                        <Badge variant="outline" className="text-xs bg-yellow-50 text-yellow-700 border-yellow-200">
                          Processing...
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {assignment.score_percentage !== undefined && assignment.score_percentage !== null ? (
                      <>
                        {getScoreIcon(assignment.score_percentage)}
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(assignment.score_percentage)}`}>
                          {assignment.score_percentage}%
                        </span>
                      </>
                    ) : (
                      <span className="px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-600">
                        Pending
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}