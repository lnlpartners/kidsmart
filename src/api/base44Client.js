import { createClient } from '@base44/sdk';
// import { getAccessToken } from '@base44/sdk/utils/auth-utils';

// Create a client with authentication required
export const base44 = createClient({
  appId: "6881636cc7f15b9f5fe64b5a", 
  requiresAuth: true // Ensure authentication is required for all operations
});
