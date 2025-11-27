import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Badge } from "./ui/badge";
import { ShieldCheck } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
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
}: ListingCardProps) => {
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const isOwner = sellerId && user?.id === sellerId;

  return (
    <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <Link to={`/listing/${id}`}>
        <div className="w-full h-48 bg-muted flex items-center justify-center">
          <img src={image} alt={title} className="w-full h-full object-contain p-2" />
        </div>
        <div className="p-4">
          <h3 className="font-semibold mb-2 line-clamp-2">{title}</h3>
          <p className="text-xl font-bold text-[hsl(var(--usc-cardinal))] mb-2">{price}</p>
          {condition && (
            <Badge variant="secondary" className="mb-2">
              {condition}
            </Badge>
          )}
          {location && (
            <p className="text-sm text-muted-foreground mb-2">{location}</p>
          )}
        </div>
      </Link>
      {seller && (
        <div className="px-4 pb-3">
          <Link 
            to={`/u/${seller.id}`}
            onClick={(e) => e.stopPropagation()}
            className="group"
          >
            <div className="flex items-center gap-1 text-sm font-semibold text-foreground group-hover:text-primary transition-colors">
              {seller.name}
              {seller.verified && (
                <ShieldCheck className="h-4 w-4 text-[hsl(var(--usc-gold))]" />
              )}
            </div>
          </Link>
        </div>
      )}
      {listingId && sellerId && (
        <div className="px-4 pb-4">
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
          ) : (
            <Button
              size="sm"
              className="w-full"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (!isAuthenticated) {
                  navigate("/login");
                } else {
                  navigate("/messages", { state: { sellerId, listingId } });
                }
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
