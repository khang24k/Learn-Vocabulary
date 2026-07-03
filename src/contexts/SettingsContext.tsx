import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { type Language, translations } from '../utils/i18n';
import { useAuth } from './AuthContext';

interface SettingsContextType {
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  lastTopicId: number | null;
  setLastTopicId: (id: number | null) => void;
  lastScrollPos: number;
  setLastScrollPos: (pos: number) => void;
  t: typeof translations.vi;
  hasUnsavedChanges: boolean;
  saveSettings: () => Promise<void>;
  isSaving: boolean;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const SettingsProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'vi';
  });

  const [speechRate, setSpeechRateState] = useState<number>(() => {
    const saved = localStorage.getItem('speechRate');
    return saved ? parseFloat(saved) : 1.0;
  });

  const [lastTopicId, setLastTopicIdState] = useState<number | null>(() => {
    const saved = sessionStorage.getItem('lastTopicId');
    return saved ? parseInt(saved, 10) : null;
  });

  const [lastScrollPos, setLastScrollPosState] = useState<number>(() => {
    const saved = sessionStorage.getItem('lastScrollPos');
    return saved ? parseInt(saved, 10) : 0;
  });

  const [dbSettings, setDbSettings] = useState({
    theme: theme,
    language: language,
    speechRate: speechRate
  });
  const [isSaving, setIsSaving] = useState(false);

  const { isAuthenticated, user } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user?.settings) {
      const newTheme = (user.settings.theme as 'light' | 'dark') || 'light';
      const newLang = (user.settings.language as Language) || 'vi';
      const newRate = user.settings.speechRate !== undefined ? user.settings.speechRate : 1.0;
      
      setThemeState(newTheme);
      setLanguageState(newLang);
      setSpeechRateState(newRate);
      
      setDbSettings({
        theme: newTheme,
        language: newLang,
        speechRate: newRate
      });
    }
  }, [isAuthenticated, user]);

  const hasUnsavedChanges = isAuthenticated ? (
    theme !== dbSettings.theme || 
    language !== dbSettings.language || 
    speechRate !== dbSettings.speechRate
  ) : false;

  const saveSettings = async () => {
    if (!isAuthenticated) return;
    setIsSaving(true);
    try {
      await fetch('/api/sync/settings', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme, language, speechRate }),
      });
      setDbSettings({ theme, language, speechRate });
    } catch (e) {
      console.error('Failed to sync settings:', e);
    } finally {
      setIsSaving(false);
    }
  };

  const setTheme = (newTheme: 'light' | 'dark') => {
    setThemeState(newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const setSpeechRate = (rate: number) => {
    setSpeechRateState(rate);
    localStorage.setItem('speechRate', rate.toString());
  };

  const setLastTopicId = (id: number | null) => {
    setLastTopicIdState(id);
    if (id !== null) {
      sessionStorage.setItem('lastTopicId', id.toString());
    } else {
      sessionStorage.removeItem('lastTopicId');
    }
  };

  const setLastScrollPos = (pos: number) => {
    setLastScrollPosState(pos);
    sessionStorage.setItem('lastScrollPos', pos.toString());
  };

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [theme]);

  const t = translations[language];

  return (
    <SettingsContext.Provider value={{ 
      theme, setTheme, 
      language, setLanguage, 
      speechRate, setSpeechRate, 
      lastTopicId, setLastTopicId,
      lastScrollPos, setLastScrollPos,
      t,
      hasUnsavedChanges,
      saveSettings,
      isSaving
    }}>
      {children}
    </SettingsContext.Provider>
  );
};

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};
