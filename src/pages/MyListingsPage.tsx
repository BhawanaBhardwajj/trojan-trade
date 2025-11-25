import { useState, useEffect } from 'react';
import { MarketplaceHeader } from '@/components/MarketplaceHeader';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

const MyListingsPage = () => {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchListings = async () => {
      if (!user) {
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setListings(data || []);
      } catch (error) {
        console.error('Error fetching listings:', error);
        toast.error('Failed to load your listings');
      } finally {
        setLoading(false);
      }
    };

    fetchListings();
  }, [user]);

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setListings(listings.filter(l => l.id !== id));
      toast.success('Listing deleted');
    } catch (error) {
      console.error('Error deleting listing:', error);
      toast.error('Failed to delete listing');
    }
  };

  const handleMarkAs = async (id: string, status: 'draft' | 'published' | 'sold') => {
    try {
      const { error } = await supabase
        .from('listings')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      setListings(listings.map(l => l.id === id ? { ...l, status } : l));

      const statusLabels = {
        published: 'active',
        sold: 'sold',
        draft: 'draft'
      };
      toast.success(`Marked as ${statusLabels[status]}`);
    } catch (error) {
      console.error('Error updating listing:', error);
      toast.error('Failed to update listing');
    }
  };

  const activeListings = listings.filter(l => l.status === 'published');
  const soldListings = listings.filter(l => l.status === 'sold');
  const draftListings = listings.filter(l => l.status === 'draft');

  return (
    <div className="min-h-screen bg-[hsl(var(--usc-beige))]">
      <MarketplaceHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-heading font-bold text-[hsl(var(--usc-cardinal))] mb-2">
              My Listings
            </h1>
            <p className="text-muted-foreground">
              Manage your items and track performance
            </p>
          </div>
          <Link to="/post-ad">
            <Button className="bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90">
              <Plus className="h-4 w-4 mr-2" />
              Create New Listing
            </Button>
          </Link>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="active" className="space-y-6">
          <TabsList className="bg-white">
            <TabsTrigger value="active">Active ({activeListings.length})</TabsTrigger>
            <TabsTrigger value="sold">Sold ({soldListings.length})</TabsTrigger>
            <TabsTrigger value="draft">Drafts ({draftListings.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="active" className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--usc-cardinal))]" />
              </div>
            ) : activeListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground mb-4">No active listings</p>
                  <Link to="/post-ad">
                    <Button className="bg-[hsl(var(--usc-cardinal))]">
                      Create Your First Listing
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              activeListings.map((listing) => (
                <Card key={listing.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <img
                        src={listing.photos[0] || ''}
                        alt={listing.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{listing.title}</h3>
                            <p className="text-2xl font-bold text-[hsl(var(--usc-cardinal))]">
                              ${listing.price}
                            </p>
                          </div>
                          <Badge className="bg-green-100 text-green-800 hover:bg-green-100">
                            Active
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                          <span>📍 {listing.location}</span>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/post-ad?edit=${listing.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAs(listing.id, 'sold')}
                            className="text-orange-600 hover:text-orange-700"
                          >
                            Mark as Sold
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(listing.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="sold" className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--usc-cardinal))]" />
              </div>
            ) : soldListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No sold listings yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Items marked as sold will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              soldListings.map((listing) => (
                <Card key={listing.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <img
                        src={listing.photos[0] || ''}
                        alt={listing.title}
                        className="w-32 h-32 object-cover rounded-lg grayscale"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{listing.title}</h3>
                            <p className="text-2xl font-bold text-muted-foreground">
                              ${listing.price}
                            </p>
                          </div>
                          <Badge className="bg-orange-100 text-orange-800 hover:bg-orange-100">
                            Sold ✓
                          </Badge>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                          <span>📍 {listing.location}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAs(listing.id, 'published')}
                          >
                            Re-list Item
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(listing.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="draft" className="space-y-4">
            {loading ? (
              <div className="flex justify-center items-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--usc-cardinal))]" />
              </div>
            ) : draftListings.length === 0 ? (
              <Card>
                <CardContent className="py-12 text-center">
                  <p className="text-muted-foreground">No draft listings</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Unpublished listings will appear here
                  </p>
                </CardContent>
              </Card>
            ) : (
              draftListings.map((listing) => (
                <Card key={listing.id} className="opacity-75">
                  <CardContent className="p-6">
                    <div className="flex gap-6">
                      <img
                        src={listing.photos[0] || ''}
                        alt={listing.title}
                        className="w-32 h-32 object-cover rounded-lg"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-3">
                          <div>
                            <h3 className="text-xl font-semibold mb-1">{listing.title}</h3>
                            <p className="text-2xl font-bold text-muted-foreground">
                              ${listing.price}
                            </p>
                          </div>
                          <Badge className="bg-gray-200 text-gray-800">Draft</Badge>
                        </div>
                        <div className="flex gap-4 text-sm text-muted-foreground mb-4">
                          <span>📍 {listing.location}</span>
                        </div>
                        <div className="flex gap-2">
                          <Link to={`/post-ad?edit=${listing.id}`}>
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-1" />
                              Continue Editing
                            </Button>
                          </Link>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleMarkAs(listing.id, 'published')}
                          >
                            Publish Item
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-red-600 hover:text-red-700"
                            onClick={() => handleDelete(listing.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default MyListingsPage;
