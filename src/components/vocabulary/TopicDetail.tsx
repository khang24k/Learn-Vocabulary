import React from 'react';
import { useParams, Link } from 'react-router-dom';
import type { Topic } from '../../types';
import { VocabularyCard } from './VocabularyCard';
import { ArrowLeft } from 'lucide-react';
import { useSettings } from '../../contexts/SettingsContext';

interface TopicDetailProps {
  topics: Topic[];
}

export const TopicDetail: React.FC<TopicDetailProps> = ({ topics }) => {
  const { id } = useParams<{ id: string }>();
  const { t } = useSettings();
  const topic = topics.find(t_ => t_.id === Number(id));

  if (!topic) {
    return (
      <div className="text-center py-10">
        <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-300">{t.notFoundTopic}</h2>
        <Link to="/" className="text-blue-500 hover:underline mt-4 inline-block">{t.backToList}</Link>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center mb-6">
        <Link to="/" className="p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-full transition-colors mr-2">
          <ArrowLeft className="w-6 h-6 text-slate-600 dark:text-slate-300" />
        </Link>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 transition-colors">
          {topic.topicName}
        </h1>
      </div>
      
      <div className="space-y-4">
        {topic.words.map((word, idx) => (
          <VocabularyCard key={idx} word={word} />
        ))}
      </div>
    </div>
  );
};
