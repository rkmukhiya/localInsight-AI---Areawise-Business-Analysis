# 🐍 LocalInsight Backend

The backend for LocalInsight is built with Flask and handles data processing, market analysis, and AI integration.

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- [Google Gemini API Key](https://aistudio.google.com/)

### Setup

1. **Install Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure Environment**
   Create a `.env` file in this directory and add your API key:
   ```env
   GEMINI_API_KEY=your_google_gemini_api_key
   ```

3. **Run the Server**
   ```bash
   python app.py
   ```
   The backend will start on `http://localhost:5000`.

## 📁 Key Files
- `app.py`: Main entry point and API route definitions.
- `business_logic.py`: Contains the `PlanGenerator` which interacts with Gemini AI.
- `market_gap.py`: Logic for identifying business niches and market saturation.
- `models.py`: Loads the ML models and datasets.
- `services.py`: External service integrations (e.g., AI and data fetching).
- `utils.py`: Helper functions for data cleaning and JSON safety.

## 📊 APIs
- `GET /`: Health check.
- `POST /api/predict_location`: Returns top districts for a category.
- `POST /api/predict_city`: Detailed analysis for a specific city.
- `POST /api/generate_strategy`: Generates a full AI business plan and PDF-ready content.

---
Part of the [LocalInsight](../PRD.md) project.
