import IconButton from "@mui/material/IconButton";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import type { CartItem } from "../../types/product";
import DeleteIcon from "@mui/icons-material/Delete";

type CartListProps = {
  items: CartItem[];
  onQuantityChange?: (id: string, change: number) => void;
  onRemove?: (id: string) => void;
};

function CartList({ items, onQuantityChange, onRemove }: CartListProps) {
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
          <div>
            <IconButton
              aria-label={`Decrease quantity of ${item.title}`}
              disabled={item.quantity <= 1}
              onClick={() => onQuantityChange?.(item.id, -1)}
            >
              <RemoveIcon />
            </IconButton>

            <span>{item.quantity}</span>

            <IconButton
              aria-label={`Increase quantity of ${item.title}`}
              onClick={() => onQuantityChange?.(item.id, 1)}
            >
              <AddIcon />
            </IconButton>
          </div>
          <p>
            Total: $
            {(
              (item.isOnSale && item.salePrice !== null
                ? item.salePrice
                : item.price) * item.quantity
            ).toFixed(2)}
          </p>
          <IconButton
            aria-label={`Remove ${item.title} from cart`}
            onClick={() => onRemove?.(item.id)}
          >
            <DeleteIcon />
          </IconButton>
        </li>
      ))}
    </ul>
  );
}

export default CartList;
