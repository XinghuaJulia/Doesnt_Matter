import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import NewsCard from '../components/NewsCard'; // Adjust the path as necessary
import { Linking, Alert } from 'react-native';
import { supabase } from '../lib/supabase';

// Mock the dependencies
jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: jest.fn(),
}));
jest.mock('../lib/supabase', () => ({
  supabase: {
    from: jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn(() => ({
        data: { points: 10, last_activity: new Date(), points_week: 5 },
        error: null,
        status: 200,
      })),
      upsert: jest.fn(),
    })),
  },
}));
jest.mock('react-native/Libraries/Alert/Alert', () => ({
  alert: jest.fn(),
}));

describe('NewsCard Component', () => {
  const mockItem = {
    title: 'Test News Title',
    source: { name: 'Test Source' },
    urlToImage: 'https://example.com/image.jpg',
    url: 'https://example.com',
    publishedAt: '2024-07-29T12:00:00Z',
  };

  const mockSession = {
    user: {
      id: 'test-user-id',
    },
  };

  // it('renders correctly with provided data', () => {
  //   const { getByText, getByTestId } = render(
  //     <NewsCard item={mockItem} session={mockSession} />
  //   );

  //   expect(getByText('Test News Title')).toBeTruthy();
  //   expect(getByText('Test Source')).toBeTruthy();
  //   // Adjust if there's an image alt text or test ID
  //   // expect(getByTestId('news-image')).toBeTruthy();
  // });

  it('handles press event correctly', () => {
    const { getByText } = render(<NewsCard item={mockItem} session={mockSession} />);
    const touchable = getByText('Test News Title');

    fireEvent.press(touchable);

    expect(supabase.from).toHaveBeenCalledWith('profiles');
    expect(Linking.openURL).toHaveBeenCalledWith('https://example.com');
  });
});
