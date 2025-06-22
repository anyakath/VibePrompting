import os
from google.adk.agents import Agent
from hotels_com_api_agent.tools.search_hotel_destination_endpoint import search_hotel_destination_endpoint
from hotels_com_api_agent.tools.search_hotels_endpoint import search_hotels_endpoint
from hotels_com_api_agent.tools.get_hotel_details_endpoint import get_hotel_details_endpoint
import json
from os import path

basepath = path.dirname(__file__)
filepath = path.abspath(path.join(basepath, "agent.json"))

with open(filepath) as json_data:
  data = json.load(json_data)
  PROMPT = data['agents']['root_agent']
  json_data.close()

MODEL_ID = os.getenv("MODEL_ID")

root_agent = Agent(
  name="hotels_com_api_agent",
  model="gemini-2.0-flash-lite",
  description="BookingCOM API Agent",
  instruction=PROMPT,
  tools=[search_hotels_endpoint, search_hotel_destination_endpoint, get_hotel_details_endpoint],
)