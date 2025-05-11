# LangChain Chatbot

A simple chatbot application using LangChain and OpenAI API.

## Features

- Frontend built with TypeScript and React
- Backend using FastAPI and LangChain
- Chat functionality powered by OpenAI API

## Project Structure

- `src/` - React frontend source code
- `app/api/` - FastAPI backend source code
- `public/` - Static assets
- `build/` - Built frontend (for production)

## Prerequisites

- Node.js (v14 or higher)
- Python (v3.13.3)
- OpenAI API key

## Setup

### Environment Variables

Create a `.env` file in the root directory with the following content:

```
OPENAI_API_KEY=your_openai_api_key_here
```

### Backend Setup

1. Install the required Python packages:

```bash
pip install -r requirements.txt
```

2. Start the FastAPI server:

```bash
cd backend
python run.py
```

The server will run at http://localhost:8000 by default.

### Frontend Setup

1. Install the required npm packages:

```bash
npm install
```

2. Start the React application:

```bash
npm start
```

The application will run at http://localhost:3000 by default.

## Usage

1. Access http://localhost:3000 in your browser.
2. Enter a message in the chat box and send it.
3. View the AI response.

## Notes

- This application is created for demonstration and educational purposes.
- Using the OpenAI API requires an API key and account.
- Charges may apply depending on API usage. 