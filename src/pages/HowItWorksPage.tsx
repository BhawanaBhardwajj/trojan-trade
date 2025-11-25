import { Link } from "react-router-dom";
import { MarketplaceHeader } from "@/components/MarketplaceHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, CheckCircle2, Search, MessageSquare, Plus, ShoppingBag } from "lucide-react";

const HowItWorksPage = () => {
  return (
    <div className="min-h-screen bg-[hsl(var(--usc-beige))]">
      <MarketplaceHeader />

      <div className="container mx-auto px-4 py-8 max-w-5xl">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-primary flex items-center gap-1">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">How It Works</span>
        </nav>

        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="font-heading text-4xl font-bold text-[hsl(var(--usc-cardinal))] mb-2">How It Works</h1>
          <p className="text-muted-foreground text-lg">Three simple steps to start trading with fellow Trojans</p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          {/* Step 1 */}
          <Card className="text-center hover:shadow-[var(--shadow-card-hover)] transition-shadow">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[hsl(var(--usc-cardinal))] to-red-800 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="font-heading text-2xl font-bold text-[hsl(var(--usc-cardinal))] mb-3">1. Verify</h3>
              <p className="text-foreground">
                Sign up with your valid email address and complete your profile. Get your Verified USC badge if you sign
                up with usc email to build trust in the community.
              </p>
            </CardContent>
          </Card>

          {/* Step 2 */}
          <Card className="text-center hover:shadow-[var(--shadow-card-hover)] transition-shadow">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-[hsl(var(--usc-gold))] to-yellow-600 flex items-center justify-center mx-auto">
                  <Search className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="font-heading text-2xl font-bold text-[hsl(var(--usc-cardinal))] mb-3">2. List or Find</h3>
              <p className="text-foreground">
                Post items with clear photos and descriptions, or browse by category to find what you need. Filter by
                price, condition, and location on campus.
              </p>
            </CardContent>
          </Card>

          {/* Step 3 */}
          <Card className="text-center hover:shadow-[var(--shadow-card-hover)] transition-shadow">
            <CardContent className="p-8">
              <div className="mb-6">
                <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-600 to-blue-800 flex items-center justify-center mx-auto">
                  <MessageSquare className="h-10 w-10 text-white" />
                </div>
              </div>
              <h3 className="font-heading text-2xl font-bold text-[hsl(var(--usc-cardinal))] mb-3">3. Trade</h3>
              <p className="text-foreground">
                Message sellers in-app, arrange to meet safely on campus, complete the exchange, and leave a rating to
                help future Trojans.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Buttons */}
        <Card className="bg-gradient-to-br from-[hsl(var(--usc-cardinal))] to-red-800 text-white">
          <CardContent className="p-8">
            <h2 className="font-heading text-2xl font-bold mb-4 text-center">Ready to Get Started?</h2>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/post-ad">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-gold))] hover:text-white"
                >
                  <Plus className="h-5 w-5" />
                  Post an Item
                </Button>
              </Link>
              <Link to="/category/game-day">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-gold))] hover:text-white"
                >
                  <Search className="h-5 w-5" />
                  Browse Game Day
                </Button>
              </Link>
              <Link to="/category/merchandise">
                <Button
                  size="lg"
                  variant="secondary"
                  className="bg-white text-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-gold))] hover:text-white"
                >
                  <ShoppingBag className="h-5 w-5" />
                  Browse Merchandise
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link to="/">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default HowItWorksPage;
