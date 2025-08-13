import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { FileText, User, Calendar, BookOpen } from "lucide-react";
import { format } from "date-fns";

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

export default function AssignmentSummary({ assignment, child, getScoreColor, getScoreIcon }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Score Card */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader className="text-center pb-4">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center shadow-lg bg-gradient-to-r from-blue-500 to-green-500">
            {getScoreIcon(assignment.score_percentage)}
          </div>
          <CardTitle className="text-2xl font-bold">Overall Score</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <div className={`inline-flex items-center justify-center w-24 h-24 rounded-full border-4 ${getScoreColor(assignment.score_percentage)} text-3xl font-bold`}>
            {assignment.score_percentage}%
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-gray-600">
              <span>Correct Answers</span>
              <span>{assignment.correct_answers}/{assignment.total_questions}</span>
            </div>
            <Progress value={assignment.score_percentage} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Assignment Info */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-500" />
            Assignment Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">{assignment.title}</h3>
            <Badge 
              variant="secondary" 
              className={`${subjectColors[assignment.subject]} border`}
            >
              {assignment.subject.charAt(0).toUpperCase() + assignment.subject.slice(1)}
            </Badge>
          </div>
          
          <div className="space-y-3 text-sm">
            {child && (
              <div className="flex items-center gap-2">
                <User className="w-4 h-4 text-gray-400" />
                <span className="text-gray-600">Student:</span>
                <span className="font-medium">{child.name}</span>
              </div>
            )}
            
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Grade Level:</span>
              <span className="font-medium">{assignment.grade_level}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-400" />
              <span className="text-gray-600">Completed:</span>
              <span className="font-medium">
                {format(new Date(assignment.created_date), "MMM d, yyyy 'at' h:mm a")}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle>Performance Insights</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Strengths */}
          <div>
            <h4 className="font-semibold text-green-700 mb-2 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              Strengths
            </h4>
            <div className="space-y-1">
              {assignment.strengths?.slice(0, 3).map((strength, index) => (
                <Badge key={index} variant="secondary" className="bg-green-100 text-green-800 border-green-200 text-xs mr-2 mb-1">
                  {strength}
                </Badge>
              ))}
            </div>
          </div>

          {/* Areas for Improvement */}
          <div>
            <h4 className="font-semibold text-orange-700 mb-2 flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
              Areas to Improve
            </h4>
            <div className="space-y-1">
              {assignment.weaknesses?.slice(0, 3).map((weakness, index) => (
                <Badge key={index} variant="secondary" className="bg-orange-100 text-orange-800 border-orange-200 text-xs mr-2 mb-1">
                  {weakness}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}