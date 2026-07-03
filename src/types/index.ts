export interface Word {
  STT: number;
  VOCABULARY: string;
  "WORD TYPE": string;
  PRONUNCIATION: string;
  MEANING: string;
}

export interface Topic {
  id: number;
  topicName: string;
  originalFile: string;
  words: Word[];
}

export interface Settings {
  theme?: string;
  language?: string;
  speechRate?: number;
}

export interface User {
  id: string;
  nickname: string;
  avatar: string | null;
  settings?: Settings;
  progress?: { topicId: number; vocabulary: string }[];
}
