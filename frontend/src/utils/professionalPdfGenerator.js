import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generateProfessionalPDF = (stock) => {
  const doc = new jsPDF("p", "mm", "a4");

  // Colors
  const primary = [37, 99, 235];
  const dark = [30, 41, 59];
  const gray = [107, 114, 128];

  // ===== Header =====
  doc.setFillColor(...primary);
  doc.rect(0, 0, 210, 28, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("MarketGuard AI", 15, 16);

  doc.setFontSize(12);
  doc.text("AI Stock Analysis Report", 15, 23);

  // ===== Company =====
  doc.setTextColor(...dark);
  doc.setFontSize(18);
  doc.text(stock.company_name || stock.name || "Unknown Company", 15, 42);

  doc.setFontSize(11);
  doc.setTextColor(...gray);

  doc.text(`Symbol : ${stock.symbol || "-"}`, 15, 50);
  doc.text(`Sector : ${stock.sector || "-"}`, 15, 57);
  doc.text(`Industry : ${stock.industry || "-"}`, 15, 64);

  doc.text(
    `Generated : ${new Date().toLocaleDateString()}`,
    15,
    71
  );

  // ===== Price Summary =====
  autoTable(doc, {
    startY: 82,
    head: [["Metric", "Value"]],
    body: [
      ["Current Price", stock.price ?? "-"],
      ["Market Cap", stock.market_cap ?? "-"],
      ["P/E Ratio", stock.pe_ratio ?? "-"],
      ["EPS", stock.eps ?? "-"],
      ["Dividend Yield", stock.dividend_yield ?? "-"],
    ],
    headStyles: {
      fillColor: primary,
    },
    styles: {
      fontSize: 10,
    },
  });

  doc.save(`${stock.symbol}-Analysis-Report.pdf`);
};
