import type { CartItem } from "../../types/product";

type CartListProps = {
    items: CartItem[];
};

function CartList({ items }: CartListProps) {
    return (
        <ul>
            {items.map((item) => (
                <li key={item.id}>{item.title}</li>
            ))}
        </ul>
    );
}

export default CartList;