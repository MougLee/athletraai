import React from 'react';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useTranslation } from 'react-i18next';
import { useLanguage } from 'contexts/LanguageContext/LanguageContext';
import { commonTimezones, unitsOptions } from '../../../utils/preferences';
import { Field, useFormikContext } from 'formik';

interface PreferencesSectionProps {
  onLanguageChange: (language: string) => void;
}

export const PreferencesSection: React.FC<PreferencesSectionProps> = ({
  onLanguageChange,
}) => {
  const { t } = useTranslation(['common']);
  const { currentLanguage, switchLanguage, availableLanguages } = useLanguage();
  const { setFieldValue } = useFormikContext();

  const handleLanguageChange = (newLanguage: string) => {
    onLanguageChange(newLanguage);
    // Also update the global language context
    if (newLanguage !== currentLanguage) {
      switchLanguage(newLanguage);
    }
    // Update the Formik field value
    setFieldValue('language', newLanguage);
  };

  return (
    <div className="mb-4">
      <h4 className="mb-3">{t('profile.preferences', { defaultValue: 'Preferences' })}</h4>
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="language">{t('profile.language')}</Form.Label>
            <Field name="language">
              {({ field }: any) => (
                <Form.Select
                  {...field}
                  id="language"
                  onChange={(e) => handleLanguageChange(e.target.value)}
                >
                  {availableLanguages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Field>
            <Form.Text className="text-muted">
              {t('profile.languageHelp')}
            </Form.Text>
          </Form.Group>
        </Col>
        
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="timezone">{t('profile.timezone')}</Form.Label>
            <Field name="timezone">
              {({ field }: any) => (
                <Form.Select {...field} id="timezone">
                  {commonTimezones.map((tz) => (
                    <option key={tz.value} value={tz.value}>
                      {tz.label}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Field>
            <Form.Text className="text-muted">
              {t('profile.timezoneHelp')}
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
      
      <Row>
        <Col md={6}>
          <Form.Group className="mb-3">
            <Form.Label htmlFor="unitSystem">{t('profile.units')}</Form.Label>
            <Field name="unitSystem">
              {({ field }: any) => (
                <Form.Select {...field} id="unitSystem">
                  {unitsOptions.map((unit) => (
                    <option key={unit.value} value={unit.value}>
                      {unit.label}
                    </option>
                  ))}
                </Form.Select>
              )}
            </Field>
            <Form.Text className="text-muted">
              {t('profile.unitsHelp')}
            </Form.Text>
          </Form.Group>
        </Col>
      </Row>
    </div>
  );
};
