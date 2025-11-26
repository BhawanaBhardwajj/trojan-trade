import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, User, Plus, MessageSquare, LogOut } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { supabase } from "@/integrations/supabase/client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import uscLogo from "@/assets/usc-logo.png";
import { USCVerificationBadge } from "./USCVerificationBadge";

const HeaderAvatar = () => {
  const { user } = useAuth();
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [uscVerified, setUscVerified] = useState<boolean>(false);

  useEffect(() => {
    const loadUserData = async () => {
      if (!user?.id) return;

      const { data } = await supabase
        .from('users')
        .select('avatar_url, full_name, usc_verified')
        .eq('id', user.id)
        .maybeSingle();

      if (data) {
        setAvatarUrl(data.avatar_url);
        setUserName(data.full_name || user.email?.split('@')[0] || 'User');
        setUscVerified(data.usc_verified || false);
      }
    };

    loadUserData();
  }, [user?.id, user?.email]);

  return (
    <>
      <Avatar className="h-8 w-8">
        <AvatarImage src={avatarUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} />
        <AvatarFallback>{userName?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
      </Avatar>
      <span className="hidden lg:inline">{userName}</span>
      <USCVerificationBadge verified={uscVerified} size="sm" showText={false} />
    </>
  );
};

export const MarketplaceHeader = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { user, logout, isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="bg-white border-b border-border sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between gap-4 mb-3">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
              <h1 className="text-2xl font-heading font-bold text-[hsl(var(--usc-cardinal))]">
                Trojan Trade
              </h1>
              <img src={uscLogo} alt="USC Logo" className="h-8 w-8" />
            </Link>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-xl mx-8 gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search by item or category..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button
              type="submit"
              className="bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90"
            >
              Search
            </Button>
          </form>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link to="/post-ad">
                  <Button className="bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90">
                    <Plus className="h-4 w-4 mr-1" />
                    Post Item
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="gap-2">
                      <HeaderAvatar />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer">
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/my-listings" className="cursor-pointer">
                        <Plus className="h-4 w-4 mr-2" />
                        My Listings
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/messages" className="cursor-pointer">
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Messages
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="cursor-pointer text-red-600">
                      <LogOut className="h-4 w-4 mr-2" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" size="sm">
                    Login
                  </Button>
                </Link>
                <Link to="/signup">
                  <Button
                    size="sm"
                    className="bg-[hsl(var(--usc-cardinal))] hover:bg-[hsl(var(--usc-cardinal))]/90"
                  >
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex items-center gap-6 border-t border-border pt-3">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors pb-1 ${
              isActive('/')
                ? 'text-[hsl(var(--usc-cardinal))] border-b-2 border-[hsl(var(--usc-cardinal))] font-bold'
                : 'text-muted-foreground hover:text-[hsl(var(--usc-cardinal))]'
            }`}
          >
            Home
          </Link>
          <Link
            to="/category/game-day"
            className={`text-sm font-medium transition-colors pb-1 ${
              isActive('/category/game-day')
                ? 'text-[hsl(var(--usc-cardinal))] border-b-2 border-[hsl(var(--usc-cardinal))] font-bold'
                : 'text-muted-foreground hover:text-[hsl(var(--usc-cardinal))]'
            }`}
          >
            Game Day
          </Link>
          <Link
            to="/category/merchandise"
            className={`text-sm font-medium transition-colors pb-1 ${
              isActive('/category/merchandise')
                ? 'text-[hsl(var(--usc-cardinal))] border-b-2 border-[hsl(var(--usc-cardinal))] font-bold'
                : 'text-muted-foreground hover:text-[hsl(var(--usc-cardinal))]'
            }`}
          >
            Merchandise
          </Link>
          <Link
            to="/category/essentials"
            className={`text-sm font-medium transition-colors pb-1 ${
              isActive('/category/essentials')
                ? 'text-[hsl(var(--usc-cardinal))] border-b-2 border-[hsl(var(--usc-cardinal))] font-bold'
                : 'text-muted-foreground hover:text-[hsl(var(--usc-cardinal))]'
            }`}
          >
            Essentials
          </Link>
          <Link
            to="/category/rentals"
            className={`text-sm font-medium transition-colors pb-1 ${
              isActive('/category/rentals')
                ? 'text-[hsl(var(--usc-cardinal))] border-b-2 border-[hsl(var(--usc-cardinal))] font-bold'
                : 'text-muted-foreground hover:text-[hsl(var(--usc-cardinal))]'
            }`}
          >
            Rentals
          </Link>
          {isAuthenticated && (
            <>
              <Link
                to="/my-listings"
                className={`text-sm font-medium transition-colors pb-1 ${
                  isActive('/my-listings')
                    ? 'text-[hsl(var(--usc-cardinal))] border-b-2 border-[hsl(var(--usc-cardinal))] font-bold'
                    : 'text-muted-foreground hover:text-[hsl(var(--usc-cardinal))]'
                }`}
              >
                My Listings
              </Link>
              <Link
                to="/messages"
                className={`text-sm font-medium transition-colors pb-1 ${
                  isActive('/messages')
                    ? 'text-[hsl(var(--usc-cardinal))] border-b-2 border-[hsl(var(--usc-cardinal))] font-bold'
                    : 'text-muted-foreground hover:text-[hsl(var(--usc-cardinal))]'
                }`}
              >
                Messages
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
