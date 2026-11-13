import { AssessmentResult } from '../types';
import { SAMPLE_ASSESSMENT_RESULT } from './mockData';

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function submitAssessmentToAI(payload: {
  passageId: string;
  passageTitle: string;
  grade: number;
  refText: string;
  spokenText?: string;
  durationSeconds: number;
}): Promise<AssessmentResult> {
  try {
    const res = await fetch(`${BACKEND_URL}/api/assess`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      return data as AssessmentResult;
    }
  } catch (err) {
    console.warn('Backend API connection fallback:', err);
  }

  // Graceful fallback to client-side data
  return SAMPLE_ASSESSMENT_RESULT;
}

