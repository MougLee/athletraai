import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useTranslation } from 'react-i18next';

interface LanguageContextType {
  currentLanguage: string;
  switchLanguage: (language: string) => void;
  availableLanguages: Array<{ code: string; name: string; flag: string }>;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

interface LanguageProviderProps {
  children: ReactNode;
}

export const LanguageProvider: React.FC<LanguageProviderProps> = ({ children }) => {
  const { i18n } = useTranslation();
  const [currentLanguage, setCurrentLanguage] = useState<string>('en');

  const availableLanguages = [
    { code: 'en', name: 'English', flag: '🇺🇸' },
    { code: 'sl', name: 'Slovenščina', flag: '🇸🇮' },
  ];

  // Initialize language from localStorage or browser preference
  useEffect(() => {
    const savedLanguage = localStorage.getItem('i18nextLng');
    const browserLanguage = navigator.language.split('-')[0];
    
    let initialLanguage = 'en';
    
    if (savedLanguage && availableLanguages.some(lang => lang.code === savedLanguage)) {
      initialLanguage = savedLanguage;
    } else if (browserLanguage === 'sl') {
      initialLanguage = 'sl';
    }
    
    setCurrentLanguage(initialLanguage);
    i18n.changeLanguage(initialLanguage);
  }, [i18n]);

  const switchLanguage = (language: string) => {
    if (availableLanguages.some(lang => lang.code === language)) {
      setCurrentLanguage(language);
      i18n.changeLanguage(language);
      localStorage.setItem('i18nextLng', language);
    }
  };

  const value: LanguageContextType = {
    currentLanguage,
    switchLanguage,
    availableLanguages,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
