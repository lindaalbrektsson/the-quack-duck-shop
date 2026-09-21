import Chip from "@mui/material/Chip";

import type { Category } from "../../types/product";

import "./CategoryBadges.css";

interface CategoryBadgesProps {
  categories: Category[];
}

const categoryLabels: Record<Category, string> = {
  onSale: "ON SALE",
  mostPopular: "MOST POPULAR",
  limitedEdition: "LIMITED EDITION",
};

const categoryColors: Record<Category, string> = {
  onSale: "var(--color-light-orange)",
  mostPopular: "var(--color-blue)",
  limitedEdition: "var(--color-lavender)",
};

function CategoryBadges({ categories }: CategoryBadgesProps) {
  return (
    <div className="category-badges">
      {categories.map((category) => (
        <Chip
          key={category}
          label={categoryLabels[category]}
          size="small"
          className="category-chip"
          sx={{ backgroundColor: categoryColors[category] }}
        />
      ))}
    </div>
  );
}

export default CategoryBadges;
