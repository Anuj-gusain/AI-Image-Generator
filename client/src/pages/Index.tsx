import { useNavigate } from "react-router-dom";
import { Sparkles, Wand2, Download, Shield, ArrowRight } from "lucide-react";
import Navbar from "../components/Navbar";

const Index = () => {
  const navigate = useNavigate();

  const handleStart = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/generate");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass text-sm text-muted-foreground mb-8">
            <Sparkles className="w-4 h-4 text-primary" />
            AI-Powered Image Generation
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-foreground mb-6 leading-tight">
            Transform Words Into{" "}
            <span className="gradient-text">Stunning Art</span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Create breathtaking images from text descriptions.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* 🔥 Updated Button */}
            <button
              onClick={handleStart}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl bg-primary text-primary-foreground font-semibold text-lg hover:opacity-90 transition-all glow-md"
            >
              Start Creating
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={() => navigate("/signup")}
              className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-xl glass font-semibold text-lg text-foreground hover:bg-secondary transition-all"
            >
              Create Account
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;