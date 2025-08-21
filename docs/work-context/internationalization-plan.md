# Internationalization (i18n) Implementation Plan

## Overview
This document outlines the comprehensive plan for implementing internationalization (i18n) support for both Slovene (sl) and English (en) languages in the AthletraAI project.

## Goals
- Support two languages: Slovene (sl) and English (en)
- Provide seamless language switching in the UI
- Localize backend error messages and email templates
- Maintain consistent user experience across languages
- Enable easy addition of more languages in the future

## Frontend (UI) Internationalization

### Technology Stack
- **Primary**: react-i18next with i18next
- **Language Detection**: i18next-browser-languagedetector
- **Backend Integration**: i18next-http-backend
- **TypeScript Support**: @types/i18next

### Implementation Steps

#### 1. Install Dependencies
```bash
yarn add react-i18next i18next i18next-browser-languagedetector i18next-http-backend
yarn add -D @types/i18next
```

#### 2. Create Translation Files Structure
```
ui/src/
├── locales/
│   ├── en/
│   │   ├── common.json          # Navigation, buttons, general UI
│   │   ├── auth.json            # Login, register, password forms
│   │   ├── profile.json         # Profile management, settings
│   │   ├── validation.json      # Form validation messages
│   │   ├── errors.json          # Error messages
│   │   └── fitness.json         # Fitness-related terminology
│   └── sl/
│       ├── common.json
│       ├── auth.json
│       ├── profile.json
│       ├── validation.json
│       ├── errors.json
│       └── fitness.json
```

#### 3. Configure i18next
Create `ui/src/i18n.ts` with:
- Language detection (browser locale, user preference)
- Fallback to English
- Pluralization rules for Slovene
- Date/number formatting
- Namespace management

#### 4. Update App.tsx
- Wrap app with `I18nextProvider`
- Add language context provider
- Implement language switching functionality

#### 5. Create Language Context
- `LanguageContext` for managing current language
- Language switching functions
- Persist language preference in localStorage
- Sync with backend user preference

#### 6. Update Components
- Replace hardcoded strings with translation keys
- Use `useTranslation` hook throughout components
- Implement dynamic language switching
- Add language selector in Top.tsx navigation

### Language Switching UI
- Add language selector in top navigation
- Use flags/icons for visual language identification
- Implement dropdown or toggle button
- Show current language prominently

### Translation Management
- Use descriptive, hierarchical translation keys
- Implement pluralization for Slovene (complex plural forms)
- Handle RTL/LTR considerations if needed
- Maintain consistent terminology across languages

## Backend Internationalization

### Current Internationalization Requirements

#### 1. Error Messages (Currently Hardcoded in English)
```scala
// From UserService.scala
private val LoginAlreadyUsed = "Login already in use!"
private val EmailAlreadyUsed = "E-mail already in use!"
private val IncorrectLoginOrPassword = "Incorrect login/email or password"

// From validation functions
"Login is too short!"
"Invalid e-mail format!"
"Password cannot be empty!"
```

#### 2. Email Templates (Currently Only in English)
- Registration confirmation
- Password reset
- Password change notification
- Profile details change notification

#### 3. Validation Messages
- Frontend validation (Yup schemas) are in English
- Backend validation error messages

### Backend Implementation Options

#### Option 1: Accept-Language Header Approach (Recommended)
- Modify `Http.scala` to extract `Accept-Language` header
- Create language context that flows through services
- Implement message bundles for both languages
- Return localized error messages based on user's language preference

#### Option 2: User Preference in Database
- Add `language` field to `user_profiles` table
- Store user's preferred language
- Use this preference for all communications

### Required Database Changes
```sql
-- Add to user_profiles table
ALTER TABLE user_profiles ADD COLUMN language VARCHAR(5) NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'sl'));

-- Migration file: V2__add_language_support.sql
```

### Backend Implementation Steps

#### 1. Database Migration
- Create V2 migration to add language field
- Update user profile creation/update logic
- Add language validation

#### 2. Language Context Implementation
- Create `LanguageContext` trait/object
- Extract language from Accept-Language header
- Fallback to user preference, then English

#### 3. Message Bundles
- Create message files for both languages
- Implement message resolution logic
- Handle pluralization for Slovene

#### 4. Service Layer Updates
- Update `UserService` to use localized messages
- Modify `EmailTemplates` for multi-language support
- Update validation functions

#### 5. API Response Localization
- Modify `Http.scala` error handling
- Return localized error messages
- Maintain backward compatibility

## Implementation Priority

### High Priority (Frontend)
- [ ] User interface text
- [ ] Form labels and buttons
- [ ] Navigation elements
- [ ] Error messages displayed in UI
- [ ] Language switching functionality

### Medium Priority (Backend)
- [ ] API error messages
- [ ] Email templates
- [ ] Validation messages
- [ ] User language preference storage

### Low Priority
- [ ] Log messages (keep in English for debugging)
- [ ] Database field names (keep in English)
- [ ] Configuration file comments

## Technical Considerations

### Language Detection Priority
1. User's explicit selection in UI
2. User's stored preference in database
3. Accept-Language header from browser
4. Fallback to English

### Pluralization Rules
- **English**: 2 forms (singular, plural)
- **Slovene**: 4 forms (singular, dual, plural, genitive plural)

### Date and Number Formatting
- **English**: MM/DD/YYYY, 1,234.56
- **Slovene**: DD.MM.YYYY, 1 234,56

### Character Encoding
- Ensure UTF-8 support throughout
- Handle special Slovene characters (č, š, ž)
- Test with various input methods

## Testing Strategy

### Frontend Testing
- Unit tests for translation functions
- Integration tests for language switching
- Visual regression tests for different languages
- Accessibility testing for language-specific content

### Backend Testing
- Unit tests for message resolution
- Integration tests for localized API responses
- Email template rendering tests
- Database migration tests

### End-to-End Testing
- Complete user flows in both languages
- Language switching during active sessions
- Persistence of language preferences
- Cross-browser compatibility

## Future Considerations

### Additional Languages
- Design system to easily add new languages
- Maintain consistent terminology across languages
- Consider regional variations (e.g., en-US vs en-GB)

### Content Management
- Plan for dynamic content updates
- Consider translation management tools
- Implement translation workflow for content updates

### Performance
- Lazy load translation files
- Implement translation caching
- Monitor bundle size impact

## Resources and References

### Documentation
- [react-i18next documentation](https://react.i18next.com/)
- [i18next documentation](https://www.i18next.com/)
- [Slovene language resources](https://sl.wikipedia.org/wiki/Sloven%C5%A1%C4%8Dina)

### Tools
- [i18next-parser](https://github.com/i18next/i18next-parser) for extracting translation keys
- [i18next-scanner](https://github.com/i18next/i18next-scanner) for scanning code
- [Lokalise](https://lokalise.com/) or [Crowdin](https://crowdin.com/) for translation management

## Timeline Estimate

### Phase 1: Frontend Foundation (1-2 weeks)
- Setup i18n infrastructure
- Create translation files
- Implement basic language switching

### Phase 2: Frontend Implementation (2-3 weeks)
- Update all components
- Implement language persistence
- Add language selector UI

### Phase 3: Backend Foundation (1-2 weeks)
- Database migration
- Language context implementation
- Message bundle setup

### Phase 4: Backend Implementation (2-3 weeks)
- Update services and APIs
- Implement email localization
- Testing and refinement

### Phase 5: Integration and Testing (1-2 weeks)
- End-to-end testing
- Performance optimization
- Documentation updates

**Total Estimated Time: 7-12 weeks**

---

*This document should be updated as the implementation progresses and new requirements or challenges are discovered.*
