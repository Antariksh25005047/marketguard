
import os
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer,
    Table, TableStyle, HRFlowable
)
from reportlab.lib.enums import TA_CENTER


REPORTS_DIR = "reports"
os.makedirs(REPORTS_DIR, exist_ok=True)


NAVY  = colors.HexColor("#0d1117")
GREEN = colors.HexColor("#00cc6a")
RED   = colors.HexColor("#ff3b30")
AMBER = colors.HexColor("#d97706")
BLUE  = colors.HexColor("#2563eb")
GRAY  = colors.HexColor("#e2e8f0")
WHITE = colors.white

LEVEL_COLORS = {
    "CRITICAL": RED,
    "HIGH":     AMBER,
    "MEDIUM":   BLUE,
    "LOW":      GREEN,
}


def generate_report(
    symbol:     str,
    stock_name: str,
    risk_data:  dict,
    narrative:  str,
    news:       list = None,
) -> str:
    """
    Generate a SEBI-ready PDF evidence report.
    Returns the path to the generated PDF.
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename  = f"MarketGuard_{symbol.replace('.', '_')}_{timestamp}.pdf"
    filepath  = os.path.join(REPORTS_DIR, filename)

    doc = SimpleDocTemplate(
        filepath,
        pagesize     = A4,
        rightMargin  = 2*cm,
        leftMargin   = 2*cm,
        topMargin    = 2*cm,
        bottomMargin = 2*cm,
    )

    styles = getSampleStyleSheet()
    story  = []

   
    story.append(Paragraph(
        "<b>MarketGuard AI — Surveillance Report</b>",
        ParagraphStyle("title", fontSize=18, textColor=NAVY, spaceAfter=4)
    ))
    story.append(HRFlowable(width="100%", thickness=2, color=NAVY))
    story.append(Spacer(1, 0.2*inch))

    story.append(Paragraph(
        f"<b>{stock_name}</b> ({symbol})",
        ParagraphStyle("stock", fontSize=14, textColor=NAVY)
    ))

    level       = risk_data.get("risk_level", "LOW")
    level_color = LEVEL_COLORS.get(level, BLUE)

    story.append(Paragraph(
        f"<b>Risk Level: {level}</b>",
        ParagraphStyle("level", fontSize=12, textColor=level_color, spaceAfter=4)
    ))
    story.append(Paragraph(
        f"Generated: {datetime.now().strftime('%d %B %Y, %H:%M UTC')}",
        ParagraphStyle("meta", fontSize=9, textColor=colors.gray)
    ))
    story.append(Spacer(1, 0.2*inch))

   
    score        = risk_data.get("risk_score", 0)
    summary_data = [
        ["Risk Score", "Risk Level", "Symbol"],
        [f"{score}/100", level, symbol]
    ]
    t = Table(summary_data, colWidths=[2*inch, 2*inch, 2*inch])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR",     (0, 0), (-1, 0), WHITE),
        ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",      (0, 0), (-1, -1), 11),
        ("ALIGN",         (0, 0), (-1, -1), "CENTER"),
        ("FONTSIZE",      (0, 1), (-1, 1), 16),
        ("FONTNAME",      (0, 1), (-1, 1), "Helvetica-Bold"),
        ("TEXTCOLOR",     (0, 1), (0, 1), level_color),
        ("TEXTCOLOR",     (1, 1), (1, 1), level_color),
        ("BACKGROUND",    (0, 1), (-1, 1), colors.HexColor("#f8fafc")),
        ("GRID",          (0, 0), (-1, -1), 0.5, GRAY),
        ("TOPPADDING",    (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(t)
    story.append(Spacer(1, 0.3*inch))

   
    story.append(Paragraph(
        "<b>Signal Breakdown</b>",
        ParagraphStyle("h2", fontSize=12, textColor=NAVY, spaceAfter=6)
    ))

    c              = risk_data.get("components", {})
    component_rows = [["Signal", "Score", "Details"]]

    if "price_anomaly" in c:
        p = c["price_anomaly"]
        component_rows.append([
            "Price Anomaly",
            f"{p.get('score', 0):.0f}/100",
            f"Change: {p.get('pct_change', 0):+.1f}% | Z-score: {p.get('z_score', 0):.1f}"
        ])

    if "volume_anomaly" in c:
        v = c["volume_anomaly"]
        component_rows.append([
            "Volume Anomaly",
            f"{v.get('score', 0):.0f}/100",
            f"Volume ratio: {v.get('volume_ratio', 1):.1f}x average"
        ])

    if "sentiment" in c:
        s = c["sentiment"]
        component_rows.append([
            "Sentiment Risk",
            f"{s.get('avg_sentiment', 0)*100:.0f}/100",
            f"Label: {s.get('label', 'neutral')} | Articles: {s.get('article_count', 0)}"
        ])

    if "pump_language" in c:
        pl = c["pump_language"]
        component_rows.append([
            "Pump Language",
            f"{pl.get('score', 0):.0f}/100",
            f"Articles with pump words: {pl.get('article_count', 0)}"
        ])

    ct = Table(component_rows, colWidths=[1.8*inch, 1*inch, 3.8*inch])
    ct.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR",     (0, 0), (-1, 0), WHITE),
        ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",      (0, 0), (-1, -1), 9),
        ("ALIGN",         (1, 0), (1, -1), "CENTER"),
        ("GRID",          (0, 0), (-1, -1), 0.5, GRAY),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [WHITE, colors.HexColor("#f8fafc")]),
        ("TOPPADDING",    (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(ct)
    story.append(Spacer(1, 0.3*inch))

 
    story.append(Paragraph(
        "<b>AI Analysis</b>",
        ParagraphStyle("h2", fontSize=12, textColor=NAVY, spaceAfter=6)
    ))
    story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY))
    story.append(Spacer(1, 0.15*inch))

    # Parse and render narrative line by line
    for line in narrative.strip().split("\n"):
        line = line.strip()
        if not line:
            story.append(Spacer(1, 0.08*inch))
        elif line.isupper() or line.endswith(":"):
            # Section headers like SUMMARY, KEY SIGNALS etc
            story.append(Paragraph(
                f"<b>{line}</b>",
                ParagraphStyle(
                    "narr_head",
                    fontSize  = 10,
                    textColor = NAVY,
                    spaceBefore = 10,
                    spaceAfter  = 3,
                )
            ))
        elif line.startswith("•") or line.startswith("-"):
            
            story.append(Paragraph(
                f"&nbsp;&nbsp;&nbsp;{line}",
                ParagraphStyle(
                    "narr_bullet",
                    fontSize   = 9,
                    leading    = 14,
                    spaceAfter = 3,
                )
            ))
        else:
            # Normal text
            story.append(Paragraph(
                line,
                ParagraphStyle(
                    "narr_body",
                    fontSize   = 9,
                    leading    = 14,
                    spaceAfter = 4,
                )
            ))

    story.append(Spacer(1, 0.3*inch))


    if news:
        story.append(Paragraph(
            "<b>News Evidence</b>",
            ParagraphStyle("h2", fontSize=12, textColor=NAVY, spaceAfter=6)
        ))
        story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY))
        story.append(Spacer(1, 0.1*inch))

        for article in news[:8]:
            story.append(Paragraph(
                f"• {article.get('title', '')[:150]}",
                ParagraphStyle(
                    "news",
                    fontSize   = 8,
                    leading    = 12,
                    spaceAfter = 2,
                )
            ))
            story.append(Paragraph(
                f"&nbsp;&nbsp;Source: {article.get('source', '')} | "
                f"Pump score: {article.get('pump_score', 0):.0f}",
                ParagraphStyle(
                    "news_meta",
                    fontSize   = 7,
                    textColor  = colors.gray,
                    spaceAfter = 6,
                )
            ))

    story.append(Spacer(1, 0.5*inch))
    story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY))
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph(
        f"MarketGuard AI | Report ID: MG-{timestamp} | "
        f"Generated: {datetime.now().strftime('%d %b %Y %H:%M')} | "
        f"FOR REGULATORY USE ONLY",
        ParagraphStyle(
            "footer",
            fontSize  = 7,
            textColor = colors.gray,
            alignment = TA_CENTER,
        )
    ))

    doc.build(story)
    print(f" Report generated: {filepath}")
    return filepath


if __name__ == "__main__":
    from ml_and_db.ml.narrative_generator import generate_narrative

    test_risk = {
        "risk_score": 78,
        "risk_level": "HIGH",
        "components": {
            "price_anomaly":  {"score": 65, "pct_change": 8.5, "z_score": 3.2},
            "volume_anomaly": {"score": 80, "volume_ratio": 4.5},
            "sentiment":      {"score": 70, "avg_sentiment": 0.72,
                               "article_count": 15, "label": "positive"},
            "pump_language":  {"score": 60, "article_count": 8},
        }
    }

    print("Generating AI narrative...")
    narrative = generate_narrative("SUZLON.NS", "Suzlon Energy", test_risk)
    print(narrative)

    print("\n📄 Generating PDF report...")
    path = generate_report(
        symbol     = "SUZLON.NS",
        stock_name = "Suzlon Energy",
        risk_data  = test_risk,
        narrative  = narrative,
    )
import os
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch, cm
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer,
    Table, TableStyle, HRFlowable
)
from reportlab.lib.enums import TA_CENTER


REPORTS_DIR = "reports"
os.makedirs(REPORTS_DIR, exist_ok=True)


NAVY  = colors.HexColor("#0d1117")
GREEN = colors.HexColor("#00cc6a")
RED   = colors.HexColor("#ff3b30")
AMBER = colors.HexColor("#d97706")
BLUE  = colors.HexColor("#2563eb")
GRAY  = colors.HexColor("#e2e8f0")
WHITE = colors.white

LEVEL_COLORS = {
    "CRITICAL": RED,
    "HIGH":     AMBER,
    "MEDIUM":   BLUE,
    "LOW":      GREEN,
}


def generate_report(
    symbol:     str,
    stock_name: str,
    risk_data:  dict,
    narrative:  str,
    news:       list = None,
) -> str:
    """
    Generate a SEBI-ready PDF evidence report.
    Returns the path to the generated PDF.
    """
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    filename  = f"MarketGuard_{symbol.replace('.', '_')}_{timestamp}.pdf"
    filepath  = os.path.join(REPORTS_DIR, filename)

    doc = SimpleDocTemplate(
        filepath,
        pagesize     = A4,
        rightMargin  = 2*cm,
        leftMargin   = 2*cm,
        topMargin    = 2*cm,
        bottomMargin = 2*cm,
    )

    styles = getSampleStyleSheet()
    story  = []

   
    story.append(Paragraph(
        "<b>MarketGuard AI — Surveillance Report</b>",
        ParagraphStyle("title", fontSize=18, textColor=NAVY, spaceAfter=4)
    ))
    story.append(HRFlowable(width="100%", thickness=2, color=NAVY))
    story.append(Spacer(1, 0.2*inch))

    story.append(Paragraph(
        f"<b>{stock_name}</b> ({symbol})",
        ParagraphStyle("stock", fontSize=14, textColor=NAVY)
    ))

    level       = risk_data.get("risk_level", "LOW")
    level_color = LEVEL_COLORS.get(level, BLUE)

    story.append(Paragraph(
        f"<b>Risk Level: {level}</b>",
        ParagraphStyle("level", fontSize=12, textColor=level_color, spaceAfter=4)
    ))
    story.append(Paragraph(
        f"Generated: {datetime.now().strftime('%d %B %Y, %H:%M UTC')}",
        ParagraphStyle("meta", fontSize=9, textColor=colors.gray)
    ))
    story.append(Spacer(1, 0.2*inch))

   
    score        = risk_data.get("risk_score", 0)
    summary_data = [
        ["Risk Score", "Risk Level", "Symbol"],
        [f"{score}/100", level, symbol]
    ]
    t = Table(summary_data, colWidths=[2*inch, 2*inch, 2*inch])
    t.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR",     (0, 0), (-1, 0), WHITE),
        ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",      (0, 0), (-1, -1), 11),
        ("ALIGN",         (0, 0), (-1, -1), "CENTER"),
        ("FONTSIZE",      (0, 1), (-1, 1), 16),
        ("FONTNAME",      (0, 1), (-1, 1), "Helvetica-Bold"),
        ("TEXTCOLOR",     (0, 1), (0, 1), level_color),
        ("TEXTCOLOR",     (1, 1), (1, 1), level_color),
        ("BACKGROUND",    (0, 1), (-1, 1), colors.HexColor("#f8fafc")),
        ("GRID",          (0, 0), (-1, -1), 0.5, GRAY),
        ("TOPPADDING",    (0, 0), (-1, -1), 8),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
    ]))
    story.append(t)
    story.append(Spacer(1, 0.3*inch))

   
    story.append(Paragraph(
        "<b>Signal Breakdown</b>",
        ParagraphStyle("h2", fontSize=12, textColor=NAVY, spaceAfter=6)
    ))

    c              = risk_data.get("components", {})
    component_rows = [["Signal", "Score", "Details"]]

    if "price_anomaly" in c:
        p = c["price_anomaly"]
        component_rows.append([
            "Price Anomaly",
            f"{p.get('score', 0):.0f}/100",
            f"Change: {p.get('pct_change', 0):+.1f}% | Z-score: {p.get('z_score', 0):.1f}"
        ])

    if "volume_anomaly" in c:
        v = c["volume_anomaly"]
        component_rows.append([
            "Volume Anomaly",
            f"{v.get('score', 0):.0f}/100",
            f"Volume ratio: {v.get('volume_ratio', 1):.1f}x average"
        ])

    if "sentiment" in c:
        s = c["sentiment"]
        component_rows.append([
            "Sentiment Risk",
            f"{s.get('avg_sentiment', 0)*100:.0f}/100",
            f"Label: {s.get('label', 'neutral')} | Articles: {s.get('article_count', 0)}"
        ])

    if "pump_language" in c:
        pl = c["pump_language"]
        component_rows.append([
            "Pump Language",
            f"{pl.get('score', 0):.0f}/100",
            f"Articles with pump words: {pl.get('article_count', 0)}"
        ])

    ct = Table(component_rows, colWidths=[1.8*inch, 1*inch, 3.8*inch])
    ct.setStyle(TableStyle([
        ("BACKGROUND",    (0, 0), (-1, 0), NAVY),
        ("TEXTCOLOR",     (0, 0), (-1, 0), WHITE),
        ("FONTNAME",      (0, 0), (-1, 0), "Helvetica-Bold"),
        ("FONTSIZE",      (0, 0), (-1, -1), 9),
        ("ALIGN",         (1, 0), (1, -1), "CENTER"),
        ("GRID",          (0, 0), (-1, -1), 0.5, GRAY),
        ("ROWBACKGROUNDS",(0, 1), (-1, -1), [WHITE, colors.HexColor("#f8fafc")]),
        ("TOPPADDING",    (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]))
    story.append(ct)
    story.append(Spacer(1, 0.3*inch))

 
    story.append(Paragraph(
        "<b>AI Analysis</b>",
        ParagraphStyle("h2", fontSize=12, textColor=NAVY, spaceAfter=6)
    ))
    story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY))
    story.append(Spacer(1, 0.15*inch))

    # Parse and render narrative line by line
    for line in narrative.strip().split("\n"):
        line = line.strip()
        if not line:
            story.append(Spacer(1, 0.08*inch))
        elif line.isupper() or line.endswith(":"):
            # Section headers like SUMMARY, KEY SIGNALS etc
            story.append(Paragraph(
                f"<b>{line}</b>",
                ParagraphStyle(
                    "narr_head",
                    fontSize  = 10,
                    textColor = NAVY,
                    spaceBefore = 10,
                    spaceAfter  = 3,
                )
            ))
        elif line.startswith("•") or line.startswith("-"):
            
            story.append(Paragraph(
                f"&nbsp;&nbsp;&nbsp;{line}",
                ParagraphStyle(
                    "narr_bullet",
                    fontSize   = 9,
                    leading    = 14,
                    spaceAfter = 3,
                )
            ))
        else:
            # Normal text
            story.append(Paragraph(
                line,
                ParagraphStyle(
                    "narr_body",
                    fontSize   = 9,
                    leading    = 14,
                    spaceAfter = 4,
                )
            ))

    story.append(Spacer(1, 0.3*inch))


    if news:
        story.append(Paragraph(
            "<b>News Evidence</b>",
            ParagraphStyle("h2", fontSize=12, textColor=NAVY, spaceAfter=6)
        ))
        story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY))
        story.append(Spacer(1, 0.1*inch))

        for article in news[:8]:
            story.append(Paragraph(
                f"• {article.get('title', '')[:150]}",
                ParagraphStyle(
                    "news",
                    fontSize   = 8,
                    leading    = 12,
                    spaceAfter = 2,
                )
            ))
            story.append(Paragraph(
                f"&nbsp;&nbsp;Source: {article.get('source', '')} | "
                f"Pump score: {article.get('pump_score', 0):.0f}",
                ParagraphStyle(
                    "news_meta",
                    fontSize   = 7,
                    textColor  = colors.gray,
                    spaceAfter = 6,
                )
            ))

    story.append(Spacer(1, 0.5*inch))
    story.append(HRFlowable(width="100%", thickness=0.5, color=GRAY))
    story.append(Spacer(1, 0.1*inch))
    story.append(Paragraph(
        f"MarketGuard AI | Report ID: MG-{timestamp} | "
        f"Generated: {datetime.now().strftime('%d %b %Y %H:%M')} | "
        f"FOR REGULATORY USE ONLY",
        ParagraphStyle(
            "footer",
            fontSize  = 7,
            textColor = colors.gray,
            alignment = TA_CENTER,
        )
    ))

    doc.build(story)
    print(f" Report generated: {filepath}")
    return filepath


if __name__ == "__main__":
    from ml_and_db.ml.narrative_generator import generate_narrative

    test_risk = {
        "risk_score": 78,
        "risk_level": "HIGH",
        "components": {
            "price_anomaly":  {"score": 65, "pct_change": 8.5, "z_score": 3.2},
            "volume_anomaly": {"score": 80, "volume_ratio": 4.5},
            "sentiment":      {"score": 70, "avg_sentiment": 0.72,
                               "article_count": 15, "label": "positive"},
            "pump_language":  {"score": 60, "article_count": 8},
        }
    }

    print("Generating AI narrative...")
    narrative = generate_narrative("SUZLON.NS", "Suzlon Energy", test_risk)
    print(narrative)

    print("\n📄 Generating PDF report...")
    path = generate_report(
        symbol     = "SUZLON.NS",
        stock_name = "Suzlon Energy",
        risk_data  = test_risk,
        narrative  = narrative,
    )
    print(f"Report saved: {path}")