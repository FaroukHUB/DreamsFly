import { homepage } from "./homepage";
import { product } from "./product";
import { siteSettings } from "./siteSettings";
import { category } from "./category";
import { guide } from "./guide";
import { author } from "./author";
import { review } from "./review";
import { landingPage } from "./landingPage";
import { glossary } from "./glossary";
import { comparison } from "./comparison";
import { showroom } from "./showroom";
import { order } from "./order";

export const schemaTypes = [
  // Singletons
  homepage,
  siteSettings,
  // Documents principaux
  product,
  landingPage,
  guide,
  comparison,
  glossary,
  showroom,
  // Catégories legacy
  category,
  // E-E-A-T
  author,
  review,
  // E-commerce
  order,
];
