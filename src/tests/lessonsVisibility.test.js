import React from 'react';
import { render, screen } from '@testing-library/react';
import LessonsOverview from '../pages/LessonsOverview';

// Minimal mocks for hooks/services that LessonsOverview might use
jest.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({ user: { uid: 'test', role: 'admin' } })
}));

jest.mock('../services/firestoreService', () => ({
  getLearningPaths: jest.fn().mockResolvedValue([
    {
      id: 'p1',
      title: 'Path 1',
      modules: [
        {
          id: 'm1',
          title: 'Module 1',
          lessons: [
            { id: 'l1', title: 'Draft Lesson', status: 'draft' },
            { id: 'l2', title: 'Published Lesson', status: 'published' },
          ]
        }
      ]
    }
  ])
}));

describe('LessonsOverview visibility', () => {
  test('renders only published lessons', async () => {
    render(<LessonsOverview />);
    expect(await screen.findByText(/Published Lesson/i)).toBeInTheDocument();
    expect(screen.queryByText(/Draft Lesson/i)).not.toBeInTheDocument();
  });
});


