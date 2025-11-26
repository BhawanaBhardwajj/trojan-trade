import { MarketplaceHeader } from "@/components/MarketplaceHeader";
import { HeroSection } from "@/components/HeroSection";
import { CategoryGrid } from "@/components/CategoryGrid";
import { FeaturedListings } from "@/components/FeaturedListings";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <HeroSection />
      <CategoryGrid />
      <FeaturedListings />

      {/* Footer */}
      <footer className="bg-[hsl(var(--usc-cardinal))] text-white border-t-4 border-[hsl(var(--usc-gold))] mt-16">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4 text-[hsl(var(--usc-gold))]">Trojan Trade</h3>
              <p className="text-white/90 text-sm leading-relaxed">
                USC students' trusted platform for buying and selling tailgate tickets/passes, USC Merch or dorm
                essentials.
              </p>
            </div>
            <div>
              <h4 className="font-heading font-medium mb-3 text-[hsl(var(--usc-gold))]">Categories</h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li>
                  <Link to="/category/game-day" className="hover:text-[hsl(var(--usc-gold))] transition-colors">
                    Game Day Exchange
                  </Link>
                </li>
                <li>
                  <Link to="/category/merchandise" className="hover:text-[hsl(var(--usc-gold))] transition-colors">
                    USC Merchandise
                  </Link>
                </li>
                <li>
                  <Link to="/category/furniture" className="hover:text-[hsl(var(--usc-gold))] transition-colors">
                    Furniture & Essentials
                  </Link>
                </li>
                <li>
                  <Link to="/category/rentals" className="hover:text-[hsl(var(--usc-gold))] transition-colors">
                    Rentals
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-medium mb-3 text-[hsl(var(--usc-gold))]">For Students</h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li>
                  <Link to="/safety" className="hover:text-[hsl(var(--usc-gold))] transition-colors">
                    Safety Tips
                  </Link>
                </li>
                <li>
                  <Link to="/guidelines" className="hover:text-[hsl(var(--usc-gold))] transition-colors">
                    USC Guidelines
                  </Link>
                </li>
                <li>
                  <Link to="/how-it-works" className="hover:text-[hsl(var(--usc-gold))] transition-colors">
                    How It Works
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-heading font-medium mb-3 text-[hsl(var(--usc-gold))]">Company</h4>
              <ul className="space-y-2 text-sm text-white/90">
                <li>
                  <Link to="/about" className="hover:text-[hsl(var(--usc-gold))] transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link to="/terms" className="hover:text-[hsl(var(--usc-gold))] transition-colors">
                    Terms
                  </Link>
                </li>
                <li>
                  <Link to="/privacy" className="hover:text-[hsl(var(--usc-gold))] transition-colors">
                    Privacy
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Gold divider line */}
          <div className="w-full h-0.5 bg-[hsl(var(--usc-gold))] mb-6"></div>

          <div className="flex flex-col md:flex-row items-center justify-between">
            <p className="text-sm text-white/90 mb-4 md:mb-0">
              &copy; 2025 Trojan Trade. Built by Trojans, for Trojans.
            </p>
            <div className="text-[hsl(var(--usc-gold))] text-xl font-heading font-bold">Fight On! ✌️</div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
