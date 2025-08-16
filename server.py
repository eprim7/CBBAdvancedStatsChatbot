from flask import Flask, request, jsonify
from flask_cors import CORS
from get_data import get_all_stats
from run_chatbot import run_chatbot

app = Flask(__name__)
CORS(app, origins=["http://localhost:3000"])  # allow React dev server

@app.route("/api/stats", methods=["GET"])
def stats():
    try:
        data = get_all_stats()
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/chat", methods=['POST'])
def chatbot():
    try:
        data = request.get_json()
        user_message = data.get("text", "")
        response = run_chatbot(user_message)
        return jsonify({"response": response})
    except Exception as e:
        return {"error": 500}
        
    
if __name__ == "__main__":
    app.run(port=5000, debug=True)