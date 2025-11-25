import { Link } from "react-router-dom";
import { MarketplaceHeader } from "@/components/MarketplaceHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, Heart, Users, Leaf, Target } from "lucide-react";

const AboutPage = () => {
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
          <span className="text-foreground">About Us</span>
        </nav>

        {/* Hero Section */}
        <div className="mb-12 text-center">
          <h1 className="font-heading text-5xl font-bold text-[hsl(var(--usc-cardinal))] mb-4">
            About Trojan Trade
          </h1>
          <p className="text-xl text-foreground max-w-3xl mx-auto">
            Making student-to-student commerce safer, simpler, and more sustainable for the USC community.
            Built by Trojans, for Trojans.
          </p>
        </div>

        {/* Mission Statement */}
        <Card className="mb-12 bg-gradient-to-br from-[hsl(var(--usc-cardinal))] to-red-800 text-white">
          <CardContent className="p-10">
            <h2 className="font-heading text-3xl font-bold mb-4 text-center">Our Mission</h2>
            <p className="text-lg text-center leading-relaxed">
              We believe college students deserve a trusted marketplace where they can buy, sell, and trade
              with fellow Trojans. Trojan Trade connects verified USC students through a secure platform
              that promotes community, sustainability, and smart spending.
            </p>
          </CardContent>
        </Card>

        {/* Values Section */}
        <div className="mb-12">
          <h2 className="font-heading text-3xl font-bold text-[hsl(var(--usc-cardinal))] mb-8 text-center">
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-[hsl(var(--usc-cardinal))]/10 flex items-center justify-center flex-shrink-0">
                  <Heart className="h-6 w-6 text-[hsl(var(--usc-cardinal))]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg mb-2 text-[hsl(var(--usc-cardinal))]">Trust</h3>
                  <p className="text-foreground">
                    Every user is verified. Every transaction is transparent. Building a marketplace
                    where Trojans can trade with confidence.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-[hsl(var(--usc-gold))]/20 flex items-center justify-center flex-shrink-0">
                  <Target className="h-6 w-6 text-[hsl(var(--usc-gold))]" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg mb-2 text-[hsl(var(--usc-cardinal))]">Simplicity</h3>
                  <p className="text-foreground">
                    Trading should be easy. Our platform removes the friction from buying and selling,
                    so you can focus on what matters.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg mb-2 text-[hsl(var(--usc-cardinal))]">Community</h3>
                  <p className="text-foreground">
                    More than a marketplace—we're strengthening connections within the Trojan Family,
                    one transaction at a time.
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-start gap-4">
                <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Leaf className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-heading font-bold text-lg mb-2 text-[hsl(var(--usc-cardinal))]">Sustainability</h3>
                  <p className="text-foreground">
                    Reusing and reselling reduces waste. Every secondhand purchase is a step toward
                    a more sustainable campus.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

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

export default AboutPage;
