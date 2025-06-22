import os
import requests
from typing import Dict
import json
from os import path

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
RAPIDAPI_HOST =  "booking-com15.p.rapidapi.com"

basepath = path.dirname(__file__)
filepath = path.abspath(path.join(basepath, "..", "prompts.json"))

with open(filepath) as json_data:
  data = json.load(json_data)
  PROMPT = data['tools']['search_hotel_destination_endpoint']
  json_data.close()

def search_hotel_destination_endpoint(query: str) -> Dict:
  f"{PROMPT}"

  url = f"https://{RAPIDAPI_HOST}/api/v1/hotels/searchDestination"

  querystring = {
    "query": query
  }

  headers = {
    "x-rapidapi-host": RAPIDAPI_HOST,
    "x-rapidapi-key": RAPIDAPI_KEY
  }

  response = requests.get(url, headers=headers, params=querystring)

  response.raise_for_status()

  return response.json()