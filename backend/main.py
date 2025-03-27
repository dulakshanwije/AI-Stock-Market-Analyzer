from flask import Flask, jsonify, make_response, request
import requests
from dotenv import dotenv_values
from openai import OpenAI
from datetime import datetime, timedelta
from flask_cors import CORS

config = dotenv_values('.env')

app = Flask(__name__)

CORS(app, resources={
    r"/*": {"origins": ["http://localhost:5173"]}
})

openai = OpenAI(
    api_key = config['OPENAI_API_KEY']
)

@app.route('/ticker/<string:id>')
def get_daily_report(id):
    
    if not id:
        return make_response({
                "success":False,
                "error":"Invalid ticker ID"
            }, 400);
    
    if 'POLYGON_TOKEN' not in config:
        return make_response({
                "success":False,
                "error":"API token not configured."
            }, 500);    
    
    headers = {
        "accept": "application/json",
        "Authorization": f"Bearer {config['POLYGON_TOKEN']}"
    }
    
    current_day = datetime.now().date()
    current_day_str = current_day.strftime("%Y-%m-%d")

    past_day = current_day - timedelta(days=3)
    past_day_str = past_day.strftime("%Y-%m-%d")
    
    try:
        response = requests.get(f'https://api.polygon.io/v2/aggs/ticker/{id}/range/1/day/{past_day_str}/{current_day_str}/', headers=headers)
        
        response.raise_for_status()
        
        data = response.json()
        
        return jsonify({
            "success":True,
            "data": data
        })
        
    except requests.RequestException as e:
        return make_response(jsonify({
                "success":False,
                "error": "Failed to fetch data from Polygon API"
            }), 500)


@app.route('/report', methods =['POST'])
def generate_report():
    req = request.get_json()
    
    if not req:
        return make_response(jsonify({
                "success":False,
                "error":"Invalid request."
            }, 400))
        
    if 'query' not in req:
         return make_response(jsonify({
                "success":False,
                "error":"query paramter is required."
            }, 400))
    
    query = req['query']
    
    completion = openai.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {
                "role":"system",
                "content":"You are a trading guru. Given data on share prices over the past 3 days, write a single paragraph report of no more than 150 words describing the stocks performence and recommending whether to buy, hold or sell. Use simple fluent English and no text decorations."
            },
            {
                "role": "user",
                "content": f"{query}"
            }
        ]
    )

    data = completion.choices[0].message.content
    
    return make_response({
        "success": True,
        "result": data
    })

if __name__ == "__main__":
    app.run(debug=True);