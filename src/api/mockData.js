// Mock data for standalone app
export const mockChildren = [
  {
    id: '1',
    name: 'Emma Johnson',
    age: 8,
    grade_level: '3',
    language: 'english',
    subjects: ['math', 'reading', 'science'],
    created_date: '2024-01-15T10:00:00Z'
  },
  {
    id: '2', 
    name: 'Liam Smith',
    age: 10,
    grade_level: '5',
    language: 'english',
    subjects: ['math', 'english', 'history'],
    created_date: '2024-01-20T14:30:00Z'
  }
];

export const mockAssignments = [
  {
    id: '1',
    child_id: '1',
    title: 'Emma - Math - Dec 15',
    subject: 'math',
    grade_level: '3',
    total_questions: 10,
    correct_answers: 8,
    score_percentage: 80,
    strengths: ['Addition', 'Number recognition', 'Problem solving'],
    weaknesses: ['Subtraction with borrowing', 'Word problems'],
    skill_areas_to_practice: ['Subtraction', 'Reading comprehension'],
    detailed_feedback: 'Great work on addition problems! Focus on subtraction with borrowing for improvement.',
    status: 'graded',
    created_date: '2024-12-15T09:00:00Z',
    original_file_url: 'https://example.com/homework1.jpg',
    question_analysis: [
      {
        question_number: 1,
        question_text: '5 + 3 = ?',
        student_answer: '8',
        correct_answer: '8',
        is_correct: true,
        skill_area: 'Addition',
        question_type: 'fill_blank',
        step_by_step_solution: 'Count 5, then add 3 more: 5 + 3 = 8'
      },
      {
        question_number: 2,
        question_text: '12 - 7 = ?',
        student_answer: '6',
        correct_answer: '5',
        is_correct: false,
        skill_area: 'Subtraction',
        question_type: 'fill_blank',
        step_by_step_solution: 'Start with 12, subtract 7: 12 - 7 = 5'
      }
    ]
  },
  {
    id: '2',
    child_id: '2',
    title: 'Liam - English - Dec 14',
    subject: 'english',
    grade_level: '5',
    total_questions: 8,
    correct_answers: 7,
    score_percentage: 88,
    strengths: ['Grammar', 'Vocabulary', 'Reading comprehension'],
    weaknesses: ['Spelling'],
    skill_areas_to_practice: ['Spelling rules'],
    detailed_feedback: 'Excellent grammar and vocabulary skills! Work on spelling patterns.',
    status: 'graded',
    created_date: '2024-12-14T11:30:00Z',
    original_file_url: 'https://example.com/homework2.jpg',
    question_analysis: []
  }
];

export const mockPracticeQuestions = [
  {
    id: '1',
    child_id: '1',
    assignment_id: '1',
    subject: 'math',
    skill_area: 'Subtraction',
    question_type: 'multiple_choice',
    question: 'What is 15 - 8?',
    options: ['6', '7', '8', '9'],
    correct_answer: '7',
    explanation: 'Count backwards from 15: 15 - 8 = 7',
    difficulty_level: 'medium',
    completed: false,
    created_date: '2024-12-15T10:00:00Z'
  },
  {
    id: '2',
    child_id: '2',
    assignment_id: '2',
    subject: 'english',
    skill_area: 'Spelling rules',
    question_type: 'fill_blank',
    question: 'Complete the word: beau____ul',
    options: [],
    correct_answer: 'tif',
    explanation: 'The word is "beautiful" - remember the "ti" makes the "ti" sound.',
    difficulty_level: 'medium',
    completed: false,
    created_date: '2024-12-14T12:00:00Z'
  }
];

export const mockTutors = [
  {
    id: '1',
    name: 'Sarah Johnson',
    bio: 'Experienced elementary math tutor with 8 years of teaching experience. Specializes in making math fun and accessible for young learners.',
    subjects: ['math', 'science'],
    hourly_rate: 35,
    rating: 4.9,
    is_verified: true,
    contact_email: 'sarah.johnson@email.com',
    avatar_url: 'https://images.pexels.com/photos/3769021/pexels-photo-3769021.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '2',
    name: 'Michael Chen',
    bio: 'Certified teacher with expertise in English and reading comprehension. Passionate about helping students develop strong literacy skills.',
    subjects: ['english', 'reading', 'writing'],
    hourly_rate: 40,
    rating: 4.8,
    is_verified: true,
    contact_email: 'michael.chen@email.com',
    avatar_url: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    bio: 'Science educator with a focus on hands-on learning. Makes complex concepts simple and engaging for elementary students.',
    subjects: ['science', 'math'],
    hourly_rate: 38,
    rating: 4.7,
    is_verified: true,
    contact_email: 'emily.rodriguez@email.com',
    avatar_url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
  }
];

export const mockUser = {
  id: '1',
  email: 'parent@example.com',
  full_name: 'John Parent',
  username: 'johnparent',
  subscription_plan: 'free',
  email_notifications: true,
  push_notifications: true,
  auto_save_homework: true
};