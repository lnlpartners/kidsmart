import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Calendar } from "lucide-react";

export default function ProgressFilters({ children, selectedChildId, onSelectChild, timeWindow, onTimeWindowChange, isLoading }) {
  const getTimeWindowLabel = (window) => {
    const now = new Date();
    switch (window) {
      case "week":
        const weekStart = new Date(now);
        weekStart.setDate(now.getDate() - 7);
        return `This Week (${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
      case "month":
        const monthStart = new Date(now);
        monthStart.setMonth(now.getMonth() - 1);
        return `This Month (${monthStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
      case "quarter":
        const quarterStart = new Date(now);
        quarterStart.setMonth(now.getMonth() - 3);
        return `Last 3 Months (${quarterStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })})`;
      default:
        return "All Time";
    }
  };

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardContent className="p-4">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
          <div className="flex items-center gap-4">
            <label className="font-medium text-gray-700">Viewing progress for:</label>
            {isLoading ? (
              <Skeleton className="h-10 w-48" />
            ) : (
              <Select value={selectedChildId || ''} onValueChange={onSelectChild}>
                <SelectTrigger className="w-[280px]">
                  <SelectValue placeholder="Select a child" />
                </SelectTrigger>
                <SelectContent>
                  {children.map(child => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name} - Grade {child.grade_level}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <div className="flex items-center gap-4">
            <label className="font-medium text-gray-700 flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Time Period:
            </label>
            {isLoading ? (
              <Skeleton className="h-10 w-64" />
            ) : (
              <Select value={timeWindow} onValueChange={onTimeWindowChange}>
                <SelectTrigger className="w-[320px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Time</SelectItem>
                  <SelectItem value="week">{getTimeWindowLabel("week")}</SelectItem>
                  <SelectItem value="month">{getTimeWindowLabel("month")}</SelectItem>
                  <SelectItem value="quarter">{getTimeWindowLabel("quarter")}</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}