import sys
from app.services.telugu_speech_engine import TeluguSpeechEngine

print("Testing Telugu Speech Engine on Python:", sys.version)

passage = "ఒక అడవిలో ఒక పెద్ద ఏనుగు ఉండేది. అది రోజూ చెట్లను విరిచేది."
res = TeluguSpeechEngine.evaluate_reading(
    passage_id="PSG-001",
    passage_title="చిన్న చీమ - పెద్ద ఏనుగు",
    grade=3,
    ref_text=passage,
    spoken_text=None,
    duration_seconds=12.5
)

print("Accuracy:", res["accuracyScore"])
print("WCPM:", res["wcpm"])
print("Reading Level:", res["readingLevel"])
print("Words Count:", res["totalWords"])
print("First Word Analysis:", res["wordAnalysis"][0])
print("SUCCESS!")

