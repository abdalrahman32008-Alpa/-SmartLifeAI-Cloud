import "./index.css";
import HeroSection from "./components/landing/HeroSection";
import FeaturesSection from "./components/landing/FeaturesSection";
import FAQSection from "./components/landing/FAQSection";

function App() {
  return (
    <div className="min-h-screen bg-white text-slate-900">
      <HeroSection />
      <FeaturesSection />
      <FAQSection />
    </div>
  );
}

export default App;
