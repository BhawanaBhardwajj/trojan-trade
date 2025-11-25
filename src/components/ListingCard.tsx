import { Card } from "./ui/card";
import { Link } from "react-router-dom";

export const ListingCard = ({ id, title, price, image }: any) => {
  return (
    <Link to={`/listing/${id}`}>
      <Card className="overflow-hidden">
        <img src={image} alt={title} className="w-full h-48 object-cover" />
        <div className="p-4">
          <h3 className="font-semibold mb-2">{title}</h3>
          <p className="text-xl font-bold text-[hsl(var(--usc-cardinal))]">{price}</p>
        </div>
      </Card>
    </Link>
  );
};
