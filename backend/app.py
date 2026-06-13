from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import os
import numpy as np

from models import ranked_model, feature_names, categorical_columns, location_model, df
from services import fetch_top_shops, generate_ai_insights
from market_gap import get_market_analysis_logic
from business_logic import PlanGenerator
from utils import make_json_safe
from sklearn.preprocessing import LabelEncoder

app = Flask(__name__)
# Explicitly allow common local origins to prevent CORS issues
CORS(app, resources={r"/api/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]}}, supports_credentials=True)

@app.after_request
def add_cors_headers(response):
    # Fallback to ensure headers are present even if middleware misses them
    response.headers['Access-Control-Allow-Origin'] = request.headers.get('Origin', '*')
    response.headers['Access-Control-Allow-Methods'] = 'POST, GET, OPTIONS, PUT, DELETE'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    return response

@app.route("/")
def health_check():
    return jsonify({"status": "running", "message": "LocalInsight Backend API"})

# -------- Location Prediction --------
@app.route("/api/predict_location", methods=["POST"])
def predict_location():
    # Get user Input
    data = request.get_json()
    category = data.get("business_category")
    target_customer = data.get("target_customer", "")
    
    raw_investment = data.get("investment_max", 0)
    investment_in_lakhs = float(raw_investment) / 100000

    dataset = df.copy()
    
    if target_customer == "youth":
        dataset["target_ratio"] = dataset["Youth_Pop_%"]
        dataset["target_type"] = "youth"
    elif target_customer == "female":
        dataset["target_ratio"] = dataset["Female_Pop_%"]
        dataset["target_type"] = "female"
    else:
        dataset["target_ratio"] = dataset["Male_Pop_%"]
        dataset["target_type"] = "male"
        
    candidates =  dataset[
        (dataset["Business_Category"] == category) & 
        (dataset["target_type"] == target_customer)
    ].copy()
    
    if candidates.empty:
        return jsonify({"status": "error", "message": "No matching locations found"})
        
    candidates['Investment_Lakhs'] = investment_in_lakhs
    
    # 3. Dynamic Feature Engineering
    candidates['Residential_density'] = candidates['Population'] / candidates['Total_Area']
    candidates['Market_Saturation_Index'] = candidates['Population'] / (candidates['Competitor_Count'] + 1)
    
    # 4. Critical: Ensure Categorical Dtypes
    for col in categorical_columns:
        if col in candidates.columns:
            candidates[col] = candidates[col].astype('category')
            
    candidates['rank_score'] = ranked_model.predict(candidates[feature_names])

    # 6. Get Top 3
    top_3 = candidates.sort_values(by='rank_score', ascending=False).head(3)
    return jsonify(make_json_safe(top_3.to_dict(orient="records")))


# Make sure your label encoder classes match training
label_encoder = LabelEncoder()
label_encoder.classes_ = np.array(["Low", "Medium", "High"])

# -------- City Prediction by Pincode --------
@app.route("/api/predict_city", methods=["POST"])
def predict_city():
    data = request.get_json()
    pincode = data.get("pincode")
    category = data.get("business_category")

    if not pincode or not category:
        return jsonify({"error": "Both 'pincode' and 'business_category' are required"}), 400

    try:
        # Lookup the row by pincode
        # Using int(float()) to handle strings like '414001.0'
        pincode_int = int(float(pincode))
        city_data = df[df["Pincode"] == pincode_int]
        
        if city_data.empty:
            return jsonify({"error": f"Pincode '{pincode}' not found in database"}), 404
        
        row = city_data.iloc[0]
        city = row["City"]

        # ==============================
        # Feature Engineering 
        # ==============================
        residential_density = row["Population"] / max(row["Total_Area"], 1)

        input_df = pd.DataFrame([{
            "Competitor_Count": row.get("Competitor_Count", 0),
            "Mall_Proximity": row.get("Mall_Proximity", 0),
            "Footfall_Proxy": row.get("Footfall_Proxy", 0),
            "Rent": row.get("Rent", 0),
            "Avg_Income": row.get("Avg_Income", 0),
            "Residential_density": residential_density,
            "Youth_Pop_%": row.get("Youth_Pop_%", 0),
            "Business_Category": category
        }])

        if "Business_Category" in categorical_columns:
            input_df["Business_Category"] = input_df["Business_Category"].astype("category")

        # ==============================
        # MODEL PREDICTION
        # ==============================
        proba = location_model.predict_proba(input_df)[0]
        predicted_index = np.argmax(proba)
        prediction = label_encoder.inverse_transform([predicted_index])[0]
        city_index_score = round(proba[predicted_index] * 100, 2)

        # ==============================
        # Additional Analytics
        # ==============================
        population = row.get("Population", 0)
        total_area = row.get("Total_Area", 1)
        density = population / max(total_area, 1)

        # ==============================
        # NEW LOGIC INTEGRATION
        # ==============================
        market_analysis = fetch_top_shops(city, category)

        response_payload = {
            "city": city,
            "pincode": pincode,
            "product_type": category,
            "predicted_category": prediction,
            "city_index_score": city_index_score,

            # Full Probability Distribution
            "confidence_distribution": {
                "Low": round(proba[0] * 100, 2),
                "Medium": round(proba[1] * 100, 2),
                "High": round(proba[2] * 100, 2),
            },

            # Demographics
            "population": population,
            "density": round(density, 2),
            "male_ratio": row.get("Male_Pop_%", 0),
            "female_ratio": row.get("Female_Pop_%", 0),
            "youth_ratio": row.get("Youth_Pop_%", 0),

            # Economy
            "avg_income": row.get("Avg_Income", 0),
            "rent": row.get("Rent", 0),

            # Market Factors
            "footfall_monthly": row.get("Footfall_Proxy", 0),
            "competitor_count": row.get("Competitor_Count", 0),
            "mall_proximity": row.get("Mall_Proximity", 0),

            # Insights
            "insights": generate_ai_insights(row.to_dict()),

            # NEW DATA STRUCTURE PASS-THROUGH
            "market_analysis": market_analysis,
            "shops": market_analysis.get("markers", [])
        }

        return jsonify(make_json_safe(response_payload))

    except Exception as e:
        print(f"Error in predict_city: {str(e)}")
        return jsonify({"error": "Failed to predict city viability", "details": str(e)}), 500
    
# -------- Strategy & Business Plan Generator --------
@app.route("/api/generate_strategy", methods=["POST"])
def generate_strategy():
    data = request.get_json()
    domain = data.get("domain")
    location = data.get("location")

    if not domain or not location:
        return jsonify({"error": "Domain and location are required"}), 400

    try:
        # 1. Get Market Data (Member A Logic)
        market_package = get_market_analysis_logic(domain, location)

        # 2. Generate AI Business Plan (Member B Logic)
        api_key = os.getenv("GEMINI_API_KEY")
        generator = PlanGenerator(api_key=api_key)
        
        # Use the PlanGenerator logic to create the structured plan
        business_plan_obj = generator.create_plan(market_package)
        
        # 3. Consolidate everything for the Frontend
        response_data = {
            "market_gap_score": market_package["gap_score"],
            "best_opportunity": market_package["niche"],
            "status": market_package["status"],
            "location": market_package["location"],
            "area_sq_km": market_package["area_sq_km"],
            "business_plan": business_plan_obj.dict() # Convert Pydantic to Dict for JSON
        }

        return jsonify(make_json_safe(response_data))

    except Exception as e:
        print(f"Error generating strategy: {str(e)}")
        return jsonify({"error": "Failed to generate business plan", "details": str(e)}), 500


# -------- Get All Locations --------
@app.route("/api/locations", methods=["GET"])
def get_all_locations():
    try:
        # Return all unique cities or all location data
        # For the map, we need lat/lon or city names to geocode
        results = df.copy()
        # Ensure we have opportunity scores if not already present
        if 'opportunity_score' not in results.columns:
            results['opportunity_score'] = 0.5 # Default or calculate if needed
            
        return jsonify(make_json_safe(results.to_dict(orient="records")))
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# -------- Get Cities & Pincodes from CSV --------
@app.route("/api/cities", methods=["GET"])
def get_cities():
    city_pincode_data = (
        df.groupby("City")["Pincode"]
        .unique()
        .apply(lambda x: [str(pin) for pin in x])
        .to_dict()
    )
    return jsonify(city_pincode_data)

if __name__ == "__main__":
    app.run(debug=True)
