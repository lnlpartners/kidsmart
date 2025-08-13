import React, { useState, useEffect } from 'react';
import { Tutor } from '@/api/entities';
import { Button } from '@/components/ui/button';
import { ArrowLeft, User, Search, Filter } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { createPageUrl } from '@/utils';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

import TutorCard from '../components/tutors/TutorCard';

const allSubjects = ["math", "english", "science", "history", "reading", "writing", "spelling"];

export default function FindTutorPage() {
  const navigate = useNavigate();
  const [tutors, setTutors] = useState([]);
  const [filteredTutors, setFilteredTutors] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [subjectFilter, setSubjectFilter] = useState("all");

  useEffect(() => {
    loadTutors();
  }, []);

  useEffect(() => {
    let filtered = tutors;

    if (searchTerm) {
      filtered = filtered.filter(tutor =>
        tutor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tutor.bio.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (subjectFilter !== "all") {
      filtered = filtered.filter(tutor => tutor.subjects.includes(subjectFilter));
    }

    setFilteredTutors(filtered);
  }, [searchTerm, subjectFilter, tutors]);

  const loadTutors = async () => {
    setIsLoading(true);
    try {
      const data = await Tutor.list('-rating');
      setTutors(data);
      setFilteredTutors(data);
    } catch (error) {
      console.error("Error loading tutors:", error);
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate(createPageUrl("Dashboard"))}
          >
            <ArrowLeft className="w-4 h-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Find a Tutor</h1>
            <p className="text-gray-600 mt-1">Connect with verified tutors to help your child succeed</p>
          </div>
        </div>

        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5 text-blue-500" />
                    Filter Tutors
                </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input 
                        placeholder="Search by name or keyword..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                        className="pl-10"
                    />
                </div>
                <Select value={subjectFilter} onValueChange={setSubjectFilter}>
                    <SelectTrigger>
                        <SelectValue placeholder="Filter by subject" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">All Subjects</SelectItem>
                        {allSubjects.map(subject => (
                            <SelectItem key={subject} value={subject} className="capitalize">{subject}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </CardContent>
        </Card>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array(6).fill(0).map((_, i) => <Skeleton key={i} className="h-96 w-full rounded-xl" />)}
          </div>
        ) : filteredTutors.length === 0 ? (
            <div className="text-center py-16">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No tutors found</h3>
                <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTutors.map(tutor => (
              <TutorCard key={tutor.id} tutor={tutor} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}