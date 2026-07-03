import React, { useState, useEffect } from 'react';
import type { Word } from '../../types';
import { Volume2, Mic, CheckCircle } from 'lucide-react';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useSettings } from '../../contexts/SettingsContext';
import { useProgress } from '../../contexts/ProgressContext';

interface VocabularyCardProps {
  word: Word;
  topicId: number;
}

export const VocabularyCard: React.FC<VocabularyCardProps> = ({ word, topicId }) => {
  const { speak } = useSpeechSynthesis();
  const { transcript, isRecording, startRecording, stopRecording } = useSpeechRecognition();
  const { t } = useSettings();
  const { markWordAsLearned, learnedWords } = useProgress();
  
  const [showMeaning, setShowMeaning] = useState(false);

  const normalizedVocab = word.VOCABULARY.toLowerCase().trim();
  const normalizedTranscript = transcript.toLowerCase().trim();
  const isNewlyCorrect = normalizedTranscript === normalizedVocab && normalizedTranscript !== '';
  const isLearned = learnedWords[topicId]?.includes(word.VOCABULARY) || false;
  const isCorrect = isNewlyCorrect || isLearned;

  useEffect(() => {
    if (isNewlyCorrect && !isLearned) {
      markWordAsLearned(topicId, word.VOCABULARY);
    }
  }, [isNewlyCorrect, isLearned, topicId, word.VOCABULARY, markWordAsLearned]);

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    speak(word.VOCABULARY);
  };

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    startRecording();
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    stopRecording();
  };

  const toggleMeaning = () => {
    setShowMeaning(!showMeaning);
  };

  return (
    <div 
      className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-4 mb-4 transition-all hover:shadow-md cursor-pointer"
      onClick={toggleMeaning}
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-baseline gap-2 flex-wrap">
            <span className="text-xl font-bold text-slate-800 dark:text-slate-100">{word.VOCABULARY}</span>
            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">({word["WORD TYPE"]})</span>
            <span className="text-sm text-slate-500 dark:text-slate-400">{word.PRONUNCIATION}</span>
          </div>
          
          {showMeaning && (
            <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-lg animate-in fade-in slide-in-from-top-2 duration-200 border border-blue-100 dark:border-blue-800/50">
              <span className="font-semibold">{t.meaning} </span> {word.MEANING}
            </div>
          )}
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={handleSpeak}
              className="p-3 bg-slate-100 dark:bg-slate-700 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 rounded-full transition-colors focus:outline-none"
              title={t.listenHint}
            >
              <Volume2 className="w-5 h-5" />
            </button>

            <button 
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onTouchStart={handleMouseDown}
              onTouchEnd={handleMouseUp}
              onClick={(e) => e.stopPropagation()}
              className={`p-3 rounded-full transition-all focus:outline-none ${
                isRecording 
                  ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-200 dark:shadow-red-900' 
                  : 'bg-slate-100 dark:bg-slate-700 hover:bg-red-100 dark:hover:bg-red-900/50 text-slate-600 dark:text-slate-300 hover:text-red-500 dark:hover:text-red-400'
              }`}
              title={t.recordingHint}
            >
              <Mic className="w-5 h-5" />
            </button>
          </div>

          <div 
            className={`relative flex items-center w-full sm:w-48 bg-slate-50 dark:bg-slate-900 border rounded-lg px-3 py-2 ${
              isCorrect ? 'border-green-400 dark:border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-slate-200 dark:border-slate-600'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <input 
              type="text" 
              readOnly 
              value={isLearned && transcript === '' ? word.VOCABULARY : transcript}
              placeholder="..."
              className="bg-transparent w-full outline-none text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500"
            />
            {isCorrect && (
              <CheckCircle className="w-5 h-5 text-green-500 absolute right-3" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
