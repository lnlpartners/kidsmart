
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { User, Plus, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function ChildrenProgress({ children, assignments, isLoading, selectedChildId }) {
  const getChildProgress = (childId) => {
    const childAssignments = assignments.filter(a => a.child_id === childId);
    if (childAssignments.length === 0) return { averageScore: 0, totalAssignments: 0 };
    
    const totalScore = childAssignments.reduce((sum, a) => sum + (a.score_percentage || 0), 0);
    return {
      averageScore: Math.round(totalScore / childAssignments.length),
      totalAssignments: childAssignments.length
    };
  };

  return (
    <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <User className="w-5 h-5 text-green-500" />
            Progress Report
          </CardTitle>
          <Link to={createPageUrl("Children")}>
            <Button variant="outline" size="sm">
              <Plus className="w-4 h-4 mr-1" />
              {selectedChildId === 'all' ? 'Add Child' : 'Manage Children'}
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="space-y-4">
            {Array(3).fill(0).map((_, i) => (
              <div key={i} className="p-4 border rounded-lg space-y-3">
                <div className="flex items-center gap-3">
                  <Skeleton className="w-10 h-10 rounded-full" />
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
                <Skeleton className="h-2 w-full" />
              </div>
            ))}
          </div>
        ) : children.length === 0 ? (
          <div className="text-center py-8">
            <User className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <h3 className="font-medium text-gray-900 mb-2">
              {selectedChildId === 'all' ? 'No children added yet' : 'Child not found'}
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              {selectedChildId === 'all' 
                ? 'Add your children to start tracking their progress' 
                : 'The selected child may have been removed'
              }
            </p>
            <Link to={createPageUrl("Children")}>
              <Button size="sm" className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
                <Plus className="w-4 h-4 mr-1" />
                {selectedChildId === 'all' ? 'Add First Child' : 'Manage Children'}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {children.map((child) => {
              const progress = getChildProgress(child.id);
              return (
                <Link key={child.id} to={createPageUrl(`Progress?child=${child.id}`)}>
                  <div className="p-4 bg-gradient-to-r from-blue-50 to-green-50 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200 cursor-pointer">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-semibold text-sm">
                          {child.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900">{child.name}</h4>
                        <p className="text-sm text-gray-600">Grade {child.grade_level}</p>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1 text-green-600">
                          <TrendingUp className="w-3 h-3" />
                          <span className="text-sm font-medium">{progress.averageScore}%</span>
                        </div>
                        <p className="text-xs text-gray-500">{progress.totalAssignments} assignments</p>
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs text-gray-600">
                        <span>Overall Progress</span>
                        <span>{progress.averageScore}%</span>
                      </div>
                      <Progress 
                        value={progress.averageScore} 
                        className="h-2" 
                      />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
