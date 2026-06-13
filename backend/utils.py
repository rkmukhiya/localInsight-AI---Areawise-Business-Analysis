import requests
import math
import numpy as np
from config import (
    GEOAPIFY_API_KEY,
    GEOAPIFY_PLACES_URL,
    GEOAPIFY_GEOCODE_URL,
    BUSINESS_DOMAINS
)

# -------------------------------
# Distance (Haversine)
# -------------------------------
def haversine(lat1, lon1, lat2, lon2):
    R = 6371000
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)

    a = (
        math.sin(dphi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2)
        * math.sin(dlambda / 2) ** 2
    )
    return 2 * R * math.atan2(math.sqrt(a), math.sqrt(1 - a))


# -------------------------------
# Generate unique POI key
# -------------------------------
def get_unique_place_key(props, lat, lon):
    """
    Ensures NO business is ignored.
    Uses place_id if available, otherwise falls back to name + coordinates.
    """
    if props.get("place_id"):
        return props["place_id"]

    name = props.get("name", "unknown").strip().lower()
    return f"{name}_{round(lat, 6)}_{round(lon, 6)}"


# -------------------------------
# Geocode location
# -------------------------------
def geocode_location(location: str):
    params = {
        "text": location,
        "limit": 1,
        "apiKey": GEOAPIFY_API_KEY
    }

    resp = requests.get(GEOAPIFY_GEOCODE_URL, params=params, timeout=30)
    resp.raise_for_status()
    data = resp.json()

    if not data.get("features"):
        raise ValueError("Location not found")

    lon, lat = data["features"][0]["geometry"]["coordinates"]
    return lat, lon


# -------------------------------
# Avg Nearest Neighbor Distance
# -------------------------------
def avg_nearest_neighbor_distance(points):
    if len(points) < 2:
        return 0

    distances = []
    for i, (lat1, lon1) in enumerate(points):
        min_dist = float("inf")
        for j, (lat2, lon2) in enumerate(points):
            if i != j:
                d = haversine(lat1, lon1, lat2, lon2)
                min_dist = min(min_dist, d)
        distances.append(min_dist)

    return round(sum(distances) / len(distances), 2)


# -------------------------------
# Subcategory Counts
# -------------------------------
def fetch_subcategory_counts(subcategories, lat, lon, radius=2000):
    results = {}

    for sub_cat in subcategories:
        unique_places = {}
        offset = 0
        limit = 100

        while True:
            params = {
                "categories": sub_cat,
                "filter": f"circle:{lon},{lat},{radius}",
                "type": "poi",
                "limit": limit,
                "offset": offset,
                "apiKey": GEOAPIFY_API_KEY
            }

            resp = requests.get(GEOAPIFY_PLACES_URL, params=params, timeout=30)
            if resp.status_code != 200:
                break

            features = resp.json().get("features", [])
            if not features:
                break

            for f in features:
                props = f.get("properties", {})
                coords = f.get("geometry", {}).get("coordinates")
                if not coords:
                    continue

                lon_poi, lat_poi = coords

                # Strict radius match
                if haversine(lat, lon, lat_poi, lon_poi) > radius:
                    continue

                pid = get_unique_place_key(props, lat_poi, lon_poi)
                unique_places[pid] = True

            if len(features) < limit:
                break

            offset += limit

        results[sub_cat] = len(unique_places)

    return results


# -------------------------------
# Fetch business counts
# -------------------------------
def fetch_business_counts(domain: str, location: str, radius=2000):

    if domain not in BUSINESS_DOMAINS:
        raise ValueError("Invalid business domain")

    center_lat, center_lon = geocode_location(location)
    area_sq_km = math.pi * (radius / 1000) ** 2

    category_results = {}

    for category in BUSINESS_DOMAINS[domain]["categories"]:
        unique_places = {}
        offset = 0
        limit = 100

        while True:
            params = {
                "categories": category,
                "filter": f"circle:{center_lon},{center_lat},{radius}",
                "type": "poi",
                "limit": limit,
                "offset": offset,
                "apiKey": GEOAPIFY_API_KEY
            }

            resp = requests.get(GEOAPIFY_PLACES_URL, params=params, timeout=30)
            if resp.status_code != 200:
                break

            features = resp.json().get("features", [])
            if not features:
                break

            for f in features:
                props = f.get("properties", {})
                coords = f.get("geometry", {}).get("coordinates")
                if not coords:
                    continue

                lon_poi, lat_poi = coords

                # Strict radius match
                if haversine(center_lat, center_lon, lat_poi, lon_poi) > radius:
                    continue

                pid = get_unique_place_key(props, lat_poi, lon_poi)
                if pid not in unique_places:
                    unique_places[pid] = (lat_poi, lon_poi)

            if len(features) < limit:
                break

            offset += limit

        locations = list(unique_places.values())
        count = len(locations)

        density = round(count / area_sq_km, 3)
        nn_distance = avg_nearest_neighbor_distance(locations)

        category_results[category] = {
            "count": count,
            "density_per_sq_km": density,
            "avg_nearest_neighbor_distance_m": nn_distance,
            "saturation_index": round(density / (nn_distance + 1), 5),
            "location_samples": locations[:3]
        }

    total_businesses = sum(c["count"] for c in category_results.values()) or 1
    for c in category_results.values():
        c["category_share"] = round(c["count"] / total_businesses, 3)

    return {
        "domain": domain,
        "location": location,
        "radius_meters": radius,
        "area_sq_km": round(area_sq_km, 2),
        "categories": category_results
    }

def make_json_safe(obj):
    """
    Converts non-JSON-serializable objects into safe formats
    (e.g., numpy, floats, None, sets)
    """
    if isinstance(obj, dict):
        return {k: make_json_safe(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [make_json_safe(v) for v in obj]
    elif isinstance(obj, (float, np.floating)):
        return float(obj)
    elif isinstance(obj, (int, np.integer)):
        return int(obj)
    elif obj is None:
        return None
    else:
        return str(obj) if "numpy" in str(type(obj)) else obj
