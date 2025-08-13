// Mock functions for standalone app
import { getAssignments, saveAssignments } from './localStorage';

export const cleanupOldAssignments = async () => {
  try {
    const assignments = getAssignments();
    
    // Keep only the 10 most recent assignments
    const sortedAssignments = assignments.sort((a, b) => 
      new Date(b.created_date) - new Date(a.created_date)
    );
    
    const recentAssignments = sortedAssignments.slice(0, 10);
    const deletedCount = assignments.length - recentAssignments.length;
    
    saveAssignments(recentAssignments);
    
    return {
      success: true,
      message: `Successfully cleaned up ${deletedCount} old assignments. Kept the 10 most recent.`,
      deleted_count: deletedCount,
      remaining_count: recentAssignments.length
    };
  } catch (error) {
    return {
      success: false,
      message: `Cleanup failed: ${error.message}`
    };
  }
};

export const visionProxy = async ({ image_url, prompt }) => {
  // Mock vision analysis
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    analysis: `Mock vision analysis of image: ${image_url}. Prompt: ${prompt}`,
    confidence: 0.85,
    status: 'success'
  };
};