import { useState, useEffect } from 'react';
import { MarketplaceHeader } from '@/components/MarketplaceHeader';
import { ListingCard } from '@/components/ListingCard';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchListings = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(12);
        
        if (error) throw error;
        setListings(data || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  const categories = [
    { name: 'Game Day', path: '/category/game-day', icon: '🏈' },
    { name: 'Merchandise', path: '/category/merchandise', icon: '🎽' },
    { name: 'Rentals', path: '/category/rentals', icon: '🏠' },
    { name: 'Furniture', path: '/category/furniture', icon: '🪑' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-5xl font-bold text-primary mb-4">Trojan Trade</h1>
          <p className="text-xl text-muted-foreground mb-8">USC's Premier Student Marketplace</p>
          <div className="flex gap-4 justify-center">
            <Button size="lg" onClick={() => navigate('/search')}>
              Browse Listings
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate('/post-ad')}>
              Post an Ad
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-primary mb-6">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Button
              key={category.path}
              variant="outline"
              className="h-24 text-lg"
              onClick={() => navigate(category.path)}
            >
              <span className="mr-2 text-2xl">{category.icon}</span>
              {category.name}
            </Button>
          ))}
        </div>
      </section>

      {/* Recent Listings */}
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-3xl font-bold text-primary mb-6">Recent Listings</h2>
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No listings yet. Be the first to post!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Index;
