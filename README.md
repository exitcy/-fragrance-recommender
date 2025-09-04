# Fragrance Recommender

A modern web application that recommends male fragrances based on user preferences through an interactive quiz.

## Features

- **Interactive Quiz**: Quick 6-8 question assessment covering vibe, season, context, projection, longevity, and budget
- **Smart Recommendations**: AI-powered fragrance suggestions with "Real Deal" and "Budget Alternatives"
- **Modern UI**: Clean, responsive design with smooth animations using Motion One
- **Detailed Results**: Expandable cards showing notes, dupes, and matching reasons

## Tech Stack

### Frontend
- React 18 with TypeScript
- Tailwind CSS for styling
- Motion One for animations
- Vite for build tooling

### Backend
- FastAPI with Python
- SQLite for data storage
- Pydantic for data validation

## Project Structure

```
fragrance-project/
├── frontend/          # React application
├── backend/           # FastAPI server
├── data/              # Fragrance database
└── README.md
```

## Quick Start

1. **Backend Setup**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload
   ```

2. **Frontend Setup**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

3. **Access the Application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## Development

- Backend runs on port 8000
- Frontend runs on port 5173
- API endpoints are prefixed with `/api/v1`

## Deployment

The project is configured for Vercel deployment with both frontend and backend components.
