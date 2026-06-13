from utils import fetch_business_counts, fetch_subcategory_counts, geocode_location
from config import BUSINESS_DOMAINS, SUBCATEGORY_MAPPING
import numpy as np

def calculate_market_gap_scores(categories):
    """Calculates gap scores using percentile normalization."""
    if not categories: return {}
    
    counts = np.array([v["count"] for v in categories.values()], dtype=float)
    densities = np.array([v["density_per_sq_km"] for v in categories.values()], dtype=float)
    distances = np.array([v["avg_nearest_neighbor_distance_m"] for v in categories.values()], dtype=float)
    saturations = np.array([v["saturation_index"] for v in categories.values()], dtype=float)
    shares = np.array([v["category_share"] for v in categories.values()], dtype=float)
    
    # Robust normaliztion technique
    # To reduce the influence of outliers
    def pnorm(arr, val):
        if len(arr) < 2: return 1.0
        p = np.percentile(arr, [1, 99])
        return np.clip((val - p[0]) / (p[1] - p[0]), 0, 1)

    scores = {}
    for cat, d in categories.items():
        n_count = 1 - pnorm(counts, d["count"])
        n_density = 1 - pnorm(densities, d["density_per_sq_km"])
        n_distance = pnorm(distances, d["avg_nearest_neighbor_distance_m"])
        n_saturation = 1 - pnorm(saturations, d["saturation_index"])
        n_share = 1 - pnorm(shares, d["category_share"])

        gap_score = (0.30 * n_distance + 0.25 * n_density + 0.20 * n_count + 
                     0.15 * n_saturation + 0.10 * n_share)
        scores[cat] = round(gap_score, 3)
    return scores

# market_gap.py additions
def get_market_analysis_logic(domain: str, location: str):
    """Programmatic version of market analysis for API use."""
    # 1. Fetch and Score Major Categories
    result = fetch_business_counts(domain, location)
    gap_scores = calculate_market_gap_scores(result["categories"])
    ranked = sorted(gap_scores.items(), key=lambda x: x[1], reverse=True)
    
    top_cat = ranked[0][0]
    top_score = ranked[0][1]

    # 2. Subcategory Deep Dive
    niche_name = top_cat
    comp_count = result["categories"][top_cat]["count"]

    if top_cat in SUBCATEGORY_MAPPING:
        lat, lon = geocode_location(location)
        sub_results = fetch_subcategory_counts(SUBCATEGORY_MAPPING[top_cat], lat, lon)
        if sub_results:
            recommended_sub = min(sub_results, key=sub_results.get)
            niche_name = recommended_sub.split('.')[-1].replace('_', ' ').title()
            comp_count = sub_results[recommended_sub]

    return {
        "location": location,
        "major_sector": top_cat,
        "niche": niche_name,
        "gap_score": top_score,
        "competitor_count": comp_count,
        "area_sq_km": result["area_sq_km"],
        "status": "High Opportunity" if top_score >= 0.75 else "Moderate"
    }

def run_app():
    # Phase 1: Member A's task
    market_data = get_market_analysis_logic()
    
    # Phase 2 Preview: Member B's task (Terminal placeholder)
    print("\n" + "="*50)
    print(f"📊 DATA DELIVERED TO PHASE 2:")
    print(f"Location: {market_data['location']}")
    print(f"Best Opportunity: {market_data['niche']}")
    print(f"Gap Score: {market_data['gap_score']}")
    print(f"Competitors in Area: {market_data['competitor_count']}")
    print("="*50)
    
    print("\n✅ Success: Data package is now ready for business_logic.py implementation.")

if __name__ == "__main__":
    run_app()