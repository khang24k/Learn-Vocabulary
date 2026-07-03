import React from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Topic } from '../../types';
import { VocabularyCard } from './VocabularyCard';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';
import { useProgress } from '../../contexts/ProgressContext';

interface TopicDetailProps {
  topics: Topic[];
}

export const TopicDetail: React.FC<TopicDetailProps> = ({ topics }) => {
  const { id } = useParams<{ id: string }>();
  const { t } = useSettings();
  const { getTopicProgress, getLearnedCount } = useProgress();
  const topic = topics.find(t_ => t_.id === Number(id));

  if (!topic) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">{t.notFoundTopic}</h2>
        <Link to="/topics" className="text-blue-500 hover:underline mt-4 inline-block">{t.backToList}</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/topics" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors mr-2">
          <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
          {topic.topicName}
        </h1>
      </div>

      <div className="mb-6 bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="flex justify-between items-end mb-2">
          <p className="text-slate-500 dark:text-slate-400 text-sm font-medium">
            {t.learningProgress}
          </p>
          <span className="text-sm font-bold text-green-600 dark:text-green-400">
            {getLearnedCount(topic.id)}/{topic.words.length} ({getTopicProgress(topic.id, topic.words.length)}%)
          </span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-700 rounded-full h-2.5 overflow-hidden">
          <div 
            className="bg-green-500 dark:bg-green-400 h-2.5 rounded-full transition-all duration-500 ease-out" 
            style={{ width: `${getTopicProgress(topic.id, topic.words.length)}%` }}
          ></div>
        </div>
      </div>
      
      <div className="space-y-4">
        {topic.words.map((word, idx) => (
          <VocabularyCard key={idx} word={word} topicId={topic.id} />
        ))}
      </div>
    </div>
  );
};
