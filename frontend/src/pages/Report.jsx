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

    <AIRecommendation
      stock={{
        recommendation: "Strong Buy",
        confidence: 92,
        target_price: 4550,
        upside_percent: 12.8,
        risk_level: "Low",
        ai_summary: [
          "Strong quarterly earnings growth",
          "Positive technical momentum",
          "Healthy balance sheet",
          "Bullish news sentiment",
        ],
      }}
    />
    <TechnicalAnalysis
      stock={{
        trend: "Bullish",
        rsi: 62,
        rsi_interpretation: "Bullish",
        macd: "Positive",
        macd_interpretation: "Bullish",
        dma50: 3950,
        dma50_interpretation: "Bullish",
        dma200: 3725,
        dma200_interpretation: "Bullish",
        volume_trend: "Above Avg",
        volume_trend_interpretation: "Positive",
        volatility: "Moderate",
        volatility_interpretation: "Neutral",
        support: 3950,
        resistance: 4180,
        signals: [
          "Trading above 50 DMA",
          "MACD crossover detected",
          "RSI in bullish zone",
          "Higher highs and higher lows",
          "Volume confirms breakout",
        ],
        technical_view:
          "The stock is trading in a confirmed uptrend with positive momentum across major indicators. Current technical structure supports continued bullish movement while maintaining moderate volatility.",
      }}
    />

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
    
    <FinancialAnalysis
      stock={{
        market_cap: "₹15.2T",
        revenue: "₹2.45T",
        net_profit: "₹52,300Cr",
        eps: "₹126.5",
        pe_ratio: "31.8",
        dividend_yield: 1.3,
        roe: 48.2,
        roce: 58.4,
        promoter_holding: 72.35,
        institutional_holding: 21.18,
        revenue_growth: "Strong",
        profitability: "Healthy",
        debt_level: "Low",
        financial_summary:
          "The company maintains strong profitability, healthy return ratios and low debt. Consistent earnings growth and stable cash generation indicate solid long-term financial strength.",
      }}
    />

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