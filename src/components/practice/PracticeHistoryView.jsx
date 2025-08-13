import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, X, Filter, BookCopy, Info } from "lucide-react";
import { format } from "date-fns";

export default function PracticeHistoryView({ completedQuestions, children, isLoading }) {
  const [filteredQuestions, setFilteredQuestions] = useState([]);
  const [selectedChild, setSelectedChild] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");

  useEffect(() => {
    let filtered = completedQuestions;

    if (selectedChild !== "all") {
      filtered = filtered.filter(q => q.child_id === selectedChild);
    }

    if (selectedSubject !== "all") {
      filtered = filtered.filter(q => q.subject === selectedSubject);
    }

    setFilteredQuestions(filtered);
  }, [completedQuestions, selectedChild, selectedSubject]);

  const subjects = [...new Set(completedQuestions.map(q => q.subject))];

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-purple-500" />
            Filter History
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Select value={selectedChild} onValueChange={setSelectedChild}>
              <SelectTrigger>
                <SelectValue placeholder="All Children" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Children</SelectItem>
                {children.map(child => (
                  <SelectItem key={child.id} value={child.id}>{child.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedSubject} onValueChange={setSelectedSubject}>
              <SelectTrigger>
                <SelectValue placeholder="All Subjects" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Subjects</SelectItem>
                {subjects.map(subject => (
                  <SelectItem key={subject} value={subject} className="capitalize">{subject}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-4">
        {isLoading ? (
           <Card className="text-center py-12"><p>Loading history...</p></Card>
        ) : filteredQuestions.length === 0 ? (
          <Card className="text-center py-12">
            <BookCopy className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Practice History Found</h3>
            <p className="text-gray-500">Complete some practice questions to see them here.</p>
          </Card>
        ) : (
          filteredQuestions.map(q => (
            <Card key={q.id} className="shadow-md border-0 bg-white/90 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center gap-2 mb-3 flex-wrap">
                  <Badge variant="secondary" className="capitalize">{q.subject}</Badge>
                  <Badge variant="outline">{q.skill_area}</Badge>
                  <span className="text-xs text-gray-500 ml-auto">{format(new Date(q.created_date), "MMM d, yyyy")}</span>
                </div>
                <p className="font-semibold text-gray-800 mb-4">{q.question}</p>
                <div className="space-y-2 text-sm">
                  <div className={`flex items-start gap-2 p-3 rounded-md ${q.answer_correct ? 'bg-green-50' : 'bg-red-50'}`}>
                    {q.answer_correct ? <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" /> : <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />}
                    <div>
                      <span className="font-medium text-gray-700">Your Answer: </span>
                      <span className={q.answer_correct ? 'text-green-800' : 'text-red-800'}>{q.child_answer}</span>
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3 rounded-md bg-gray-50">
                    <Check className="w-4 h-4 text-gray-600 mt-0.5 flex-shrink-0" />
                    <div>
                      <span className="font-medium text-gray-700">Correct Answer: </span>
                      <span className="text-gray-800">{q.correct_answer}</span>
                    </div>
                  </div>
                  {q.explanation && (
                    <div className="flex items-start gap-2 p-3 rounded-md bg-blue-50 border border-blue-100">
                      <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <div>
                        <span className="font-medium text-blue-700">Explanation: </span>
                        <span className="text-gray-800">{q.explanation}</span>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}