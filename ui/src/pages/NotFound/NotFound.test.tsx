import { screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { NotFound } from './NotFound';
import { renderWithClient } from 'tests';

test('renders text content', () => {
  renderWithClient(
    <MemoryRouter>
      <NotFound />
    </MemoryRouter>
  );
  const header = screen.getByText(/You shouldn't be here for sure :\)/i);
  expect(header).toBeInTheDocument();
});
