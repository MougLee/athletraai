# Internationalization (i18n) Implementation Plan

## Overview
This document outlines the comprehensive plan for implementing internationalization (i18n) support for both Slovene (sl) and English (en) languages in the AthletraAI project.

## Goals
- Support two languages: Slovene (sl) and English (en)
- Provide seamless language switching in the UI
- Localize backend error messages and email templates
- Maintain consistent user experience across languages
- Enable easy addition of more languages in the future

## Frontend (UI) Internationalization - ✅ COMPLETED

### Technology Stack
- **Primary**: react-i18next with i18next
- **Language Detection**: i18next-browser-languagedetector
- **TypeScript Support**: @types/i18next

### Implementation Steps

#### 1. Install Dependencies ✅
```bash
yarn add react-i18next i18next i18next-browser-languagedetector
yarn add -D @types/i18next
```

#### 2. Create Translation Files Structure ✅
```
ui/src/
├── locales/
│   ├── en/
│   │   ├── common.json          # Navigation, buttons, general UI
│   │   ├── auth.json            # Login, register, password forms
│   │   ├── validation.json      # Form validation messages
│   │   └── errors.json          # Error messages
│   └── sl/
│       ├── common.json
│       ├── auth.json
│       ├── validation.json
│       └── errors.json
```

#### 3. Configure i18n ✅
Create `ui/src/i18n.ts` with:
- Language detection (browser locale, user preference)
- Fallback to English
- Pluralization rules for Slovene
- Namespace management

#### 4. Update App.tsx ✅
- Wrap app with `LanguageProvider`
- Add language context provider
- Implement language switching functionality

#### 5. Create Language Context ✅
- `LanguageContext` for managing current language
- Language switching functions
- Persist language preference in localStorage
- Sync with backend user preference

#### 6. Update Components ✅
- Replace hardcoded strings with translation keys
- Use `useTranslation` hook throughout components
- Implement dynamic language switching
- Add language selector in Top.tsx navigation

### Language Switching UI ✅
- Add language selector in top navigation
- Use flags/icons for visual language identification
- Implement dropdown or toggle button
- Show current language prominently

### Translation Management ✅
- Use descriptive, hierarchical translation keys
- Implement pluralization for Slovene (complex plural forms)
- Handle RTL/LTR considerations if needed
- Maintain consistent terminology across languages

## Backend Internationalization - ✅ IMPLEMENTED

### Current Internationalization Requirements

#### 1. Error Messages (Previously Hardcoded in English) ✅
```scala
// Before: Hardcoded English messages
private val LoginAlreadyUsed = "Login already in use!"
private val EmailAlreadyUsed = "E-mail already in use!"
private val IncorrectLoginOrPassword = "Incorrect login/email or password"

// After: Localized messages using MessageService
messageService.getMessage("user.login.already.used", language)
messageService.getMessage("user.email.already.used", language)
messageService.getMessage("user.incorrect.credentials", language)
```

#### 2. Email Templates (Previously Only in English) ✅
- Registration confirmation
- Password reset
- Password change notification
- Profile details change notification

#### 3. Validation Messages ✅
- Frontend validation (Yup schemas) are in English
- Backend validation error messages are now localized

### Backend Implementation Approach - ✅ IMPLEMENTED

#### **Language Storage Strategy**
- **Language column in `user_profiles` table** - Stores user's preferred language
- **Automatic language detection** - During registration, language is detected from browser's Accept-Language header
- **User preference override** - Users can change their language preference via profile settings

#### **Language Detection Priority**
1. **User's stored preference** in database (highest priority)
2. **Accept-Language header** from browser (during registration)
3. **Fallback to English** (default)

### Required Database Changes ✅
```sql
-- Migration: V2__add_language_support.sql
ALTER TABLE user_profiles ADD COLUMN language VARCHAR(5) NOT NULL DEFAULT 'en' CHECK (language IN ('en', 'sl'));

-- Create index for language queries
CREATE INDEX idx_user_profiles_language ON user_profiles(language);

-- Add comment for documentation
COMMENT ON COLUMN user_profiles.language IS 'User preferred language (en=English, sl=Slovene)';
```

### Backend Implementation Steps ✅

#### 1. Database Migration ✅
- Created V2 migration to add language field
- Added language validation constraint
- Created index for efficient language queries

#### 2. Language Context Implementation ✅
- Created `LanguageContext` trait/object
- Implemented language detection from Accept-Language header
- Created fallback logic: user preference → Accept-Language → English

#### 3. Message Bundles ✅
- Created message files for both languages (`messages.properties`)
- Implemented `MessageService` for message resolution
- Support for message interpolation with parameters

#### 4. Service Layer Updates ✅
- Updated `UserService` to use localized messages
- Modified `EmailTemplates` for multi-language support
- Updated validation functions with localized error messages
- Added user profile creation with language preference

#### 5. API Response Localization ✅
- Modified `UserApi` to accept language during registration
- Added language update endpoint (`PUT /users/me/language`)
- Maintained backward compatibility

### **How It Works - Backend Internationalization**

#### **1. User Registration Flow**
```
1. Frontend sends registration request with language preference
2. Backend creates user and user_profile with language
3. All error messages and emails are generated in user's language
4. Language preference is stored in user_profiles.language column
```

#### **2. Language Resolution During API Calls**
```
1. Backend receives request
2. Extracts user ID from authentication token
3. Queries user_profiles table for language preference
4. Uses MessageService to resolve messages in user's language
5. Returns localized error messages and content
```

#### **3. Email Localization**
```
1. Email templates use MessageService to get localized content
2. Subject and body are generated in user's preferred language
3. Fallback to English if translation is missing
4. Support for parameter interpolation (e.g., user names)
```

#### **4. Error Message Localization**
```
1. Validation errors use message keys instead of hardcoded strings
2. MessageService resolves keys to localized text
3. Language context flows through service layer
4. Consistent error message format across all endpoints
```

## Implementation Priority

### High Priority (Frontend) ✅ COMPLETED
- [x] User interface text
- [x] Form labels and buttons
- [x] Navigation elements
- [x] Error messages displayed in UI
- [x] Language switching functionality

### Medium Priority (Backend) ✅ COMPLETED
- [x] API error messages
- [x] Email templates
- [x] Validation messages
- [x] User language preference storage

### Low Priority
- [ ] Log messages (keep in English for debugging)
- [ ] Database field names (keep in English)
- [ ] Configuration file comments

## Technical Considerations

### Language Detection Priority ✅ IMPLEMENTED
1. **User's explicit selection** in UI (stored in database)
2. **User's stored preference** in database
3. **Accept-Language header** from browser
4. **Fallback to English**

### Pluralization Rules ✅ IMPLEMENTED
- **English**: 2 forms (singular, plural)
- **Slovene**: 4 forms (singular, dual, plural, genitive plural)

### Date and Number Formatting
- **English**: MM/DD/YYYY, 1,234.56
- **Slovene**: DD.MM.YYYY, 1 234,56

### Character Encoding ✅ IMPLEMENTED
- UTF-8 support throughout
- Special Slovene characters (č, š, ž) handled
- Message bundles use proper encoding

## Testing Strategy

### Frontend Testing ✅ COMPLETED
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

### Phase 1: Frontend Foundation ✅ COMPLETED (1-2 weeks)
- [x] Setup i18n infrastructure
- [x] Create translation files
- [x] Implement basic language switching

### Phase 2: Frontend Implementation ✅ COMPLETED (2-3 weeks)
- [x] Update all components
- [x] Implement language persistence
- [x] Add language selector UI

### Phase 3: Backend Foundation ✅ COMPLETED (1-2 weeks)
- [x] Database migration
- [x] Language context implementation
- [x] Message bundle setup

### Phase 4: Backend Implementation ✅ COMPLETED (2-3 weeks)
- [x] Update services and APIs
- [x] Implement email localization
- [x] Testing and refinement

### Phase 5: Integration and Testing (1-2 weeks)
- [ ] End-to-end testing
- [ ] Performance optimization
- [ ] Documentation updates

**Total Estimated Time: 7-12 weeks**
**Actual Time: 6 weeks (Frontend: 3 weeks, Backend: 3 weeks)**

---

## **Current Status: ✅ IMPLEMENTATION COMPLETE**

### **Frontend: ✅ 100% Complete**
- Full internationalization with react-i18next
- Language switching UI in navigation
- All components translated (Login, Register, Profile, Welcome, etc.)
- Persistent language preferences

### **Backend: ✅ 100% Complete**
- Language column in user_profiles table
- Automatic language detection from browser headers
- Localized error messages and validation
- Multi-language email templates
- Language update API endpoint

### **Next Steps**
1. **Test the complete system** end-to-end
2. **Add more languages** if needed
3. **Performance optimization** and monitoring
4. **User documentation** for language switching

*This document should be updated as the implementation progresses and new requirements or challenges are discovered.*
