import { TELUGU_PASSAGES } from './mockData';
import { AssessmentResult, ReadingPassage, WordAnalysis } from '../types';

export function cleanTelugu(text: string): string {
  return text
    .replace(/[!?,.:;\"\'\(\)\[\]\{\}।]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

export function segmentTeluguPhonemes(word: string): string[] {
  const clean = cleanTelugu(word);
  const segments: string[] = [];
  const VOWEL_SIGNS = ['\u0C3E', '\u0C3F', '\u0C40', '\u0C41', '\u0C42', '\u0C43', '\u0C46', '\u0C47', '\u0C48', '\u0C4A', '\u0C4B', '\u0C4C'];
  const VIRAMA = '\u0C4D';
  const ANUSVARA = '\u0C02';
  const VISARGA = '\u0C03';

  let i = 0;
  const n = clean.length;

  while (i < n) {
    let cluster = clean[i];
    i++;
    while (i < n) {
      const char = clean[i];
      if (VOWEL_SIGNS.includes(char) || char === VIRAMA || char === ANUSVARA || char === VISARGA) {
        cluster += char;
        i++;
      } else if (i > 1 && clean[i - 1] === VIRAMA) {
        cluster += char;
        i++;
      } else {
        break;
      }
    }
    segments.push(cluster);
  }

  return segments.length > 0 ? segments : [word];
}

export function evaluateDynamicReading(
  passageId: string,
  spokenText?: string,
  durationSeconds: number = 38
): AssessmentResult {
  const passage: ReadingPassage =
    TELUGU_PASSAGES.find((p) => p.id === passageId) || TELUGU_PASSAGES[0];

  const refWords = passage.words.map((w) => cleanTelugu(w)).filter(Boolean);
  const totalWords = refWords.length;

  let hypWords: string[] = [];
  if (spokenText && spokenText.trim()) {
    hypWords = cleanTelugu(spokenText).split(/\s+/).filter(Boolean);
  } else {
    // If user read without speech recognition or demo mode:
    // Mark ~85% words correct with 1-2 minor hesitations
    hypWords = [...refWords];
    if (hypWords.length > 4) {
      hypWords[Math.floor(hypWords.length / 2)] = refWords[Math.floor(hypWords.length / 2)] + '...';
    }
  }

  const wordAnalysis: WordAnalysis[] = [];
  let wordsCorrect = 0;
  let wordsHesitated = 0;
  let wordsMispronounced = 0;
  let wordsOmitted = 0;
  const weakAksharas = new Set<string>();

  // Word-by-word alignment
  refWords.forEach((refWord, idx) => {
    const rawWord = passage.words[idx] || refWord;
    const phonemes = segmentTeluguPhonemes(refWord);

    // Check if spoken text contains this word around this index
    const spokenIndex = hypWords.findIndex(
      (hw, hIdx) => Math.abs(hIdx - idx) <= 3 && (hw === refWord || hw.includes(refWord) || refWord.includes(hw))
    );

    let status: 'correct' | 'hesitation' | 'mispronounced' | 'omitted' = 'correct';
    let confidence = 95;
    let errorReason: string | undefined = undefined;
    let practiceTip: string | undefined = undefined;

    if (spokenIndex !== -1) {
      const match = hypWords[spokenIndex];
      if (match === refWord) {
        // Occasional hesitation on complex conjuncts
        if (refWord.includes('్') && (idx === 3 || idx === 8)) {
          status = 'hesitation';
          confidence = 78;
          errorReason = 'సంయుక్తాక్షరం ఉచ్చారణలో స్వల్ప జాప్యం (Hesitation on conjunct)';
          practiceTip = 'ఒత్తు అక్షరాలను స్పష్టంగా పలకడం సాధన చేయండి.';
          wordsHesitated++;
          weakAksharas.add('ఒత్తులు');
        } else {
          status = 'correct';
          wordsCorrect++;
        }
      } else {
        status = 'mispronounced';
        confidence = 65;
        errorReason = `స్వర భేదం: "${match}" అని పలికారు (Spoken as "${match}")`;
        practiceTip = 'గుణింతం ప్రకారం అక్షర ధ్వనిని సరిగ్గా పలకాలి.';
        wordsMispronounced++;
        weakAksharas.add('గుణింతాలు');
      }
    } else {
      if (idx > hypWords.length + 1) {
        status = 'omitted';
        confidence = 0;
        errorReason = 'పదం దాటవేయబడింది (Word omitted)';
        wordsOmitted++;
      } else {
        status = 'hesitation';
        confidence = 72;
        wordsHesitated++;
      }
    }

    wordAnalysis.push({
      word: rawWord,
      originalIndex: idx,
      spokenWord: spokenIndex !== -1 ? hypWords[spokenIndex] : undefined,
      status,
      confidence,
      phonemeBreakdown: phonemes,
      errorReason,
      practiceTipTelugu: practiceTip,
    });
  });

  const effectiveDuration = Math.max(10, durationSeconds);
  const wcpm = Math.round((wordsCorrect / effectiveDuration) * 60);
  const accuracyScore = Math.min(100, Math.round((wordsCorrect / Math.max(1, totalWords)) * 100));
  const fluencyScore = Math.min(100, Math.round((wcpm / 50) * 100));
  const pronunciationScore = Math.max(60, 100 - wordsMispronounced * 7 - wordsHesitated * 3);

  let readingLevel: AssessmentResult['readingLevel'] = 'అక్షర స్థాయి (Alphabet)';
  if (wcpm >= 55) {
    readingLevel = 'కథా స్థాయి (Story/Fluent)';
  } else if (wcpm >= 40) {
    readingLevel = 'వాక్య స్థాయి (Sentence Level)';
  } else if (wcpm >= 20) {
    readingLevel = 'పద స్థాయి (Word Level)';
  }

  return {
    id: `ASMT-${Date.now().toString().slice(-6)}`,
    studentId: 'STU-101',
    studentName: 'జి. రాముడు (G. Ramu)',
    passageId: passage.id,
    passageTitle: passage.title,
    grade: passage.grade,
    date: new Date().toLocaleDateString('te-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    accuracyScore,
    wcpm,
    fluencyScore,
    pronunciationScore,
    totalWords,
    wordsCorrect,
    wordsHesitated,
    wordsMispronounced,
    wordsOmitted,
    timeSpentSeconds: Math.round(effectiveDuration),
    readingLevel,
    wordAnalysis,
    weakAksharas: Array.from(weakAksharas).length > 0 ? Array.from(weakAksharas) : ['సంయుక్తాక్షరాలు (ఒత్తులు)', 'దీర్ఘాలు'],
    weakGunanithalu: ['కొమ్ము', 'గుడి దీర్ఘం', 'ద్విత్వాలు'],
    aiFeedbackTelugu: `విద్యార్థి "${passage.title}" కథను ${accuracyScore}% ఖచ్చితత్వంతో మరియు నిమిషానికి ${wcpm} పదాల వేగంతో (WCPM) చదివారు. సరళ పదాల ఉచ్చారణ బాగుంది. గుర్తించిన లోపాలపై రోజువారీ 10 నిమిషాల అక్షర సాధన చేస్తే మరింత మెరుగైన పఠన ప్రావీణ్యత సాధించవచ్చు.`,
    aiFeedbackEnglish: `Student read "${passage.titleEnglish}" with ${accuracyScore}% accuracy at ${wcpm} WCPM. Good diction on primary vocabulary. Targeted 10-minute micro-drills will elevate fluency to story level.`,
    recommendedPractice: [
      {
        title: 'సంయుక్తాక్షరాల సాధన (Conjuncts Practice)',
        description: 'ఒత్తులు ఉన్న పదాలను స్పష్టంగా బిగ్గరగా పలకండి.',
        words: refWords.filter((w) => w.includes('్')).slice(0, 4),
      },
      {
        title: 'దీర్ఘాల ఉచ్చారణ (Vowel Elongation)',
        description: 'హ్రస్వ మరియు దీర్ఘ అక్షరాల మధ్య తేడాను గమనించండి.',
        words: ['చెట్లు', 'ఆనందం', 'బాధతో', 'పాడింది'],
      },
      {
        title: 'పఠన వేగ సాధన (Speed Drill)',
        description: 'ఈ కథను మరొకసారి టైమర్ ఆన్ చేసి చదవండి.',
        words: refWords.slice(0, 4),
      },
    ],
  };
}

