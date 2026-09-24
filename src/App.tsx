import { Route, Routes } from "react-router-dom";
import "./App.css";

import AppLayout from "./components/AppLayout";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import ProductDetailsPage from "./pages/ProductDetailsPage/ProductDetailsPage";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";
import { CartProvider } from "./context/CartContext";

const App = () => {
  return (
    <CartProvider>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
      </Route>
    </Routes>

    </CartProvider>
  );
};

export default App;
