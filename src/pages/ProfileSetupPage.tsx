import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function ProfileSetupPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    full_name: "",
    role: "" as "Student" | "Alumni" | "Staff" | "",
  });

  useEffect(() => {
    if (!user) navigate("/login");
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name.trim() || !formData.role) {
      toast({ title: "Missing information", description: "Please complete all fields", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from("users")
        .update({
          full_name: formData.full_name.trim(),
          role: formData.role,
          updated_at: new Date().toISOString(),
        })
        .eq("id", user?.id);
      if (error) throw error;
      toast({ title: "Profile created", description: "Welcome to USC Marketplace!" });
      navigate("/profile");
    } catch (error) {
      console.error("Profile setup error:", error);
      toast({ title: "Setup failed", description: "Could not save your profile", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 md:p-8">
        <div className="text-center mb-6">
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Complete Your Profile</h1>
          <p className="text-muted-foreground">Let's set up your USC Marketplace profile</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="full_name">Full Name <span className="text-destructive">*</span></Label>
            <Input
              id="full_name"
              value={formData.full_name}
              onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="space-y-3">
            <Label>Role <span className="text-destructive">*</span></Label>
            <RadioGroup
              value={formData.role}
              onValueChange={(value) => setFormData({ ...formData, role: value as "Student" | "Alumni" | "Staff" })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Student" id="student" />
                <Label htmlFor="student" className="cursor-pointer font-normal">Student</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Alumni" id="alumni" />
                <Label htmlFor="alumni" className="cursor-pointer font-normal">Alumni</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Staff" id="staff" />
                <Label htmlFor="staff" className="cursor-pointer font-normal">Staff</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (<><Loader2 className="mr-2 h-4 w-4 animate-spin" />Saving...</>) : "Complete Profile"}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}