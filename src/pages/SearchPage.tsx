import { useSearchParams, Link } from 'react-router-dom';
import { MarketplaceHeader } from '@/components/MarketplaceHeader';
import { ListingCard } from '@/components/ListingCard';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useState, useEffect } from 'react';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        setSearchResults([]);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('status', 'published')
          .or(`title.ilike.%${query}%,description.ilike.%${query}%,category.ilike.%${query}%,location.ilike.%${query}%`)
          .order('created_at', { ascending: false });

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

          setSearchResults(listingsWithUsers);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error searching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSearchResults();
  }, [query]);

  return (
    <div className="min-h-screen bg-[hsl(var(--usc-beige))]">
      <MarketplaceHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link
            to="/"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-[hsl(var(--usc-cardinal))] transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>
        </div>

        {/* Search Results Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-heading font-bold text-[hsl(var(--usc-cardinal))] mb-2">
            Search Results
          </h1>
          <p className="text-lg text-muted-foreground">
            {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for "{query}"
          </p>
        </div>

        {/* Results Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--usc-cardinal))]" />
          </div>
        ) : searchResults.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {searchResults.map((listing, index) => (
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
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="max-w-md mx-auto">
              <h2 className="text-2xl font-heading font-bold mb-4">
                No results found
              </h2>
              <p className="text-muted-foreground mb-6">
                We couldn't find any listings matching "{query}". Try searching with different keywords or browse by category.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/">
                  <Button className="bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90">
                    Browse All Listings
                  </Button>
                </Link>
                <Link to="/category/game-day">
                  <Button variant="outline">
                    Browse Game Day
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Suggestions for empty results */}
        {searchResults.length === 0 && (
          <div className="mt-12">
            <h3 className="text-xl font-semibold mb-4 text-center">
              Try searching for:
            </h3>
            <div className="flex flex-wrap gap-2 justify-center">
              {['furniture', 'textbook', 'hoodie', 'ticket', 'rental', 'bike'].map((suggestion) => (
                <Link key={suggestion} to={`/search?q=${suggestion}`}>
                  <Button variant="outline" size="sm">
                    {suggestion}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default SearchPage;
