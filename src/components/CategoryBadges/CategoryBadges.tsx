import Chip from "@mui/material/Chip";
import { Link } from "react-router-dom";

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
        <Link key={category} to={`/?category=${category}`}>
          <Chip
            label={categoryLabels[category]}
            size="small"
            className="category-chip"
            sx={{ backgroundColor: categoryColors[category] }}
          />
        </Link>
      ))}
    </div>
  );
}

export default CategoryBadges;
