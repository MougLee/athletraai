import React from 'react';
import { Dropdown, DropdownButton } from 'react-bootstrap';
import { useLanguage } from '../../contexts/LanguageContext';

export const LanguageSelector: React.FC = () => {
  const { currentLanguage, switchLanguage, availableLanguages } = useLanguage();

  const currentLang = availableLanguages.find(lang => lang.code === currentLanguage);

  return (
    <DropdownButton
      id="language-selector"
      title={
        <span>
          {currentLang?.flag} {currentLang?.name}
        </span>
      }
      variant="outline-secondary"
      size="sm"
      className="language-selector"
    >
      {availableLanguages.map((language) => (
        <Dropdown.Item
          key={language.code}
          onClick={() => switchLanguage(language.code)}
          active={language.code === currentLanguage}
          className="d-flex align-items-center"
        >
          <span className="me-2">{language.flag}</span>
          <span>{language.name}</span>
        </Dropdown.Item>
      ))}
    </DropdownButton>
  );
};
