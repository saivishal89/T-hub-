export interface GameLevel {
  id: number;
  titleTe: string;
  titleEn: string;
  stageNameTe: string;
  stageNameEn: string;
  topicTe: string;
  topicEn: string;
  requiredStars: number;
  earnedStars: number;
  xpReward: number;
  status: 'locked' | 'unlocked' | 'completed';
  concept: 'aksharam' | 'gunintham' | 'otthulu' | 'sentence' | 'story';
  targetLetters: string[];
  quizzes: GameQuiz[];
}

export interface GameQuiz {
  id: string;
  type: 'match_pair' | 'listen_and_pick' | 'speak_challenge';
  instructionTe: string;
  instructionEn: string;
  pairs?: {
    left: { id: string; text: string; icon: string; audioText: string };
    right: { id: string; text: string; audioText: string };
  }[];
  options?: {
    id: string;
    text: string;
    icon?: string;
    isCorrect: boolean;
  }[];
  challengeWord?: {
    word: string;
    phonetic: string;
    audioPrompt: string;
  };
}

export interface AnimalTeacher {
  id: 'tiggy' | 'mimi' | 'piku';
  nameTe: string;
  nameEn: string;
  speciesTe: string;
  speciesEn: string;
  taglineTe: string;
  taglineEn: string;
  colorScheme: {
    bg: string;
    accent: string;
    border: string;
    gradient: string;
  };
  uniformDesc: string;
  greetingTe: string;
  encouragementTe: string;
  praiseTe: string;
  gentleCorrectionTe: string;
}

export const ANIMAL_TEACHERS: Record<string, AnimalTeacher> = {
  tiggy: {
    id: 'tiggy',
    nameTe: 'టిగ్గీ సార్ (Tiggy)',
    nameEn: 'Tiggy the Tiger Teacher',
    speciesTe: 'చిరు పులిపిల్ల గురువు',
    speciesEn: 'Tiger Educator',
    taglineTe: 'ధైర్యంగా, ఉత్సాహంగా తెలుగు నేర్చుకుందాం!',
    taglineEn: 'Confident & energetic Telugu learning with high fives!',
    colorScheme: {
      bg: 'bg-amber-50',
      accent: 'text-amber-600',
      border: 'border-amber-300',
      gradient: 'from-amber-500 to-orange-600',
    },
    uniformDesc: 'Navy blue school uniform, white shirt, orange tie & school badge',
    greetingTe: 'నమస్కారం చిన్నారులూ! నా పేరు టిగ్గీ. ఈరోజు మనం అద్భుతమైన తెలుగు గేమ్ ఆడదాం! సిద్ధమా?',
    encouragementTe: 'సూపర్ ప్రయత్నం! ఇంకొక్కసారి ప్రయత్నించు, నువ్వు చేయగలవు!',
    praiseTe: 'అద్భుతం! శభాష్! నీకు 3 బంగారు నక్షత్రాలు వచ్చాయి! ⭐⭐⭐',
    gentleCorrectionTe: 'చిన్న పొరపాటు జరిగింది చిన్నా, నాతో పాటు కలిపి ఉచ్చరించు:',
  },
  mimi: {
    id: 'mimi',
    nameTe: 'మిమీ టీచర్ (Mimi)',
    nameEn: 'Mimi the Cat Teacher',
    speciesTe: 'తెలివైన పిల్లి గురువు',
    speciesEn: 'Kind Tabby Cat',
    taglineTe: 'శాంతంగా, ప్రేమగా ఒత్తులు & గుణింతాలు నేర్పిస్తాను!',
    taglineEn: 'Gentle, patient, step-by-step loving guidance.',
    colorScheme: {
      bg: 'bg-emerald-50',
      accent: 'text-emerald-600',
      border: 'border-emerald-300',
      gradient: 'from-emerald-500 to-teal-600',
    },
    uniformDesc: 'Orange checked shirt, round spectacles & blue textbook',
    greetingTe: 'హాయ్ బంగారం! నేను మీ మిమీ టీచర్‌ని. నెమ్మదిగా సరదాగా చదువుకుందాం రండి!',
    encouragementTe: 'చాలా బాగుంది నాన్నా, ఇంకొక్కసారి శ్రద్ధగా విను!',
    praiseTe: 'ఎంత ముద్దుగా చెప్పావో! చాలా గర్వంగా ఉంది!',
    gentleCorrectionTe: 'పరవాలేదు నాన్నా, ఈ అక్షరాన్ని ఇలా పలకాలి చూడండి:',
  },
  piku: {
    id: 'piku',
    nameTe: 'పీకూ గురువు (Piku)',
    nameEn: 'Piku the Parrot Master',
    speciesTe: 'రంగుల రామచిలుక గురువు',
    speciesEn: 'Colorful Parrot Master',
    taglineTe: 'పాటలతో, సరదా మాటలతో వేగంగా చదువుదాం!',
    taglineEn: 'Lively, joyful, and musical rhythm learning!',
    colorScheme: {
      bg: 'bg-sky-50',
      accent: 'text-sky-600',
      border: 'border-sky-300',
      gradient: 'from-sky-500 to-blue-600',
    },
    uniformDesc: 'Brown teacher blazer, round spectacles & wooden pointer',
    greetingTe: 'కలకలలాడే శుభోదయం! నేను మీ పీకూని! ఎగిరి గంతేసి తెలుగు పదాలు నేర్చుకుందామా!',
    encouragementTe: 'శభాష్ చిలకపలుకు! ఇంకొంచెం స్పష్టంగా చెప్పు!',
    praiseTe: 'వావ్! జెట్ స్పీడ్ తో చెప్పావు! యు ఆర్ ఎ సూపర్ స్టార్!',
    gentleCorrectionTe: 'నా ముక్కుతో చూపిస్తున్నా చూడు, ఈ శబ్దాన్ని నాతో పాడండి:',
  },
};

export const TELUGU_GAME_LEVELS: GameLevel[] = [
  {
    id: 1,
    titleTe: 'అక్షర వనం (Akshara Forest)',
    titleEn: 'Alphabet Forest',
    stageNameTe: 'దశ 1: ప్రాథమిక అచ్చులు',
    stageNameEn: 'Stage 1: Primary Vowels',
    topicTe: 'అ, ఆ, ఇ, ఈ పరిచయం',
    topicEn: 'Vowels & Sounds',
    requiredStars: 0,
    earnedStars: 3,
    xpReward: 30,
    status: 'completed',
    concept: 'aksharam',
    targetLetters: ['అ', 'ఆ', 'ఇ', 'ఈ'],
    quizzes: [
      {
        id: 'q1-1',
        type: 'match_pair',
        instructionTe: 'బొమ్మను సరైన తెలుగు పదంతో జతపరచండి',
        instructionEn: 'Match the picture with the correct Telugu word',
        pairs: [
          { left: { id: 'p1', text: 'అమ్మ', icon: '👩‍👧', audioText: 'అమ్మ' }, right: { id: 'p1', text: 'అ - అమ్మ (Mother)', audioText: 'అ - అమ్మ' } },
          { left: { id: 'p2', text: 'ఆవు', icon: '🐄', audioText: 'ఆవు' }, right: { id: 'p2', text: 'ఆ - ఆవు (Cow)', audioText: 'ఆ - ఆవు' } },
          { left: { id: 'p3', text: 'ఇల్లు', icon: '🏡', audioText: 'ఇల్లు' }, right: { id: 'p3', text: 'ఇ - ఇల్లు (House)', audioText: 'ఇ - ఇల్లు' } },
          { left: { id: 'p4', text: 'ఈగ', icon: '🪰', audioText: 'ఈగ' }, right: { id: 'p4', text: 'ఈ - ఈగ (Fly)', audioText: 'ఈ - ఈగ' } },
        ],
      },
    ],
  },
  {
    id: 2,
    titleTe: 'సరళ పదాల నది (Word River)',
    titleEn: 'Word River Flow',
    stageNameTe: 'దశ 2: రెండు అక్షరాల పదాలు',
    stageNameEn: 'Stage 2: 2-Letter Words',
    topicTe: 'పలక, వల, కలం',
    topicEn: 'Simple Everyday Words',
    requiredStars: 3,
    earnedStars: 3,
    xpReward: 40,
    status: 'completed',
    concept: 'aksharam',
    targetLetters: ['ప', 'ల', 'క', 'వ'],
    quizzes: [
      {
        id: 'q2-1',
        type: 'match_pair',
        instructionTe: 'వస్తువును దాని సరైన పేరుతో కలపండి',
        instructionEn: 'Match object to its correct Telugu name',
        pairs: [
          { left: { id: 'p1', text: 'కలం', icon: '✒️', audioText: 'కలం' }, right: { id: 'p1', text: 'క - లం (Pen)', audioText: 'కలం' } },
          { left: { id: 'p2', text: 'పడవ', icon: '⛵', audioText: 'పడవ' }, right: { id: 'p2', text: 'ప - డ - వ (Boat)', audioText: 'పడవ' } },
          { left: { id: 'p3', text: 'వల', icon: '🕸️', audioText: 'వల' }, right: { id: 'p3', text: 'వ - ల (Net)', audioText: 'వల' } },
          { left: { id: 'p4', text: 'పలక', icon: '📋', audioText: 'పలక' }, right: { id: 'p4', text: 'ప - ల - క (Slate)', audioText: 'పలక' } },
        ],
      },
    ],
  },
  {
    id: 3,
    titleTe: 'గుణింతాల కొండ (Gunintham Hill)',
    titleEn: 'Gunintham Hill Challenge',
    stageNameTe: 'దశ 3: గుణింతాల సాధన & ఫోనెటిక్స్',
    stageNameEn: 'Stage 3: Syllable Master Challenge',
    topicTe: 'త vs ట, ల vs ళ తేడాలు',
    topicEn: 'Acoustic Contrast Mastery',
    requiredStars: 6,
    earnedStars: 0,
    xpReward: 50,
    status: 'unlocked', // Active level
    concept: 'gunintham',
    targetLetters: ['త', 'ట', 'ల', 'ళ'],
    quizzes: [
      {
        id: 'q3-1',
        type: 'match_pair',
        instructionTe: 'జంతువు / పక్షి బొమ్మను సరైన తెలుగు పేరుతో జతపరచండి',
        instructionEn: 'Match the animal/bird picture to the correct Telugu word',
        pairs: [
          { left: { id: 'a1', text: 'తాబేలు', icon: '🐢', audioText: 'తాబేలు' }, right: { id: 'a1', text: 'తాబేలు (Tortoise - త శబ్దం)', audioText: 'తాబేలు' } },
          { left: { id: 'a2', text: 'టమాటా', icon: '🍅', audioText: 'టమాటా' }, right: { id: 'a2', text: 'టమాటా (Tomato - ట శబ్దం)', audioText: 'టమాటా' } },
          { left: { id: 'a3', text: 'లేడి', icon: '🦌', audioText: 'లేడి' }, right: { id: 'a3', text: 'లేడి (Deer - ల శబ్దం)', audioText: 'లేడి' } },
          { left: { id: 'a4', text: 'కోకిల', icon: '🐦', audioText: 'కోకిల' }, right: { id: 'a4', text: 'కోకిల (Cuckoo - కిలకిల)', audioText: 'కోకిల' } },
        ],
      },
      {
        id: 'q3-2',
        type: 'speak_challenge',
        instructionTe: 'మైక్రోఫోన్ నొక్కి ఈ పదాన్ని స్పష్టంగా చదవండి',
        instructionEn: 'Tap the mic and pronounce this word clearly',
        challengeWord: {
          word: 'తాబేలు',
          phonetic: 'Taa-bay-lu',
          audioPrompt: 'తాబేలు నెమ్మదిగా నడుస్తుంది. తాత, తాబేలు.',
        },
      },
    ],
  },
  {
    id: 4,
    titleTe: 'ఒత్తుల కోట (Otthulu Castle)',
    titleEn: 'Otthulu Castle',
    stageNameTe: 'దశ 4: సంయుక్తాక్షరాలు',
    stageNameEn: 'Stage 4: Conjunct Consonants',
    topicTe: 'క్క, త్త, ప్ప సాధన',
    topicEn: 'Geminate & Conjunct Sounds',
    requiredStars: 9,
    earnedStars: 0,
    xpReward: 60,
    status: 'locked',
    concept: 'otthulu',
    targetLetters: ['క్క', 'త్త', 'ప్ప'],
    quizzes: [],
  },
  {
    id: 5,
    titleTe: 'కథల లోయ (Story Valley)',
    titleEn: 'Story Valley - Fluent Reading',
    stageNameTe: 'దశ 5: కథా పఠనం & WCPM ఛాంపియన్',
    stageNameEn: 'Stage 5: Speed Reading Champion',
    topicTe: 'తెలివైన కాకి కథ',
    topicEn: 'Full SCERT Grade Passage',
    requiredStars: 12,
    earnedStars: 0,
    xpReward: 100,
    status: 'locked',
    concept: 'story',
    targetLetters: ['కథ'],
    quizzes: [],
  },
];
