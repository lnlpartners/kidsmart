import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TrendingUp, BookOpen, Target, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router-dom";
import { createPageUrl } from "@/utils";

export default function StatsOverview({ stats, isLoading }) {
  const statCards = [
    {
      title: "This Week's Assignments",
      value: stats.weeklyAssignments,
      icon: BookOpen,
      color: "from-blue-500 to-blue-600",
      bgColor: "from-blue-50 to-blue-100",
      textColor: "text-blue-700",
      href: createPageUrl("AssignmentsList")
    },
    {
      title: "Average Score",
      value: `${stats.averageScore}%`,
      icon: Target,
      color: "from-green-500 to-green-600",
      bgColor: "from-green-50 to-green-100",
      textColor: "text-green-700",
      href: createPageUrl("Progress")
    },
    {
      title: "Practice Questions",
      value: stats.practiceQuestions,
      icon: Clock,
      color: "from-purple-500 to-purple-600",
      bgColor: "from-purple-50 to-purple-100",
      textColor: "text-purple-700",
      href: createPageUrl("Practice")
    },
    {
      title: "Improvement Trend",
      value: "+12%",
      icon: TrendingUp,
      color: "from-orange-500 to-orange-600",
      bgColor: "from-orange-50 to-orange-100",
      textColor: "text-orange-700",
      href: createPageUrl("Progress")
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <Link key={stat.title} to={stat.href}>
          <Card className={`bg-gradient-to-br ${stat.bgColor} border-0 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer`}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className={`text-sm font-medium ${stat.textColor}`}>
                {stat.title}
              </CardTitle>
              <div className={`p-2 bg-gradient-to-r ${stat.color} rounded-lg shadow-sm`}>
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
              )}
              <p className="text-xs text-gray-600">
                {index === 0 && "Click to view all assignments"}
                {index === 1 && "Click to see detailed progress"}
                {index === 2 && "Click to start practicing"}
                {index === 3 && "Click to view trends"}
              </p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}