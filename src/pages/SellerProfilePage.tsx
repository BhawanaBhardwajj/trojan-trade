import { useParams, Link, useNavigate } from 'react-router-dom';
import { MarketplaceHeader } from '@/components/MarketplaceHeader';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { ListingCard } from '@/components/ListingCard';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ReviewDialog } from '@/components/ReviewDialog';
import { ReviewsList } from '@/components/ReviewsList';
import { ReviewsGivenList } from '@/components/ReviewsGivenList';
import { Separator } from '@/components/ui/separator';
import { MessageDialog } from '@/components/MessageDialog';

interface SellerData {
  id: string;
  full_name: string;
  avatar_url: string | null;
  bio: string | null;
  usc_verified: boolean;
}

const SellerProfilePage = () => {
  const { sellerId } = useParams<{ sellerId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [seller, setSeller] = useState<SellerData | null>(null);
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [reviewsRefresh, setReviewsRefresh] = useState(0);

  useEffect(() => {
    const fetchSellerData = async () => {
      if (!sellerId) {
        setLoading(false);
        return;
      }

      try {
        const { data: sellerData, error: sellerError } = await supabase
          .from('users')
          .select('id, full_name, avatar_url, bio, usc_verified')
          .eq('id', sellerId)
          .single();

        if (sellerError || !sellerData) {
          console.error('Error fetching seller:', sellerError);
          toast.error('Seller not found');
          setSeller(null);
        } else {
          setSeller(sellerData);

          const { data: listingsData, error: listingsError } = await supabase
            .from('listings')
            .select('*')
            .eq('user_id', sellerId)
            .eq('status', 'published')
            .order('created_at', { ascending: false });

          if (listingsError) {
            console.error('Error fetching listings:', listingsError);
          } else {
            setListings(listingsData || []);
          }
        }
      } catch (error) {
        console.error('Unexpected error:', error);
        toast.error('Failed to load seller profile');
      } finally {
        setLoading(false);
      }
    };

    fetchSellerData();
  }, [sellerId]);

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

  if (!seller) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <div className="container mx-auto px-4 py-12">
          <Card className="max-w-2xl mx-auto text-center p-8">
            <h1 className="text-3xl font-bold text-primary mb-4">Seller Not Found</h1>
            <p className="text-muted-foreground mb-6">This seller profile is unavailable.</p>
            <Link to="/">
              <Button>Back to Marketplace</Button>
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
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </button>
        </div>

        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <Avatar className="w-24 h-24">
                <AvatarImage src={seller.avatar_url || ''} />
                <AvatarFallback className="bg-primary/10 text-primary text-2xl">
                  {seller.full_name[0]}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <h1 className="text-3xl font-bold text-primary">{seller.full_name}</h1>
                  {seller.usc_verified && <Badge>Verified</Badge>}
                </div>
                <p className="text-muted-foreground mb-4">
                  {seller.usc_verified ? 'Verified USC Student' : 'USC Community Member'}
                </p>
                {seller.bio && <p className="text-foreground mb-4 whitespace-pre-wrap">{seller.bio}</p>}
                <div className="flex gap-3">
                  {user?.id !== sellerId && (
                    <>
                      <MessageDialog
                        sellerId={sellerId || ''}
                        sellerName={seller.full_name}
                        listingId=""
                        listingTitle={`Conversation with ${seller.full_name}`}
                        triggerButton={
                          <Button>
                            <MessageCircle className="h-4 w-4 mr-2" />
                            Contact Seller
                          </Button>
                        }
                      />
                      {user ? (
                        <ReviewDialog 
                          listingId="" 
                          sellerId={sellerId || ''} 
                          onReviewSubmitted={() => setReviewsRefresh(prev => prev + 1)}
                        />
                      ) : (
                        <Button variant="outline" onClick={() => navigate('/login')}>
                          Write a Review
                        </Button>
                      )}
                    </>
                  )}
                  {user?.id === sellerId && (
                    <Link to="/profile/edit">
                      <Button variant="outline">Edit Profile</Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {user?.id !== sellerId && (
          <Card className="mb-8">
            <CardContent className="p-6">
              <Tabs defaultValue="received" className="space-y-6">
                <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
                  <TabsTrigger 
                    value="received" 
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[hsl(var(--usc-cardinal))] data-[state=active]:bg-transparent"
                  >
                    Reviews Received
                  </TabsTrigger>
                  <TabsTrigger 
                    value="given"
                    className="rounded-none border-b-2 border-transparent data-[state=active]:border-[hsl(var(--usc-cardinal))] data-[state=active]:bg-transparent"
                  >
                    Reviews Given
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="received">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Reviews About {seller.full_name.split(' ')[0]}</h3>
                    <ReviewsList sellerId={sellerId || ''} refreshTrigger={reviewsRefresh} />
                  </div>
                </TabsContent>

                <TabsContent value="given">
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold">Reviews Written by {seller.full_name.split(' ')[0]}</h3>
                    <ReviewsGivenList reviewerId={sellerId || ''} />
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        )}

        <div>
          <h2 className="text-2xl font-bold mb-6">
            {user?.id === sellerId ? 'Your Active Listings' : `${seller.full_name.split(' ')[0]}'s Listings`} ({listings.length})
          </h2>
          {listings.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground">
                  {user?.id === sellerId
                    ? "You don't have any active listings yet."
                    : "This seller doesn't have any active listings."}
                </p>
                {user?.id === sellerId && (
                  <Link to="/post-ad">
                    <Button className="mt-4">Create Your First Listing</Button>
                  </Link>
                )}
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings.map((listing) => (
                <ListingCard
                  key={listing.id}
                  id={listing.slug}
                  title={listing.title}
                  price={`$${listing.price}`}
                  image={listing.photos[0] || '/placeholder.svg'}
                  seller={{
                    name: seller.full_name,
                    verified: seller.usc_verified,
                    rating: 5.0,
                    id: seller.id,
                    avatar: seller.avatar_url,
                  }}
                  condition={listing.condition}
                  location={listing.location}
                  category={listing.category}
                  subcategory={listing.subcategory}
                  gameDate={listing.game_date}
                  listingId={listing.id}
                  sellerId={seller.id}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default SellerProfilePage;