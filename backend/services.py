import requests
from config import SERPAPI_KEY, SERPAPI_URL, gemini_model

def fetch_top_shops(city, category, top_n=20):
    if not SERPAPI_KEY:
        return {"markers": [], "brand_counts": {}}

    params = {
        "engine": "google_maps",
        "q": f"{category} in {city}",
        "type": "search",
        "api_key": SERPAPI_KEY,
    }

    try:
        resp = requests.get(SERPAPI_URL, params=params, timeout=10)
        data = resp.json()
        
        markers = []
        brand_counts = {}

        for item in data.get("local_results", []):
            title = item.get("title", "Unknown Shop")
            
            # 1. Existing Brand Extraction
            brand_name = title.split(' ')[0].capitalize() 
            brand_counts[brand_name] = brand_counts.get(brand_name, 0) + 1
            
            # 2. Existing Coordinate Extraction
            coords = item.get("gps_coordinates", {})
            
            # --- NEW/REFINED IMAGE AND LINK LOGIC ---
            # Extract the actual shop image provided by SerpApi
            shop_image = item.get("thumbnail") or "https://via.placeholder.com/400x300?text=No+Image"
            
            # Extract the direct Google Maps link
            place_id = item.get("place_id")
            # Priority: Direct link -> Maps link -> Fallback search via Place ID
            shop_link = item.get("link") or item.get("maps_link") or \
                        (f"https://www.google.com/maps/search/?api=1&query=Google&query_place_id={place_id}" if place_id else "#")

            markers.append({
                "title": title,
                "brand": brand_name,
                "lat": coords.get("latitude"),
                "lng": coords.get("longitude"),
                "address": item.get("address"),
                "rating": item.get("rating"),
                "reviews_count": item.get("reviews"),
                "thumbnail": shop_image, # Use this in your frontend <img> tag
                "link": shop_link,       # Use this in your frontend <a> tag
            })

        return {
            "markers": markers[:top_n],
            "brand_counts": dict(sorted(brand_counts.items(), key=lambda x: x[1], reverse=True))
        }

    except Exception as e:
        print(f"Error fetching shops: {e}")
        return {"markers": [], "brand_counts": {}}
    
# -------- Gemini AI (Stays same) --------
def generate_ai_insights(data):
    if not gemini_model:
        return "AI insights unavailable."

    try:
        prompt = f"Analyze business potential using this data: {data}. Respond in 4–5 concise sentences."
        response = gemini_model.generate_content(prompt)
        return getattr(response, "text", "AI response unavailable.")
    except Exception as e:
        print(f"Gemini Error: {e}")
        return "AI strategic insight is currently being calculated. Please check back shortly."