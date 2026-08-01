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
        ],
      },
    ],
  });

  const blob = await Packer.toBlob(doc);

  saveAs(blob, `${stock.symbol}_Report.docx`);
};