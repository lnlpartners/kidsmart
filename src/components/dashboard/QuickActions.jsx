import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
import { 
  Upload, 
  Brain, 
  BarChart3, 
  User, 
  Trash2,
  AlertTriangle
} from "lucide-react";
import { cleanupOldAssignments } from "@/api/functions";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function QuickActions() {
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [cleanupResult, setCleanupResult] = useState(null);

  const handleCleanup = async () => {
    if (!confirm("This will delete old assignments (keeping only the 10 most recent). This action cannot be undone. Continue?")) {
      return;
    }

    setIsCleaningUp(true);
    setCleanupResult(null);

    try {
      const result = await cleanupOldAssignments();
      setCleanupResult(result);
      
      // Reload page after successful cleanup to refresh the data
      if (result.success) {
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      }
    } catch (error) {
      setCleanupResult({
        success: false,
        message: `Cleanup failed: ${error.message}`
      });
    } finally {
      setIsCleaningUp(false);
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-gray-900">Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {cleanupResult && (
          <Alert className={cleanupResult.success ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"}>
            {cleanupResult.success ? (
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            <AlertDescription>{cleanupResult.message}</AlertDescription>
          </Alert>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Link to={createPageUrl("Upload")}>
            <Button className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 h-14">
              <Upload className="w-5 h-5 mr-2" />
              Upload Assignment
            </Button>
          </Link>

          <Link to={createPageUrl("Practice")}>
            <Button variant="outline" className="w-full h-14 border-purple-200 text-purple-700 hover:bg-purple-50">
              <Brain className="w-5 h-5 mr-2" />
              Practice Questions
            </Button>
          </Link>

          <Link to={createPageUrl("Progress")}>
            <Button variant="outline" className="w-full h-14 border-blue-200 text-blue-700 hover:bg-blue-50">
              <BarChart3 className="w-5 h-5 mr-2" />
              View Progress
            </Button>
          </Link>

          <Link to={createPageUrl("Children")}>
            <Button variant="outline" className="w-full h-14 border-green-200 text-green-700 hover:bg-green-50">
              <User className="w-5 h-5 mr-2" />
              Manage Children
            </Button>
          </Link>
        </div>

        {/* Cleanup Button */}
        <div className="pt-4 border-t border-gray-200">
          <Button
            onClick={handleCleanup}
            disabled={isCleaningUp}
            variant="outline"
            className="w-full h-12 border-orange-200 text-orange-700 hover:bg-orange-50 disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            {isCleaningUp ? "Cleaning Up..." : "Clear Old Assignments"}
          </Button>
          <p className="text-xs text-gray-500 mt-2 text-center">
            Keeps 10 most recent assignments, deletes older ones
          </p>
        </div>
      </CardContent>
    </Card>
  );
}