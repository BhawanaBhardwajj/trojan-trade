import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";
import gameDayImage from "@/assets/category-game-day.jpg";
import trojanMerchImage from "@/assets/category-trojan-merch.jpg";
import furnitureImage from "@/assets/category-furniture.jpg";
import rentalsImage from "@/assets/category-rentals.jpg";

const categories = [
  {
    name: "Game Day Exchange",
    image: gameDayImage,
    slug: "game-day",
    subtitle: "Tickets, Tailgate Passes & Gear"
  },
  {
    name: "Trojan Merch",
    image: trojanMerchImage,
    slug: "merchandise",
    subtitle: "USC Apparel & Club Merchandise"
  },
  {
    name: "Furniture & Essentials",
    image: furnitureImage,
    slug: "furniture",
    subtitle: "Dorm & Apartment Basics"
  },
  {
    name: "Rentals",
    image: rentalsImage,
    slug: "rentals",
    subtitle: "Share, Borrow, and Save on Campus"
  },
];

export const CategoryGrid = () => {
  return (
    <section className="pt-24 pb-16 bg-[hsl(var(--usc-beige))]">
      <div className="container mx-auto px-4">
        {/* Gold separator line */}
        <div className="w-24 h-0.5 bg-[hsl(var(--usc-gold))] mx-auto mb-6"></div>
        <h2 className="text-4xl font-heading font-semibold text-center mb-12 text-foreground">Explore Categories</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => {
            return (
              <Link key={category.slug} to={`/category/${category.slug}`}>
                <Card className="p-6 transition-all duration-300 hover:-translate-y-2 hover:shadow-[0_9px_28px_rgba(0,0,0,0.16)] cursor-pointer rounded-lg bg-card h-full shadow-[var(--shadow-card)] border-0">
                  <div className="flex flex-col items-center text-center">
                    <div className="mb-5 w-32 h-32 rounded-full overflow-hidden">
                      <img
                        src={category.image}
                        alt={category.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h3 className="text-xl font-heading font-semibold mb-2 text-[hsl(var(--usc-cardinal))]">{category.name}</h3>
                    <p className="text-sm text-[#444]">{category.subtitle}</p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};
