import { useState, useEffect } from "react";
import { MarketplaceHeader } from "@/components/MarketplaceHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft, AlertCircle, Loader2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";

const PostAdPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get("edit");
  const [isLoadingData, setIsLoadingData] = useState(!!editId);
  const [userProfile, setUserProfile] = useState<{ avatar_url: string | null } | null>(null);
  const [checkingProfile, setCheckingProfile] = useState(true);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    category: "",
    condition: "",
    location: "",
  });

  useEffect(() => {
    const checkUserProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('users')
          .select('avatar_url')
          .eq('id', user.id)
          .single();
        if (error) throw error;
        setUserProfile(data);
      } catch (error) {
        console.error('Error checking profile:', error);
      } finally {
        setCheckingProfile(false);
      }
    };
    checkUserProfile();
  }, [user]);

  if (checkingProfile) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!userProfile?.avatar_url) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong className="font-semibold">Profile Photo Required</strong>
                <p className="mt-2">
                  To build trust, you must add a profile photo before listing items.
                </p>
              </AlertDescription>
            </Alert>
            <Card className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Add Your Profile Photo</h2>
              <p className="text-muted-foreground mb-6">
                A profile photo is mandatory to ensure a trustworthy marketplace.
              </p>
              <div className="flex gap-4 justify-center">
                <Button onClick={() => navigate('/profile/edit')}>Add Profile Photo</Button>
                <Button variant="outline" onClick={() => navigate('/')}>Go Back</Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <div className="container mx-auto px-4 py-8">
        <Link to="/my-listings" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6">
          <ArrowLeft className="h-4 w-4" />
          Back to My Listings
        </Link>
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Post Your Ad</h1>
            <p className="text-muted-foreground">Share what you're selling with fellow USC students</p>
          </div>
          <Card className="p-6">
            <form className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="title">Title <span className="text-destructive">*</span></Label>
                <Input
                  id="title"
                  placeholder="Title of the Product"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description <span className="text-destructive">*</span></Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price <span className="text-destructive">*</span></Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location <span className="text-destructive">*</span></Label>
                <Input
                  id="location"
                  placeholder="e.g., USC Village"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>
              <div className="flex gap-4">
                <Button type="submit" className="flex-1">Publish Listing</Button>
                <Button type="button" variant="outline">Save as Draft</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PostAdPage;