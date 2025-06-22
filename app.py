from flask import Flask, request, jsonify
import json
from werkzeug.utils import secure_filename
import os
from prompt import get_new_json_single_edit, get_new_json_general

app = Flask(__name__)

def call_single_edit_agent(input_json_data, prompt, param='root_agent'):
    """
    This function simulates your custom Gemini agent processing.
    In a real application, you would replace this with your
    actual Gemini agent's interaction, which might involve:
    - Calling a Gemini API
    - Using a local ML model
    - Applying business rules based on the prompt

    Args:
        input_json_data (dict): The parsed JSON data from the input file.
        prompt (str): The prompt provided by the user.

    Returns:
        tuple: (updated_json_data (dict), context_of_changes (str))
    """
    updated_json_data = input_json_data.copy()
    context_of_changes = get_new_json_single_edit(input_json_data, param, prompt)
    # TODO: need to take in param to edit

    # Example: Modify JSON based on a simple prompt
    if "add_timestamp" in prompt.lower():
        import datetime
        updated_json_data["last_updated"] = datetime.datetime.now().isoformat()
        context_of_changes += "- Added 'last_updated' timestamp.\n"

    if "change_status_to_processed" in prompt.lower():
        if "status" in updated_json_data:
            updated_json_data["status"] = "processed"
            context_of_changes += "- Changed 'status' to 'processed'.\n"
        else:
            updated_json_data["status"] = "newly_processed"
            context_of_changes += "- Added 'status' as 'newly_processed'.\n"

    if "add_notes" in prompt.lower() and "notes_content" in prompt.lower():
        # Extract notes content from prompt (a more robust solution would use regex or a more structured prompt)
        try:
            notes_start = prompt.find("notes_content:") + len("notes_content:")
            notes_end = prompt.find("'", notes_start) # Assuming notes_content ends with a single quote for simplicity
            if notes_end == -1: # if no closing quote found, take till end
                notes_content = prompt[notes_start:].strip()
            else:
                notes_content = prompt[notes_start:notes_end].strip()
            updated_json_data["notes"] = notes_content
            context_of_changes += f"- Added notes: '{notes_content}'.\n"
        except Exception as e:
            context_of_changes += f"- Failed to add notes due to error: {e}.\n"


    if not context_of_changes:
        context_of_changes = "No specific changes requested or applied based on the prompt."

    return updated_json_data, context_of_changes

def call_general_agent(input_json_data, prompt):
    """
    This function simulates your custom Gemini agent processing.
    In a real application, you would replace this with your
    actual Gemini agent's interaction, which might involve:
    - Calling a Gemini API
    - Using a local ML model
    - Applying business rules based on the prompt

    Args:
        input_json_data (dict): The parsed JSON data from the input file.
        prompt (str): The prompt provided by the user.

    Returns:
        tuple: (updated_json_data (dict), context_of_changes (str))
    """
    updated_json_data = input_json_data.copy()
    context_of_changes = get_new_json_general(input_json_data, prompt)
    # TODO: need to take in param to edit

    # Example: Modify JSON based on a simple prompt
    if "add_timestamp" in prompt.lower():
        import datetime
        updated_json_data["last_updated"] = datetime.datetime.now().isoformat()
        context_of_changes += "- Added 'last_updated' timestamp.\n"

    if "change_status_to_processed" in prompt.lower():
        if "status" in updated_json_data:
            updated_json_data["status"] = "processed"
            context_of_changes += "- Changed 'status' to 'processed'.\n"
        else:
            updated_json_data["status"] = "newly_processed"
            context_of_changes += "- Added 'status' as 'newly_processed'.\n"

    if "add_notes" in prompt.lower() and "notes_content" in prompt.lower():
        # Extract notes content from prompt (a more robust solution would use regex or a more structured prompt)
        try:
            notes_start = prompt.find("notes_content:") + len("notes_content:")
            notes_end = prompt.find("'", notes_start) # Assuming notes_content ends with a single quote for simplicity
            if notes_end == -1: # if no closing quote found, take till end
                notes_content = prompt[notes_start:].strip()
            else:
                notes_content = prompt[notes_start:notes_end].strip()
            updated_json_data["notes"] = notes_content
            context_of_changes += f"- Added notes: '{notes_content}'.\n"
        except Exception as e:
            context_of_changes += f"- Failed to add notes due to error: {e}.\n"


    if not context_of_changes:
        context_of_changes = "No specific changes requested or applied based on the prompt."

    return updated_json_data, context_of_changes

# --- API Endpoint ---
@app.route('/process_json/single', methods=['POST'])
def process_json_single_edit():
    if 'json_file' not in request.files:
        return jsonify({"error": "No JSON file part in the request"}), 400

    json_file = request.files['json_file']
    prompt = request.form.get('prompt')

    if json_file.filename == '':
        return jsonify({"error": "No selected JSON file"}), 400

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    if json_file:
        try:
            # Read the JSON file content
            json_data_str = json_file.read().decode('utf-8')
            input_json_data = json.loads(json_data_str)

            # --- Call your custom Gemini agent logic ---
            updated_json, context_of_changes = call_single_edit_agent(input_json_data, prompt)

            return jsonify({
                "updated_json": updated_json,
                "context_of_changes": context_of_changes
            }), 200

        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON file format"}), 400
        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    else:
        return jsonify({"error": "An unexpected error occurred with the file upload"}), 500

@app.route('/process_json/general', methods=['POST'])
def process_json_general():
    if 'json_file' not in request.files:
        return jsonify({"error": "No JSON file part in the request"}), 400

    json_file = request.files['json_file']
    prompt = request.form.get('prompt')

    if json_file.filename == '':
        return jsonify({"error": "No selected JSON file"}), 400

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    if json_file:
        try:
            # Read the JSON file content
            json_data_str = json_file.read().decode('utf-8')
            input_json_data = json.loads(json_data_str)

            # --- Call your custom Gemini agent logic ---
            updated_json, context_of_changes = call_general_agent(input_json_data, prompt)

            return jsonify({
                "updated_json": updated_json,
                "context_of_changes": context_of_changes
            }), 200

        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON file format"}), 400
        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    else:
        return jsonify({"error": "An unexpected error occurred with the file upload"}), 500

if __name__ == '__main__':
    # You can change the host and port as needed
    app.run(debug=True, host='0.0.0.0', port=5000)