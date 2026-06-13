import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()

# -------- API Keys --------
SERPAPI_KEY = os.getenv("SERP_API_KEY")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

# -------- Geoapify --------
GEOAPIFY_API_KEY = os.getenv("GEOAPIFY_API_KEY")
GEOAPIFY_PLACES_URL = "https://api.geoapify.com/v2/places"
GEOAPIFY_GEOCODE_URL = "https://api.geoapify.com/v1/geocode/search"
SERPAPI_URL = "https://serpapi.com/search"

# -------- Business Domains --------
BUSINESS_DOMAINS = {
    "food": {
        "code": "FD",
        "label": "Food & Beverage",
        "categories": [
            "catering.restaurant",
            "catering.cafe",
            "catering.fast_food",
            "catering.food_court",
            # "catering.ice_cream",
        ]
    },
    "shopping": {
        "code": "SH",
        "label": "Retail & Shopping",
        "categories": [
            "commercial.supermarket",
            "commercial.clothing",
            "commercial.shopping_mall",
            "commercial.books",
            "commercial.elektronics",
            "commercial.health_and_beauty",
            "commercial.jewelry"
        ]
    },
    "healthcare": {
        "code": "HC",
        "label": "Healthcare",
        "categories": [
            "healthcare.pharmacy",
            "healthcare.hospital",
            "healthcare.clinic",
            "healthcare.dentist"
        ]
    },
    "education": {
        "code": "EDU",
        "label": "Education",
        "categories": [
            "education.school",
            "education.college",
            "education.university",
            "education.library"
        ]
    },
    "professional_services": {
        "code": "PS",
        "label": "Professional Services",
        "categories": [
            "office.company",
            "office.coworking",
            "service.bank"
        ]
    },
    "personal_services": {
        "code": "PRS",
        "label": "Personal Services",
        "categories": [
            "service.hairdresser",
            "service.beauty",
            "service.laundry",
            "service.vehicle",
            "service.travel_agency",
            "service.tailor",
            "service.estate_agent",
            "service.social_facility"
        ]
    },
    "hospitality": {
        "code": "HOS",
        "label": "Hospitality & Stay",
        "categories": [
            "accommodation.hotel",
            "accommodation.hostel",
            "accommodation.guest_house"
        ]
    }
}

# Add this mapping to your config.py
SUBCATEGORY_MAPPING = {
    # --- Food & Beverage ---
    "catering.restaurant": [
        "catering.restaurant.pizza",
        "catering.restaurant.burger",
        "catering.restaurant.italian",
        "catering.restaurant.indian",
        "catering.restaurant.seafood"
    ],
    "catering.cafe": [
        "catering.cafe.coffee_shop",
        "catering.cafe.tea_house"
    ],
    "catering.fast_food": [
        "catering.fast_food.sandwich",
        "catering.fast_food.bakery",
        "catering.fast_food.chicken"
    ],
    "commercial.health_and_beauty": [
        "commercial.health_and_beauty.optician",
        "commercial.health_and_beauty.cosmetics",
        "commercial.health_and_beauty.hairdresser_supplies"
    ],
    "commercial.shopping_mall": [
        "commercial.shopping_mall.department_store",
        "commercial.shopping_mall.boutique"
    ],
    "commercial.elektronics": [
        "commercial.elektronics.mobile_phones",
        "commercial.elektronics.computers",
        "commercial.elektronics.video_games"
    ],
    "commercial.supermarket": [
        "commercial.supermarket.convenience",
        "commercial.supermarket.kiosk"
    ],
    "commercial.books": [
        "commercial.books.newsagent",
        "commercial.books.stationery"
    ],
    "commercial.jewelry": [
        "commercial.jewelry.watch",
        "commercial.jewelry.antiques"
    ],
    "commercial.clothing": [
        "commercial.clothing.shoes",
        "commercial.clothing.clothes",
        "commercial.clothing.accessories"
    ]
}

# -------- Gemini (unused for now) --------
gemini_model = None
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)
    gemini_model = genai.GenerativeModel("gemini-2.5-flash")
