// import TopBar from "../components/dashboard/TopBar";
// import HeroSearch from "../components/dashboard/HeroSearch";
// // import StatsCards from "../components/dashboard/StatsCard";
// // import ChartSection from "../components/dashboard/ChartSection";
// import RecentSearches from "../components/Dashboard/RecentSearch";
// import NewsCard from "../components/Dashboard/News";
// import Watchlist from "../components/Dashboard/WatchList";

// export default function Dashboard() {
//   return (
//     <div className="min-h-screen bg-charcoal text-white">
//       <TopBar />

//       <main className="mx-auto max-w-7xl px-6 py-8">
//         <HeroSearch />

//         {/* <div className="mt-8">
//             <StatsCards />
//         </div>
//         <div className="mt-8">
//             <ChartSection />
//         </div> */}
//         <div className="mt-8">
//     <RecentSearches />
// </div>

// <div className="mt-10 grid grid-cols-1 xl:grid-cols-3 gap-8">

//     {/* News */}
//     <div className="xl:col-span-2">
//         <NewsCard />
//     </div>

//     {/* Watchlist */}
//     <div>
//         <Watchlist />
//     </div>

// </div>
//       </main>
//     </div>
//   );
// }


import TopBar from "../components/dashboard/TopBar";
import HeroSearch from "../components/dashboard/HeroSearch";
import MarketMovers from "../components/Dashboard/MarketMovers";
import RecentSearches from "../components/Dashboard/RecentSearch";
import MarketNews from "../components/Dashboard/News";
import Watchlist from "../components/Dashboard/WatchList";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-charcoal text-white">
      <TopBar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <HeroSearch />

        <MarketMovers />

        <div className="mt-8">
          <RecentSearches />
        </div>

        <div className="mt-8">
          <MarketNews />
        </div>

        <div className="mt-8">
          <Watchlist />
        </div>
      </main>
    </div>
  );
}