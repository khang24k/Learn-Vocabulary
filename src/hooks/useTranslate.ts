import { useState, useCallback } from 'react';

interface TranslationResult {
  word: string;
  phonetic: string;
  meaning: string;
}

export const useTranslate = () => {
  const [result, setResult] = useState<TranslationResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const translateWord = useCallback(async (word: string) => {
    if (!word.trim()) {
      setResult(null);
      return;
    }
    
    setIsLoading(true);
    setError(null);

    try {
      // Fetch phonetic from Free Dictionary API
      let phonetic = '';
      try {
        const dictRes = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`);
        if (dictRes.ok) {
          const dictData = await dictRes.json();
          // Find the first valid phonetic
          if (dictData && dictData[0] && dictData[0].phonetics) {
            const phoneticsObj = dictData[0].phonetics.find((p: any) => p.text);
            if (phoneticsObj) {
              phonetic = phoneticsObj.text;
            } else {
              phonetic = dictData[0].phonetic || '';
            }
          }
        }
      } catch (e) {
        console.warn('Could not fetch phonetic', e);
      }

      // Fetch meaning from MyMemory Translation API
      let meaning = '';
      const transRes = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(word)}&langpair=en|vi`);
      if (transRes.ok) {
        const transData = await transRes.json();
        if (transData && transData.responseData) {
          meaning = transData.responseData.translatedText;
        }
      }

      if (!meaning && !phonetic) {
        // If neither was found, maybe it's gibberish, but we can still just set it
        setResult({ word, phonetic: '', meaning: 'Không tìm thấy nghĩa' });
      } else {
        setResult({ word, phonetic, meaning });
      }
    } catch (err: any) {
      setError(err.message || 'Lỗi tra cứu');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
  }, []);

  return { result, isLoading, error, translateWord, clearResult };
};
