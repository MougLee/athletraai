# Profile Preferences Implementation

## Overview

The ProfileDetails page has been enhanced to include user preferences for language, timezone, and units. This implementation provides a clean, user-friendly interface for users to manage their application settings.

## Features

### 1. Language Selection
- **Supported Languages**: English (en) and Slovenian (sl)
- **Display**: Shows language names with flag emojis (🇺🇸 English, 🇸🇮 Slovenščina)
- **Real-time Updates**: Language changes are immediately reflected in the UI
- **Persistence**: Language preference is saved with the user profile

### 2. Timezone Selection
- **Comprehensive List**: Includes 50+ common timezones from around the world
- **User-Friendly Labels**: Each timezone shows its abbreviation (e.g., "London (GMT/BST)")
- **Auto-Detection**: Defaults to the user's browser timezone
- **Global Coverage**: Covers Europe, Americas, Asia, Australia, and Pacific regions

### 3. Units Selection
- **Metric System**: Kilograms (kg), kilometers (km), Celsius (°C)
- **Imperial System**: Pounds (lb), miles (mi), Fahrenheit (°F)
- **Clear Descriptions**: Each option shows what units are included

## Technical Implementation

### Components
- **ProfileDetails**: Main profile form that includes all sections
- **PreferencesSection**: Dedicated component for preferences management
- **Formik Integration**: Uses Formik for form state management and validation

### Data Flow
1. User selects preferences in the UI
2. Form data is validated using Yup schema
3. Data is sent to backend via `usePostUser` mutation
4. User context is updated with new preferences
5. UI reflects changes immediately

### Validation
```typescript
export const validationSchema = Yup.object({
  login: Yup.string().min(3).required(),
  email: Yup.string().email().required(),
  language: Yup.string().oneOf(['en', 'sl']).required(),
  timezone: Yup.string().required(),
  units: Yup.string().oneOf(['metric', 'imperial']).required(),
});
```

### Backend Integration
The backend already supports these fields through the `UpdateUserIN` schema:
- `language?: string`
- `timezone?: string`
- `units?: string` (new field to be implemented on backend)

## User Experience

### Layout
- **Responsive Design**: Uses Bootstrap grid system for mobile-friendly layout
- **Logical Grouping**: Personal information and preferences are clearly separated
- **Help Text**: Each field includes descriptive help text
- **Visual Hierarchy**: Uses appropriate headings and spacing

### Accessibility
- **Label Association**: All form controls are properly labeled with `htmlFor` attributes
- **Screen Reader Support**: Semantic HTML structure for better accessibility
- **Keyboard Navigation**: Full keyboard support for form interactions

## Internationalization

### Translation Support
- **English**: Primary language with full translations
- **Slovenian**: Complete translation support for all new fields
- **Dynamic Language Switching**: UI updates immediately when language changes

### Translation Keys
```json
{
  "profile": {
    "personalInfo": "Personal Information",
    "preferences": "Preferences",
    "language": "Language",
    "timezone": "Timezone",
    "units": "Units",
    "languageHelp": "Select your preferred language for the application",
    "timezoneHelp": "Select your timezone for accurate time display",
    "unitsHelp": "Select your preferred measurement system"
  }
}
```

## Testing

### Test Coverage
- **Component Tests**: Full test coverage for PreferencesSection
- **Integration Tests**: ProfileDetails tests updated to include new fields
- **Validation Tests**: Form submission tests with all new fields
- **Accessibility Tests**: Label association and form control testing

### Test Files
- `PreferencesSection.test.tsx` - Preferences component tests
- `ProfileDetails.test.tsx` - Updated profile form tests

## Future Enhancements

### Backend Support
- **Units Field**: Backend needs to support the new `units` field
- **Validation**: Server-side validation for the new preference fields
- **API Updates**: Ensure all user-related endpoints support the new fields

### Additional Features
- **More Languages**: Expand language support beyond English and Slovenian
- **Custom Timezones**: Allow users to add custom timezone entries
- **Unit Conversions**: Real-time unit conversion display
- **Preference Sync**: Sync preferences across devices

## Usage

### For Users
1. Navigate to Profile page
2. Scroll to the Preferences section
3. Select desired language, timezone, and units
4. Click "Update profile data" to save changes
5. Changes take effect immediately

### For Developers
1. Import `PreferencesSection` component
2. Provide required props (language, timezone, units, onLanguageChange)
3. Ensure Formik context is available
4. Handle language changes through the callback

## Dependencies

- **React Bootstrap**: UI components and layout
- **Formik**: Form state management
- **Yup**: Form validation
- **React i18next**: Internationalization
- **Custom Utilities**: Timezone and units data

## Browser Support

- **Modern Browsers**: Full support for all features
- **Timezone Detection**: Uses `Intl.DateTimeFormat().resolvedOptions().timeZone`
- **Fallback**: Defaults to UTC if timezone detection fails
- **Progressive Enhancement**: Graceful degradation for older browsers
