import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { MarketplaceHeader } from "@/components/MarketplaceHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { ArrowLeft, Loader2, Upload, X, User } from 'lucide-react';

const EditProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    full_name: '',
    role: '' as 'Student' | 'Alumni' | 'Staff' | '',
    bio: '',
    avatar_url: ''
  });
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('users')
          .select('full_name, role, bio, avatar_url')
          .eq('id', user.id)
          .maybeSingle();
        if (error) throw error;
        if (data) {
          setFormData({
            full_name: data.full_name || '',
            role: (data.role as 'Student' | 'Alumni' | 'Staff') || '',
            bio: data.bio || '',
            avatar_url: data.avatar_url || ''
          });
          if (data.avatar_url) setAvatarPreview(data.avatar_url);
        }
      } catch (error: any) {
        console.error('Error loading profile:', error);
        toast.error('Failed to load profile');
      } finally {
        setFetching(false);
      }
    };
    loadProfile();
  }, [user]);

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      // Delete old avatar if exists
      if (formData.avatar_url) {
        const oldPath = formData.avatar_url.split('/').pop();
        if (oldPath) {
          await supabase.storage
            .from('avatars')
            .remove([`${user?.id}/${oldPath}`]);
        }
      }

      // Upload new avatar
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData({ ...formData, avatar_url: publicUrl });
      setAvatarPreview(publicUrl);
      toast.success('Photo uploaded successfully');
    } catch (error: any) {
      console.error('Error uploading avatar:', error);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveAvatar = async () => {
    if (!formData.avatar_url) return;
    
    setUploading(true);
    try {
      const oldPath = formData.avatar_url.split('/').pop();
      if (oldPath) {
        await supabase.storage
          .from('avatars')
          .remove([`${user?.id}/${oldPath}`]);
      }
      setFormData({ ...formData, avatar_url: '' });
      setAvatarPreview(null);
      toast.success('Photo removed');
    } catch (error: any) {
      console.error('Error removing avatar:', error);
      toast.error('Failed to remove photo');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim() || !formData.role) {
      toast.error("Please complete all required fields");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({
          full_name: formData.full_name.trim(),
          role: formData.role,
          bio: formData.bio.trim(),
          avatar_url: formData.avatar_url,
          updated_at: new Date().toISOString()
        })
        .eq('id', user?.id);
      if (error) throw error;
      toast.success("Profile updated");
      navigate('/profile');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error("Could not save your profile");
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
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

  return (
    <div className="min-h-screen bg-background">
      <MarketplaceHeader />
      <main className="container mx-auto px-4 py-8 max-w-2xl">
        <Button variant="ghost" onClick={() => navigate('/profile')} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Profile
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Edit Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label>Profile Photo</Label>
                <div className="flex items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={avatarPreview || formData.avatar_url} />
                    <AvatarFallback className="bg-primary text-white text-2xl">
                      {formData.full_name?.[0]?.toUpperCase() || <User className="h-12 w-12" />}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-2">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAvatarClick}
                      disabled={uploading}
                    >
                      {uploading ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Uploading...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Upload Photo
                        </>
                      )}
                    </Button>
                    {formData.avatar_url && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={handleRemoveAvatar}
                        disabled={uploading}
                      >
                        <X className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                    )}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="full_name">Full Name <span className="text-destructive">*</span></Label>
                <Input
                  id="full_name"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  required
                  placeholder="John Doe"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role <span className="text-destructive">*</span></Label>
                <select
                  id="role"
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value as 'Student' | 'Alumni' | 'Staff' })}
                  className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select role</option>
                  <option value="Student">Student</option>
                  <option value="Alumni">Alumni</option>
                  <option value="Staff">Staff</option>
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="Tell us about yourself..."
                  rows={4}
                />
              </div>
              <div className="flex gap-4">
                <Button type="submit" disabled={loading} className="flex-1">
                  {loading ? (<><Loader2 className="h-4 w-4 mr-2 animate-spin" />Saving...</>) : 'Save Changes'}
                </Button>
                <Button type="button" variant="outline" onClick={() => navigate('/profile')} disabled={loading}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default EditProfilePage;