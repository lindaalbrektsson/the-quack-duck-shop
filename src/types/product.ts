export type Category = "limitedEdition" | "mostPopular" | "onSale";

export interface Product {
    id: string;
    title: string;
    description: string;
    price: number;
    categories: Category[];
    isOnSale: boolean;
    isLimitedEdition: boolean;
    salePrice: number | null;
    images: {
        main: string;
        secondary: string;
    };
    stock: number;
    rating: number;
}