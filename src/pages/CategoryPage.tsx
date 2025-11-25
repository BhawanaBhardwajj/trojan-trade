import { useParams, Link } from "react-router-dom";
import { MarketplaceHeader } from "@/components/MarketplaceHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Heart, MapPin, Clock, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useState, useEffect } from "react";

const CategoryPage = () => {
  const { category } = useParams<{ category: string }>();
  const categoryName = category?.charAt(0).toUpperCase() + category?.slice(1).replace(/-/g, ' ') || "";
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchListings = async () => {
      if (!category) return;

      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('category', category)
          .eq('status', 'published')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setListings(data || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [category]);

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />

      <main className="container mx-auto px-4 py-6">
        {/* Back Navigation */}
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>

        {/* Category Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">{categoryName}</h1>
          <p className="text-muted-foreground">{listings.length} items available</p>
        </div>

        {/* Filters */}
        <div className="mb-6 flex flex-wrap gap-2">
          <Button variant="outline" size="sm">Price: Low to High</Button>
          <Button variant="outline" size="sm">Condition</Button>
          <Button variant="outline" size="sm">Location</Button>
          <Button variant="outline" size="sm">Date Posted</Button>
        </div>

        {/* Listings Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--usc-cardinal))]" />
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-foreground mb-2">No items found</h3>
            <p className="text-muted-foreground">Be the first to list an item in this category!</p>
            <Link to="/post-ad">
              <Button className="mt-4">Post an Item</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <Link to={`/product/${listing.slug}`}>
                  <Card key={listing.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="aspect-square bg-muted rounded-t-lg flex items-center justify-center">
                      <img
                        src={listing.photos[0] || '/placeholder.svg'}
                        alt={listing.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                    </div>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-semibold text-foreground line-clamp-2">{listing.title}</h3>
                        <Button variant="ghost" size="icon" className="shrink-0">
                          <Heart className="h-4 w-4" />
                        </Button>
                      </div>
                      <p className="text-2xl font-bold text-primary mb-2">${listing.price}</p>
                      <Badge variant="secondary" className="mb-2">{listing.condition}</Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-1">
                        <MapPin className="h-3 w-3" />
                        {listing.location}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {new Date(listing.created_at).toLocaleDateString()}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default CategoryPage;
