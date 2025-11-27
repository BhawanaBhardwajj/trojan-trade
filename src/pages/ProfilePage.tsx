import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MarketplaceHeader } from "@/components/MarketplaceHeader";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Edit, Loader2, MapPin } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

const ProfilePage = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<any>(null);
  const [listings, setListings] = useState<any[]>([]);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    const loadProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        // If no profile exists, create one
        if (!data) {
          const { error: insertError } = await supabase
            .from('users')
            .insert({
              id: user.id,
              email: user.email!,
              full_name: user.user_metadata?.full_name || null,
            });
          
          if (insertError) throw insertError;
          navigate('/profile-setup');
          return;
        }
        
        if (!data.full_name) {
          navigate('/profile-setup');
          return;
        }
        setProfile(data);
        
        // Fetch user's listings
        const { data: listingsData } = await supabase
          .from('listings')
          .select('*')
          .eq('user_id', user.id)
          .eq('status', 'published')
          .order('created_at', { ascending: false })
          .limit(3);
        
        setListings(listingsData || []);
      } catch (error: any) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setLoading(false);
      }
    };
    loadProfile();
  }, [user, isAuthenticated, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <main className="container mx-auto px-4 py-8">
          <div className="flex justify-center items-center min-h-[400px]">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    );
  }

  const userInitials = profile?.full_name?.split(' ').map((n: string) => n[0]).join('').toUpperCase() || 'U';
  
  // Calculate profile completion
  const calculateCompletion = () => {
    const fields = [profile?.full_name, profile?.role, profile?.avatar_url, profile?.bio];
    const filledFields = fields.filter(Boolean).length;
    return Math.round((filledFields / fields.length) * 100);
  };
  
  const completionPercentage = calculateCompletion();
  const isProfileComplete = completionPercentage === 100;

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <main className="container mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-6">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start gap-8">
              {/* Avatar */}
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden bg-muted">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt={profile.full_name || 'Profile'} className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-muted-foreground text-4xl font-bold">{userInitials}</div>
                  )}
                </div>
              </div>
              
              {/* Profile Info */}
              <div className="flex-1 w-full">
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2 flex-wrap">
                      <h1 className="text-3xl font-bold">{profile?.full_name || 'Anonymous User'}</h1>
                      {!isProfileComplete && (
                        <Badge className="bg-[hsl(var(--usc-cardinal))] text-white hover:bg-[hsl(var(--usc-cardinal))]/90">
                          Complete Profile
                        </Badge>
                      )}
                    </div>
                    {profile?.role && (
                      <Badge className="bg-[hsl(var(--usc-gold))] text-black hover:bg-[hsl(var(--usc-gold))]/90 mb-3">
                        {profile.role}
                      </Badge>
                    )}
                    {profile?.bio && <p className="text-muted-foreground mt-2">{profile.bio}</p>}
                  </div>
                  <Button variant="outline" onClick={() => navigate('/profile/edit')}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
                
                {/* Profile Completion */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium">Profile Completion</span>
                    <span className="text-sm font-bold text-[hsl(var(--usc-cardinal))]">{completionPercentage}%</span>
                  </div>
                  <Progress value={completionPercentage} className="h-2" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="listings" className="space-y-6">
          <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
            <TabsTrigger 
              value="listings" 
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[hsl(var(--usc-cardinal))] data-[state=active]:bg-transparent"
            >
              My Listings
            </TabsTrigger>
            <TabsTrigger 
              value="rentals"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[hsl(var(--usc-cardinal))] data-[state=active]:bg-transparent"
            >
              My Rentals
            </TabsTrigger>
            <TabsTrigger 
              value="reviews"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[hsl(var(--usc-cardinal))] data-[state=active]:bg-transparent"
            >
              My Reviews
            </TabsTrigger>
            <TabsTrigger 
              value="settings"
              className="rounded-none border-b-2 border-transparent data-[state=active]:border-[hsl(var(--usc-cardinal))] data-[state=active]:bg-transparent"
            >
              Settings
            </TabsTrigger>
          </TabsList>

          {/* My Listings Tab */}
          <TabsContent value="listings" className="space-y-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">My Listings</h2>
                  <Link to="/my-listings" className="text-sm hover:underline">
                    View All ({listings.length})
                  </Link>
                </div>
                
                {listings.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground mb-4">You don't have any active listings yet.</p>
                    <Button onClick={() => navigate('/post-ad')} className="bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90">
                      Create Your First Listing
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {listings.map((listing) => (
                      <div key={listing.id} className="flex items-center gap-4 p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                        <img 
                          src={listing.photos?.[0] || '/placeholder.svg'} 
                          alt={listing.title}
                          className="w-20 h-20 object-cover rounded"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold mb-1">{listing.title}</h3>
                          <p className="text-[hsl(var(--usc-cardinal))] font-bold mb-1">${listing.price}</p>
                          <p className="text-sm text-muted-foreground">
                            <MapPin className="inline h-3 w-3 mr-1" />
                            {listing.location} • {listing.category}
                          </p>
                        </div>
                        <Badge className="bg-[hsl(var(--usc-cardinal))] text-white">Active</Badge>
                      </div>
                    ))}
                    
                    <Link to="/my-listings">
                      <Button variant="outline" className="w-full">
                        Manage All Listings →
                      </Button>
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Rentals Tab */}
          <TabsContent value="rentals">
            <Card>
              <CardContent className="p-6 text-center py-12">
                <p className="text-muted-foreground">No rental history yet.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Reviews Tab */}
          <TabsContent value="reviews">
            <Card>
              <CardContent className="p-6 text-center py-12">
                <p className="text-muted-foreground">No reviews yet.</p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <CardContent className="p-6 text-center py-12">
                <p className="text-muted-foreground">Settings coming soon.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default ProfilePage;