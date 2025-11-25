import { useState } from "react";
import { Link } from "react-router-dom";
import { MarketplaceHeader } from "@/components/MarketplaceHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Home, Shield } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const PrivacyPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleDeletionRequest = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Request Submitted",
      description: "We will process your data deletion request within 30 days.",
    });
    setShowModal(false);
    setEmail("");
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--usc-beige))]">
      <MarketplaceHeader />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-primary flex items-center gap-1">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Privacy Policy</span>
        </nav>

        {/* Header */}
        <div className="mb-8 text-center">
          <Shield className="h-16 w-16 text-[hsl(var(--usc-cardinal))] mx-auto mb-4" />
          <h1 className="font-heading text-4xl font-bold text-[hsl(var(--usc-cardinal))] mb-2">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground">Last updated: January 2025</p>
        </div>

        {/* Privacy Sections */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))]">Data We Collect</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-3">
                To provide and improve Trojan Trade, we collect the following information:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2 text-foreground">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span><strong>Account Information:</strong> Name, USC email address, profile photo, and verification status</span>
                </li>
                <li className="flex items-start gap-2 text-foreground">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span><strong>Listing Information:</strong> Item descriptions, photos, prices, and location preferences</span>
                </li>
                <li className="flex items-start gap-2 text-foreground">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span><strong>Communication Data:</strong> Messages sent through our in-app messaging system</span>
                </li>
                <li className="flex items-start gap-2 text-foreground">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span><strong>Usage Data:</strong> Log data, device information, and interaction with the platform</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))]">How We Use Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-3">
                Your data is used to:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2 text-foreground">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span>Verify your USC student status and maintain platform security</span>
                </li>
                <li className="flex items-start gap-2 text-foreground">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span>Facilitate communication between buyers and sellers</span>
                </li>
                <li className="flex items-start gap-2 text-foreground">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span>Display your listings and profile information to other verified users</span>
                </li>
                <li className="flex items-start gap-2 text-foreground">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span>Improve platform features and user experience</span>
                </li>
                <li className="flex items-start gap-2 text-foreground">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span>Send important updates about your account and transactions</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))]">How We Store Data</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                Your data is stored securely using industry-standard encryption and security practices. We use trusted
                third-party cloud services with SOC 2 compliance for data storage. Access to your data is restricted to
                authorized personnel only. We retain your data for as long as your account is active or as needed to
                provide services. Inactive accounts may be deleted after 12 months of inactivity with prior notice.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))]">Your Choices</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                You have control over your personal information. You can update your profile information at any time through
                your account settings. You may request to view, export, or delete your data by contacting us or using the
                data deletion request form below. You can delete your account permanently, which will remove your listings
                and profile from the platform. Some information may be retained for legal or security purposes even after
                account deletion.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))]">Contact</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">
                If you have questions about this Privacy Policy or how we handle your data, please contact us at{" "}
                <a
                  href="mailto:privacy@trojantrade.app"
                  className="text-[hsl(var(--usc-cardinal))] hover:text-[hsl(var(--usc-gold))] font-medium"
                >
                  privacy@trojantrade.app
                </a>
              </p>
              <Button onClick={() => setShowModal(true)} variant="outline">
                Request Data Deletion
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Data Deletion Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-[hsl(var(--usc-cardinal))]">
                Request Data Deletion
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleDeletionRequest} className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Enter your USC email address to request deletion of all your personal data.
                This action cannot be undone and will permanently delete your account.
              </p>
              <div>
                <label className="block text-sm font-medium mb-2">USC Email *</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="yourname@usc.edu"
                  pattern=".*@usc\.edu$"
                />
              </div>
              <Button type="submit" variant="destructive" className="w-full">
                Submit Deletion Request
              </Button>
            </form>
          </DialogContent>
        </Dialog>

        {/* Back to Home */}
        <div className="mt-8 text-center">
          <Link to="/">
            <Button variant="outline">
              <Home className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;
