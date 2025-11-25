import { Link } from "react-router-dom";
import { MarketplaceHeader } from "@/components/MarketplaceHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, BookOpen, AlertCircle } from "lucide-react";

const GuidelinesPage = () => {
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
          <span className="text-foreground">Community Guidelines</span>
        </nav>

        {/* Header */}
        <div className="mb-8 text-center">
          <BookOpen className="h-16 w-16 text-[hsl(var(--usc-cardinal))] mx-auto mb-4" />
          <h1 className="font-heading text-4xl font-bold text-[hsl(var(--usc-cardinal))] mb-2">
            Community Guidelines
          </h1>
          <p className="text-muted-foreground">Building a trusted marketplace for the Trojan Family</p>
        </div>

        {/* Guidelines Sections */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))]">Eligibility</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                Trojan Trade is exclusively for current USC students with active @usc.edu email addresses.
                By signing up, you verify that you are a currently enrolled student at the University of Southern California.
                Accounts may be suspended if eligibility cannot be verified.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))]">Respectful Conduct</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                We maintain a zero-tolerance policy for harassment, discrimination, hate speech, or threatening behavior.
                All users must treat each other with respect and courtesy. Violations will result in immediate account suspension
                and may be reported to USC authorities. Be professional, kind, and considerate in all communications.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))]">Prohibited Items</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground mb-4">
                The following items are strictly prohibited from being listed or sold:
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span>Alcohol, tobacco, vapes, or any controlled substances</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span>Weapons, explosives, or dangerous materials</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span>Counterfeit, stolen, or illegal goods</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span>Prescription medications or medical devices</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span>Services that violate USC policies or local laws</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))]">Event Tickets</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                When selling or transferring event tickets (especially USC athletic events), use official transfer methods
                when required by the venue or ticket issuer. Scalping or reselling tickets above face value may violate
                USC policies and local laws. Always follow the terms and conditions of the original ticket purchase.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))]">Academic Integrity</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-foreground">
                The sale or exchange of graded coursework, exam materials, completed assignments, or any academic work
                intended to be submitted for credit is strictly prohibited. This violates USC's Student Conduct Code
                and academic integrity policies. Textbooks, study guides, and unstudied materials are permitted.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6 flex items-start gap-3">
              <AlertCircle className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <p className="text-sm text-blue-900">
                  <strong>Important Notice:</strong> This page provides guidance for using Trojan Trade.
                  All users must also follow USC's Student Conduct Code, university policies, and local, state,
                  and federal laws. When in doubt, don't list it.
                </p>
              </div>
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

export default GuidelinesPage;
