import requests
from flask import Flask, request, jsonify, render_template
app = Flask(__name__)
API_URL = "https://t41zcj5auj.execute-api.eu-north-1.amazonaws.com/prod/detectemotion"
@app.route("/")
def home():
    return render_template("index.html")
@app.route("/detect", methods=["POST"])
def detect():
    text = request.json.get("text", "")
    res = requests.post(API_URL, json={"text": text})
    return jsonify(res.json())
if __name__ == "__main__":
    app.run(debug=True)
