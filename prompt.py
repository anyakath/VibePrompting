from google import genai
from dotenv import load_dotenv
import os
import json

load_dotenv()

GEMINI_API_KEY="AIzaSyAQnxbGCFk1tlNWJy31g3g4ed7kaYl7ryE"

client = genai.Client(api_key=GEMINI_API_KEY)

def get_response(prompt):
    return client.models.generate_content(
        model="gemini-2.0-flash", contents=prompt
    ).text

def generate_prompt_single_edit(json, param, instruction):
    prompt = f"""
    You are an expert prompt engineer. You are given a JSON file that defines prompts for an AI agent and its tools. Read the JSON file carefully to understand what the AI agent is supposed to achieve. This is the JSON file:

    {json}

    Your task is to improve the workflow of this AI agent by editing the value of "{param}", following this instruction from the user: {instruction}.

    Guidelines:

    Do not modify any other lines, spacing, indentation, or trailing commas in the JSON.

    Do not use single quotation marks or apostrophes. Only use double quotation marks.

    Do not reorder keys or change formatting.

    Do not reformat the JSON or adjust quotes.

    Return the entire JSON with only that single change applied.
    """

    return prompt

def generate_prompt_general(json, instruction):
    prompt = f"""
    You are an expert prompt engineer. You are given a JSON file that defines prompts for an AI agent and its tools. Read the JSON file carefully to understand what the AI agent is supposed to achieve. This is the JSON file:

    {json}

    Your task is to improve the workflow of this AI agent by editing the JSON file, following this instruction from the user: {instruction}.

    Guidelines:

    Make only minimal, targeted changes necessary to follow the instruction.

    Do not modify spacing, indentation, or trailing commas in the JSON.

    Do not use single quotation marks or apostrophes. Only use double quotation marks.

    Do not reorder keys or change formatting.

    Do not add or remove any fields.

    Do not reformat the JSON or adjust quotes.

    Return the entire JSON.
    """

    return prompt

def edit_json_file(data):
    data = json.loads(data)
    with open("hotels_com_api_agent/agent.json", "w") as f:
        json.dump(data, f, indent=4)

def get_new_json_single_edit(input_json, param, instruction):
    prompt = generate_prompt_single_edit(str(input_json), param, instruction)
    response = get_response(prompt)
    response_lines = response.split('\n')[1:-1]
    # don't use first and last line, which contains ```json and ```
    final_response = '\n'.join(response_lines)
    edit_json_file(final_response)
    return final_response

def get_new_json_general(input_json, instruction):
    prompt = generate_prompt_general(str(input_json), instruction)
    response = get_response(prompt)
    response_lines = response.split('\n')[1:-1] 
    # don't use first and last line, which contains ```json and ```
    final_response = '\n'.join(response_lines)
    edit_json_file(final_response)
    return final_response
