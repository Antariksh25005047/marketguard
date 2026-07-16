// export default function LandingPage() {
//   return (
//     <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center">
//       <h1 className="text-5xl font-bold">
//         Welcome to MarketGuard AI 🚀
//       </h1>
//     </div>
//   );
// }

import Hero from "../components/Hero";
import TrendingStocks from "../components/TrendingStocks";
import MarketOverview from "../components/MarketOverview";
import WhyMarketGuard from "../components/WhyMarketGuard";
// import Footer from "../components/Footer";
// import WaterMark from "../components/WaterMark";
import Closing from "../components/Closing";

export default function LandingPage() {
  return (
    <>
  <section id="home">
    <Hero />
  </section>

  <section id="markets">
    <TrendingStocks />
  </section>

  <section id="about">
    <MarketOverview />
    <WhyMarketGuard />
  </section>

  <section id="contact">
    <Closing />
  </section>
</>
  );
}