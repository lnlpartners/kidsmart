// Local storage utilities for standalone app
const STORAGE_KEYS = {
  CHILDREN: 'homework_app_children',
  ASSIGNMENTS: 'homework_app_assignments', 
  PRACTICE_QUESTIONS: 'homework_app_practice_questions',
  USER: 'homework_app_user',
  TUTORS: 'homework_app_tutors'
};

// Generic storage functions
export const getFromStorage = (key, defaultValue = []) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for key ${key}:`, error);
    return defaultValue;
  }
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
    return true;
  } catch (error) {
    console.error(`Error saving to localStorage for key ${key}:`, error);
    return false;
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage for key ${key}:`, error);
    return false;
  }
};

// Generate unique IDs
export const generateId = () => {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

// Specific storage functions
export const getChildren = () => getFromStorage(STORAGE_KEYS.CHILDREN, []);
export const saveChildren = (children) => saveToStorage(STORAGE_KEYS.CHILDREN, children);

export const getAssignments = () => getFromStorage(STORAGE_KEYS.ASSIGNMENTS, []);
export const saveAssignments = (assignments) => saveToStorage(STORAGE_KEYS.ASSIGNMENTS, assignments);

export const getPracticeQuestions = () => getFromStorage(STORAGE_KEYS.PRACTICE_QUESTIONS, []);
export const savePracticeQuestions = (questions) => saveToStorage(STORAGE_KEYS.PRACTICE_QUESTIONS, questions);

export const getUser = () => getFromStorage(STORAGE_KEYS.USER, null);
export const saveUser = (user) => saveToStorage(STORAGE_KEYS.USER, user);

export const getTutors = () => getFromStorage(STORAGE_KEYS.TUTORS, []);
export const saveTutors = (tutors) => saveToStorage(STORAGE_KEYS.TUTORS, tutors);

// Initialize storage with mock data if empty
export const initializeStorage = () => {
  const { mockChildren, mockAssignments, mockPracticeQuestions, mockTutors, mockUser } = require('./mockData');
  
  if (getChildren().length === 0) {
    saveChildren(mockChildren);
  }
  
  if (getAssignments().length === 0) {
    saveAssignments(mockAssignments);
  }
  
  if (getPracticeQuestions().length === 0) {
    savePracticeQuestions(mockPracticeQuestions);
  }
  
  if (getTutors().length === 0) {
    saveTutors(mockTutors);
  }
  
  if (!getUser()) {
    saveUser(mockUser);
  }
};