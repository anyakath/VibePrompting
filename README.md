# VibePrompting for AI Agents

Transform your Google ADK agents with intelligent prompting and dynamic conversation flows.

## Features

- **AI Agent Enhancement**: Upload your Google ADK agent and enhance it with intelligent prompting capabilities
- **Dynamic Conversations**: Create branching conversation flows and dynamic agent responses
- **Real-time Processing**: Process and modify your agents in real-time with instant feedback
- **File Upload**: Upload ZIP files containing Google ADK agent folders for processing

## Getting Started

### Prerequisites

- Python 3.8+
- Node.js 18+
- Google ADK (Agent Development Kit)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd BerkeleyAI
```

2. Install backend dependencies:
```bash
pip install -r requirements.txt
```

3. Install frontend dependencies:
```bash
cd frontend
npm install
```

### Running the Application

1. Start the Flask backend:
```bash
python app.py
```

2. Start the Next.js frontend:
```bash
cd frontend
npm run dev
```

3. Open your browser and navigate to `http://localhost:3000`

## Usage

1. **Landing Page**: Visit the root URL to see the VibePrompting landing page
2. **Upload Agent**: Upload a ZIP file containing your Google ADK agent folder
3. **Process Agent**: Use the train interface to enhance your agent with intelligent prompting
4. **Navigate**: Use the navigation to switch between the landing page and the main application

## File Upload

The application accepts ZIP files containing Google ADK agent folders. The upload process:

1. Validates the file is a ZIP archive
2. Extracts the contents to a unique directory
3. Identifies agent configuration files
4. Stores the upload information for processing

## API Endpoints

- `POST /upload_agent` - Upload Google ADK agent ZIP file
- `POST /process_json/single_edit/<id>` - Process JSON with single edit mode
- `POST /process_json/general/<id>` - Process JSON with general mode
- `GET /history/<id>` - Retrieve processing history
- `POST /retrigger_adk_web` - Restart ADK web server

## Project Structure

```
├── app.py                 # Flask backend server
├── prompt.py             # Prompt processing logic
├── requirements.txt      # Python dependencies
├── uploads/             # Uploaded agent files
├── history/             # Processing history
└── frontend/            # Next.js frontend
    ├── app/             # App router pages
    ├── components/      # UI components
    └── lib/             # Utilities and types
```

## Technologies Used

- **Backend**: Flask, Python
- **Frontend**: Next.js 15, React 19, TypeScript
- **UI**: Tailwind CSS, Radix UI
- **Agent Framework**: Google ADK
