import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MainLayout } from './components/layout/MainLayout';
import { TopicList } from './components/vocabulary/TopicList';
import { TopicDetail } from './components/vocabulary/TopicDetail';

import { SettingsPage } from './components/settings/SettingsPage';
import { VoiceLookupPage } from './components/speech/VoiceLookupPage';
import { useVocabularyData } from './hooks/useVocabularyData';
import { SettingsProvider } from './contexts/SettingsContext';
import { ProgressProvider } from './contexts/ProgressContext';
import { AuthProvider } from './contexts/AuthContext';
function AppContent() {
  const { topics, isLoading, error } = useVocabularyData();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="text-xl font-medium text-slate-600 dark:text-slate-400 animate-pulse">Đang tải dữ liệu...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors">
        <div className="text-xl font-medium text-red-500">Lỗi tải dữ liệu: {error}</div>
      </div>
    );
  }

  return (
    <Router>
      <MainLayout>
        <Routes>
          <Route path="/" element={<VoiceLookupPage />} />
          <Route path="/topics" element={<TopicList topics={topics} />} />
          <Route path="/topic/:id" element={<TopicDetail topics={topics} />} />

          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </MainLayout>
    </Router>
  );
}


function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <ProgressProvider>
          <AppContent />
        </ProgressProvider>
      </SettingsProvider>
    </AuthProvider>
  );
}

export default App;
