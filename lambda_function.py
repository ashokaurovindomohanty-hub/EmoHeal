import json
EMOTIONS = {
    "joy": ["happy", "joy", "excited", "great", "love", "wonderful", "awesome", "good", "delighted"],
    "sadness": ["sad", "depressed", "down", "lonely", "cry", "hurt", "tear", "gloomy"],
    "anger": ["angry", "mad", "furious", "annoyed", "irritated", "hate", "rage"],
    "fear": ["afraid", "scared", "anxious", "nervous", "worried", "panic", "frightened"],
    "surprise": ["surprised", "shocked", "amazed", "wow", "astonished", "unexpected"],
    "love": ["love", "adore", "affection", "caring", "heart", "cherish"]
}
def detect_emotion(text):
    text_low = text.lower()
    scores = {k: sum(word in text_low for word in v) for k, v in EMOTIONS.items()}
    max_score = max(scores.values())
    if max_score == 0:
        return "Neutral", 0.5
    emotion = max(scores, key=scores.get)
    confidence = min(0.99, 0.6 + (max_score / 3) * 0.2)
    return emotion.capitalize(), round(confidence, 2)
def lambda_handler(event, context):
    try:
        if "body" in event:
            body = event["body"]
            if isinstance(body, str):
                body = json.loads(body)
        else:
            body = event
        
        text = body.get("text", "")
        emotion, confidence = detect_emotion(text)
        
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"emotion": emotion, "confidence": confidence, "input": text})
        }
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
