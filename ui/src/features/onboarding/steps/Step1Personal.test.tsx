import { screen } from '@testing-library/react';
import { Step1Personal } from './Step1Personal';
import { MemoryRouter } from 'react-router';
import { vi } from 'vitest';
import { renderWithProviders } from '../../../tests/utils';

// Mock the onboarding store
vi.mock('../store', () => ({
  OnboardingStore: {
    getStep1: vi.fn(() => null),
    saveStep1: vi.fn(),
  },
}));

const mockOnNext = vi.fn();
const mockOnBack = vi.fn();

describe('Step1Personal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the title and subtitle', () => {
    renderWithProviders(
      <MemoryRouter>
        <Step1Personal onNext={mockOnNext} onBack={mockOnBack} />
      </MemoryRouter>
    );

    expect(screen.getByText('Personal info')).toBeInTheDocument();
    expect(screen.getByText(/We'll use this to tailor training targets/)).toBeInTheDocument();
  });

  it('renders the units toggle', () => {
    renderWithProviders(
      <MemoryRouter>
        <Step1Personal onNext={mockOnNext} onBack={mockOnBack} />
      </MemoryRouter>
    );

    expect(screen.getByText('Units')).toBeInTheDocument();
    expect(screen.getByText('Metric')).toBeInTheDocument();
    expect(screen.getByText('Imperial')).toBeInTheDocument();
  });

  it('renders all required form fields', () => {
    renderWithProviders(
      <MemoryRouter>
        <Step1Personal onNext={mockOnNext} onBack={mockOnBack} />
      </MemoryRouter>
    );

    expect(screen.getByText('Height')).toBeInTheDocument();
    expect(screen.getByText('Weight (kg)')).toBeInTheDocument();
    expect(screen.getByText('Date of birth')).toBeInTheDocument();
    expect(screen.getByText('Gender')).toBeInTheDocument();
    expect(screen.getByText('Activity level')).toBeInTheDocument();
  });

  it('renders the next button', () => {
    renderWithProviders(
      <MemoryRouter>
        <Step1Personal onNext={mockOnNext} onBack={mockOnBack} />
      </MemoryRouter>
    );

    expect(screen.getByText('Next')).toBeInTheDocument();
  });

  it('renders the back button when onBack is provided', () => {
    renderWithProviders(
      <MemoryRouter>
        <Step1Personal onNext={mockOnNext} onBack={mockOnBack} />
      </MemoryRouter>
    );

    expect(screen.getByText('Back')).toBeInTheDocument();
  });
});
