import React, { useEffect, useState } from 'react';
import { Mic, Volume2, X } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition';
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis';
import { useTranslate } from '../../hooks/useTranslate';

export const VoiceLookupPage: React.FC = () => {
  const { t } = useSettings();
  const { transcript, isRecording, startRecording, stopRecording, setTranscript } = useSpeechRecognition();
  const { speak } = useSpeechSynthesis();
  const { result, isLoading, error, translateWord, clearResult } = useTranslate();
  
  const [inputValue, setInputValue] = useState('');
  
  // Use a debounced effect to translate when transcript changes
  useEffect(() => {
    if (transcript) {
      setInputValue(transcript);
    }
  }, [transcript]);

  // Translate when typing or voice stops (and we have input)
  useEffect(() => {
    const handler = setTimeout(() => {
      if (inputValue.trim()) {
        translateWord(inputValue.trim());
      } else {
        clearResult();
      }
    }, 800);
    return () => clearTimeout(handler);
  }, [inputValue, translateWord, clearResult]);

  const handleMouseDown = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    startRecording();
  };

  const handleMouseUp = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    stopRecording();
  };
  
  const clearInput = () => {
    setTranscript('');
    setInputValue('');
    clearResult();
  };

  return (
    <div className="max-w-3xl mx-auto h-full flex flex-col pt-10">
      
      {/* Search Input Area */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-md border border-slate-200 dark:border-slate-700 overflow-hidden mb-6 transition-colors">
        <div className="relative p-6">
          <textarea
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value);
              if (e.target.value === '') {
                 setTranscript('');
                 clearResult();
              }
            }}
            placeholder={t.holdToSpeak}
            className="w-full h-32 resize-none text-2xl md:text-3xl font-medium text-slate-800 dark:text-slate-100 bg-transparent outline-none placeholder-slate-400 dark:placeholder-slate-500"
          />
          {inputValue && (
            <button 
              onClick={clearInput}
              className="absolute top-6 right-6 p-1 bg-slate-100 dark:bg-slate-700 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-full transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
        
        {/* Controls */}
        <div className="bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700 p-4 flex justify-center items-center">
          <button
            onMouseDown={handleMouseDown}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            onTouchStart={handleMouseDown}
            onTouchEnd={handleMouseUp}
            className={`p-6 rounded-full transition-all focus:outline-none flex items-center justify-center ${
              isRecording 
                ? 'bg-red-500 text-white animate-pulse shadow-xl shadow-red-200 dark:shadow-red-900 scale-110' 
                : 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/40 hover:scale-105'
            }`}
          >
            <Mic className="w-8 h-8" />
          </button>
        </div>
      </div>

      {/* Results Area */}
      <div className="flex-1">
        {isLoading && (
          <div className="text-center py-10">
            <div className="inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-slate-500 dark:text-slate-400">{t.translating}</p>
          </div>
        )}
        
        {error && !isLoading && (
          <div className="text-center py-10 text-red-500 bg-red-50 dark:bg-red-900/20 rounded-xl">
            {error}
          </div>
        )}

        {!isLoading && result && (
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 md:p-8 transition-colors animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="flex items-center gap-4 mb-4 border-b border-slate-100 dark:border-slate-700 pb-4">
              <h2 className="text-3xl md:text-4xl font-bold text-slate-800 dark:text-slate-100 capitalize">
                {result.word}
              </h2>
              <button 
                onClick={() => speak(result.word)}
                className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-full transition-colors"
                title={t.listenHint}
              >
                <Volume2 className="w-6 h-6" />
              </button>
            </div>
            
            {result.phonetic && (
              <p className="text-xl text-blue-600 dark:text-blue-400 font-medium mb-4">
                {result.phonetic}
              </p>
            )}
            
            <div className="text-xl md:text-2xl text-slate-700 dark:text-slate-300 mt-6 leading-relaxed">
              {result.meaning}
            </div>
          </div>
        )}
      </div>
      
    </div>
  );
};
