import ProductCard from "../components/ProductCard/ProductCard";
import type { Product } from "../types/product";

const testProduct: Product = {
  id: "duck-001",
  title: "Al Capone Duck",
  description: "Meet the boss of the bathtub.",
  price: 14.99,
  categories: ["onSale"],
  isOnSale: true,
  isLimitedEdition: false,
  salePrice: 9.99,
  images: {
    main: "/ducks/alcaponeduck.png",
    secondary: "/ducks/alcaponeduck2.png",
  },
  stock: 10,
  // rating: 4.5,
};

function ProductListPage() {
  return <ProductCard product={testProduct} />;
}

export default ProductListPage;
