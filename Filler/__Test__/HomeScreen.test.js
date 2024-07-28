import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../app/HomeScreen';

jest.mock('../lib/supabase', () => ({
  supabase: {
    rpc: jest.fn(() => Promise.resolve({ data: { choices: [{ message: { content: 'Yes' } }] } })),
  },
}));

test('renders correctly', () => {
  const { getByText, getByPlaceholderText } = render(<HomeScreen />);

  // Check if navigation buttons are rendered
  expect(getByText('Go to News')).toBeTruthy();
  expect(getByText('Go to Login')).toBeTruthy();
  expect(getByText('Go to upload trash screen')).toBeTruthy();
  expect(getByText('Go to virtual pet screen')).toBeTruthy();

  // Check if input field and generate button are rendered
  expect(getByPlaceholderText('Enter the trash. NOW.')).toBeTruthy();
  expect(getByText('Generate tips')).toBeTruthy();
});

test('handles input and button press', async () => {
  const { getByPlaceholderText, getByText, findByText } = render(<HomeScreen />);
  const inputField = getByPlaceholderText('Enter the trash. NOW.');
  const generateButton = getByText('Generate tips');

  // Simulate entering text
  fireEvent.changeText(inputField, 'plastic bottle');
  expect(inputField.props.value).toBe('plastic bottle');

  // Simulate button press
  fireEvent.press(generateButton);

  // Mocked supabase response should trigger the setting of the response state
  const responseText = await findByText('Yes');
  expect(responseText).toBeTruthy();
});
