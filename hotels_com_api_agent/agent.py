import os
from google.adk.agents import Agent
from hotels_com_api_agent.tools.hotels_search_endpoint import hotels_search_endpoint
from hotels_com_api_agent.tools.hotels_autocomplete_endpoint import hotels_autocomplete_endpoint
from hotels_com_api_agent.tools.hotels_reviews_summary_endpoint import hotels_review_summary_endpoint
import json
from os import path

basepath = path.dirname(__file__)
filepath = path.abspath(path.join(basepath, "prompts.json"))

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
  tools=[hotels_search_endpoint, hotels_autocomplete_endpoint, hotels_review_summary_endpoint],
)