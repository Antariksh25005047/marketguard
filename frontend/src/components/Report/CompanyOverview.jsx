import React from "react";
import {
  Building2,
  Tag,
  Wallet,
  Briefcase,
  Factory,
  Landmark,
  CalendarClock,
  MapPin,
} from "lucide-react";

/**
 * CompanyOverview
 * Card #1 of the MarketGuard AI report — company profile snapshot.
 * Styled to read as a formal equity-research exhibit rather than a
 * dashboard widget: static (no hover motion), restrained icon palette,
 * and a single emphasized figure (Current Price).
 *
 * Props:
 * @param {Object} stock - {
 *   company_name, symbol, current_price, sector, industry,
 *   market_cap, founded, headquarters, logo_text
 * }
 */
const CompanyOverview = ({ stock }) => {
  const {
  companyName = "N/A",
  symbol = "N/A",
  price = "N/A",
  sector = "N/A",
  industry = "N/A",
  marketCap = "N/A",
  founded = "N/A",
  headquarters = "N/A",
  logo="",
  logoText = "",
} = stock || {};

const formattedMarketCap =
  typeof marketCap === "number"
    ? new Intl.NumberFormat("en-IN", {
        notation: "compact",
        maximumFractionDigits: 2,
      }).format(marketCap)
    : marketCap;

  // Neutral slate icon treatment for all standard fields — a single
  // restrained tone rather than a different color per row.
  const fields = [
    { icon: Tag, label: "Stock Symbol", value: symbol },
    { icon: Briefcase, label: "Sector", value: sector },
    { icon: Factory, label: "Industry", value: industry },
    { icon: Landmark, label: "Market Cap", value: formattedMarketCap },
    { icon: CalendarClock, label: "Founded", value: founded },
    { icon: MapPin, label: "Headquarters", value: headquarters },
  ];

  return (
    <section className="w-full self-start rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      {/* ===================== CARD HEADER ===================== */}
      <h3 className="mb-5 text-sm font-bold uppercase tracking-wide text-slate-800">
        1. Company Overview
      </h3>

      {/* ===================== LOGO + NAME ===================== */}
      <div className="mb-5 flex items-center gap-4 border-b border-slate-100 pb-5">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-xl border border-slate-200 bg-slate-50 overflow-hidden">

        {logo ? (
            <img
            src={logo}
            alt={companyName}
            className="h-16 w-16 object-contain"
            onError={(e) => {
                e.target.style.display = "none";
            }}
            />
        ) : logoText ? (
            <span className="text-2xl font-extrabold italic tracking-tight text-blue-700">
            {logoText}
            </span>
        ) : (
            <Building2 className="h-10 w-10 text-slate-400" strokeWidth={1.75} />
        )}

        </div>
        <h2 className="text-lg font-extrabold leading-tight tracking-tight text-slate-900 sm:text-xl">
          {companyName}
        </h2>
      </div>

      {/* ===================== CURRENT PRICE (EMPHASIZED) ===================== */}
      <div className="mb-4 flex items-center justify-between gap-3 py-1">
        <dt className="flex items-center gap-2.5">
          <Wallet className="h-4 w-4 text-slate-400" strokeWidth={2} />
          <span className="text-sm font-medium text-slate-500">
            Current Price
          </span>
        </dt>
        <dd className="text-xl font-extrabold text-emerald-600 sm:text-2xl">
          ₹{price}
        </dd>
      </div>

      {/* ===================== FIELD LIST ===================== */}
      <dl className="space-y-3">
        {fields.map(({ icon: Icon, label, value }) => (
          <div key={label} className="flex items-center justify-between gap-3">
            <dt className="flex min-w-0 items-center gap-2.5">
              <Icon className="h-4 w-4 shrink-0 text-slate-400" strokeWidth={2} />
              <span className="truncate text-sm font-medium text-slate-500">
                {label}
              </span>
            </dt>
            <dd className="shrink-0 text-right text-sm font-bold text-slate-900">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
};

export default CompanyOverview;
