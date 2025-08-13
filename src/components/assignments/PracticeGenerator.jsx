import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Lightbulb, Brain, Check, ArrowRight, Loader2 } from "lucide-react";
import { PracticeQuestion } from "@/api/entities";
import { InvokeLLM } from "@/api/integrations";
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';

export default function PracticeGenerator({ assignment, child }) {
  const navigate = useNavigate();
  const [existingQuestions, setExistingQuestions] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedCount, setGeneratedCount] = useState(0);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkForExistingQuestions = async () => {
      setIsChecking(true);
      const questions = await PracticeQuestion.filter({ assignment_id: assignment.id });
      setExistingQuestions(questions);
      setIsChecking(false);
    };
    checkForExistingQuestions();
  }, [assignment.id]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    let count = 0;
    const areasToPractice = assignment.skill_areas_to_practice || assignment.weaknesses || [];
    
    for (const skillArea of areasToPractice.slice(0, 3)) { // Generate up to 3 questions
      const practiceResult = await InvokeLLM({
        prompt: `Create a practice question for a ${child?.grade_level} grader to help them improve in ${skillArea} for ${assignment.subject}. Make it appropriate for their grade level. Include multiple choice options if applicable. Provide a clear correct answer and a brief explanation. Ensure the correct answer is accurate.`,
        response_json_schema: {
          type: "object",
          properties: {
            question: { type: "string" },
            question_type: { type: "string", enum: ["multiple_choice", "fill_blank", "short_answer", "math_problem", "true_false"] },
            options: { type: "array", items: { type: "string" } },
            correct_answer: { type: "string" },
            explanation: { type: "string" },
            difficulty_level: { type: "string", enum: ["easy", "medium", "hard"] }
          },
          required: ["question", "question_type", "correct_answer", "explanation"]
        }
      });

      if (practiceResult && practiceResult.question) {
        await PracticeQuestion.create({
          child_id: child.id,
          assignment_id: assignment.id,
          subject: assignment.subject,
          skill_area: skillArea,
          question_type: practiceResult.question_type,
          question: practiceResult.question,
          options: practiceResult.options || [],
          correct_answer: practiceResult.correct_answer,
          explanation: practiceResult.explanation,
          difficulty_level: practiceResult.difficulty_level || "medium"
        });
        count++;
      }
    }
    setGeneratedCount(count);
    setIsGenerating(false);
    const questions = await PracticeQuestion.filter({ assignment_id: assignment.id });
    setExistingQuestions(questions);
  };
  
  if (isChecking) {
    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardContent className="p-6 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto text-purple-500" />
            </CardContent>
        </Card>
    )
  }

  if (existingQuestions.length > 0) {
    return (
      <Card className="shadow-lg border-0 bg-gradient-to-br from-green-50 to-emerald-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-green-800">
            <Check className="w-5 h-5" />
            Practice is Ready!
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-green-700 mb-4">
            {existingQuestions.length} practice question{existingQuestions.length > 1 ? 's have' : ' has'} been generated for this assignment.
          </p>
          <Button onClick={() => navigate(createPageUrl("Practice"))}>
            Go to Practice Zone
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
    );
  }

  if (isGenerating) {
    return (
        <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-purple-800">
                    <Lightbulb className="w-5 h-5" />
                    Generating Practice...
                </CardTitle>
            </CardHeader>
            <CardContent className="text-center">
                <Loader2 className="w-8 h-8 animate-spin mx-auto text-purple-500 mb-4" />
                <p className="text-purple-700">Creating personalized questions to help your child improve...</p>
            </CardContent>
        </Card>
    )
  }
  
  const areasToPractice = assignment.skill_areas_to_practice || assignment.weaknesses || [];
  if (areasToPractice.length === 0) {
    return null; // Don't show the card if there's nothing to practice
  }

  return (
    <Card className="shadow-lg border-0 bg-gradient-to-br from-purple-50 to-pink-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-purple-800">
          <Brain className="w-5 h-5" />
          Next Steps: Sharpen Skills
        </CardTitle>
      </CardHeader>
      <CardContent className="text-center">
        <p className="text-purple-700 mb-4">
          Generate personalized practice questions based on this assignment's results to help your child master key concepts.
        </p>
        <Button 
          onClick={handleGenerate} 
          className="bg-purple-600 hover:bg-purple-700"
        >
          Generate Practice Questions
          <Lightbulb className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}