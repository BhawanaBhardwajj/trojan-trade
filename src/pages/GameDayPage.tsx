import { MarketplaceHeader } from "@/components/MarketplaceHeader";
import { ListingCard } from "@/components/ListingCard";
import { FilterBar, FilterState } from "@/components/FilterBar";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import heroGameDay from "@/assets/hero-game-day.jpg";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState, useMemo } from "react";
import { format } from "date-fns";

const GameDayPage = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({
    subcategory: "all",
    priceRange: "all",
    verifiedOnly: false,
    gameDate: "all"
  });

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('category', 'game-day')
          .eq('status', 'published')
          .order('game_date', { ascending: true, nullsFirst: false })
          .order('created_at', { ascending: false });
        if (error) throw error;
        if (data && data.length > 0) {
          const userIds = [...new Set(data.map(l => l.user_id))];
          const { data: users } = await supabase
            .from('users')
            .select('id, full_name, avatar_url, usc_verified')
            .in('id', userIds);
          const listingsWithUsers = data.map(listing => ({
            ...listing,
            users: users?.find(u => u.id === listing.user_id)
          }));
          setListings(listingsWithUsers);
        } else {
          setListings([]);
        }
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchListings();
  }, []);

  // Apply filters
  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      // Subcategory filter
      if (filters.subcategory !== "all" && listing.subcategory !== filters.subcategory) {
        return false;
      }

      // Price range filter
      if (filters.priceRange !== "all") {
        const price = listing.price;
        if (filters.priceRange === "0-50" && (price < 0 || price > 50)) return false;
        if (filters.priceRange === "50-100" && (price < 50 || price > 100)) return false;
        if (filters.priceRange === "100-200" && (price < 100 || price > 200)) return false;
        if (filters.priceRange === "200+" && price < 200) return false;
      }

      // Verified sellers only
      if (filters.verifiedOnly && !listing.users?.usc_verified) {
        return false;
      }

      // Game date filter
      if (filters.gameDate !== "all" && listing.game_date) {
        const gameDate = new Date(listing.game_date);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        if (filters.gameDate === "this-week") {
          const weekEnd = new Date(today);
          weekEnd.setDate(today.getDate() + 7);
          if (gameDate < today || gameDate > weekEnd) return false;
        } else if (filters.gameDate === "next-week") {
          const weekStart = new Date(today);
          weekStart.setDate(today.getDate() + 7);
          const weekEnd = new Date(today);
          weekEnd.setDate(today.getDate() + 14);
          if (gameDate < weekStart || gameDate > weekEnd) return false;
        } else if (filters.gameDate === "this-month") {
          const monthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);
          if (gameDate < today || gameDate > monthEnd) return false;
        }
      }

      return true;
    });
  }, [listings, filters]);

  return (
    <div className="min-h-screen bg-[hsl(var(--usc-beige))]">
      <MarketplaceHeader />

      {/* Hero Section */}
      <section className="relative h-[400px] overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroGameDay})` }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20"></div>
        </div>
        <div className="relative h-full flex items-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-5xl lg:text-6xl font-heading font-bold text-white mb-4 drop-shadow-2xl">
              Trojan Game Day Marketplace
            </h1>
            <p className="text-xl text-white/95 drop-shadow-lg max-w-2xl mx-auto">
              Buy and sell tickets, tailgate gear, and parking passes securely with verified USC students.
            </p>
          </div>
        </div>
      </section>

      <main className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-[hsl(var(--usc-cardinal))] transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Filters */}
        <FilterBar
          showVerifiedOnly
          showDateFilter
          categoryPage="game-day"
          onFilterChange={setFilters}
        />

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--usc-cardinal))]" />
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">
              {listings.length === 0
                ? "No game day listings yet. Be the first to post!"
                : "No listings match your filters. Try adjusting your search criteria."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {filteredListings.map((listing, index) => (
              <div key={listing.id} className="animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <ListingCard
                  id={listing.slug}
                  title={listing.title}
                  price={`$${listing.price}`}
                  image={listing.photos[0] || ''}
                  seller={{
                    name: listing.users?.full_name || 'USC Student',
                    verified: listing.users?.usc_verified || false,
                    rating: 5,
                    id: listing.user_id,
                    avatar: listing.users?.avatar_url,
                  }}
                  condition={listing.condition}
                  location={listing.location}
                  listingId={listing.id}
                  sellerId={listing.user_id}
                  category={listing.category}
                  subcategory={listing.subcategory}
                  gameDate={listing.game_date}
                />
              </div>
            ))}
          </div>
        )}

        {/* Trust Banner */}
        <div className="bg-white rounded-lg p-6 text-center shadow-sm border border-[hsl(var(--usc-gold))]/30">
          <p className="text-lg font-medium text-[#444]">
            💬 Every trade is Trojan verified — secure, simple, and school-spirited.
          </p>
        </div>
      </main>
    </div>
  );
};

export default GameDayPage;