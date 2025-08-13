import { 
  getChildren, 
  saveChildren, 
  getAssignments, 
  saveAssignments, 
  getPracticeQuestions, 
  savePracticeQuestions,
  getUser,
  saveUser,
  getTutors,
  saveTutors,
  generateId 
} from './localStorage';

// Generic entity class
class Entity {
  constructor(storageKey, getFunction, saveFunction) {
    this.storageKey = storageKey;
    this.getFunction = getFunction;
    this.saveFunction = saveFunction;
  }

  async list(sortBy = '-created_date', limit = null) {
    let items = this.getFunction();
    
    // Sort items
    if (sortBy) {
      const isDescending = sortBy.startsWith('-');
      const field = isDescending ? sortBy.substring(1) : sortBy;
      
      items.sort((a, b) => {
        let aVal = a[field];
        let bVal = b[field];
        
        // Handle date strings
        if (field.includes('date')) {
          aVal = new Date(aVal);
          bVal = new Date(bVal);
        }
        
        if (aVal < bVal) return isDescending ? 1 : -1;
        if (aVal > bVal) return isDescending ? -1 : 1;
        return 0;
      });
    }
    
    // Apply limit
    if (limit) {
      items = items.slice(0, limit);
    }
    
    return items;
  }

  async filter(criteria) {
    const items = this.getFunction();
    return items.filter(item => {
      return Object.keys(criteria).every(key => {
        if (criteria[key] === undefined || criteria[key] === null) return true;
        return item[key] === criteria[key];
      });
    });
  }

  async create(data) {
    const items = this.getFunction();
    const newItem = {
      ...data,
      id: generateId(),
      created_date: new Date().toISOString()
    };
    
    items.push(newItem);
    this.saveFunction(items);
    return newItem;
  }

  async update(id, data) {
    const items = this.getFunction();
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    items[index] = { ...items[index], ...data };
    this.saveFunction(items);
    return items[index];
  }

  async delete(id) {
    const items = this.getFunction();
    const filteredItems = items.filter(item => item.id !== id);
    
    if (filteredItems.length === items.length) {
      throw new Error(`Item with id ${id} not found`);
    }
    
    this.saveFunction(filteredItems);
    return true;
  }
}

// User entity with special methods
class UserEntity {
  async me() {
    return getUser();
  }

  async updateMyUserData(data) {
    const currentUser = getUser();
    const updatedUser = { ...currentUser, ...data };
    saveUser(updatedUser);
    return updatedUser;
  }

  async logout() {
    // In a real app, this would clear auth tokens
    // For now, we'll just simulate logout
    console.log('User logged out');
    return true;
  }
}

// Create entity instances
export const Child = new Entity('children', getChildren, saveChildren);
export const Assignment = new Entity('assignments', getAssignments, saveAssignments);
export const PracticeQuestion = new Entity('practice_questions', getPracticeQuestions, savePracticeQuestions);
export const Tutor = new Entity('tutors', getTutors, saveTutors);
export const User = new UserEntity();