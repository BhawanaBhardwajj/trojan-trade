import { Link } from "react-router-dom";
import { MarketplaceHeader } from "@/components/MarketplaceHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, FileText } from "lucide-react";

const TermsPage = () => {
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
          <span className="text-foreground">Terms of Service</span>
        </nav>

        {/* Header */}
        <div className="mb-8 text-center">
          <FileText className="h-16 w-16 text-[hsl(var(--usc-cardinal))] mx-auto mb-4" />
          <h1 className="font-heading text-4xl font-bold text-[hsl(var(--usc-cardinal))] mb-2">
            Terms of Service
          </h1>
          <p className="text-muted-foreground">Last updated: January 2025</p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))]">Using the Service</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                By accessing Trojan Trade, you agree to use the platform responsibly and in compliance with all applicable laws.
                You must be a currently enrolled USC student with an active @usc.edu email address. The service is provided
                "as is" for facilitating peer-to-peer transactions within the USC community. You are responsible for all
                activity under your account and must maintain the confidentiality of your login credentials.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))]">Account</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                You must provide accurate and complete information when creating your account. Your account is personal
                and may not be shared or transferred. We reserve the right to suspend or terminate accounts that violate
                these terms, engage in fraudulent activity, or are found to be inactive for extended periods. You may
                delete your account at any time through your profile settings.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))]">Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                When creating a listing, you must provide accurate descriptions, clear photos, and honest condition assessments.
                You are solely responsible for the content of your listings and must ensure that all items comply with our
                prohibited items policy and applicable laws. We reserve the right to remove listings that violate our terms
                or community guidelines without notice.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))]">Payments</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                Trojan Trade does not process payments or hold funds. All financial transactions occur directly between buyers
                and sellers. You are responsible for arranging payment methods and terms with your trading partner. We recommend
                using secure payment methods and meeting in person to inspect items before payment. We are not responsible for
                disputes, chargebacks, or fraudulent transactions between users.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))]">Prohibited Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                Users may not list or sell alcohol, tobacco, controlled substances, weapons, stolen goods, counterfeit items,
                or anything illegal under federal, state, or local law. Academic dishonesty materials, including completed
                assignments or exam answers, are strictly prohibited. Violations will result in immediate account suspension
                and may be reported to university authorities or law enforcement.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))]">Liability</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                Trojan Trade acts solely as a platform connecting buyers and sellers. We do not verify listings, inspect items,
                or guarantee transactions. You use the service at your own risk. We are not liable for disputes between users,
                item quality, safety issues, or any damages arising from transactions conducted through the platform. You agree
                to indemnify and hold harmless Trojan Trade from any claims arising from your use of the service.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))]">Changes</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                We reserve the right to modify these Terms of Service at any time. Changes will be posted on this page with
                an updated "Last updated" date. Continued use of the platform after changes constitutes acceptance of the
                new terms. We may also modify or discontinue features of the service without notice. If you do not agree
                to the changes, you must stop using the service.
              </p>
            </CardContent>
          </Card>
        </div>

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

export default TermsPage;
