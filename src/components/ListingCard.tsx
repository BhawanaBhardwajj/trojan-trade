import { Card } from "./ui/card";
import { Link } from "react-router-dom";
import { Badge } from "./ui/badge";
import { ShieldCheck } from "lucide-react";

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
}: ListingCardProps) => {
  return (
    <Link to={`/listing/${id}`}>
      <Card className="overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
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
          {seller && (
            <div className="flex items-center gap-2 mt-2">
              <div className="text-sm text-muted-foreground flex items-center gap-1">
                {seller.name}
                {seller.verified && (
                  <ShieldCheck className="h-4 w-4 text-[hsl(var(--usc-gold))]" />
                )}
              </div>
            </div>
          )}
        </div>
      </Card>
    </Link>
  );
};
