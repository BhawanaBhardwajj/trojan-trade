import tommyTrojan from "@/assets/tommy-trojan-hero.jpg";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export const HeroSection = () => {
  return (
    <section className="relative w-full h-[75vh] overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-no-repeat"
        style={{
          backgroundImage: `url(${tommyTrojan})`,
          backgroundPosition: 'center 35%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20"></div>
      </div>

      {/* Content Overlay - centered */}
      <div className="relative h-full flex items-center justify-center">
        <div className="container mx-auto px-4 text-center w-full">
          <h1 className="text-5xl lg:text-7xl font-heading font-extrabold text-white mb-4 drop-shadow-2xl" style={{ textShadow: '0 4px 12px rgba(0,0,0,0.5)' }}>
            By Trojans, For Trojans – Your Trusted Campus Marketplace
          </h1>
          <p className="text-xl lg:text-2xl text-white/95 mb-8 drop-shadow-lg font-medium" style={{ textShadow: '0 2px 8px rgba(0,0,0,0.4)' }}>
            Buy, sell, and exchange with verified USC students.
          </p>
          <Link to="/category/game-day">
            <Button
              size="lg"
              className="bg-[hsl(var(--usc-gold))] hover:bg-[hsl(var(--usc-gold))]/90 text-black font-bold text-xl px-14 py-7 rounded-lg shadow-[var(--shadow-button)] hover:shadow-[var(--shadow-button-hover)] transition-all duration-300"
            >
              Start Trading
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
};
