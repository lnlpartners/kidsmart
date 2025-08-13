
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, HelpCircle, Eye, EyeOff, AlertTriangle } from "lucide-react";
import { Assignment } from "@/api/entities";

export default function QuestionBreakdown({ assignment }) {
  const [showBreakdown, setShowBreakdown] = useState(true);
  
  const hasAnalysis = assignment.question_analysis && assignment.question_analysis.length > 0;

  return (
    <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-purple-500" />
            Question-by-Question Analysis
            {hasAnalysis && (
              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 border-green-300">
                ✓ Complete Analysis Available
              </Badge>
            )}
          </CardTitle>
          {hasAnalysis && (
            <Button
              onClick={() => setShowBreakdown(!showBreakdown)}
              variant="outline"
              size="sm"
              className="gap-2"
            >
              {showBreakdown ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {showBreakdown ? "Hide Analysis" : "Show Analysis"}
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {!hasAnalysis && (
          <div className="text-center py-8">
            <HelpCircle className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-700 mb-2">No Detailed Analysis Available</h3>
            <p className="text-gray-500 mb-4">
              This assignment was processed before detailed question analysis was available.
            </p>
          </div>
        )}

        {showBreakdown && hasAnalysis && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {assignment.question_analysis.filter(q => q.is_correct).length}
                </div>
                <div className="text-sm text-green-700">Correct Answers</div>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <div className="text-2xl font-bold text-red-600">
                  {assignment.question_analysis.filter(q => !q.is_correct).length}
                </div>
                <div className="text-sm text-red-700">Incorrect Answers</div>
              </div>
            </div>

            <div className="space-y-4">
              {assignment.question_analysis.map((question, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg border-2 ${
                    question.is_correct 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      question.is_correct ? 'bg-green-500' : 'bg-red-500'
                    }`}>
                      {question.is_correct ? (
                        <CheckCircle className="w-5 h-5 text-white" />
                      ) : (
                        <XCircle className="w-5 h-5 text-white" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">
                        Question {question.question_number}
                      </h4>
                      <div className="flex gap-2 flex-wrap mt-1">
                        <Badge variant="outline" className="text-xs">
                          {question.skill_area}
                        </Badge>
                        <Badge variant="outline" className="text-xs capitalize">
                          {question.question_type?.replace(/_/g, ' ')}
                        </Badge>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded border">
                      <p className="font-medium text-gray-700 mb-2">Question:</p>
                      <p className="text-gray-800 mb-3">{question.question_text}</p>
                      
                      {question.options && question.options.length > 0 && (
                        <div className="mt-3">
                          <p className="text-sm font-medium text-gray-600 mb-2">Answer Choices:</p>
                          <div className="space-y-1">
                            {question.options.map((option, idx) => {
                              const optionLetter = String.fromCharCode(65 + idx);
                              return (
                                <div 
                                  key={idx} 
                                  className={`p-2 rounded text-sm ${
                                    question.student_selected === optionLetter
                                      ? 'bg-blue-100 border border-blue-300 font-medium' 
                                      : 'bg-gray-50'
                                  } ${
                                    question.correct_option === optionLetter
                                      ? 'ring-2 ring-green-400'
                                      : ''
                                  }`}
                                >
                                  {option}
                                  {question.student_selected === optionLetter && (
                                    <span className="ml-2 text-blue-600 font-bold">← Student Selected</span>
                                  )}
                                  {question.correct_option === optionLetter && (
                                    <span className="ml-2 text-green-600 font-bold">✓ Correct</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="p-3 bg-white rounded border">
                        <p className="font-medium text-gray-700 mb-1">Student Answer:</p>
                        <p className={`${question.is_correct ? 'text-green-700' : 'text-red-700'} font-medium`}>
                          {question.student_answer}
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded border">
                        <p className="font-medium text-gray-700 mb-1">Correct Answer:</p>
                        <p className="text-green-700 font-medium">
                          {question.correct_answer}
                        </p>
                      </div>
                    </div>

                    {question.step_by_step_solution && (
                      <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                        <p className="font-medium text-blue-800 mb-1">Step-by-Step Solution:</p>
                        <p className="text-sm text-blue-700 whitespace-pre-line">{question.step_by_step_solution}</p>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {assignment.detailed_feedback && (
          <div className="mt-8 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200">
            <h3 className="font-semibold text-blue-800 mb-3">Overall Feedback</h3>
            <p className="text-blue-700 leading-relaxed">{assignment.detailed_feedback}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
