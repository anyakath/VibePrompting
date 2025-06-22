from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os
import datetime # Used in your original your_gemini_agent_logic example
import subprocess # For running shell commands
import platform   # For detecting the operating system
import time       # For small delays

from prompt import get_new_json_single_edit, get_new_json_general

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', 'http://localhost:3000')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type,Authorization')
    response.headers.add('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS')
    response.headers.add('Access-Control-Allow-Credentials', 'true')
    return response

# --- Configuration for ADK Web Server ---
ADK_WEB_PORT = 8000  # Default port for 'adk web'. Adjust if yours is different.

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
    actual Gemini agent's interaction.
    """
    updated_json_data = input_json_data.copy()
    context_of_changes = get_new_json_general(input_json_data, prompt)
    # TODO: need to take in param to edit

    # Example: Modify JSON based on a simple prompt
    if "add_timestamp" in prompt.lower():
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
        try:
            notes_start = prompt.find("notes_content:") + len("notes_content:")
            notes_end = prompt.find("'", notes_start)
            if notes_end == -1:
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


# --- Helper Function to find and kill processes on a port ---
def _kill_process_on_port(port):
    print(f"Attempting to kill processes on port {port}...")
    if platform.system() == "Windows":
        print(f"  Platform: Windows")
        try:
            print(f"  Running netstat command...")
            # subprocess.check_output returns bytes by default, so decode it.
            output = subprocess.check_output(f"netstat -ano | findstr :{port}", shell=True).decode('utf-8')
            print(f"  netstat output received. Parsing PIDs...")
            pids = [line.strip().split()[-1] for line in output.splitlines() if line.strip()]
            for pid in set(pids):
                print(f"  Attempting to kill PID: {pid}")
                # taskkill also returns bytes, decode stderr if an error occurs.
                subprocess.run(f"taskkill /F /PID {pid}", shell=True, check=True, capture_output=True)
            print(f"  Successfully killed processes on port {port} (Windows).")
            return True
        except subprocess.CalledProcessError as e:
            # FIX: Check if e.stderr is None before decoding
            error_output = "No stderr output captured." # Default message if stderr is None
            if e.stderr is not None:
                error_output = e.stderr.decode('utf-8', errors='ignore')
            print(f"  Error running netstat/taskkill (Windows): {error_output.strip()}")
            return False
        except Exception as e:
            print(f"  Unexpected error in _kill_process_on_port (Windows): {e}")
            return False
    else: # macOS and Linux
        print(f"  Platform: macOS/Linux")
        try:
            print(f"  Running lsof command: sudo lsof -ti :{port}")
            lsof_cmd = f"sudo lsof -ti :{port}"
            # text=True captures stdout as a string. stderr will still be captured for CalledProcessError.
            pids_output = subprocess.check_output(lsof_cmd, shell=True, text=True).strip()
            print(f"  lsof output: '{pids_output}'")
            if not pids_output:
                print(f"  No process found on port {port}.")
                return True # No process to kill is a success

            pids = pids_output.splitlines()
            for pid in pids:
                print(f"  Attempting to kill PID: {pid} with 'sudo kill -9 {pid}'")
                # capture_output=True ensures stderr is captured as bytes.
                subprocess.run(f"sudo kill -9 {pid}", shell=True, check=True, capture_output=True)
            print(f"  Successfully killed processes on port {port} (macOS/Linux).")
            return True
        except subprocess.CalledProcessError as e:
            # FIX: Check if e.stderr is None before decoding
            error_output = "No stderr output captured." # Default message if stderr is None
            if e.stderr is not None:
                error_output = e.stderr.decode('utf-8', errors='ignore')
            print(f"  Error running lsof/kill (macOS/Linux): {error_output.strip()}")
            print("  This might be due to lack of sudo password or the command not being found.")
            return False
        except Exception as e:
            print(f"  Unexpected error in _kill_process_on_port (macOS/Linux): {e}")
            return False


# --- Helper Function to run ADK web in background ---
def _start_adk_web_in_background(adk_port):
    print(f"Starting 'adk web' in background on port {adk_port}...")

    cmd = f'adk web --port {adk_port}'

    creationflags = 0
    is_windows = platform.system() == "Windows"
    if is_windows:
        creationflags = subprocess.DETACHED_PROCESS

    try:
        # Use Popen to run in background and detach.
        # On Windows, close_fds cannot be True when redirecting standard handles.
        process = subprocess.Popen(cmd, shell=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL,
                                   stdin=subprocess.DEVNULL, close_fds=not is_windows,
                                   creationflags=creationflags)
        print(f"  'adk web' process started with PID: {process.pid}")
        return True
    except Exception as e:
        print(f"  Failed to start 'adk web': {e}")
        return False


# --- API Endpoint 1: Process JSON Single Edit ---
@app.route('/process_json/single_edit/<id>', methods=['POST'])
def process_json_single_edit(id):
    if 'json_file' not in request.files:
        return jsonify({"error": "No JSON file part in the request"}), 400

    json_file = request.files['json_file']
    prompt = request.form.get('prompt')
    param = request.form.get('param', 'root_agent')  # Default to 'root_agent' if not provided

    if json_file.filename == '':
        return jsonify({"error": "No selected JSON file"}), 400

    if not prompt:
        return jsonify({"error": "No prompt provided"}), 400

    if json_file:
        try:
            # Read the JSON file content
            json_data_str = json_file.read().decode('utf-8')
            input_json_data = json.loads(json_data_str)

            # --- Call your custom Gemini agent logic for single edit ---
            updated_json, context_of_changes = call_single_edit_agent(input_json_data, prompt, param)
            
            # Create history directory if it doesn't exist
            history_dir = "history"
            if not os.path.exists(history_dir):
                os.makedirs(history_dir)
            
            # Save the updated JSON to a file
            file_path = os.path.join(history_dir, f"{id}.json")
            with open(file_path, 'w') as f:
                # The returned 'context_of_changes' is actually the updated JSON string
                f.write(context_of_changes)

            return jsonify({
                "updated_json": json.loads(context_of_changes), # parse string to json
                "context_of_changes": "JSON processed and saved."
            }), 200

        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON file format"}), 400
        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    else:
        return jsonify({"error": "An unexpected error occurred with the file upload"}), 500

# --- API Endpoint 2: Process JSON General ---
@app.route('/process_json/general/<id>', methods=['POST'])
def process_json_general(id):
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

            # --- Call your custom Gemini agent logic for general ---
            updated_json, context_of_changes = call_general_agent(input_json_data, prompt)

            # Create history directory if it doesn't exist
            history_dir = "history"
            if not os.path.exists(history_dir):
                os.makedirs(history_dir)

            # Save the updated JSON to a file
            file_path = os.path.join(history_dir, f"{id}.json")
            with open(file_path, 'w') as f:
                # The returned 'context_of_changes' is actually the updated JSON string
                f.write(context_of_changes)

            return jsonify({
                "updated_json": json.loads(context_of_changes), # parse string to json
                "context_of_changes": "JSON processed and saved."
            }), 200

        except json.JSONDecodeError:
            return jsonify({"error": "Invalid JSON file format"}), 400
        except Exception as e:
            return jsonify({"error": f"An error occurred: {str(e)}"}), 500
    else:
        return jsonify({"error": "An unexpected error occurred with the file upload"}), 500

# --- API Endpoint 3: Get History ---
@app.route('/history/<id>', methods=['GET'])
def get_history(id):
    history_dir = "history"
    file_path = os.path.join(history_dir, f"{id}.json")

    if not os.path.exists(file_path):
        return jsonify({"error": "History not found for the given ID"}), 404

    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        return jsonify(data)
    except Exception as e:
        return jsonify({"error": f"An error occurred while reading the history file: {str(e)}"}), 500


# --- API Endpoint 4: Retrigger ADK Web Server ---
@app.route('/retrigger_adk_web', methods=['POST'])
def retrigger_adk_web():
    print(f"Received request to retrigger ADK web server on port {ADK_WEB_PORT}.")

    # 1. Attempt to kill existing ADK web server process
    kill_success = _kill_process_on_port(ADK_WEB_PORT)
    if not kill_success:
        print("  Warning: Failed to kill existing ADK web process, attempting restart anyway.")

    # Give a tiny moment for the port to free up if a process was just killed
    time.sleep(1)

    # 2. Start new ADK web server process
    start_success = _start_adk_web_in_background(ADK_WEB_PORT)

    if start_success:
        return jsonify({
            "status": "success",
            "message": f"Attempted to restart ADK web server on port {ADK_WEB_PORT}. Check ADK logs for status."
        }), 200
    else:
        return jsonify({
            "status": "error",
            "message": "Failed to start ADK web server. Check server logs for details."
        }), 500

if __name__ == '__main__':
    # You can change the host and port for your Flask app as needed
    # Ensure this port is DIFFERENT from ADK_WEB_PORT (e.g., 5000 for Flask, 8000 for ADK)
    app.run(debug=True, host='0.0.0.0', port=5000)