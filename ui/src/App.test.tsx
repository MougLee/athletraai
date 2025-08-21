import { render, screen } from '@testing-library/react';
import { App } from './App';

test('should render', () => {
  render(<App />);
  const header = screen.getByText('Welcome to Athletra AI!');
  expect(header).toBeInTheDocument();
});
