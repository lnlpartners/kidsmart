import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { X, User, Save } from "lucide-react";

export default function AddChildForm({ child, onSubmit, onCancel }) {
  const [formData, setFormData] = useState({
    name: child?.name || "",
    age: child?.age?.toString() || "",
    grade_level: child?.grade_level || "",
    language: child?.language || "english",
    subjects: child?.subjects || []
  });

  const subjects = [
    "math", "english", "science", "history", 
    "reading", "writing", "spelling", "art", "music"
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.age || !formData.grade_level) return;
    
    onSubmit({
      ...formData,
      age: parseInt(formData.age)
    });
  };

  const handleSubjectChange = (subject, checked) => {
    setFormData(prev => ({
      ...prev,
      subjects: checked 
        ? [...prev.subjects, subject]
        : prev.subjects.filter(s => s !== subject)
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Child's Name *</Label>
          <Input
            id="name"
            placeholder="Enter child's full name"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            min="3"
            max="18"
            placeholder="Enter age"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="grade">Grade Level *</Label>
          <Select value={formData.grade_level} onValueChange={(value) => setFormData({...formData, grade_level: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select grade level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="K">Kindergarten</SelectItem>
              <SelectItem value="1">1st Grade</SelectItem>
              <SelectItem value="2">2nd Grade</SelectItem>
              <SelectItem value="3">3rd Grade</SelectItem>
              <SelectItem value="4">4th Grade</SelectItem>
              <SelectItem value="5">5th Grade</SelectItem>
              <SelectItem value="6">6th Grade</SelectItem>
              <SelectItem value="7">7th Grade</SelectItem>
              <SelectItem value="8">8th Grade</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="language">Primary Language</Label>
          <Select value={formData.language} onValueChange={(value) => setFormData({...formData, language: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="english">English</SelectItem>
              <SelectItem value="spanish">Spanish</SelectItem>
              <SelectItem value="french">French</SelectItem>
              <SelectItem value="german">German</SelectItem>
              <SelectItem value="chinese">Chinese</SelectItem>
              <SelectItem value="japanese">Japanese</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-3">
        <Label>Subjects (Optional)</Label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {subjects.map((subject) => (
            <div key={subject} className="flex items-center space-x-2">
              <Checkbox
                id={subject}
                checked={formData.subjects.includes(subject)}
                onCheckedChange={(checked) => handleSubjectChange(subject, checked)}
              />
              <Label htmlFor={subject} className="text-sm capitalize cursor-pointer">
                {subject}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
        >
          <X className="w-4 h-4 mr-2" />
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
        >
          {child ? <Save className="w-4 h-4 mr-2" /> : <User className="w-4 h-4 mr-2" />}
          {child ? 'Update Child' : 'Add Child'}
        </Button>
      </div>
    </form>
  );
}