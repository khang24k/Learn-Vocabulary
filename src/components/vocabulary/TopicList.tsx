import React from 'react';
import type { Topic } from '../../types';
import { Link } from 'react-router-dom';
import { BookMarked } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { useProgress } from '../../contexts/ProgressContext';

interface TopicListProps {
  topics: Topic[];
}

export const TopicList: React.FC<TopicListProps> = ({ topics }) => {
  const { t } = useSettings();
  const { getTopicProgress, getLearnedCount } = useProgress();

  return (
    <div>
      <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-6 flex items-center transition-colors">
        <BookMarked className="w-6 h-6 mr-2 text-blue-500" />
        {t.topics}
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {topics.map((topic) => {
          const progress = getTopicProgress(topic.id, topic.words.length);
          const learnedCount = getLearnedCount(topic.id);
          
          return (
            <Link 
              key={topic.id} 
              to={`/topic/${topic.id}`}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 p-6 hover:shadow-md hover:border-blue-300 dark:hover:border-blue-500 transition-all group flex flex-col h-full"
            >
              <h2 className="text-xl font-semibold text-slate-800 dark:text-slate-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                {topic.topicName}
              </h2>
              <div className="flex-grow flex flex-col justify-end">
                <div className="flex justify-between items-end mb-2">
                  <p className="text-slate-500 dark:text-slate-400 text-sm">
                    {topic.words.length} {t.wordsCount}
                  </p>
                  {learnedCount > 0 && (
                    <span className="text-xs font-medium text-green-600 dark:text-green-400">
                      {learnedCount}/{topic.words.length} ({progress}%)
                    </span>
                  )}
                </div>
                <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-1.5 overflow-hidden">
                  <div 
                    className="bg-green-500 dark:bg-green-400 h-1.5 rounded-full transition-all duration-500 ease-out" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
