import os
import requests
from typing import Dict
import json
from os import path

RAPIDAPI_KEY = os.getenv("RAPIDAPI_KEY")
RAPIDAPI_HOST = "hotels-com6.p.rapidapi.com"

basepath = path.dirname(__file__)
filepath = path.abspath(path.join(basepath, "..", "prompts.json"))

with open(filepath) as json_data:
  data = json.load(json_data)
  PROMPT = data['tools']['hotels_search_endpoint']
  json_data.close()

# Change the Args to Match the Tool Name and Parameters
def hotels_search_endpoint(location_id: str, checkin_date: str, checkout_date: str) -> Dict:
  f"{PROMPT}"

  url = f"https://{RAPIDAPI_HOST}/hotels/search"

  querystring = {
    "locationId": location_id,
    "checkinDate": checkin_date,
    "checkoutDate": checkout_date,
  }

  headers = {
    "x-rapidapi-host": RAPIDAPI_HOST,
    "x-rapidapi-key": RAPIDAPI_KEY
  }

  response = requests.get(url, headers=headers, params=querystring)

  response.raise_for_status()

  return response.json()