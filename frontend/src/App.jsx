// import Hero from "./components/Hero";
// import TrendingStocks from "./components/TrendingStocks";
// import MarketOverview from "./components/MarketOverview";
// import Footer from "./components/Footer";
// function App() {
//   return (
//     <>
//       <Hero />
//       <TrendingStocks />
//       <MarketOverview />
//       <Footer />
//     </>
//   );
// }

// export default App;


// { <Routes>
//   <Route path="/" element={<LandingPage />} />
//   <Route path="/login" element={<LoginPage />} />
// </Routes> }


import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import Dashboard from "./pages/Dashboard";
import StockAnalysis from "./pages/StockAnalysis";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage/>} />
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/stock-analysis" element={<StockAnalysis />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;