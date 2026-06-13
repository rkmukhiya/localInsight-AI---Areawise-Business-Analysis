import sys
import os
import pandas as pd
import numpy as np

try:
    from models import location_model, df, label_encoder
    print("Models loaded successfully")
    
    # Simulate /api/predict_city logic
    # Find a valid pincode from df
    pincode = str(df["Pincode"].iloc[0])
    category = "Cafe"
    
    print(f"Testing with pincode: {pincode}")
    
    # Filter by pincode
    city_data = df[df["Pincode"] == int(pincode)]
    if city_data.empty:
        print(f"Pincode {pincode} not found")
    else:
        row = city_data.iloc[0]
        city = row["City"]
        print(f"Found city: {city}")
        
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
        
        # Check columns
        print(f"Input DF columns: {list(input_df.columns)}")
        
        # Important: Types comparison
        if "Business_Category" in [c for c in input_df.columns]:
            input_df["Business_Category"] = input_df["Business_Category"].astype("category")

        # Check predict_proba
        print("Calling predict_proba...")
        proba = location_model.predict_proba(input_df)[0]
        print(f"Proba: {proba}")
        
        predicted_index = np.argmax(proba)
        prediction = label_encoder.inverse_transform([predicted_index])[0]
        print(f"Prediction: {prediction}")

except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
