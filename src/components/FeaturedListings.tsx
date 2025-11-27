import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { ListingCard } from "./ListingCard";

export const FeaturedListings = () => {
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(8);

        if (error) throw error;

        // Fetch seller info for each listing
        if (data && data.length > 0) {
          const userIds = [...new Set(data.map(l => l.user_id))];
          const { data: users } = await supabase
            .from('users')
            .select('id, full_name, avatar_url, usc_verified')
            .in('id', userIds);

          // Merge user data with listings
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
      }
    };

    fetchListings();
  }, []);

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-4xl font-heading font-bold text-[hsl(var(--usc-cardinal))]">
            Recent Posts
          </h2>
          <Link to="/category/game-day">
            <Button variant="outline" className="border-[hsl(var(--usc-cardinal))] text-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))] hover:text-white">
              View All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {listings.map((listing, index) => (
            <div
              key={listing.id}
              className="animate-fade-in"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <ListingCard
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
                createdAt={listing.created_at}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
