import React from "react";
import { useParams } from "react-router-dom";
import ReportHeader from "../components/Report/ReportHeader";
import CompanyOverview from "../components/Report/CompanyOverview";
import PriceAnalysis from "../components/Report/PriceAnalysis";
import AIRecommendation from "../components/Report/AiRecommendation";
import TechnicalAnalysis from "../components/Report/TechnicalAnalysis";
import FinancialAnalysis from "../components/Report/FinancialAnalysis";
import NewsSummary from "../components/Report/NewsSummary";
import InvestmentInsights from "../components/Report/InvestmentInsights";

const Report = () => {
  const { symbol } = useParams();

  // Temporary dummy data
  const stockData = {
    company_name: "Tata Consultancy Services",
    symbol,
    current_price: 4032.45,
  };

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
    <CompanyOverview
      stock={{
        company_name: "Tata Consultancy Services",
        symbol,
        sector: "Information Technology",
        industry: "IT Services & Consulting",
        founded: "1968",
        headquarters: "Mumbai, India",
        market_cap: "₹15.2T",
      }}
    />

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
    <PriceAnalysis
      stock={{
        current_price: 4032.45,
        previous_close: 3998.20,
        today_change: 34.25,
        today_change_percent: 0.86,
        day_high: 4050,
        day_low: 3980,
        week52_high: 4592,
        week52_low: 3056,
        one_month_return: 4.2,
        six_month_return: 12.8,
        one_year_return: 18.6,
      }}
    />
    
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
      </div>
    </div>
  );
};

export default Report;