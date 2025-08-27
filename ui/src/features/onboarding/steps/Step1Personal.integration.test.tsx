import { screen, fireEvent, waitFor } from '@testing-library/react';
import { renderWithProviders } from '../../../tests/utils';
import { Step1Personal } from './Step1Personal';
import { OnboardingStore } from '../store';

import { vi } from 'vitest';

// Mock the OnboardingStore to avoid actual localStorage calls in tests
vi.mock('../store', () => ({
  OnboardingStore: {
    saveStep1: vi.fn(),
    getStep1: vi.fn(),
  },
}));

const mockOnboardingStore = OnboardingStore;

// We'll use the default renderWithProviders which gives us "anonymous" user
// This is fine for testing the component behavior

describe('Step1Personal Integration - Happy Path', () => {
  const mockOnNext = vi.fn();
  const mockOnBack = vi.fn();
  const userId = 'anonymous'; // The default user ID from UserContext

  beforeEach(() => {
    vi.clearAllMocks();
    // Clear any localStorage that might exist
    localStorage.clear();
    // Reset the mock functions
    (mockOnboardingStore.getStep1 as any) = vi.fn().mockReturnValue(undefined);
  });

  it('should complete the full form flow successfully', async () => {
    renderWithProviders(
      <Step1Personal
        onNext={mockOnNext}
        onBack={mockOnBack}
        initialData={{}}
      />
    );

    // 1. Fill out the form with valid data
    // Select metric units (already selected by default)
    // The metric button should already be active
    
    // Fill in height (metric)
    fireEvent.change(screen.getByLabelText('Height (cm)'), {
      target: { value: '175' }
    });
    fireEvent.blur(screen.getByLabelText('Height (cm)'));
    
    // Fill in weight (metric)
    fireEvent.change(screen.getByLabelText('Weight (kg)'), {
      target: { value: '70' }
    });
    fireEvent.blur(screen.getByLabelText('Weight (kg)'));
    
    // Fill in date of birth
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '1990-01-01' }
    });
    fireEvent.blur(screen.getByLabelText('Date of birth'));
    
    // Select gender
    fireEvent.click(screen.getByLabelText('Male'));
    
    // Select activity level (moderate is already selected by default)
    
    // Fill in timezone and language (these should have defaults)
    // The form should auto-populate these

    // 2. Submit the form
    const submitButton = screen.getByRole('button', { name: 'Next' });
    expect(submitButton).toBeEnabled();
    
    fireEvent.click(submitButton);

    // 3. Verify the form was submitted successfully
    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledTimes(1);
    });

    // 4. Verify the success message appears
    expect(screen.getByText('Your personal information has been saved successfully!')).toBeInTheDocument();

    // 5. Verify the data was saved to the store
    expect(mockOnboardingStore.saveStep1).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({
        unitSystem: 'metric',
        heightRaw: 175,
        weightRaw: 70,
        dateOfBirth: '1990-01-01',
        gender: 'male',
        activityLevel: 'moderate',
        heightUnit: 'cm',
        weightUnit: 'kg',
      })
    );

    // 6. Verify the onNext callback received the processed data
    const submittedData = mockOnNext.mock.calls[0][0];
    expect(submittedData).toEqual(
      expect.objectContaining({
        unitSystem: 'metric',
        heightRaw: 175,
        weightRaw: 70,
        dateOfBirth: '1990-01-01',
        gender: 'male',
        activityLevel: 'moderate',
        heightUnit: 'cm',
        weightUnit: 'kg',
      })
    );
  });

  it('should handle imperial units correctly', async () => {
    renderWithProviders(
      <Step1Personal
        onNext={mockOnNext}
        onBack={mockOnBack}
        initialData={{}}
      />
    );

    // Switch to imperial units
    fireEvent.click(screen.getByRole('button', { name: 'Imperial' }));
    
    // Fill in imperial height
    fireEvent.change(screen.getByLabelText('Height (ft)'), {
      target: { value: '5' }
    });
    fireEvent.blur(screen.getByLabelText('Height (ft)'));
    fireEvent.change(screen.getByLabelText('Height (in)'), {
      target: { value: '9' }
    });
    fireEvent.blur(screen.getByLabelText('Height (in)'));
    
    // Fill in imperial weight
    fireEvent.change(screen.getByLabelText('Weight (lb)'), {
      target: { value: '154' }
    });
    fireEvent.blur(screen.getByLabelText('Weight (lb)'));
    
    // Fill in other required fields
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '1990-01-01' }
    });
    fireEvent.click(screen.getByLabelText('Female'));
    // Click on the Light activity level radio button
    fireEvent.click(screen.getByDisplayValue('light'));
    
    // Submit
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // Verify imperial data was processed correctly
    await waitFor(() => {
      expect(mockOnNext).toHaveBeenCalledWith(
        expect.objectContaining({
          unitSystem: 'imperial',
          heightFtRaw: 5,
          heightInRaw: 9,
          weightRaw: 154,
          heightUnit: 'ft_in',
          weightUnit: 'lb',
        })
      );
    });
  });

  it('should show validation errors for unrealistic values', async () => {
    renderWithProviders(
      <Step1Personal
        onNext={mockOnNext}
        onBack={mockOnBack}
        initialData={{}}
      />
    );

    // Fill in unrealistic values
        fireEvent.change(screen.getByLabelText('Height (cm)'), {
      target: { value: '1830' } // 18.3 meters - unrealistic
    });
    fireEvent.blur(screen.getByLabelText('Height (cm)'));

    fireEvent.change(screen.getByLabelText('Weight (kg)'), {
      target: { value: '900' } // 900kg - unrealistic
    });
    fireEvent.blur(screen.getByLabelText('Weight (kg)'));
    
    // Fill in other required fields
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '1990-01-01' }
    });
    fireEvent.click(screen.getByLabelText('Male'));
    
    // Try to submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // Verify validation errors appear
    await waitFor(() => {
      expect(screen.getByText('Height must be between 100 and 230 cm')).toBeInTheDocument();
      expect(screen.getByText('Weight must be between 20 and 500 kg')).toBeInTheDocument();
    });

    // Verify the form was not submitted
    expect(mockOnNext).not.toHaveBeenCalled();
  });

  it('should show validation errors for imperial units with unrealistic values', async () => {
    renderWithProviders(
      <Step1Personal
        onNext={mockOnNext}
        onBack={mockOnBack}
        initialData={{}}
      />
    );

    // Switch to imperial units
    fireEvent.click(screen.getByRole('button', { name: 'Imperial' }));
    
    // Fill in unrealistic imperial values
    fireEvent.change(screen.getByLabelText('Height (ft)'), {
      target: { value: '15' } // 15 feet - unrealistic
    });
    fireEvent.blur(screen.getByLabelText('Height (ft)'));
    
    fireEvent.change(screen.getByLabelText('Weight (lb)'), {
      target: { value: '1200' } // 1200 lbs - unrealistic
    });
    fireEvent.blur(screen.getByLabelText('Weight (lb)'));
    
    // Fill in other required fields
    fireEvent.change(screen.getByLabelText('Date of birth'), {
      target: { value: '1990-01-01' }
    });
    fireEvent.click(screen.getByLabelText('Female'));
    
    // Try to submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Next' }));

    // Verify validation errors appear
    await waitFor(() => {
      expect(screen.getByText('Height must be between 1 and 10 ft')).toBeInTheDocument();
      expect(screen.getByText('Weight must be between 20 and 500 kg')).toBeInTheDocument();
    });

    // Verify the form was not submitted
    expect(mockOnNext).not.toHaveBeenCalled();
  });
});
