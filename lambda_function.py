import json
EMOTIONS = {
    "joy": ["happy", "joy", "excited", "great", "love", "wonderful", "awesome"],
    "sadness": ["sad", "depressed", "down", "lonely", "cry", "hurt"],
    "anger": ["angry", "mad", "furious", "annoyed", "irritated"],
    "fear": ["afraid", "scared", "anxious", "nervous", "worried"],
    "surprise": ["surprised", "shocked", "amazed", "wow"],
    "love": ["love", "adore", "affection", "caring"]
}
def detect_emotion(text):
    text_low = text.lower()
    scores = {k: sum(word in text_low for word in v) for k, v in EMOTIONS.items()}
    emotion = max(scores, key=scores.get)
    if max(scores.values()) == 0:
        return "Neutral"
    return emotion.capitalize()
def lambda_handler(event, context):
    try:
        # Handle API Gateway (body is string) and direct invoke (body is dict)
        if "body" in event:
            body = event["body"]
            if isinstance(body, str):
                body = json.loads(body)
        else:
            body = event
        
        text = body.get("text", "")
        emotion = detect_emotion(text)
        
        return {
            "statusCode": 200,
            "headers": {"Access-Control-Allow-Origin": "*"},
            "body": json.dumps({"emotion": emotion, "input": text})
        }
    except Exception as e:
        return {"statusCode": 500, "body": json.dumps({"error": str(e)})}
