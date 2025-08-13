// Mock integrations for standalone app
import { generateId } from './localStorage';

// Simulate file upload
export const UploadFile = async ({ file }) => {
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Create a mock file URL (in a real app, this would be uploaded to a server)
  const mockUrl = `https://example.com/uploads/${generateId()}_${file.name}`;
  
  return {
    file_url: mockUrl,
    status: 'success'
  };
};

// Simulate data extraction from uploaded files
export const ExtractDataFromUploadedFile = async ({ file_url, json_schema }) => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock extracted data based on the file
  const mockExtractedData = {
    extracted_text: `Sample homework content extracted from ${file_url}. This includes various math problems and questions that need to be graded.`,
    questions: [
      {
        question_number: 1,
        question_text: "What is 5 + 3?",
        options: [],
        student_answer: "8",
        correct_answer: "8"
      },
      {
        question_number: 2,
        question_text: "What is 12 - 7?",
        options: [],
        student_answer: "6", 
        correct_answer: "5"
      }
    ]
  };
  
  return {
    status: 'success',
    output: mockExtractedData
  };
};

// Simulate LLM invocation for grading and analysis
export const InvokeLLM = async ({ prompt, response_json_schema }) => {
  // Simulate AI processing delay
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Mock AI response based on the prompt content
  if (prompt.includes('grading homework')) {
    return {
      total_questions: 10,
      correct_answers: 8,
      score_percentage: 80,
      detailed_feedback: "Great work on most problems! Focus on subtraction with borrowing for improvement.",
      strengths: ["Addition", "Number recognition", "Following instructions"],
      weaknesses: ["Subtraction with borrowing", "Word problems"],
      skill_areas_to_practice: ["Subtraction", "Reading comprehension"],
      question_analysis: [
        {
          question_number: 1,
          question_text: "5 + 3 = ?",
          student_answer: "8",
          correct_answer: "8",
          is_correct: true,
          explanation: "Correct addition"
        },
        {
          question_number: 2,
          question_text: "12 - 7 = ?",
          student_answer: "6",
          correct_answer: "5", 
          is_correct: false,
          explanation: "Remember to count backwards carefully"
        }
      ]
    };
  }
  
  // Mock practice question generation
  if (prompt.includes('practice question')) {
    return {
      question: "What is 15 - 8?",
      question_type: "multiple_choice",
      options: ["6", "7", "8", "9"],
      correct_answer: "7",
      explanation: "Count backwards from 15: 15 - 8 = 7",
      difficulty_level: "medium"
    };
  }
  
  // Default mock response
  return {
    response: "Mock AI response generated successfully"
  };
};

// Mock other integrations
export const Core = {
  InvokeLLM,
  SendEmail: async ({ to, subject, body }) => {
    console.log('Mock email sent:', { to, subject, body });
    return { status: 'success' };
  },
  GenerateImage: async ({ prompt }) => {
    return { 
      image_url: `https://via.placeholder.com/400x300?text=${encodeURIComponent(prompt)}`,
      status: 'success' 
    };
  }
};