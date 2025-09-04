from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import json
import os

app = FastAPI(
    title="Fragrance Recommender API",
    description="API for fragrance recommendations based on user preferences",
    version="1.0.0"
)

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "https://*.vercel.app", "https://*.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class QuizResponse(BaseModel):
    context: str
    season: str
    projection: str
    longevity: str
    style: List[str]
    budget: int
    allergies: Optional[List[str]] = []

class Fragrance(BaseModel):
    id: int
    name: str
    brand: str
    price: float
    notes: List[str]
    projection: str
    longevity: str
    season: List[str]
    context: List[str]
    style: List[str]
    description: str
    image_url: Optional[str] = None

class RecommendationResponse(BaseModel):
    real_deal: List[Fragrance]
    budget_alternatives: List[Fragrance]

# Sample fragrance database
SAMPLE_FRAGRANCES = [
    {
        "id": 1,
        "name": "Bleu de Chanel",
        "brand": "Chanel",
        "price": 135.0,
        "notes": ["Bergamot", "Grapefruit", "Mint", "Pink Pepper", "Cedar", "Labdanum"],
        "projection": "moderate",
        "longevity": "6-8h",
        "season": ["spring", "summer", "fall"],
        "context": ["office", "casual", "date-night"],
        "style": ["fresh", "woody", "citrus"],
        "description": "A sophisticated and versatile fragrance perfect for any occasion."
    },
    {
        "id": 2,
        "name": "Sauvage",
        "brand": "Dior",
        "price": 95.0,
        "notes": ["Bergamot", "Pepper", "Ambroxan", "Cedar"],
        "projection": "strong",
        "longevity": "8h+",
        "season": ["all-year"],
        "context": ["casual", "date-night", "club"],
        "style": ["fresh", "woody"],
        "description": "A bold and modern fragrance with exceptional performance."
    },
    {
        "id": 3,
        "name": "Acqua di Gio",
        "brand": "Giorgio Armani",
        "price": 85.0,
        "notes": ["Bergamot", "Neroli", "Marine Notes", "Cedar", "Patchouli"],
        "projection": "low",
        "longevity": "4-6h",
        "season": ["spring", "summer"],
        "context": ["casual", "office"],
        "style": ["fresh", "citrus", "green"],
        "description": "A fresh and aquatic fragrance perfect for warm weather."
    },
    {
        "id": 4,
        "name": "La Nuit de L'Homme",
        "brand": "Yves Saint Laurent",
        "price": 75.0,
        "notes": ["Cardamom", "Bergamot", "Lavender", "Cedar", "Vetiver"],
        "projection": "moderate",
        "longevity": "6-8h",
        "season": ["fall", "winter"],
        "context": ["date-night", "casual"],
        "style": ["spicy", "woody"],
        "description": "A seductive and warm fragrance for evening wear."
    },
    {
        "id": 5,
        "name": "Club de Nuit Intense Man",
        "brand": "Armaf",
        "price": 35.0,
        "notes": ["Bergamot", "Lemon", "Black Pepper", "Birch", "Ambroxan"],
        "projection": "strong",
        "longevity": "8h+",
        "season": ["all-year"],
        "context": ["casual", "date-night", "club"],
        "style": ["fresh", "woody"],
        "description": "An affordable alternative to Creed Aventus with similar DNA."
    }
]

def match_fragrance(quiz: QuizResponse, fragrance: dict) -> float:
    """Calculate match score between quiz response and fragrance"""
    score = 0.0
    
    # Context match
    if quiz.context in fragrance["context"]:
        score += 2.0
    
    # Season match
    if quiz.season in fragrance["season"]:
        score += 1.5
    
    # Projection match
    if quiz.projection == fragrance["projection"]:
        score += 1.0
    
    # Longevity match
    if quiz.longevity == fragrance["longevity"]:
        score += 1.0
    
    # Style match
    style_matches = len(set(quiz.style) & set(fragrance["style"]))
    score += style_matches * 1.5
    
    # Budget consideration (lower score for expensive fragrances)
    if fragrance["price"] > quiz.budget:
        score -= 2.0
    elif fragrance["price"] <= quiz.budget * 0.7:
        score += 0.5
    
    # Allergy check
    for allergy in quiz.allergies:
        if allergy.lower() in [note.lower() for note in fragrance["notes"]]:
            score -= 5.0
    
    return score

@app.get("/")
async def root():
    return {"message": "Fragrance Recommender API"}

@app.post("/api/v1/intake", response_model=dict)
async def submit_quiz(quiz: QuizResponse):
    """Submit quiz responses and get recommendations"""
    try:
        # Calculate match scores for all fragrances
        scored_fragrances = []
        for fragrance in SAMPLE_FRAGRANCES:
            score = match_fragrance(quiz, fragrance)
            scored_fragrances.append((fragrance, score))
        
        # Sort by score (highest first)
        scored_fragrances.sort(key=lambda x: x[1], reverse=True)
        
        # Separate real deal and budget alternatives
        real_deal = []
        budget_alternatives = []
        
        for fragrance, score in scored_fragrances:
            if score > 0:  # Only include positive matches
                if fragrance["price"] <= quiz.budget:
                    real_deal.append(fragrance)
                else:
                    budget_alternatives.append(fragrance)
        
        return {
            "real_deal": real_deal[:3],  # Top 3 real deal
            "budget_alternatives": budget_alternatives[:3],  # Top 3 budget alternatives
            "query_id": f"query_{hash(str(quiz.dict()))}"
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/recommendations")
async def get_recommendations(
    context: str,
    season: str,
    projection: str,
    longevity: str,
    style: str,
    budget: int,
    allergies: str = ""
):
    """Get recommendations based on query parameters"""
    try:
        # Parse style and allergies
        style_list = [s.strip() for s in style.split(",")]
        allergies_list = [a.strip() for a in allergies.split(",")] if allergies else []
        
        quiz = QuizResponse(
            context=context,
            season=season,
            projection=projection,
            longevity=longevity,
            style=style_list,
            budget=budget,
            allergies=allergies_list
        )
        
        # Use the same logic as intake endpoint
        scored_fragrances = []
        for fragrance in SAMPLE_FRAGRANCES:
            score = match_fragrance(quiz, fragrance)
            scored_fragrances.append((fragrance, score))
        
        scored_fragrances.sort(key=lambda x: x[1], reverse=True)
        
        real_deal = []
        budget_alternatives = []
        
        for fragrance, score in scored_fragrances:
            if score > 0:
                if fragrance["price"] <= budget:
                    real_deal.append(fragrance)
                else:
                    budget_alternatives.append(fragrance)
        
        return {
            "real_deal": real_deal[:3],
            "budget_alternatives": budget_alternatives[:3]
        }
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/v1/fragrance/{fragrance_id}")
async def get_fragrance_details(fragrance_id: int):
    """Get detailed information about a specific fragrance"""
    fragrance = next((f for f in SAMPLE_FRAGRANCES if f["id"] == fragrance_id), None)
    if not fragrance:
        raise HTTPException(status_code=404, detail="Fragrance not found")
    
    # Find similar fragrances
    similar = []
    for f in SAMPLE_FRAGRANCES:
        if f["id"] != fragrance_id:
            # Simple similarity based on style overlap
            style_overlap = len(set(f["style"]) & set(fragrance["style"]))
            if style_overlap > 0:
                similar.append({**f, "similarity_score": style_overlap})
    
    similar.sort(key=lambda x: x["similarity_score"], reverse=True)
    
    return {
        "fragrance": fragrance,
        "similar_fragrances": similar[:3]
    }

@app.get("/api/v1/dupes/{fragrance_id}")
async def get_dupes(fragrance_id: int, budget: int = 100, n: int = 3):
    """Get budget alternatives for a specific fragrance"""
    target_fragrance = next((f for f in SAMPLE_FRAGRANCES if f["id"] == fragrance_id), None)
    if not target_fragrance:
        raise HTTPException(status_code=404, detail="Fragrance not found")
    
    # Find budget alternatives
    dupes = []
    for f in SAMPLE_FRAGRANCES:
        if f["id"] != fragrance_id and f["price"] <= budget:
            # Calculate similarity score
            style_overlap = len(set(f["style"]) & set(target_fragrance["style"]))
            context_overlap = len(set(f["context"]) & set(target_fragrance["context"]))
            season_overlap = len(set(f["season"]) & set(target_fragrance["season"]))
            
            similarity = style_overlap + context_overlap + season_overlap
            if similarity > 0:
                dupes.append({**f, "similarity_score": similarity})
    
    dupes.sort(key=lambda x: x["similarity_score"], reverse=True)
    
    return {"dupes": dupes[:n]}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
