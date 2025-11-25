import { MarketplaceHeader } from "@/components/MarketplaceHeader";
import { ListingCard } from "@/components/ListingCard";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useEffect, useState } from "react";

const GameDayPage = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
        <h1 className="text-4xl font-bold mb-8">Game Day</h1>
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No game day listings yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <ListingCard
                key={listing.id}
                id={listing.slug}
                title={listing.title}
                price={`$${listing.price}`}
                image={listing.photos[0] || '/placeholder.svg'}
                seller={{
                  name: listing.users?.full_name || 'User',
                  verified: listing.users?.usc_verified || false,
                  rating: 5.0,
                  id: listing.user_id,
                  avatar: listing.users?.avatar_url,
                }}
                condition={listing.condition}
                location={listing.location}
                category={listing.category}
                subcategory={listing.subcategory}
                gameDate={listing.game_date}
                listingId={listing.id}
                sellerId={listing.user_id}
              />
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default GameDayPage;