from google import genai
from dotenv import load_dotenv
import json

load_dotenv()

GEMINI_API_KEY="AIzaSyAQnxbGCFk1tlNWJy31g3g4ed7kaYl7ryE"

client = genai.Client(api_key=GEMINI_API_KEY)

def get_response(prompt):
    return client.models.generate_content(
        model="gemini-2.0-flash", contents=prompt
    ).text

# Note: I modified this prompt to not use single quotation marks, but since it only edits part of the JSON, it might screw up
def generate_prompt_single_edit(json, param, instruction):
    prompt = f"""
    You are an expert prompt engineer. You are given a JSON file that defines prompts for an AI agent and its tools. Read the JSON file carefully to understand what the AI agent is supposed to achieve. This is the JSON file:

    {json}

    Your task is to improve the workflow of this AI agent by editing the value of "{param}", following this instruction from the user: {instruction}.

    Guidelines:

    Do not modify any other lines, spacing, indentation, or trailing commas in the JSON.

    Do not use single quotation marks or apostrophes. Only use double quotation marks.

    Do not reorder keys or change formatting.

    Do not reformat the JSON.

    Return the entire JSON with only that single change applied.
    """

    return prompt


def generate_prompt_general_with_changelog(json, instruction):
    prompt = f"""
    You are an expert prompt engineer. You are given a JSON file that defines prompts for an AI agent and its tools. Read the JSON file carefully to understand what the AI agent is supposed to achieve. This is the JSON file:

    {json}

    Your task is to improve the workflow of this AI agent by editing the JSON file, following this instruction from the user: {instruction}.

    Guidelines:
    - Make only minimal, targeted changes necessary to follow the instruction.
    - Do not modify spacing, indentation, or trailing commas in the JSON.
    - Do not use single quotation marks or apostrophes. Only use double quotation marks.
    - Do not reorder keys or change formatting.
    - Do not add or remove any fields.
    - Do not reformat the JSON.

    After making the change, return:
    1. The entire new JSON in a code block (use ```json ... ```)
    2. On a new line, write CHANGELOG: followed by a short, plain English summary of what you changed (max 1-2 sentences).
    """
    return prompt

def edit_json_file(data):
    data = json.loads(data)
    with open("hotels_com_api_agent/agent.json", "w") as f:
        json.dump(data, f, indent=2)

def get_new_json_single_edit(input_json, param, instruction):
    prompt = generate_prompt_single_edit(str(input_json), param, instruction)
    response = get_response(prompt)

    # don't use first and last line, which contains ```json and ```
    response_lines = response.split('\n')[1:-1]
    if "```" in response_lines[0]:
        response_lines = response_lines[1:]

    final_response = '\n'.join(response_lines)
    edit_json_file(final_response)
    return final_response

def get_new_json_general(input_json, instruction):
    prompt = generate_prompt_general_with_changelog(str(input_json), instruction)
    response = get_response(prompt)

    # Split response into JSON and changelog
    json_part = None
    changelog = None
    lines = response.split('\n')
    in_json = False
    json_lines = []

    for line in lines:
        if line.strip().startswith('```json'):
            in_json = True
            continue
        if in_json and line.strip().startswith('```'):
            in_json = False
            continue
        if in_json:
            json_lines.append(line)
        if line.strip().startswith('CHANGELOG:'):
            changelog = line.strip().replace('CHANGELOG:', '').strip()
    json_part = '\n'.join(json_lines)

    edit_json_file(json_part)

    return json_part, changelog

def generate_summarize_prompt(changelog, max_words=6):
    return f"""
    You are an expert at summarizing changelogs. Given the following changelog, summarize the change in {max_words} words or less. The summary should be concise, clear, and describe exactly what was changed. Do not use filler words. Do not use punctuation unless necessary. Do not use single quotation marks or apostrophes. Only use double quotation marks. Do not include the word 'changelog' or any explanation. Only output the summary phrase, nothing else.

    Changelog:
    {changelog}
    """


def summarize_changes(prompt, context_of_changes=None):
    """
    Returns a short summary of the change for use as a node name.
    If context_of_changes is provided, use it; otherwise, use the prompt.
    Uses Gemini LLM to summarize to 6 words or less.
    """
    summary_source = context_of_changes if (context_of_changes and isinstance(context_of_changes, str)) else prompt

    try:
        summarize_prompt = generate_summarize_prompt(summary_source, max_words=6)
        summary = get_response(summarize_prompt).strip()
        # Only take the first line and trim to 6 words max (in case LLM over-responds)
        summary = ' '.join(summary.splitlines()[0].split()[:6])
        if summary:
            return summary
    except Exception as e:
        print(f"LLM summarization failed: {e}")
    # Fallback: use the first 6 words of the first non-empty line
    for line in summary_source.splitlines():
        line = line.strip('- ').strip()
        if line:
            return ' '.join(line.split()[:6])
    return ' '.join(prompt.strip().split()[:6])
