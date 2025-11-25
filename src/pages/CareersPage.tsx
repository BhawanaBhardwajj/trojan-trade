import { useState } from "react";
import { Link } from "react-router-dom";
import { MarketplaceHeader } from "@/components/MarketplaceHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Home, Briefcase, MapPin, Clock } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const CareersPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const { toast } = useToast();

  const handleApply = (role: string) => {
    setSelectedRole(role);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast({
      title: "Application Submitted",
      description: "Thank you for your interest! We'll review your application and get back to you soon.",
    });
    setShowModal(false);
    setName("");
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
          <span className="text-foreground">Careers</span>
        </nav>

        {/* Header */}
        <div className="mb-8 text-center">
          <Briefcase className="h-16 w-16 text-[hsl(var(--usc-cardinal))] mx-auto mb-4" />
          <h1 className="font-heading text-4xl font-bold text-[hsl(var(--usc-cardinal))] mb-2">
            Join Our Team
          </h1>
          <p className="text-muted-foreground text-lg">
            Help us build the future of student commerce at USC
          </p>
        </div>

        {/* Intro */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <p className="text-foreground text-center">
              We're looking for passionate USC students who want to make an impact on campus.
              Whether you're a designer, developer, marketer, or community builder, there's a place for you at Trojan Trade.
            </p>
          </CardContent>
        </Card>

        {/* Job Listings */}
        <div className="space-y-6 mb-12">
          <Card className="hover:shadow-[var(--shadow-card-hover)] transition-shadow">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))] text-2xl">Product Designer</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Part-time (10-15 hrs/week)
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  Remote / On-campus
                </span>
              </div>
              <p className="text-foreground mb-4">
                We're seeking a creative product designer to help shape the user experience of Trojan Trade.
                You'll work on UI/UX design, conduct user research, and collaborate with our development team
                to create intuitive features that serve the USC community.
              </p>
              <ul className="space-y-2 mb-6 ml-4">
                <li className="flex items-start gap-2 text-foreground">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span>Design and prototype new features in Figma</span>
                </li>
                <li className="flex items-start gap-2 text-foreground">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span>Conduct user interviews and usability testing</span>
                </li>
                <li className="flex items-start gap-2 text-foreground">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span>Maintain and evolve our design system</span>
                </li>
              </ul>
              <Button onClick={() => handleApply("Product Designer")}>
                Apply Now
              </Button>
            </CardContent>
          </Card>

          <Card className="hover:shadow-[var(--shadow-card-hover)] transition-shadow">
            <CardHeader>
              <CardTitle className="text-[hsl(var(--usc-cardinal))] text-2xl">Campus Ambassador</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4 mb-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <Clock className="h-4 w-4" />
                  Part-time (5-10 hrs/week)
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  On-campus
                </span>
              </div>
              <p className="text-foreground mb-4">
                Be the face of Trojan Trade on campus! As a Campus Ambassador, you'll spread the word about our platform,
                gather feedback from students, and help organize on-campus events. Perfect for outgoing students who
                love connecting with others.
              </p>
              <ul className="space-y-2 mb-6 ml-4">
                <li className="flex items-start gap-2 text-foreground">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span>Promote Trojan Trade at student events and organizations</span>
                </li>
                <li className="flex items-start gap-2 text-foreground">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span>Collect user feedback and feature requests</span>
                </li>
                <li className="flex items-start gap-2 text-foreground">
                  <span className="text-[hsl(var(--usc-gold))]">•</span>
                  <span>Create content for social media</span>
                </li>
              </ul>
              <Button onClick={() => handleApply("Campus Ambassador")}>
                Apply Now
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Application Modal */}
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-[hsl(var(--usc-cardinal))]">
                Apply for {selectedRole}
              </DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your full name"
                />
              </div>
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
              <div>
                <label className="block text-sm font-medium mb-2">Resume Upload (Mock)</label>
                <Input type="file" accept=".pdf,.doc,.docx" />
                <p className="text-xs text-muted-foreground mt-1">PDF, DOC, or DOCX only</p>
              </div>
              <Button type="submit" className="w-full">
                Submit Application
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

export default CareersPage;
