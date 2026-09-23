import type { CartItem } from "../../types/product";

type CartListProps = {
  items: CartItem[];
};

function CartList({ items }: CartListProps) {
  return (
    <ul>
      {items.map((item) => (
        <li key={item.id}>
          <img src={item.images.main} alt={item.title} width={80} />
          <p>{item.title}</p>
          {/* Use the sale price when the product is on sale. */}
          <p>
            Price: $
            {(item.isOnSale && item.salePrice !== null
              ? item.salePrice
              : item.price
            ).toFixed(2)}
          </p>
          <p>Quantity: {item.quantity}</p>
          <p>
            Total: $
            {(
              (item.isOnSale && item.salePrice !== null
                ? item.salePrice
                : item.price) * item.quantity
            ).toFixed(2)}
          </p>
        </li>
      ))}
    </ul>
  );
}

export default CartList;
