import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';

// Mock progress tracking hook to avoid Firebase imports during tests
jest.mock('../hooks/useProgressTracking', () => ({
  useProgressTracking: () => ({ awardXP: jest.fn() })
}));

import FillBlankBlock from '../components/ContentBlocks/FillBlankBlock';

describe('Quiz/FillBlank inputs do not trigger scroll on typing', () => {
  beforeEach(() => {
    window.scrollTo = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('typing 20 chars in fill-in-the-blank input does not call scrollTo', () => {
    render(
      <FillBlankBlock
        content={{ text: 'Type here: {{answer|hint}} to verify no scroll.' }}
        config={{ instantFeedback: true }}
      />
    );

    const input = screen.getByRole('textbox');

    for (let i = 0; i < 20; i++) {
      fireEvent.change(input, { target: { value: 'x'.repeat(i + 1) } });
    }

    expect(window.scrollTo).not.toHaveBeenCalled();
  });
});


