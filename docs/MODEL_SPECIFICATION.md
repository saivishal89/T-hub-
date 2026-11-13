# Telugu AI Speech, ASR, TTS & Phonetic Model Specification
## Every Child Reads (ప్రతి బిడ్డ చదవాలి) – Telugu AI Engine
**Model Specification Version:** 3.2 | **Target Locale:** `te-IN` (Telugu - India)  
**Applicable Frameworks:** Microsoft Cognitive Speech Services, Murf Falcon 2.1, Unicode Grapheme Clustering  

---

## 1. Acoustic Model & Voice Synthesis Architecture

The platform integrates genuinely distinct neural voice models for primary education:

```
+-----------------------------------------------------------------------------------------+
|                               Telugu Voice Profiles Matrix                              |
+-------------------+----------------------+--------------------+-------------------------+
| Persona           | Engine Model         | Pitch / Rate       | Acoustic Characteristics|
+-------------------+----------------------+--------------------+-------------------------+
| Smt. Lakshmi      | te-IN-ShrutiNeural   | 0Hz / -3%          | Warm, encouraging, SGT  |
| (Female Teacher)  |                      |                    | maternal pedagogical    |
+-------------------+----------------------+--------------------+-------------------------+
| Sri Mohan /       | te-IN-MohanNeural    | -4Hz / -2%         | Deep, authoritative,    |
| Srinivas (Male)   |                      |                    | steady male educator    |
+-------------------+----------------------+--------------------+-------------------------+
| Ananya            | te-IN-ShrutiNeural   | +26Hz / +12%       | Youthful, energetic     |
| (Child Peer)      |                      |                    | classmate cadence       |
+-------------------+----------------------+--------------------+-------------------------+
| Anisha            | Murf Falcon 2.1      | Modern Indian      | Low-latency streaming,  |
| (Falcon AI)       |                      | Conversational     | crisp contemporary      |
+-------------------+----------------------+--------------------+-------------------------+
```

---

## 2. Telugu Phonology & Grapheme Clustering Engine

### 2.1 Unicode Telugu Cluster Segmentation
Telugu script features dependent vowel signs (మాత్రా చిహ్నాలు), virama (హలంత్ - `\u0C4D`), anusvara (పూర్ణానుస్వారం - `\u0C02`), and conjunct consonants (సంయుక్తాక్షరాలు, ద్విత్వాక్షరాలు). The engine parses words into phonemic syllables according to the rule:

$$\text{Syllable} = C_1 + (\text{Virama} + C_2)^* + (\text{VowelSign} \mid \text{Virama})? + (\text{Anusvara} \mid \text{Visarga})?$$

### 2.2 Minimal Phonetic Contrast Matrix for Primary Learners
Primary school children frequently confuse specific phonetic pairs. The engine explicitly flags and remediates these contrasts:

```
1. Dental vs. Retroflex Stops (దంత్య vs మూర్ధన్య ధ్వనులు):
   - /t/ (త - Dental) vs /ʈ/ (ట - Retroflex)
     * Rule: In 'త', the tongue tip touches the upper front teeth. In 'ట', the tongue curls backward against the hard palate.
     * Diagnostic Pair: 'తాత' (Grandfather) vs 'టమాటా' (Tomato).
   - /d/ (ద - Voiced Dental) vs /ɖ/ (డ - Voiced Retroflex)
     * Diagnostic Pair: 'దండ' (Garland) vs 'డబ్బా' (Container).

2. Nasals (నాసిక్య వ్యత్యాసం):
   - /n/ (న - Dental Nasal) vs /ɳ/ (ణ - Retroflex Nasal)
     * Diagnostic Pair: 'కన్ను' (Eye) vs 'బాణం' (Arrow) / 'వీణ' (Veena).

3. Lateral Approximants (పార్శ్విక ధ్వని వ్యత్యాసం):
   - /l/ (ల - Alveolar Lateral) vs /ɭ/ (ళ - Retroflex Lateral)
     * Rule: 'ల' is light/alveolar ('గాలి' - Air); 'ళ' requires curling the tongue back ('తాళం' - Lock, 'నీళ్లు' - Water).

4. Sibilants & Fricatives (ఊష్మ ధ్వనుల భేదం):
   - /ɕ/ (శ - Palatal) vs /ʂ/ (ష - Retroflex) vs /s/ (స - Dental)
     * Diagnostic Triple: 'శివుడు' (Palatal) vs 'భాష' (Retroflex) vs 'సంతోషం' (Dental).

5. Trills & Flaps (రేఫ-శకటరేఫ వ్యత్యాసం):
   - /r/ (ర - Alveolar Trill) vs /ɽ/ (ఱ - Retroflex Flap / బండిర)
     * Diagnostic Pair: 'రాయి' (Stone) vs 'గుఱ్ఱం' (Horse).

6. Vowel Quantity (హ్రస్వాలు vs దీర్ఘాలు):
   - Short vowels: అ, ఇ, ఉ, ఎ, ఒ
   - Long vowels: ఆ, ఈ, ఊ, ఏ, ఐ, ఓ, ఔ
   * Diagnostic: Children often omit elongation markers (e.g. reading 'లాడింది' as 'లడింది').
```

---

## 3. Levenshtein Dynamic Programming Speech Alignment

The alignment matrix between expected reference sequence $R = (r_1, r_2, \dots, r_m)$ and recognized spoken sequence $H = (h_1, h_2, \dots, h_n)$ is evaluated via recurrence:

$$D(i, j) = \begin{cases}
D(i-1, j-1) & \text{if } \text{clean}(r_i) = \text{clean}(h_j) \\
1 + \min \begin{cases} D(i-1, j) & (\text{Omission}) \\ D(i, j-1) & (\text{Insertion}) \\ D(i-1, j-1) & (\text{Mispronunciation}) \end{cases} & \text{otherwise}
\end{cases}$$

---

## 4. AI Reading Tutor Conversational Loop

1. **Prompt Generation:** Tutor announces the target word with model pronunciation in the selected voice (e.g., Smt. Lakshmi).
2. **Audio Capture:** Child reads aloud; speech is captured via browser Web Audio API.
3. **Phonetic Evaluation:** Backend checks exact match and minimal contrast error rules.
4. **Pedagogical Speech Generation:**
   - *Positive Reinforcement:* `"చాలా బాగా చదివావు! అద్భుతం. ఇప్పుడు నాతో కలిసి మళ్ళీ చదువు: [పదం]."`
   - *Gentle Correction:* `"పర్లేదు బంగారం! ఇంకోసారి ప్రయత్నిద్దాం. ‘త’ దంత్య ధ్వని... ఇప్పుడు అక్షరాలను నెమ్మదిగా నాతో పాటు పలుకు: తా, త."`
5. **Slow Syllable Repetition:** Decomposes word into isolated syllables with acoustic pauses.

