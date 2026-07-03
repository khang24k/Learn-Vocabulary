import { useCallback } from 'react';
import { useSettings } from '../contexts/SettingsContext';

export const useSpeechSynthesis = () => {
  const { speechRate, t } = useSettings();

  const speak = useCallback((text: string) => {
    if (!('speechSynthesis' in window)) {
      alert(t.ttsNotSupported);
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    utterance.rate = speechRate;
    
    window.speechSynthesis.speak(utterance);
  }, [speechRate, t]);

  return { speak };
};
