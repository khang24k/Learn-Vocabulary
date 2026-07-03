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
