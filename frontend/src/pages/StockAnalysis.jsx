// import Sidebar from "../components/StockAnalysis/1_sidebar";
// import Navbar from "../components/StockAnalysis/1_Navbar";
// import StockHeader from "../components/StockAnalysis/1_StockHeader";

// export default function StockAnalysis() {
//   return (
//     <div className="min-h-screen bg-[#050505] flex">
//       <Sidebar />

//       <div className="flex-1">
//         <Navbar />

//         <main className="p-8">
//           <StockHeader />
//         </main>
//       </div>
//     </div>
//   );
// }

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Navbar_1 from "../components/StockAnalysis/Navbar_1";
import StockHeader from "../components/StockAnalysis/StockHeader";
import StockChart from "../components/StockAnalysis/StockChart";
import PeekAndDip from "../components/StockAnalysis/PeekAndDip"
import AiAnalysisCard from "../components/StockAnalysis/AiAnalysisCard";
import AiPrediction from "../components/StockAnalysis/AiPrediction";
import Technical from "../components/StockAnalysis/Technical";
import FinancialMetrics from "../components/StockAnalysis/MetricsIndicator";
// import SimilarStocks from "../components/StockAnalysis/SimilarStocks";
import StockNews from "../components/StockAnalysis/StockNews";
import News from "../components/StockAnalysis/News";

export default function StockAnalysis() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [stockData, setStockData] = useState(null);
  useEffect(() => {
    
    async function fetchStock() {
        try {
            const res = await fetch(
                `https://marketguard-production.up.railway.app/api/stocks/${symbol}/details`
            );

            const data = await res.json();

            console.log(data);

            const user = JSON.parse(localStorage.getItem("user"));

            await fetch(
              `https://marketguard-production.up.railway.app/api/search/save?user_email=${encodeURIComponent(user.email)}&symbol=${data.symbol}&company_name=${encodeURIComponent(data.companyName)}`,
              {
                method: "POST",
              }
            );

            setStockData(data);
        } catch (err) {
            console.log(err);
        }
    }

    fetchStock();
}, [symbol]);
const addToWatchlist = async () => {

  try {

    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch(
      `https://marketguard-production.up.railway.app/api/watchlist/add?user_email=${encodeURIComponent(user.email)}&symbol=${symbol}`,
      {
        method: "POST",
      }
    );

    const data = await res.json();

    alert(data.message);

    navigate("/dashboard");

  } catch (err) {

    console.error(err);

  }

};

const generateReport = () => {
  navigate(`/report/${symbol}`, {
    state: {
      stock: stockData,
    },
  });
};
if (!stockData) {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
      Loading...
    </div>
  );
}

  return (
    <div className="min-h-screen bg-[#050505] text-white p-8">
      <Navbar_1 />
      <StockHeader
        stock={stockData}
        onAddWatchlist={addToWatchlist}
      />
      {/* <h1 style={{ color: "red", fontSize: "60px" }}>
        STOCK ANALYSIS TEST
      </h1> */}
      <StockChart
        symbol={symbol}
        basePrice={stockData.price ?? 0}
        spikeAnalysis={stockData.spikeAnalysis}
      />
      <PeekAndDip
    spikeAnalysis={stockData.spikeAnalysis}
      />
      <AiAnalysisCard
          symbol={symbol}
          analysis={stockData.aiAnalysis}
      />
      <AiPrediction
        symbol={symbol}
        analysis={stockData.aiAnalysis}
        stock={stockData}
      />
      <Technical />
      <FinancialMetrics stock={stockData} />
      {/* <SimilarStocks /> */}
      <StockNews symbol={symbol} />
      <News
        currentStock={stockData}
        onGenerateReport={generateReport}
      />
    </div>
  );
}
