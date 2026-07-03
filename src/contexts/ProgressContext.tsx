import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { ReactNode } from 'react';
import { useAuth } from './AuthContext';

interface ProgressContextType {
  learnedWords: Record<number, string[]>;
  markWordAsLearned: (topicId: number, vocabulary: string) => void;
  getTopicProgress: (topicId: number, totalWords: number) => number;
  getLearnedCount: (topicId: number) => number;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

export const ProgressProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [learnedWords, setLearnedWords] = useState<Record<number, string[]>>(() => {
    try {
      const saved = localStorage.getItem('vocabularyProgress');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error('Failed to parse vocabulary progress from local storage', e);
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem('vocabularyProgress', JSON.stringify(learnedWords));
  }, [learnedWords]);

  const { isAuthenticated, user } = useAuth();

  // Load progress when user logs in
  useEffect(() => {
    if (isAuthenticated && user?.progress) {
      const serverProgress: Record<number, string[]> = {};
      user.progress.forEach(p => {
        if (!serverProgress[p.topicId]) {
          serverProgress[p.topicId] = [];
        }
        serverProgress[p.topicId].push(p.vocabulary);
      });
      
      setLearnedWords(prev => {
        const merged = { ...prev };
        for (const [topicId, words] of Object.entries(serverProgress)) {
          const tId = Number(topicId);
          if (!merged[tId]) merged[tId] = [];
          merged[tId] = Array.from(new Set([...merged[tId], ...words]));
        }
        return merged;
      });
    }
  }, [isAuthenticated, user]);

  const markWordAsLearned = useCallback(async (topicId: number, vocabulary: string) => {
    setLearnedWords(prev => {
      const topicWords = prev[topicId] || [];
      if (!topicWords.includes(vocabulary)) {
        return {
          ...prev,
          [topicId]: [...topicWords, vocabulary]
        };
      }
      return prev;
    });

    if (isAuthenticated) {
      try {
        await fetch('/api/sync/progress', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ topicId, vocabulary })
        });
      } catch (e) {
        console.error('Failed to sync progress:', e);
      }
    }
  }, [isAuthenticated]);

  const getLearnedCount = (topicId: number) => {
    return learnedWords[topicId]?.length || 0;
  };

  const getTopicProgress = (topicId: number, totalWords: number) => {
    if (totalWords === 0) return 0;
    const learned = getLearnedCount(topicId);
    return Math.round((learned / totalWords) * 100);
  };

  return (
    <ProgressContext.Provider value={{ learnedWords, markWordAsLearned, getTopicProgress, getLearnedCount }}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  return context;
};
