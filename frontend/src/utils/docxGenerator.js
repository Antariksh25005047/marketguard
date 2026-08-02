import {
  Document,
  Packer,
  Paragraph,
  HeadingLevel,
  TextRun,
} from "docx";

import { saveAs } from "file-saver";

export const generateDocx = async (stock) => {
  const doc = new Document({
    sections: [
      {
        children: [
          new Paragraph({
            heading: HeadingLevel.TITLE,
            children: [
              new TextRun({
                text: "MarketGuard AI",
                bold: true,
                size: 36,
              }),
            ],
          }),

          new Paragraph({
            children: [
              new TextRun({
                text: "AI Stock Analysis Report",
                bold: true,
                size: 28,
              }),
            ],
          }),

          new Paragraph({ text: "" }),

          new Paragraph({
            heading: HeadingLevel.HEADING_1,
            text: "Company Overview",
          }),

          new Paragraph({
            text: `Company: ${stock.companyName}`,
          }),

          new Paragraph({
            text: `Symbol: ${stock.symbol}`,
          }),

          new Paragraph({
            text: `Current Price: ₹${stock.price}`,
          }),

          new Paragraph({
            text: `Sector: ${stock.sector}`,
          }),

          new Paragraph({
            text: `Industry: ${stock.industry}`,
          }),
          new Paragraph({ text: "" }),

        new Paragraph({
        heading: HeadingLevel.HEADING_1,
        text: "Price Analysis",
        }),

        new Paragraph({
        text: `Current Price: ₹${stock.price}`,
        }),

        new Paragraph({
        text: `Previous Close: ₹${stock.previousClose || "N/A"}`,
        }),

        new Paragraph({
        text: `Day High: ₹${stock.dayHigh || "N/A"}`,
        }),

        new Paragraph({
        text: `Day Low: ₹${stock.dayLow || "N/A"}`,
        }),

        new Paragraph({
        text: `52 Week High: ₹${stock.high52 || "N/A"}`,
        }),

        new Paragraph({
        text: `52 Week Low: ₹${stock.low52 || "N/A"}`,
        }),

        new Paragraph({ text: "" }),

        new Paragraph({
        heading: HeadingLevel.HEADING_1,
        text: "AI Recommendation",
        }),

        new Paragraph({
        text: `Recommendation: ${stock.aiAnalysis?.recommendation || "N/A"}`,
        }),

        new Paragraph({
        text: `AI Score: ${stock.aiAnalysis?.aiScore || "N/A"} / 100`,
        }),

        new Paragraph({
        text: `Risk Level: ${stock.aiAnalysis?.risk || "N/A"}`,
        }),

        new Paragraph({
        text: `Target Price: ₹${stock.aiAnalysis?.targetPrice || "N/A"}`,
        }),

        new Paragraph({
        text: `Summary: ${stock.aiAnalysis?.summary || "N/A"}`,
        }),

        new Paragraph({ text: "" }),

        new Paragraph({
        heading: HeadingLevel.HEADING_1,
        text: "Financial Analysis",
        }),

        new Paragraph({
        text: `Market Cap: ${stock.marketCap ?? "N/A"}`,
        }),

        new Paragraph({
        text: `Revenue: ${stock.financialAnalysis?.revenue ?? stock.revenue ?? "N/A"}`,
        }),

        new Paragraph({
        text: `Net Profit: ${stock.financialAnalysis?.netProfit ?? stock.netProfit ?? "N/A"}`,
        }),

        new Paragraph({
        text: `P/E Ratio: ${stock.peRatio ?? "N/A"}`,
        }),

        new Paragraph({
        text: `EPS: ${stock.eps ?? "N/A"}`,
        }),

        new Paragraph({
        text: `Dividend Yield: ${stock.financialAnalysis?.dividendYield ?? stock.dividendYield ?? "N/A"}`,
        }),

        new Paragraph({
        text: `ROE: ${stock.financialAnalysis?.roe ?? stock.roe ?? "N/A"}`,
        }),

        new Paragraph({
        text: `Financial Summary: ${stock.financialAnalysis?.summary ?? "N/A"}`,
        }),
        
        new Paragraph({ text: "" }),

        new Paragraph({
        heading: HeadingLevel.HEADING_1,
        text: "News Summary",
        }),

        new Paragraph({
        text: `Overall Sentiment: ${stock.newsAnalysis?.overallSentiment ?? "N/A"}`,
        }),

        new Paragraph({
        text: `Sentiment Confidence: ${stock.newsAnalysis?.sentimentConfidence ?? "N/A"}%`,
        }),

        new Paragraph({ text: "" }),

        new Paragraph({
        children: [
            new TextRun({
            text: "Top Headlines",
            bold: true,
            size: 24,
            }),
        ],
        }),

        ...(stock.newsAnalysis?.news || [])
        .slice(0, 5)
        .map(
            (item) =>
            new Paragraph({
                text: `• ${item.headline}`,
            })
        ),

        new Paragraph({ text: "" }),

        new Paragraph({
        text: `Summary: ${stock.newsAnalysis?.summary ?? "N/A"}`,
        }),

        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  saveAs(blob, `${stock.symbol}_Report.docx`);
};