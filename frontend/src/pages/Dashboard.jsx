import TopBar from "../components/dashboard/TopBar";
import HeroSearch from "../components/dashboard/HeroSearch";
// import StatsCards from "../components/dashboard/StatsCard";
// import ChartSection from "../components/dashboard/ChartSection";
import RecentSearches from "../components/Dashboard/RecentSearch";
import Watchlist from "../components/Dashboard/WatchList";

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-charcoal text-white">
      <TopBar />

      <main className="mx-auto max-w-7xl px-6 py-8">
        <HeroSearch />

        {/* <div className="mt-8">
            <StatsCards />
        </div>
        <div className="mt-8">
            <ChartSection />
        </div> */}
        <div className="mt-8">
            <RecentSearches />
        </div>
        <div className="mt-8">
            <Watchlist />
        </div>
      </main>
    </div>
  );
}