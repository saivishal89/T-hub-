import { NextResponse } from 'next/server';
import { SAMPLE_ASSESSMENT_RESULT } from '@/lib/mockData';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const duration = Number(body.durationSeconds) || 38;
    const wordsCount = 31;
    const wordsCorrect = 27;

    const wcpm = Math.round((wordsCorrect / duration) * 60);
    const accuracy = Math.round((wordsCorrect / wordsCount) * 100);

    const result = {
      ...SAMPLE_ASSESSMENT_RESULT,
      passageId: body.passageId || SAMPLE_ASSESSMENT_RESULT.passageId,
      passageTitle: body.passageTitle || SAMPLE_ASSESSMENT_RESULT.passageTitle,
      timeSpentSeconds: duration,
      wcpm: wcpm,
      accuracyScore: accuracy,
    };

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(SAMPLE_ASSESSMENT_RESULT);
  }
}

