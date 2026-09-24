import { Route, Routes } from "react-router-dom";
import CustomerInfoForm from "./components/CustomerInfoForm/CustomerInfoForm";
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage";

import ShippingForm from "./components/ShippingForm/ShippingForm";
import "./App.css";
import AppLayout from "./components/AppLayout";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import ProductDetailsPage from "./pages/ProductDetailsPage/ProductDetailsPage";
import { CartProvider } from "./context/CartContext";

const App = () => {
  return (
    <CartProvider>
    <Routes>
      <Route element={<AppLayout />}>
        <Route path="/" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage/>}/>
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route
          path="/customer-info"
          element={
            <CustomerInfoForm
              onContinue={(data) => console.log("Customer information:", data)}
            />
          }
        />

        <Route
          path="/shipping"
          element={
            <ShippingForm
              onContinue={(data) => console.log("Shipping information:", data)}
            />
          }
        />
      </Route>
    </Routes>

    </CartProvider>
  );
};

export default App;
