import { useState } from "react";
import { Link } from "react-router-dom";
import { MarketplaceHeader } from "@/components/MarketplaceHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Home, Mail, CheckCircle } from "lucide-react";

const ContactPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [topic, setTopic] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-[hsl(var(--usc-beige))]">
        <MarketplaceHeader />

        <div className="container mx-auto px-4 py-8 max-w-2xl">
          <Card className="text-center">
            <CardContent className="p-12">
              <CheckCircle className="h-20 w-20 text-green-600 mx-auto mb-6" />
              <h2 className="font-heading text-3xl font-bold text-[hsl(var(--usc-cardinal))] mb-4">
                Message Received!
              </h2>
              <p className="text-foreground mb-6">
                Thanks for reaching out. We will get back to you within 2 business days.
              </p>
              <div className="flex gap-4 justify-center">
                <Link to="/">
                  <Button variant="default">
                    <Home className="mr-2 h-4 w-4" />
                    Back to Home
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    setSubmitted(false);
                    setName("");
                    setEmail("");
                    setTopic("");
                    setMessage("");
                  }}
                >
                  Send Another Message
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--usc-beige))]">
      <MarketplaceHeader />

      <div className="container mx-auto px-4 py-8 max-w-2xl">
        {/* Breadcrumb */}
        <nav className="mb-6 text-sm text-muted-foreground flex items-center gap-2">
          <Link to="/" className="hover:text-primary flex items-center gap-1">
            <Home className="h-4 w-4" />
            Home
          </Link>
          <span>/</span>
          <span className="text-foreground">Contact Us</span>
        </nav>

        {/* Header */}
        <div className="mb-8 text-center">
          <Mail className="h-16 w-16 text-[hsl(var(--usc-cardinal))] mx-auto mb-4" />
          <h1 className="font-heading text-4xl font-bold text-[hsl(var(--usc-cardinal))] mb-2">
            Contact Us
          </h1>
          <p className="text-muted-foreground">We're here to help. Send us a message anytime.</p>
        </div>

        {/* Contact Form */}
        <Card>
          <CardContent className="p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Name *</label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">USC Email *</label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="yourname@usc.edu"
                  pattern=".*@usc\.edu$"
                  title="Please use your USC email address"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Topic *</label>
                <Select value={topic} onValueChange={setTopic} required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Bug Report</SelectItem>
                    <SelectItem value="safety">Safety Concern</SelectItem>
                    <SelectItem value="feature">Feature Request</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-foreground">Message *</label>
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  required
                  placeholder="Tell us more about your inquiry..."
                  className="min-h-40"
                />
              </div>

              <Button type="submit" size="lg" className="w-full">
                Send Message
              </Button>
            </form>

            {/* Email Link */}
            <div className="mt-8 pt-8 border-t text-center">
              <p className="text-sm text-muted-foreground mb-2">Or email us directly:</p>
              <a
                href="mailto:support@trojantrade.app"
                className="text-[hsl(var(--usc-cardinal))] hover:text-[hsl(var(--usc-gold))] font-medium"
              >
                support@trojantrade.app
              </a>
            </div>
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

export default ContactPage;
