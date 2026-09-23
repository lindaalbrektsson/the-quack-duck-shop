import { Route, Routes } from "react-router-dom";
import CustomerInfoForm from "./components/CustomerInfoForm/CustomerInfoForm";
import CheckoutPage from "./pages/CheckoutPage/Checkoutpage";

import "./App.css";
import AppLayout from "./components/AppLayout";
import ProductListPage from "./pages/ProductListPage/ProductListPage";
import ProductDetailsPage from "./pages/ProductDetailsPage/ProductDetailsPage";

const App = () => {
  return (
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
      </Route>
    </Routes>
  );
};

export default App;
