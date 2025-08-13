
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Save, AlertTriangle, CheckCircle, XCircle, Edit3 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default function ReviewAndCorrectInterface({ reviewData, onSave, onBack }) {
  const [editingQuestions, setEditingQuestions] = useState(reviewData.allQuestions);
  const [hasChanges, setHasChanges] = useState(false);

  const updateQuestion = (questionIndex, field, value) => {
    const updated = [...editingQuestions];
    updated[questionIndex] = {
      ...updated[questionIndex],
      [field]: value
    };
    
    // Recalculate is_correct if answer fields change
    if (field === 'student_answer' || field === 'correct_answer') {
      const question = updated[questionIndex];
      if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
        updated[questionIndex].is_correct = question.student_answer === question.correct_answer;
      } else {
        const correctAnswerClean = question.correct_answer.toString().trim().toLowerCase();
        const studentAnswerClean = question.student_answer.toString().trim().toLowerCase();
        updated[questionIndex].is_correct = studentAnswerClean === correctAnswerClean;
      }
    }
    
    setEditingQuestions(updated);
    setHasChanges(true);
  };

  const recalculateScore = () => {
    const correctCount = editingQuestions.filter(q => q.is_correct).length;
    const totalCount = editingQuestions.length;
    const scorePercentage = totalCount > 0 ? Math.round((correctCount / totalCount) * 100) : 0;
    return { correctCount, totalCount, scorePercentage };
  };

  const handleSave = () => {
    const { correctCount, totalCount, scorePercentage } = recalculateScore();
    const correctedData = {
      ...reviewData,
      allQuestions: editingQuestions,
      correctCount,
      totalCount,
      scorePercentage
    };
    onSave(correctedData);
  };

  const { correctCount, totalCount, scorePercentage } = recalculateScore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={onBack}>
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-900">Review & Correct Results</h1>
            <p className="text-gray-600 mt-1">Verify AI analysis and make corrections if needed</p>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-gray-900">{scorePercentage}%</div>
            <div className="text-sm text-gray-600">{correctCount}/{totalCount} correct</div>
          </div>
        </div>

        {hasChanges && (
          <Alert className="bg-amber-50 border-amber-200 text-amber-800">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              You have made changes to the AI analysis. Review your corrections and save when ready.
            </AlertDescription>
          </Alert>
        )}

        {/* Questions Review */}
        <div className="space-y-4">
          {editingQuestions.map((question, index) => {
            const isMCQ = question.question_type === 'multiple_choice' && question.options?.length > 0;
            const optionLetters = isMCQ ? question.options.map((_, i) => String.fromCharCode(65 + i)) : [];

            return (
              <Card key={index} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <span>Question {question.question_number}</span>
                      {question.is_correct ? (
                        <CheckCircle className="w-5 h-5 text-green-500" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                      )}
                      <Badge variant="outline">Page {question.source_page}</Badge>
                      <Badge variant="outline">{question.skill_area}</Badge>
                    </CardTitle>
                    <Edit3 className="w-4 h-4 text-gray-400" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Question Text */}
                  <div>
                    <Label>Question</Label>
                    <div className="p-3 bg-gray-50 rounded border text-gray-800">
                      {question.question_text}
                    </div>
                  </div>

                  {/* Options (if multiple choice) with DYNAMIC BADGES */}
                  {isMCQ && (
                    <div>
                      <Label>Answer Choices</Label>
                      <div className="space-y-2 mt-2">
                        {question.options.map((option, idx) => {
                          const optionLetter = optionLetters[idx];
                          const isStudentAnswer = question.student_answer === optionLetter;
                          const isCorrectAnswer = question.correct_answer === optionLetter;
                          
                          return (
                            <div 
                              key={idx} 
                              className={`p-3 rounded-lg border text-sm flex items-center gap-3 transition-all ${
                                isCorrectAnswer ? 'border-green-400 bg-green-50 ring-2 ring-green-200' : 'bg-gray-50 border-gray-200'
                              } ${
                                isStudentAnswer && !isCorrectAnswer ? 'border-blue-400 bg-blue-50 ring-2 ring-blue-200' : ''
                              }`}
                            >
                              <span className="font-bold text-gray-700">{optionLetter}.</span>
                              <span className="flex-1">{option}</span>
                              {isStudentAnswer && (
                                <Badge variant="secondary" className="bg-blue-100 text-blue-800">Student's Choice</Badge>
                              )}
                              {isCorrectAnswer && (
                                <Badge variant="secondary" className="bg-green-100 text-green-800">Correct Answer</Badge>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Editable Fields with CONDITIONAL INPUTS */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    {isMCQ ? (
                      <>
                        <div>
                          <Label htmlFor={`student-answer-${index}`}>Student's Answer</Label>
                          <Select
                            value={question.student_answer}
                            onValueChange={(value) => updateQuestion(index, 'student_answer', value)}
                          >
                            <SelectTrigger id={`student-answer-${index}`} className={question.is_correct ? 'border-green-300' : 'border-red-300'}>
                              <SelectValue placeholder="Select student's choice" />
                            </SelectTrigger>
                            <SelectContent>
                              {optionLetters.map(letter => (
                                <SelectItem key={letter} value={letter}>{letter}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor={`correct-answer-${index}`}>Correct Answer</Label>
                           <Select
                            value={question.correct_answer}
                            onValueChange={(value) => updateQuestion(index, 'correct_answer', value)}
                          >
                            <SelectTrigger id={`correct-answer-${index}`} className="border-green-300">
                              <SelectValue placeholder="Select correct choice" />
                            </SelectTrigger>
                            <SelectContent>
                              {optionLetters.map(letter => (
                                <SelectItem key={letter} value={letter}>{letter}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    ) : (
                      <>
                        <div>
                          <Label htmlFor={`student-answer-${index}`}>Student's Answer</Label>
                          <Input
                            id={`student-answer-${index}`}
                            value={question.student_answer || ''}
                            onChange={(e) => updateQuestion(index, 'student_answer', e.target.value)}
                            className={question.is_correct ? 'border-green-300' : 'border-red-300'}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`correct-answer-${index}`}>Correct Answer</Label>
                          <Input
                            id={`correct-answer-${index}`}
                            value={question.correct_answer || ''}
                            onChange={(e) => updateQuestion(index, 'correct_answer', e.target.value)}
                            className="border-green-300"
                          />
                        </div>
                      </>
                    )}
                  </div>

                  {/* Step-by-step Solution */}
                  <div>
                    <Label htmlFor={`solution-${index}`}>Step-by-step Solution</Label>
                    <Textarea
                      id={`solution-${index}`}
                      value={question.step_by_step_solution || ''}
                      onChange={(e) => updateQuestion(index, 'step_by_step_solution', e.target.value)}
                      className="h-24"
                    />
                  </div>

                  {/* Verification Notes */}
                  {question.verification_notes && (
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded">
                      <Label className="text-blue-800 font-medium">AI Detection Notes</Label>
                      <p className="text-sm text-blue-700 mt-1">{question.verification_notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Save Button */}
        <div className="flex justify-end gap-4">
          <Button variant="outline" onClick={onBack}>
            Back to Upload
          </Button>
          <Button 
            onClick={handleSave}
            className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Assignment
          </Button>
        </div>
      </div>
    </div>
  );
}
