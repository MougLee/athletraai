import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { renderWithClient } from 'tests';
import { PreferencesSection } from './PreferencesSection';
import { LanguageProvider } from 'contexts/LanguageContext/LanguageContext';
import { Formik, Form } from 'formik';
import * as Yup from 'yup';

const mockOnLanguageChange = vi.fn();

const validationSchema = Yup.object({
  language: Yup.string().required(),
  timezone: Yup.string().required(),
  unitSystem: Yup.string().required(),
});

const renderPreferencesSection = () => {
  return renderWithClient(
    <LanguageProvider>
      <Formik
        initialValues={{
          language: 'en',
          timezone: 'UTC',
          unitSystem: 'metric',
        }}
        validationSchema={validationSchema}
        onSubmit={() => {}}
      >
        <Form>
          <PreferencesSection
            onLanguageChange={mockOnLanguageChange}
          />
        </Form>
      </Formik>
    </LanguageProvider>
  );
};

describe('PreferencesSection', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('renders preferences section with all fields', () => {
    renderPreferencesSection();

    expect(screen.getByText('Preferences')).toBeInTheDocument();
    expect(screen.getByText('Language')).toBeInTheDocument();
    expect(screen.getByText('Timezone')).toBeInTheDocument();
    expect(screen.getByText('Units')).toBeInTheDocument();
  });

  test('displays language options with flags', () => {
    renderPreferencesSection();

    const languageSelect = screen.getByLabelText('Language');
    expect(languageSelect).toBeInTheDocument();
    
    // Check that both English and Slovenian options are available
    expect(languageSelect).toHaveValue('en');
    expect(languageSelect).toHaveTextContent('🇺🇸 English');
    expect(languageSelect).toHaveTextContent('🇸🇮 Slovenščina');
  });

  test('displays timezone options', () => {
    renderPreferencesSection();

    const timezoneSelect = screen.getByLabelText('Timezone');
    expect(timezoneSelect).toBeInTheDocument();
    expect(timezoneSelect).toHaveValue('UTC');
    
    // Check that some common timezones are available
    expect(timezoneSelect).toHaveTextContent('UTC (Coordinated Universal Time)');
    expect(timezoneSelect).toHaveTextContent('London (GMT/BST)');
  });

  test('displays units options', () => {
    renderPreferencesSection();

    const unitsSelect = screen.getByLabelText('Units');
    expect(unitsSelect).toBeInTheDocument();
    expect(unitsSelect).toHaveValue('metric');
    
    // Check that both metric and imperial options are available
    expect(unitsSelect).toHaveTextContent('Metric (kg, km, °C)');
    expect(unitsSelect).toHaveTextContent('Imperial (lb, mi, °F)');
  });

  test('calls onLanguageChange when language is changed', async () => {
    renderPreferencesSection();

    const languageSelect = screen.getByLabelText('Language');
    await userEvent.selectOptions(languageSelect, 'sl');

    expect(mockOnLanguageChange).toHaveBeenCalledWith('sl');
  });

  test('displays help text for each field', () => {
    renderPreferencesSection();

    // Use more flexible text matching since the language might change
    expect(screen.getByText(/Select your preferred language|Izberite želeni jezik/)).toBeInTheDocument();
    expect(screen.getByText(/Select your timezone|Izberite vaš časovni pas/)).toBeInTheDocument();
    expect(screen.getByText(/Select your preferred measurement system|Izberite želeni sistem mer/)).toBeInTheDocument();
  });
});
