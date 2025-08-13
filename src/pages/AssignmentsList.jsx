import React, { useState, useEffect } from "react";
import { Assignment } from "@/api/entities";
import { Child } from "@/api/entities";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, FileText, Search, Filter, Star, CheckCircle, AlertCircle } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { createPageUrl } from "@/utils";
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

export default function AssignmentsListPage() {
  const navigate = useNavigate();
  const [assignments, setAssignments] = useState([]);
  const [children, setChildren] = useState([]);
  const [filteredAssignments, setFilteredAssignments] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChild, setSelectedChild] = useState("all");
  const [selectedSubject, setSelectedSubject] = useState("all");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  useEffect(() => {
    filterAssignments();
  }, [assignments, searchTerm, selectedChild, selectedSubject]);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [assignmentsData, childrenData] = await Promise.all([
        Assignment.list('-created_date'),
        Child.list()
      ]);
      setAssignments(assignmentsData);
      setChildren(childrenData);
    } catch (error) {
      console.error("Error loading data:", error);
    }
    setIsLoading(false);
  };

  const filterAssignments = () => {
    let filtered = assignments;

    if (searchTerm) {
      filtered = filtered.filter(a => 
        a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        a.subject.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedChild !== "all") {
      filtered = filtered.filter(a => a.child_id === selectedChild);
    }

    if (selectedSubject !== "all") {
      filtered = filtered.filter(a => a.subject === selectedSubject);
    }

    setFilteredAssignments(filtered);
  };

  const getScoreIcon = (score) => {
    if (score >= 90) return <Star className="w-4 h-4 text-yellow-500" />;
    if (score >= 70) return <CheckCircle className="w-4 h-4 text-green-500" />;
    return <AlertCircle className="w-4 h-4 text-orange-500" />;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-yellow-600 bg-yellow-50";
    if (score >= 70) return "text-green-600 bg-green-50";
    return "text-orange-600 bg-orange-50";
  };

  const getChildName = (childId) => {
    const child = children.find(c => c.id === childId);
    return child ? child.name : "Unknown";
  };

  const subjects = [...new Set(assignments.map(a => a.subject))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">All Assignments</h1>
            <p className="text-gray-600 mt-1">Review detailed results and progress</p>
          </div>
        </div>

        {/* Filters */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5 text-blue-500" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search assignments..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={selectedChild} onValueChange={setSelectedChild}>
                <SelectTrigger>
                  <SelectValue placeholder="All Children" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Children</SelectItem>
                  {children.map(child => (
                    <SelectItem key={child.id} value={child.id}>
                      {child.name}
                    </SelectItem>
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
                    <SelectItem key={subject} value={subject} className="capitalize">
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle>
              {filteredAssignments.length} Assignment{filteredAssignments.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-4">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-40"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </div>
                    <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  </div>
                ))}
              </div>
            ) : filteredAssignments.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No assignments found</h3>
                <p className="text-gray-500">Try adjusting your search or filters</p>
              </div>
            ) : (
              <div className="space-y-3">
                {filteredAssignments.map((assignment) => (
                  <Link 
                    key={assignment.id} 
                    to={createPageUrl(`AssignmentDetails?id=${assignment.id}`)}
                    className="block"
                  >
                    <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer">
                      <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <h4 className="font-semibold text-gray-900 truncate mb-1">
                          {assignment.title}
                        </h4>
                        <div className="flex items-center gap-2 flex-wrap">
                          <Badge 
                            variant="secondary" 
                            className={`${subjectColors[assignment.subject]} border text-xs`}
                          >
                            {assignment.subject}
                          </Badge>
                          <span className="text-xs text-gray-500">
                            {getChildName(assignment.child_id)}
                          </span>
                          <span className="text-xs text-gray-500">•</span>
                          <span className="text-xs text-gray-500">
                            {format(new Date(assignment.created_date), "MMM d, yyyy")}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-3">
                        <div className="text-right text-sm text-gray-600">
                          <div>{assignment.correct_answers}/{assignment.total_questions}</div>
                          <div className="text-xs">questions</div>
                        </div>
                        <div className="flex items-center gap-2">
                          {getScoreIcon(assignment.score_percentage)}
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getScoreColor(assignment.score_percentage)}`}>
                            {assignment.score_percentage}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}