import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReportHeader from "../components/Report/ReportHeader";
import CompanyOverview from "../components/Report/CompanyOverview";
import PriceAnalysis from "../components/Report/PriceAnalysis";
import AIRecommendation from "../components/Report/AiRecommendation";
import TechnicalAnalysis from "../components/Report/TechnicalAnalysis";
import FinancialAnalysis from "../components/Report/FinancialAnalysis";
import NewsSummary from "../components/Report/NewsSummary";
import InvestmentInsights from "../components/Report/InvestmentInsights";
import FinalVerdict from "../components/Report/FinalVerdict";
import Disclaimer from "../components/Report/Disclaimer";

const Report = () => {

const { symbol } = useParams();

const [stockData, setStockData] = useState(null);

useEffect(() => {
  const fetchDetails = async () => {
    try {
      const res = await axios.get(
        `http://127.0.0.1:8000/api/stocks/${symbol}/details`
      );

      console.log(res.data);
      setStockData(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  fetchDetails();
}, [symbol]);

console.log("Stock Data:", stockData);

if (!stockData) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h2>Loading Report...</h2>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-slate-100 py-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Report Header */}
        <ReportHeader
          stock={stockData}
          symbol={symbol}
        />

        {/* Report Body */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">

  {/* Left Column */}
  <div className="space-y-6">
    <CompanyOverview stock={stockData} />

    <AIRecommendation stock={stockData} />

    <TechnicalAnalysis stock={stockData} />

    <NewsSummary
              stock={{
                overall_sentiment: "Positive",
                sentiment_confidence: 88,
                news: [
                  {
                    headline:
                      "TCS reports better-than-expected quarterly earnings",
                    source: "Economic Times",
                    published: "2 hours ago",
                    sentiment: "Positive",
                  },
                  {
                    headline:
                      "TCS signs multi-year digital transformation deal",
                    source: "Business Standard",
                    published: "5 hours ago",
                    sentiment: "Positive",
                  },
                  {
                    headline:
                      "Brokerages raise target price after strong results",
                    source: "Moneycontrol",
                    published: "Yesterday",
                    sentiment: "Positive",
                  },
                  {
                    headline:
                      "Global IT spending outlook remains stable",
                    source: "Reuters",
                    published: "2 days ago",
                    sentiment: "Neutral",
                  },
                ],
                highlights: [
                  "Strong quarterly earnings exceeded analyst estimates.",
                  "Management announced higher dividend payout.",
                  "Large international deal wins improved revenue outlook.",
                  "Digital services demand remains resilient.",
                ],
                news_summary:
                  "Recent news flow remains largely positive. Strong earnings, robust deal wins and optimistic management commentary indicate improving business momentum. Overall news sentiment supports a bullish long-term outlook.",
              }}
            />
  </div>

  

  {/* Right Column */}
  <div className="space-y-6">
    <PriceAnalysis stock={stockData} />
    
    <FinancialAnalysis stock={stockData} />

    <InvestmentInsights
              stock={{
                bullish_points: [
                  "Strong earnings growth",
                  "Consistent revenue expansion",
                  "Healthy cash flow generation",
                  "Market leader in IT services",
                ],
                watch_points: [
                  "Premium valuation",
                  "Global economic slowdown",
                  "Currency fluctuations",
                  "Increasing competition",
                ],
                investment_horizon: "Long Term",
                investor_type: "Moderate",
                investment_summary:
                  "Based on technical indicators, financial performance and recent news sentiment, the company remains fundamentally strong. Long-term investors may consider gradual accumulation while monitoring valuation levels.",
              }}
            />

    {/* FinancialAnalysis baad me yahan add hoga */}
  </div>


</div>

{/* Full Width Final Verdict */}
<div className="mt-6">
  <FinalVerdict
    stock={{
      recommendation: "Strong Buy",
      target_price: 4550,
      upside_percent: 12.8,
      confidence: 92,
      risk_level: "Low",
      investment_horizon: "Long Term",
      investment_score: 88,
      key_reasons: [
        "Strong earnings growth",
        "Positive technical momentum",
        "Healthy balance sheet",
        "Bullish news sentiment",
        "Strong institutional ownership",
      ],
      final_summary:
        "Based on technical indicators, financial performance, valuation metrics and recent market sentiment, the stock appears fundamentally strong with favorable long-term growth prospects. Long-term investors may consider gradual accumulation while monitoring valuation levels and macroeconomic risks.",
    }}
  />
  <Disclaimer />
</div>
      </div>
    </div>
  );
};

export default Report;