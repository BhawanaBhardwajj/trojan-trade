import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export const MarketplaceHeader = () => {
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-[hsl(var(--usc-cardinal))]">
            Trojan Trade
          </Link>
          <div className="flex gap-4">
            <Link to="/login"><Button variant="ghost">Login</Button></Link>
            <Link to="/signup"><Button>Sign Up</Button></Link>
          </div>
        </div>
      </div>
    </header>
  );
};
