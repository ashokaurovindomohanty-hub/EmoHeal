import json
def lambda_handler(event, context):
    try:
        body = json.loads(event.get('body', '{}')) if isinstance(event.get('body'), str) else event.get('body', {})
        text = body.get('text', '')
        text_lower = text.lower()
        if any(w in text_lower for w in ['angry','furious','mad']):
            emotion="Anger"
        elif any(w in text_lower for w in ['sad','depressed','down']):
            emotion="Sadness"
        elif any(w in text_lower for w in ['happy','joy','great']):
            emotion="Joy"
        elif any(w in text_lower for w in ['anxious','worried','stress']):
            emotion="Anxiety"
        else:
            emotion="Neutral"
        return {'statusCode':200,'headers':{'Access-Control-Allow-Origin':'*'},'body':json.dumps({'emotion':emotion,'input':text})}
    except Exception as e:
        return {'statusCode':500,'body':json.dumps({'error':str(e)})}
