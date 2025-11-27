import { useParams, Link, useNavigate } from 'react-router-dom';
import { MarketplaceHeader } from '@/components/MarketplaceHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Heart, Share2, MapPin, Clock, User, Phone, Mail, CalendarDays } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ListingCard } from '@/components/ListingCard';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { ReviewDialog } from '@/components/ReviewDialog';
import { ReviewsList } from '@/components/ReviewsList';

interface DatabaseListing {
  id: string;
  user_id: string;
  title: string;
  category: string;
  condition: string;
  price: number;
  description: string;
  location: string;
  contact_email: string | null;
  contact_phone: string | null;
  photos: string[];
  status: string;
  slug: string;
  created_at: string;
  updated_at: string;
  game_date: string | null;
}

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [dbListing, setDbListing] = useState<DatabaseListing | null>(null);
  const [loading, setLoading] = useState(true);
  const [sellerInfo, setSellerInfo] = useState<any>(null);
  const [similarListings, setSimilarListings] = useState<any[]>([]);
  const [hasMessagedSeller, setHasMessagedSeller] = useState(false);
  const [reviewsRefresh, setReviewsRefresh] = useState(0);

  useEffect(() => {
    const fetchListing = async () => {
      if (!id) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('slug', id)
          .eq('status', 'published')
          .single();

        if (error) {
          console.error('Error fetching listing:', error);
          setDbListing(null);
        } else {
          setDbListing(data);

          const { data: seller } = await supabase
            .from('users')
            .select('full_name, avatar_url, usc_verified')
            .eq('id', data.user_id)
            .single();

          setSellerInfo(seller);

          const { data: similar } = await supabase
            .from('listings')
            .select('*')
            .eq('category', data.category)
            .eq('status', 'published')
            .neq('id', data.id)
            .limit(4);

          if (similar && similar.length > 0) {
            const similarUserIds = [...new Set(similar.map(l => l.user_id))];
            const { data: similarUsers } = await supabase
              .from('users')
              .select('id, full_name, avatar_url, usc_verified')
              .in('id', similarUserIds);

            const similarWithUsers = similar.map(listing => ({
              ...listing,
              users: similarUsers?.find(u => u.id === listing.user_id)
            }));

            setSimilarListings(similarWithUsers);
          } else {
            setSimilarListings([]);
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const listing = dbListing ? {
    id: dbListing.id,
    title: dbListing.title,
    price: `$${dbListing.price.toFixed(2)}`,
    image: dbListing.photos[0] || '/placeholder.svg',
    location: dbListing.location,
    timeAgo: new Date(dbListing.created_at).toLocaleDateString(),
    condition: dbListing.condition,
    category: dbListing.category as any,
    seller: {
      name: sellerInfo?.full_name || 'User',
      rating: 5.0,
      reviews: 0,
      verified: sellerInfo?.usc_verified || false,
    },
    description: dbListing.description,
    features: [],
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <div className="container mx-auto px-4 py-12 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto text-center p-8">
            <h1 className="text-3xl font-bold text-primary mb-4">Listing Not Found</h1>
            <p className="text-muted-foreground mb-6">
              Sorry, we couldn't find that listing.
            </p>
            <Link to="/">
              <Button className="bg-primary hover:bg-primary/90">Back to Marketplace</Button>
            </Link>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />

      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
            <ArrowLeft className="h-4 w-4" />
            Back to Marketplace
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="aspect-square bg-muted rounded-lg flex items-center justify-center overflow-hidden">
              <img
                src={dbListing?.photos[0] || listing.image}
                alt={listing.title}
                className="w-full h-full object-cover"
              />
            </div>
            {dbListing && dbListing.photos.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {dbListing.photos.slice(1, 5).map((photo, index) => (
                  <div key={index} className="aspect-square bg-muted rounded-lg overflow-hidden cursor-pointer">
                    <img src={photo} alt={`${listing.title} ${index + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-2">
                <h1 className="text-3xl font-bold text-primary">{listing.title}</h1>
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon" onClick={() => setIsFavorite(!isFavorite)}>
                    <Heart className={`h-5 w-5 ${isFavorite ? 'fill-primary text-primary' : ''}`} />
                  </Button>
                  <Button variant="ghost" size="icon">
                    <Share2 className="h-5 w-5" />
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-bold text-primary">{listing.price}</span>
                <Badge variant="secondary">{listing.condition}</Badge>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {listing.location}
                </div>
                <div className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  {listing.timeAgo}
                </div>
              </div>
            </div>

            <Separator />

            {dbListing?.category === 'game-day' && dbListing.game_date && (
              <div className="flex items-center gap-2 p-3 bg-primary/10 rounded-lg border border-primary/20">
                <CalendarDays className="h-5 w-5 text-primary" />
                <div>
                  <p className="text-sm font-medium">Game Date</p>
                  <p className="text-lg font-bold text-primary">
                    {format(new Date(dbListing.game_date), 'EEEE, MMMM d, yyyy')}
                  </p>
                </div>
              </div>
            )}

            <div>
              <h3 className="font-semibold mb-2 text-lg">Description</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">{listing.description}</p>
            </div>

            <Separator />

            <div className="space-y-3">
              {user?.id === dbListing?.user_id ? (
                <>
                  <Link to={`/post-ad?edit=${dbListing.id}`}>
                    <Button size="lg" variant="outline" className="w-full">Edit Listing</Button>
                  </Link>
                  <p className="text-sm text-muted-foreground text-center italic">This is your listing</p>
                </>
              ) : (
                <>
                  <Button 
                    size="lg" 
                    className="w-full"
                    onClick={() => {
                      if (!isAuthenticated) {
                        navigate('/login');
                      } else {
                        navigate('/messages', { state: { sellerId: dbListing?.user_id, listingId: dbListing?.id } });
                      }
                    }}
                  >
                    Message Seller
                  </Button>
                  {isAuthenticated && (
                    <ReviewDialog 
                      listingId={dbListing.id} 
                      sellerId={dbListing.user_id}
                      onReviewSubmitted={() => setReviewsRefresh(prev => prev + 1)}
                    />
                  )}
                  <Button variant="outline" size="lg" className="w-full">Report Listing</Button>
                </>
              )}
            </div>

            <Separator />

            <Card>
              <CardContent className="p-4">
                <Link to={`/u/${dbListing?.user_id}`} className="flex items-center gap-3 group">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center overflow-hidden">
                    {sellerInfo?.avatar_url ? (
                      <img src={sellerInfo.avatar_url} alt={listing.seller.name} className="w-full h-full object-cover" />
                    ) : (
                      <User className="h-6 w-6 text-primary" />
                    )}
                  </div>
                  <div className="flex-1">
                    <span className="font-semibold group-hover:text-primary transition-colors">{listing.seller.name}</span>
                    <p className="text-sm text-muted-foreground">
                      {listing.seller.verified ? 'Verified USC Student' : 'USC Community Member'}
                    </p>
                  </div>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>

        {dbListing && user?.id !== dbListing.user_id && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Reviews</h2>
            <ReviewsList sellerId={dbListing.user_id} refreshTrigger={reviewsRefresh} />
          </div>
        )}

        {similarListings.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Similar Listings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {similarListings.map((similar) => (
                <ListingCard
                  key={similar.id}
                  id={similar.slug}
                  title={similar.title}
                  price={`$${similar.price}`}
                  image={similar.photos[0] || '/placeholder.svg'}
                  seller={{
                    name: similar.users?.full_name || 'User',
                    verified: similar.users?.usc_verified || false,
                    rating: 5.0,
                    id: similar.user_id,
                    avatar: similar.users?.avatar_url,
                  }}
                  condition={similar.condition}
                  location={similar.location}
                  category={similar.category}
                  subcategory={similar.subcategory}
                  listingId={similar.id}
                  sellerId={similar.user_id}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default ProductPage;