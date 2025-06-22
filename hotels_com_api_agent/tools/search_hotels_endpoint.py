import os
import requests
from typing import Dict
import json
from os import path

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
RAPIDAPI_HOST = "booking-com15.p.rapidapi.com"

basepath = path.dirname(__file__)
filepath = path.abspath(path.join(basepath, "..", "agent.json"))

with open(filepath) as json_data:
  data = json.load(json_data)
  PROMPT = data['tools']['search_hotels_endpoint']
  json_data.close()

def search_hotels_endpoint(dest_id: str, search_type: str, arrival_date: str, departure_date: str) -> Dict:
  f"{PROMPT}"
  
  url = f"https://{RAPIDAPI_HOST}/api/v1/hotels/searchHotels"

  querystring = {
    "dest_id": dest_id,
    "search_type": search_type,
    "arrival_date": arrival_date,
    "departure_date": departure_date,

  }

  headers = {
    "x-rapidapi-host": RAPIDAPI_HOST,
    "x-rapidapi-key": RAPIDAPI_KEY
  }

  response = requests.get(url, headers=headers, params=querystring)

  response.raise_for_status()

  return response.json()