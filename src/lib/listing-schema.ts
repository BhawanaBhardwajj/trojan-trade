import { z } from "zod";

// Main categories with their subcategories
export const CATEGORY_STRUCTURE = {
  "game-day": {
    label: "Game Day",
    subcategories: [
      { value: "tailgate-ticket", label: "Tailgate Ticket" },
      { value: "tailgate-passes", label: "Tailgate Passes" },
      { value: "tailgate-gear", label: "Tailgate Gear" },
      { value: "tailgate-essentials", label: "Tailgate Essentials" },
    ],
    requiresSize: false,
  },
  "merchandise": {
    label: "Merchandise",
    subcategories: [
      { value: "t-shirt", label: "T-Shirt", requiresSize: true },
      { value: "hoodie", label: "Hoodie", requiresSize: true },
      { value: "cap", label: "Cap", requiresSize: false },
      { value: "club-apparel", label: "Club Apparel", requiresSize: true },
      { value: "accessories", label: "Accessories", requiresSize: false },
    ],
    requiresSize: false,
  },
  "essentials": {
    label: "Essentials",
    subcategories: [
      { value: "furniture", label: "Furniture" },
      { value: "books", label: "Books" },
      { value: "electronics", label: "Electronics" },
      { value: "kitchen-essentials", label: "Kitchen Essentials" },
      { value: "miscellaneous", label: "Miscellaneous" },
    ],
    requiresSize: false,
  },
  "rentals": {
    label: "Rentals",
    subcategories: [
      { value: "furniture-rental", label: "Furniture" },
      { value: "electronics-rental", label: "Electronics" },
      { value: "transportation", label: "Transportation" },
      { value: "event-equipment", label: "Event Equipment" },
      { value: "other-rental", label: "Other" },
    ],
    requiresSize: false,
  },
} as const;

// Legacy categories for backward compatibility
export const LISTING_CATEGORIES = [
  { value: "game-day", label: "Game Day" },
  { value: "merchandise", label: "Merchandise" },
  { value: "essentials", label: "Essentials" },
  { value: "furniture", label: "Furniture" },
  { value: "electronics", label: "Electronics" },
  { value: "textbooks", label: "Textbooks" },
  { value: "clothing", label: "Clothing" },
  { value: "kitchen", label: "Kitchen" },
  { value: "study-items", label: "Study Items" },
  { value: "rentals", label: "Rentals" },
  { value: "free", label: "Free" },
] as const;

// Size options for merchandise
export const SIZE_OPTIONS = [
  { value: "xs", label: "XS" },
  { value: "s", label: "S" },
  { value: "m", label: "M" },
  { value: "l", label: "L" },
  { value: "xl", label: "XL" },
  { value: "xxl", label: "XXL" },
] as const;

// Condition options
export const LISTING_CONDITIONS = [
  { value: "new", label: "New" },
  { value: "like-new", label: "Like New" },
  { value: "good", label: "Good" },
  { value: "fair", label: "Fair" },
] as const;

// Emoji detection regex
const EMOJI_REGEX = /[\p{Emoji_Presentation}\p{Extended_Pictographic}]/gu;

// Shared validation schema for both client and server
export const listingSchema = z.object({
  title: z
    .string()
    .min(10, "Title must be at least 10 characters")
    .max(80, "Title must be at most 80 characters")
    .transform((val) => val.trim())
    .refine((val) => !EMOJI_REGEX.test(val), "Title cannot contain emojis"),

  category: z.enum(
    LISTING_CATEGORIES.map((c) => c.value) as [string, ...string[]],
    { required_error: "Please select a category" }
  ),

  subcategory: z
    .string()
    .optional(),

  size: z
    .string()
    .optional(),

  condition: z.enum(
    LISTING_CONDITIONS.map((c) => c.value) as [string, ...string[]],
    { required_error: "Please select a condition" }
  ),

  price: z
    .number({ required_error: "Price is required" })
    .positive("Price must be greater than 0")
    .refine((val) => {
      return Number.isInteger(val * 100);
    }, "Price can have at most 2 decimal places"),

  description: z
    .string()
    .min(40, "Description must be at least 40 characters")
    .max(1000, "Description must be at most 1000 characters"),

  location: z
    .string()
    .min(1, "Location is required")
    .max(200, "Location must be at most 200 characters")
    .transform((val) => val.trim()),

  photos: z
    .array(z.string().url())
    .min(2, "At least 2 photos are required"),

  gameDate: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true;
      const date = new Date(val);
      return !isNaN(date.getTime());
    }, "Invalid date format")
    .refine((val) => {
      if (!val) return true;
      const gameDate = new Date(val);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      return gameDate >= today;
    }, "Game date must be today or in the future"),
}).refine(
  (data) => {
    if (data.category === "free") {
      return data.price === 0;
    }
    return data.price > 0;
  },
  {
    message: "Price must be $0.00 for free items or greater than $0.00 for other categories",
    path: ["price"],
  }
).refine(
  (data) => {
    const mainCategories = Object.keys(CATEGORY_STRUCTURE);
    if (mainCategories.includes(data.category)) {
      return !!data.subcategory;
    }
    return true;
  },
  {
    message: "Subcategory is required for this category",
    path: ["subcategory"],
  }
).refine(
  (data) => {
    if (data.category === "merchandise" && data.subcategory) {
      const subcategory = CATEGORY_STRUCTURE["merchandise"].subcategories.find(
        (sub) => sub.value === data.subcategory
      );
      if (subcategory && subcategory.requiresSize) {
        return !!data.size;
      }
    }
    return true;
  },
  {
    message: "Size is required for this item",
    path: ["size"],
  }
);

export type ListingFormData = z.infer<typeof listingSchema>;