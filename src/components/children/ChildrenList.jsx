import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { User, Trash2, BookOpen, Calendar, Edit } from "lucide-react";
import { format } from "date-fns";

export default function ChildrenList({ children, isLoading, onEdit, onDelete }) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array(6).fill(0).map((_, i) => (
          <Card key={i} className="shadow-lg border-0">
            <CardHeader>
              <div className="flex items-center gap-3">
                <Skeleton className="w-12 h-12 rounded-full" />
                <div className="space-y-1">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-3 w-16" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardContent className="text-center py-16">
          <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No children added yet</h3>
          <p className="text-gray-600 mb-6">
            Add your first child to start tracking their homework progress
          </p>
          <Button className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600">
            <User className="w-4 h-4 mr-2" />
            Add Your First Child
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {children.map((child) => (
        <Card key={child.id} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-semibold text-lg">
                    {child.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <CardTitle className="text-lg">{child.name}</CardTitle>
                  <p className="text-sm text-gray-600">Age {child.age}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(child)}
                  className="text-blue-500 hover:text-blue-700 hover:bg-blue-50"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(child.id)}
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-500" />
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Grade {child.grade_level}
              </Badge>
            </div>
            
            {child.language && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">Language:</span>
                <Badge variant="outline" className="capitalize">
                  {child.language}
                </Badge>
              </div>
            )}

            {child.subjects && child.subjects.length > 0 && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Subjects:</p>
                <div className="flex flex-wrap gap-1">
                  {child.subjects.map((subject, index) => (
                    <Badge key={index} variant="outline" className="text-xs capitalize">
                      {subject}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center gap-2 text-xs text-gray-500 pt-2 border-t">
              <Calendar className="w-3 h-3" />
              Added {format(new Date(child.created_date), "MMM d, yyyy")}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}