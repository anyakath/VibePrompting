from google import genai
from dotenv import load_dotenv
import os

load_dotenv()

GEMINI_API_KEY=os.environ.get("GEMINI_API_KEY")

client = genai.Client(api_key=GEMINI_API_KEY)

def get_response(prompt):
    return client.models.generate_content(
        model="gemini-2.0-flash", contents=prompt
    ).text

def generate_prompt(json, param, instruction):
    prompt = f"""
    You are an expert prompt engineer. You are given the following JSON:

    {json}

    Your task is:

    Only update the value of "{param}" based on this instruction:
    {instruction}

    Do not modify any other lines, spacing, indentation, or trailing commas in the JSON.

    Do not reorder keys or change formatting.

    Do not reformat the JSON or adjust quotes.

    Return the entire JSON with only that single change applied.
    """

    return prompt

def get_new_json(input_json, param, instruction):
    prompt = generate_prompt(str(input_json), param, instruction)
    response = get_response(prompt)
    response_lines = response.split('\n')[1:-1] 
    # don't use first and last line, which contains ```json and ```
    return '\n'.join(response_lines)
