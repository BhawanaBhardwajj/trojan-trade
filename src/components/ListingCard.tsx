import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import { ShieldCheck, Calendar, MapPin } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { MessageDialog } from "./MessageDialog";
import { formatDistanceToNow } from "date-fns";

interface ListingCardProps {
  id: string;
  title: string;
  price: string;
  image: string;
  seller?: {
    name: string;
    verified: boolean;
    rating?: number;
    id: string;
    avatar?: string;
  };
  condition?: string;
  location?: string;
  category?: string;
  subcategory?: string;
  gameDate?: string;
  listingId?: string;
  sellerId?: string;
  createdAt?: string;
}

export const ListingCard = ({ 
  id, 
  title, 
  price, 
  image, 
  seller,
  condition,
  location,
  category,
  subcategory,
  gameDate,
  listingId,
  sellerId,
  createdAt,
}: ListingCardProps) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isOwner = sellerId && user?.id === sellerId;

  const formatDate = (date: string) => {
    try {
      return formatDistanceToNow(new Date(date), { addSuffix: true });
    } catch {
      return '';
    }
  };

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-xl hover:border-[hsl(var(--usc-cardinal)/0.3)] border-2">
      <Link to={`/listing/${id}`}>
        <div className="relative w-full h-52 bg-gradient-to-br from-muted/50 to-muted flex items-center justify-center overflow-hidden">
          <img 
            src={image} 
            alt={title} 
            className="w-full h-full object-contain p-3 transition-transform duration-300 group-hover:scale-105" 
          />
          {category && (
            <Badge 
              className="absolute top-3 left-3 bg-[hsl(var(--usc-cardinal))] text-white font-semibold shadow-lg"
            >
              {subcategory || category}
            </Badge>
          )}
          {createdAt && (
            <Badge 
              variant="secondary" 
              className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm shadow-lg flex items-center gap-1"
            >
              <Calendar className="h-3 w-3" />
              {formatDate(createdAt)}
            </Badge>
          )}
        </div>
        <div className="p-5 space-y-3">
          <h3 className="font-bold text-lg leading-tight line-clamp-2 group-hover:text-[hsl(var(--usc-cardinal))] transition-colors">
            {title}
          </h3>
          
          <div className="flex items-center justify-between">
            <p className="text-2xl font-bold text-[hsl(var(--usc-cardinal))]">{price}</p>
            {condition && (
              <Badge 
                variant="secondary" 
                className="bg-[hsl(var(--usc-gold)/0.2)] text-[hsl(var(--usc-gold))] border border-[hsl(var(--usc-gold)/0.3)] font-semibold"
              >
                {condition}
              </Badge>
            )}
          </div>

          {location && (
            <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{location}</span>
            </div>
          )}
        </div>
      </Link>
      {seller && (
        <div className="px-5 pb-3 border-t pt-3">
          <Link 
            to={`/u/${seller.id}`}
            onClick={(e) => e.stopPropagation()}
            className="group/seller"
          >
            <div className="flex items-center gap-2 text-sm">
              <span className="font-bold text-foreground group-hover/seller:text-[hsl(var(--usc-cardinal))] transition-colors">
                {seller.name}
              </span>
              {seller.verified && (
                <ShieldCheck className="h-4 w-4 text-[hsl(var(--usc-gold))] flex-shrink-0" />
              )}
            </div>
          </Link>
        </div>
      )}
      {listingId && sellerId && (
        <div className="px-5 pb-4" onClick={(e) => e.preventDefault()}>
          {isOwner ? (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/post-ad?edit=${listingId}`);
              }}
            >
              Edit Listing
            </Button>
          ) : isAuthenticated ? (
            <MessageDialog
              sellerId={sellerId}
              sellerName={seller?.name || 'Seller'}
              listingId={listingId}
              listingTitle={title}
            />
          ) : (
            <Button
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate("/login");
              }}
            >
              Message Seller
            </Button>
          )}
        </div>
      )}
    </Card>
  );
};
