import React from 'react';
import { useSettings } from '../../contexts/SettingsContext';
import { Settings as SettingsIcon, Globe, Moon, Sun, Volume2 } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme, language, setLanguage, speechRate, setSpeechRate, t } = useSettings();

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-8 flex items-center transition-colors">
        <SettingsIcon className="w-6 h-6 mr-2 text-blue-500" />
        {t.settings}
      </h1>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden transition-colors">
        
        {/* Language Setting */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center mb-4">
            <Globe className="w-5 h-5 text-slate-500 dark:text-slate-400 mr-2" />
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t.language}</h2>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setLanguage('vi')}
              className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                language === 'vi' 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium' 
                  : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
              }`}
            >
              Tiếng Việt
            </button>
            <button
              onClick={() => setLanguage('en')}
              className={`flex-1 py-2 px-4 rounded-lg border-2 transition-all ${
                language === 'en' 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 font-medium' 
                  : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
              }`}
            >
              English
            </button>
          </div>
        </div>

        {/* Theme Setting */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center mb-4">
            {theme === 'light' ? (
              <Sun className="w-5 h-5 text-slate-500 dark:text-slate-400 mr-2" />
            ) : (
              <Moon className="w-5 h-5 text-slate-500 dark:text-slate-400 mr-2" />
            )}
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t.theme}</h2>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => setTheme('light')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg border-2 transition-all ${
                theme === 'light' 
                  ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 font-medium' 
                  : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
              }`}
            >
              <Sun className="w-4 h-4 mr-2" />
              {t.themeLight}
            </button>
            <button
              onClick={() => setTheme('dark')}
              className={`flex-1 flex items-center justify-center py-2 px-4 rounded-lg border-2 transition-all ${
                theme === 'dark' 
                  ? 'border-blue-500 bg-slate-800 dark:bg-blue-900/40 text-blue-600 dark:text-blue-300 font-medium' 
                  : 'border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-400 hover:border-slate-300 dark:hover:border-slate-500'
              }`}
            >
              <Moon className="w-4 h-4 mr-2" />
              {t.themeDark}
            </button>
          </div>
        </div>

        {/* Speech Rate Setting */}
        <div className="p-6">
          <div className="flex items-center mb-4">
            <Volume2 className="w-5 h-5 text-slate-500 dark:text-slate-400 mr-2" />
            <h2 className="text-lg font-semibold text-slate-800 dark:text-slate-200">{t.speechRate}</h2>
            <span className="ml-auto text-blue-600 dark:text-blue-400 font-medium">{speechRate}x</span>
          </div>
          
          <div className="px-2">
            <input 
              type="range" 
              min="0.5" 
              max="2.0" 
              step="0.1" 
              value={speechRate}
              onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
              className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
            />
            <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-2">
              <span>0.5x (Chậm)</span>
              <span>1.0x (Chuẩn)</span>
              <span>2.0x (Nhanh)</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
