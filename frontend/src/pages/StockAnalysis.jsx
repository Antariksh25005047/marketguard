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

import Navbar_1 from "../components/stockAnalysis/Navbar_1";
import StockHeader from "../components/stockAnalysis/StockHeader";
import StockChart from "../components/stockAnalysis/StockChart";
import PeekAndDip from "../components/stockAnalysis/PeekAndDip"
import AiAnalysisCard from "../components/stockAnalysis/AiAnalysisCard";
import Technical from "../components/stockAnalysis/Technical";
import FinancialMetrics from "../components/stockAnalysis/MetricsIndicator";
// import SimilarStocks from "../components/StockAnalysis/SimilarStocks";
// import AiPrediction from "../components/StockAnalysis/AiPrediction";
import StockNews from "../components/stockAnalysis/StockNews";
import News from "../components/stockAnalysis/News";

export default function StockAnalysis() {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [stockData, setStockData] = useState(null);
  useEffect(() => {
    
    async function fetchStock() {
        try {
            const res = await fetch(
                `http://127.0.0.1:8000/api/stocks/${symbol}/details`
            );

            const data = await res.json();
            console.log(data);

            setStockData(data);
        } catch (err) {
            console.log(err);
        }
    }

    fetchStock();
}, [symbol]);
const addToWatchlist = async () => {
  try {
    const res = await fetch(
      `http://127.0.0.1:8000/api/watchlist/add?user_id=1&symbol=${symbol}`,
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
      <Technical />
      <FinancialMetrics stock={stockData} />
      {/* <SimilarStocks /> */}
      {/* <AiPrediction /> */}
      <StockNews symbol={symbol} />
      <News currentStock={stockData} />
    </div>
  );
}