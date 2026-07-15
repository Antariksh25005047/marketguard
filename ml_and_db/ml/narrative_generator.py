
import os
import httpx
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL   = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You are a financial market surveillance expert working for SEBI.
Analyze manipulation signals and write clear regulatory summaries.

Always structure your response exactly like this:

SUMMARY
(2-3 sentences about what was detected)

KEY SIGNALS
- signal one
- signal two
- signal three

RISK ASSESSMENT
(1-2 sentences about the risk level)

RECOMMENDED ACTION
(1 sentence about what to do)

Rules:
- Keep it under 200 words
- Use words like suggests, indicates, consistent with
- Never make definitive accusations
- Professional language only
"""


def generate_narrative(
    symbol:    str,
    stock_name: str,
    risk_data: dict,
) -> str:
    """
    Generate AI narrative for a manipulation alert using Groq (free).
    Falls back to template if API key not set.
    """
    if not GROQ_API_KEY:
        print("GROQ_API_KEY not set — using template narrative")
        return _template_narrative(symbol, stock_name, risk_data)

    c = risk_data.get("components", {})

    prompt = f"""
Analyze this market manipulation alert and write a regulatory summary:

STOCK: {stock_name} ({symbol})
TIME: {datetime.utcnow().strftime('%Y-%m-%d %H:%M')} UTC
RISK SCORE: {risk_data.get('risk_score', 0)}/100
RISK LEVEL: {risk_data.get('risk_level', 'UNKNOWN')}

SIGNALS:
- Price Anomaly: {c.get('price_anomaly', {}).get('score', 0):.0f}/100
  Change: {c.get('price_anomaly', {}).get('pct_change', 0):+.1f}%
- Volume Anomaly: {c.get('volume_anomaly', {}).get('score', 0):.0f}/100
  Ratio: {c.get('volume_anomaly', {}).get('volume_ratio', 1):.1f}x average
- Sentiment: {c.get('sentiment', {}).get('label', 'neutral')}
  Articles: {c.get('sentiment', {}).get('article_count', 0)}
- Pump Language Score: {c.get('pump_language', {}).get('score', 0):.0f}/100

Write the regulatory summary now.
"""

    try:
        response = httpx.post(
            GROQ_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type":  "application/json",
            },
            json={
                "model":       GROQ_MODEL,
                "max_tokens":  400,
                "temperature": 0.3,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user",   "content": prompt},
                ],
            },
            timeout=20.0,
        )

        if response.status_code == 200:
            narrative = response.json()["choices"][0]["message"]["content"].strip()
            print(f" Narrative generated for {symbol}")
            return narrative

        elif response.status_code == 429:
            print("Groq rate limit — using template")
            return _template_narrative(symbol, stock_name, risk_data)

        else:
            print(f"Groq error {response.status_code}")
            return _template_narrative(symbol, stock_name, risk_data)

    except Exception as e:
        print(f" Narrative error: {e}")
        return _template_narrative(symbol, stock_name, risk_data)


def _template_narrative(symbol: str, stock_name: str, risk_data: dict) -> str:
    """Fallback template when Groq is unavailable"""
    c     = risk_data.get("components", {})
    score = risk_data.get("risk_score", 0)
    level = risk_data.get("risk_level", "UNKNOWN")

    signals = []

    if c.get("price_anomaly", {}).get("score", 0) > 30:
        signals.append(
            f"Unusual price movement of "
            f"{c['price_anomaly'].get('pct_change', 0):+.1f}%"
        )
    if c.get("volume_anomaly", {}).get("score", 0) > 30:
        signals.append(
            f"Volume {c['volume_anomaly'].get('volume_ratio', 1):.1f}x above average"
        )
    if c.get("pump_language", {}).get("score", 0) > 30:
        signals.append("Pump language detected in news articles")

    if not signals:
        signals.append("Multiple low-level anomalies detected")

    bullets = "\n".join(f"• {s}" for s in signals)

    action = (
        "Immediate investigation recommended."
        if level == "CRITICAL" else
        "Flag for surveillance review."
        if level == "HIGH" else
        "Continue monitoring."
    )

    return f"""SUMMARY
MarketGuard AI detected {level} risk for {stock_name} ({symbol}) with a score of {score}/100 at {datetime.utcnow().strftime('%Y-%m-%d %H:%M')} UTC.

KEY SIGNALS
{bullets}

RISK ASSESSMENT
The combination of signals suggests elevated risk of coordinated market manipulation activity.

RECOMMENDED ACTION
{action}"""


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

    print("Generating PDF report...")
    path = generate_report(
        symbol     = "SUZLON.NS",
        stock_name = "Suzlon Energy",
        risk_data  = test_risk,
        narrative  = narrative,
    )
import os
import httpx
from datetime import datetime
from dotenv import load_dotenv

load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY", "")
GROQ_URL     = "https://api.groq.com/openai/v1/chat/completions"
GROQ_MODEL   = "llama-3.3-70b-versatile"

SYSTEM_PROMPT = """You are a financial market surveillance expert working for SEBI.
Analyze manipulation signals and write clear regulatory summaries.

Always structure your response exactly like this:

SUMMARY
(2-3 sentences about what was detected)

KEY SIGNALS
- signal one
- signal two
- signal three

RISK ASSESSMENT
(1-2 sentences about the risk level)

RECOMMENDED ACTION
(1 sentence about what to do)

Rules:
- Keep it under 200 words
- Use words like suggests, indicates, consistent with
- Never make definitive accusations
- Professional language only
"""


def generate_narrative(
    symbol:    str,
    stock_name: str,
    risk_data: dict,
) -> str:
    """
    Generate AI narrative for a manipulation alert using Groq (free).
    Falls back to template if API key not set.
    """
    if not GROQ_API_KEY:
        print("GROQ_API_KEY not set — using template narrative")
        return _template_narrative(symbol, stock_name, risk_data)

    c = risk_data.get("components", {})

    prompt = f"""
Analyze this market manipulation alert and write a regulatory summary:

STOCK: {stock_name} ({symbol})
TIME: {datetime.utcnow().strftime('%Y-%m-%d %H:%M')} UTC
RISK SCORE: {risk_data.get('risk_score', 0)}/100
RISK LEVEL: {risk_data.get('risk_level', 'UNKNOWN')}

SIGNALS:
- Price Anomaly: {c.get('price_anomaly', {}).get('score', 0):.0f}/100
  Change: {c.get('price_anomaly', {}).get('pct_change', 0):+.1f}%
- Volume Anomaly: {c.get('volume_anomaly', {}).get('score', 0):.0f}/100
  Ratio: {c.get('volume_anomaly', {}).get('volume_ratio', 1):.1f}x average
- Sentiment: {c.get('sentiment', {}).get('label', 'neutral')}
  Articles: {c.get('sentiment', {}).get('article_count', 0)}
- Pump Language Score: {c.get('pump_language', {}).get('score', 0):.0f}/100

Write the regulatory summary now.
"""

    try:
        response = httpx.post(
            GROQ_URL,
            headers={
                "Authorization": f"Bearer {GROQ_API_KEY}",
                "Content-Type":  "application/json",
            },
            json={
                "model":       GROQ_MODEL,
                "max_tokens":  400,
                "temperature": 0.3,
                "messages": [
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user",   "content": prompt},
                ],
            },
            timeout=20.0,
        )

        if response.status_code == 200:
            narrative = response.json()["choices"][0]["message"]["content"].strip()
            print(f" Narrative generated for {symbol}")
            return narrative

        elif response.status_code == 429:
            print("Groq rate limit — using template")
            return _template_narrative(symbol, stock_name, risk_data)

        else:
            print(f"Groq error {response.status_code}")
            return _template_narrative(symbol, stock_name, risk_data)

    except Exception as e:
        print(f" Narrative error: {e}")
        return _template_narrative(symbol, stock_name, risk_data)


def _template_narrative(symbol: str, stock_name: str, risk_data: dict) -> str:
    """Fallback template when Groq is unavailable"""
    c     = risk_data.get("components", {})
    score = risk_data.get("risk_score", 0)
    level = risk_data.get("risk_level", "UNKNOWN")

    signals = []

    if c.get("price_anomaly", {}).get("score", 0) > 30:
        signals.append(
            f"Unusual price movement of "
            f"{c['price_anomaly'].get('pct_change', 0):+.1f}%"
        )
    if c.get("volume_anomaly", {}).get("score", 0) > 30:
        signals.append(
            f"Volume {c['volume_anomaly'].get('volume_ratio', 1):.1f}x above average"
        )
    if c.get("pump_language", {}).get("score", 0) > 30:
        signals.append("Pump language detected in news articles")

    if not signals:
        signals.append("Multiple low-level anomalies detected")

    bullets = "\n".join(f"• {s}" for s in signals)

    action = (
        "Immediate investigation recommended."
        if level == "CRITICAL" else
        "Flag for surveillance review."
        if level == "HIGH" else
        "Continue monitoring."
    )

    return f"""SUMMARY
MarketGuard AI detected {level} risk for {stock_name} ({symbol}) with a score of {score}/100 at {datetime.utcnow().strftime('%Y-%m-%d %H:%M')} UTC.

KEY SIGNALS
{bullets}

RISK ASSESSMENT
The combination of signals suggests elevated risk of coordinated market manipulation activity.

RECOMMENDED ACTION
{action}"""


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

    print("Generating PDF report...")
    path = generate_report(
        symbol     = "SUZLON.NS",
        stock_name = "Suzlon Energy",
        risk_data  = test_risk,
        narrative  = narrative,
    )
    print(f"Report saved: {path}")