import { useState } from "react";
import { Link } from "react-router-dom";
import { MarketplaceHeader } from "@/components/MarketplaceHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Shield, AlertTriangle, Home } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SafetyPage = () => {
  const [subject, setSubject] = useState("");
  const [details, setDetails] = useState("");
  const [itemLink, setItemLink] = useState("");
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Report Submitted",
      description: "Thank you for helping keep our community safe.",
    });
    setSubject("");
    setDetails("");
    setItemLink("");
    setShowForm(false);
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
          <span className="text-foreground">Safety Tips</span>
        </nav>

        {/* Header */}
        <div className="mb-8 text-center">
          <Shield className="h-16 w-16 text-[hsl(var(--usc-cardinal))] mx-auto mb-4" />
          <h1 className="font-heading text-4xl font-bold text-[hsl(var(--usc-cardinal))] mb-2">
            Safety Tips for Trading on Campus
          </h1>
          <p className="text-muted-foreground">Stay safe while buying and selling with fellow Trojans</p>
        </div>

        {/* Safety Tips */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-[hsl(var(--usc-gold))] flex-shrink-0" />
                <p className="text-foreground">
                  <strong>Meet in a public and well-lit place</strong> on or near campus, such as the library, student union, or busy dining areas.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-[hsl(var(--usc-gold))] flex-shrink-0" />
                <p className="text-foreground">
                  <strong>Tell a friend where you are meeting</strong> and share details about the transaction. Consider bringing someone with you.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-[hsl(var(--usc-gold))] flex-shrink-0" />
                <p className="text-foreground">
                  <strong>Check the seller's Verified USC badge and rating</strong> before committing to a purchase. Look for positive reviews.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-[hsl(var(--usc-gold))] flex-shrink-0" />
                <p className="text-foreground">
                  <strong>Inspect the item before paying.</strong> Make sure it matches the description and works as expected.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-[hsl(var(--usc-gold))] flex-shrink-0" />
                <p className="text-foreground">
                  <strong>Use in-app messaging</strong> and keep all communication within the app for your protection and records.
                </p>
              </li>
              <li className="flex items-start gap-3">
                <div className="mt-1 h-2 w-2 rounded-full bg-[hsl(var(--usc-gold))] flex-shrink-0" />
                <p className="text-foreground">
                  <strong>Report suspicious behavior</strong> immediately using the Report Listing button on any item page.
                </p>
              </li>
            </ul>
          </CardContent>
        </Card>

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

export default SafetyPage;
