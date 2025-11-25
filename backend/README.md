# LeetVisual Backend

## Setup Instructions

1. Clone the repo and navigate to the `backend` folder.
2. Copy `.env.example` to `.env` and fill in your RapidAPI key (or leave blank for mock mode).
3. Run `npm install` to install dependencies.
4. Start the server:
   - Development: `npm run dev`
   - Production: `npm start`

## Mock Mode
If `RAPIDAPI_KEY` is missing in `.env`, code execution will always return a mock response.

## Judge0 Integration
To enable real code execution, add your RapidAPI key to `.env`:
```
RAPIDAPI_KEY=YOUR_KEY
JUDGE0_API_URL=https://judge0-ce.p.rapidapi.com/submissions
PORT=5000
```

## Example API Requests

### Get all problems
```
GET /problems
```

### Get problem details
```
GET /problem/:id
```

### Get visualization steps
```
GET /visualization/:id
```

### Execute code
```
POST /execute
{
  "language": "cpp",
  "code": "#include <bits/stdc++.h> ...",
  "input": "2\n7"
}
```

---
