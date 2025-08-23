import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Welcome } from './Welcome';
import { renderWithClient } from 'tests';

test('renders text content', () => {
  renderWithClient(
    <MemoryRouter initialEntries={['/login']}>
      <Welcome />
    </MemoryRouter>
  );
  const header = screen.getByText('Welcome to Athletra AI!');
  expect(header).toBeInTheDocument();
});
