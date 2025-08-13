# Smart Homework - Standalone App

A standalone homework grading and practice application with AI-powered analysis.

## Features

- Upload homework photos for AI grading
- Track multiple children's progress
- Generate practice questions based on weaknesses
- View detailed analytics and progress reports
- Find tutors for additional help

## Running the app

```bash
npm install
npm run dev
```

## Building the app

```bash
npm run build
```

## Technology Stack

- React 18 with Vite
- Tailwind CSS for styling
- Shadcn/ui components
- Local storage for data persistence
- Mock AI integrations for demonstration

## Data Storage

This standalone version uses browser localStorage to persist data. In a production environment, you would replace the mock integrations in `src/api/integrations.js` with real API calls to your backend services.

## Customization

- Replace mock data in `src/api/mockData.js` with your own sample data
- Update the AI integrations in `src/api/integrations.js` to connect to real services
- Modify the entity classes in `src/api/entities.js` to work with your backend API
- Customize the UI components and styling as needed