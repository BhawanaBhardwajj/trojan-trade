import { useState, useRef, useCallback, useEffect } from "react";
import { MarketplaceHeader } from "@/components/MarketplaceHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, ArrowLeft, MapPin, DollarSign, X, Upload, AlertCircle, Loader2 } from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import {
  listingSchema,
  LISTING_CONDITIONS,
  CATEGORY_STRUCTURE,
  SIZE_OPTIONS,
} from "@/lib/listing-schema";
import { compressImage, validateImageFile } from "@/lib/image-utils";
import { z } from "zod";

interface PhotoUpload {
  id: string;
  file?: File;
  preview: string;
  uploading: boolean;
  progress: number;
  url?: string;
  error?: string;
}

const PostAdPage = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
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
    subcategory: "",
    size: "",
    condition: "",
    location: "",
    gameDate: "",
  });

  const [photos, setPhotos] = useState<PhotoUpload[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  // Check if user has profile photo
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

  // Load listing data if editing
  useEffect(() => {
    const loadListing = async () => {
      if (!editId || !user) return;

      try {
        const { data, error } = await supabase
          .from("listings")
          .select("*")
          .eq("id", editId)
          .eq("user_id", user.id)
          .single();

        if (error) throw error;

        if (data) {
          setFormData({
            title: data.title,
            category: data.category,
            subcategory: data.subcategory || "",
            size: data.size || "",
            condition: data.condition,
            price: data.price.toString(),
            description: data.description,
            location: data.location,
            gameDate: data.game_date || "",
          });

          // Load existing photos
          if (data.photos && data.photos.length > 0) {
            setPhotos(
              data.photos.map((url: string) => ({
                id: Math.random().toString(36).substring(7),
                preview: url,
                url,
                uploading: false,
                progress: 100,
              })),
            );
          }
        }
      } catch (error) {
        console.error("Error loading listing:", error);
        toast({
          title: "Error",
          description: "Failed to load listing data",
          variant: "destructive",
        });
      } finally {
        setIsLoadingData(false);
      }
    };

    loadListing();
  }, [editId, user, toast]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };

      // Reset subcategory and size when category changes
      if (field === "category") {
        newData.subcategory = "";
        newData.size = "";
      }

      return newData;
    });

    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = useCallback((): boolean => {
    try {
      const priceValue = formData.price ? parseFloat(formData.price) : 0;

      listingSchema.parse({
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory || undefined,
        size: formData.size || undefined,
        condition: formData.condition,
        price: priceValue,
        description: formData.description,
        location: formData.location,
        photos: photos.filter((p) => p.url).map((p) => p.url!),
        gameDate: formData.gameDate || undefined,
      });

      setErrors({});
      setApiError(null);
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          const path = err.path.join(".");
          newErrors[path] = err.message;
        });
        setErrors(newErrors);
      }
      return false;
    }
  }, [formData, photos]);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files) return;

    const fileArray = Array.from(files);

    if (photos.length + fileArray.length > 5) {
      toast({
        title: "Too many photos",
        description: "Maximum 5 photos allowed",
        variant: "destructive",
      });
      return;
    }

    for (const file of fileArray) {
      const validation = validateImageFile(file);
      if (!validation.valid) {
        toast({
          title: "Invalid file",
          description: validation.error,
          variant: "destructive",
        });
        continue;
      }

      const preview = URL.createObjectURL(file);
      const photoId = Math.random().toString(36).substring(7);

      const newPhoto: PhotoUpload = {
        id: photoId,
        file,
        preview,
        uploading: true,
        progress: 0,
      };

      setPhotos((prev) => [...prev, newPhoto]);

      try {
        const compressedBlob = await compressImage(file);
        const compressedFile = new File([compressedBlob], file.name, { type: "image/jpeg" });

        const fileName = `${user?.id}/${Date.now()}-${file.name}`;

        const { data, error } = await supabase.storage.from("listing-photos").upload(fileName, compressedFile, {
          cacheControl: "3600",
          upsert: false,
        });

        if (error) throw error;

        const {
          data: { publicUrl },
        } = supabase.storage.from("listing-photos").getPublicUrl(data.path);

        setPhotos((prev) =>
          prev.map((p) => (p.id === photoId ? { ...p, uploading: false, progress: 100, url: publicUrl } : p)),
        );
      } catch (error) {
        console.error("Upload error:", error);
        setPhotos((prev) =>
          prev.map((p) => (p.id === photoId ? { ...p, uploading: false, error: "Upload failed" } : p)),
        );
        toast({
          title: "Upload failed",
          description: "Failed to upload image. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  const removePhoto = (photoId: string) => {
    setPhotos((prev) => {
      const photo = prev.find((p) => p.id === photoId);
      if (photo && photo.file) {
        URL.revokeObjectURL(photo.preview);
      }
      return prev.filter((p) => p.id !== photoId);
    });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const handleSubmit = async (e: React.FormEvent, isDraft: boolean = false) => {
    e.preventDefault();
    setApiError(null);

    if (!isDraft && !validateForm()) {
      toast({
        title: "Validation failed",
        description: "Please fix the errors before submitting",
        variant: "destructive",
      });
      return;
    }

    if (photos.some((p) => p.uploading)) {
      toast({
        title: "Upload in progress",
        description: "Please wait for all photos to finish uploading",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const priceValue = formData.price ? parseFloat(formData.price) : 0;
      const photoUrls = photos.filter((p) => p.url).map((p) => p.url!);

      // Generate slug from title
      const slug = `${formData.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')}-${Date.now()}`;

      const listingData = {
        title: formData.title,
        category: formData.category,
        subcategory: formData.subcategory || null,
        size: formData.size || null,
        condition: formData.condition,
        price: priceValue,
        description: formData.description,
        location: formData.location,
        photos: photoUrls,
        status: isDraft ? "draft" : "published",
        game_date: formData.gameDate || null,
        slug: slug,
        user_id: user?.id,
      };

      if (editId) {
        const { error } = await supabase
          .from("listings")
          .update(listingData)
          .eq("id", editId);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("listings")
          .insert(listingData);

        if (error) throw error;
      }

      toast({
        title: isDraft ? "Draft saved" : editId ? "Listing updated" : "Ad posted",
        description: isDraft
          ? "Your listing has been saved as a draft"
          : editId
            ? "Your listing has been updated"
            : "Your listing is now live on Trojan Trade",
      });

      if (!isDraft) {
        setTimeout(() => {
          navigate(`/listing/${slug}`);
        }, 1500);
      } else {
        navigate("/my-listings");
      }
    } catch (error: any) {
      console.error("Submit error:", error);
      setApiError(error.message || "Failed to save listing. Please try again.");
      toast({
        title: "Error",
        description: error.message || "Failed to save listing",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    formData.title &&
    formData.category &&
    formData.condition &&
    formData.price &&
    formData.description &&
    formData.location &&
    photos.filter((p) => p.url).length >= 2;

  if (isLoadingData || checkingProfile) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <div className="flex justify-center items-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-[hsl(var(--usc-cardinal))]" />
        </div>
      </div>
    );
  }

  // Redirect to profile edit if no avatar
  if (!userProfile?.avatar_url) {
    return (
      <div className="min-h-screen bg-background">
        <MarketplaceHeader />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <Alert className="mb-6 border-[hsl(var(--usc-cardinal))] bg-[hsl(var(--usc-cardinal))]/5">
              <AlertCircle className="h-4 w-4 text-[hsl(var(--usc-cardinal))]" />
              <AlertDescription className="text-foreground">
                <strong className="font-semibold">Profile Photo Required</strong>
                <p className="mt-2">
                  To build trust within our Trojan community, you must add a profile photo before listing items.
                  This helps fellow USC students and alumni know who they're buying from.
                </p>
              </AlertDescription>
            </Alert>

            <Card className="p-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Add Your Profile Photo</h2>
              <p className="text-muted-foreground mb-6">
                A profile photo is mandatory to ensure a trustworthy marketplace for all Trojans.
                It only takes a minute to add one!
              </p>
              <div className="flex gap-4 justify-center">
                  <Button
                    onClick={() => navigate('/profile/edit')}
                    className="bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90"
                  >
                    Add Profile Photo
                  </Button>
                <Button
                  variant="outline"
                  onClick={() => navigate('/')}
                >
                  Go Back
                </Button>
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
        <Link
          to="/my-listings"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-6 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to My Listings
        </Link>

        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">{editId ? "Edit Your Listing" : "Post Your Ad"}</h1>
            <p className="text-muted-foreground">
              {editId ? "Update your listing details" : "Share what you're selling with fellow USC students"}
            </p>
          </div>

          {apiError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{apiError}</AlertDescription>
            </Alert>
          )}

          <Card className="p-6">
            <form onSubmit={(e) => handleSubmit(e, false)} className="space-y-6">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-sm font-medium">
                  Title <span className="text-destructive">*</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Mention Title of the Product e.g. tailgate tickets or essentials"
                  value={formData.title}
                  onChange={(e) => handleInputChange("title", e.target.value)}
                  className={errors.title ? "border-destructive" : ""}
                />
                {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                <p className="text-xs text-muted-foreground">{formData.title.length}/80 characters</p>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label htmlFor="category" className="text-sm font-medium">
                  Category <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange("category", value)}>
                  <SelectTrigger className={errors.category ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {Object.entries(CATEGORY_STRUCTURE).map(([key, value]) => (
                      <SelectItem key={key} value={key}>
                        {value.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.category && <p className="text-sm text-destructive">{errors.category}</p>}
              </div>

              {/* Subcategory - Always visible */}
              <div className="space-y-2">
                <Label htmlFor="subcategory" className="text-sm font-medium">
                  Subcategory <span className="text-destructive">*</span>
                </Label>
                <Select
                  value={formData.subcategory}
                  onValueChange={(value) => handleInputChange("subcategory", value)}
                  disabled={!formData.category}
                >
                  <SelectTrigger className={errors.subcategory ? "border-destructive" : ""}>
                    <SelectValue placeholder={formData.category ? "Select subcategory" : "Select category first"} />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {formData.category &&
                      CATEGORY_STRUCTURE[formData.category as keyof typeof CATEGORY_STRUCTURE]?.subcategories.map(
                        (sub) => (
                          <SelectItem key={sub.value} value={sub.value}>
                            {sub.label}
                          </SelectItem>
                        ),
                      )}
                  </SelectContent>
                </Select>
                {errors.subcategory && <p className="text-sm text-destructive">{errors.subcategory}</p>}
              </div>

              {/* Condition */}
              <div className="space-y-2">
                <Label htmlFor="condition" className="text-sm font-medium">
                  Condition <span className="text-destructive">*</span>
                </Label>
                <Select value={formData.condition} onValueChange={(value) => handleInputChange("condition", value)}>
                  <SelectTrigger className={errors.condition ? "border-destructive" : ""}>
                    <SelectValue placeholder="Select condition" />
                  </SelectTrigger>
                  <SelectContent className="bg-background z-50">
                    {LISTING_CONDITIONS.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.condition && <p className="text-sm text-destructive">{errors.condition}</p>}
              </div>

              {/* Size - Only for specific merchandise subcategories */}
              {formData.category === "merchandise" &&
                formData.subcategory &&
                CATEGORY_STRUCTURE["merchandise"].subcategories.find(
                  (sub) => sub.value === formData.subcategory && sub.requiresSize,
                ) && (
                  <div className="space-y-2">
                    <Label htmlFor="size" className="text-sm font-medium">
                      Size <span className="text-destructive">*</span>
                    </Label>
                    <Select value={formData.size} onValueChange={(value) => handleInputChange("size", value)}>
                      <SelectTrigger className={errors.size ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select size" />
                      </SelectTrigger>
                      <SelectContent className="bg-background z-50">
                        {SIZE_OPTIONS.map((size) => (
                          <SelectItem key={size.value} value={size.value}>
                            {size.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.size && <p className="text-sm text-destructive">{errors.size}</p>}
                  </div>
                )}

              {/* Game Date - Only for Tailgate Ticket subcategory */}
              {formData.category === "game-day" && formData.subcategory === "tailgate-ticket" && (
                <div className="space-y-2">
                  <Label htmlFor="gameDate" className="text-sm font-medium">
                    Game Date <span className="text-muted-foreground">(Optional but recommended)</span>
                  </Label>
                  <Input
                    id="gameDate"
                    type="date"
                    value={formData.gameDate}
                    onChange={(e) => handleInputChange("gameDate", e.target.value)}
                    min={new Date().toISOString().split("T")[0]}
                    className={errors.gameDate ? "border-destructive" : ""}
                  />
                  {errors.gameDate && <p className="text-sm text-destructive">{errors.gameDate}</p>}
                  <p className="text-xs text-muted-foreground">📅 Help buyers find tickets for specific games</p>
                </div>
              )}

              {/* Price */}
              <div className="space-y-2">
                <Label htmlFor="price" className="text-sm font-medium">
                  Price <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="0.00"
                    className={`pl-10 ${errors.price ? "border-destructive" : ""}`}
                    value={formData.price}
                    onChange={(e) => handleInputChange("price", e.target.value)}
                  />
                </div>
                {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  Description <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="description"
                  placeholder="Describe your item in detail. Include any defects, wear and tear, or special features..."
                  rows={4}
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className={errors.description ? "border-destructive" : ""}
                />
                {errors.description && <p className="text-sm text-destructive">{errors.description}</p>}
                <p className="text-xs text-muted-foreground">{formData.description.length}/1000 characters (min 40)</p>
              </div>

              {/* Location */}
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Location <span className="text-destructive">*</span>
                </Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                  <Input
                    id="location"
                    placeholder="USC Campus, Downtown LA"
                    className={`pl-10 ${errors.location ? "border-destructive" : ""}`}
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                  />
                </div>
                {errors.location && <p className="text-sm text-destructive">{errors.location}</p>}
              </div>

              {/* Photos */}
              <div className="space-y-4">
                <Label className="text-sm font-medium">
                  Photos <span className="text-destructive">* (Minimum 2)</span>
                </Label>
                <div
                  className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                    dragOver ? "border-primary bg-primary/5" : "border-border"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                >
                  <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                  <p className="mb-2 text-sm">Drag and drop photos here or</p>
                  <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>
                    <Camera className="h-4 w-4 mr-2" />
                    Choose Files
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    multiple
                    className="hidden"
                    onChange={(e) => handleFileSelect(e.target.files)}
                  />
                  <p className="text-xs text-muted-foreground mt-2">JPG, JPEG, PNG, WEBP (max 10MB each)</p>
                </div>

                {photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {photos.map((photo) => (
                      <div key={photo.id} className="relative group">
                        <div className="aspect-square rounded-lg overflow-hidden bg-muted">
                          <img src={photo.preview} alt="Preview" className="w-full h-full object-cover" />
                          {photo.uploading && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Loader2 className="h-6 w-6 text-white animate-spin" />
                            </div>
                          )}
                          {photo.error && (
                            <div className="absolute inset-0 bg-red-500/50 flex items-center justify-center">
                              <AlertCircle className="h-6 w-6 text-white" />
                            </div>
                          )}
                        </div>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(photo.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                {errors.photos && <p className="text-sm text-destructive">{errors.photos}</p>}
              </div>

              {/* Submit Buttons */}
              <div className="flex gap-4 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  className="flex-1"
                  onClick={(e) => handleSubmit(e as any, true)}
                  disabled={isSubmitting}
                >
                  Save as Draft
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90"
                  disabled={!isFormValid || isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {editId ? "Updating..." : "Posting..."}
                    </>
                  ) : editId ? (
                    "Update Listing"
                  ) : (
                    "Post Ad"
                  )}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PostAdPage;
