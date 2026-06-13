import os
from typing import List, Dict
from pydantic import BaseModel, Field
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import PydanticOutputParser
from dotenv import load_dotenv

# 1. IMPORT DATA DYNAMICALLY FROM MEMBER A
from market_gap import get_market_analysis_logic

load_dotenv()

# --- STEP 1: Expanded Structured Output Schema (Based on Reference Image) ---
class ImplementationPhase(BaseModel):
    phase: str = Field(description="Phase number (e.g., Phase 1)")
    timeframe: str = Field(description="Duration (e.g., Months 1-2)")
    key_activities: List[str] = Field(description="Tasks to complete in this phase")

class BusinessPlan(BaseModel):
    # Header Info
    business_name: str = Field(description="A catchy name for the business.")
    
    # Executive Summary
    executive_summary: str = Field(description="Overview of the space, target customers, and revenue goals.")
    
    # Overview
    business_overview: str = Field(description="Aesthetic, values, and local supplier strategy.")
    
    # Market Analysis
    target_market: str = Field(description="Primary demographic and their preferences.")
    location_analysis: str = Field(description="Why the specific location provides a competitive edge.")
    
    # Product Line
    offerings_and_pricing: str = Field(description="Specific products/services and price ranges.")
    
    # Strategy
    marketing_and_sales_strategy: str = Field(description="Multi-channel strategy and loyalty programs.")
    
    # Operations
    operations_overview: Dict[str, str] = Field(description="Details on Staffing and Suppliers.")
    
    # Financials
    financial_overview: Dict[str, str] = Field(description="Estimates for Startup Costs, Revenue Forecasts, and Profit Margin.")
    
    # Implementation Plan
    implementation_plan: List[ImplementationPhase] = Field(description="4-phase roadmap for launch.")

# --- STEP 2: Updated Generator Logic ---
class PlanGenerator:
    def __init__(self, api_key: str):
        self.llm = ChatGoogleGenerativeAI(
            model="gemini-2.5-flash", # Switch to 2.5 to avoid 2.0 quota exhaustion
            temperature=0.4,
            google_api_key=api_key,
            request_timeout=60
        )
        self.parser = PydanticOutputParser(pydantic_object=BusinessPlan)

    def create_plan(self, data: dict):
        # Image-based prompting to follow the "Morning Harvest" template style
        system_msg = (
            "You are a Senior Business Consultant. Create a detailed, professional business plan "
            "template for {location} based on the niche '{niche}'.\n\n"
            "STRICT CONTEXT:\n"
            "- Market Gap Score: {gap_score} (Higher is better)\n"
            "- Competitors found in area: {competitors_found}\n\n"
            "INSTRUCTIONS:\n"
            "Follow the structure of a professional business plan template. "
            "Ensure the Financial Overview includes a realistic revenue forecast for the first year. "
            "The Implementation Plan must be a phased roadmap.\n\n"
            "{format_instructions}"
        )

        prompt = ChatPromptTemplate.from_template(system_msg)
        chain = prompt | self.llm | self.parser

        return chain.invoke({
            "location": data["location"],
            "niche": data["niche"],
            "gap_score": data["gap_score"],
            "competitors_found": data["competitor_count"],
            "format_instructions": self.parser.get_format_instructions()
        })

# --- STEP 3: SEQUENTIAL EXECUTION ---
if __name__ == "__main__":
    print("🚀 Running Market Analysis Engine...")
    market_package = get_market_analysis_logic("food", "delhi")

    GEMINI_KEY = os.getenv("GEMINI_API_KEY")
    if not GEMINI_KEY:
        print("❌ Error: GEMINI_API_KEY not found.")
    else:
        generator = PlanGenerator(api_key=GEMINI_KEY)
        print(f"\n🤖 Gemini is building a professional roadmap for {market_package['location']}...")
        
        try:
            plan = generator.create_plan(market_package)

            # --- C. Professional Terminal Rendering ---
            print("\n" + "="*80)
            print(f"📄 BUSINESS PLAN: {plan.business_name.upper()}")
            print("="*80)
            
            print(f"\n[EXECUTIVE SUMMARY]\n{plan.executive_summary}")
            
            print(f"\n[BUSINESS OVERVIEW]\n{plan.business_overview}")
            
            print(f"\n[MARKET ANALYSIS]")
            print(f"Target Market: {plan.target_market}")
            print(f"Location Edge: {plan.location_analysis}")
            
            print(f"\n[OFFERINGS & PRICING]\n{plan.offerings_and_pricing}")
            
            print(f"\n[OPERATIONS]")
            for key, val in plan.operations_overview.items():
                print(f"• {key}: {val}")
                
            print(f"\n[FINANCIAL OVERVIEW]")
            for key, val in plan.financial_overview.items():
                print(f"• {key}: {val}")

            print(f"\n[IMPLEMENTATION PLAN]")
            for p in plan.implementation_plan:
                print(f"--- {p.phase} ({p.timeframe}) ---")
                for activity in p.key_activities:
                    print(f"  [ ] {activity}")
            
            print("\n" + "="*80)
            print("✅ Professional Business Plan Template Generated Successfully.")

        except Exception as e:
            print(f"❌ An error occurred: {e}")