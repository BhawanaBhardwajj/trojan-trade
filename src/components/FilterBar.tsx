import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { CATEGORY_STRUCTURE } from "@/lib/listing-schema";
import { useState } from "react";

interface FilterBarProps {
  showVerifiedOnly?: boolean;
  showSizeFilter?: boolean;
  showDateFilter?: boolean;
  showAvailabilityFilter?: boolean;
  defaultCategory?: string;
  categoryPage?: "game-day" | "merchandise" | "essentials" | "furniture" | "rentals";
  hideCategory?: boolean;
  onFilterChange?: (filters: FilterState) => void;
}

export interface FilterState {
  subcategory: string;
  priceRange: string;
  size?: string;
  verifiedOnly: boolean;
  gameDate?: string;
  availableOnly?: boolean;
}

export const FilterBar = ({
  showVerifiedOnly = false,
  showSizeFilter = false,
  showDateFilter = false,
  showAvailabilityFilter = false,
  defaultCategory = "all",
  categoryPage,
  hideCategory = false,
  onFilterChange
}: FilterBarProps) => {
  const [filters, setFilters] = useState<FilterState>({
    subcategory: "all",
    priceRange: "all",
    size: "all",
    verifiedOnly: false,
    gameDate: "all",
    availableOnly: showAvailabilityFilter,
  });

  // Get subcategories for the current category page
  const subcategories = categoryPage && CATEGORY_STRUCTURE[categoryPage as keyof typeof CATEGORY_STRUCTURE]
    ? CATEGORY_STRUCTURE[categoryPage as keyof typeof CATEGORY_STRUCTURE].subcategories
    : null;

  const updateFilter = (key: keyof FilterState, value: any) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const resetFilters = () => {
    const defaultFilters: FilterState = {
      subcategory: "all",
      priceRange: "all",
      size: "all",
      verifiedOnly: false,
      gameDate: "all",
      availableOnly: showAvailabilityFilter,
    };
    setFilters(defaultFilters);
    onFilterChange?.(defaultFilters);
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-border mb-6">
      <div className="flex flex-wrap items-center gap-4">
        {/* Show subcategories if on a category page, otherwise show main categories */}
        {!hideCategory && (
          <div className="flex-1 min-w-[200px]">
            <Label className="text-sm font-medium mb-2 block">
              {subcategories ? "Subcategory" : "Category"}
            </Label>
            <Select
              value={filters.subcategory}
              onValueChange={(value) => updateFilter("subcategory", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder={subcategories ? "All Items" : "All Categories"} />
              </SelectTrigger>
              <SelectContent>
                {subcategories ? (
                  <>
                    <SelectItem value="all">All Items</SelectItem>
                    {subcategories.map((sub) => (
                      <SelectItem key={sub.value} value={sub.value}>
                        {sub.label}
                      </SelectItem>
                    ))}
                  </>
                ) : (
                  <>
                    <SelectItem value="all">All Categories</SelectItem>
                    <SelectItem value="game-day">Game Day</SelectItem>
                    <SelectItem value="merchandise">Merchandise</SelectItem>
                    <SelectItem value="furniture">Furniture</SelectItem>
                    <SelectItem value="essentials">Essentials</SelectItem>
                    <SelectItem value="rentals">Rentals</SelectItem>
                  </>
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="flex-1 min-w-[200px]">
          <Label className="text-sm font-medium mb-2 block">Price Range</Label>
          <Select
            value={filters.priceRange}
            onValueChange={(value) => updateFilter("priceRange", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Any Price" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Any Price</SelectItem>
              <SelectItem value="0-50">$0 - $50</SelectItem>
              <SelectItem value="50-100">$50 - $100</SelectItem>
              <SelectItem value="100-200">$100 - $200</SelectItem>
              <SelectItem value="200+">$200+</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {showSizeFilter && (
          <div className="flex-1 min-w-[150px]">
            <Label className="text-sm font-medium mb-2 block">Size</Label>
            <Select
              value={filters.size}
              onValueChange={(value) => updateFilter("size", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Sizes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Sizes</SelectItem>
                <SelectItem value="xs">XS</SelectItem>
                <SelectItem value="s">S</SelectItem>
                <SelectItem value="m">M</SelectItem>
                <SelectItem value="l">L</SelectItem>
                <SelectItem value="xl">XL</SelectItem>
                <SelectItem value="xxl">XXL</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {showDateFilter && (
          <div className="flex-1 min-w-[200px]">
            <Label className="text-sm font-medium mb-2 block">Game Date</Label>
            <Select
              value={filters.gameDate}
              onValueChange={(value) => updateFilter("gameDate", value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="All Dates" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Dates</SelectItem>
                <SelectItem value="this-week">This Week</SelectItem>
                <SelectItem value="next-week">Next Week</SelectItem>
                <SelectItem value="this-month">This Month</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}

        {showVerifiedOnly && (
          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="verified"
              checked={filters.verifiedOnly}
              onCheckedChange={(checked) => updateFilter("verifiedOnly", checked)}
            />
            <Label htmlFor="verified" className="text-sm font-medium cursor-pointer">
              Verified Sellers Only
            </Label>
          </div>
        )}

        {showAvailabilityFilter && (
          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="available"
              checked={filters.availableOnly}
              onCheckedChange={(checked) => updateFilter("availableOnly", checked)}
            />
            <Label htmlFor="available" className="text-sm font-medium cursor-pointer">
              Show Only Available Now
            </Label>
          </div>
        )}

        <Button variant="outline" className="mt-6" onClick={resetFilters}>
          Reset Filters
        </Button>
      </div>
    </div>
  );
};
