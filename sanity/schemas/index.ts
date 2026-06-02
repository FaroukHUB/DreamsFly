import { homepage } from "./homepage";
import { product } from "./product";
import { siteSettings } from "./siteSettings";
import { category } from "./category";
import { guide } from "./guide";
import { author } from "./author";
import { review } from "./review";

export const schemaTypes = [
  // Singletons
  homepage,
  siteSettings,
  // Documents
  product,
  category,
  guide,
  author,
  review,
];
