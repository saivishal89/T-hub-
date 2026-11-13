export type Role = 'admin' | 'teacher' | 'student' | 'parent' | 'super_admin' | 'district_officer' | 'school_admin';

export type Language = 'te' | 'en';

export type VoiceGender = 'female' | 'male' | 'child' | 'falcon';

export interface UserAccount {
  id: string;
  email: string;
  name: string;
  nameTelugu: string;
  role: Role;
  roleLabel: string;
  roleLabelTelugu: string;
  district?: string;
  mandal?: string;
  school?: string;
  grade?: string;
  enrolledGrade?: number;
  rollNumber?: string;
  childName?: string;
  childGrade?: string;
  childSchool?: string;
  avatarUrl?: string;
  permissions: string[];
  stars?: number;
}

export type UserProfile = UserAccount;

export interface ReadingPassage {
  id: string;
  title: string;
  titleEnglish: string;
  grade: number;
  difficulty: 'సరళమైన (Beginner)' | 'మధ్యస్థం (Medium)' | 'క్లిష్టమైన (Advanced)';
  theme: string;
  wordCount: number;
  expectedTimeSeconds: number;
  content: string;
  words: string[];
  audioUrl?: string;
}

export interface WordAnalysis {
  word: string;
  originalIndex: number;
  spokenWord?: string;
  status: 'correct' | 'hesitation' | 'mispronounced' | 'omitted';
  confidence: number; // 0 to 100
  phonemeBreakdown?: string[];
  errorReason?: string;
  practiceTipTelugu?: string;
}

export interface PhoneticContrastInfo {
  contrast: string;
  error_name: string;
  explanation_te: string;
  tip: string;
}

export interface TutorInteractionResult {
  targetWord: string;
  spokenWord: string;
  status: 'correct' | 'phonetic_contrast_error' | 'needs_practice';
  confidence: number;
  phonemes: string[];
  contrastIssue?: PhoneticContrastInfo;
  aiDialogueTelugu: string;
  aiDialogueEnglish: string;
  slowRepeatPrompt: string;
  teacherTip: string;
  encouragementBadge: string;
}

export interface AssessmentResult {
  id: string;
  studentId: string;
  studentName: string;
  passageId: string;
  passageTitle: string;
  grade: number;
  date: string;
  accuracyScore: number; // percentage
  wcpm: number; // words correct per minute
  fluencyScore: number;
  pronunciationScore: number;
  totalWords: number;
  wordsCorrect: number;
  wordsHesitated: number;
  wordsMispronounced: number;
  wordsOmitted: number;
  timeSpentSeconds: number;
  readingLevel: 'అక్షర స్థాయి (Alphabet)' | 'పద స్థాయి (Word Level)' | 'వాక్య స్థాయి (Sentence Level)' | 'కథా స్థాయి (Story/Fluent)';
  wordAnalysis: WordAnalysis[];
  weakAksharas: string[];
  weakGunanithalu: string[];
  aiFeedbackTelugu: string;
  aiFeedbackEnglish: string;
  recommendedPractice: {
    title: string;
    description: string;
    words: string[];
  }[];
}

export interface StudentProgress {
  id: string;
  name: string;
  nameTelugu: string;
  rollNumber: string;
  grade: string;
  section: string;
  schoolName: string;
  readingLevel: string;
  currentWCPM: number;
  targetWCPM: number;
  totalAssessments: number;
  lastAssessmentDate: string;
  accuracyTrend: number[]; // last 5 tests
  streakDays: number;
  starsEarned: number;
}
